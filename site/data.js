// Trail Ready content bank. Second Class only, La Jolla edition.
// Every question stores the correct answer separately from the wrong answers.
// Answer positions are assigned at render time by engine.js (balanced slots).

export const TOPICS = {
  camp:   { name: "Camping & Leave No Trace", icon: "⛺", color: "#1E7B3A" },
  fire:   { name: "Fire, Food & Knots",       icon: "🔥", color: "#B45309" },
  nav:    { name: "Navigation & Hazards",     icon: "🧭", color: "#005A9C" },
  nature: { name: "Tidepools & Wildlife",     icon: "🦀", color: "#4D7C0F" },
  water:  { name: "Water Safety",             icon: "🌊", color: "#0369A1" },
  aid:    { name: "First Aid",                icon: "⛑️", color: "#CE1126" },
  fit:    { name: "Fitness & Healthy Choices", icon: "💪", color: "#0F766E" },
  citizen:{ name: "Citizenship & Safety",     icon: "🇺🇸", color: "#003F87" },
  spirit: { name: "Scout Spirit",             icon: "🧡", color: "#8B6508" },
};

// Second Class requirements with something to know or explain.
// Do-only items (1a outings, 3b the 5-mile hike, 5b swim test, 11 Scoutmaster
// conference, 12 board of review) are not quizzed; their knowledge is covered here.
export const REQS = [
  { id: "2C-1b", rank: "2C", topic: "camp", label: "Leave No Trace", task: "Recite the seven Leave No Trace principles from memory. Explain how you follow them on outings." },
  { id: "2C-1c", rank: "2C", topic: "camp", label: "Choose a patrol site", task: "On a campout, choose a patrol site and recommend it to your leader. Explain what you looked for in the site and in a tent spot." },
  { id: "2C-2a", rank: "2C", topic: "fire", label: "When to have a fire", task: "Explain when it is appropriate to use a fire for cooking or other purposes, and when it is not." },
  { id: "2C-2b", rank: "2C", topic: "fire", label: "Knife, tinder, kindling, fuel", task: "Using a pocketknife, and a saw or axe if needed, prepare tinder, kindling and fuel wood for a cooking fire." },
  { id: "2C-2c", rank: "2C", topic: "fire", label: "Build and put out a fire", task: "Using minimum-impact methods, build a fire with that tinder, kindling and fuel. Unless prohibited, light it, let it burn at least two minutes, then safely extinguish it and properly dispose of the ashes and fire materials." },
  { id: "2C-2d", rank: "2C", topic: "fire", label: "Stoves", task: "Explain when to use a lightweight stove and when to use a propane stove. Set one up, light it if allowed, and describe the safety steps." },
  { id: "2C-2e", rank: "2C", topic: "fire", label: "Plan and cook a meal", task: "On a campout, plan and cook one hot breakfast or lunch using MyPlate. Explain the importance of good nutrition, and show how to transport, store and prepare the food safely." },
  { id: "2C-2f", rank: "2C", topic: "fire", label: "Sheet bend", task: "Tie a sheet bend. Describe a situation where you would use it." },
  { id: "2C-2g", rank: "2C", topic: "fire", label: "Bowline", task: "Tie a bowline. Describe a situation where you would use it." },
  { id: "2C-3a", rank: "2C", topic: "nav", label: "Compass and map", task: "Show how a compass works and how to orient a map. Identify five map symbols." },
  { id: "2C-3c", rank: "2C", topic: "nav", label: "Hike hazards", task: "Describe hazards or injuries you might meet on your 5-mile hike and how to help prevent them." },
  { id: "2C-3d", rank: "2C", topic: "nav", label: "Directions without a compass", task: "Show how to find directions during the day and at night without a compass or electronic device." },
  { id: "2C-4",  rank: "2C", topic: "nature", label: "10 wild animals", task: "Identify or show evidence of at least 10 kinds of wild animals (such as birds, mammals, reptiles, fish, mollusks) found in your local area or campsite." },
  { id: "2C-5a", rank: "2C", topic: "water", label: "Safe swim", task: "Explain the precautions for a safe swim." },
  { id: "2C-5c", rank: "2C", topic: "water", label: "Reach and throw rescues", task: "Demonstrate water rescue methods by reaching with your arm or leg, by reaching with a suitable object, and by throwing lines and objects." },
  { id: "2C-5d", rank: "2C", topic: "water", label: "Why not swim out", task: "Explain why reaching or throwing rescues are better than swimming rescues when possible, and how a rescue swimmer avoids contact with the victim." },
  { id: "2C-6a", rank: "2C", topic: "aid", label: "First aid", task: "Demonstrate first aid for: object in the eye, bites of warm-blooded animals, puncture wounds (splinter, nail, fishhook), serious burns, heat exhaustion, shock, heatstroke, dehydration, hypothermia, hyperventilation." },
  { id: "2C-6b", rank: "2C", topic: "aid", label: "Hurry cases", task: "Show what to do for hurry cases: stopped breathing, stroke, severe bleeding, ingested poisoning." },
  { id: "2C-6c", rank: "2C", topic: "aid", label: "Preventing injuries", task: "Tell what you can do on a campout or hike to prevent the injuries in 6a and 6b." },
  { id: "2C-6d", rank: "2C", topic: "aid", label: "Emergency response", task: "Explain how to respond to an emergency at home and in the backcountry. What counts as an emergency, and what information do you give responders?" },
  { id: "2C-6e", rank: "2C", topic: "aid", label: "Vehicle accident", task: "Describe how to respond if you come upon a vehicle accident." },
  { id: "2C-7a", rank: "2C", topic: "fit", label: "Activity log and goal", task: "7a: After Tenderfoot 6c, be physically active at least 30 minutes a day, five days a week, for four weeks, and keep track. 7b: Share your challenges and successes, then set a goal and plan for staying active." },
  { id: "2C-7c", rank: "2C", topic: "fit", label: "Drugs, alcohol, tobacco", task: "Take part in a program on the dangers of drugs, alcohol, tobacco and other harmful practices. Discuss it with your family, explain the dangers of addiction, and tell your Scoutmaster how the Scout Oath and Law relate to what you learned." },
  { id: "2C-8a", rank: "2C", topic: "citizen", label: "Flag ceremony", task: "Participate in a flag ceremony for your school, religious institution, chartered organization, community or Scouting activity." },
  { id: "2C-8b", rank: "2C", topic: "citizen", label: "Flag respect", task: "Explain the respect due the flag of the United States." },
  { id: "2C-8c", rank: "2C", topic: "citizen", label: "Savings plan", task: "With a parent or guardian, decide on an amount of money to save based on the cost of an item. Write a plan, follow it, then discuss any changes and whether you met your goal." },
  { id: "2C-8d", rank: "2C", topic: "citizen", label: "Comparison shopping", task: "Compare the price of the item from 8c at three different places. After meeting your savings goal, decide whether to use, save or repurpose the money." },
  { id: "2C-8e", rank: "2C", topic: "citizen", label: "Service", task: "Participate in two hours of service through Scoutmaster-approved projects. Explain how your service relates to the Scout Oath." },
  { id: "2C-9a", rank: "2C", topic: "citizen", label: "Three R's", task: "Explain the three R's of personal safety and protection." },
  { id: "2C-9b", rank: "2C", topic: "citizen", label: "Bullying", task: "Describe bullying. Explain the right response if someone is bullying you or another person." },
  { id: "2C-10", rank: "2C", topic: "spirit", label: "Scout spirit", task: "Show Scout spirit. Tell how you have done your duty to God and lived four points of the Scout Law (not the ones used for Tenderfoot 9)." },
];

