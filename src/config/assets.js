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
        hatIntro: '/assets/audio/voices/hat-intro.mp3',

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
        objects: {
            sword: {
                narration: "A coragem não está na força da lâmina, mas no coração de quem a empunha.",
                verse: "Seja forte e corajoso - Josué 1:9",
                verseRef: "Josué 1:9"
            },
            lion: {
                narration: "O leão ruge, mas há um Leão maior que venceu.",
                verse: "O Leão da tribo de Judá venceu - Apocalipse 5:5",
                verseRef: "Apocalipse 5:5"
            },
            wand: {
                narration: "Instrumentos são úteis, mas quem age é o poder maior.",
                verse: "Não por força nem por poder, mas pelo meu Espírito - Zacarias 4:6",
                verseRef: "Zacarias 4:6"
            },
            scroll: {
                narration: "A Palavra guia os corajosos.",
                verse: "Lâmpada para os meus pés é a tua palavra - Salmos 119:105",
                verseRef: "Salmos 119:105"
            },
            key: {
                narration: "A coragem abre portas que o medo tranca.",
                verse: "Pedi e vos será dado - Mateus 7:7",
                verseRef: "Mateus 7:7"
            }
        },
        saintMessage: "São Jorge enfrentou o dragão não por sua força, mas pela fé em Deus. A verdadeira coragem vem da confiança no Senhor."
    }
};
