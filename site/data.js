// Trail Ready content bank.
// Every question stores the correct answer separately from the wrong answers.
// Answer positions are assigned at render time by engine.js (balanced slots).

export const TOPICS = {
  camp:   { name: "Camping & Leave No Trace", icon: "⛺", color: "#2dd4bf" },
  fire:   { name: "Fire, Stoves & Knots",     icon: "🔥", color: "#f59e0b" },
  nav:    { name: "Navigation",               icon: "🧭", color: "#60a5fa" },
  nature: { name: "Nature & Weather",         icon: "🌵", color: "#86efac" },
  water:  { name: "Water Safety",             icon: "🌊", color: "#38bdf8" },
  aid:    { name: "First Aid",                icon: "⛑️", color: "#ef4444" },
  citizen:{ name: "Citizenship & Safety",     icon: "🇺🇸", color: "#818cf8" },
  spirit: { name: "Scout Spirit",             icon: "🧡", color: "#fcd34d" },
};

// Requirements. rank: "2C" = Second Class, "1C" = First Class.
export const REQS = [
  { id: "2C-1b", rank: "2C", topic: "camp", label: "Leave No Trace", task: "Recite the seven Leave No Trace principles from memory. Explain how you follow them on outings." },
  { id: "2C-1c", rank: "2C", topic: "camp", label: "Choose a patrol site", task: "On a campout, choose a patrol site and recommend it to your leader. Explain what you looked for in the site and in a tent spot." },
  { id: "2C-2a", rank: "2C", topic: "fire", label: "When to have a fire", task: "Explain when it is appropriate to use a fire for cooking or other purposes, and when it is not." },
  { id: "2C-2d", rank: "2C", topic: "fire", label: "Stoves", task: "Explain when to use a lightweight stove and when to use a propane stove. Set one up, light it if allowed, and describe the safety steps." },
  { id: "2C-2f", rank: "2C", topic: "fire", label: "Sheet bend", task: "Tie a sheet bend. Describe a situation where you would use it." },
  { id: "2C-2g", rank: "2C", topic: "fire", label: "Bowline", task: "Tie a bowline. Describe a situation where you would use it." },
  { id: "2C-3a", rank: "2C", topic: "nav", label: "Compass and map", task: "Show how a compass works and how to orient a map. Identify five map symbols." },
  { id: "2C-3c", rank: "2C", topic: "nav", label: "Hike hazards", task: "Describe hazards or injuries you might meet on a hike and how to help prevent them." },
  { id: "2C-3d", rank: "2C", topic: "nav", label: "Directions without a compass", task: "Show how to find directions during the day and at night without a compass or electronic device." },
  { id: "2C-4",  rank: "2C", topic: "nature", label: "10 wild animals", task: "Identify or show evidence of at least 10 kinds of wild animals in your area or campsite." },
  { id: "2C-5a", rank: "2C", topic: "water", label: "Safe swim", task: "Explain the precautions for a safe swim." },
  { id: "2C-5d", rank: "2C", topic: "water", label: "Reach and throw", task: "Explain why reaching or throwing rescues are better than swimming rescues, and how a rescue swimmer avoids contact with the victim." },
  { id: "2C-6a", rank: "2C", topic: "aid", label: "First aid", task: "Demonstrate first aid for: object in the eye, animal bite, puncture wounds, serious burns, heat exhaustion, shock, heatstroke, dehydration, hypothermia, hyperventilation." },
  { id: "2C-6b", rank: "2C", topic: "aid", label: "Hurry cases", task: "Show what to do for hurry cases: stopped breathing, stroke, severe bleeding, ingested poisoning." },
  { id: "2C-6c", rank: "2C", topic: "aid", label: "Preventing injuries", task: "Tell what you can do on a campout or hike to prevent the injuries in 6a and 6b." },
  { id: "2C-6d", rank: "2C", topic: "aid", label: "Emergency response", task: "Explain how to respond to an emergency at home and in the backcountry. What counts as an emergency, and what information do you give responders?" },
  { id: "2C-6e", rank: "2C", topic: "aid", label: "Vehicle accident", task: "Describe how to respond if you come upon a vehicle accident." },
  { id: "2C-8b", rank: "2C", topic: "citizen", label: "Flag respect", task: "Explain the respect due the flag of the United States." },
  { id: "2C-9a", rank: "2C", topic: "citizen", label: "Three R's", task: "Explain the three R's of personal safety and protection." },
  { id: "2C-9b", rank: "2C", topic: "citizen", label: "Bullying", task: "Describe bullying. Explain the right response if someone is bullying you or another person." },
  { id: "2C-10", rank: "2C", topic: "spirit", label: "Scout spirit", task: "Show Scout spirit. Tell how you have done your duty to God and lived four points of the Scout Law (not the ones used for Tenderfoot 9)." },
  { id: "1C-1b", rank: "1C", topic: "camp", label: "Explain each LNT principle", task: "Explain each Leave No Trace principle and tell how you practiced it on a campout." },
  { id: "1C-3a", rank: "1C", topic: "fire", label: "When to use lashings", task: "Discuss when you should and should not use lashings." },
  { id: "1C-5a", rank: "1C", topic: "nature", label: "10 native plants", task: "Identify or show evidence of at least 10 kinds of native plants in your area or campsite." },
  { id: "1C-5w", rank: "1C", topic: "nature", label: "Weather", task: "Name ways to get a forecast and why it matters. Describe natural signs of hazardous weather, the dangers, and what to do. Describe extreme weather in your area." },
  { id: "1C-6b", rank: "1C", topic: "water", label: "Safety Afloat", task: "Tell what precautions must be taken for a safe trip afloat." },
  { id: "1C-7c", rank: "1C", topic: "aid", label: "Heart attack and CPR", task: "Tell the most common signs of a heart attack. Explain the steps of CPR." },
  { id: "1C-7f", rank: "1C", topic: "aid", label: "Safe drinking water", task: "Explain how to get safe drinking water in an emergency." },
];