// Learn cards: one idea each, short.
export const LEARN = {
  camp: [
    "Leave No Trace has 7 principles, always in this order: Plan Ahead and Prepare. Travel and Camp on Durable Surfaces. Dispose of Waste Properly. Leave What You Find. Minimize Campfire Impacts. Respect Wildlife. Be Considerate of Other Visitors.",
    "Pick a campsite in this order: 1) Is it allowed? 2) Is it safe? 3) Is it durable and level? 4) Is it comfortable? Safety beats comfort every time.",
    "La Jolla link: much of the coast is a State Marine Reserve. Nothing leaves it, not even an empty shell. In the tidepools, bare rock and sand are your durable surfaces.",
  ],
  fire: [
    "A fire is right only when the rules allow it, the wind is calm, you have water ready, and there is a real purpose. If a stove can do the job, the stove is the low-impact choice.",
    "San Diego link: hot, dry Santa Ana winds and Red Flag Warnings mean no open fire. Use the provided fire ring, and buy firewood where you burn it.",
    "Tinder is thinner than a match. Kindling is pencil to thumb thick. Fuel is wrist thick and up. Knife rules: safety circle first, cut away from you, close it before you pass or walk.",
    "Lightweight stove = backpacking, where weight matters. Propane two-burner = car camping and cooking for a group.",
    "MyPlate: half the plate fruits and vegetables. Keep raw meat at 40°F or colder, sealed at the bottom of the cooler.",
    "Sheet bend = joins two ropes, even different thicknesses. Bowline = a loop that will not slip or tighten.",
  ],
  nav: [
    "A compass needle is a magnet. It lines up with Earth's magnetic field and points to magnetic north, which is about 11 degrees east of true north in San Diego.",
    "Orient a map: lay the compass along a north-south line on the map, then turn the map and compass together until the needle sits inside the orienting arrow.",
    "No compass in daytime: the shadow-stick method. First shadow mark = west. Second mark = east. At night: the Big Dipper's two pointer stars lead to the North Star.",
    "Coast hazards: crumbling bluff edges, falling rock at the cliff base, slippery algae, rising tides and sneaker waves. Never turn your back on the ocean.",
  ],
  nature: [
    "Evidence counts. Shells, crab molts, urchin skeletons, droppings and your own photos all count toward identifying animals.",
    "Go tidepooling about an hour before low tide, on a day with a low tide near or below zero. In winter, the lowest tides in San Diego come in the afternoon.",
    "Tidepool zones: splash, high, middle, low. Barnacles and snails live high. Mussels in the middle. Sea stars, urchins and anemones low.",
    "Sea lion: ear flaps, barks, walks on flippers (La Jolla Cove). Harbor seal: no ear flaps, wiggles on its belly (Children's Pool). Stay 50 yards back from both.",
  ],
  water: [
    "Reach, throw, row, go. Try them in that order. Each step puts the rescuer at more risk, so 'go' (swimming) is last and only for trained rescuers.",
    "Safe Swim Defense has 8 points. It starts with qualified supervision and a health review, and ends with discipline.",
    "Ocean link: swim in front of a lifeguard tower. In a rip current, swim parallel to shore. Shuffle your feet for stingrays at La Jolla Shores.",
  ],
  aid: [
    "First, check that the scene is safe. A hurt rescuer cannot help anyone.",
    "Hurry cases can kill in minutes: stopped breathing, severe bleeding, stroke and ingested poisoning. Call 911 and act right away.",
    "Heat exhaustion: pale, sweaty, cool skin. Heatstroke: hot, red skin and confusion, and it is life-threatening. Both are fixed by cooling, but heatstroke needs 911.",
    "Beach link: stingray sting = soak in water as hot as can be stood. Sea urchin spine = a puncture wound. Wet clothes plus ocean wind = hypothermia risk.",
  ],
  fit: [
    "7a: at least 30 minutes of activity, 5 days a week, for 4 weeks. Keep a log. 7b: share what was hard and set a specific goal to keep going.",
    "Addiction means your brain craves something so you can't easily stop, even when it hurts you. Teen brains get hooked faster.",
  ],
  citizen: [
    "The three R's: Recognize the danger, Resist it (say no and get away), Report it to a trusted adult.",
    "The flag goes up briskly and comes down slowly. It never touches the ground.",
    "Savings math: cost ÷ amount per week = weeks. Compare total price at three places, including shipping and fees.",
  ],
  spirit: [
    "Scout spirit is about how you actually live. The best answers are true stories from your own life.",
  ],
};

