import confetti from 'confetti';
import { gsap } from 'gsap';

// État de l'application
const appState = {
    currentUser: {
        name: '',
        avatar: 1,
        points: 0,
        progress: {
            maths: 0,
            langues: 0,
            sciences: 0,
            arts: 0,
            sport: 0,
            geo: 0,     // New geography module
            metiers: 0  // New careers module
        },
        badges: [],
        completedActivities: [],
        completedQuests: [],
        currentQuests: []
    },
    currentModule: null,
    currentScreen: 'welcome-screen',
    assistant: {
        isActive: false,
        messages: []
    },
    audioExplanations: {
        isPlaying: false,
        currentAudio: null
    },
    characters: {
        maths: {
            name: "Prof. Arithmus",
            avatar: "🦉",
            color: "#FF5722",
            intro: "Bienvenue dans mon laboratoire des nombres ! Je suis le Professeur Arithmus, et j'ai besoin de ton aide pour résoudre des énigmes mathématiques."
        },
        langues: {
            name: "Capitaine Lexico",
            avatar: "🦊",
            color: "#2196F3",
            intro: "Ahoy, moussaillon ! Je suis le Capitaine Lexico, et nous partons à l'aventure pour découvrir le monde des mots et des histoires !"
        },
        sciences: {
            name: "Dr. Eureka",
            avatar: "🐢",
            color: "#9C27B0",
            intro: "Bonjour jeune scientifique ! Je suis Dr. Eureka, et ensemble, nous allons percer les mystères de notre monde à travers des expériences fascinantes !"
        },
        arts: {
            name: "Maestro Colorino",
            avatar: "🦄",
            color: "#FFEB3B",
            intro: "Ciao créateur en herbe ! Je suis Maestro Colorino, et je vais t'aider à libérer ton imagination à travers l'art et la musique !"
        },
        sport: {
            name: "Coach Dynamo",
            avatar: "🐯",
            color: "#4CAF50",
            intro: "Hey champion ! Je suis Coach Dynamo, et ensemble, nous allons bouger, sauter et devenir plus forts tout en s'amusant !"
        },
        geo: {
            name: "Capitaine Atlas",
            avatar: "🦝",
            color: "#009688",
            intro: "Bonjour explorateur ! Je suis le Capitaine Atlas, et ensemble nous allons parcourir le monde pour découvrir ses merveilles, ses continents et ses pays !"
        },
        metiers: {
            name: "Docteur Carrière",
            avatar: "🦡",
            color: "#795548",
            intro: "Salut futur professionnel ! Je suis Docteur Carrière, et je vais te faire découvrir le monde fascinant des métiers et t'aider à comprendre comment fonctionne le monde du travail !"
        }
    }
};

// Système de quêtes
const questTemplates = [
    {
        id: "math-explorer",
        title: "Explorateur des Nombres",
        module: "maths",
        description: "Le Professeur Arithmus a besoin de ton aide pour explorer le monde des nombres et des formes.",
        objectives: [
            { id: "math-numbers", text: "Apprendre les nombres de 1 à 10", completed: false },
            { id: "math-shapes", text: "Découvrir les formes géométriques", completed: false },
            { id: "math-add", text: "Maîtriser l'addition simple", completed: false }
        ],
        reward: { points: 50, badge: "math-explorer" }
    },
    {
        id: "langue-aventure",
        title: "Aventure Linguistique",
        module: "langues",
        description: "Rejoins le Capitaine Lexico dans une aventure pour maîtriser le langage et découvrir des histoires fascinantes.",
        objectives: [
            { id: "langue-alphabet", text: "Maîtriser l'alphabet", completed: false },
            { id: "langue-vocab", text: "Enrichir ton vocabulaire des animaux", completed: false }
        ],
        reward: { points: 40, badge: "langue-explorer" }
    },
    {
        id: "science-decouverte",
        title: "Mission Découverte",
        module: "sciences",
        description: "Aide Dr. Eureka à percer les mystères de la science à travers des expériences passionnantes.",
        objectives: [
            { id: "science-sens", text: "Explorer les cinq sens", completed: false },
            { id: "science-animals", text: "Étudier le monde animal", completed: false }
        ],
        reward: { points: 40, badge: "science-explorer" }
    },
    {
        id: "art-creation",
        title: "Expédition Créative",
        module: "arts",
        description: "Maestro Colorino t'invite à exprimer ta créativité à travers différentes formes d'art.",
        objectives: [
            { id: "art-colors", text: "Explorer le monde des couleurs", completed: false },
            { id: "art-music", text: "Découvrir les instruments de musique", completed: false }
        ],
        reward: { points: 40, badge: "art-explorer" }
    },
    {
        id: "sport-challenge",
        title: "Défi Dynamique",
        module: "sport",
        description: "Relève les défis sportifs du Coach Dynamo pour devenir plus agile et plus fort.",
        objectives: [
            { id: "sport-moves", text: "Maîtriser les mouvements du corps", completed: false },
            { id: "sport-games", text: "Participer à des jeux sportifs", completed: false }
        ],
        reward: { points: 40, badge: "sport-explorer" }
    },
    {
        id: "geo-explorer",
        title: "Explorateur du Monde",
        module: "geo",
        description: "Capitaine Atlas a besoin de ton aide pour découvrir les continents et pays du monde.",
        objectives: [
            { id: "geo-continents", text: "Explorer les continents", completed: false },
            { id: "geo-france", text: "Découvrir la France et ses régions", completed: false }
        ],
        reward: { points: 40, badge: "geo-explorer" }
    },
    {
        id: "metiers-decouverte",
        title: "Découverte Professionnelle",
        module: "metiers",
        description: "Docteur Carrière t'invite à explorer le monde des métiers et à découvrir différentes professions.",
        objectives: [
            { id: "metiers-basics", text: "Comprendre ce qu'est un métier", completed: false },
            { id: "metiers-types", text: "Découvrir différentes professions", completed: false }
        ],
        reward: { points: 40, badge: "metiers-explorer" }
    }
];

// Assistant virtuel - réponses prédéfinies
const assistantResponses = {
    greetings: [
        "Bonjour ! Je suis Édu, ton assistant. Comment puis-je t'aider aujourd'hui ?",
        "Salut ! Je suis là pour t'aider dans ton aventure d'apprentissage. Que veux-tu faire ?",
        "Coucou ! C'est Édu, ton assistant. As-tu des questions sur tes quêtes ?"
    ],
    moduleHelp: {
        maths: [
            "Les mathématiques, c'est compter, mesurer et résoudre des problèmes avec des nombres.",
            "Tu savais que les formes ont des noms spéciaux ? Un cercle est rond comme une roue !",
            "L'addition, c'est quand on met ensemble. 2 pommes + 3 pommes = 5 pommes !"
        ],
        langues: [
            "L'alphabet a 26 lettres, de A à Z. C'est la base pour lire et écrire !",
            "Les mots forment des phrases, comme celle que tu lis en ce moment !",
            "Chaque animal a son propre cri : le chat fait 'miaou', le chien fait 'ouaf' !"
        ],
        sciences: [
            "Nous avons 5 sens : la vue, l'ouïe, le toucher, l'odorat et le goût.",
            "Les plantes ont besoin d'eau et de soleil pour grandir, comme toi !",
            "Certains animaux hibernent pendant l'hiver, comme les ours qui font une longue sieste !"
        ],
        arts: [
            "Mélanger le bleu et le jaune donne du vert, comme par magie !",
            "La musique est faite de sons qui peuvent être graves ou aigus.",
            "Dessiner, c'est comme raconter une histoire avec des images !"
        ],
        sport: [
            "Bouger ton corps est important pour rester en bonne santé.",
            "L'équilibre t'aide à tenir debout sur un pied comme un flamant rose !",
            "Courir, sauter, lancer - ce sont des mouvements que tu peux faire avec ton corps !"
        ],
        geo: [
            "La géographie est l'étude de la Terre, de ses paysages, de ses habitants et des phénomènes qui s'y produisent.",
            "Il y a 7 continents sur Terre : l'Europe, l'Asie, l'Afrique, l'Amérique du Nord, l'Amérique du Sud, l'Océanie et l'Antarctique.",
            "La France est divisée en plusieurs régions, chacune avec ses propres spécialités et traditions !"
        ],
        metiers: [
            "Un métier est une activité qui permet de répondre aux besoins de la société et de gagner sa vie.",
            "Il existe des centaines de métiers différents, comme médecin, enseignant, boulanger, astronaute ou informaticien !",
            "Pour exercer un métier, il faut souvent suivre une formation spéciale et acquérir des compétences particulières."
        ]
    },
    questions: [
        "Quelle est ta matière préférée ?",
        "As-tu déjà complété une quête ?",
        "Quel animal aimerais-tu être ?",
        "Qu'as-tu appris aujourd'hui ?",
        "Quel est ton jeu préféré ?"
    ],
    unknown: [
        "Je ne suis pas sûr de comprendre. Peux-tu me poser une question sur tes leçons ?",
        "Hmm, essayons autre chose. Tu peux me demander de l'aide sur les maths, les langues, les sciences, les arts ou le sport.",
        "Je suis encore en train d'apprendre. Peux-tu reformuler ta question ?"
    ]
};

