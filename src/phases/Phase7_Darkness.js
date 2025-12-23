import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';

export class Phase7_Darkness extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.particles = [];
        this.disintegrationLevel = 0;
        this.glitchInterval = null;

        // Música tensa
        const music = this.audio.playMusic('darkness-music', { fadeIn: 2000 });
        if (music) {
            music.volume(0.3);
        } else {
            const fallback = this.audio.playMusic('courage-music', { fadeIn: 2000 });
            if (fallback) fallback.volume(0.3);
        }
    }

    async init() {
        console.log('Iniciando Fase 7: A Escuridão (Desintegração)');

        // Background quase preto
        this.scene.setBackgroundColor('#000000');

        // Luz mínima
        const ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.15);
        this.scene.scene.add(ambientLight);
        this.scene.currentObjects.push(ambientLight);

        // Sem intro, direto para a desintegração
        await this.delay(2000);
        await this.startDisintegration();
    }

    async startDisintegration() {
        if (this.isDestroyed) return;

        // Mensagem inicial (sem Chapéu)
        await UI.showText("Três relíquias, três virtudes, três escolhas.", null, 0.5);
        await this.delay(3000);
        await UI.hideText(0.3);
        await this.delay(1000);

        // Criar "botões" que vão quebrar
        this.createBreakingUI();

        // Iniciar processo de desintegração gradual
        this.startGlitching();
    }

    createBreakingUI() {
        const container = document.createElement('div');
        container.id = 'breaking-ui';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            gap: 20px;
            z-index: 100;
        `;

        // "Botões" falsos
        const actions = ['Resolver', 'Continuar', 'Avançar'];

        actions.forEach((text, index) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.className = 'glitch-button';
            btn.style.cssText = `
                padding: 20px 60px;
                background: rgba(100, 0, 0, 0.5);
                border: 2px solid #660000;
                color: #cc0000;
                font-size: 20px;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s;
            `;

            btn.addEventListener('click', () => {
                // Não faz nada, ou faz algo errado
                btn.style.opacity = '0.3';
                this.disintegrationLevel++;
            });

            container.appendChild(btn);
        });

        document.body.appendChild(container);
    }

    startGlitching() {
        let phase = 0;

        this.glitchInterval = setInterval(() => {
            if (this.isDestroyed) {
                clearInterval(this.glitchInterval);
                return;
            }

            phase++;

            // Fase 1 (5s): Texto começa a falhar
            if (phase === 5) {
                this.glitchText();
            }

            // Fase 2 (10s): Botões param de responder
            if (phase === 10) {
                this.breakButtons();
            }

            // Fase 3 (15s): Som corta
            if (phase === 15) {
                this.audio.stopMusic(500);
            }

            // Fase 4 (20s): UI desaparece
            if (phase === 20) {
                this.breakUI();
            }

            // Fase 5 (25s): Tela trava
            if (phase === 25) {
                this.freezeScreen();
            }

            // Fase 6 (30s): Silêncio total
            if (phase === 30) {
                clearInterval(this.glitchInterval);
                this.totalSilence();
            }

        }, 1000);
    }

    glitchText() {
        const textEl = document.querySelector('#ui-text');
        if (textEl) {
            // Texto quebrado
            let originalText = textEl.textContent;
            let glitched = originalText.split('').map(char =>
                Math.random() > 0.7 ? '█' : char
            ).join('');

            textEl.textContent = glitched;

            this.setTimeout(() => {
                textEl.textContent = originalText;
            }, 200);
        }
    }

    breakButtons() {
        const buttons = document.querySelectorAll('.glitch-button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.2';
            btn.style.cursor = 'not-allowed';
            btn.style.pointerEvents = 'none';

            // Texto quebra
            this.setInterval(() => {
                if (this.isDestroyed) return;
                const chars = btn.textContent.split('');
                chars[Math.floor(Math.random() * chars.length)] = '█';
                btn.textContent = chars.join('');
            }, 500);
        });
    }

    breakUI() {
        const container = document.getElementById('breaking-ui');
        if (container) {
            // UI falha visualmente
            this.gsapTo(container, {
                opacity: 0,
                y: 100,
                duration: 2,
                ease: 'power2.in',
                onComplete: () => container.remove()
            });
        }

        // Mensagem quebrada aparece
        UI.showText("S█s ██rças ███ █ão ██fi█ie███s", null, 0.5);
    }

    freezeScreen() {
        // Tela "congela" - só background escuro
        UI.hideText(0);

        document.body.style.cursor = 'wait';

        // Nada responde por 5s
        this.setTimeout(() => {
            document.body.style.cursor = 'default';
        }, 5000);
    }

    async totalSilence() {
        if (this.isDestroyed) return;

        // SILÊNCIO ABSOLUTO
        UI.hideText(0);

        // Tela completamente preta
        this.scene.setBackgroundColor('#000000');

        await this.delay(5000);

        // Depois do silêncio: uma única opção
        await this.showStayOption();
    }

    async showStayOption() {
        if (this.isDestroyed) return;

        // Botão simples: "Ficar"
        const stayBtn = document.createElement('button');
        stayBtn.id = 'stay-button';
        stayBtn.textContent = 'Ficar';
        stayBtn.style.cssText = `
            position: fixed;
            bottom: 50%;
            left: 50%;
            transform: translate(-50%, 50%);
            padding: 20px 60px;
            background: rgba(20, 20, 20, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.3);
            font-size: 18px;
            cursor: pointer;
            border-radius: 8px;
            z-index: 101;
        `;

        stayBtn.addEventListener('click', async () => {
            stayBtn.remove();
            await this.stayed();
        });

        document.body.appendChild(stayBtn);
    }

    async stayed() {
        if (this.isDestroyed) return;

        // Nada acontece imediatamente
        await this.delay(3000);

        // Depois de um tempo, uma luz muito fraca
        const light = new THREE.PointLight(0xffffff, 0, 10);
        light.position.set(0, 0, -3);
        this.scene.scene.add(light);
        this.scene.currentObjects.push(light);

        this.gsapTo(light, {
            intensity: 0.1,
            duration: 5
        });

        await this.delay(5000);

        // Versículo - SEM explicação
        await UI.showText("Permanecei em mim.", null, 0.5);
        await this.delay(4000);
        await UI.hideText(0.3);

        await this.delay(3000);

        // Completar fase (direto para Fase 8, sem carta)
        await this.complete();
    }

    async complete() {
        console.log('Fase 7 completa (permaneceu)');

        this.scene.stopAnimation();

        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
        }

        await this.delay(2000);

        // Salvar progresso
        this.state.completePhase(7, {
            stayed: true,
            timeCompleted: Date.now()
        });

        // Transição direta para Fase 8
        this.setTimeout(() => {
            const game = window.game;
            if (game) {
                game.loadPhase(8);
            }
        }, 1000);
    }

    destroy() {
        console.log('Destruindo Fase 7');

        super.destroy();

        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
        }

        const breakingUI = document.getElementById('breaking-ui');
        if (breakingUI) breakingUI.remove();

        const stayBtn = document.getElementById('stay-button');
        if (stayBtn) stayBtn.remove();

        document.body.style.cursor = 'default';

        this.particles.forEach(p => {
            this.scene.scene.remove(p);
            if (p.geometry) p.geometry.dispose();
            if (p.material) p.material.dispose();
        });

        this.scene.clear();

        UI.clearInteractive();
        UI.hideText(0);
    }
}