export { QUESTIONS } from "./questions.js";

// ---------- Campout story (scenario chain) ----------
export const STORY = {
  start: "arrive",
  nodes: {
    arrive: { text: "Your patrol arrives at a beach campground on the bluffs north of La Jolla. You get to pick where the tents go. There's a level site set back from the bluff, a spot right at the bluff edge with an amazing ocean view, and a shady spot under a big eucalyptus with a dead branch overhead.", req: "2C-1c",
      choices: [
        { t: "The level site set well back from the bluff edge", ok: true, fb: "Good call. It's legal, safe, durable and level.", next: "wind" },
        { t: "Right at the bluff edge for the ocean view", ok: false, fb: "Sandstone bluffs crumble without warning. Safety beats the view. Pick again.", next: "arrive" },
        { t: "Under the eucalyptus for shade", ok: false, fb: "Dead limbs fall, and eucalyptus is famous for dropping them. Pick again.", next: "arrive" },
      ] },
    wind: { text: "That evening, warm, dry wind starts blowing hard from the east. The ranger has posted a Red Flag Warning. Someone wants a campfire and suggests collecting dead branches around the site.", req: "2C-2a",
      choices: [
        { t: "Collect dead wood and build a fire in the ring", ok: false, fb: "Two problems: a Red Flag Warning means no open fire, and gathering wood isn't allowed. Try again.", next: "wind" },
        { t: "Use the propane stove tonight", ok: true, fb: "Right. Santa Ana wind plus a Red Flag Warning means stove only.", next: "food" },
        { t: "Build a small fire, with a bucket of water ready", ok: false, fb: "A ban is a ban, even for a small fire. Try again.", next: "wind" },
      ] },
    food: { text: "You're cooking breakfast burritos in the morning. The raw sausage has been in the cooler overnight. Where should it be?", req: "2C-2e",
      choices: [
        { t: "On top of the ice, so it stays the coldest", ok: false, fb: "If it leaks, raw juice drips on everything below. Try again.", next: "food" },
        { t: "Sealed in a bag at the bottom of the cooler", ok: true, fb: "Exactly. Nothing drips onto the fruit or tortillas.", next: "tide" },
        { t: "Out on the table, so it's ready to cook fast", ok: false, fb: "Raw meat out of the cooler overnight is in the danger zone. Try again.", next: "food" },
      ] },
    tide: { text: "After breakfast you drive to La Jolla to go tidepooling at Dike Rock. The tide chart says low tide is at 3:10 pm. When should your patrol get to the rocks?", req: "2C-1b",
      choices: [
        { t: "Around 2 pm, about an hour before low tide", ok: true, fb: "Right. You'll have the most rock to explore, and you'll leave as the water comes back.", next: "wave" },
        { t: "At 5 pm, when it's cooler", ok: false, fb: "By then the tide is coming back in and the pools are covered. Try again.", next: "tide" },
        { t: "Any time; the pools are the same all day", ok: false, fb: "Tides change everything. At high tide the pools are underwater. Try again.", next: "tide" },
      ] },
    wave: { text: "Out on the rocks, your buddy is crouched over a pool with his back to the ocean. You see a set of bigger waves rolling in.", req: "2C-3c",
      choices: [
        { t: "Shout to him, and both of you move higher on the rocks", ok: true, fb: "Exactly. Never turn your back on the ocean. Sneaker waves knock people off rocks.", next: "touch" },
        { t: "Nothing; waves never reach this far up", ok: false, fb: "Every so often one wave is much bigger than the rest. Try again.", next: "wave" },
        { t: "Run over to him across the slippery green algae", ok: false, fb: "Running on algae is how people fall. Shout, and move on bare rock. Try again.", next: "wave" },
      ] },
    touch: { text: "In a pool you find a purple sea star stuck to the rock and a crab under a loose stone. A younger Scout wants to take the sea star back to camp to show the others.", req: "2C-4",
      choices: [
        { t: "Pull it off gently and put it in a bucket of seawater", ok: false, fb: "Pulling tears its tube feet, and nothing leaves a marine reserve. Try again.", next: "touch" },
        { t: "Leave it, take a photo, and put the stone back the same way up", ok: true, fb: "Perfect. Your photo counts as evidence for requirement 4, and the animals stay safe.", next: "sealion" },
        { t: "Take it, as long as you bring it back before sunset", ok: false, fb: "Out of the water it can dry out and die. And nothing leaves a reserve. Try again.", next: "touch" },
      ] },
    sealion: { text: "Walking back past La Jolla Cove, people are crowding close to the sea lions for selfies. One pup is alone on the rocks.", req: "2C-4",
      choices: [
        { t: "Stay at least 50 yards back and watch", ok: true, fb: "Right. The pup's mother is likely out fishing and will come back. Crowds can scare her away.", next: "cold" },
        { t: "Move closer to help the lonely pup", ok: false, fb: "A pup alone is usually just waiting for its mother. Getting close can make her abandon it. Try again.", next: "sealion" },
        { t: "Toss it a bit of your sandwich", ok: false, fb: "Feeding wildlife is never OK, and it's against the law here. Try again.", next: "sealion" },
      ] },
    cold: { text: "On the walk back, the Scout who slipped into a pool earlier is soaked, shivering hard and stumbling. The ocean wind is cold.", req: "2C-6a",
      choices: [
        { t: "Hypothermia: get him out of the wind and into dry clothes", ok: true, fb: "Right. Then a warm layer, and a warm drink if he's fully alert.", next: "end" },
        { t: "He's fine; have him jog to warm up", ok: false, fb: "Stumbling is a warning sign. Treat it now. Try again.", next: "cold" },
        { t: "Heat exhaustion: give him water and shade", ok: false, fb: "These are cold signs, not heat signs. Try again.", next: "cold" },
      ] },
    end: { text: "You handled it. Every choice you made matches a requirement you can now explain to your Scoutmaster.", end: true },
  },
};