// Initialisation des activités
const moduleActivities = {
    maths: [
        {
            id: 'math-numbers',
            title: 'Les nombres de 1 à 10',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Combien de points vois-tu ? Compte-les attentivement.',
                    image: `<svg width="200" height="100" viewBox="0 0 200 100">
                        <circle cx="30" cy="50" r="10" fill="#FF5722" />
                        <circle cx="60" cy="50" r="10" fill="#FF5722" />
                        <circle cx="90" cy="50" r="10" fill="#FF5722" />
                        <circle cx="120" cy="50" r="10" fill="#FF5722" />
                        <circle cx="150" cy="50" r="10" fill="#FF5722" />
                        <text x="30" y="75" fill="#333" font-size="12">1</text>
                        <text x="60" y="75" fill="#333" font-size="12">2</text>
                        <text x="90" y="75" fill="#333" font-size="12">3</text>
                        <text x="120" y="75" fill="#333" font-size="12">4</text>
                        <text x="150" y="75" fill="#333" font-size="12">5</text>
                    </svg>`,
                    options: ['3', '4', '5', '6'],
                    correct: '5',
                    explanation: 'Il y a 5 cercles rouges. Compter un par un nous aide à ne pas en oublier !'
                },
                {
                    question: 'Quel nombre vient après 7 dans l\'ordre croissant ? Observe la suite numérique.',
                    image: `<svg width="320" height="100" viewBox="0 0 320 100">
                        <rect x="20" y="30" width="30" height="40" rx="5" fill="#E0E0E0" stroke="#333" />
                        <rect x="60" y="30" width="30" height="40" rx="5" fill="#E0E0E0" stroke="#333" />
                        <rect x="100" y="30" width="30" height="40" rx="5" fill="#E0E0E0" stroke="#333" />
                        <rect x="140" y="30" width="30" height="40" rx="5" fill="#E0E0E0" stroke="#333" />
                        <rect x="180" y="30" width="30" height="40" rx="5" fill="#E0E0E0" stroke="#333" />
                        <rect x="220" y="30" width="30" height="40" rx="5" fill="#FF5722" stroke="#333" />
                        <text x="35" y="55" text-anchor="middle" fill="#333" font-size="16">1</text>
                        <text x="75" y="55" text-anchor="middle" fill="#333" font-size="16">2</text>
                        <text x="115" y="55" text-anchor="middle" fill="#333" font-size="16">3</text>
                        <text x="155" y="55" text-anchor="middle" fill="#333" font-size="16">4</text>
                        <text x="195" y="55" text-anchor="middle" fill="#333" font-size="16">5</text>
                        <text x="235" y="55" text-anchor="middle" fill="#333" font-size="16">6</text>
                        <text x="275" y="55" text-anchor="middle" fill="#333" font-size="16">7</text>
                        <text x="295" y="55" text-anchor="middle" fill="#333" font-size="16">?</text>
                    </svg>`,
                    options: ['6', '7', '8', '9'],
                    correct: '8',
                    explanation: 'Après 7 vient 8. Dans l\'ordre croissant, les nombres augmentent de 1 en 1.'
                },
                {
                    question: 'Compte les triangles et indique leur nombre total',
                    image: `<svg width="240" height="120" viewBox="0 0 240 120">
                        <polygon points="30,100 50,40 70,100" fill="#FF5722" stroke="#333" />
                        <polygon points="90,100 110,40 130,100" fill="#2196F3" stroke="#333" />
                        <polygon points="150,100 170,40 190,100" fill="#4CAF50" stroke="#333" />
                        <text x="50" y="110" text-anchor="middle" fill="#333" font-size="12">Triangle 1</text>
                        <text x="110" y="110" text-anchor="middle" fill="#333" font-size="12">Triangle 2</text>
                        <text x="170" y="110" text-anchor="middle" fill="#333" font-size="12">Triangle 3</text>
                    </svg>`,
                    options: ['2', '3', '4', '5'],
                    correct: '3',
                    explanation: 'Il y a 3 triangles de différentes couleurs : rouge, bleu et vert. Un triangle a 3 côtés et 3 angles.'
                }
            ]
        },
        {
            id: 'math-shapes',
            title: 'Les formes géométriques',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Comment s\'appelle cette forme qui a 4 côtés égaux et 4 angles droits ?',
                    image: `<svg width="140" height="140" viewBox="0 0 140 140">
                        <rect x="20" y="20" width="100" height="100" fill="#FF5722" stroke="#333" stroke-width="2" />
                        <line x1="20" y1="20" x2="120" y2="120" stroke="#333" stroke-width="1" stroke-dasharray="5,5" />
                        <line x1="120" y1="20" x2="20" y2="120" stroke="#333" stroke-width="1" stroke-dasharray="5,5" />
                        <text x="70" y="75" text-anchor="middle" fill="white" font-size="16">?</text>
                    </svg>`,
                    options: ['Cercle', 'Triangle', 'Carré', 'Rectangle'],
                    correct: 'Carré',
                    explanation: 'Un carré a 4 côtés de même longueur et 4 angles droits (90°). C\'est un cas particulier du rectangle.'
                },
                {
                    question: 'Combien de côtés a un triangle ? Observe attentivement la forme.',
                    image: `<svg width="140" height="140" viewBox="0 0 140 140">
                        <polygon points="70,20 120,100 20,100" fill="#2196F3" stroke="#333" stroke-width="2" />
                        <line x1="70" y1="20" x2="120" y2="100" stroke="#FFC107" stroke-width="3" />
                        <line x1="120" y1="100" x2="20" y2="100" stroke="#FFC107" stroke-width="3" />
                        <line x1="20" y1="100" x2="70" y2="20" stroke="#FFC107" stroke-width="3" />
                        <text x="70" y="65" text-anchor="middle" fill="white" font-size="16">?</text>
                    </svg>`,
                    options: ['2', '3', '4', '5'],
                    correct: '3',
                    explanation: 'Un triangle a exactement 3 côtés et 3 angles. La somme des angles d\'un triangle est toujours égale à 180°.'
                },
                {
                    question: 'Quelle forme n\'a pas de coins pointus et est parfaitement ronde ?',
                    image: `<svg width="200" height="100" viewBox="0 0 200 100">
                        <rect x="10" y="30" width="40" height="40" fill="#FF5722" />
                        <polygon points="80,30 100,70 60,70" fill="#4CAF50" />
                        <circle cx="140" cy="50" r="20" fill="#2196F3" />
                        <rect x="170" y="30" width="20" height="40" fill="#9C27B0" />
                        <text x="30" y="85" text-anchor="middle" fill="#333">Carré</text>
                        <text x="80" y="85" text-anchor="middle" fill="#333">Triangle</text>
                        <text x="140" y="85" text-anchor="middle" fill="#333">Cercle</text>
                        <text x="180" y="85" text-anchor="middle" fill="#333">Rectangle</text>
                    </svg>`,
                    options: ['Carré', 'Triangle', 'Rectangle', 'Cercle'],
                    correct: 'Cercle',
                    explanation: 'Un cercle est parfaitement rond et n\'a pas de coins. Tous les points du cercle sont à égale distance du centre.'
                }
            ]
        },
        {
            id: 'math-add',
            title: 'Addition simple',
            type: 'quiz',
            difficulty: 2,
            questions: [
                {
                    question: 'Combien font 3 + 2 ? Utilise les groupes de points pour t\'aider à compter.',
                    image: `<svg width="240" height="120" viewBox="0 0 240 120">
                        <circle cx="30" cy="40" r="10" fill="#FF5722" />
                        <circle cx="60" cy="40" r="10" fill="#FF5722" />
                        <circle cx="90" cy="40" r="10" fill="#FF5722" />
                        <text x="60" y="70" text-anchor="middle" fill="#333" font-size="16">3</text>
                        
                        <text x="120" y="40" text-anchor="middle" fill="#333" font-size="24">+</text>
                        
                        <circle cx="150" cy="40" r="10" fill="#2196F3" />
                        <circle cx="180" cy="40" r="10" fill="#2196F3" />
                        <text x="165" y="70" text-anchor="middle" fill="#333" font-size="16">2</text>
                        
                        <text x="210" y="40" text-anchor="middle" fill="#333" font-size="24">=</text>
                        <text x="210" y="70" text-anchor="middle" fill="#333" font-size="16">?</text>
                    </svg>`,
                    options: ['4', '5', '6', '7'],
                    correct: '5',
                    explanation: 'Pour additionner 3 + 2, on compte tous les points : 3 rouges + 2 bleus = 5 points au total.'
                },
                {
                    question: 'Combien font 4 + 4 ? Assemble les deux groupes d\'objets pour trouver la réponse.',
                    image: `<svg width="280" height="120" viewBox="0 0 280 120">
                        <rect x="10" y="30" width="20" height="20" fill="#FF5722" />
                        <rect x="40" y="30" width="20" height="20" fill="#FF5722" />
                        <rect x="70" y="30" width="20" height="20" fill="#FF5722" />
                        <rect x="100" y="30" width="20" height="20" fill="#FF5722" />
                        <text x="65" y="70" text-anchor="middle" fill="#333" font-size="16">4</text>
                        
                        <text x="130" y="40" text-anchor="middle" fill="#333" font-size="24">+</text>
                        
                        <rect x="160" y="30" width="20" height="20" fill="#2196F3" />
                        <rect x="190" y="30" width="20" height="20" fill="#2196F3" />
                        <rect x="220" y="30" width="20" height="20" fill="#2196F3" />
                        <rect x="250" y="30" width="20" height="20" fill="#2196F3" />
                        <text x="205" y="70" text-anchor="middle" fill="#333" font-size="16">4</text>
                        
                        <text x="130" y="100" text-anchor="middle" fill="#333" font-size="24">=</text>
                        <text x="160" y="100" text-anchor="middle" fill="#333" font-size="20">?</text>
                    </svg>`,
                    options: ['6', '7', '8', '9'],
                    correct: '8',
                    explanation: 'Pour calculer 4 + 4, on ajoute 4 carrés rouges à 4 carrés bleus, ce qui donne 8 carrés au total. 4 + 4 = 8'
                },
                {
                    question: 'Combien font 5 + 3 ? Compte les doigts pour trouver le résultat.',
                    image: `<svg width="280" height="140" viewBox="0 0 280 140">
                        <path d="M30,100 C 20,70 20,60 30,40 C 35,30 45,35 45,45 L45,90" fill="#FFE0B2" stroke="#333" />
                        <path d="M45,90 C 45,60 45,50 50,40 C 55,30 65,35 65,45 L65,85" fill="#FFE0B2" stroke="#333" />
                        <path d="M65,85 C 65,60 65,50 75,30 C 80,20 90,25 90,35 L85,85" fill="#FFE0B2" stroke="#333" />
                        <path d="M85,85 C 85,60 85,50 95,30 C 100,20 110,25 105,40 L100,85" fill="#FFE0B2" stroke="#333" />
                        <path d="M100,85 C 110,85 115,65 110,45 C 105,35 90,35 90,45 L100,85" fill="#FFE0B2" stroke="#333" />
                        <path d="M30,100 C 40,105 70,110 100,85" fill="#FFE0B2" stroke="#333" />
                        <text x="65" y="120" text-anchor="middle" fill="#333" font-size="16">5 doigts</text>
                        
                        <text x="130" y="70" text-anchor="middle" fill="#333" font-size="24">+</text>
                        
                        <path d="M160,100 C 150,70 150,60 160,40 C 165,30 175,35 175,45 L175,90" fill="#FFE0B2" stroke="#333" />
                        <path d="M175,90 C 175,60 175,50 180,40 C 185,30 195,35 195,45 L195,85" fill="#FFE0B2" stroke="#333" />
                        <path d="M195,85 C 195,60 195,50 205,30 C 210,20 220,25 220,35 L215,85" fill="#FFE0B2" stroke="#333" />
                        <ellipse cx="190" cy="110" rx="40" ry="10" fill="#FFE0B2" stroke="#333" />
                        <text x="190" y="120" text-anchor="middle" fill="#333" font-size="16">3 doigts</text>
                        
                        <text x="240" y="70" text-anchor="middle" fill="#333" font-size="24">=</text>
                        <text x="240" y="100" text-anchor="middle" fill="#333" font-size="20">?</text>
                    </svg>`,
                    options: ['7', '8', '9', '10'],
                    correct: '8',
                    explanation: 'Pour calculer 5 + 3, on additionne 5 doigts et 3 doigts, ce qui donne 8 doigts au total. 5 + 3 = 8'
                }
            ]
        }
    ],
    langues: [
        {
            id: 'langue-alphabet',
            title: 'L\'alphabet',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quelle lettre vient après B dans l\'alphabet ? Observe cette partie de l\'alphabet.',
                    image: `<svg width="300" height="100" viewBox="0 0 300 100">
                        <rect x="20" y="30" width="40" height="40" rx="5" fill="#2196F3" stroke="#333" />
                        <rect x="70" y="30" width="40" height="40" rx="5" fill="#2196F3" stroke="#333" />
                        <rect x="120" y="30" width="40" height="40" rx="5" fill="#FF5722" stroke="#333" />
                        <rect x="170" y="30" width="40" height="40" rx="5" fill="#9C27B0" stroke="#333" />
                        <rect x="220" y="30" width="40" height="40" rx="5" fill="#9C27B0" stroke="#333" />
                        <text x="40" y="55" text-anchor="middle" fill="white" font-size="20">A</text>
                        <text x="90" y="55" text-anchor="middle" fill="white" font-size="20">B</text>
                        <text x="140" y="55" text-anchor="middle" fill="white" font-size="20">?</text>
                        <text x="190" y="55" text-anchor="middle" fill="white" font-size="20">D</text>
                        <text x="240" y="55" text-anchor="middle" fill="white" font-size="20">E</text>
                    </svg>`,
                    options: ['A', 'C', 'D', 'E'],
                    correct: 'C',
                    explanation: 'L\'alphabet français suit cet ordre : A, B, C, D, E... Après B vient la lettre C.'
                },
                {
                    question: 'Combien de voyelles y a-t-il dans l\'alphabet français ? Les voyelles sont : A, E, I, O, U, Y.',
                    image: `<svg width="300" height="120" viewBox="0 0 300 120">
                        <rect x="20" y="20" width="40" height="40" rx="5" fill="#FF5722" stroke="#333" />
                        <rect x="70" y="20" width="40" height="40" rx="5" fill="#4CAF50" stroke="#333" />
                        <rect x="120" y="20" width="40" height="40" rx="5" fill="#FF5722" stroke="#333" />
                        <rect x="170" y="20" width="40" height="40" rx="5" fill="#4CAF50" stroke="#333" />
                        <rect x="220" y="20" width="40" height="40" rx="5" fill="#FF5722" stroke="#333" />
                        <text x="40" y="45" text-anchor="middle" fill="white" font-size="20">A</text>
                        <text x="90" y="45" text-anchor="middle" fill="white" font-size="20">B</text>
                        <text x="140" y="45" text-anchor="middle" fill="white" font-size="20">E</text>
                        <text x="190" y="45" text-anchor="middle" fill="white" font-size="20">F</text>
                        <text x="240" y="45" text-anchor="middle" fill="white" font-size="20">I</text>
                        
                        <rect x="45" y="70" width="40" height="40" rx="5" fill="#4CAF50" stroke="#333" />
                        <rect x="95" y="70" width="40" height="40" rx="5" fill="#FF5722" stroke="#333" />
                        <rect x="145" y="70" width="40" height="40" rx="5" fill="#4CAF50" stroke="#333" />
                        <rect x="195" y="70" width="40" height="40" rx="5" fill="#FF5722" stroke="#333" />
                        <text x="65" y="95" text-anchor="middle" fill="white" font-size="20">M</text>
                        <text x="115" y="95" text-anchor="middle" fill="white" font-size="20">O</text>
                        <text x="165" y="95" text-anchor="middle" fill="white" font-size="20">P</text>
                        <text x="215" y="95" text-anchor="middle" fill="white" font-size="20">U</text>
                    </svg>`,
                    options: ['4', '5', '6', '7'],
                    correct: '6',
                    explanation: 'Il y a 6 voyelles dans l\'alphabet français : A, E, I, O, U et Y. Toutes les autres lettres sont des consonnes.'
                },
                {
                    question: 'Quelle est la dernière lettre de l\'alphabet ? Complète cette série.',
                    image: `<svg width="300" height="100" viewBox="0 0 300 100">
                        <rect x="20" y="30" width="40" height="40" rx="5" fill="#9C27B0" stroke="#333" />
                        <rect x="70" y="30" width="40" height="40" rx="5" fill="#9C27B0" stroke="#333" />
                        <rect x="120" y="30" width="40" height="40" rx="5" fill="#9C27B0" stroke="#333" />
                        <rect x="170" y="30" width="40" height="40" rx="5" fill="#9C27B0" stroke="#333" />
                        <rect x="220" y="30" width="40" height="40" rx="5" fill="#FF5722" stroke="#333" />
                        <text x="40" y="55" text-anchor="middle" fill="white" font-size="20">V</text>
                        <text x="90" y="55" text-anchor="middle" fill="white" font-size="20">W</text>
                        <text x="140" y="55" text-anchor="middle" fill="white" font-size="20">X</text>
                        <text x="190" y="55" text-anchor="middle" fill="white" font-size="20">Y</text>
                        <text x="240" y="55" text-anchor="middle" fill="white" font-size="20">?</text>
                    </svg>`,
                    options: ['X', 'Y', 'Z', 'W'],
                    correct: 'Z',
                    explanation: 'L\'alphabet français se termine par la lettre Z. L\'ordre complet est : ... V, W, X, Y, Z.'
                }
            ]
        },
        {
            id: 'langue-vocab',
            title: 'Vocabulaire des animaux',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quel animal fait "Miaou" ? Écoute attentivement le son que chaque animal produit.',
                    image: `<svg width="300" height="120" viewBox="0 0 300 120">
                        <ellipse cx="60" cy="60" rx="40" ry="30" fill="#FFE0B2" stroke="#333" />
                        <circle cx="40" cy="50" r="5" fill="#333" />
                        <circle cx="80" cy="50" r="5" fill="#333" />
                        <path d="M50,70 Q60,75 70,70" stroke="#333" fill="none" />
                        <path d="M20,40 L40,30" stroke="#333" fill="none" />
                        <path d="M100,40 L80,30" stroke="#333" fill="none" />
                        <text x="60" y="100" text-anchor="middle" fill="#333" font-size="14">Chat - "Miaou"</text>
                        
                        <ellipse cx="180" cy="60" rx="40" ry="30" fill="#E0E0E0" stroke="#333" />
                        <circle cx="160" cy="50" r="5" fill="#333" />
                        <circle cx="200" cy="50" r="5" fill="#333" />
                        <path d="M170,70 Q180,75 190,70" stroke="#333" fill="none" />
                        <path d="M140,30 Q180,20 220,30" stroke="#333" fill="none" />
                        <text x="180" y="100" text-anchor="middle" fill="#333" font-size="14">Chien - "Ouaf"</text>
                    </svg>`,
                    options: ['Chien', 'Chat', 'Vache', 'Mouton'],
                    correct: 'Chat',
                    explanation: 'Le chat fait "Miaou". Chaque animal a son propre cri caractéristique. Le chien fait "Ouaf", la vache fait "Meuh" et le mouton fait "Bêê".'
                },
                {
                    question: 'Quel animal fait "Meuh" ? Associe le bon cri à l\'animal correspondant.',
                    image: `<svg width="300" height="150" viewBox="0 0 300 150">
                        <ellipse cx="50" cy="60" rx="30" ry="20" fill="#A5D6A7" stroke="#333" />
                        <ellipse cx="50" cy="40" rx="10" ry="5" fill="#81C784" stroke="#333" />
                        <line x1="30" y1="80" x2="25" y2="100" stroke="#333" />
                        <line x1="50" y1="80" x2="45" y2="100" stroke="#333" />
                        <line x1="70" y1="80" x2="65" y2="100" stroke="#333" />
                        <line x1="90" y1="80" x2="85" y2="100" stroke="#333" />
                        <text x="50" y="120" text-anchor="middle" fill="#333" font-size="14">Chèvre - "Bêê"</text>
                        
                        <ellipse cx="150" cy="65" rx="30" ry="20" fill="#FFB74D" stroke="#333" />
                        <path d="M180,50 C200,30 200,40 190,50" stroke="#333" fill="#FFB74D" />
                        <circle cx="150" cy="60" r="3" fill="#333" />
                        <text x="150" y="95" text-anchor="middle" fill="#333" font-size="14">Cochon - "Groin"</text>
                        
                        <ellipse cx="250" cy="75" rx="25" ry="15" fill="#FFCDD2" stroke="#333" />
                        <ellipse cx="250" cy="40" rx="10" ry="20" fill="#EF9A9A" stroke="#333" />
                        <ellipse cx="240" cy="40" r="3" fill="#333" />
                        <ellipse cx="260" cy="40" r="3" fill="#333" />
                        <line x1="235" y1="95" x2="235" y2="120" stroke="#333" />
                        <line x1="265" y1="95" x2="265" y2="120" stroke="#333" />
                        <text x="250" y="140" text-anchor="middle" fill="#333" font-size="14">Vache - "Meuh"</text>
                    </svg>`,
                    options: ['Chèvre', 'Cochon', 'Vache', 'Poule'],
                    correct: 'Vache',
                    explanation: 'La vache fait "Meuh". C\'est un son grave et prolongé. La chèvre fait "Bêê", le cochon fait "Groin" et la poule fait "Cot-cot".'
                },
                {
                    question: 'Quel animal parmi ces quatre vit principalement dans l\'eau ?',
                    image: `<svg width="320" height="150" viewBox="0 0 320 150">
                        <path d="M50,60 C 60,40 80,40 90,60 S75,80 50,60" fill="#64B5F6" stroke="#333" />
                        <circle cx="75" cy="55" r="3" fill="#333" />
                        <path d="M90,55 L100,50" stroke="#333" />
                        <text x="70" y="90" text-anchor="middle" fill="#333" font-size="14">Poisson</text>
                        
                        <ellipse cx="160" cy="65" rx="30" ry="20" fill="#FFB74D" stroke="#333" />
                        <path d="M180,50 C200,30 200,40 190,50" stroke="#333" fill="#FFB74D" />
                        <circle cx="150" cy="60" r="3" fill="#333" />
                        <text x="160" y="95" text-anchor="middle" fill="#333" font-size="14">Lion</text>
                        
                        <ellipse cx="250" cy="75" rx="25" ry="15" fill="#9E9E9E" stroke="#333" />
                        <ellipse cx="250" cy="40" rx="10" ry="20" fill="#9E9E9E" stroke="#333" />
                        <ellipse cx="270" cy="40" rx="5" ry="15" fill="#9E9E9E" stroke="#333" />
                        <line x1="240" y1="90" x2="240" y2="120" stroke="#333" />
                        <line x1="260" y1="90" x2="260" y2="120" stroke="#333" />
                        <text x="250" y="140" text-anchor="middle" fill="#333" font-size="14">Éléphant</text>
                        
                        <ellipse cx="350" cy="65" rx="15" ry="30" fill="#FFF176" stroke="#333" />
                        <line x1="350" y1="35" x2="350" y2="10" stroke="#333" />
                        <text x="350" y="105" text-anchor="middle" fill="#333" font-size="14">Girafe</text>
                    </svg>`,
                    options: ['Poisson', 'Lion', 'Éléphant', 'Girafe'],
                    correct: 'Poisson',
                    explanation: 'Le poisson vit dans l\'eau et respire grâce à des branchies. Le lion vit dans les savanes, l\'éléphant dans les forêts et savanes, et la girafe dans les savanes africaines.'
                }
            ]
        }
    ],
    geo: [
        {
            id: 'geo-continents',
            title: 'Les continents du monde',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Combien de continents y a-t-il sur Terre ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <path d="M50,50 Q60,30 70,50 T90,50" fill="#9CCC65" stroke="#33691E" stroke-width="2"/>
                        <path d="M110,60 Q130,40 150,60 T180,60" fill="#9CCC65" stroke="#33691E" stroke-width="2"/>
                        <path d="M200,70 Q210,50 220,70" fill="#9CCC65" stroke="#33691E" stroke-width="2"/>
                        <path d="M30,90 Q60,80 90,90 T150,90" fill="#9CCC65" stroke="#33691E" stroke-width="2"/>
                        <path d="M170,100 Q190,90 210,100" fill="#9CCC65" stroke="#33691E" stroke-width="2"/>
                        <path d="M70,120 Q90,110 110,120" fill="#9CCC65" stroke="#33691E" stroke-width="2"/>
                        <ellipse cx="240,75" cy="120" rx="15" ry="10" fill="#9CCC65" stroke="#33691E" stroke-width="2"/>
                        <circle cx="140" cy="75" r="60" fill="none" stroke="#2196F3" stroke-width="2" stroke-dasharray="5,5"/>
                        <text x="140" y="30" text-anchor="middle" fill="#333" font-size="16">Planète Terre</text>
                    </svg>`,
                    options: ['5', '6', '7', '8'],
                    correct: '7',
                    explanation: 'Il y a 7 continents sur Terre : l\'Europe, l\'Asie, l\'Afrique, l\'Amérique du Nord, l\'Amérique du Sud, l\'Océanie et l\'Antarctique.'
                },
                {
                    question: 'Quel est le plus grand continent du monde ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <path d="M90,40 Q120,20 150,40 T200,50" fill="#FFECB3" stroke="#FF8F00" stroke-width="2"/>
                        <text x="140" y="45" text-anchor="middle" fill="#333" font-size="14">Asie</text>
                        <path d="M50,60 Q70,50 90,60" fill="#A5D6A7" stroke="#2E7D32" stroke-width="2"/>
                        <text x="70" y="65" text-anchor="middle" fill="#333" font-size="12">Europe</text>
                        <path d="M70,80 Q100,70 130,90" fill="#FFAB91" stroke="#BF360C" stroke-width="2"/>
                        <text x="100" y="95" text-anchor="middle" fill="#333" font-size="14">Afrique</text>
                        <path d="M30,40 Q40,20 50,40" fill="#90CAF9" stroke="#1565C0" stroke-width="2"/>
                        <text x="40" y="35" text-anchor="middle" fill="#333" font-size="10">Amérique du Nord</text>
                        <path d="M40,100 Q50,90 60,100" fill="#CE93D8" stroke="#6A1B9A" stroke-width="2"/>
                        <text x="50" y="110" text-anchor="middle" fill="#333" font-size="10">Amérique du Sud</text>
                        <ellipse cx="220" cy="100" rx="15" ry="10" fill="#80DEEA" stroke="#00838F" stroke-width="2"/>
                        <text x="220" y="105" text-anchor="middle" fill="#333" font-size="10">Océanie</text>
                        <path d="M150,120 Q180,110 210,120" fill="#F5F5F5" stroke="#424242" stroke-width="2"/>
                        <text x="180" y="125" text-anchor="middle" fill="#333" font-size="10">Antarctique</text>
                    </svg>`,
                    options: ['Europe', 'Asie', 'Afrique', 'Amérique du Nord'],
                    correct: 'Asie',
                    explanation: 'L\'Asie est le plus grand continent du monde avec une superficie d\'environ 44 millions de km². Elle abrite plus de 60% de la population mondiale.'
                },
                {
                    question: 'Sur quel continent se trouve la France ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <path d="M60,30 Q100,20 140,30 T180,30" fill="#A5D6A7" stroke="#2E7D32" stroke-width="2"/>
                        <path d="M90,40 Q93,38 96,40 T102,40" fill="#E57373" stroke="#B71C1C" stroke-width="2"/>
                        <text x="96" y="45" text-anchor="middle" fill="#333" font-size="10">France</text>
                        <path d="M70,30 Q75,25 80,30" fill="#FFF176" stroke="#F57F17" stroke-width="2"/>
                        <text x="75" y="25" text-anchor="middle" fill="#333" font-size="10">Allemagne</text>
                        <path d="M120,30 Q125,25 130,30" fill="#81D4FA" stroke="#0D47A1" stroke-width="2"/>
                        <text x="125" y="25" text-anchor="middle" fill="#333" font-size="10">Italie</text>
                        <text x="120" y="70" text-anchor="middle" fill="#333" font-size="16">Europe</text>
                    </svg>`,
                    options: ['Europe', 'Asie', 'Afrique', 'Amérique'],
                    correct: 'Europe',
                    explanation: 'La France se trouve sur le continent européen. C\'est un pays d\'Europe occidentale qui partage ses frontières avec la Belgique, le Luxembourg, l\'Allemagne, la Suisse, l\'Italie, Monaco, l\'Espagne et Andorre.'
                }
            ]
        },
        {
            id: 'geo-france',
            title: 'La France et ses régions',
            type: 'quiz',
            difficulty: 2,
            questions: [
                {
                    question: 'Quelle est la capitale de la France ?',
                    image: `<svg width="250" height="150" viewBox="0 0 250 150">
                        <path d="M50,30 Q90,20 130,30 Q170,40 210,30" fill="#E57373" stroke="#B71C1C" stroke-width="2"/>
                        <circle cx="125" cy="35" r="5" fill="#333"/>
                        <rect x="80" y="65" width="20" height="30" fill="#A5D6A7" stroke="#333"/>
                        <text x="125" y="25" text-anchor="middle" fill="#333" font-size="12">Paris</text>
                        <circle cx="70" cy="70" r="3" fill="#333"/>
                        <text x="70" y="80" text-anchor="middle" fill="#333" font-size="10">Bordeaux</text>
                        <circle cx="170" cy="70" r="3" fill="#333"/>
                        <text x="170" y="80" text-anchor="middle" fill="#333" font-size="10">Lyon</text>
                        <circle cx="90" cy="40" r="3" fill="#333"/>
                        <text x="90" y="50" text-anchor="middle" fill="#333" font-size="10">Nantes</text>
                        <circle cx="180" cy="40" r="3" fill="#333"/>
                        <text x="180" y="50" text-anchor="middle" fill="#333" font-size="10">Strasbourg</text>
                        <circle cx="130" cy="90" r="3" fill="#333"/>
                        <text x="130" y="100" text-anchor="middle" fill="#333" font-size="10">Toulouse</text>
                        <circle cx="190" cy="90" r="3" fill="#333"/>
                        <text x="190" y="100" text-anchor="middle" fill="#333" font-size="10">Marseille</text>
                    </svg>`,
                    options: ['Lyon', 'Paris', 'Marseille', 'Bordeaux'],
                    correct: 'Paris',
                    explanation: 'Paris est la capitale de la France. C\'est la plus grande ville du pays et elle est connue pour ses monuments comme la Tour Eiffel, l\'Arc de Triomphe et Notre-Dame.'
                },
                {
                    question: 'Combien y a-t-il de régions en France métropolitaine depuis 2016 ?',
                    image: `<svg width="250" height="150" viewBox="0 0 250 150">
                        <path d="M30,30 Q90,10 150,30 Q200,50 230,30" fill="#E57373" stroke="#B71C1C" stroke-width="2"/>
                        <path d="M50,40 L100,60" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
                        <path d="M110,60 L160,70" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
                        <path d="M170,70 L200,45" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
                        <path d="M50,40 L75,90" stroke="#333" stroke-width="1"/>
                        <path d="M75,90 L120,100" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
                        <path d="M120,100 L180,90" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
                        <text x="125" y="125" text-anchor="middle" fill="#333" font-size="14">Régions de France</text>
                    </svg>`,
                    options: ['10', '13', '17', '22'],
                    correct: '13',
                    explanation: 'Depuis 2016, la France métropolitaine compte 13 régions au lieu des 22 précédentes. Cette réorganisation territoriale visait à créer des régions plus grandes et plus compétitives.'
                },
                {
                    question: 'Quelle mer borde le sud de la France ?',
                    image: `<svg width="250" height="150" viewBox="0 0 250 150">
                        <path d="M50,30 Q90,20 130,30 Q170,40 210,30" fill="#E57373" stroke="#B71C1C" stroke-width="2"/>
                        <path d="M20,90 Q70,80 120,90 Q170,100 220,90" fill="#64B5F6" stroke="#1565C0" stroke-width="2"/>
                        <text x="125" y="110" text-anchor="middle" fill="#333" font-size="14">Mer Méditerranée</text>
                        <path d="M30,20 Q50,10 70,20" fill="#64B5F6" stroke="#1565C0" stroke-width="2"/>
                        <text x="50" y="15" text-anchor="middle" fill="#333" font-size="10">Manche</text>
                        <path d="M20,40 Q30,30 40,40" fill="#64B5F6" stroke="#1565C0" stroke-width="2"/>
                        <text x="30" y="35" text-anchor="middle" fill="#333" font-size="8">Océan Atlantique</text>
                    </svg>`,
                    options: ['La Manche', 'L\'Océan Atlantique', 'La Mer Méditerranée', 'La Mer du Nord'],
                    correct: 'La Mer Méditerranée',
                    explanation: 'Le sud de la France est bordé par la Mer Méditerranée. À l\'ouest, la France est bordée par l\'Océan Atlantique, et au nord par la Manche et la Mer du Nord.'
                }
            ]
        }
    ],
    metiers: [
        {
            id: 'metiers-basics',
            title: 'Qu\'est-ce qu\'un métier ?',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Qu\'est-ce qu\'un métier ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <rect x="60" y="30" width="50" height="60" fill="#FFCCBC" stroke="#333"/>
                        <circle cx="85" cy="50" r="10" fill="#FFECB3" stroke="#333"/>
                        <rect x="80" y="65" width="10" height="25" fill="#A5D6A7" stroke="#333"/>
                        <path d="M75,90 L70,110" stroke="#333" stroke-width="2"/>
                        <path d="M95,90 L100,110" stroke="#333" stroke-width="2"/>
                        <rect x="160" y="30" width="60" height="20" fill="#B39DDB" stroke="#333"/>
                        <text x="190" y="45" text-anchor="middle" fill="#333" font-size="12">ÉCOLE</text>
                        <path d="M110,60 L160,40" stroke="#333" stroke-width="1" stroke-dasharray="3,3"/>
                        <circle cx="140" cy="100" r="20" fill="#B0BEC5" stroke="#333"/>
                        <text x="140" y="105" text-anchor="middle" fill="#333" font-size="14">€</text>
                        <path d="M95,80 L130,85" stroke="#333" stroke-width="1" stroke-dasharray="3,3"/>
                    </svg>`,
                    options: [
                        'Un jeu vidéo', 
                        'Une activité qu\'on fait pour s\'amuser', 
                        'Une activité professionnelle qu\'on exerce régulièrement en échange d\'un salaire', 
                        'Un sport'
                    ],
                    correct: 'Une activité professionnelle qu\'on exerce régulièrement en échange d\'un salaire',
                    explanation: 'Un métier est une activité professionnelle qu\'une personne exerce régulièrement pour gagner sa vie. Il nécessite souvent des compétences et une formation spécifiques.'
                },
                {
                    question: 'Pourquoi les gens travaillent-ils ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <circle cx="60" cy="50" r="20" fill="#B0BEC5" stroke="#333"/>
                        <text x="60" y="55" text-anchor="middle" fill="#333" font-size="14">€</text>
                        <circle cx="140" cy="50" r="20" fill="#FFECB3" stroke="#333"/>
                        <text x="140" y="55" text-anchor="middle" fill="#333" font-size="14">♥</text>
                        <circle cx="220" cy="50" r="20" fill="#A5D6A7" stroke="#333"/>
                        <text x="220" y="55" text-anchor="middle" fill="#333" font-size="14">🏠</text>
                        <text x="60" y="80" text-anchor="middle" fill="#333" font-size="12">Gagner de l'argent</text>
                        <text x="140" y="80" text-anchor="middle" fill="#333" font-size="12">Aider les autres</text>
                        <text x="220" y="80" text-anchor="middle" fill="#333" font-size="12">Construire</text>
                        <circle cx="100" cy="120" r="20" fill="#B39DDB" stroke="#333"/>
                        <text x="100" y="125" text-anchor="middle" fill="#333" font-size="14">🎓</text>
                        <circle cx="180" cy="120" r="20" fill="#90CAF9" stroke="#333"/>
                        <text x="180" y="125" text-anchor="middle" fill="#333" font-size="14">😊</text>
                        <text x="100" y="150" text-anchor="middle" fill="#333" font-size="12">Apprendre</text>
                        <text x="180" y="150" text-anchor="middle" fill="#333" font-size="12">Se sentir utile</text>
                    </svg>`,
                    options: [
                        'Seulement pour gagner de l\'argent',
                        'Pour s\'amuser uniquement',
                        'Pour plusieurs raisons : gagner de l\'argent, se sentir utile, aider les autres, etc.',
                        'Pour ne pas aller à l\'école'
                    ],
                    correct: 'Pour plusieurs raisons : gagner de l\'argent, se sentir utile, aider les autres, etc.',
                    explanation: 'Les gens travaillent pour différentes raisons : gagner de l\'argent pour vivre, mais aussi pour se sentir utile, développer leurs talents, aider les autres ou la société, et s\'épanouir personnellement.'
                },
                {
                    question: 'Comment apprend-on un métier ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <rect x="40" y="40" width="60" height="30" fill="#B39DDB" stroke="#333"/>
                        <text x="70" y="60" text-anchor="middle" fill="#333" font-size="12">ÉCOLE</text>
                        <rect x="40" y="90" width="60" height="30" fill="#90CAF9" stroke="#333"/>
                        <text x="70" y="110" text-anchor="middle" fill="#333" font-size="12">STAGE</text>
                        <rect x="180" y="40" width="60" height="30" fill="#A5D6A7" stroke="#333"/>
                        <text x="210" y="60" text-anchor="middle" fill="#333" font-size="12">FORMATION</text>
                        <rect x="180" y="90" width="60" height="30" fill="#FFECB3" stroke="#333"/>
                        <text x="210" y="110" text-anchor="middle" fill="#333" font-size="12">PRATIQUE</text>
                        <path d="M100,55 L180,55" stroke="#333" stroke-width="1" stroke-dasharray="3,3"/>
                        <path d="M100,105 L180,105" stroke="#333" stroke-width="1" stroke-dasharray="3,3"/>
                        <path d="M70,70 L70,90" stroke="#333" stroke-width="1"/>
                        <path d="M210,70 L210,90" stroke="#333" stroke-width="1"/>
                        <circle cx="140" cy="80" r="15" fill="#E57373" stroke="#333"/>
                        <text x="140" y="85" text-anchor="middle" fill="#333" font-size="12">+</text>
                    </svg>`,
                    options: [
                        'On naît en sachant déjà tout faire',
                        'En regardant la télévision uniquement',
                        'Par la formation (école, apprentissage) et la pratique (stages, expérience)',
                        'On ne peut pas apprendre, soit on sait faire, soit on ne sait pas'
                    ],
                    correct: 'Par la formation (école, apprentissage) et la pratique (stages, expérience)',
                    explanation: 'On apprend un métier par différents moyens : l\'école, les formations professionnelles, l\'apprentissage auprès d\'un professionnel, les stages pratiques et l\'expérience acquise en travaillant.'
                }
            ]
        },
        {
            id: 'metiers-types',
            title: 'Découverte des métiers',
            type: 'quiz',
            difficulty: 2,
            questions: [
                {
                    question: 'Quel métier consiste à soigner les malades à l\'hôpital ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <rect x="90" y="30" width="100" height="70" fill="#ECEFF1" stroke="#333"/>
                        <rect x="130" y="100" width="20" height="20" fill="#ECEFF1" stroke="#333"/>
                        <rect x="120" y="50" width="40" height="30" fill="#81D4FA" stroke="#333"/>
                        <text x="140" y="70" text-anchor="middle" fill="#333" font-size="14">H</text>
                        <circle cx="70" cy="70" r="15" fill="#FFECB3" stroke="#333"/>
                        <rect x="65" y="60" width="10" height="20" fill="#FFCCBC" stroke="#333"/>
                        <rect x="210" cy="70" rx="15" ry="20" fill="#FFECB3" stroke="#333"/>
                        <rect x="205" y="60" width="10" height="20" fill="#E57373" stroke="#333"/>
                        <text x="70" y="125" text-anchor="middle" fill="#333" font-size="14">Médecin</text>
                        <text x="210" y="125" text-anchor="middle" fill="#333" font-size="14">Infirmier/ère</text>
                    </svg>`,
                    options: ['Vétérinaire', 'Astronaute', 'Médecin', 'Boulanger'],
                    correct: 'Médecin',
                    explanation: 'Le médecin est le professionnel de santé qui diagnostique les maladies et prescrit des traitements pour soigner les patients. À l\'hôpital, plusieurs types de médecins travaillent ensemble avec d\'autres professionnels comme les infirmiers.'
                },
                {
                    question: 'Quel métier consiste à construire des maisons ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <polygon points="60,40 100,20 140,40" fill="#FFCCBC" stroke="#333"/>
                        <rect x="60" y="40" width="80" height="60" fill="#FFECB3" stroke="#333"/>
                        <rect x="90" y="70" width="20" height="30" fill="#A5D6A7" stroke="#333"/>
                        <circle cx="180" cy="60" r="15" fill="#FFECB3" stroke="#333"/>
                        <rect x="165" y="75" width="30" height="25" fill="#B39DDB" stroke="#333"/>
                        <rect x="170" y="80" width="20" height="20" fill="#90CAF9" stroke="#333"/>
                        <circle cx="180" cy="30" r="10" fill="#FFECB3" stroke="#333"/>
                        <rect x="177" y="40" width="6" height="20" fill="#B39DDB" stroke="#333"/>
                        <text x="100" y="125" text-anchor="middle" fill="#333" font-size="14">Architecte</text>
                        <text x="180" y="125" text-anchor="middle" fill="#333" font-size="14">Maçon</text>
                    </svg>`,
                    options: ['Architecte', 'Agriculteur', 'Maçon', 'Pilote'],
                    correct: 'Maçon',
                    explanation: 'Le maçon est un professionnel du bâtiment qui construit les murs et les structures des bâtiments. L\'architecte conçoit les plans, mais c\'est le maçon et d\'autres ouvriers du bâtiment qui réalisent la construction concrète.'
                },
                {
                    question: 'Quel métier consiste à enseigner à l\'école ?',
                    image: `<svg width="280" height="150" viewBox="0 0 280 150">
                        <rect x="60" y="30" width="160" height="80" fill="#E1F5FE" stroke="#333"/>
                        <rect x="80" y="40" width="120" height="30" fill="#B3E5FC" stroke="#333"/>
                        <text x="140" y="60" text-anchor="middle" fill="#333" font-size="14">TABLEAU</text>
                        <circle cx="100" cy="90" r="10" fill="#FFECB3" stroke="#333"/>
                        <circle cx="130" cy="90" r="10" fill="#FFECB3" stroke="#333"/>
                        <circle cx="160" cy="90" r="10" fill="#FFECB3" stroke="#333"/>
                        <circle cx="190" cy="90" r="10" fill="#FFECB3" stroke="#333"/>
                        <circle cx="70" cy="60" r="15" fill="#FFECB3" stroke="#333"/>
                        <rect x="65" y="75" width="10" height="20" fill="#B39DDB" stroke="#333"/>
                        <text x="70" y="125" text-anchor="middle" fill="#333" font-size="14">Professeur</text>
                        <text x="160" y="125" text-anchor="middle" fill="#333" font-size="14">Élèves</text>
                    </svg>`,
                    options: ['Boulanger', 'Professeur', 'Pompier', 'Jardinier'],
                    correct: 'Professeur',
                    explanation: 'Le professeur ou l\'enseignant est le professionnel chargé de transmettre des connaissances et d\'aider les élèves à apprendre. Il prépare et donne des cours, évalue les progrès des élèves et les accompagne dans leur apprentissage.'
                }
            ]
        }
    ]
};