// Learn cards: one idea each, short.
export const LEARN = {
  camp: [
    "Leave No Trace has 7 principles, always in this order: Plan Ahead and Prepare. Travel and Camp on Durable Surfaces. Dispose of Waste Properly. Leave What You Find. Minimize Campfire Impacts. Respect Wildlife. Be Considerate of Other Visitors.",
    "Pick a campsite in this order: 1) Is it allowed? 2) Is it safe? 3) Is it durable and level? 4) Is it comfortable? Safety beats comfort every time.",
    "Joshua Tree link: the dark bumpy crust on desert soil is alive (cryptobiotic soil). One footstep can take decades to heal. That is why 'durable surfaces' matters so much here.",
  ],
  fire: [
    "A fire is right only when the rules allow it, the wind is calm, you have water ready, and there is a real purpose. If a stove can do the job, the stove is the low-impact choice.",
    "Joshua Tree link: fires only in campground fire grates, and you may not gather any wood, dead or alive. Bring your own firewood.",
    "Lightweight stove = backpacking, where weight matters. Propane two-burner = car camping and cooking for a group.",
    "Sheet bend = joins two ropes, even different thicknesses. Bowline = a loop that will not slip or tighten.",
  ],
  nav: [
    "A compass needle is a magnet. It lines up with Earth's magnetic field and points to magnetic north, which is about 11 degrees east of true north at Joshua Tree.",
    "Orient a map: lay the compass along a north-south line on the map, then turn the map and compass together until the needle sits inside the orienting arrow.",
    "No compass in daytime: the shadow-stick method. First shadow mark = west. Second mark = east. At night: the Big Dipper's two pointer stars lead to the North Star.",
  ],
  nature: [
    "Evidence counts. Tracks, scat, burrows, nests and your own photos all count toward identifying animals.",
    "Desert web: cactus wrens nest in cholla. Woodrats build nests with cholla. Kangaroo rats eat seeds and get their water from them. Yucca moths are the only pollinator of the Joshua tree.",
    "Towering clouds with flat anvil tops mean lightning and flash flood danger. Get out of washes and off high, exposed places.",
  ],
  water: [
    "Reach, throw, row, go. Try them in that order. Each step puts the rescuer at more risk, so 'go' (swimming) is last and only for trained rescuers.",
    "Safe Swim Defense has 8 points. Safety Afloat (boating) has 9. Both start with qualified supervision and a health review, and both end with discipline.",
  ],
  aid: [
    "First, check that the scene is safe. A hurt rescuer cannot help anyone.",
    "Hurry cases can kill in minutes: stopped breathing, severe bleeding, stroke and ingested poisoning. Call 911 and act right away.",
    "Heat exhaustion: pale, sweaty, cool skin. Heatstroke: hot, red skin and confusion, and it is life-threatening. Both are fixed by cooling, but heatstroke needs 911.",
    "Desert link: days can be hot and nights can be near freezing. The same trip can cause dehydration in the afternoon and hypothermia at night.",
  ],
  citizen: [
    "The three R's: Recognize the danger, Resist it (say no and get away), Report it to a trusted adult.",
    "The flag goes up briskly and comes down slowly. It never touches the ground.",
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
    arrive: { text: "Your patrol pulls into the Joshua Tree campground at 3 pm. You get to pick where the tents go. There is a level tent pad beside a big boulder, a soft sandy dip in a dry wash, and a spot under a dead Joshua tree limb.", req: "2C-1c",
      choices: [
        { t: "The level pad beside the boulder", ok: true, fb: "Good call. It's legal, safe, durable, and the boulder blocks wind.", next: "wind" },
        { t: "The soft sand in the wash", ok: false, fb: "Washes are flash flood paths, even with no rain where you are. Pick again.", next: "arrive" },
        { t: "Under the dead limb for shade", ok: false, fb: "Dead limbs fall in wind. Safety beats shade. Pick again.", next: "arrive" },
      ] },
    wind: { text: "The wind picks up hard. Your tent door is facing straight into it and only two stakes are in.", req: "2C-1c",
      choices: [
        { t: "Leave it; the wind will die down", ok: false, fb: "Desert wind can flatten or carry off a tent. Try again.", next: "wind" },
        { t: "Turn the door away from the wind and stake and guy every line", ok: true, fb: "Exactly. The tent is now solid.", next: "fire" },
        { t: "Pile sand on the tent floor inside", ok: false, fb: "It won't hold, and the door still catches wind. Try again.", next: "wind" },
      ] },
    fire: { text: "Time to cook. Gusts are still strong. Someone wants a campfire and suggests collecting dead branches around the site.", req: "2C-2a",
      choices: [
        { t: "Collect dead wood and build a big fire", ok: false, fb: "Two problems: gathering wood is not allowed here, and wind spreads sparks. Try again.", next: "fire" },
        { t: "Cook on the propane stove tonight and save the brought firewood for a calm night", ok: true, fb: "Right. Stove in wind, and no wood gathering at Joshua Tree.", next: "cholla" },
        { t: "Build the fire outside the grate, where there's more room", ok: false, fb: "Fires go only in the campground grate. Try again.", next: "fire" },
      ] },
    cholla: { text: "After dinner your buddy brushes a teddy bear cholla. A spiny segment is stuck to his leg.", req: "2C-3c",
      choices: [
        { t: "Grab it with your hand and yank", ok: false, fb: "The barbed spines will stick in your hand too. Try again.", next: "cholla" },
        { t: "Slide a comb under it and flick it away, then tweezers for leftover spines", ok: true, fb: "Perfect. Every desert hiker should carry a comb.", next: "north" },
        { t: "Leave it until morning", ok: false, fb: "It will hurt more and work deeper. Deal with it now.", next: "cholla" },
      ] },
    north: { text: "It's dark. Your leader asks you to point north without a compass or phone. The Big Dipper is low behind the hills.", req: "2C-3d",
      choices: [
        { t: "Find Cassiopeia (the W) and use it to find the North Star", ok: true, fb: "Yes. Cassiopeia sits across from the Big Dipper, around Polaris.", next: "heat" },
        { t: "Point toward where the sun set", ok: false, fb: "The sun set in the west, not the north. Try again.", next: "north" },
        { t: "Point to the brightest star in the sky", ok: false, fb: "Polaris isn't the brightest star. Try again.", next: "north" },
      ] },
    heat: { text: "Next day on the hike, a Scout is pale, sweaty, dizzy and says he feels sick.", req: "2C-6a",
      choices: [
        { t: "Heat exhaustion: shade, lie down with feet up, cool cloths, sip water", ok: true, fb: "Right. Keep watching. Hot red skin and confusion would mean heatstroke.", next: "worse" },
        { t: "Hypothermia: wrap him in a sleeping bag", ok: false, fb: "These are heat signs, not cold signs. Try again.", next: "heat" },
        { t: "Have him hike faster to get back to camp", ok: false, fb: "Exertion makes heat illness worse. Try again.", next: "heat" },
      ] },
    worse: { text: "Twenty minutes later his skin is hot and red and he is confused. There's no cell signal.", req: "2C-6d",
      choices: [
        { t: "Cool him fast, and send two Scouts with a written note to get help", ok: true, fb: "Exactly. Heatstroke is life-threatening. Two messengers, written details.", next: "end" },
        { t: "Let him nap it off", ok: false, fb: "Confusion means his brain is affected. This is an emergency. Try again.", next: "worse" },
        { t: "Send one Scout running alone with no note", ok: false, fb: "Send two, with a written note of location and condition. Try again.", next: "worse" },
      ] },
    end: { text: "You handled it. Every choice you made matches a requirement you can now explain to your Scoutmaster.", end: true },
  },
};