// ---------- Teach-back: say it out loud, then self-check ----------
export const TEACH = {
  "2C-1b": ["Said all 7 principles in order", "Gave one real example for at least 3 of them", "Connected one to a La Jolla rule (marine reserve, put rocks back, stay back from sea lions)"],
  "2C-1c": ["Said: rules, then safety, then durable ground, then comfort", "Named at least two hazards (bluff edge, dead limbs, high tide line, low spots)", "Mentioned wind and how to pitch the tent", "Said tents go apart from the cooking area"],
  "2C-2a": ["Named when a fire is OK: rules allow, calm wind, water ready, a real purpose", "Named when it's not: bans, Red Flag Warnings, wind, no ring", "Said a stove can be the better choice", "Said where firewood should come from"],
  "2C-2b": ["Explained the safety circle and cutting away from you", "Explained how to pass and close a knife", "Told tinder, kindling and fuel apart by size"],
  "2C-2c": ["Named one fire lay (tepee, lean-to or log cabin)", "Explained minimum impact: existing ring, small fire", "Explained drown, stir, feel until cold out", "Said how to handle cold ashes"],
  "2C-2d": ["Lightweight stove for backpacking; propane for group or car camping", "Outdoors, flat surface, never in a tent", "Check leaks, match before valve, never unattended", "Off and cool before changing fuel"],
  "2C-2e": ["Planned a meal that uses MyPlate's five groups", "Explained why good nutrition matters on a campout", "Explained keeping food at 40°F or colder and raw meat at the bottom", "Explained clean hands, cook through, chill leftovers"],
  "2C-2f": ["Said it joins two ropes, even different sizes", "Gave a real example (longer line, tarp corner)", "Tied it while explaining"],
  "2C-2g": ["Said it's a loop that won't slip or tighten", "Gave a real example (rescue, tree, dock ring)", "Tied it using the rabbit story"],
  "2C-3a": ["Explained the magnetic needle and magnetic north", "Oriented the map step by step", "Mentioned declination (about 11 degrees east)", "Named five map symbols"],
  "2C-3c": ["Named at least 5 hazards", "Gave a prevention habit for each", "Included at least two coastal hazards (bluffs, tide, sneaker waves, slippery rock)"],
  "2C-3d": ["Explained the shadow-stick method and that the first mark is west", "Explained the watch method", "Explained finding the North Star (Big Dipper or Cassiopeia)"],
  "2C-4": ["Named or showed evidence of 10 kinds of wild animals", "Included at least 5 tidepool animals", "Told sea lions and harbor seals apart"],
  "2C-5a": ["Named all 8 points of Safe Swim Defense", "Explained the buddy check", "Named the three ability groups", "Explained what to do in a rip current"],
  "2C-5c": ["Showed a reach with an arm or leg while staying low", "Showed a reach with an object", "Showed a throw that lands past the person, holding your end"],
  "2C-5d": ["Said reach, throw, row, go in order", "Explained that a panicking victim can pull you under", "Explained how a rescue swimmer uses an object and stays out of reach"],
  "2C-6a": ["Covered every item on the list", "Told heat exhaustion apart from heatstroke", "Said 'scene safe first'"],
  "2C-6b": ["Covered all four hurry cases", "Said FAST for stroke", "Gave the Poison Control number"],
  "2C-6c": ["Matched at least 5 injuries to a prevention habit", "Mentioned the buddy system"],
  "2C-6d": ["Said what counts as an emergency", "Explained home vs backcountry", "Listed what to tell responders", "Explained sending two people with a written note"],
  "2C-6e": ["Said: don't become a victim, stay off the road", "Call 911 with location", "Don't move injured people unless there's danger"],
  "2C-7a": ["Said the rule: 30 minutes, 5 days a week, 4 weeks", "Showed your activity log", "Shared a challenge, a success and a specific goal"],
  "2C-7c": ["Explained what addiction is", "Named dangers of drugs, alcohol, tobacco and vaping", "Connected it to 'physically strong, mentally awake, morally straight' and Clean"],
  "2C-8a": ["Named the main commands in order", "Explained the color guard's job", "Said where the US flag goes with other flags"],
  "2C-8b": ["Raise briskly, lower slowly", "Never touches the ground", "Salute in and out of uniform", "Half-staff and retirement"],
  "2C-8c": ["Named your item and its cost", "Explained your weekly amount and target date", "Told what changed and whether you met the goal"],
  "2C-8d": ["Compared the total price at three places", "Explained your choice: use, save or repurpose"],
  "2C-8e": ["Described your 2 hours of approved service", "Connected it to 'help other people at all times'"],
  "2C-9a": ["Named and explained Recognize, Resist, Report", "Said to report even if told to keep a secret"],
  "2C-9b": ["Defined bullying: on purpose, repeated, power difference", "Named types including cyberbullying", "Response for yourself and as an upstander"],
};