// Audio explanations for modules and activities
const moduleAudioExplanations = {
    maths: {
        moduleIntro: "Bienvenue dans le monde des mathématiques ! Ici, tu vas découvrir les nombres, apprendre à compter, à additionner et bien plus encore. Prépare-toi pour une aventure pleine de défis amusants !",
        activities: {
            'math-numbers': "Aujourd'hui, nous allons explorer les nombres de 1 à 10. Sais-tu compter jusqu'à 10 ? Regarde bien les images et compte attentivement les objets pour trouver la bonne réponse !",
            'math-shapes': "Les formes sont partout autour de nous ! Un ballon est un cercle, une boîte est un carré ou un rectangle. Dans cette activité, tu vas apprendre à reconnaître ces formes.",
            'math-add': "L'addition, c'est quand on met ensemble deux groupes d'objets et qu'on compte combien il y en a au total. Par exemple, 2 pommes plus 3 pommes font 5 pommes en tout !"
        }
    },
    langues: {
        moduleIntro: "Bienvenue dans l'univers des langues ! Ici, tu vas apprendre les lettres, découvrir de nouveaux mots et même composer tes premières phrases. C'est le début d'une grande aventure !",
        activities: {
            'langue-alphabet': "L'alphabet est la base de notre langage. Il y a 26 lettres, de A à Z. Chaque lettre a un son spécial. Ensemble, nous allons apprendre à les reconnaître !",
            'langue-vocab': "Les animaux sont fascinants, n'est-ce pas ? Dans cette activité, tu vas apprendre comment ils s'appellent et quels sons ils font. Le chat fait miaou, et le chien fait ouaf !"
        }
    },
    sciences: {
        moduleIntro: "Bienvenue dans le laboratoire des sciences ! Ici, nous allons observer, expérimenter et découvrir comment fonctionne notre monde. Es-tu prêt à devenir un vrai scientifique ?",
        activities: {
            'science-sens': "Nous avons cinq sens merveilleux : la vue avec nos yeux, l'ouïe avec nos oreilles, l'odorat avec notre nez, le goût avec notre langue et le toucher avec notre peau. Découvrons-les ensemble !",
            'science-animals': "Le monde animal est plein de surprises ! Certains animaux volent, d'autres nagent ou rampent. Dans cette activité, nous allons découvrir où ils vivent et comment ils se déplacent."
        }
    },
    arts: {
        moduleIntro: "Bienvenue dans l'atelier des arts ! Ici, tu vas explorer les couleurs, les formes, les sons et laisser parler ton imagination. Prépare-toi à créer des chefs-d'œuvre !",
        activities: {
            'art-colors': "Les couleurs sont magiques ! Le rouge, le bleu, le jaune sont des couleurs primaires. En les mélangeant, tu peux créer de nouvelles couleurs comme le vert, l'orange ou le violet !",
            'art-music': "La musique est un langage universel. Elle peut nous rendre heureux, triste ou nous donner envie de danser. Aujourd'hui, nous allons découvrir différents instruments de musique !"
        }
    },
    sport: {
        moduleIntro: "Bienvenue dans l'univers du sport ! Ici, nous allons bouger, sauter, courir et jouer ensemble. Es-tu prêt à te dépenser et à t'amuser ?",
        activities: {
            'sport-moves': "Ton corps est extraordinaire ! Tu peux courir, sauter, te pencher, t'étirer et faire plein d'autres mouvements. Aujourd'hui, nous allons explorer toutes ces possibilités !",
            'sport-games': "Les jeux sportifs sont amusants et bons pour la santé. Ils nous apprennent aussi à jouer en équipe et à respecter des règles. Découvrons ensemble ces jeux passionnants !"
        }
    },
    geo: {
        moduleIntro: "Bienvenue dans le monde de la géographie ! Ici, nous allons explorer notre planète Terre, découvrir les continents, les pays, et apprendre à nous repérer sur une carte. Prépare-toi pour un voyage passionnant à travers le monde !",
        activities: {
            'geo-continents': "Notre planète Terre est divisée en grandes masses de terre qu'on appelle les continents. Il y en a 7 en tout ! Nous allons les découvrir ensemble et comprendre ce qui les rend uniques.",
            'geo-france': "La France est un pays situé en Europe. Elle a une forme qui ressemble un peu à un hexagone ! Découvrons ensemble ses régions, ses villes principales et ses beaux paysages."
        }
    },
    metiers: {
        moduleIntro: "Bienvenue dans le monde fascinant des métiers ! Ici, tu vas découvrir toutes sortes de professions et comprendre comment les gens travaillent pour répondre aux besoins de notre société. Es-tu prêt à explorer ce que tu pourrais faire plus tard ?",
        activities: {
            'metiers-basics': "Un métier, c'est une activité qu'on fait pour travailler et gagner sa vie. Mais c'est aussi une façon d'être utile aux autres et de faire ce qu'on aime ! Découvrons ensemble ce qu'est un métier.",
            'metiers-types': "Il existe des milliers de métiers différents dans le monde ! Certaines personnes soignent, d'autres construisent, enseignent, cuisinent... Partons à la découverte de ces différentes professions !"
        }
    }
};

