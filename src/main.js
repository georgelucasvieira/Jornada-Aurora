import { SceneManager } from './core/SceneManager.js';
import { AudioManager } from './core/AudioManager.js';
import { GameState } from './core/GameState.js';
import { Transitions } from './utils/Transitions.js';
import { Phase0_Intro } from './phases/Phase0_Intro.js';
import { Phase1_Courage } from './phases/Phase1_Courage.js';

class Game {
    constructor() {
        this.scene = null;
        this.audio = null;
        this.state = null;
        this.currentPhase = null;
        this.phases = {
            0: Phase0_Intro,
            1: Phase1_Courage
            // Adicionar outras fases conforme desenvolvidas
        };

        // UI Elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgress = document.getElementById('loading-progress');
        this.gameContainer = document.getElementById('game-container');
        this.cardInputModal = document.getElementById('card-input-modal');
        this.cardCodeInput = document.getElementById('card-code-input');
        this.cardSubmitBtn = document.getElementById('card-submit-btn');
        this.cardError = document.getElementById('card-error');
    }

    async init() {
        console.log('Iniciando Jornada Aurora...');

        try {
            // Inicializar managers
            this.scene = new SceneManager();
            this.audio = new AudioManager();
            this.state = new GameState();

            // Carregar progresso salvo
            this.state.load();

            // Pré-carregar assets críticos
            await this.preloadAssets();

            // Setup UI handlers
            this.setupUI();

            // Esconder loading, mostrar game
            this.hideLoading();

            // Ir para fase atual (ou fase 0)
            await this.loadPhase(this.state.currentPhase);

            console.log('Jogo iniciado com sucesso!');

        } catch (error) {
            console.error('Erro ao inicializar jogo:', error);
            this.showError('Erro ao carregar o jogo. Recarregue a página.');
        }
    }

    async preloadAssets() {
        console.log('Carregando assets...');

        // Atualizar barra de progresso
        this.updateLoadingProgress(0);

        // Simulação de carregamento (por enquanto sem assets reais)
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
            await this.delay(200);
            this.updateLoadingProgress((i / steps) * 100);
        }

        // Tentar carregar áudios (se existirem, caso contrário ignora erro)
        try {
            await this.audio.preload({
                'intro-music': '/assets/audio/music/intro.mp3',
                'click-sfx': '/assets/audio/sfx/click.mp3',
                'magic-sfx': '/assets/audio/sfx/magic.mp3',
                'owl-sfx': '/assets/audio/sfx/owl.mp3',
                'hat-intro': '/assets/audio/voices/hat-intro.mp3',
            });
        } catch (error) {
            console.warn('Alguns assets de áudio não foram carregados (normal com arquivos mockados):', error);
        }

        console.log('Assets carregados!');
    }

    setupUI() {
        // Handler para input de cartas
        this.cardSubmitBtn.addEventListener('click', () => this.handleCardSubmit());

        this.cardCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleCardSubmit();
            }
        });

        // Atalhos de debug (remover em produção)
        if (import.meta.env.DEV) {
            window.addEventListener('keydown', (e) => {
                // R = Reset progress
                if (e.key === 'r' && e.ctrlKey) {
                    e.preventDefault();
                    this.state.resetProgress();
                    location.reload();
                }

                // S = Show save data
                if (e.key === 's' && e.ctrlKey) {
                    e.preventDefault();
                    console.log('Save Data:', {
                        currentPhase: this.state.currentPhase,
                        unlockedPhases: this.state.unlockedPhases,
                        progress: this.state.phaseProgress,
                        playTime: this.state.getFormattedPlayTime()
                    });
                }
            });
        }
    }

    handleCardSubmit() {
        const code = this.cardCodeInput.value.trim();

        if (!code) {
            this.showCardError('Digite um código válido');
            return;
        }

        const result = this.state.validateCard(code);

        if (result.valid) {
            // Código válido! Ir para fase desbloqueada
            this.hideCardError();
            this.hideCardModal();
            this.cardCodeInput.value = '';

            // Mostrar mensagem de sucesso
            this.showMessage(`Fase ${result.phase} desbloqueada!`, 'success');

            // Ir para nova fase após delay
            setTimeout(() => {
                this.loadPhase(result.phase);
            }, 1500);

        } else {
            // Código inválido
            this.showCardError(result.message);
            this.cardCodeInput.value = '';
            this.cardCodeInput.focus();
        }
    }

    showCardModal() {
        this.cardInputModal.classList.remove('hidden');
        this.cardCodeInput.focus();
    }

    hideCardModal() {
        this.cardInputModal.classList.add('hidden');
    }

    showCardError(message) {
        this.cardError.textContent = message;
        this.cardError.classList.remove('hidden');
        Transitions.shake(this.cardError);
    }

    hideCardError() {
        this.cardError.classList.add('hidden');
    }

    async loadPhase(phaseNumber) {
        console.log(`Carregando fase ${phaseNumber}...`);

        // Verificar se fase existe
        const PhaseClass = this.phases[phaseNumber];
        if (!PhaseClass) {
            console.error(`Fase ${phaseNumber} não implementada ainda`);
            return;
        }

        // Transição
        if (this.currentPhase) {
            await Transitions.fadeOut(0.5);
            this.currentPhase.destroy();
        }

        // Instanciar nova fase
        this.currentPhase = new PhaseClass(this.scene, this.audio, this.state);

        // Atualizar UI
        this.updatePhaseUI(phaseNumber);

        // IMPORTANTE: Iniciar animação ANTES de init() para renderizar objetos 3D
        this.scene.startAnimation(() => {
            // Atualizar partículas se houverem
            if (this.currentPhase && this.currentPhase.particles) {
                this.scene.updateParticles(this.currentPhase.particles);
            }
        });

        // Inicializar fase
        await this.currentPhase.init();

        // Fade in
        await Transitions.fadeIn(0.5);
    }

    updatePhaseUI(phaseNumber) {
        const phaseName = document.getElementById('phase-name');
        const phaseNames = [
            'Prólogo',
            'Coragem',
            'Sabedoria',
            'Lealdade',
            'Ambição Redimida',
            'O Patrono',
            'Tentação',
            'Escuridão',
            'Graça'
        ];

        if (phaseName) {
            phaseName.textContent = `Fase ${phaseNumber}: ${phaseNames[phaseNumber]}`;
        }
    }

    showMessage(text, type = 'info') {
        // TODO: Implementar sistema de mensagens toast
        console.log(`[${type.toUpperCase()}] ${text}`);
    }

    updateLoadingProgress(percentage) {
        if (this.loadingProgress) {
            this.loadingProgress.style.width = `${percentage}%`;
        }
    }

    hideLoading() {
        this.loadingScreen.classList.remove('active');
        this.gameContainer.classList.add('active');

        // Garantir que o transition overlay comece transparente
        const overlay = document.getElementById('transition-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-screen';
        errorDiv.innerHTML = `
            <h2>Erro</h2>
            <p>${message}</p>
            <button onclick="location.reload()">Recarregar</button>
        `;
        document.body.appendChild(errorDiv);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Iniciar jogo quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();

    // Expor game globalmente para debug (remover em produção)
    if (import.meta.env.DEV) {
        window.game = game;
    }
});
