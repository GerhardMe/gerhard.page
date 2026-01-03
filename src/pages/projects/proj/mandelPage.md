---
layout: /src/layouts/article.astro
title: mandel.page
date: 2025-11-23
category: code
image: /projects/mandel/mandel.png
---

As 2025 was commin to and end and most of my friends were getting buissy with exams, I needed a project. It had at this point been a fair while since I had made anything web based, and I wanted to freshen up on the technology and methodology. I had at that time developed an interest in fractals and the math behind them. I therefore thought it fitting to make a mandelbrot explorer. One of the main goals for the project was to explore AI systems as a tool in coding projects. I use AI for simple scripts and often to quick boilerplate, but rarely for larger projects as I find it cumbersome and messy. This was an exception. The resulting project became [mandel.page](https://mandel.page).

## Plan

![Image](/projects/mandel/default.png)

This project I wanted to explore how to efficiently use AI systems while keeping performance and visual appeal good. I started off by using ChatGPT. I spent little time setting up an astro project that rendered the mandelbrot set. I got the AI to add pan and zoom controls, but that's about as far as the quick progress started to halt. 

The problem I have found with relying too much on AI, is not that it makes too many mistakes. I am sure to have more syntax errors than even GPT3, and finding them is not that problematic. The problem I often find is rather its lack of planning. At the state LLMs are at this point (2025), they seem unable to plan ahead for larger projects. When asked to add a feature or fix a bug, instead of redesigning the architecture to better suit the usecase, the AI systems will more often add exceptions and narrow functions fixing single bugs and behaviour. If allowed to continue like this the projects will shortly baloon into a huge mess of endless code. No structure, no plan, just lots and lots of code. It's perhaps how I would imagine coding a project in a dream. Singular functions that make sense, but an overarching strategy that's just nonsense.

## Architecture

![Image](/projects/mandel/fractal.png)

The first problem I ran into was zooming. ChatGPT wanted to use WebGL for rendering the fractal. Indeed an efficient method, but it does not itself allow for an arbitrarily deep zoom. The GPU shader works with floating point arithmetic, and at a relatively shallow depth the fractal started to disintegrate into larger pixels. I decided the best plan was rendering the fractal with the CPU using web-assembly instead rather then using the GPU with WebGL. 

This was also partially done because I had yet to create anything with web-assembly, so I wanted to learn it. I ported the render over to Web-assembly and made it use large ints instead of floating points. In theory this would also make it easier to support infinite zooming by stacking ints, but for now I am using single large ints at 64 bits making for a really deep but not quite infenete zoom.

Another reason for why I made the main rendering of the mandelbrot set be handled by the CPU was that I was saving the GPU for rendering julia-sets. I wanted to be able to simultaneously simulate julia-sets and render the main mandelbrot. I did this by having the GPU handle juliaset and the CPU handle mandelbrot. Both via webworkers so that the main thread was free to handle the DOM.

I proceeded to divide the program into different sections. I made web workers handle requesting frames/images from web-assembly then had the DOM handle colorizing the grayscale images and displaying them to a canvas. 

I also found it hard to get ChatGPT to understand that I wanted the system responsive. It kept wanting to create systems where the main thread had too many responsibilities witch in turn made the DOM unresponsive. It helped a lot splitting up files into smaller sub-files and having the AI work on individual files rather then alowing the AIs to wiew the entire codebase. Seems like withs AIs you shuld rather say less then more.

As mentioned I wanted somthing fun to use and really responsive. I had the idea of having the image first be rendered quickly in low res, then gradually imporve as the CPU was givven more time. This meade for a super neat effect. I again divided upp the renderes into sections based on how fast the CPU was working. Making a scanning effect for every pixel size render. I am super happy with hpw the effect turned out, and since the sections are sized by time of render its buttery smooth. 

When it comes to making the page good looking I realy beleve i sucseeded. I added color controls, a quick glow shader and made the whole thing look sleek and minimal. Its theeme is solid and its layout logical.

Lastly I added a small written text about the mandelbrot set itself. You may see it if you click the small question mark in the bottom right corner of the site. Really neat how I was able to display algebra in the browser and the semitransparent background makes for a cool reading experience. And no, none of the text written on this site or mandel.page is written or semiwritten by AI. 

To sum up this was the full system:

- Astro as the main framework
- Web workers handling rendering the 2 fractals.
- WebGL for julia-sets
- Web-assembly for mandelbrot.
- Recoloring, shading, and any DOM related stuff handled by the main thread.
- Hosted on Github pages

## Reflections

![Image](/projects/mandel/red.png)

The point of the porject was neither speed nor code quality. It was to create a super fun good looking page in the shortest amount of time using AI tools. It's quite a lot smaller than some of the other projects I have done, but I am happy with the end result, and I really liked the challenge. I also found that Claude is much better at coding than ChatGPT and I will be using Claude in future projects. Gennerally AI is an awsome tool, but I find it simple to overuse it. I often found myself spening hours on trying to explain to Claude how to fix some bug instead of just dooing it myself. Gennerally handing the AI smaller isolated taskes worked the best, while architecture, styling and complex functionality was best done myself.

![Image](/projects/mandel/txt.png)

I really recommend taking the [website](https://mandel.page) for a spin. All windows are draggable, can be minimized and can be reopened via the small links in the bottom right. There you can also find the question mark displaying the text. Apart from a few bugs and not being optimized for mobile, I do believe the project to be a success! 