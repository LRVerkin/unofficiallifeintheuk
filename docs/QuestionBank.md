# Question Bank

All questions sourced from the pitch and structured per the PRD so the quiz app can ingest them directly.

## Q001

- type: rank
- prompt: Rank these supermarket chains by poshness
- options:
  1. Waitrose
  2. M&S
  3. Sainsbury’s
  4. Tesco
  5. Aldi
- correct: [1, 2, 3, 4, 5]
- feedback:
  correct: Correct.
  incorrect: Incorrect. Do you even live here? The correct order is: Waitrose, M&S, Sainsbury’s, Tesco, Aldi.
- required: true
- tags: [shopping, culture]
- special_rules: Full marks only for exact order; no partial scoring.

## Q002

- type: single
- prompt: Which of these is a famous UK dessert?
- options:
  1. limpdick
  2. dickhead
  3. spotted dick
  4. pale dick
- correct: [3]
- feedback:
  1: Incorrect. The correct answer was spotted dick. While also pub classics, limpdicks (resp. dickheads) will more often be found on the chair rather than on the table.
  2: Incorrect. The correct answer was spotted dick. While also pub classics, limpdicks (resp. dickheads) will more often be found on the chair rather than on the table.
  3: Correct. Spotted dick is a traditional British pudding. Made with suet and dried fruit, it is traditionally served with a thick custard that will make you salivate!
  4: Incorrect. The correct answer was spotted dick. While common in the UK, pale dick can hardly be considered a dessert.
- required: true
- tags: [food, humour]
- special_rules: none

## Q003

- type: single
- prompt: Your British colleague says your idea is “fascinating.” Do they mean:
- options:
  1. Genuinely intrigued
  2. It’s the stupidest thing they’ve ever heard
  3. They weren’t listening
  4. They hate you personally
- correct: [2]
- feedback:
  1: Incorrect. You may need to brush up on your British passive-aggressiveness translations.
  2: Correct.
- required: true
- tags: [language, workplace]
- special_rules: none

## Q004

- type: single
- prompt: You are a British middle-aged man and it’s 25°C today. What is the appropriate outfit to wear to a public park?
- options:
  1. Shorts and t-shirt
  2. Full business suit
  3. Tracksuit
  4. The tiniest bathing shorts you can find before lying belly-first on the grass until you’re cooked medium-rare
- correct: [4]
- feedback:
  1: Incorrect.
  4: Correct. The pink-backed Britishman is a common sight in the summer.
- required: true
- tags: [weather, culture]
- special_rules: none

## Q005

- type: single
- prompt: Which of these is NOT a real Scottish town?
- options:
  1. Beattock
  2. Twatt
  3. Dull
  4. Ballsdeep
