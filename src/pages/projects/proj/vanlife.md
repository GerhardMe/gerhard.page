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

Although i compleated the dash some weeks after the semester had begun you never trully say yourself done with a project like this. Its constant uppkeep and somthig is alwas needing to be replaced, upgraded or changed. I later redesigned the dynamo setupp, uppgraded the 230V system. Repeared the water system and added more lighting. Still super proud I more or less compleated acourding to scedule and in time for semester.


# Life in a car

The first thing to happen would obviusly be the door falling of. As soon as I said myself done with the car, I slammed the side door closed and was dumbfounded to see it close with an odd clonk to then slowly tip outward and compleatly fall of. Quite annoying, but aslo kind of funny. I ended upp replacing the door slider arm as well as a cupple of ball berings, luckely not the worlds hardest fix, but i did get this picture where the door is held on via straps for a climbing adventure.

![img](/images/projects/vanbuild/done1.jpg)

I soon came to understand that living in a car whilest studying was not as rare as I initially feared. We were atleest 4 vans in Trondheim houseing full time students that semester. We all parked on the same parking making almost a small comunity of car dwellers. A tiny trailer park if you may. This comunity was a lot more importent then I reliced going into the project. We had some comunity dinners and shared experiences and stories. 

After some months beeing parked around the school I decided to drive to spain with some friends. We were 3 cars and some more people flying down. One week on the way, one in france, and 2 weeks in spain. Went to fondtnbleu to go bouldering and margaif pluss siurana for climbing. Truly an adventure. I nearly drove into a river, did drive into another car, and almost drove off a mountain road. Spain shuld really be investigated in some international court for making the most cartoonlike, imposiibly steep, no guardrail, stupidly narrow, deadly roads ever. I was stuck at a 180 degree corner upp what felt like a 45 degre roard. As i started driving the car just spann backwards towards a rather deadly cliffside. Had to get some spainyard to sit on the front of the car to provide the nessesary downforce for maiking the car crawl upp the road. Did I mention this was dry asphalt with added deep groves for traction? How dangerus can you even make roads? 

After this i spent december in Trondhem for exsams. This was when i decided that enough was enough. I remeber waking upp and checking the temp inside the car just to read negative 15 degrees celcius. Stayd out january just out of pure spite, and then couch-surfed untill i found a place to move into. 

## Reflections

Would i do it again? No, certantly not. Superhappy i did, but not again. Turns out I really like waking upp in a room above freezing. Although a simple explenation its not quie the truth. Cold and harsh living was a challage but also really fun. Small space and not beeing able to keep your entire wardrobe was more of an interesting lifestye then any real pain. The real reasons i wouldnt do it again are in the details. 

Firstly the setupp was way to expensive. The constant angst of beeing afraid to crash or break the car in any way was tiersome. I had way to mutch of my money tied upp in the car and living in it was also a lot more expensive then i first thought it would be. I ended upp eating out more often as the kitchen in the car was lacking. I spent a lot on petrol, as the car begged more travel. I had to rent a post box, and have a car inshurance and so on. Not as expensive as rent, but a lot closer then i had thought going into this project.

Secondly, living in a car is not as minimalistic as i had hoped for. I later say this [video](https://www.youtube.com/watch?v=rJJH-tQIBn4) on the topic i ended upp agreeing a bit too mutch with. I wanted to try minimaltisc living. Small space, little stuff and low consumtion, but living in a car doe snot provide this. Eather you need to spare half the room in the car for tools for your car, unless you spend lots on maintenece and mechanics. You also need the services around you, so you end upp uning more gym meberships, buing more petral for keeping warm and lots of vanlife spesific items. Smart-pans, small stackable chairs, powerbanks and whatnot. Before I moved into the van I ate almost exclusivly from dumpsterdiving. In the car i didnt have a fridge, so I eneded upp having to buy fresh food insted. Peobably good for my health,but not great for minimalism. Not saying its imposible to live minimalisticly in a car, just that if minimalism is your goal, I would not recomend living on the road.

Thidly, living is a booring hobby. Waking upp cold, washing upp by hand, rearanging your small area. All those things are interesting to doo for maby a week, but over a longer timeframe they take upp enegry. I really dint relice this before mooving back into a house, but I spent so mutch time and engery, bolth mental and physical on simply living in the car. I really do love going on a cabin trip and having to go to the river to get water, but if thats your every day, you will not have enough energy for all the other stuff you could be dooing. Its not like I am lookig to burn away a solid 50% of my energy on just surviving every day. I want to build other stuff, go to uni, work and go hiking. 

All in all a great 6 months, but also happy i moved into a real house again. I kept the most important stuff. The relationships i built and the experience i aquired. 10/10 would not do again.