// ---------- Teach-back: say it out loud, then self-check ----------
export const TEACH = {
  "2C-1b": ["Said all 7 principles in order", "Gave one real example for at least 3 of them", "Connected one to a Joshua Tree rule (water, soil crust, no wood gathering)"],
  "2C-1c": ["Said: rules, then safety, then durable ground, then comfort", "Named the wash and flash flood danger", "Mentioned wind, dead limbs, cholla and cold nights", "Said tents go apart from the cooking area"],
  "2C-2a": ["Named when a fire is OK: rules allow, calm wind, water ready, a real purpose", "Named when it's not: bans, wind, no ring, no legal wood", "Said a stove can be the better choice", "Mentioned Joshua Tree: grates only, bring your own wood"],
  "2C-2d": ["Lightweight stove for backpacking; propane for group or car camping", "Outdoors, flat surface, never in a tent", "Check leaks, match before valve, never unattended", "Off and cool before changing fuel"],
  "2C-2f": ["Said it joins two ropes, even different sizes", "Gave a real example (longer line, tarp corner)", "Tied it while explaining"],
  "2C-2g": ["Said it's a loop that won't slip or tighten", "Gave a real example (rescue, tree, bear bag)", "Tied it using the rabbit story"],
  "2C-3a": ["Explained the magnetic needle and magnetic north", "Oriented the map step by step", "Mentioned declination (about 11 degrees east)", "Named five map symbols"],
  "2C-3c": ["Named at least 5 hazards", "Gave a prevention habit for each", "Included at least one desert-specific hazard (cholla, flash flood, mines)"],
  "2C-3d": ["Explained the shadow-stick method and that the first mark is west", "Explained the watch method", "Explained finding the North Star (Big Dipper or Cassiopeia)"],
  "2C-5a": ["Named all 8 points of Safe Swim Defense", "Explained the buddy check", "Named the three ability groups"],
  "2C-5d": ["Said reach, throw, row, go in order", "Explained that a panicking victim can pull you under", "Explained how a rescue swimmer uses an object and stays out of reach"],
  "2C-6a": ["Covered every item on the list", "Told heat exhaustion apart from heatstroke", "Said 'scene safe first'"],
  "2C-6b": ["Covered all four hurry cases", "Said FAST for stroke", "Gave the Poison Control number"],
  "2C-6c": ["Matched at least 5 injuries to a prevention habit", "Mentioned the buddy system"],
  "2C-6d": ["Said what counts as an emergency", "Explained home vs backcountry", "Listed what to tell responders", "Explained sending two people with a written note"],
  "2C-6e": ["Said: don't become a victim, stay off the road", "Call 911 with location", "Don't move injured people unless there's danger"],
  "2C-8b": ["Raise briskly, lower slowly", "Never touches the ground", "Salute in and out of uniform", "Half-staff and retirement"],
  "2C-9a": ["Named and explained Recognize, Resist, Report", "Said to report even if told to keep a secret"],
  "2C-9b": ["Defined bullying: on purpose, repeated, power difference", "Named types including cyberbullying", "Response for yourself and as an upstander"],
  "1C-1b": ["Explained each of the 7 principles in your own words", "Told how you practiced each on this campout"],
  "1C-3a": ["When to lash: allowed camp, brought poles", "When not to: live trees, rules, Leave No Trace"],
  "1C-5a": ["Pointed out or showed evidence of 10 native plants"],
  "1C-5w": ["Two forecast sources and why they matter", "Three natural warning signs and the right action", "Desert extremes and a safety plan"],
  "1C-6b": ["Named all 9 points of Safety Afloat"],
  "1C-7c": ["Named the common signs of a heart attack", "Explained the CPR steps in order"],
  "1C-7f": ["Boil 1 minute (3 above 6,500 ft)", "Chemicals or a filter", "About a gallon per person per day"],
};

