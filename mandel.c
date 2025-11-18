// mandel.c
#include <math.h>
#include <stdint.h>
#include <stdlib.h>

static int fbW = 0;
static int fbH = 0;
static uint8_t *framebuffer = 0;

void init_framebuffer(int w, int h)
{
    if (w <= 0 || h <= 0)
        return;

    if (framebuffer)
    {
        free(framebuffer);
        framebuffer = 0;
    }
    fbW = w;
    fbH = h;
    framebuffer = (uint8_t *)malloc((size_t)fbW * (size_t)fbH * 4);
}

uint8_t *get_framebuffer_ptr(void)
{
    return framebuffer;
}

// Analytic interior: main cardioid + period-2 bulb
static int in_cardioid_or_bulb(double x, double y)
{
    double yabs = (y >= 0.0) ? y : -y;

    // period-2 bulb
    double dx2 = x + 1.0;
    double dy2 = yabs;
    if (dx2 * dx2 + dy2 * dy2 < 0.0625)
    {
        return 1;
    }

    // main cardioid
    double dx = x - 0.25;
    double q = dx * dx + yabs * yabs;
    return q * (q + dx) < 0.25 * yabs * yabs;
}

// Core iteration with symmetry + smooth coloring
static double mandel(double cx, double cy, int maxIter)
{
    double ay = (cy >= 0.0) ? cy : -cy;

    if (in_cardioid_or_bulb(cx, ay))
    {
        return maxIter;
    }

    double x = 0.0, y = 0.0;
    double xx = 0.0, yy = 0.0;
    int i = 0;

    while (xx + yy <= 4.0 && i < maxIter)
    {
        y = 2.0 * x * y + ay;
        x = xx - yy + cx;
        xx = x * x;
        yy = y * y;
        i++;
    }

    if (i >= maxIter)
    {
        return maxIter;
    }

    double mag = sqrt(xx + yy);
    return i + 1.0 - log(log(mag)) / log(2.0);
}

// Full-frame renderer into framebuffer (RGBA), output is **grayscale**
// samplesPerDim: 1 = 1 sample, 2 = 2x2 = 4 samples per pixel, ...
void render_frame(
    double cx, double cy, double scale,
    int maxIter,
    int samplesPerDim,
    double circx, double circy, double circr)
{
    if (!framebuffer || fbW <= 0 || fbH <= 0)
        return;
    if (maxIter < 1)
        maxIter = 1;
    if (samplesPerDim < 1)
        samplesPerDim = 1;

    int numSamples = samplesPerDim * samplesPerDim;

    double aspect = (double)fbW / (double)fbH;
    double ww = scale * 2.0;
    double wh = ww / aspect;

    double x0 = cx - ww * 0.5;
    double y0 = cy - wh * 0.5;

    double r2lim = circr * circr;

    for (int j = 0; j < fbH; j++)
    {
        for (int i = 0; i < fbW; i++)
        {
            // Circle test at pixel center (good enough)
            double uc = (double)i / (double)(fbW - 1);
            double vc = (double)j / (double)(fbH - 1);
            double xc = x0 + uc * ww;
            double yc = y0 + vc * wh;

            double dx = xc - circx;
            double dy = yc - circy;
            size_t idx = ((size_t)j * fbW + i) * 4;

            if (dx * dx + dy * dy > r2lim)
            {
                framebuffer[idx + 0] = 0;
                framebuffer[idx + 1] = 0;
                framebuffer[idx + 2] = 0;
                framebuffer[idx + 3] = 255;
                continue;
            }

            double sum = 0.0;

            for (int sy = 0; sy < samplesPerDim; sy++)
            {
                for (int sx = 0; sx < samplesPerDim; sx++)
                {
                    double u = ((double)i + ((double)sx + 0.5) / (double)samplesPerDim) / (double)(fbW - 1);
                    double v = ((double)j + ((double)sy + 0.5) / (double)samplesPerDim) / (double)(fbH - 1);

                    double x = x0 + u * ww;
                    double y = y0 + v * wh;

                    double t = mandel(x, y, maxIter);

                    double n;
                    if (t >= (double)maxIter || t <= 0.0)
                    {
                        // interior (or invalid) -> black
                        n = 0.0;
                    }
                    else
                    {
                        n = t / (double)maxIter; // 0..1
                    }

                    sum += n;
                }
            }

            double avg = sum / (double)numSamples;
            if (avg < 0.0)
                avg = 0.0;
            if (avg > 1.0)
                avg = 1.0;

            uint8_t g = (uint8_t)(avg * 255.0 + 0.5);

            // Grayscale in all channels; JS will recolor using the R channel
            framebuffer[idx + 0] = g;
            framebuffer[idx + 1] = g;
            framebuffer[idx + 2] = g;
            framebuffer[idx + 3] = 255;
        }
    }
}
