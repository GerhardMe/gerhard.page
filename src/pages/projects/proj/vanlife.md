---
layout: /src/layouts/article.astro
title: Vanlife
date: 2021-06-20
category: practical
---

![image of car](/projects/vanlife/car.jpg)

In the summer of 2021 I bought a van. I then converted this van to a camper, and then proceeded to live fulltime in it for over half a year.


## Planning

I've long had the dream of building a van to live in full time. In the spring of 2021, covid was raging and I wanted to have a big new project to spend my time. At the time, the folks I lived with were all moving out for various reasons, so I thought I might as well realize my vanlife dream. However I had never done any project at this scale before, neither in complexity, time spent, or most importantly economic risk. Everything felt scary and nothing was thought out. I was a student at the time, and my wallet was not exactly thick. I had made some rough economic calculations, but knew that the variance was large. Therefore I lay a concrete strategy to actually realize the project.

1. Start to plan it (duh). The project had to be well thought out and I needed to be comfortable with the plan, but more importantly I needed to get comfortable with failing the project. Perhaps I would just destroy a van.
2. Start to talk about it. Make it obvious for the people around you that this is something you believe is possible, and that I would actually do it. This was an aggressive strategy because now I feared backing down out of pride.
3. Spend a lot of money. Who said sunk cost fallacy could not be useful? On a vanBuild project, spending the money is easy. Buy a van!

This whole process was driven by a simple mechanism. Never think about the complete result, and only focus on the next step. Looking back I believe this was absolutely necessary.

![image of empty car](/projects/vanlife/start.jpg)

So Anyways, i bought a van... A renault master III from 2018. The car was big, and the biggest car i had driven by a long shot. I flew to Bergen and bought it there. Pro tip: dont fly to buy a car, as saying no, its not as i thought gets a bit harder when already flown to the location. 😅


## Woodworking

![image of build prosess](/projects/vanlife/build1.jpg)

The next problem was building it. I had only 2 months in the summer until the next semester would start. It was crucial that i finished the van within this timeframe, as after the summer my contract for my room would run out and I would be without a house. Someone said things look clearer in the rear end mirror, and one could say that the timeframe now looks much too optimistic. Luckily i did not know that at the time. I wanted to start with the woodworking as it seemed the easiest. This also, was not quite right.

The woodworking proved to be much harder and a lot more time consuming than i had originally thought. Therefore it was a good thing i decided not to invest in any powertools except a small hand drill. I have since never picked up a hand saw. I had worked a fair bit with wood before, but never at this scale, and it took an immense amount of time to get anything done. I had bought the car with some isolation and woodpaneling already installed, hoping i could build around this. However, I quickly realized this had to be torn down as the handywork was really sloppy. Surprising fact, but it turns out building a bed out of wood in a car that bends and stretches as it moves and not having it squeak turned out to be kind of difficult.

![image of build prosess](/projects/vanlife/build1_5.jpg)

After the bed frame, i build the walls and cabinets. I isolated the walls with armaflex, and glava. Note to future self: Never use glava! Having already spent one of the 2 months on just the framework on the woodworking I left on a one week bouldering trip. I Also needed to see how it was living in a car.

![image of build prosess](/projects/vanlife/build2.jpg)

After a lot more late night sawing by hand I finished the paneling. I believe most of the 2 months were spent woodworking. Also a tip for future reference: dont make drawers in a car. It turns out that cars move, and they bend, so the drawers get stuck. bad idea.

![image of build prosess](/projects/vanlife/build3.jpg)

Lastly I used woodoil to treat the inside. I really loved how it made the wood texture pop, and the darkening effect. Made the whole car quite cabin-ish.


## Electricity

![image of electric systems](/projects/vanlife/electric.jpg)

So on to something more interesting, but a hell of a lot more expensive. Electricity!

The electrical systems consisted of some key components:
- One 12volts "House" battery of 200AH.
- The car dynamo
- Solar panels for the roof
- A "shore" charger
- 230V inverter

I had a quite good grip on electricity from before, but the amount of current in this system and the sheer size still made it a real challenge. The heart of the system was the 200AH battery in the back. The system is built a lot like one would build a houseboat system with a so called "house" battery. This battery is responsible for driving everything I would use for living in the van. The regular car battery was not to be used for anything else than starting the car. This way I insured that the car battery wouldn't go flat. Also a car battery is built to be able to supply a starting voltage regardless of temperature and load. A starter battery is not made to be fully depleted and it should be kept at almost full capacity most of the time. 

