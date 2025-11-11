/**
 * THIS FILE IS AUTO-GENERATED.
 * Run `pnpm generate:questions` after editing docs/QuestionBank.md.
 */
import type { Question } from "./question-schema";

export const questions: Question[] = [
  {
    id: "Q001",
    type: "rank",
    prompt: "Rank these supermarket chains by poshness",
    required: true,
    tags: ["shopping", "culture"],
    feedback: {
      correct: "Correct.",
      incorrect:
        "Incorrect. Do you even live here? The correct order is: Waitrose, M&S, Sainsbury’s, Tesco, Aldi.",
    },
    specialRules: ["Full marks only for exact order", "no partial scoring"],
    options: [
      {
        id: 1,
        label: "Waitrose",
      },
      {
        id: 2,
        label: "M&S",
      },
      {
        id: 3,
        label: "Sainsbury’s",
      },
      {
        id: 4,
        label: "Tesco",
      },
      {
        id: 5,
        label: "Aldi",
      },
    ],
    correct: [1, 2, 3, 4, 5],
  },
  {
    id: "Q002",
    type: "single",
    prompt: "Which of these is a famous UK dessert?",
    required: true,
    tags: ["food", "humour"],
    feedback: {
      "1": "Incorrect. The correct answer was spotted dick. While also pub classics, limpdicks (resp. dickheads) will more often be found on the chair rather than on the table.",
      "2": "Incorrect. The correct answer was spotted dick. While also pub classics, limpdicks (resp. dickheads) will more often be found on the chair rather than on the table.",
      "3": "Correct. Spotted dick is a traditional British pudding. Made with suet and dried fruit, it is traditionally served with a thick custard that will make you salivate!",
      "4": "Incorrect. The correct answer was spotted dick. While common in the UK, pale dick can hardly be considered a dessert.",
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "limpdick",
      },
      {
        id: 2,
        label: "dickhead",
      },
      {
        id: 3,
        label: "spotted dick",
      },
      {
        id: 4,
        label: "pale dick",
      },
    ],
    correct: [3],
  },
  {
    id: "Q003",
    type: "single",
    prompt:
      "Your British colleague says your idea is “fascinating.” Do they mean:",
    required: true,
    tags: ["language", "workplace"],
    feedback: {
      "1": "Incorrect. You may need to brush up on your British passive-aggressiveness translations.",
      "2": "Correct.",
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Genuinely intrigued",
      },
      {
        id: 2,
        label: "It’s the stupidest thing they’ve ever heard",
      },
      {
        id: 3,
        label: "They weren’t listening",
      },
      {
        id: 4,
        label: "They hate you personally",
      },
    ],
    correct: [2],
  },
  {
    id: "Q004",
    type: "single",
    prompt:
      "You are a British middle-aged man and it’s 25°C today. What is the appropriate outfit to wear to a public park?",
    required: true,
    tags: ["weather", "culture"],
    feedback: {
      "1": "Incorrect.",
      "4": "Correct. The pink-backed Britishman is a common sight in the summer.",
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Shorts and t-shirt",
      },
      {
        id: 2,
        label: "Full business suit",
      },
      {
        id: 3,
        label: "Tracksuit",
      },
      {
        id: 4,
        label:
          "The tiniest bathing shorts you can find before lying belly-first on the grass until you’re cooked medium-rare",
      },
    ],
    correct: [4],
  },
  {
    id: "Q005",
    type: "single",
    prompt: "Which of these is NOT a real Scottish town?",
    required: true,
    tags: ["geography", "humour"],
    feedback: {
      "1": "Incorrect. Beattock, located in the council area of Dumfries and Galloway, boasts a population of 1,000.",
      "2": "Incorrect. Twatt very much exists: ask your father. Lovely Twatt is a settlement in the parish of Birsay, on the island of Orkney.",
      "3": "Incorrect. Dull, located in Perth and Kinross, is a very real town, making up one third of the League of Extraordinary Communities (along with Bland, Australia, and Boring, USA).",
      "4": "Correct. Ballsdeep is far too rude a name for a town, unlike Bitchfield, Wetwang and Shitterton.",
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Beattock",
      },
      {
        id: 2,
        label: "Twatt",
      },
      {
        id: 3,
        label: "Dull",
      },
      {
        id: 4,
        label: "Ballsdeep",
      },
    ],
    correct: [4],
  },
  {
    id: "Q006",
    type: "text",
    prompt: "Complete this sentence: “See it, say it…”",
    required: true,
    tags: ["transport", "language"],
    specialRules: [
      'Accepts "sorted" even with one-character typo',
      "case insensitive",
      "case-insensitive, allow a tiny typo",
    ],
    acceptableAnswers: ["sorted"],
    textValidation: {
      strategy: "exact",
      normalizeCase: true,
      trimWhitespace: true,
      fuzzyThreshold: 0.85,
    },
  },
  {
    id: "Q007",
    type: "single",
    prompt: "When is it appropriate to offer someone a cuppa?",
    required: true,
    tags: ["tea", "etiquette"],
    specialRules: [
      "A “what is a cuppa?” help section appears",
      "clicking it fails the question",
    ],
    options: [
      {
        id: 1,
        label: "First thing in the morning",
      },
      {
        id: 2,
        label: "Any time before 2 pm",
      },
      {
        id: 3,
        label: "It’s always time for a cuppa",
      },
    ],
    correct: [3],
  },
  {
    id: "Q008",
    type: "single",
    prompt: "What is not a fundamental principle of British life?",
    required: true,
    tags: ["culture", "humour"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Stiff upper lip",
      },
      {
        id: 2,
        label: "Queueing",
      },
      {
        id: 3,
        label: "A pint with your mates",
      },
      {
        id: 4,
        label: "Building housing",
      },
    ],
    correct: [4],
  },
  {
    id: "Q009",
    type: "single",
    prompt: "If someone says “alright?”, they expect you to:",
    required: true,
    tags: ["language", "etiquette"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Tell them how you are",
      },
      {
        id: 2,
        label: "Say “good thanks, you?”",
      },
      {
        id: 3,
        label: "Nod slightly",
      },
      {
        id: 4,
        label: "Say “alright” back",
      },
    ],
    correct: [2, 4],
  },
  {
    id: "Q010",
    type: "single",
    prompt: "When the Queen died, the appropriate mourning period lasted:",
    required: true,
    tags: ["culture", "humour"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "2 days",
      },
      {
        id: 2,
        label: "70 years",
      },
      {
        id: 3,
        label: "Depends if you got the day off work",
      },
    ],
    correct: [1, 3],
  },
  {
    id: "Q011",
    type: "single",
    prompt:
      "Harry’s train leaves London Euston at 10:30 am. It takes 2h 30 minutes. When will Harry arrive in Manchester?",
    required: true,
    tags: ["transport", "humour"],
    feedback: {
      "1": "“Optimistic!”",
      "2": "“Incorrect, as you assume the train will arrive on time.”",
      "3": '"Only 15 minutes late? Come on."',
      "4": '"Correct!"',
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "30pm",
      },
      {
        id: 2,
        label: "1pm",
      },
      {
        id: 3,
        label: "15pm",
      },
      {
        id: 4,
        label: "Lord only knows",
      },
    ],
    correct: [1, 4],
  },
  {
    id: "Q012",
    type: "multiple",
    prompt: "Which of these are considered landlord specials?",
    required: true,
    tags: ["housing", "humour"],
    feedback: {
      "3": "Incorrect, but if that's your experience of landlords, I envy you.",
    },
    specialRules: ["(contributed by Jess & Simona)"],
    options: [
      {
        id: 1,
        label: "Painting over the light switch",
      },
      {
        id: 2,
        label: "Thermostat",
      },
      {
        id: 3,
        label: "Blemish on wall",
      },
      {
        id: 4,
        label: "Window shut",
      },
    ],
    correct: [1, 2, 4],
  },
  {
    id: "Q013",
    type: "single",
    prompt: "What is the UK’s favourite reality TV show?",
    required: true,
    tags: ["television", "humour"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Love Island",
      },
      {
        id: 2,
        label: "The Only Way Is Essex",
      },
      {
        id: 3,
        label: "Top Gear",
      },
      {
        id: 4,
        label: "the royal family",
      },
    ],
    correct: [4],
  },
  {
    id: "Q014",
    type: "single",
    prompt: "How many syllables are in “Leicester”?",
    required: true,
    tags: ["language", "pronunciation"],
    feedback: {
      incorrect:
        "Incorrect. You pronounce the sauce Wor-ces-ter-shire, don’t you?",
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "2",
      },
      {
        id: 2,
        label: "3",
      },
    ],
    correct: [1],
  },
  {
    id: "Q015",
    type: "single",
    prompt:
      "You are in your bathroom after a shower. You need to dry your hair quickly. What do you do?",
    required: true,
    tags: ["politics", "humour"],
    feedback: {
      "1": "A normal power outlet? In a bathroom? You don't live in the UK.",
      correct: "Correct! There are no regular power outlets in bathrooms.",
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Use a hairdryer in your bathroom.",
      },
      {
        id: 2,
        label: "Go to your bedroom to use your hairdryer.",
      },
      {
        id: 3,
        label: "Go to your kitchen to use your hairdryer.",
      },
      {
        id: 4,
        label: "Go to any other room to use your hairdryer.",
      },
    ],
    correct: [2, 3, 4],
  },
  {
    id: "Q016",
    type: "single",
    prompt: "On Sunday, you go for a Sunday…",
    required: true,
    tags: ["food", "culture"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "fish & chips",
      },
      {
        id: 2,
        label: "roast",
      },
      {
        id: 3,
        label: "stew",
      },
      {
        id: 4,
        label: "curry",
      },
    ],
    correct: [2],
  },
  {
    id: "Q017",
    type: "single",
    prompt: "What is a GP?",
    required: true,
    tags: ["language", "health"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Grand Parade for the sovereign",
      },
      {
        id: 2,
        label: "Belfast slang for the English",
      },
      {
        id: 3,
        label: "Your doctor",
      },
      {
        id: 4,
        label: "A well-known weight-loss drug",
      },
    ],
    correct: [3],
  },
  {
    id: "Q018",
    type: "single",
    prompt: "Have you ever received threatening letters? (BBC TV Licence)",
    required: true,
    tags: ["bureaucracy", "humour"],
    feedback: {
      "1": "Correct! All British residents will have been threatened by the BBC TV Licence mafia.",
      "2": "Incorrect. You’re either lying, new, or haven’t checked your postbox recently. But don't worry: BBC TV Licence enforcers will find you eventually.",
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Yes",
      },
      {
        id: 2,
        label: "No",
      },
    ],
    correct: [1],
  },
  {
    id: "Q019",
    type: "multiple",
    prompt: "You open the curtains to bright blue skies. What must you bring?",
    required: true,
    tags: ["weather", "preparedness"],
    feedback: {
      overall_correct:
        "There are 4 seasons in the UK, and you’ll often experience all 4 in a single day.",
      incorrect:
        "There are 4 seasons in the UK, and you’ll commonly experience all 4 in a single day. Plan accordingly.",
    },
    specialRules: ["(if not checked, fail)"],
    options: [
      {
        id: 1,
        label: "Sunglasses",
      },
      {
        id: 2,
        label: "Sunscreen",
      },
      {
        id: 3,
        label: "Light jacket",
      },
      {
        id: 4,
        label: "Umbrella",
      },
    ],
    correct: [1, 2, 3, 4],
  },
  {
    id: "Q020",
    type: "single",
    prompt: "The cashier called you “love.” Is she…",
    required: true,
    tags: ["etiquette", "culture"],
    feedback: {
      "1": 'Incorrect. "Love" is pretty much punctuation for anyone working in customer service. You\'re not special.',
      correct:
        'Correct. "Love" is pretty much punctuation for anyone working in customer service and should not be understood to mean anything else.',
      "2 or 3":
        'Incorrect. "Love" is pretty much punctuation for anyone working in customer service.',
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Hitting on you",
      },
      {
        id: 2,
        label: "On MDMA",
      },
      {
        id: 3,
        label: "Not fully awake",
      },
      {
        id: 4,
        label: "None of the above",
      },
    ],
    correct: [4],
  },
  {
    id: "Q021",
    type: "single",
    prompt:
      "You’re having afternoon tea. You get a scone, clotted cream, and jam. What do you do?",
    required: true,
    tags: ["food", "etiquette"],
    feedback: {
      "1": "The Devon way! Objectively correct but culturally insensitive not to check how your friend does it.",
      "2": "Incorrect. Not only are you being culturally insensitive by not checking what your friend does, but also, the Cornish way? Objectively wrong.",
      "3": "Correct. The order in which to cream your scone is a highly sensitive cultural matter that must be treated with due caution.",
    },
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Cream then jam",
      },
      {
        id: 2,
        label: "Jam then cream",
      },
      {
        id: 3,
        label: "Check how your friend does it first",
      },
    ],
    correct: [3],
  },
  {
    id: "Q022",
    type: "single",
    prompt: "Which of these is a UK accent?",
    required: true,
    tags: ["language", "humour"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Beagle",
      },
      {
        id: 2,
        label: "Corgi",
      },
      {
        id: 3,
        label: "Cockney",
      },
      {
        id: 4,
        label: "Bulldog",
      },
    ],
    correct: [3],
  },
  {
    id: "Q023",
    type: "single",
    prompt: "What is the proper way to make tea?",
    required: true,
    tags: ["tea", "etiquette"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Milk then hot water",
      },
      {
        id: 2,
        label: "Hot water then milk",
      },
      {
        id: 3,
        label: "Never put milk in tea",
      },
    ],
    correct: [2],
  },
  {
    id: "Q024",
    type: "single",
    prompt: "Correct emotional response to queue-cutting:",
    required: true,
    tags: ["queueing", "etiquette"],
    specialRules: [],
    options: [
      {
        id: 1,
        label: "Shout immediately",
      },
      {
        id: 2,
        label: "Passive-aggressive tutting and glaring",
      },
      {
        id: 3,
        label: "Report to community officer",
      },
      {
        id: 4,
        label: "Join them at the front",
      },
    ],
    correct: [2],
  },
] as const;