// Définition des badges
const availableBadges = [
    { id: 'math-starter', emoji: '🔢', title: 'Mathématicien débutant', module: 'maths', condition: 'firstActivity' },
    { id: 'math-pro', emoji: '📊', title: 'Expert des nombres', module: 'maths', condition: 'progress50' },
    { id: 'langue-starter', emoji: '📝', title: 'Linguiste débutant', module: 'langues', condition: 'firstActivity' },
    { id: 'langue-pro', emoji: '📚', title: 'Maître des mots', module: 'langues', condition: 'progress50' },
    { id: 'science-starter', emoji: '🔬', title: 'Scientifique débutant', module: 'sciences', condition: 'firstActivity' },
    { id: 'science-pro', emoji: '🧪', title: 'Expert scientifique', module: 'sciences', condition: 'progress50' },
    { id: 'art-starter', emoji: '🎨', title: 'Artiste débutant', module: 'arts', condition: 'firstActivity' },
    { id: 'art-pro', emoji: '🎭', title: 'Maître artiste', module: 'arts', condition: 'progress50' },
    { id: 'sport-starter', emoji: '🏃', title: 'Sportif débutant', module: 'sport', condition: 'firstActivity' },
    { id: 'sport-pro', emoji: '🏆', title: 'Champion sportif', module: 'sport', condition: 'progress50' },
    { id: 'all-rounder', emoji: '🌟', title: 'Polyvalent', condition: 'allModules' },
    { id: 'points-100', emoji: '💯', title: '100 points', condition: 'points100' },
    { id: 'geo-starter', emoji: '🌍', title: 'Géographe débutant', module: 'geo', condition: 'firstActivity' },
    { id: 'geo-pro', emoji: '🗺️', title: 'Explorateur du monde', module: 'geo', condition: 'progress50' },
    { id: 'metiers-starter', emoji: '👷', title: 'Apprenti professionnel', module: 'metiers', condition: 'firstActivity' },
    { id: 'metiers-pro', emoji: '💼', title: 'Expert des métiers', module: 'metiers', condition: 'progress50' }
];

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initAvatarSelection();
    initModuleSelection();
    initButtonListeners();
    initAssistant();
    
    // Vérifier si des données utilisateur sont disponibles dans le localStorage
    const savedUser = localStorage.getItem('eduFunUser');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        updateUI();
        switchScreen('modules-screen');
        
        // Initialiser les quêtes si elles n'existent pas
        if (!appState.currentUser.currentQuests || appState.currentUser.currentQuests.length === 0) {
            initializeQuests();
        }
    }
});