I went with Lithium-ion for the house battery. Lithium-ion has much lower internal resistance and a much higher resting voltage than LEAD-acid or AMG batteries. This would obviously come back to bite me almost immediately. I wanted the dynamo in the car to charge both the starter battery and the house battery when I was driving, but have the circuits separate when discharging. My first solution to this was to use a relay that measured voltage and connected the circuits when the voltage was over 14. The idea was that this would only occur whence the dynamo was running. Obviously this did not work. The lithium-ion battery rested way too high and wouldn't you know it but my car had the beefiest of beefy dynamoes capable of producing way over 200Amps, way over the relay specifications. However I winged it and did some napkin math. As long as i never charged the battery from near or completely flat it should be fine. I really did not have the time to work it out exactly now, and I installed a large AMP-meter to give indication of how much it charged, as well as a 200AMP-fuse. One would almost be forgiven for thinking it would work. Some months later the charger read a hefty 150Amps. I knew it was pushing what the relay could handle, but thought it was fine, as long as it stayed under 160Amps. I went into the van after the short drive and found the fuse not to be blown, but the fusebox of plastic to lay in a melted plastic puddle on the floor, the relay to be fused permanently on and a rather interesting line in the manual for the AMP-meter. 150Amp shunt... Oh well

The rest of the build went smoother. I installed the solarpanel regulators, and a 12 volt charger that i could use to charge the car from a camper outlet from outside. I installed the inverter for all my 230Volt needs and lights. I also cut a huge scary hole in the roof and installed a fan for ventilation and atmosphere control.


## Heating

![image of heater](/projects/vanlife/cursed.jpg)

I decided on a dieselheater for keeping warm. The heater slowly burns diesel and heats up air. The warm air circulation is completely separated from the burning and exhaust. This makes it an ideal heat source as its both dry and safe against CO poisoning. The dieselheater was the last thing I installed and a real hassle to get mounted. The heater became quite warm, so I mounted it on a wooden board to protect the floormat. I mounted the heater under the passenger seat and cut some holes for the exhaust and air intake. It was extremely satisfying when I finally turned it on. It turns out living in a heated room is rather nice.


## Water & Cooking

![image of burners](/projects/vanlife/kitchen.jpg)

The water system in the van was quite simple. I installed a 20Litre tank up above the sink. This made the sink gravity feed. It was nice having water even if the power was gone. However, installing the tank right above the sink made for quite an annoyingly small sink. For cooking I installed 2 gas tops. I decided on not installing an oven, mostly because I simply ran out of time, but the burners worked well. I ended up never connecting the autoignition as turning on the stove via matches was a little too cosy.


## Gaming?

![image of pc](/projects/vanlife/computer.jpg)

I also obviously installed a stationary gaming tower with dedicated graphics. Which is exactly as stupid as it sounds. I built the computer into the wall and built in a sound system and subwoofer. The sound system was super nice and I ended up using it all the time, the computer however was rather power hungry, and also I dont game. 

![image of pc](/projects/vanlife/gaming.jpg)

I later removed it. I also feared all the shaking would end up damaging the machine.


## Car stuff

![image of dash](/projects/vanlife/dash.jpg)

I also installed an expedition lightbar at the front of the van. I connected the lightbar to my normal longlights, but made it so that I had to flip a dedicated dashboard switch as well. Im really happy about how the dash turned out, and it was perhaps my favorite part of the whole build although small and easy to build. The homemade dash contains the ampmeter for charging the house batteries, the switch for the new lightbar and some temperature sensors as well as a voltmeter to check the dynamo just for fun.

![image of built car](/projects/vanlife/done1.jpg)

Although i completed the dash some weeks after the semester had begun you never truly say yourself done with a project like this. Its constant upkeep and something is always needing to be replaced, upgraded or changed. I later redesigned the dynamo setup, upgraded the 230V system. Repaired the water system and added more lighting. Still super proud I more or less completed according to schedule and in time for semester.

![image of built car](/projects/vanlife/done2.jpg)

## Life in a car

The first thing to happen would obviously be the door falling off. Before I was even done building the car, I slammed the side door closed and was dumbfounded to see it close with an odd clonk to then slowly tip outward and completely fall off. Quite annoying, but also kind of funny. I ended up replacing the door slider arm as well as a couple of ball bearings, luckily not the worlds hardest fix, but i did get this picture where the door is held on via straps for a climbing adventure.

![image of strapped on door](/projects/vanlife/door.jpg)

