// mandel-worker.js
self.Module = self.Module || {};
Module = self.Module;

importScripts('/mandel.js');

let initFB = null;
let getPtr = null;
let renderRows = null;
let wasmReady = false;

let fbW = 0;
let fbH = 0;
let fbView = null;

let currentJob = null;
let jobInProgress = false;
let cancelRequested = false;
let queuedJob = null;

const ROWS_PER_CHUNK = 256;

Module.onRuntimeInitialized = function () {
    initFB = Module.cwrap('init_framebuffer', null, ['number', 'number']);
    getPtr = Module.cwrap('get_framebuffer_ptr', 'number', []);

    // Try to get the chunked renderer
    renderRows = Module.cwrap('render_rows', null, [
        'number', // cx
        'number', // cy
        'number', // zoom
        'number', // scale
        'number', // yStart
        'number', // yEnd
    ]);

    // If that failed, fall back to full-frame render_frame
    if (typeof renderRows !== 'function') {
        console.warn('render_rows not exported, falling back to render_frame');

        const renderFrame = Module.cwrap('render_frame', null, [
            'number', // cx
            'number', // cy
            'number', // zoom
            'number', // scale
        ]);

        renderRows = function (cx, cy, zoom, scale, yStart, yEnd) {
            // ignore yStart/yEnd; no chunking/cancel, but no TypeError either
            renderFrame(cx, cy, zoom, scale);
        };
    }

    wasmReady = true;
    postMessage({ type: 'ready' });
};

function startJob(job) {
    currentJob = job;
    cancelRequested = false;
    jobInProgress = true;

    fbW = job.fbW;
    fbH = job.fbH;

    initFB(fbW, fbH);

    const fbPtr = getPtr();
    if (!Module.HEAPU8 || !Module.HEAPU8.buffer || !fbPtr) {
        postMessage({
            type: 'error',
            jobId: job.jobId,
            message: 'Framebuffer init failed',
        });
        jobInProgress = false;
        currentJob = null;
        return;
    }

    fbView = new Uint8ClampedArray(
        Module.HEAPU8.buffer,
        fbPtr,
        fbW * fbH * 4,
    );

    job._nextRow = 0;
    renderNextChunk();
}

function renderNextChunk() {
    if (!jobInProgress || !currentJob) return;

    if (cancelRequested) {
        const cancelledId = currentJob.jobId;
        jobInProgress = false;
        currentJob = null;

        if (queuedJob) {
            const next = queuedJob;
            queuedJob = null;
            startJob(next);
        }

        postMessage({ type: 'cancelled', jobId: cancelledId });
        return;
    }

    const job = currentJob;
    const startRow = job._nextRow;
    if (startRow >= fbH) {
        const gray = new Uint8Array(fbW * fbH);
        for (let i = 0, j = 0; i < gray.length; i++, j += 4) {
            gray[i] = fbView[j];
        }

        postMessage(
            {
                type: 'frame',
                jobId: job.jobId,
                fbW,
                fbH,
                gray,
                cx: job.cx,
                cy: job.cy,
                zoom: job.zoom,
                scale: job.scale,
            },
            [gray.buffer],
        );

        jobInProgress = false;
        currentJob = null;

        if (queuedJob) {
            const next = queuedJob;
            queuedJob = null;
            startJob(next);
        }
        return;
    }

    const endRow = Math.min(startRow + ROWS_PER_CHUNK, fbH);

    // This is the line that was throwing before; now renderRows is guaranteed
    // to be a function (either render_rows or a wrapper around render_frame).
    renderRows(
        job.cx,
        job.cy,
        job.zoom,
        job.scale,
        startRow,
        endRow,
    );

    job._nextRow = endRow;

    setTimeout(renderNextChunk, 0);
}

self.onmessage = function (e) {
    const msg = e.data;
    if (!wasmReady) return;

    if (msg.type === 'render') {
        const { jobId, fbW, fbH, cx, cy, zoom, scale } = msg;
        const job = { jobId, fbW, fbH, cx, cy, zoom, scale, _nextRow: 0 };

        if (!jobInProgress) {
            startJob(job);
        } else {
            cancelRequested = true;
            queuedJob = job;
        }
    } else if (msg.type === 'cancel') {
        const { jobId } = msg;
        if (jobInProgress && currentJob && currentJob.jobId === jobId) {
            cancelRequested = true;
        }
    }
};
