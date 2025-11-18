(function () {
    const canvas = document.getElementById("view");
    const ctx = canvas.getContext("2d");

    const controls = document.getElementById("controls");
    const controlsHeader = document.getElementById("controlsHeader");

    const fc = document.getElementById("fc");
    const bw = document.getElementById("bw");
    const statusEl = document.getElementById("status");
    const fillInside = document.getElementById("fillInside");
    const backLink = document.getElementById("backLink");

    fc.value = "#00ffff";

    // status state
    let statusRender = "WASM worker loading…";
    let statusCursor = "";
    let statusZoom = "";
    let statusError = "";

    function updateStatus() {
        const parts = [];
        if (statusRender) parts.push(statusRender);
        if (statusZoom) parts.push(statusZoom);
        if (statusError) parts.push(statusError);
        if (statusCursor) parts.push(statusCursor);
        statusEl.textContent = parts.join(" | ");
    }

    function setRenderStatus(msg) {
        statusRender = msg;
        updateStatus();
    }

    function setZoomStatus() {
        const effectiveZoom = zoom * (viewScale || 1);
        statusZoom = `zoom: ${effectiveZoom.toFixed(3)}x`;
        updateStatus();
    }

    function setCursorStatus(cx, cy) {
        if (cx == null || cy == null) {
            statusCursor = "";
            updateStatus();
            return;
        }
        const re = cx.toFixed(6);
        const imAbs = Math.abs(cy).toFixed(6);
        const sign = cy >= 0 ? "+" : "-";
        statusCursor = `cursor: ${re} ${sign} ${imAbs}i`;
        updateStatus();
    }

    function setErrorStatus(msg) {
        statusError = msg ? `error: ${msg}` : "";
        updateStatus();
    }

    // "base" world view parameters (for baseCanvas / last render)
    let centerX = -0.75;
    let centerY = 0.0;
    let zoom = 1.0;

    // fill option
    let fillInterior = fillInside.checked ? 1 : 0;

    // framebuffer / base image
    let fullW = 0;
    let fullH = 0;
    const baseCanvas = document.createElement("canvas");
    const baseCtx = baseCanvas.getContext("2d");
    let baseValid = false;

    const bufCanvas = document.createElement("canvas");
    const bufCtx = bufCanvas.getContext("2d");

    let lastGray = null;
    let lastFbW = 0;
    let lastFbH = 0;

    // screen transform (pan/zoom of base image)
    let viewScale = 1;
    let viewOffsetX = 0;
    let viewOffsetY = 0;

    // worker
    let worker = null;
    let workerReady = false;
    let nextJobId = 1;
    let currentJobId = null;
    let jobInFlight = false;

    const STAGES = [
        { scale: 4 },
        { scale: 1 },
        { scale: 0.25 },
    ];
    let currentStage = -1;
    let stagePending = false;

    // interaction throttling
    let interactionActive = false;
    let lastInteractionTime = 0;
    const INTERACTION_SETTLE_MS = 50;

    // pan state
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let panStartOffsetX = 0;
    let panStartOffsetY = 0;

    // controls drag
    let draggingControls = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // pinch-zoom
    const activePointers = new Map();
    let isPinching = false;
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    let pinchStartOffsetX = 0;
    let pinchStartOffsetY = 0;
    let pinchAnchorScreenX = 0;
    let pinchAnchorScreenY = 0;
    let pinchAnchorWorldX = 0;
    let pinchAnchorWorldY = 0;

    // cursor tracking – always live
    let cursorScreenX = null;
    let cursorScreenY = null;

    function hexToRgb(hex) {
        let h = hex.replace("#", "");
        if (h.length === 3) {
            h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        }
        const num = parseInt(h, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255,
        };
    }

    function getBandWidth() {
        const raw = parseInt(bw.value, 10) || 0;
        const sNorm = Math.min(1, Math.max(0, raw / 100));
        const sInv = 1 - sNorm;
        const minW = 0.2;
        const maxW = 5;
        return minW + sInv * (maxW - minW);
    }

    // world rect for a given center/zoom
    function worldParamsFor(cX, cY, z) {
        if (!fullW || !fullH) {
            return {
                worldWidth: 0,
                worldHeight: 0,
                worldX0: cX,
                worldY0: cY,
            };
        }

        const zSafe = z > 0 ? z : 1;
        const minDim = Math.min(fullW, fullH);
        const basePixelSize = 4.0 / minDim;
        const pixelSize = basePixelSize / zSafe;

        const worldWidth = pixelSize * fullW;
        const worldHeight = pixelSize * fullH;

        const worldX0 = cX - worldWidth / 2;
        const worldY0 = cY - worldHeight / 2;

        return { worldWidth, worldHeight, worldX0, worldY0 };
    }

    // screen -> world using base view + current transform
    function screenToWorld(sx, sy) {
        const { worldWidth, worldHeight, worldX0, worldY0 } = worldParamsFor(
            centerX,
            centerY,
            zoom,
        );
        if (!fullW || !fullH || !worldWidth || !worldHeight) {
            return { cx: centerX, cy: centerY };
        }

        const s = viewScale || 1;
        const baseX = (sx - viewOffsetX) / s;
        const baseY = (sy - viewOffsetY) / s;

        const u = baseX / fullW;
        const v = baseY / fullH;

        const cx = worldX0 + u * worldWidth;
        const cy = worldY0 + v * worldHeight;
        return { cx, cy };
    }

    // current visual view (center/zoom) from transform + base view
    function getCurrentView() {
        const effectiveZoom = zoom * (viewScale || 1);
        const baseParams = worldParamsFor(centerX, centerY, zoom);
        if (
            !fullW ||
            !fullH ||
            !baseParams.worldWidth ||
            !baseParams.worldHeight
        ) {
            return {
                cx: centerX,
                cy: centerY,
                zoom: effectiveZoom,
            };
        }

        const s = viewScale || 1;
        const baseXCenter = (fullW / 2 - viewOffsetX) / s;
        const baseYCenter = (fullH / 2 - viewOffsetY) / s;

        const u = baseXCenter / fullW;
        const v = baseYCenter / fullH;

        const cx = baseParams.worldX0 + u * baseParams.worldWidth;
        const cy = baseParams.worldY0 + v * baseParams.worldHeight;

        return { cx, cy, zoom: effectiveZoom };
    }

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const cssW = rect.width;
        const cssH = rect.height;

        const newW = Math.max(1, Math.floor(cssW));
        const newH = Math.max(1, Math.floor(cssH));

        canvas.width = newW;
        canvas.height = newH;

        fullW = newW;
        fullH = newH;

        baseCanvas.width = fullW;
        baseCanvas.height = fullH;
        baseValid = false;

        lastGray = null;

        if (workerReady) {
            requestFullRender();
        }
    }

    window.addEventListener("resize", () => {
        resize();
        markInteraction();
    });

    function markInteraction() {
        interactionActive = true;
        lastInteractionTime = performance.now();

        // stop current staged render; we will start a new one after settle
        stagePending = false;
        currentStage = -1;

        if (workerReady && currentJobId != null) {
            worker.postMessage({
                type: "cancel",
                jobId: currentJobId,
            });
        }
        currentJobId = null;
        jobInFlight = false;
    }

    function requestFullRender() {
        if (!workerReady) return;
        currentStage = 0;
        stagePending = true;
        setErrorStatus("");
    }

    // UPDATED: special-case interior (full white) when fill is enabled
    function colorizeGray(gray, w, h) {
        const N = gray.length;
        const out = new Uint8ClampedArray(N * 4);

        const color = hexToRgb(fc.value);
        const bandWidth = getBandWidth();

        let o = 0;
        for (let i = 0; i < N; i++) {
            const v = gray[i] | 0;
            const gNorm = v / 255;
            let r, g, b;

            if (gNorm <= 0) {
                r = g = b = 0;
            } else {
                let wVal;

                const isFilledInterior = fillInterior && v === 255;

                if (isFilledInterior) {
                    // interior pixels get full palette color, no dimming
                    wVal = 1;
                } else {
                    if (gNorm >= bandWidth) wVal = 1;
                    else wVal = gNorm / bandWidth;
                }

                r = color.r * wVal;
                g = color.g * wVal;
                b = color.b * wVal;
            }

            out[o++] = r;
            out[o++] = g;
            out[o++] = b;
            out[o++] = 255;
        }
        return out;
    }

    function redrawFromBase() {
        if (!baseValid) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, fullW, fullH);
        ctx.setTransform(viewScale, 0, 0, viewScale, viewOffsetX, viewOffsetY);
        ctx.drawImage(baseCanvas, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function recolorFromLastGray() {
        if (!lastGray || lastFbW <= 0 || lastFbH <= 0) return;

        const colored = colorizeGray(lastGray, lastFbW, lastFbH);

        bufCanvas.width = lastFbW;
        bufCanvas.height = lastFbH;
        const img = new ImageData(colored, lastFbW, lastFbH);
        bufCtx.putImageData(img, 0, 0);

        baseCtx.setTransform(1, 0, 0, 1, 0, 0);
        baseCtx.clearRect(0, 0, fullW, fullH);
        baseCtx.drawImage(
            bufCanvas,
            0,
            0,
            lastFbW,
            lastFbH,
            0,
            0,
            fullW,
            fullH,
        );
        baseValid = true;

        redrawFromBase();
    }

    function updatePaletteBorderColor() {
        controls.style.borderColor = fc.value;
        backLink.style.color = fc.value;
    }

    // pointer / touch for canvas
    canvas.addEventListener("pointerdown", (e) => {
        activePointers.set(e.pointerId, {
            x: e.clientX,
            y: e.clientY,
        });

        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        cursorScreenX = sx;
        cursorScreenY = sy;

        if (activePointers.size === 2) {
            // start pinch
            isPinching = true;
            isPanning = false;

            const pts = Array.from(activePointers.values());
            const dx = pts[0].x - pts[1].x;
            const dy = pts[0].y - pts[1].y;
            pinchStartDist = Math.hypot(dx, dy) || 1;
            pinchStartScale = viewScale;
            pinchStartOffsetX = viewOffsetX;
            pinchStartOffsetY = viewOffsetY;

            const rect2 = canvas.getBoundingClientRect();
            const sxMid = (pts[0].x + pts[1].x) / 2 - rect2.left;
            const syMid = (pts[0].y + pts[1].y) / 2 - rect2.top;
            pinchAnchorScreenX = sxMid;
            pinchAnchorScreenY = syMid;

            const world = screenToWorld(sxMid, syMid);
            pinchAnchorWorldX = world.cx;
            pinchAnchorWorldY = world.cy;

            markInteraction();
            return;
        }

        if (!isPinching && activePointers.size === 1) {
            isPanning = true;
            canvas.setPointerCapture(e.pointerId);
            panStartX = e.clientX;
            panStartY = e.clientY;
            panStartOffsetX = viewOffsetX;
            panStartOffsetY = viewOffsetY;
            markInteraction();
        }
    });

    canvas.addEventListener("pointermove", (e) => {
        // always keep cursor coords live
        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        cursorScreenX = sx;
        cursorScreenY = sy;

        if (!activePointers.has(e.pointerId)) {
            return;
        }
        activePointers.set(e.pointerId, {
            x: e.clientX,
            y: e.clientY,
        });

        if (isPinching && activePointers.size === 2) {
            const pts = Array.from(activePointers.values());
            const dx = pts[0].x - pts[1].x;
            const dy = pts[0].y - pts[1].y;
            const dist = Math.hypot(dx, dy) || 1;
            const zoomFactor = dist / pinchStartDist;

            const newScale = pinchStartScale * zoomFactor;
            viewScale = newScale;

            // keep anchor world point fixed under anchor screen pos
            const baseParams = worldParamsFor(centerX, centerY, zoom);
            const s = viewScale || 1;

            const uNorm =
                (pinchAnchorWorldX - baseParams.worldX0) /
                (baseParams.worldWidth || 1e-9);
            const vNorm =
                (pinchAnchorWorldY - baseParams.worldY0) /
                (baseParams.worldHeight || 1e-9);
            const baseX = uNorm * fullW;
            const baseY = vNorm * fullH;

            viewOffsetX = pinchAnchorScreenX - s * baseX;
            viewOffsetY = pinchAnchorScreenY - s * baseY;

            setZoomStatus();
            redrawFromBase();
            interactionActive = true;
            lastInteractionTime = performance.now();
            return;
        }

        if (!isPanning || isPinching) {
            return;
        }

        const dx = e.clientX - panStartX;
        const dy = e.clientY - panStartY;

        viewOffsetX = panStartOffsetX + dx;
        viewOffsetY = panStartOffsetY + dy;

        redrawFromBase();
        interactionActive = true;
        lastInteractionTime = performance.now();
    });

    canvas.addEventListener("pointerleave", () => {
        cursorScreenX = null;
        cursorScreenY = null;
        setCursorStatus(null, null);
    });

    function endPan(e) {
        if (activePointers.has(e.pointerId)) {
            activePointers.delete(e.pointerId);
        }

        if (isPinching && activePointers.size < 2) {
            isPinching = false;
        }

        if (!isPanning) return;
        isPanning = false;
        try {
            canvas.releasePointerCapture(e.pointerId);
        } catch (_) { }
        interactionActive = true;
        lastInteractionTime = performance.now();
    }

    canvas.addEventListener("pointerup", endPan);
    canvas.addEventListener("pointercancel", endPan);

    // wheel zoom
    canvas.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();

            const rect = canvas.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;

            cursorScreenX = sx;
            cursorScreenY = sy;

            // use OLD transform to find the world point under the cursor
            const oldScale = viewScale || 1;
            const worldBefore = screenToWorld(sx, sy);

            const delta = -e.deltaY;
            const zoomFactor = Math.exp(delta * 0.001);
            const newScale = oldScale * zoomFactor;

            // apply new scale
            viewScale = newScale;

            // keep that world point under the same screen coords
            const baseParams = worldParamsFor(centerX, centerY, zoom);
            const s = viewScale || 1;

            const uNorm =
                (worldBefore.cx - baseParams.worldX0) /
                (baseParams.worldWidth || 1e-9);
            const vNorm =
                (worldBefore.cy - baseParams.worldY0) /
                (baseParams.worldHeight || 1e-9);
            const baseX = uNorm * fullW;
            const baseY = vNorm * fullH;

            viewOffsetX = sx - s * baseX;
            viewOffsetY = sy - s * baseY;

            setZoomStatus();
            redrawFromBase();
            markInteraction();
        },
        { passive: false },
    );

    // palette controls
    fc.addEventListener("input", () => {
        updatePaletteBorderColor();
        recolorFromLastGray();
    });
    bw.addEventListener("input", () => {
        recolorFromLastGray();
    });

    fillInside.addEventListener("change", () => {
        fillInterior = fillInside.checked ? 1 : 0;

        if (workerReady && currentJobId != null) {
            worker.postMessage({
                type: "cancel",
                jobId: currentJobId,
            });
        }
        currentJobId = null;
        jobInFlight = false;
        currentStage = -1;
        stagePending = false;

        requestFullRender();
    });

    function startWorkerJob(stageIndex) {
        if (!workerReady) return;
        const stage = STAGES[stageIndex];
        const scale = stage.scale;

        const fbW = fullW;
        const fbH = fullH;
        if (!fbW || !fbH) return;

        const jobId = nextJobId++;
        currentJobId = jobId;
        jobInFlight = true;

        const view = getCurrentView();
        const fillSnap = fillInterior | 0;

        worker.postMessage({
            type: "render",
            jobId,
            fbW,
            fbH,
            cx: view.cx,
            cy: view.cy,
            zoom: view.zoom,
            scale,
            fillInterior: fillSnap,
        });

        setRenderStatus(
            `render: stage ${stageIndex + 1}/${STAGES.length} scale=${scale}`,
        );
    }

    // UPDATED: only draw scan lines for the last (finest) stage
    function handleWorkerScan(msg) {
        const { jobId, fbW, fbH, yStart, yEnd } = msg;
        if (currentJobId === null || jobId !== currentJobId) return;

        // only show scan bands on the final stage
        if (currentStage !== STAGES.length - 1) return;

        const numRows = yEnd - yStart;
        if (numRows <= 0) return;

        const destY = (yStart / fbH) * fullH;
        const destH = (numRows / fbH) * fullH;

        baseCtx.setTransform(1, 0, 0, 1, 0, 0);
        baseCtx.fillStyle = fc.value;
        baseCtx.fillRect(0, destY, fullW, destH);
        baseValid = true;

        redrawFromBase();
    }

    function handleWorkerPartial(msg) {
        const { jobId, fbW, fbH, gray, yStart, yEnd } = msg;

        if (currentJobId === null || jobId !== currentJobId) {
            return;
        }

        const numRows = yEnd - yStart;
        if (numRows <= 0) return;

        if (!lastGray || lastFbW !== fbW || lastFbH !== fbH) {
            lastGray = new Uint8Array(fbW * fbH);
            lastFbW = fbW;
            lastFbH = fbH;
        }

        for (let row = 0; row < numRows; row++) {
            const srcBase = row * fbW;
            const dstRow = yStart + row;
            const dstBase = dstRow * fbW;
            lastGray.set(gray.subarray(srcBase, srcBase + fbW), dstBase);
        }

        const coloredBand = colorizeGray(gray, fbW, numRows);

        bufCanvas.width = fbW;
        bufCanvas.height = numRows;
        const img = new ImageData(coloredBand, fbW, numRows);
        bufCtx.putImageData(img, 0, 0);

        const destY = (yStart / fbH) * fullH;
        const destH = (numRows / fbH) * fullH;

        baseCtx.setTransform(1, 0, 0, 1, 0, 0);
        baseCtx.drawImage(
            bufCanvas,
            0,
            0,
            fbW,
            numRows,
            0,
            destY,
            fullW,
            destH,
        );
        baseValid = true;

        redrawFromBase();
    }

    function handleWorkerFrame(msg) {
        const { jobId, fbW, fbH, gray } = msg;

        if (currentJobId === null || jobId !== currentJobId) {
            jobInFlight = false;
            return;
        }

        jobInFlight = false;

        lastGray = new Uint8Array(gray);
        lastFbW = fbW;
        lastFbH = fbH;

        const colored = colorizeGray(lastGray, fbW, fbH);

        bufCanvas.width = fbW;
        bufCanvas.height = fbH;
        const img = new ImageData(colored, fbW, fbH);
        bufCtx.putImageData(img, 0, 0);

        baseCtx.setTransform(1, 0, 0, 1, 0, 0);
        baseCtx.clearRect(0, 0, fullW, fullH);
        baseCtx.drawImage(
            bufCanvas,
            0,
            0,
            fbW,
            fbH,
            0,
            0,
            fullW,
            fullH,
        );
        baseValid = true;

        redrawFromBase();

        // fold current visual view into base center/zoom
        const view = getCurrentView();
        centerX = view.cx;
        centerY = view.cy;
        zoom = view.zoom;
        viewScale = 1;
        viewOffsetX = 0;
        viewOffsetY = 0;
        setZoomStatus();

        currentStage++;
        stagePending = currentStage < STAGES.length;
        if (!stagePending) {
            currentStage = -1;
            setRenderStatus("idle");
        } else {
            setRenderStatus(
                `render: stage ${currentStage + 1
                }/${STAGES.length} scale=${STAGES[currentStage].scale}`,
            );
        }
    }

    function loop() {
        const now = performance.now();

        // after interaction settles, start staged render for current visual view
        if (
            interactionActive &&
            !isPanning &&
            !isPinching &&
            now - lastInteractionTime > INTERACTION_SETTLE_MS &&
            currentStage === -1 &&
            workerReady
        ) {
            interactionActive = false;
            requestFullRender();
        }

        if (stagePending && !jobInFlight) {
            startWorkerJob(currentStage);
        }

        // cursor status always live
        if (cursorScreenX != null && cursorScreenY != null) {
            const world = screenToWorld(cursorScreenX, cursorScreenY);
            setCursorStatus(world.cx, world.cy);
        }

        requestAnimationFrame(loop);
    }

    function initWorker() {
        worker = new Worker("/mandelbrot/mandel-worker.js");
        worker.onmessage = (e) => {
            const msg = e.data;
            if (msg.type === "ready") {
                workerReady = true;
                setRenderStatus("worker ready");
                setErrorStatus("");
                requestFullRender();
                return;
            }
            if (msg.type === "scan") {
                handleWorkerScan(msg);
                return;
            }
            if (msg.type === "partial") {
                handleWorkerPartial(msg);
                return;
            }
            if (msg.type === "frame") {
                handleWorkerFrame(msg);
                return;
            }
            if (msg.type === "error") {
                setErrorStatus(msg.message || "worker error");
                return;
            }
        };
        worker.onerror = (err) => {
            setErrorStatus(err.message || "worker error");
        };
        worker.onmessageerror = () => {
            setErrorStatus("worker message error");
        };
    }

    // drag controls via header
    controlsHeader.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        draggingControls = true;
        controlsHeader.setPointerCapture(e.pointerId);
        const rect = controls.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
    });

    function endControlsDrag(e) {
        if (!draggingControls) return;
        draggingControls = false;
        try {
            controlsHeader.releasePointerCapture(e.pointerId);
        } catch (_) { }
    }

    window.addEventListener("pointermove", (e) => {
        if (!draggingControls) return;
        const x = e.clientX - dragOffsetX;
        const y = e.clientY - dragOffsetY;
        controls.style.left = x + "px";
        controls.style.top = y + "px";
    });

    controlsHeader.addEventListener("pointerup", endControlsDrag);
    controlsHeader.addEventListener("pointercancel", endControlsDrag);

    function init() {
        resize();
        updatePaletteBorderColor();
        setZoomStatus();
        updateStatus();
        initWorker();
        loop();
    }

    init();
})();