// Initialisation des quêtes
function initializeQuests() {
    appState.currentUser.currentQuests = [];
    
    questTemplates.forEach(quest => {
        const newQuest = JSON.parse(JSON.stringify(quest)); // Deep copy
        appState.currentUser.currentQuests.push(newQuest);
    });
    
    saveUserData();
}

// Initialisation de la sélection d'avatar
function initAvatarSelection() {
    const avatars = document.querySelectorAll('.avatar-options .avatar');
    
    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            // Supprimer la classe selected de tous les avatars
            avatars.forEach(a => a.classList.remove('selected'));
            // Ajouter la classe selected à l'avatar cliqué
            avatar.classList.add('selected');
            // Mettre à jour l'état de l'application
            appState.currentUser.avatar = avatar.getAttribute('data-id');
        });
    });
    
    // Sélectionner par défaut le premier avatar
    avatars[0].classList.add('selected');
}

// Initialisation de la sélection de module
function initModuleSelection() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const moduleId = card.getAttribute('data-module');
            
            if (moduleId === 'dashboard') {
                updateDashboard();
                switchScreen('dashboard-screen');
            } else {
                appState.currentModule = moduleId;
                loadModuleActivities(moduleId);
            }
        });
    });
}

// Initialisation des écouteurs d'événements pour les boutons
function initButtonListeners() {
    // Bouton pour commencer l'aventure
    document.getElementById('start-adventure').addEventListener('click', () => {
        const userName = document.getElementById('user-name').value.trim();
        
        if (userName) {
            appState.currentUser.name = userName;
            updateUI();
            saveUserData();
            switchScreen('modules-screen');
        } else {
            alert('Merci d\'entrer ton prénom pour commencer l\'aventure !');
        }
    });
    
    // Bouton pour revenir aux modules depuis l'écran d'activité
    document.getElementById('back-to-modules').addEventListener('click', () => {
        switchScreen('modules-screen');
    });
    
    // Bouton pour revenir aux modules depuis le tableau de bord
    document.getElementById('back-to-modules-from-dashboard').addEventListener('click', () => {
        switchScreen('modules-screen');
    });
    
    // Bouton pour fermer la popup de récompense
    document.getElementById('close-reward').addEventListener('click', () => {
        document.getElementById('reward-popup').classList.remove('active');
    });
    
    // Événements pour la popup d'accès parents
    document.querySelector('.avatar-container').addEventListener('click', () => {
        document.getElementById('parent-login').classList.add('active');
    });
    
    document.getElementById('parent-login-cancel').addEventListener('click', () => {
        document.getElementById('parent-login').classList.remove('active');
    });
    
    document.getElementById('parent-login-submit').addEventListener('click', () => {
        const parentCode = document.getElementById('parent-code').value;
        
        // Code parent simple pour la démo: 1234
        if (parentCode === '1234') {
            alert('Accès aux statistiques détaillées sera disponible dans la prochaine mise à jour !');
            document.getElementById('parent-login').classList.remove('active');
        } else {
            alert('Code incorrect. Veuillez réessayer.');
        }
    });
}

