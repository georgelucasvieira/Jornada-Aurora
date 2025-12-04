export class GameState {
    constructor() {
        this.SAVE_KEY = 'aurora-save-v1';

        // Códigos das cartas físicas (você pode alterar depois)
        this.CARD_CODES = {
            'AURORA1': 1,  // Carta 1 → Fase 1 (Coragem)
            'AURORA2': 2,  // Carta 2 → Fase 2 (Sabedoria)
            'AURORA3': 3,  // Carta 3 → Fase 3 (Lealdade)
            'AURORA4': 4,  // Carta 4 → Fase 4 (Ambição)
            'AURORA5': 5,  // Carta 5 → Fase 5 (Patrono)
            'AURORA6': 6,  // Carta 6 → Fase 6 (Tentação)
            'AURORA7': 7,  // Carta 7 → Fase 7 (Escuridão)
            'AURORA8': 8   // Carta 8 → Fase 8 (Graça)
        };

        // Estado inicial
        this.currentPhase = 0;
        this.unlockedPhases = [0]; // Fase 0 sempre desbloqueada
        this.phaseProgress = {};
        this.cardsUsed = [];
        this.startTime = Date.now();
        this.totalPlayTime = 0;
    }

    save() {
        const saveData = {
            currentPhase: this.currentPhase,
            unlockedPhases: this.unlockedPhases,
            phaseProgress: this.phaseProgress,
            cardsUsed: this.cardsUsed,
            totalPlayTime: this.totalPlayTime + (Date.now() - this.startTime),
            lastSave: Date.now()
        };

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            console.log('Progresso salvo com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao salvar progresso:', error);
            return false;
        }
    }

    load() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);

            if (savedData) {
                const data = JSON.parse(savedData);

                this.currentPhase = data.currentPhase || 0;
                this.unlockedPhases = data.unlockedPhases || [0];
                this.phaseProgress = data.phaseProgress || {};
                this.cardsUsed = data.cardsUsed || [];
                this.totalPlayTime = data.totalPlayTime || 0;

                console.log('Progresso carregado:', data);
                return true;
            } else {
                console.log('Nenhum save encontrado, iniciando novo jogo');
                return false;
            }
        } catch (error) {
            console.error('Erro ao carregar progresso:', error);
            return false;
        }
    }

    validateCard(code) {
        const normalizedCode = code.trim().toUpperCase();

        // Verifica se código existe
        if (!this.CARD_CODES.hasOwnProperty(normalizedCode)) {
            return {
                valid: false,
                message: 'Código inválido. Verifique a carta de Edwiges.'
            };
        }

        // Verifica se já foi usado
        if (this.cardsUsed.includes(normalizedCode)) {
            return {
                valid: false,
                message: 'Esta carta já foi utilizada.'
            };
        }

        // Desbloqueia fase
        const phaseToUnlock = this.CARD_CODES[normalizedCode];

        this.cardsUsed.push(normalizedCode);
        this.unlockedPhases.push(phaseToUnlock);
        // this.save();

        return {
            valid: true,
            phase: phaseToUnlock,
            message: `Fase ${phaseToUnlock} desbloqueada!`
        };
    }

    completePhase(phaseNumber, data = {}) {
        this.phaseProgress[phaseNumber] = {
            completed: true,
            timestamp: Date.now(),
            playTime: this.totalPlayTime + (Date.now() - this.startTime),
            ...data
        };

        console.log(`Fase ${phaseNumber} completada!`);
        this.save();
    }

    isPhaseCompleted(phaseNumber) {
        return this.phaseProgress[phaseNumber]?.completed || false;
    }

    isPhaseUnlocked(phaseNumber) {
        return this.unlockedPhases.includes(phaseNumber);
    }

    goToPhase(phaseNumber) {
        if (this.isPhaseUnlocked(phaseNumber)) {
            this.currentPhase = phaseNumber;
            this.save();
            return true;
        }

        console.warn(`Fase ${phaseNumber} não está desbloqueada`);
        return false;
    }

    getPhaseData(phaseNumber) {
        return this.phaseProgress[phaseNumber] || null;
    }

    resetProgress() {
        if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
            localStorage.removeItem(this.SAVE_KEY);
            this.currentPhase = 0;
            this.unlockedPhases = [0];
            this.phaseProgress = {};
            this.cardsUsed = [];
            this.totalPlayTime = 0;
            this.startTime = Date.now();

            console.log('Progresso resetado');
            return true;
        }

        return false;
    }

    getTotalPlayTime() {
        return this.totalPlayTime + (Date.now() - this.startTime);
    }

    getFormattedPlayTime() {
        const totalMs = this.getTotalPlayTime();
        const hours = Math.floor(totalMs / (1000 * 60 * 60));
        const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    }

    getCompletionPercentage() {
        const totalPhases = 9; // 0 a 8
        const completedPhases = Object.keys(this.phaseProgress).filter(
            key => this.phaseProgress[key].completed
        ).length;

        return Math.round((completedPhases / totalPhases) * 100);
    }

    exportSave() {
        const saveData = {
            currentPhase: this.currentPhase,
            unlockedPhases: this.unlockedPhases,
            phaseProgress: this.phaseProgress,
            cardsUsed: this.cardsUsed,
            totalPlayTime: this.totalPlayTime,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(saveData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `jornada-aurora-save-${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    importSave(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            this.currentPhase = data.currentPhase;
            this.unlockedPhases = data.unlockedPhases;
            this.phaseProgress = data.phaseProgress;
            this.cardsUsed = data.cardsUsed;
            this.totalPlayTime = data.totalPlayTime;

            this.save();

            console.log('Save importado com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao importar save:', error);
            return false;
        }
    }
}
