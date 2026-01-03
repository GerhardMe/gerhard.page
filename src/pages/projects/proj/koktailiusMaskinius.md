---
layout: /src/layouts/article.astro
title: Koktailius Maskinius
date: 2024-02-15
category: practical-draft
image: /projects/koktailius/img.jpg
---

While studiying in Trondheim I lived a while at [singsaker studenterhjem](https://studenterhjem.singsaker.no/). One could say a lot about that place, and I would absolutly recomend everyone to live at sutch a place if given the operchonity. Once every year we orgenize a festival at the home. I applied to make the koktail machine that was going to be auchnoned off. 

I really wanted to make somthing challanging. Something that would force me to pick upp new skills and revisit old ones. I also wanted the machine to be comical in the sence that it was overengennered and highly unpractical. Its just so many ways to reinvent a drink dispenser, so I needed to think creativly. Ushally the machine is drivven by some submerged aquarium punp, or the whole thing is graviy fed. I knew i coundt use any of thoose prinsiples.

What pushed liquid thats not a pump, and not gravity? I came upp with air. Lots of it. I had some experience with pnumatics, and I wanted to see if I could power it via a large compressor. I also wanted the machine to mix the drinks itself. Normaly its just a drink dispenser, but the name given to the task is "koktail chef", so it better be making kiktails. I got a bit aead of myself and make this lift of functionalities i wanted the drink machine to have.

- Driven by air pressure (commicly large compressor)
- The fastest drink dispenser in the west
- Mix the drinks for you
- Programable, and pre-set drinks.
- Cool LED-display
- Not explode!

![Image](/projects/koktailius/kompressor.jpg)

This was the largest electronics project I had taken on, and outpaced homemade, drones by some miles considering there was no manual for this. I started with the compressor. I found One that was relativly small and used for spraypainting and tatooing. Still around 4kiloes and compressing upp to 3Bars. One sixth of a horsepower for a car is rather little, but for a kiktail machine its rather a lot. Still this simgle item blew past my allowed budgett and the rest of the build needed to be finances privatly.

The idea was to have some pressure container. Then some pnematic relays that would open for some time to allow the pressureised air to enter at the top of the containers for the drink ingrediants. Theese containers would have a siphon and othervise be airtight. This would then in theory push the drink thrugh the siphon and with a considerable force into the cup. Ajusting timing and different conatins one could make any drink one could think upp.

This would also make shure the dink only had to travel in some simple tubes to the cup. All gates and electronics were in the air section of the build. In theory this would make the machine reusable as one could wash the containser and tubing. 

![Image](/projects/koktailius/modul.jpg)

The riskiest part of the whole buld was building the pressure container. It needed to survive 3Bar. There was a saftly relese built in to the compressure itself, so The risk of compressing hugher then 3Bar was minnimal. I went with a sodastream flask. It shuld easily be able to handle the pressure, and I assume its not bulit to generate the most dangerus splinters on ruptering. However pressurizing this homeade compressor system the first time, was rather suspensefull. Had some sifficulties sealing the high pressure links i made out of hot glue and random plastic to hold 3Bar, but eventually got it propper tight.

I found some pnewmatic relays at 12Volts. This was still a bit to mutch for the rassberry pie pico i used as the brains of the opperation. I therefore needed to use some buck converters to increese the voltage to 12 and some mosfets to quickly switch the relays on and off. This was the first time I really worked with mosfets, and if i were to do it again I would have built it quite differetly. 

![Image](/projects/koktailius/maskin0.jpg)

I built the electronics on perfboards and bredboards. Bolth LED screens and logic were hand soldered when needed and everything was rather clunky, messy and gennerally hard to read. However I did get it working. 

Software in microphython and I bult the frame for the machine out of lasercut mdf boards. I remeber that I spent quite a few nights redesigning the frame to fit around the compressor, as the compressor had no dimentions I could find anywhere.

The system ended upp having a 230V plugg for the air compressor, 5V usb power for the microcontoller and 12 volt rail for the relays. A propper rats nest of wiers and components.

![Image](/projects/koktailius/el.jpg)

The project was a partiall sucsess. It did do all I wanted and more, but There was atleest one fatal flaw. I had not propperly given the air relays enoght power. They had the required voltage, but nowhere near enogh current. I think I could have made it live a lot loger had I provided some beefy capasitors, but as it stood the boost converter got more and more damaged every time I ran the system, and the lifetime of the machine was barly long enouh for displaying it. In the short time the machine worked it was atleest rather effisciant at delivering drinks bolth in the cups and whereever there was a line of singt to the nozzle. Turnes out delivering drinks with 3Bar of airpressure may be a bit mutch punch for a drink mixer.

![Image](/projects/koktailius/maskin1.jpg)

If I had more time, I would have fixed the relativly simple electrical problem, but as it stood I had no time and barly managed to get it somewhat working before the deadline. All in all a superfun project, and one that tought me a lot about simple electronics, and system engeneering with different mechanisms.

![Image](/projects/koktailius/meg.jpg)
