// Configuração centralizada de todos os assets do jogo
// Facilita substituição de assets mockados por finais

export const ASSETS = {
    // TEXTURAS/BACKGROUNDS
    textures: {
        phase0: '/assets/textures/phase0-bg.jpg',
        phase1: '/assets/textures/gryffindor-room.jpg',
        phase2: '/assets/textures/library.jpg',
        phase3: '/assets/textures/garden.jpg',
        phase4: '/assets/textures/dungeon.jpg',
        phase5: '/assets/textures/dark-forest.jpg',
        phase6: '/assets/textures/forbidden-forest.jpg',
        phase7: '/assets/textures/chamber.jpg',
        phase8: '/assets/textures/final-chamber.jpg'
    },

    // MODELOS 3D
    models: {
        sortingHat: '/assets/models/sorting-hat.glb',
        sword: '/assets/models/phase1/sword.glb',
        lion: '/assets/models/phase1/lion.glb',
        wand: '/assets/models/phase1/wand.glb',
        scroll: '/assets/models/phase1/scroll.glb',
        key: '/assets/models/phase1/key.glb'
    },

    // MÚSICAS DE FUNDO
    music: {
        intro: '/assets/audio/music/intro.mp3',
        courage: '/assets/audio/music/courage.mp3',
        wisdom: '/assets/audio/music/wisdom.mp3',
        loyalty: '/assets/audio/music/loyalty.mp3',
        ambition: '/assets/audio/music/ambition.mp3',
        patronus: '/assets/audio/music/patronus.mp3',
        temptation: '/assets/audio/music/temptation.mp3',
        darkness: '/assets/audio/music/darkness.mp3',
        grace: '/assets/audio/music/grace.mp3'
    },

    // EFEITOS SONOROS
    sfx: {
        click: '/assets/audio/sfx/click.mp3',
        magic: '/assets/audio/sfx/magic.mp3',
        victory: '/assets/audio/sfx/victory.mp3',
        owl: '/assets/audio/sfx/owl.mp3',
        avadaKedavra: '/assets/audio/sfx/avada-kedavra.mp3'
    },

    // DUBLAGENS DO CHAPÉU SELETOR
    voices: {
        // Fase 0
        hatIntro: '/assets/audio/voices/hat-phase0-voice-0.mp3',

        // Fase 1
        hatPhase1Intro: '/assets/audio/voices/hat-phase1-intro.mp3',
        hatPhase1Sword: '/assets/audio/voices/hat-phase1-sword.mp3',
        hatPhase1Lion: '/assets/audio/voices/hat-phase1-lion.mp3',
        hatPhase1Wand: '/assets/audio/voices/hat-phase1-wand.mp3',
        hatPhase1Scroll: '/assets/audio/voices/hat-phase1-scroll.mp3',
        hatPhase1Key: '/assets/audio/voices/hat-phase1-key.mp3',
        hatPhase1Complete: '/assets/audio/voices/hat-phase1-complete.mp3',

        // Fase 2
        hatPhase2Intro: '/assets/audio/voices/hat-phase2-intro.mp3',

        // ... adicionar conforme necessário
    },

    // IMAGENS/SPRITES
    images: {
        saoJorge: '/assets/images/saints/sao-jorge.jpg',
        saoTomas: '/assets/images/saints/sao-tomas.jpg',
        saoJose: '/assets/images/saints/sao-jose.jpg',
        saoPaulo: '/assets/images/saints/sao-paulo.jpg',
        saoMiguel: '/assets/images/saints/sao-miguel.jpg'
    }
};