// Mise à jour de l'interface utilisateur
function updateUI() {
    // Mettre à jour l'avatar
    const currentAvatar = document.getElementById('current-avatar');
    currentAvatar.className = 'avatar';
    currentAvatar.classList.add(`avatar-${appState.currentUser.avatar}`);
    
    // Mettre à jour le compteur de points
    document.getElementById('points-counter').textContent = appState.currentUser.points;
    
    // Animation des points si nécessaire
    if (appState.currentUser.points > 0) {
        gsap.from('#points-counter', {
            duration: 0.5,
            scale: 1.5,
            ease: "elastic.out(1, 0.3)"
        });
    }
}

// Changement d'écran
function switchScreen(screenId) {
    // Cacher tous les écrans
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher l'écran demandé
    document.getElementById(screenId).classList.add('active');
    
    // Mettre à jour l'état de l'application
    appState.currentScreen = screenId;
}

// Chargement des activités d'un module
function loadModuleActivities(moduleId) {
    const activityContent = document.getElementById('activity-content');
    activityContent.innerHTML = '';
    
    // Titre du module
    const moduleTitle = {
        maths: 'Mathématiques',
        langues: 'Langues',
        sciences: 'Sciences',
        arts: 'Arts',
        sport: 'Éducation physique',
        geo: 'Géographie',
        metiers: 'Métiers'
    }[moduleId];
    
    document.getElementById('activity-title').textContent = moduleTitle;
    
    // Afficher le personnage du module
    const character = appState.characters[moduleId];
    const characterHTML = `
        <div class="character-dialog">
            <div class="character-avatar" style="background-color: ${character.color}">${character.avatar}</div>
            <h3>${character.name}</h3>
            <p class="character-message">${character.intro}</p>
        </div>
    `;
    
    // Ajout du lecteur audio pour l'explication du module
    const audioExplanation = moduleAudioExplanations[moduleId].moduleIntro;
    const audioHTML = `
        <div class="audio-player" data-text="${audioExplanation}">
            <div class="audio-control" onclick="toggleAudioExplanation(this)">▶️</div>
            <div class="audio-status">
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
            </div>
            <div class="audio-progress">
                <div class="audio-progress-bar"></div>
            </div>
            <div class="audio-time">0:00</div>
        </div>
    `;
    
    // Afficher la quête active pour ce module
    const moduleQuest = appState.currentUser.currentQuests.find(q => q.module === moduleId);
    let questHTML = '';
    
    if (moduleQuest) {
        const objectives = moduleQuest.objectives.map(obj => {
            const isCompleted = appState.currentUser.completedActivities.includes(obj.id);
            return `<li class="quest-objective ${isCompleted ? 'completed' : ''}">${obj.text}</li>`;
        }).join('');
        
        questHTML = `
            <div class="quest-container">
                <div class="quest-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1L15.5 8.5L23 9.5L17.5 15L19 23L12 19L5 23L6.5 15L1 9.5L8.5 8.5L12 1Z" fill="#FFD700"/>
                    </svg>
                    <h3>${moduleQuest.title}</h3>
                </div>
                <p class="quest-description">${moduleQuest.description}</p>
                <ul class="quest-objectives">
                    ${objectives}
                </ul>
                <div class="quest-reward">
                    <span>Récompense:</span>
                    <strong>${moduleQuest.reward.points} points</strong>
                    <span>et un badge spécial !</span>
                </div>
            </div>
        `;
    }
    
    // Création de la liste des activités
    const activities = moduleActivities[moduleId];
    let activitiesHTML = '';
    
    if (activities && activities.length > 0) {
        activities.forEach(activity => {
            const isCompleted = appState.currentUser.completedActivities.includes(activity.id);
            
            activitiesHTML += `
                <div class="activity-item ${isCompleted ? 'completed' : ''}">
                    <h3>${activity.title} ${isCompleted ? '✓' : ''}</h3>
                    <p>Difficulté : ${'⭐'.repeat(activity.difficulty)}</p>
                    <button class="primary-button start-activity" data-activity-id="${activity.id}">
                        ${isCompleted ? 'Refaire' : 'Commencer'}
                    </button>
                </div>
            `;
        });
    } else {
        activitiesHTML = '<p>Pas d\'activités disponibles pour le moment.</p>';
    }
    
    activityContent.innerHTML = characterHTML + audioHTML + questHTML + activitiesHTML;
    
    // Ajouter des écouteurs d'événements pour démarrer les activités
    document.querySelectorAll('.start-activity').forEach(button => {
        button.addEventListener('click', (e) => {
            const activityId = e.target.getAttribute('data-activity-id');
            startActivity(moduleId, activityId);
        });
    });
    
    switchScreen('activity-screen');
}