I soon came to understand that living in a car whilst studying was not as rare as I initially feared. We were at least 4 vans in Trondheim housing full time students that semester. We all parked on the same parking making almost a small community of car dwellers. A tiny trailer park if you may. This community was a lot more important than I realized going into the project. We had some community dinners and shared experiences and stories. 

![image of car inside](/projects/vanlife/food.jpg)

After some months being parked around the school I decided to drive to spain with some friends. We were 3 cars and some more people flying down. One week on the way, one in france, and 2 weeks in spain. Went to fontainebleau to go bouldering and margalef plus siurana for climbing. Truly an adventure. I nearly drove into a river, did drive into another car, and almost drove off a mountain road. Spain should really be investigated in some international court for making the most cartoonlike, impossibly steep, no guardrail, stupidly narrow, deadly roads ever. I was stuck at a 180 degree corner up what felt like a 45 degree road. As i started driving the car just spun backwards towards a rather deadly cliffside. Had to get some Spaniard to sit on the front of the car to provide the necessary downforce for making the car crawl up the road. Did I mention this was dry asphalt with added deep grooves for traction? How dangerous can you even make roads? 

![image of spain trip](/projects/vanlife/spain.jpg)

After this i spent december in Trondheim for exams. This was when i decided that enough was enough. I remember waking up and checking the temp inside the car just to read negative 15 degrees celsius. Stayed out january just out of pure spite, and then couch-surfed until i found a place to move into. 

![image of car in winter](/projects/vanlife/winter.jpg)

## Reflections

Would i do it again? No, certainly not. Super happy i did, but not again. Turns out I really like waking up in a room above freezing. Although a simple explanation its not quite the truth. Cold and harsh living was a challenge but also really fun. Small space and not being able to keep your entire wardrobe was more of an interesting lifestyle than any real pain. The real reasons i wouldn't do it again are in the details. 

Firstly the setup was way too expensive. The constant angst of being afraid to crash or break the car in any way was tiresome. I had way too much of my money tied up in the car and living in it was also a lot more expensive than i first thought it would be. I ended up eating out more often as the kitchen in the car was lacking. I spent a lot on petrol, as the car begged more travel. I had to rent a post box, and have a car insurance and so on. Not as expensive as rent, but a lot closer than i had thought going into this project.

Secondly, living in a car is not as minimalistic as i had hoped for. I later saw this [video](https://www.youtube.com/watch?v=rJJH-tQIBn4) on the topic i ended up agreeing a bit too much with. I wanted to try minimalistic living. Small space, little stuff and low consumption, but living in a car does not provide this. Either you need to spare half the room in the car for tools for your car, unless you spend lots on maintenance and mechanics. You also need the services around you, so you end up using more gym memberships, buying more petrol for keeping warm and lots of vanlife specific items. Smart-pans, small stackable chairs, powerbanks and whatnot. Before I moved into the van I ate almost exclusively from dumpsterdiving. In the car i didn't have a fridge, so I ended up having to buy fresh food instead. Probably good for my health, but not great for minimalism. Not saying its impossible to live minimalistically in a car, just that if minimalism is your goal, I would not recommend living on the road.

Thirdly, living is a boring hobby. Waking up cold, washing up by hand, rearranging your small area. All those things are interesting to do for maybe a week, but over a longer timeframe they take up energy. I really didn't realize this before moving back into a house, but I spent so much time and energy, both mental and physical on simply living in the car. I really do love going on a cabin trip and having to go to the river to get water, but if thats your every day, you will not have enough energy for all the other stuff you could be doing. Its not like I am looking to burn away a solid 50% of my energy on just surviving every day. I want to build other stuff, go to uni, work and go hiking. 

All in all a great 6 months, but also happy i moved into a real house again. I kept the most important stuff. The relationships i built and the experience i acquired. 10/10 would not do again

## Afterthought

I sold the van later the next semester. I even made some marginal profit so the whole project ended up rather cheap after all. I later bought a 2004 Toyota Corolla, and built in some simple battery system for charging laptops and phones. I added some ventilation and generally upgraded it a little. This super cheap simple car has served much better as a make shift camper. Its nimble and gets around, cheap to keep and easy to fix.

Its now 2025 and some weeks ago I was driving in my Corolla to go freediving. I drove past a red van looking somewhat familiar, and even joked that it looked like the one I had some years ago. Driving closer I realized, that yes, it truly was. The car was sold in Oslo, so how it ended being parked just a kilometer from where I live in Trondheim seems somewhat mysterious. Perhaps it just wanted to say hey. Looks like its still in use and hopefully the owners whoever they may be now are happy with it.

![image of seeing the car one last time](/projects/vanlife/meet.jpg)