// Scout spirit coaching. Honest answers only; never pretend a belief.
export const SPIRIT = {
  intro: "Requirement 10 has no quiz. The best answer is true and comes from your own life. Never say you believe something you don't. A good Scoutmaster wants honesty, and the Scout Law starts with Trustworthy.",
  duty: [
    "Talk about what 'duty' means to you in true words: living by your conscience, doing what's right when no one is watching, and owing something to the world and the people in it.",
    "Reverent in the Scout Law includes respecting other people's beliefs. Give a real example: being respectful during a troop prayer or grace, or asking a friend about their faith with real curiosity.",
    "Name something that makes you feel wonder or humility: a whole hidden world in one tidepool, gray whales passing on a trip thousands of miles long, the sun setting over the Pacific.",
    "Give one example of service: helping someone without being asked.",
  ],
  sample: "One way to say it honestly: \"My family isn't religious, so for me this part of the Oath means living by my conscience and being part of something bigger than myself. When I'm at the tidepools or looking out at the ocean, I feel how small I am and how much I owe to other people and to the natural world. I also take Reverent seriously by respecting the faith of people around me, including at troop services.\"",
  tip: "If you're asked directly about your beliefs, give an honest, respectful answer. Your parent can also talk with the Scoutmaster ahead of time.",
  lawPoints: ["Trustworthy", "Loyal", "Helpful", "Friendly", "Courteous", "Kind", "Obedient", "Cheerful", "Thrifty", "Brave", "Clean", "Reverent"],
  lawPrompt: "Pick four points you did NOT use for Tenderfoot 9. For each one, have a real story ready: what happened, what you did, and why it shows that point.",
};
