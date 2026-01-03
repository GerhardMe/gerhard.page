---
layout: /src/layouts/article.astro
title: Koktailius Maskinius
date: 2024-02-15
category: practical-draft
image: /projects/koktailius/img.jpg
---

While studying in Trondheim I lived a while at [Singsaker Studenterhjem](https://studenterhjem.singsaker.no/). One could say a lot about that place, and I would absolutely recommend everyone to live at such a place if given the opportunity. Once every year we organize a festival at the home. I applied to make the cocktail machine that was going to be auctioned off.

I really wanted to make something challenging. Something that would force me to pick up new skills and revisit old ones. I also wanted the machine to be comical in the sense that it was overengineered and highly unpractical. There are just so many ways to reinvent a drink dispenser, so I needed to think creatively. Usually the machine is driven by some submerged aquarium pump, or the whole thing is gravity fed. I knew I couldn't use any of those principles.

What pushes liquid that's not a pump, and not gravity? I came up with air. Lots of it. I had some experience with pneumatics, and I wanted to see if I could power it via a large compressor. I also wanted the machine to mix the drinks itself. Normally it's just a drink dispenser, but the name given to the task is "cocktail chef", so it better be making cocktails. I got a bit ahead of myself and made this list of functionalities I wanted the drink machine to have.

- Driven by air pressure (comically large compressor)
- The fastest drink dispenser in the west
- Mix the drinks for you
- Programmable, and pre-set drinks
- Cool LED-display
- Not explode!

![Image](/projects/koktailius/kompressor.jpg)

This was the largest electronics project I had taken on, and outpaced homemade drones by some miles considering there was no manual for this. I started with the compressor. I found one that was relatively small and used for spray painting and tattooing. Still around 4 kilos and compressing up to 3 bars. One sixth of a horsepower for a car is rather little, but for a cocktail machine it's rather a lot. Still this single item blew past my allowed budget and the rest of the build needed to be financed privately.

The idea was to have some pressure container. Then some pneumatic relays that would open for some time to allow the pressurized air to enter at the top of the containers for the drink ingredients. These containers would have a siphon and otherwise be airtight. This would then in theory push the drink through the siphon and with a considerable force into the cup. Adjusting timing and different containers one could make any drink one could think up.

This would also make sure the drink only had to travel in some simple tubes to the cup. All gates and electronics were in the air section of the build. In theory this would make the machine reusable as one could wash the containers and tubing.

![Image](/projects/koktailius/modul.jpg)

The riskiest part of the whole build was building the pressure container. It needed to survive 3 bar. There was a safety release built into the compressor itself, so the risk of compressing higher than 3 bar was minimal. I went with a SodaStream flask. It should easily be able to handle the pressure, and I assume it's not built to generate the most dangerous splinters on rupturing. However pressurizing this homemade compressor system the first time was rather suspenseful. Had some difficulties sealing the high pressure links I made out of hot glue and random plastic to hold 3 bar, but eventually got it properly tight.

I found some pneumatic relays at 12 volts. This was still a bit too much for the Raspberry Pi Pico I used as the brains of the operation. I therefore needed to use some buck converters to increase the voltage to 12 and some MOSFETs to quickly switch the relays on and off. This was the first time I really worked with MOSFETs, and if I were to do it again I would have built it quite differently.

![Image](/projects/koktailius/maskin0.jpg)

I built the electronics on perfboards and breadboards. Both LED screens and logic were hand soldered when needed and everything was rather clunky, messy and generally hard to read. However I did get it working.

Software in MicroPython and I built the frame for the machine out of laser-cut MDF boards. I remember that I spent quite a few nights redesigning the frame to fit around the compressor, as the compressor had no dimensions I could find anywhere.

The system ended up having a 230V plug for the air compressor, 5V USB power for the microcontroller and 12 volt rail for the relays. A proper rat's nest of wires and components.

![Image](/projects/koktailius/el.jpg)

The project was a partial success. It did do all I wanted and more, but there was at least one fatal flaw. I had not properly given the air relays enough power. They had the required voltage, but nowhere near enough current. I think I could have made it live a lot longer had I provided some beefy capacitors, but as it stood the boost converter got more and more damaged every time I ran the system, and the lifetime of the machine was barely long enough for displaying it. In the short time the machine worked it was at least rather efficient at delivering drinks both in the cups and wherever there was a line of sight to the nozzle. Turns out delivering drinks with 3 bar of air pressure may be a bit much punch for a drink mixer.

![Image](/projects/koktailius/maskin1.jpg)

If I had more time, I would have fixed the relatively simple electrical problem, but as it stood I had no time and barely managed to get it somewhat working before the deadline. All in all a super fun project, and one that taught me a lot about simple electronics and system engineering with different mechanisms. I also think it served the intended purpose of being a fun eye catcher at the festival rather well, but I do have a suspicion it may have been a bit tryhard for the festival itself, and I did get some questionable looks from people understanding how long this must have taken. I think it's safe to say I built this for the sake of building it, luckily there was a festival I could frame it within.

![Image](/projects/koktailius/meg.jpg)