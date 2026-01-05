---
layout: /src/layouts/article.astro
title: GNOMS
date: 2025-01-20
category: draft
---

# Gerhard's NixOS Management System

Over the course of about a year I have slowly built a system for managing my NixOS setup. I have long been a fan of Linux and tried many distributions. Mostly I used Arch, but ended up abandoning it for its tendency to break. I am now a steadfast fan of NixOS and hope to keep using it for the foreseeable future.

Still, I don't find NixOS perfect. It requires files to be tracked in git when using flakes, and configurations have a tendency to get messy fast. I also like using the intended files and filetypes for dotfiles, as it makes it easier to port to other systems if needed. I also really wanted a way to handle custom scripts.

I built a system that does all this and more. It's not flashy or large, but its architecture is solid and highly modular. The [setup](https://github.com/GerhardMe/GNOMS) is easily installed from GitHub. It's simply 3 lines in any NixOS terminal and you have the exact same system as me, down to the colour of the Firefox theme. I wanted to make it easy to install and set up on new machines. Cloning the project, you only really need to change one file to make it uniquely yours. In the future it would also be cool to make a custom installer ISO.

## NixOS

The reason I use NixOS mainly comes down to three things. Firstly, I like having all my programs installed declaratively, so I can more easily clean up and uninstall unused programs. Secondly, I love the ability to roll back to a stable build. I like fixing and tinkering, but if I need to work, I want to be able to roll back to a working build and later fix the issue in the broken one. Lastly, I love having my whole system saved and ready for quick reinstallation in case my laptop dies.

## AwesomeWM

The project is based on the tiling window manager AwesomeWM and X11. This was chosen as a compromise between i3's lack of customizability and DWM's difficulty of use. I stuck with X11 because it is still more supported than Wayland, and I don't see the need for the marginal extra security Wayland may provide.

## Scripts

Other than programs and dotfiles, the system manages a variety of custom scripts. Everything from volume handling to auto-detecting microcontrollers. I also made a system for handling different operating modes. Typing `mode server` prevents sleep and allows incoming SSH. `mode performance` changes CPU flags and uses the fan more aggressively.

Although performance mode is rarely used, server mode has proved itself more useful than initially thought, and homelabbing has never been easier.

## eGPU

One huge challenge was getting my NVIDIA eGPU to work with the system. After banging my head into the wall over NVIDIA drivers constantly trying to murder Intel graphics drivers, I figured out that Nix allows for different profiles at boot. This completely changed the game, and now I can simply choose to load the NVIDIA driver at boot or stick with internal graphics. This way the eGPU works like a dream, and I am able to play Minecraft with the most insane of shaders.

Check out the system yourself at [GitHub/GNOMS](https://github.com/GerhardMe/GNOMS).