- correct: [4]
- feedback:
  1: Incorrect. Beattock, located in the council area of [Dumfries and Galloway](https://en.wikipedia.org/wiki/Dumfries_and_Galloway), boasts a population of 1,000.
  2: Incorrect. Twatt very much exists: ask your father. Lovely Twatt is a settlement in the parish of Birsay, on the island of Orkney.
  3: Incorrect. Dull, located in Perth and Kinross, is a very real town, making up one third of the League of Extraordinary Communities (along with Bland, Australia, and Boring, USA).
  4: Correct. Ballsdeep is far too rude a name for a town, unlike [Bitchfield](https://en.wikipedia.org/wiki/Bitchfield), [Wetwang](https://en.wikipedia.org/wiki/Wetwang) and [Shitterton](https://en.wikipedia.org/wiki/Shitterton).
- required: true
- tags: [geography, humour]
- special_rules: none

## Q006

- type: text
- prompt: Complete this sentence: “See it, say it…”
- options: []
- correct: ["sorted"] //case-insensitive, allow a tiny typo
- required: true
- tags: [transport, language]
- special_rules: Accepts "sorted" even with one-character typo; case insensitive

## Q007

- type: single
- prompt: When is it appropriate to offer someone a cuppa?
- options:
  1. First thing in the morning
  2. Any time before 2 pm
  3. It’s always time for a cuppa
- correct: [3]
- required: true
- tags: [tea, etiquette]
- special_rules: A “what is a cuppa?” help section appears; clicking it fails the question.

## Q008

- type: single
- prompt: What is _not_ a fundamental principle of British life?
- options:
  1. Stiff upper lip
  2. Queueing
  3. A pint with your mates
  4. Building housing
- correct: [4]
- required: true
- tags: [culture, humour]
- special_rules: none

## Q009

- type: single
- prompt: If someone says “alright?”, they expect you to:
- options:
  1. Tell them how you are
  2. Say “good thanks, you?”
  3. Nod slightly
  4. Say “alright” back
- correct: [2,4]
- feedback:
  1. God, you're embarrassing.
- required: true
- tags: [language, etiquette]
- special_rules: none

## Q010

- type: single
- prompt: When the Queen died, the appropriate mourning period lasted:
- options:
  1. 2 days
  2. 70 years
  3. Depends if you got the day off work
- correct: [1,3]
- required: true
- tags: [culture, humour]
- special_rules: none

## Q011

- type: single
- prompt: Harry’s train leaves London Euston at 10:30 am. It takes 2h 30 minutes. When will Harry arrive in Manchester?
- options:
  1. 1.30pm
  2. 1pm
  3. 1.15pm
  4. Lord only knows
- correct: [1,4]
- feedback:
  1: “Optimistic!”
  2: “Incorrect, as you assume the train will arrive on time.”
  3: "Only 15 minutes late? Come on."
  4: "Correct!"
- required: true
- tags: [transport, humour]
- special_rules: none

## Q012

- type: multiple
- prompt: Which of these are considered landlord specials?
- options:
  1. Painting over the light switch
  2. Thermostat
  3. Blemish on wall
  4. Window shut
- correct: [1, 2, 4]
- feedback:
  3: Incorrect, but if that's your experience of landlords, I envy you.
- required: true
- tags: [housing, humour]
- special_rules: (contributed by Jess & Simona)

## Q013

- type: single
- prompt: What is the UK’s favourite reality TV show?
- options:
  1. Love Island
  2. The Only Way Is Essex
  3. Top Gear
  4. the royal family
- correct: [4]
- feedback:
  1. Well-liked, but no.
  2. Well-liked, but no.
  3. Well-liked, but no.
  4. Correct! Who said the Truman show was fiction?
- required: true
- tags: [television, humour]
- special_rules: none

## Q014

- type: single
- prompt: How many syllables are in “Leicester”?
- options:
  1. 2
  2. 3
- correct: [1]
- feedback:
  incorrect: Incorrect. You pronounce the sauce Wor-ces-ter-shire, don’t you?
- required: true
- tags: [language, pronunciation]
- special_rules: none

## Q015

- type: single
- prompt: You are in your bathroom after a shower. You need to dry your hair quickly. What do you do?
- options:
  1. Use a hairdryer in your bathroom.
  2. Go to your bedroom to use your hairdryer.
  3. Go to your kitchen to use your hairdryer.
  4. Go to any other room to use your hairdryer.
- correct: [2,3,4]
- feedback:
  1: A normal power outlet? In a bathroom? You don't live in the UK.
  correct: Correct! There are no regular power outlets in bathrooms.
- required: true
- tags: [politics, humour]
- special_rules: none

## Q016

- type: single
- prompt: On Sunday, you go for a Sunday…
- options:
  1. fish & chips
  2. roast
  3. stew
  4. curry
- correct: [2]
- required: true
- tags: [food, culture]
- special_rules: none

## Q017

- type: single
- prompt: What is a GP?
- options:
  1. Grand Parade for the sovereign
  2. Belfast slang for the English
  3. Your doctor
  4. A well-known weight-loss drug
- correct: [3]
- required: true
- tags: [language, health]
- special_rules: none

## Q018

- type: single
- prompt: Have you ever received threatening letters? (BBC TV Licence)
- options:
  1. Yes
  2. No
- correct: [1]
- feedback:
  1: Correct! All British residents will have been threatened by the BBC TV Licence mafia.
  2: Incorrect. You’re either lying, new, or haven’t checked your postbox recently. But don't worry: BBC TV Licence enforcers will find you eventually.
- required: true
- tags: [bureaucracy, humour]
- special_rules: none

## Q019

- type: multiple
- prompt: You open the curtains to bright blue skies. What must you bring?
- options:
  1. Sunglasses
  2. Sunscreen
  3. Light jacket
  4. Umbrella
- correct: [1, 2, 3, 4]
- feedback:
  overall_correct: There are 4 seasons in the UK, and you’ll often experience all 4 in a single day.
  incorrect: There are 4 seasons in the UK, and you’ll commonly experience all 4 in a single day. Plan accordingly.
- required: true
- tags: [weather, preparedness]
- special_rules: (if not checked, fail)

## Q020

- type: single
- prompt: The cashier called you “love.” Is she…
- options:
  1. Hitting on you
  2. On MDMA
  3. Not fully awake
  4. None of the above
- correct: [4]
- feedback:
  correct: Correct. "Love" is pretty much punctuation for anyone working in customer service and should not be understood to mean anything else.
  1: Incorrect. "Love" is pretty much punctuation for anyone working in customer service. You're not special.
  2 or 3: Incorrect. "Love" is pretty much punctuation for anyone working in customer service.
- required: true
- tags: [etiquette, culture]
- special_rules: none

## Q021

- type: single
- prompt: You’re having afternoon tea. You get a scone, clotted cream, and jam. What do you do?
- options:
  1. Cream then jam
  2. Jam then cream
  3. Check how your friend does it first
- correct: [3]
- feedback:
  1: The Devon way! Objectively correct but culturally insensitive not to check how your friend does it.
  2: Incorrect. Not only are you being culturally insensitive by not checking what your friend does, but also, the Cornish way? Objectively wrong.
  3: Correct. The order in which to cream your scone is a highly sensitive cultural matter that must be treated with due caution.
- required: true
- tags: [food, etiquette]
- special_rules: none

## Q022

- type: single
- prompt: Which of these is a UK accent?
- options:
  1. Beagle
  2. Corgi
  3. Cockney
  4. Bulldog
- correct: [3]
- required: true
- tags: [language, humour]
- special_rules: none

## Q023

- type: single
- prompt: What is the proper way to make tea?
- options:
  1. Milk then hot water
  2. Hot water then milk
  3. Never put milk in tea
- correct: [2]
- feedback:
  1. Incorrect. Any British citizen must know that you steep the tea in hot water first, then you add the milk. Do you actually live here?
  2. Correct. British teabags steep best in hot water.
     3: Pardon? The Home Office is on their way to expel you.
- required: true
- tags: [tea, etiquette]
- special_rules: none

## Q024

- type: single
- prompt: Correct emotional response to queue-cutting:
- options:
  1. Shout immediately
  2. Passive-aggressive tutting and glaring
  3. Report to community officer
  4. Join them at the front
- correct: [2]
- required: true
- tags: [queueing, etiquette]
- special_rules: none
