---
layout: /src/layouts/article.astro
title: Vanlife
date: 2021-06-20
catagory: practical
---
![img](/images/projects/vanbuild/car.jpg)

In the summer of 2021 I bought a van. I then converted this van to a camper, and then procided to live fulltime in it for over halv a year.

## Planning
Ive long had the dream of building a van to live in full time. In the spring of 2021, covid was raging and I wanted to have a big new project to spend my time. At the time, the folks I lived with ere all moving out for various reasons, so I thought I might as well realize my vanlife dream. However I had never done any project at this scale before, nether in complexity, time spent, or most importentaly economic risk. Everything feelt scary and nothing was thought out. I was a student at the time, and my wallet was not exsactly thick. I had made some rough economic calculations, but knew that the varriance was large. Therefore I lay a concrete strategy to actually realice the project.

1. Start to plan it (duh). The projcet had to be well thought out and I needed to be comterble with the plan, but more importantly I needed to get comfertable with failing the project. Perhaps I would just destroy a van.
2. Start to talk about it. Make it obvius for the people around you that this is somthing you beleve is posible, and that I would actually do it. This was an agressive stratagy becouse now I feard backing down out of pride.
3. Spend a lot of money. Who said sunk cost fallacy could not be usefull? On a vanBuild project, spening the money is easy. Buy a van!
 
This whole process was driven by a simpe mechanism. Never thnk about the compleate result, and only focus on the next step. Iooking back I beleve this was absolutly nessesary.

![empty van](/images/projects/vanbuild/start.jpg)

So Annyways, i bought a van... A renault master III from 2018. The car was big, and the biggest car i had driven by a long shot. I flew to Bergen and bought it there. Pro tip: dont fly to buy a car, as saying no, its not as i thought gets a bit harder when already flown to the location. 😅

## Woodworking

![img](/images/projects/vanbuild/build2.jpg)

The next problem was building it. I had only 2 months in the summer untill the next semster would start. It was crutial that i finished the van within this timeframe, as after the summer my contract for my room would run out and I would be without a house. Somone said things look clearer in the rear end mirror, and one could say that the timeframe now looks mutch to optemistic. Luckely i did not know that at the time. I wanted to start with the woodworking as it seemed the easyest. This also, was not quite right.

The woodworking proved to be mutch harder and a lot more time consuming than i had originally tought. Therefore it was a good thing i decided not to invest in any powertools exsept a small hand drill. I have since never picked upp a hand saw. I had worked a fairt bit with wood before, but never at this scale, and it took an imence amount of time to get annything done. I had bought the car with some isolation and woodpanneling already installed, hoping i could build around this. However, I quickly realiced this had to be torn down as the handywork was really sloppy. Suprising fact, but it turnes out building a bed out of wood in a car that bends and stretches as it moves and not having it squick turned out to be kind of dificult.

After the bed frame, i build the walls and cabinets. I isolated the walls with armaflex, and glava. Note to future self: Never use glava! Having already spent one of the 2 months on just the frameowrk on the woodworking I left on a one week bouldering trip. I Also needed to see how it was living in a car.

I Then went to Halden and continued the woodworking, then back to Trondheim to finsih the panneling. I beleve most of the 2 monts were spent woodworking. Also a tip for future refrence: dont make drawers in a car. It tunes out that cars move, and they bend, so the draws get stuck. bad idea.

Lastly I used woodoil to treat the inside. I really loved how it made the wood tecture pop, and the darkening effect. Made the whole car quite cabbin-ish.


## Electrisity

So on to something more intresing, but a hell of a lot more expensive. Electrisity!

![img](/images/projects/vanbuild/electric.jpg)


The electrical systems consisted of some key components:

- One 12volts "House" battery of 200AH.
- The car dynamo
- Solar pannels for the roof
- A "shore" charger
- 230V inverter

I had a quite good grip on electrisity from before, but the amount of current in this system and the sheer size still made it a real challage. The heart of the system was the 200AH battery in the back. The system is built a lot like one would build a houseboat system with a so called "house" battery. This battery is resposible for driving everything I would use for livingin the van. The regular car battery was not to be used for anything else than starting the car. This way I inshured that the car battery would't go flat. Also a car battery is built to be able to suply a starting voltage regarless of temprature and load. A starter battery is not made to be fully depleated and it shuld be kept at almost full capacity most of the time. 

