---
layout: /src/layouts/article.astro
title: mandel.page
date: 2025-11-23
category: code
image: /projects/mandel/mandel.png
---

As I started to prepare closing down crashgami, I wanted a coding project. It had been a fair while since I had made anything web based, and I wanted to freshen up on the technology and methodology. I had at that time developed an interest in fractals and the math making them up. I therefore thought it fitting to make a mandelbrot explorer. One of the main goals for the project was to explore using AI for coding projects. I use AI for simple scripts and often to quickly make boilerplate, but rarely for larger projects as I find it cumbersome and messy. The resulting project became [mandel.page](https://mandel.page).

## Plan

![Image](/projects/mandel/default.png)

This project I wanted to explore how to efficiently use AI systems while keeping performance and visual appeal good. I started off by using ChatGPT. I spent little time setting up an astro project that rendered the mandelbrot set. I got the AI to add pan and zoom controls, but that's about as far as the quick progress started to halt. 

The problem I have found with relying too much on AI, is not that it makes too many mistakes. I am sure to have more syntax errors than even GPT3, and finding them is not problematic. The problem I often find is its lack of planning. At the state LLMs are at this point of writing (2025), they do seem unable to plan ahead for larger projects. When asked to add a feature or fix a bug, instead of redesigning the architecture to better suit the usecase or remove edge cases the AI systems will more often add exceptions and narrow functions fixing single bugs and behaviour. If allowed to continue to add to a project like this the projects will after a short while become a huge mess of slop code. No structure, no plan, just lots and lots of code. It's perhaps how I would imagine coding a project in a dream. Singular functions that make sense, but an overarching program that's just nonsense.

## Architecture

![Image](/projects/mandel/fractal.png)

Anyway the first problem I ran into was zooming. ChatGPT wanted to use WebGL for rendering the fractal. Indeed an efficient method, but it does not itself allow for an arbitrarily deep zoom. The GPU shader works with floating point arithmetic, and at a relatively shallow depth the fractal started to disintegrate into larger pixels. I decided the best plan was to move rendering the fractal to the CPU using web-assembly instead. 

This was also partially done because I had not used web-assembly yet. I ported the render over to Web-assembly and made it use large ints instead of floating points. In theory this would also make it easier in the future to support infinite zooming by stacking ints, but for now I am using single large ints at 64 bits. 

I proceeded to divide the program into different sections. I made web workers handle requesting frames/images from web-assembly then had the DOM handle colorizing the grayscale images and displaying them to a canvas. 

I also found it hard to get ChatGPT to understand that I wanted the system responsive. It kept wanting to create systems where the main thread had too many responsibilities and made the DOM unresponsive. It helped a lot splitting up files into smaller sub-files and having the AI work on adding or improving these rather than getting the whole codebase to work with. Say less not more.

Another reason for why I made the main rendering of the mandelbrot set be handled by the CPU was that I was saving the GPU for rendering julia-sets. I wanted to be able to simultaneously simulate julia-sets and render the main mandelbrot. I did this by having the GPU handle juliaset and the CPU handle mandelbrot. Both via webworkers so that the main thread was free to handle the DOM. I also made an elaborate system for rendering the mandelbrot partially so that the app seemed responsive. I had it load in chunks at a time and scan down the page while building the full image at increasing resolutions. This helped a lot with the feeling of the website, but technically made it a bit slower than just loading one HD image after another. 

To sum up this was the full system:

- Astro as the main framework
- Web workers handling rendering the 2 fractals.
- WebGL for julia-sets
- Web-assembly for mandelbrot.
- Recoloring, shading, and any DOM related stuff handled by the main thread.
- Hosted on Github pages

## Reflections

![Image](/projects/mandel/red.png)

However the point was neither speed nor code quality. It was how fun the site was to use and how quickly I could build it using AI systems. I ended up adding some color controls, a quick glow shader and made the whole thing look rather linuxy if that's a thing. I really like how it turned out. Apart from a few bugs and not being optimized for mobile at all, I do believe the project was a success. 

It's quite a lot smaller than some of the other projects I have done, but I am happy with the end result, and I really liked the challenge. I also found out that Claude is much better at coding than Chat, and I do believe I learnt a lot on how to best use AI in its current state in designing larger projects. 

Lastly I added a small written text about the mandelbrot set itself. You may see it if you click the small question mark in the bottom right corner of the site. Really neat how I was able to display algebra in the browser and the semitransparent background makes for a cool reading experience. And no, none of the text written on this site or mandel.page is written or semiwritten by AI. 

![Image](/projects/mandel/txt.png)

I really recommend taking the [website](https://mandel.page) for a spin. All windows are draggable, can be minimized and can be reopened via the small links in the bottom right. There you can also find the question mark displaying the text. Enjoy!