// Dados de conteúdo das fases
export const PHASE_DATA = {
    phase1: {
        title: 'Coragem',
        house: 'Gryffindor',
        objects: {
            sword: {
                feedback: "Hmm... interessante.",
                verse: "Seja forte e corajoso - Josué 1:9"
            },
            lion: {
                feedback: "Muito bem...",
                verse: "O Leão da tribo de Judá venceu - Apocalipse 5:5"
            },
            wand: {
                feedback: "Ah, sim... vejo.",
                verse: "Não por força nem por poder, mas pelo meu Espírito - Zacarias 4:6"
            },
            scroll: {
                feedback: "Excelente escolha.",
                verse: "Lâmpada para os meus pés é a tua palavra - Salmos 119:105"
            },
            key: {
                feedback: "Curioso... continue.",
                verse: "Pedi e vos será dado - Mateus 7:7"
            }
        },
        finalReflection: "São Jorge não venceu o dragão por ser o mais forte.",
        verse: "\"Seja forte e corajoso. Não tenha medo, nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.\" - Josué 1:9"
    },

    phase2: {
        title: 'Sabedoria',
        house: 'Ravenclaw',
        riddles: [
            {
                question: "Sou o princípio de tudo,\nSem mim nada se fez.\nEstou na luz, mas não sou luz.\nQuem sou eu?",
                options: [
                    { text: "Tempo", correct: false },
                    { text: "Verbo (Palavra)", correct: true },
                    { text: "Sabedoria", correct: false }
                ],
                correctAnswer: 1,
                bibleVerse: "\"No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.\" - João 1:1",
                bookName: "João"
            },
            {
                question: "Construí minha casa sobre rocha,\nAcumulei conhecimento e tesouros,\nMas no fim, declarei: tudo é vão.\nQuem sou?",
                options: [
                    { text: "Salomão", correct: true },
                    { text: "Moisés", correct: false },
                    { text: "Pedro", correct: false }
                ],
                correctAnswer: 0,
                bibleVerse: "\"Vaidade de vaidades, diz o pregador, tudo é vaidade.\" - Eclesiastes 1:2",
                bookName: "Eclesiastes"
            },
            {
                question: "Tenho asas mas não voo,\nEntro por portas fechadas,\nTransformo corações sem tocá-los.\nQuem sou?",
                options: [
                    { text: "Anjo", correct: false },
                    { text: "Espírito Santo", correct: true },
                    { text: "Oração", correct: false }
                ],
                correctAnswer: 1,
                bibleVerse: "\"O vento sopra onde quer, ouves o seu som, mas não sabes de onde vem, nem para onde vai; assim é todo aquele que é nascido do Espírito.\" - João 3:8",
                bookName: "Espírito"
            }
        ],
        finalReflection: "São Tomás buscou sabedoria nos livros.\n\nMas a Verdade estava além deles.",
        verse: "\"O temor do Senhor é o princípio da sabedoria, e o conhecimento do Santo é prudência.\" - Provérbios 9:10"
    },

    phase3: {
        title: 'Lealdade',
        house: 'Hufflepuff',
        events: [
            {
                id: 1,
                text: "Descobriu que Maria estava grávida",
                correctOrder: 1,
                description: "José, noivo de Maria, descobre que ela está esperando um filho."
            },
            {
                id: 2,
                text: "Anjo apareceu em sonho",
                correctOrder: 2,
                description: "Um anjo do Senhor aparece a José em sonho, revelando que a criança é do Espírito Santo."
            },
            {
                id: 3,
                text: "Fugiu para o Egito com a família",
                correctOrder: 3,
                description: "Alertado por um anjo, José foge com Maria e Jesus para o Egito, escapando de Herodes."
            },
            {
                id: 4,
                text: "Perdeu Jesus no templo",
                correctOrder: 4,
                description: "Aos 12 anos, Jesus fica no templo sem avisar. José e Maria o procuram aflitos."
            },
            {
                id: 5,
                text: "Ensinou Jesus a profissão de carpinteiro",
                correctOrder: 5,
                description: "José transmite seu ofício ao filho, trabalhando lado a lado com Jesus."
            },
            {
                id: 6,
                text: "Morreu nos braços de Jesus e Maria",
                correctOrder: 6,
                description: "São José falece cercado pela Sagrada Família, exemplo de morte santa."
            }
        ],
        moralChoice: {
            question: "José teve 3 escolhas ao descobrir a gravidez de Maria:",
            options: [
                { text: "Denunciá-la publicamente (Lei judaica)", moral: "law" },
                { text: "Abandoná-la secretamente (planejou isso)", moral: "mercy" },
                { text: "Confiar no plano de Deus (fez isso)", moral: "faith" }
            ],
            correctAnswer: 2,
            explanation: "Confiar sem compreender."
        },
        finalReflection: "São José foi leal quando tudo indicava o contrário.",
        verse: "\"O amigo ama em todos os momentos; é um irmão na adversidade.\" - Provérbios 17:17"
    },

    phase4: {
        title: 'Ambição Redimida',
        house: 'Slytherin',
        intro: "Nem todo desejo é pecado.\n\nMas quase todo desejo cobra algo.",
        moralChoices: [
            {
                id: 1,
                situation: "Você encontrou uma relíquia poderosa.",
                options: [
                    {
                        text: "Usar agora",
                        moral: "fail",
                        feedback: "O poder flui por suas veias."
                    },
                    {
                        text: "Guardar",
                        moral: "neutral",
                        feedback: "Seguro. Guardado. Seu."
                    },
                    {
                        text: "Destruir",
                        moral: "ideal",
                        feedback: "A relíquia se desfaz em cinzas."
                    }
                ],
                correctAnswer: 2
            },
            {
                id: 2,
                situation: "A serpente oferece conhecimento proibido.",
                options: [
                    {
                        text: "Aceito",
                        moral: "fail",
                        feedback: "A serpente sussurra segredos na escuridão."
                    },
                    {
                        text: "Recuso",
                        moral: "ideal",
                        feedback: "Silêncio."
                    }
                ],
                correctAnswer: 1
            },
            {
                id: 3,
                situation: "Um bruxo perdido pede ajuda.\n\nIsso tornará sua jornada mais difícil.",
                options: [
                    {
                        text: "Ajudo",
                        moral: "ideal",
                        feedback: "Ele some na névoa. Você está mais fraco."
                    },
                    {
                        text: "Sigo em frente",
                        moral: "fail",
                        feedback: "Seus passos ecoam vazios."
                    }
                ],
                correctAnswer: 0
            }
        ],
        finalReflection: "Aquilo que você escolheu… vai te acompanhar.",
        verse: "\"Porque pela graça sois salvos, mediante a fé; e isto não vem de vós; é dom de Deus.\" - Efésios 2:8"
    },

    phase5: {
        title: 'O Patrono',
        subtitle: 'Defesa Contra as Trevas',
        intro: "Expecto Patronum.\n\nMas qual é seu verdadeiro Patrono?",
        memories: [
            { id: 'family', text: 'Família', icon: '👨‍👩‍👧' },
            { id: 'friends', text: 'Amigos', icon: '🤝' },
            { id: 'achievement', text: 'Conquistas', icon: '🏆' },
            { id: 'nature', text: 'Natureza', icon: '🌿' },
            { id: 'prayer', text: 'Oração', icon: '🙏' },
            { id: 'love', text: 'Amor', icon: '❤️' }
        ],
        prayers: [
            { id: 'paiNosso', text: 'Pai Nosso' },
            { id: 'aveMaria', text: 'Ave Maria' },
            { id: 'saoMiguel', text: 'Oração a São Miguel', correct: true }
        ],
        confrontDuration: 30,
        dementorCount: 15,
        finalMessage: "Seu verdadeiro Patrono não é uma memória.",
        verse: "\"Nossa luta não é contra carne e sangue, mas contra os poderes das trevas.\" - Efésios 6:12"
    },

    phase6: {
        title: 'A Tentação',
        subtitle: 'Floresta Proibida',
        intro: "A floresta sussurra.\n\nVocê não sabe mais em quem confiar.",
        temptations: [
            {
                voice: "Você não é boa o suficiente.",
                truth: "Ninguém é.",
                leadsToProgress: true  // LIE that advances (accepting weakness is key)
            },
            {
                voice: "Você é forte. Você consegue.",
                truth: "Confie em si mesma.",
                leadsToProgress: false  // TRUTH that loops (self-reliance fails)
            },
            {
                voice: "Deus está longe demais para te ouvir.",
                truth: "Ele está mais perto do que você imagina.",
                leadsToProgress: true  // LIE that advances (doubting leads to seeking)
            },
            {
                voice: "Suas escolhas definem quem você é.",
                truth: "Você é responsável por si mesma.",
                leadsToProgress: false  // TRUTH that loops (works-based righteousness)
            },
            {
                voice: "Desista. Nada vai mudar.",
                truth: "A graça já mudou tudo.",
                leadsToProgress: true  // LIE that advances (despair leads to surrender)
            }
        ],
        exitMessage: "Não há saída.\n\nNão pelos seus próprios meios.",
        helpMessage: "...",
        verse: "\"Tudo posso naquele que me fortalece.\" - Filipenses 4:13"
    },

    phase7: {
        title: 'A Escuridão',
        subtitle: 'O Enigma Impossível',
        intro: "Três relíquias, três virtudes, três escolhas.\n\nResolva o enigma... ou pereça.",
        puzzle: {
            question: "Fé move montanhas, mas qual montanha?\nEsperança ancora a alma, mas em que porto?\nCaridade cobre pecados, mas quantos?\n\nA soma das letras de cada resposta,\nmultiplicada pelos dias da criação,\ndividida pelas bem-aventuranças,\nrevela o código.",
            hints: [
                "A resposta está mais perto do que imagina...",
                "Nem sempre resolver é vencer...",
                "Sua força não será suficiente..."
            ],
            code: "0000" // Não importa, é impossível
        },
        timeLimit: 300, // 5 minutos
        giveUpMessage: "Reconhecer limitações é sabedoria... mas ainda não é hora.",
        finalMessage: "Suas forças não são suficientes... mas há Alguém maior."
    },

    phase8: {
        title: 'A Graça',
        subtitle: 'O Confronto Final',
        voldemortIntro: "Você chegou ao fim.\n\n...será suficiente?",
        enigmaIntro: "...",
        enigmaDuration: 60,
        revelation: [
            "Não foi sua força.",
            "",
            "Não foi sua sabedoria.",
            "",
            "",
            "Foi o amor de quem morreu por você."
        ],
        message: [
            "Como Harry foi salvo pelo sacrifício de sua mãe...",
            "",
            "",
            "...você foi salva pelo sacrifício do Filho.",
            "",
            "",
            "",
            "Ele te amou primeiro.",
            "",
            "",
            "A maldição foi quebrada na cruz.",
            "",
            "",
            "",
            "Você está livre."
        ],
        verse: "\"Porque pela graça sois salvos, mediante a fé; e isto não vem de vós; é dom de Deus.\" - Efésios 2:8",
        finalMessage: [
            "Para Aurora.",
            "",
            "",
            "Você é amada.",
            "",
            "Você é escolhida.",
            "",
            "",
            "Nenhuma escuridão pode apagar essa luz."
        ]
    }
};