// Démarrer une activité
function startActivity(moduleId, activityId) {
    const activity = moduleActivities[moduleId].find(a => a.id === activityId);
    
    if (!activity) return;
    
    // Préparer le contenu de l'activité avec l'audio explicatif
    const activityContent = document.getElementById('activity-content');
    
    // Ajout de l'explication audio pour cette activité spécifique
    const audioExplanation = moduleAudioExplanations[moduleId].activities[activityId];
    const audioHTML = `
        <div class="audio-player" data-text="${audioExplanation}">
            <div class="audio-control" onclick="toggleAudioExplanation(this)">▶️</div>
            <div class="audio-status">
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
            </div>
            <div class="audio-progress">
                <div class="audio-progress-bar"></div>
            </div>
            <div class="audio-time">0:00</div>
        </div>
    `;
    
    if (activity.type === 'quiz') {
        renderQuiz(activity, moduleId, audioHTML);
    }
}

// Rendre un quiz
function renderQuiz(quiz, moduleId, audioHTML = '') {
    const activityContent = document.getElementById('activity-content');
    
    const quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-container';
    
    // Intégrer l'explication audio au début du quiz
    if (audioHTML) {
        const audioDiv = document.createElement('div');
        audioDiv.innerHTML = audioHTML;
        quizContainer.appendChild(audioDiv.firstChild);
    }
    
    const questions = quiz.questions.map((q, index) => {
        return `
            <div class="question" data-index="${index}">
                <h3>Question ${index + 1} : ${q.question}</h3>
                ${q.image ? q.image : ''}
                <div class="options">
                    ${q.options.map((option, optIndex) => `
                        <div class="option" data-option="${option}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    quizContainer.innerHTML = questions[0];
    
    const nextButton = document.createElement('button');
    nextButton.className = 'primary-button';
    nextButton.id = 'next-question';
    nextButton.textContent = 'Question suivante';
    nextButton.style.display = 'none';
    
    const finishButton = document.createElement('button');
    finishButton.className = 'primary-button';
    finishButton.id = 'finish-quiz';
    finishButton.textContent = 'Terminer';
    finishButton.style.display = 'none';
    
    quizContainer.appendChild(nextButton);
    quizContainer.appendChild(finishButton);
    
    activityContent.innerHTML = '';
    activityContent.appendChild(quizContainer);
    
    // Variables pour suivre le quiz
    let currentQuestion = 0;
    let correctAnswers = 0;
    let hasAnswered = false;
    
    // Fonction pour vérifier la réponse
    function checkAnswer(selectedOption) {
        if (hasAnswered) return;
        
        hasAnswered = true;
        const question = quiz.questions[currentQuestion];
        const isCorrect = selectedOption === question.correct;
        
        if (isCorrect) {
            correctAnswers++;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        
        // Marquer les options comme correctes ou incorrectes
        document.querySelectorAll('.option').forEach(option => {
            if (option.getAttribute('data-option') === question.correct) {
                option.classList.add('correct');
            } else if (option.getAttribute('data-option') === selectedOption && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Afficher l'explication
        if (question.explanation) {
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'question-explanation';
            explanationDiv.innerHTML = `<p><strong>Explication :</strong> ${question.explanation}</p>`;
            document.querySelector('.question').appendChild(explanationDiv);
        }
        
        // Afficher le bouton pour la question suivante ou pour terminer
        if (currentQuestion < quiz.questions.length - 1) {
            nextButton.style.display = 'block';
        } else {
            finishButton.style.display = 'block';
        }
    }
    
    // Écouteur d'événements pour les options
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('option') && !hasAnswered) {
            const selectedOption = e.target.getAttribute('data-option');
            checkAnswer(selectedOption);
        }
    });
    
    // Écouteur d'événements pour le bouton suivant
    nextButton.addEventListener('click', () => {
        currentQuestion++;
        hasAnswered = false;
        
        const questionElement = document.querySelector('.question');
        questionElement.innerHTML = `
            <h3>Question ${currentQuestion + 1} : ${quiz.questions[currentQuestion].question}</h3>
            ${quiz.questions[currentQuestion].image ? quiz.questions[currentQuestion].image : ''}
            <div class="options">
                ${quiz.questions[currentQuestion].options.map((option, optIndex) => `
                    <div class="option" data-option="${option}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;
        
        nextButton.style.display = 'none';
    });
    
    // Écouteur d'événements pour le bouton terminer
    finishButton.addEventListener('click', () => {
        const score = Math.round((correctAnswers / quiz.questions.length) * 100);
        const stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;
        
        // Vérifier si l'activité est déjà complétée
        const isNewCompletion = !appState.currentUser.completedActivities.includes(quiz.id);
        
        // Ajouter des points à l'utilisateur si c'est une nouvelle complétion
        if (isNewCompletion) {
            const earnedPoints = stars * quiz.difficulty * 10;
            appState.currentUser.points += earnedPoints;
            
            // Mettre à jour le progrès du module
            updateModuleProgress(moduleId, quiz.difficulty * 5);
            
            // Ajouter l'activité aux activités complétées
            appState.currentUser.completedActivities.push(quiz.id);
            
            // Vérifier les badges
            checkAndAwardBadges(moduleId);
        }
        
        // Mettre à jour l'interface utilisateur
        updateUI();
        
        // Afficher le résultat
        const resultHTML = `
            <div class="quiz-result">
                <h3>Quiz terminé !</h3>
                <p>Tu as obtenu ${correctAnswers} réponses correctes sur ${quiz.questions.length}.</p>
                <div class="result-stars">${'⭐'.repeat(stars)}</div>
                ${isNewCompletion ? `<p>Tu as gagné ${stars * quiz.difficulty * 10} points !</p>` : ''}
                <button id="return-to-activities" class="primary-button">Retour aux activités</button>
            </div>
        `;
        
        activityContent.innerHTML = resultHTML;
        
        // Écouteur d'événements pour le bouton de retour
        document.getElementById('return-to-activities').addEventListener('click', () => {
            loadModuleActivities(moduleId);
        });
        
        // Sauvegarder les données de l'utilisateur
        saveUserData();
        
        // Vérifier l'achèvement de la quête
        checkQuestCompletion(quiz.id, moduleId);
    });
}

// Vérifie l'achèvement de la quête après une activité
function checkQuestCompletion(activityId, moduleId) {
    const quest = appState.currentUser.currentQuests.find(q => q.module === moduleId);
    
    if (!quest) return;
    
    // Marquer l'objectif comme complété
    const objective = quest.objectives.find(obj => obj.id === activityId);
    if (objective) {
        objective.completed = true;
    }
    
    // Vérifier si tous les objectifs sont complétés
    const allCompleted = quest.objectives.every(obj => 
        appState.currentUser.completedActivities.includes(obj.id)
    );
    
    if (allCompleted && !appState.currentUser.completedQuests.includes(quest.id)) {
        // Attribuer la récompense
        appState.currentUser.points += quest.reward.points;
        
        if (quest.reward.badge) {
            if (!appState.currentUser.badges.includes(quest.reward.badge)) {
                appState.currentUser.badges.push(quest.reward.badge);
                
                // Afficher la popup de récompense
                const rewardPopup = document.getElementById('reward-popup');
                const rewardMessage = document.getElementById('reward-message');
                const rewardBadge = document.getElementById('reward-badge');
                
                rewardMessage.textContent = `Tu as complété la quête "${quest.title}" ! Tu gagnes ${quest.reward.points} points et un badge spécial !`;
                rewardBadge.textContent = "🏆";
                
                rewardPopup.classList.add('active');
            }
        }
        
        appState.currentUser.completedQuests.push(quest.id);
        saveUserData();
        updateUI();
    }
}

// Mise à jour du progrès d'un module
function updateModuleProgress(moduleId, increment) {
    appState.currentUser.progress[moduleId] += increment;
    
    // Limiter le progrès à 100%
    if (appState.currentUser.progress[moduleId] > 100) {
        appState.currentUser.progress[moduleId] = 100;
    }
}

// Mise à jour du tableau de bord
function updateDashboard() {
    // Mettre à jour les barres de progression
    Object.keys(appState.currentUser.progress).forEach(module => {
        const progress = appState.currentUser.progress[module];
        const progressElement = document.getElementById(`${module}-progress`);
        const percentageElement = document.getElementById(`${module}-percentage`);
        
        if (progressElement && percentageElement) {
            gsap.to(progressElement, {
                width: `${progress}%`,
                duration: 1,
                ease: "power2.out"
            });
            
            percentageElement.textContent = `${Math.round(progress)}%`;
        }
    });
    
    // Mettre à jour les badges
    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = '';
    
    availableBadges.forEach(badge => {
        const isUnlocked = appState.currentUser.badges.includes(badge.id);
        
        const badgeElement = document.createElement('div');
        badgeElement.className = `badge ${isUnlocked ? 'unlocked' : ''}`;
        badgeElement.setAttribute('data-title', badge.title);
        badgeElement.textContent = isUnlocked ? badge.emoji : '?';
        
        badgesContainer.appendChild(badgeElement);
    });
}

// Vérification et attribution des badges
function checkAndAwardBadges(moduleId) {
    let newBadges = [];
    
    // Vérifier les badges spécifiques au module
    availableBadges.forEach(badge => {
        if (appState.currentUser.badges.includes(badge.id)) return;
        
        let shouldAward = false;
        
        if (badge.module === moduleId) {
            if (badge.condition === 'firstActivity') {
                // Badge pour la première activité d'un module
                shouldAward = true;
            } else if (badge.condition === 'progress50' && appState.currentUser.progress[moduleId] >= 50) {
                // Badge pour 50% de progrès dans un module
                shouldAward = true;
            }
        } else if (badge.condition === 'allModules') {
            // Badge pour avoir commencé tous les modules
            const allModulesStarted = Object.keys(appState.currentUser.progress).every(module => 
                appState.currentUser.progress[module] > 0
            );
            shouldAward = allModulesStarted;
        } else if (badge.condition === 'points100' && appState.currentUser.points >= 100) {
            // Badge pour avoir obtenu 100 points
            shouldAward = true;
        }
        
        if (shouldAward) {
            appState.currentUser.badges.push(badge.id);
            newBadges.push(badge);
        }
    });
    
    // Afficher les nouveaux badges
    if (newBadges.length > 0) {
        showRewardPopup(newBadges[0]);
    }
}

// Afficher la popup de récompense
function showRewardPopup(badge) {
    const rewardPopup = document.getElementById('reward-popup');
    const rewardMessage = document.getElementById('reward-message');
    const rewardBadge = document.getElementById('reward-badge');
    
    rewardMessage.textContent = `Tu as débloqué un nouveau badge : ${badge.title} !`;
    rewardBadge.textContent = badge.emoji;
    
    rewardPopup.classList.add('active');
}

// Sauvegarde des données utilisateur
function saveUserData() {
    localStorage.setItem('eduFunUser', JSON.stringify(appState.currentUser));
}

// Initialisation de l'assistant virtuel
function initAssistant() {
    const assistantHTML = `
        <div class="assistant-container">
            <div class="assistant-bubble">🦁</div>
            <div class="assistant-dialog">
                <div class="assistant-header">
                    <span>Édu, ton assistant</span>
                </div>
                <div class="assistant-messages">
                    <div class="message assistant">
                        ${assistantResponses.greetings[Math.floor(Math.random() * assistantResponses.greetings.length)]}
                    </div>
                </div>
                <div class="assistant-input">
                    <input type="text" id="assistant-input-field" placeholder="Pose ta question...">
                    <button id="assistant-send">📤</button>
                </div>
            </div>
        </div>
    `;
    
    const assistantContainer = document.createElement('div');
    assistantContainer.innerHTML = assistantHTML;
    document.body.appendChild(assistantContainer);
    
    // Écouteurs d'événements pour l'assistant
    const assistantBubble = document.querySelector('.assistant-bubble');
    const assistantDialog = document.querySelector('.assistant-dialog');
    const assistantInput = document.getElementById('assistant-input-field');
    const assistantSend = document.getElementById('assistant-send');
    
    assistantBubble.addEventListener('click', () => {
        assistantDialog.classList.toggle('active');
        if (assistantDialog.classList.contains('active')) {
            assistantInput.focus();
            
            // Poser une question aléatoire si c'est la première fois
            if (appState.assistant.messages.length === 0) {
                setTimeout(() => {
                    const randomQuestion = assistantResponses.questions[
                        Math.floor(Math.random() * assistantResponses.questions.length)
                    ];
                    
                    addAssistantMessage(randomQuestion);
                }, 3000);
            }
        }
    });
    
    assistantSend.addEventListener('click', sendAssistantMessage);
    assistantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendAssistantMessage();
        }
    });
}