// Scout spirit coaching. Honest answers only; never pretend a belief.
export const SPIRIT = {
  intro: "Requirement 10 has no quiz. The best answer is true and comes from your own life. Never say you believe something you don't. A good Scoutmaster wants honesty, and the Scout Law starts with Trustworthy.",
  duty: [
    "Talk about what 'duty' means to you in true words: living by your conscience, doing what's right when no one is watching, and owing something to the world and the people in it.",
    "Reverent in the Scout Law includes respecting other people's beliefs. Give a real example: being respectful during a troop prayer or grace, or asking a friend about their faith with real curiosity.",
    "Name something that makes you feel wonder or humility: the Milky Way at Joshua Tree, a 1,000-year-old Joshua tree, how a yucca moth and a tree depend on each other.",
    "Give one example of service: helping someone without being asked.",
  ],
  sample: "One way to say it honestly: \"My family isn't religious, so for me this part of the Oath means living by my conscience and being part of something bigger than myself. Out here, looking at the stars, I feel how small I am and how much I owe to other people and to the land. I also take Reverent seriously by respecting the faith of people around me, including at troop services.\"",
  tip: "If you're asked directly about your beliefs, give an honest, respectful answer. Your parent can also talk with the Scoutmaster ahead of time.",
  lawPoints: ["Trustworthy", "Loyal", "Helpful", "Friendly", "Courteous", "Kind", "Obedient", "Cheerful", "Thrifty", "Brave", "Clean", "Reverent"],
  lawPrompt: "Pick four points you did NOT use for Tenderfoot 9. For each one, have a real story ready: what happened, what you did, and why it shows that point.",
};