I went with Litxium-ion for the house battery. Litzium-ion has mutch lower internal resistance and a mutch highter resting voltage than LEAD-acid or AMG batteries. This would obviusly come back to bite me almost emidiatly. I wanted the dynamo in the car to charge bolth the starter battery and the house battery when I was driving, but have the circuts seperate when discharging. My first solution to this was to use a relay that messured voltage and conected the circuts when the voltage was over 14. The idea was that this would only occur whence the dynamo was running. Obviusly this did not work. The lithium-ion battery rested way to high and wouldnt you know it but my car had the beefiest of beefy dynamoes capable of projucing way over 200Amps, way over the relay specifications. However I wined it and did some napkin math. As long as i never charged the battery form near or compleatly flat it shuld be fine. I really did not have the time to work it out exsactly now, and I installed a large AMP-meter to give indication of how mutch it charged, as well as a 200AMP-fuse. One would almost be forgiven for thinking it would work. Some months later the charger read a heafty 150Amps. I knew it was pushing what the relay could handle, but thought it was fine, as long as it stayed nder 160Amps. I went into the van after the short drive and found the fuse not to be blown, but the fusebox of plastic to lay in a melted plastic puddle on the floor, the relay to be fused permenently on and a rather interesting line in the manual for the AMP-meter. 150Amp shunt... Oh well

The rest of he build went smoother. I installed the solarpannel regulators, and a 12 volt charger that i could use to charge the car from a camper outlett from outside. I installed the inverter for all my 230Volt needs and lights. I also cut a huge scarry hole in the roof and installed a fan for ventilation and atmosefare controll.


## Heating

![img](/images/projects/vanbuild/cursed.jpg)

I decided on a diselheater for keeping warm. The heater slowly burns disel and heats upp air. The warm air circulation is compleatly seperated from the burning and exsaugst. This makes it an ideal heat source as its bolth dry and safe agiant CO posening. The diselheater was the last thing I installed and a real hassle to get mounted. The heater became quite warm, so I mountet it on a wooden board to protect the floormat. I mounted the heater under the passenger seat and cut some holes for the exsaughst and air intake. It was extreamly satasfying when I finally turned it on. It turnes out living in a heated room is rather nice.

## Water & Cooking

![img](/images/projects/vanbuild/food.jpg)

The water system in the van was quite simple. I installed a 20Litre tank upp above the sink. This made the sink gravity fead. It was nice having water even if the power was gone. However, instaling the tank right above the sink made for quite an annoyingly small sink.

For cooking I installed 2 gas topps. I decided on not installing an oven, mostly becouse I simply ran out of time, but the burners worked well. I ended upp never conectng the autoingnition as turning on the stove via matches was a little to cosy.

## Gaming?

![img](/images/projects/vanbuild/computer.jpg)

I also obviusly installed a stationary gaming tower with dedicated grapics. Witch is exsactly as stupid as it sounds. I buildt the computer into the wall and built inn a sound system and subwoofer. The sound system was super nice and I ended up using it all the time, the computer however was rather power hungry and also, I dont game. I later removed it. I also feared all the shaking would end upp damaging the machine.

## Car stuff

![img](/images/projects/vanbuild/dash.jpg)

I also installed an expedition lightbar at the front of the van. I connected the lightbar to my normal longlights, but made it so that I had to slip a dedicated dashbaord switch as well. Im really happy about how the dash tuned out, and it was peraps my favorite part of the whole build although small and easy to build. The homemade dash contains the ampmeter for charging the house batteries, the switch for the new lightbar and some tempreture sensors as well as a voltmeter to check the dynamo just for fun.

Although i compleated the dash some weeks after the semester had begun I never really compleated the car. A project sutch as that is a constant uppkeep and work in progress. I later changed out the dynamo setupp, the 230V system. Water system and needed to add some lighting. Still super proud i comleated before the semester began for real.


## Living in a car




Also, the door fell off... A cupple of weeks after I had gotten the car, I slammed the side door closed, but as it closed there was a cracking sound and the whole door fell off. Quite stressfull, but aslo kind of funny. I ended upp replacing the door slider arm as well as a cupple of ball berings.

Under are some pictures of the finished van. Im really porud of this project and it is certanly the biggest project ive undertaken thus far. It taught me a lot about 12 volt systems, heating and atmofare controll, carpendry and genneral mechanics. I would absolutly recomend building a campervan o annyone that is intrested, but I might not recomend liing in it full time, but [thats](./vanlife) another story.

## Images

![img](/images/projects/vanbuild/done1.jpg)
![img](/images/projects/vanbuild/done3.jpg)
![img](/images/projects/vanbuild/done4.jpg)
![img](/images/projects/vanbuild/winter.jpg)

★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - 
★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - ★ - ☆ - 
