import { SceneManager } from './core/SceneManager.js';
import { AudioManager } from './core/AudioManager.js';
import { GameState } from './core/GameState.js';
import { Transitions } from './utils/Transitions.js';
import { Phase0_Intro } from './phases/Phase0_Intro.js';
import { Phase1_Courage } from './phases/Phase1_Courage.js';
import { Phase2_Wisdom } from './phases/Phase2_Wisdom.js';
import { Phase3_Loyalty } from './phases/Phase3_Loyalty.js';
import { Phase4_Faith } from './phases/Phase4_Faith.js';
import { Phase5_Patronus } from './phases/Phase5_Patronus.js';
import { Phase6_Temptation } from './phases/Phase6_Temptation.js';
import { Phase7_Darkness } from './phases/Phase7_Darkness.js';
import { Phase8_Grace } from './phases/Phase8_Grace.js';
import { ASSETS } from './config/assets.js';

class Game {
    constructor() {
        this.scene = null;
        this.audio = null;
        this.state = null;
        this.currentPhase = null;
        this.debugMode = false;
        this.phases = {
            0: Phase0_Intro,
            1: Phase1_Courage,
            2: Phase2_Wisdom,
            3: Phase3_Loyalty,
            4: Phase4_Faith,
            5: Phase5_Patronus,
            6: Phase6_Temptation,
            7: Phase7_Darkness,
            8: Phase8_Grace
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

    updateDebugUI() {
        if (import.meta.env.DEV) {
            const debugModeIndicator = document.getElementById('debug-mode-indicator');
            if (debugModeIndicator) {
                debugModeIndicator.style.display = this.debugMode ? 'flex' : 'none';
            }
        }
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

        const totalSteps = 2; // Modelos 3D + Áudios
        let currentStep = 0;

        // 1. Pré-carregar modelo do Chapéu Seletor
        try {
            console.log('Carregando modelo 3D do Chapéu Seletor...');
            await this.scene.addModel('/assets/models/sorting-hat.glb', {
                position: [9999, 9999, 9999] // Posição fora da tela para pré-cache
            });
            console.log('✓ Modelo do chapéu carregado e em cache');

            // Remover do cache visual (será adicionado novamente na fase 0)
            this.scene.clear();

            currentStep++;
            this.updateLoadingProgress((currentStep / totalSteps) * 100);
        } catch (error) {
            console.warn('Modelo sorting-hat.glb não foi pré-carregado:', error);
            currentStep++;
            this.updateLoadingProgress((currentStep / totalSteps) * 100);
        }

        // 2. Carregar áudios (se existirem, caso contrário ignora erro)
        try {
            console.log('Carregando áudios...');
            await this.audio.preload({
                'intro-music': ASSETS.music.intro,
                'courage-music': ASSETS.music.courage,
                'click-sfx': ASSETS.sfx.click,
                'magic-sfx': ASSETS.sfx.magic,
                'owl-sfx': ASSETS.sfx.owl,
                'victory-sfx': ASSETS.sfx.victory,
                'hat-phase0-voice-0': ASSETS.voices.hatIntro,
            });
            console.log('✓ Áudios carregados');

            currentStep++;
            this.updateLoadingProgress((currentStep / totalSteps) * 100);
        } catch (error) {
            console.warn('Alguns assets de áudio não foram carregados (normal com arquivos mockados):', error);
            currentStep++;
            this.updateLoadingProgress((currentStep / totalSteps) * 100);
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
            // Botões de navegação de fases
            const debugPrevBtn = document.getElementById('debug-prev-phase');
            const debugNextBtn = document.getElementById('debug-next-phase');
            const debugPhaseInfo = document.getElementById('debug-phase-info');

            debugPrevBtn.addEventListener('click', () => {
                const prevPhase = Math.max(0, this.state.currentPhase - 1);
                this.state.currentPhase = prevPhase;
                this.debugMode = true; // Ativar modo debug
                this.updateDebugUI();
                this.loadPhase(prevPhase);
                debugPhaseInfo.textContent = `Fase: ${prevPhase}`;
            });

            debugNextBtn.addEventListener('click', () => {
                const nextPhase = this.state.currentPhase + 1;
                this.state.currentPhase = nextPhase;
                this.debugMode = true; // Ativar modo debug
                this.updateDebugUI();
                this.loadPhase(nextPhase);
                debugPhaseInfo.textContent = `Fase: ${nextPhase}`;
            });

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

                // Setas para navegar entre fases
                if (e.key === 'ArrowLeft' && e.ctrlKey) {
                    e.preventDefault();
                    debugPrevBtn.click();
                }

                if (e.key === 'ArrowRight' && e.ctrlKey) {
                    e.preventDefault();
                    debugNextBtn.click();
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

            // Desativar modo debug ao usar carta normal
            this.debugMode = false;
            this.updateDebugUI();

            // Mostrar mensagem de sucesso
            this.showMessage(`Fase ${result.phase} desbloqueada!`, 'success');

            // Ir para nova fase após delay
            setTimeout(() => {
                this.loadPhase(result.phase);
            }, 500);

        } else {
            // Código inválido
            this.showCardError(result.message);
            this.cardCodeInput.value = '';
            this.cardCodeInput.focus();
        }
    }

    showCardModal() {
        // Não mostrar modal em modo debug
        if (this.debugMode) {
            console.log('[DEBUG] Modal de carta bloqueado em modo debug');
            return;
        }

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
            await Transitions.fadeOut(0.3); // Reduzido de 0.5 para 0.3
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

        // Fade in ANTES de inicializar (para ver a cena sendo montada)
        await Transitions.fadeIn(0.3); // Reduzido de 0.5 para 0.3

        // Inicializar fase (agora com tela visível)
        await this.currentPhase.init();
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
