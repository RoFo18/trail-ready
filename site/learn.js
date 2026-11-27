// Sections, requirements and what to learn for each.
// Voice: a down-to-earth junior high teacher. Short, a little dry, never preachy.
// A card is { h: heading, p: [lines] }. "before" holds knowledge the requirement depends on.

export const SECTIONS = [
  { name: "Camping", items: ["lnt", "campsite"] },
  { name: "Fire and stoves", items: ["whenfire", "firewood", "buildfire", "stoves", "knots"] },
  { name: "Navigation", items: ["compass", "nocompass", "hazards"] },
  { name: "Nature", items: ["animals"] },
  { name: "Aquatics", items: ["safeswim", "rescue", "noswim"] },
  { name: "First aid", items: ["firstaid", "hurry", "prevent", "emergency", "vehicle"] },
  { name: "Citizenship", items: ["ceremony", "flag"] },
  { name: "Personal safety", items: ["threer", "bullying"] },
];

export const REQS = {
  lnt: {
    name: "Leave No Trace",
    learn: [
      { h: "The seven principles", p: ["Plan Ahead and Prepare", "Travel and Camp on Durable Surfaces", "Dispose of Waste Properly", "Leave What You Find", "Minimize Campfire Impacts", "Respect Wildlife", "Be Considerate of Other Visitors"] },
      { h: "Cheat code to remember all seven", p: ["Please Don't Dump Litter, Make Rangers Beam.", "Plan, Durable, Dispose, Leave, Minimize, Respect, Be considerate."] },
      { h: "What they look like out there", p: ["Plan: check weather, tides and rules before you go.", "Durable: trails, rock, gravel, dry sand. Single file, middle of the trail, even when it's muddy.", "Waste: pack it all out. Orange peels and apple cores count.", "Leave what you find: shells, rocks, plants and old stuff stay put.", "Campfires: stove or an existing ring. Keep it small.", "Wildlife: watch from a distance. Feeding them is not a favor.", "Other visitors: keep it down after dark. Share the trail."] },
    ],
  },
  campsite: {
    name: "Choosing a campsite",
    learn: [
      { h: "Ask these four", p: ["Is camping allowed here?", "Is it safe?", "Is the ground durable and level?", "Is it comfy?", "Safety beats comfy. Every time."] },
      { h: "Safe means", p: ["Not in a dry wash or low spot. Rain miles away can send a flood through it.", "No dead limbs overhead, no loose rock above.", "Back from cliff and bluff edges.", "On a beach, above the high-tide line."] },
      { h: "Look down before you pitch", p: ["Ants, sharp rocks, roots, and low spots where water or cold air collects.", "Bare, durable ground. Don't flatten plants."] },
      { h: "Layout and weather", p: ["Tents spread out, away from cooking and the fire.", "Door away from the wind. Stake and guy out every line, even if it's calm now.", "Cold night? Skip the lowest ground. Cold air sinks there and waits for you."] },
    ],
  },
  whenfire: {
    name: "When to use a fire",
    learn: [
      { h: "Yes to a fire when", p: ["The rules allow it and there's no fire ban.", "There's an existing ring or grill.", "The wind is calm.", "Water and a shovel are already there.", "You actually need it: cooking, warmth, or a campfire program."] },
      { h: "No fire when", p: ["There's a ban or a Red Flag Warning.", "It's windy or very dry.", "There's no ring, or no wood you're allowed to burn.", "A stove would do the job. (It usually would.)"] },
      { h: "Firewood", p: ["Buy it near where you'll burn it, so you don't haul bugs and disease to a new forest.", "Trash and food scraps don't go in the fire. Pack them out."] },
    ],
  },
  firewood: {
    name: "Knife, tinder, kindling and fuel",
    learn: [
      { h: "Three sizes. Get these straight.", img: { src: "img/firewood.svg" }, p: ["Tinder: thinner than a match. Dry grass, bark fluff, wood shavings.", "Kindling: pencil to thumb thick.", "Fuel wood: wrist thick and bigger."] },
      { h: "How they hand off", p: ["Match lights tinder. Tinder lights kindling. Kindling lights fuel.", "Skip a size and the fire dies. Every time.", "All of it has to be dry. Damp wood just smokes at you."] },
      { h: "Knife rules", p: ["Check your safety circle: nobody within arm's reach.", "Cut away from your body.", "Close it before you hand it over.", "It's a knife, not a pry bar.", "Saw or axe only for wood too thick to snap, with clear space and an adult's OK."] },
    ],
  },
  buildfire: {
    name: "Building and putting out a fire",
    before: [
      { h: "Fire materials", p: ["Tinder: thinner than a match.", "Kindling: pencil to thumb thick.", "Fuel wood: wrist thick and bigger."] },
    ],
    learn: [
      { h: "In order. This one matters.", p: ["1. Check the rules and use the fire ring.", "2. Set out water and a shovel.", "3. Prepare tinder, kindling and fuel.", "4. Light the tinder, add kindling, then fuel.", "5. Drown, stir, drown again until it's cold.", "6. Ashes: leave them in the ring or scatter them, whatever the site rules say."] },
      { h: "Three fire lays", img: { src: "img/firelays.svg" }, p: ["Tepee: kindling leaned in a cone over tinder. Fast and hot.", "Log cabin: sticks stacked in a crisscross square. Steady coals for cooking.", "Lean-to: kindling leaned against one bigger stick. Good in wind.", "Leave gaps. Fire needs to breathe too."] },
      { h: "Minimum impact", p: ["Small fire, existing ring, burn the wood all the way to ash.", "Cold out means you hold your hand near the ashes and feel nothing.", "Don't bury a fire in sand. The coals stay hot for hours, and somebody's bare foot finds them."] },
    ],
  },
  stoves: {
    name: "Stoves",
    learn: [
      { h: "Which stove", p: ["Lightweight canister stove: backpacking, when you carry everything.", "Two-burner propane stove: car camping, cooking for the whole patrol."] },
      { h: "Set up and light, in order. Order matters here.", p: ["1. Get an adult's OK. Flat, stable ground, outdoors.", "2. Check the fittings are tight and nothing leaks.", "3. Strike the match first.", "4. Then open the valve slowly and light it.", "5. Never walk away from it. When you're done, fuel off and let it cool."] },
      { h: "Don't be that Scout", p: ["Never use a stove in a tent. Fire, plus carbon monoxide you can't smell.", "Change a canister only when the stove is off and cool.", "Smell gas? Fuel off. Don't light it."] },
    ],
  },
  knots: {
    name: "Sheet bend and bowline",
    learn: [
      { h: "Sheet bend", img: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Sheet_Bend_-_ABoK_1431_-_USCG.jpg/960px-Sheet_Bend_-_ABoK_1431_-_USCG.jpg", credit: "Photo: USCG, CC0, via Wikimedia Commons", ratio: "5 / 2", pos: "50% 61%" }, p: ["Joins two ropes, even when one is thicker than the other.", "Use it to add a thin cord to a thicker rope, or tie a line to a tarp corner.", "Why not a square knot? It slips when the ropes are different sizes."] },
      { h: "Bowline", img: { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Knot-bowline-ABoK_1010-USCG.jpg/960px-Knot-bowline-ABoK_1010-USCG.jpg", credit: "Photo: USCG, CC BY-SA 4.0, via Wikimedia Commons", ratio: "16 / 9", pos: "62% 53%" }, p: ["A loop at the end of a rope that won't slip or tighten.", "Use it for a rescue loop around someone's chest, or a loop around a tree or post.", "Weak spot: it can work loose when nothing is pulling on it."] },
      { h: "Which one?", p: ["Two ropes to join: sheet bend.", "A loop that has to hold its size: bowline.", "You'll tie them for real with your patrol. This is about knowing when to grab which."] },
    ],
  },
  compass: {
    name: "Compass and map",
    learn: [
      { h: "How a compass works", p: ["The needle is a magnet. It lines up with Earth's magnetic field and points to magnetic north.", "Metal messes with it. Step away from the car. And the knife."] },
      { h: "The parts", img: { src: "img/compass.svg" }, p: ["Magnetic needle: points to magnetic north.", "Direction-of-travel arrow: points where you want to go.", "Housing (bezel): turns to set a bearing in degrees.", "Orienting arrow: put the red needle in it. 'Red in the shed.'"] },
      { h: "Orient a map, in order. Order matters.", p: ["1. Lay the map flat.", "2. Set the housing to north (0°).", "3. Compass edge along a north-south line, arrow to the top.", "4. Turn the map and compass together until red is in the shed.", "5. Adjust for declination: about 11° east in San Diego."] },
      { h: "Bearings", p: ["0° north, 90° east, 180° south, 270° west.", "Shoot a bearing: point the travel arrow at a landmark, turn the housing until red is in the shed, read the number.", "Follow one: set it, turn your body until red is in the shed, walk to something straight ahead."] },
      { h: "Map symbols", img: { src: "img/mapsymbols.svg" }, p: ["Brown contour lines: elevation. Squished together means steep.", "Blue: water. Green: vegetation.", "Black dashed line: trail.", "Crossed picks: mine or quarry.", "Contour interval: how much height between one line and the next."] },
    ],
  },
  nocompass: {
    name: "Directions without a compass",
    learn: [
      { h: "Shadow stick, in order", img: { src: "img/shadowstick.svg" }, p: ["1. Push a stick straight up in flat, sunny ground.", "2. Mark the tip of its shadow.", "3. Wait about 15 minutes.", "4. Mark the new tip.", "5. First mark is west, second is east."] },
      { h: "Watch method", p: ["Point the hour hand at the sun.", "South is halfway between the hour hand and 12.", "Daylight saving time? Use the 1 instead of the 12."] },
      { h: "At night", img: { src: "img/dipper.svg" }, p: ["The two stars at the end of the Big Dipper's cup point to the North Star.", "Dipper too low? Find Cassiopeia, the W, on the other side of the North Star.", "Orion rises in the east. His sword points roughly south."] },
      { h: "The sun", p: ["Up in the east, down in the west.", "In the afternoon it hangs toward the southwest."] },
    ],
  },
  hazards: {
    name: "Hike hazards",
    learn: [
      { h: "Coast", p: ["Crumbling bluff edges: stay on trail, back from the edge. The edge doesn't care how close you thought you were.", "Slippery algae: step on bare, dry rock.", "Rising tide: check the tide chart and watch the time.", "Sneaker waves: never turn your back on the ocean."] },
      { h: "Trail", p: ["Rattlesnakes: stay on trail and watch where hands and feet go.", "Poison oak: leaves of three, let it be.", "Twisted ankles: watch your footing.", "Lost? Stop, regroup, check the map. Wandering makes it worse."] },
      { h: "Your body", p: ["Drink before you're thirsty. Thirst means you're already behind.", "Storm over the mountains while you're in a canyon: climb to higher ground. Flash floods don't text first."] },
    ],
  },
  animals: {
    name: "Wild animals",
    learn: [
      { h: "How to ID an animal", p: ["Size, shape, color or pattern, what it's doing, where it lives.", "A different kind means a different type, like a sea star versus a sea urchin.", "Evidence counts: shells, molts, tracks, your own photos. Not a photo you found online."] },
      { h: "Tidepool zones, top to bottom", p: ["Splash zone: periwinkle snails.", "High zone: acorn barnacles.", "Middle zone: mussels and gooseneck barnacles.", "Low zone: sea stars, urchins, anemones."] },
      { h: "Tidepool animals", p: ["Ochre sea star: five thick, bumpy arms, purple or orange.", "Purple sea urchin: a ball of purple spines in a rock hole.", "Aggregating anemone: carpets of small anemones covered in sand.", "Giant green anemone: big, green, soft tentacles.", "Hermit crab: lives in a borrowed snail shell.", "Striped shore crab: dark with green stripes, runs sideways into cracks.", "California mussel: blue-black paired shells in beds.", "Gooseneck barnacle: on rubbery stalks.", "Owl limpet: big low cone stuck to rock.", "Black turban snail: dark, rounded, coiled.", "California sea hare: big soft slug that squirts purple ink. Rude, but harmless.", "Two-spot octopus: a blue ring on each side of its head."] },
      { h: "Along the coast", p: ["California sea lion: ear flaps, barks, walks on its flippers.", "Harbor seal: no ear flaps, spotted, scoots on its belly.", "Brown pelican: huge bill with a pouch.", "Garibaldi: bright orange fish.", "Stay at least 50 yards from sea lions and seals. They bite, and they win."] },
    ],
  },
  safeswim: {
    name: "Safe swim",
    learn: [
      { h: "The eight points of Safe Swim Defense", p: ["Qualified supervision", "Personal health review", "Safe area", "Response personnel (lifeguards)", "Lookout", "Ability groups", "Buddy system", "Discipline", "Know all eight. The order isn't the test."] },
      { h: "The details they'll ask about", p: ["Ability groups: nonswimmer, beginner, swimmer.", "Buddy check: buddies grab hands and raise them so the leader can count.", "The lookout watches the whole area for trouble."] },
      { h: "In the ocean", p: ["Rip current: stay calm and swim parallel to the beach. Fighting it straight in just wears you out.", "Stingrays: shuffle your feet when you wade.", "Never swim alone or out past the waves."] },
    ],
  },
  rescue: {
    name: "Reaching and throwing rescues",
    before: [
      { h: "Reach, throw, row, go", p: ["Try them in that order. Each step puts the rescuer in more danger."] },
    ],
    learn: [
      { h: "Reaching rescue", p: ["Get low first: lie down or brace on solid ground, so they can't pull you in.", "Reach with a pole, paddle, towel, shirt or branch.", "Tell them to grab it, then pull them in slowly, staying low.", "Shout that help is coming. It calms people down."] },
      { h: "Throwing rescue", p: ["Hold onto the end of the rope. Throw underhand.", "Aim just past the person, so the rope lands across their reach.", "Missed? Pull it back fast and throw again.", "Still can't reach them? Get help and keep trying from shore. You don't go in."] },
      { h: "Good tools", p: ["Ring buoy, throw bag, rope, pole, paddle, towel, branch.", "Not a heavy rock. They're drowning, not playing catch."] },
    ],
  },
  noswim: {
    name: "Why not swim out",
    learn: [
      { h: "Reach, throw, row, go", p: ["Swimming out is last, and only for trained rescuers."] },
      { h: "Why not swim", p: ["A panicking swimmer grabs anything nearby, including you, and can pull you both under.", "Reaching and throwing keep you on dry land."] },
      { h: "How a rescue swimmer stays safe", p: ["Pushes a rescue tube or float to the victim.", "Stays out of grabbing range until the victim holds the float."] },
    ],
  },
  firstaid: {
    name: "First aid",
    learn: [
      { h: "Something in the eye", img: { src: "img/eye.svg" }, p: ["Don't rub. Flush it with clean water.", "Still stuck? Cover the eye loosely and get medical help."] },
      { h: "Animal bite", p: ["Wash with soap and water, cover it, see a doctor.", "Never suck the wound. That's a movie thing."] },
      { h: "Puncture wounds", p: ["Splinter: clean tweezers, wash, bandage.", "Nail: let it bleed a little, wash, bandage, check tetanus.", "Fishhook past the barb: leave it for a trained adult or a doctor.", "Stingray sting: soak in water as hot as the person can stand."] },
      { h: "Serious burn, in order", img: { src: "img/burn.svg" }, p: ["1. Get away from the heat.", "2. Cool with cool water for at least 10 minutes.", "3. Cover loosely with a sterile dressing.", "4. Treat for shock and get medical help.", "Don't pop the blisters."] },
      { h: "Heat", img: { src: "img/heat.svg" }, p: ["Heat exhaustion: pale, cool, sweaty, dizzy, but awake and talking. Shade, lie down, feet up, cool cloths, sips of water.", "Heatstroke: hot, red skin and confused. Call 911 and cool them fast. This one is serious.", "Dehydration: rest in the shade and slowly sip water or a sports drink."] },
      { h: "Shock, in order", img: { src: "img/shock.svg" }, p: ["1. Make sure the scene is safe; call for help.", "2. Have the person lie down.", "3. Raise the feet about 12 inches if it doesn't hurt.", "4. Keep them warm.", "5. Nothing to eat or drink. Keep checking on them."] },
      { h: "Hypothermia, in order", img: { src: "img/hypothermia.svg" }, p: ["Wet plus wind chills you fast, even on a nice day.", "1. Get out of wind and wet.", "2. Change into dry clothes.", "3. Sleeping bag, off the cold ground.", "4. Warm, sweet drink if fully alert.", "5. Medical help if severe."] },
      { h: "Hyperventilation", p: ["Super fast breathing and tingling hands, usually after a scare.", "Stay calm with them and coach slow breaths."] },
    ],
  },
  hurry: {
    name: "Hurry cases",
    before: [
      { h: "Before anything", p: ["Check that the scene is safe. Two patients is not an improvement."] },
    ],
    learn: [
      { h: "The four hurry cases", img: { src: "img/pressure.svg" }, p: ["Stopped breathing: call 911, send for an AED, start CPR if trained.", "Severe bleeding: press hard on the wound and keep pressing. Soaked through? Add more cloth on top. No peeking.", "Stroke: call 911 and note the time the signs started.", "Swallowed poison: call Poison Control or 911. Don't make them throw up unless they tell you to."] },
      { h: "Stroke signs", img: { src: "img/stroke.svg" }, p: ["Face droops on one side.", "One arm is weak or drifts down.", "Speech is slurred or weird.", "Signs went away? Still call 911. It can be a warning stroke."] },
      { h: "Not breathing, in order", img: { src: "img/cpr.svg" }, p: ["1. Scene safe.", "2. Tap and shout.", "3. Call 911 and send someone for an AED.", "4. Push hard and fast in the center of the chest.", "5. Use the AED the second it shows up."] },
    ],
  },
  prevent: {
    name: "Preventing injuries",
    learn: [
      { h: "Match the habit to the injury", p: ["Knife cuts: safety circle, cut away from you.", "Splinters: gloves for firewood.", "Burns: distance from fires and stoves.", "Animal bites: don't touch or feed wildlife.", "Heat illness: water, hat, shade.", "Hypothermia: stay dry, carry a warm layer.", "Stingray stings: shuffle your feet.", "Tidepool cuts and falls: closed-toe shoes that grip."] },
      { h: "Buddy system", p: ["Stick with your buddy. People who are overheating or freezing are the last to notice. Your buddy notices first."] },
    ],
  },
  emergency: {
    name: "Emergencies",
    learn: [
      { h: "What counts", p: ["Anything that threatens life or could do lasting harm: not breathing, severe bleeding, won't wake up, serious burn, stroke signs."] },
      { h: "At home", p: ["Make sure it's safe for you, then call 911.", "Give the first aid you're trained for and stay with them."] },
      { h: "In the backcountry, in order", p: ["1. Scene safe.", "2. First aid for hurry cases.", "3. Keep them warm and treat for shock.", "4. Write a note: where, what happened, how they're doing.", "5. Send two people for help. Everyone else stays.", "Why two? If one gets hurt, the other still gets help.", "At the beach, the nearest lifeguard tower is often fastest."] },
      { h: "What to tell responders", p: ["Exact location.", "What happened.", "How many people are hurt.", "How they're doing and what first aid you gave.", "A number to call you back."] },
    ],
  },
  vehicle: {
    name: "Vehicle accident",
    learn: [
      { h: "In order", p: ["1. Stay well off the road, away from traffic.", "2. Call 911 with the location and what you see.", "3. Warn other drivers only if it's safe.", "4. Let adults lead. First aid only if you're trained.", "5. Stay and tell responders what you saw."] },
      { h: "Ground rules", p: ["Don't become the next victim.", "Don't move injured people unless there's danger, like fire.", "Smell gasoline? Back up more.", "Nothing to eat or drink, even if they ask."] },
    ],
  },
  ceremony: {
    name: "Flag ceremony",
    learn: [
      { h: "Opening, in order", p: ["1. \"Troop, attention!\"", "2. \"Color guard, advance!\"", "3. \"Color guard, post the colors!\"", "4. \"Scout salute!\"", "5. Pledge of Allegiance", "6. \"Two!\" (drop the salute)", "7. \"Color guard, retire!\""] },
      { h: "Closing, in order", p: ["1. \"Troop, attention!\"", "2. \"Scout salute!\"", "3. \"Color guard, retire the colors!\"", "4. \"Two!\"", "5. \"Color guard, dismissed!\""] },
      { h: "The details", p: ["The color guard carries and posts the flags. They don't salute. Their hands are a little busy.", "In uniform outdoors, the cap stays on and you give the Scout salute.", "With other flags, the US flag goes on its own right, or in front.", "On a stage, the US flag stands on the speaker's right.", "The Pledge starts \"I pledge allegiance.\" There is no \"of.\" Not even a little one."] },
    ],
  },
  flag: {
    name: "Flag respect",
    learn: [
      { h: "The stuff people get wrong", p: ["Up briskly, down slowly.", "Half-staff: all the way to the top first, then down to half. At day's end, back to the top, then down.", "Memorial Day: half-staff until noon, then full staff.", "At night it flies only if it's lit.", "Folded into a triangle with the blue field showing.", "A worn-out flag gets retired by burning, in a respectful ceremony.", "It touches the ground? Pick it up with care and keep going."] },
    ],
  },
  threer: {
    name: "Three R's",
    learn: [
      { h: "The three R's", p: ["Recognize: notice situations and people that could put you at risk.", "Resist: say no like you mean it, and get away.", "Report: tell a parent or trusted adult right away, even if someone said to keep it secret."] },
      { h: "Red flags", p: ["An adult who wants you to keep secrets from your parents.", "Gifts or attention that come with 'don't tell.'", "In Scouting, no adult is ever alone one-on-one with a Scout. That rule is for you."] },
    ],
  },
  bullying: {
    name: "Bullying",
    learn: [
      { h: "What it is", p: ["Hurting someone on purpose, again and again, when one side has more power.", "Physical, verbal, social (leaving someone out), or online."] },
      { h: "What to do", p: ["If it's you: stay calm, walk away, tell an adult.", "Online: save it, block them, tell an adult. Don't fire back.", "If it's someone else: be an upstander. Speak up if it's safe, and tell an adult."] },
    ],
  },
};