// Envoyer un message à l'assistant
function sendAssistantMessage() {
    const assistantInput = document.getElementById('assistant-input-field');
    const userMessage = assistantInput.value.trim();
    
    if (userMessage) {
        // Ajouter le message de l'utilisateur
        addUserMessage(userMessage);
        
        // Effacer l'input
        assistantInput.value = '';
        
        // Générer une réponse
        setTimeout(() => {
            const response = generateAssistantResponse(userMessage);
            addAssistantMessage(response);
        }, 1000);
    }
}

// Ajouter un message de l'utilisateur
function addUserMessage(message) {
    const messagesContainer = document.querySelector('.assistant-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    appState.assistant.messages.push({
        sender: 'user',
        text: message
    });
}

// Ajouter un message de l'assistant
function addAssistantMessage(message) {
    const messagesContainer = document.querySelector('.assistant-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message assistant';
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    appState.assistant.messages.push({
        sender: 'assistant',
        text: message
    });
}

// Générer une réponse de l'assistant
function generateAssistantResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Rechercher des mots-clés sur les modules
    if (lowerMessage.includes('math') || lowerMessage.includes('nombre') || lowerMessage.includes('calcul')) {
        return assistantResponses.moduleHelp.maths[Math.floor(Math.random() * assistantResponses.moduleHelp.maths.length)];
    } else if (lowerMessage.includes('langue') || lowerMessage.includes('mot') || lowerMessage.includes('alphabet')) {
        return assistantResponses.moduleHelp.langues[Math.floor(Math.random() * assistantResponses.moduleHelp.langues.length)];
    } else if (lowerMessage.includes('science') || lowerMessage.includes('animal') || lowerMessage.includes('nature')) {
        return assistantResponses.moduleHelp.sciences[Math.floor(Math.random() * assistantResponses.moduleHelp.sciences.length)];
    } else if (lowerMessage.includes('art') || lowerMessage.includes('dessin') || lowerMessage.includes('couleur')) {
        return assistantResponses.moduleHelp.arts[Math.floor(Math.random() * assistantResponses.moduleHelp.arts.length)];
    } else if (lowerMessage.includes('sport') || lowerMessage.includes('bouger') || lowerMessage.includes('courir')) {
        return assistantResponses.moduleHelp.sport[Math.floor(Math.random() * assistantResponses.moduleHelp.sport.length)];
    } else if (lowerMessage.includes('geo') || lowerMessage.includes('géographie')) {
        return assistantResponses.moduleHelp.geo[Math.floor(Math.random() * assistantResponses.moduleHelp.geo.length)];
    } else if (lowerMessage.includes('metiers') || lowerMessage.includes('profession')) {
        return assistantResponses.moduleHelp.metiers[Math.floor(Math.random() * assistantResponses.moduleHelp.metiers.length)];
    } else if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('coucou')) {
        return assistantResponses.greetings[Math.floor(Math.random() * assistantResponses.greetings.length)];
    } else if (lowerMessage.includes('quête') || lowerMessage.includes('quest') || lowerMessage.includes('mission')) {
        return "Les quêtes sont des aventures spéciales ! Complète les activités pour terminer ta quête et gagner des points et des badges.";
    } else if (lowerMessage.includes('aide') || lowerMessage.includes('comment') || lowerMessage.includes('quoi faire')) {
        return "Je peux t'aider à comprendre les leçons. Dis-moi sur quel sujet tu as des questions : maths, langues, sciences, arts ou sport ?";
    } else {
        // Réponse par défaut ou inconnue
        return assistantResponses.unknown[Math.floor(Math.random() * assistantResponses.unknown.length)];
    }
}

// Fonction pour lire l'explication audio
function toggleAudioExplanation(button) {
    // Arrêter tout audio en cours de lecture
    if (appState.audioExplanations.currentAudio) {
        window.speechSynthesis.cancel();
        appState.audioExplanations.isPlaying = false;
        appState.audioExplanations.currentAudio = null;
    }
    
    const audioPlayer = button.closest('.audio-player');
    const audioStatus = audioPlayer.querySelector('.audio-status');
    const audioText = audioPlayer.getAttribute('data-text');
    const progressBar = audioPlayer.querySelector('.audio-progress-bar');
    const timeDisplay = audioPlayer.querySelector('.audio-time');
    
    if (button.textContent === '▶️') {
        // Démarrer la lecture
        button.textContent = '⏹️';
        audioStatus.classList.add('audio-bars-active');
        
        // Utiliser l'API Speech Synthesis pour lire le texte
        const speech = new SpeechSynthesisUtterance(audioText);
        speech.lang = 'fr-FR';
        speech.rate = 0.9; // Un peu plus lent pour les enfants
        
        // Suivi de la progression
        let startTime = Date.now();
        const totalDuration = audioText.length * 50; // Estimation de la durée basée sur la longueur du texte
        
        const updateProgress = () => {
            if (!appState.audioExplanations.isPlaying) return;
            
            const elapsed = Date.now() - startTime;
            const percentage = Math.min(100, (elapsed / totalDuration) * 100);
            
            progressBar.style.width = `${percentage}%`;
            
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timeDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            if (percentage < 100) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        speech.onstart = () => {
            appState.audioExplanations.isPlaying = true;
            appState.audioExplanations.currentAudio = speech;
            startTime = Date.now();
            requestAnimationFrame(updateProgress);
        };
        
        speech.onend = () => {
            appState.audioExplanations.isPlaying = false;
            appState.audioExplanations.currentAudio = null;
            button.textContent = '▶️';
            audioStatus.classList.remove('audio-bars-active');
            progressBar.style.width = '100%';
        };
        
        window.speechSynthesis.speak(speech);
    } else {
        // Arrêter la lecture
        window.speechSynthesis.cancel();
        appState.audioExplanations.isPlaying = false;
        appState.audioExplanations.currentAudio = null;
        button.textContent = '▶️';
        audioStatus.classList.remove('audio-bars-active');
    }
}

// Exposer la fonction à la portée globale pour l'utiliser dans les événements onclick
window.toggleAudioExplanation = toggleAudioExplanation;