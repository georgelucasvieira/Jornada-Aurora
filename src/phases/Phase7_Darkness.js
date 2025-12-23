import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';
import { PHASE_DATA } from '../config/assets.js';

export class Phase7_Darkness extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.attempts = 0;
        this.timeElapsed = 0;
        this.timerInterval = null;
        this.currentHint = 0;
        this.lightLevel = 1.0;
        this.particles = [];

        // Iniciar música (usa courage-music como fallback)
        const music = this.audio.playMusic('darkness-music', { fadeIn: 2000 });
        if (music) {
            // Reduzir volume para atmosfera tensa
            music.volume(0.4);
        } else {
            console.warn('Música darkness não disponível, usando courage-music');
            const fallback = this.audio.playMusic('courage-music', { fadeIn: 2000 });
            if (fallback) fallback.volume(0.4);
        }
    }

    async init() {
        console.log('Iniciando Fase 7: A Escuridão (O Enigma Impossível)');

        // Background quase preto
        this.scene.setBackgroundColor('#000000');

        // Criar cena
        await this.setupScene();

        // Introdução
        await this.intro();

        // Mostrar puzzle
        await this.showPuzzle();
    }

    async setupScene() {
        // Luz MUITO fraca
        this.ambientLight = new THREE.AmbientLight(0x1a1a1a, 0.2);
        this.scene.scene.add(this.ambientLight);
        this.scene.currentObjects.push(this.ambientLight);

        // Sombras nas bordas (esferas escuras)
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0
            });
            const shadow = new THREE.Mesh(geometry, material);

            const angle = (i / 20) * Math.PI * 2;
            const radius = 3 + Math.random() * 2;
            shadow.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 2,
                Math.sin(angle) * radius - 5
            );

            this.scene.scene.add(shadow);
            this.scene.currentObjects.push(shadow);

            // Sombras se aproximam com o tempo
            this.gsapTo(shadow.material, {
                opacity: 0.8,
                duration: 60,
                ease: 'power1.in'
            });

            this.gsapTo(shadow.position, {
                x: shadow.position.x * 0.3,
                z: shadow.position.z + 2,
                duration: 60,
                ease: 'power1.in'
            });
        }
    }

    async intro() {
        if (this.isDestroyed) return;

        await UI.showText(PHASE_DATA.phase7.intro, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(1500);
    }

    async showPuzzle() {
        if (this.isDestroyed) return;

        // Mostrar enigma
        await UI.showText(PHASE_DATA.phase7.puzzle.question, null, 0.5);
        await this.delay(8000);
        if (this.isDestroyed) return;

        // Criar UI do puzzle
        this.createPuzzleUI();
        this.startTimer();
        this.startDarkeningEffect();
    }

    createPuzzleUI() {
        const container = document.createElement('div');
        container.id = 'puzzle-container';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 10, 10, 0.95);
            border: 2px solid #660000;
            border-radius: 15px;
            padding: 40px;
            z-index: 100;
            max-width: 500px;
        `;

        // Título
        const title = document.createElement('div');
        title.textContent = 'Digite o código de 4 dígitos:';
        title.style.cssText = `
            color: #cc0000;
            font-size: 20px;
            margin-bottom: 20px;
            text-align: center;
        `;
        container.appendChild(title);

        // Input de código
        const input = document.createElement('input');
        input.id = 'code-input';
        input.type = 'text';
        input.maxLength = 4;
        input.placeholder = '0000';
        input.style.cssText = `
            width: 100%;
            padding: 15px;
            font-size: 30px;
            text-align: center;
            background: #1a1a1a;
            color: #cc0000;
            border: 2px solid #660000;
            border-radius: 10px;
            font-family: monospace;
            letter-spacing: 10px;
        `;
        container.appendChild(input);

        // Botão verificar
        const checkBtn = document.createElement('button');
        checkBtn.textContent = 'Verificar';
        checkBtn.style.cssText = `
            width: 100%;
            margin-top: 20px;
            padding: 15px;
            background: #660000;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        `;

        checkBtn.addEventListener('mouseenter', () => {
            checkBtn.style.background = '#990000';
        });

        checkBtn.addEventListener('mouseleave', () => {
            checkBtn.style.background = '#660000';
        });

        checkBtn.addEventListener('click', () => {
            this.checkAnswer(input.value);
        });

        container.appendChild(checkBtn);

        // Contador de tentativas
        const attemptsEl = document.createElement('div');
        attemptsEl.id = 'attempts-counter';
        attemptsEl.textContent = `Tentativas: ${this.attempts}`;
        attemptsEl.style.cssText = `
            margin-top: 20px;
            color: #cc0000;
            text-align: center;
            font-size: 14px;
        `;
        container.appendChild(attemptsEl);

        document.body.appendChild(container);

        // Focus no input
        input.focus();

        // Enter para verificar
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer(input.value);
            }
        });
    }

    startTimer() {
        const timerEl = document.createElement('div');
        timerEl.id = 'darkness-timer';
        timerEl.textContent = '5:00';
        timerEl.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 40px;
            color: #cc0000;
            font-weight: bold;
            z-index: 100;
            text-shadow: 0 0 10px rgba(204, 0, 0, 0.8);
        `;

        document.body.appendChild(timerEl);

        this.timerInterval = setInterval(() => {
            if (this.isDestroyed) {
                clearInterval(this.timerInterval);
                timerEl.remove();
                return;
            }

            this.timeElapsed++;
            const remaining = PHASE_DATA.phase7.timeLimit - this.timeElapsed;

            if (remaining <= 0) {
                clearInterval(this.timerInterval);
                timerEl.remove();
                this.showGiveUpOption();
            } else {
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                // Piscar quando < 30s
                if (remaining < 30 && remaining % 2 === 0) {
                    timerEl.style.color = '#ff0000';
                } else {
                    timerEl.style.color = '#cc0000';
                }
            }
        }, 1000);
    }

    startDarkeningEffect() {
        // A cada 30s, escurece mais
        const darkenInterval = setInterval(() => {
            if (this.isDestroyed) {
                clearInterval(darkenInterval);
                return;
            }

            this.lightLevel -= 0.05;
            if (this.lightLevel < 0.1) this.lightLevel = 0.1;

            if (this.ambientLight) {
                this.gsapTo(this.ambientLight, {
                    intensity: this.lightLevel * 0.2,
                    duration: 5
                });
            }

            // Mostrar hint
            if (this.currentHint < PHASE_DATA.phase7.puzzle.hints.length) {
                this.showHint(PHASE_DATA.phase7.puzzle.hints[this.currentHint]);
                this.currentHint++;
            }
        }, 30000);
    }

    async showHint(hint) {
        if (this.isDestroyed) return;

        const currentText = UI.getCurrentText();
        await UI.hideText(0.3);
        await this.delay(500);

        await UI.showText(hint, null, 0.5);
        await this.delay(3000);
        await UI.hideText(0.3);
        await this.delay(500);

        if (currentText) {
            await UI.showText(currentText, null, 0.3);
        }
    }

    async checkAnswer(code) {
        if (this.isDestroyed) return;

        this.attempts++;

        // Atualizar contador
        const attemptsEl = document.getElementById('attempts-counter');
        if (attemptsEl) {
            attemptsEl.textContent = `Tentativas: ${this.attempts}`;
        }

        // SFX de erro (sempre errado!)
        try {
            this.audio.playSFX('wrong-sfx');
        } catch (error) {
            console.warn('SFX wrong não disponível');
        }

        // Shake no container
        const container = document.getElementById('puzzle-container');
        if (container) {
            this.gsapTo(container, {
                x: 10,
                duration: 0.1,
                yoyo: true,
                repeat: 5,
                onComplete: () => {
                    container.style.transform = 'translate(-50%, -50%)';
                }
            });
        }

        // Limpar input
        const input = document.getElementById('code-input');
        if (input) {
            input.value = '';
            input.focus();
        }

        // Após 10 tentativas, mostrar opção de desistir
        if (this.attempts >= 10) {
            this.showGiveUpOption();
        }
    }

    showGiveUpOption() {
        // Verificar se já existe
        if (document.getElementById('give-up-btn')) return;

        const giveUpBtn = document.createElement('button');
        giveUpBtn.id = 'give-up-btn';
        giveUpBtn.textContent = 'Desistir';
        giveUpBtn.style.cssText = `
            position: fixed;
            bottom: 50px;
            right: 50px;
            padding: 10px 20px;
            background: rgba(102, 0, 0, 0.5);
            color: #cc0000;
            border: 1px solid #660000;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            z-index: 101;
            transition: all 0.3s;
            opacity: 0.5;
        `;

        giveUpBtn.addEventListener('mouseenter', () => {
            giveUpBtn.style.opacity = '1';
            giveUpBtn.style.background = 'rgba(102, 0, 0, 0.8)';
        });

        giveUpBtn.addEventListener('mouseleave', () => {
            giveUpBtn.style.opacity = '0.5';
            giveUpBtn.style.background = 'rgba(102, 0, 0, 0.5)';
        });

        giveUpBtn.addEventListener('click', async () => {
            await this.giveUp();
        });

        document.body.appendChild(giveUpBtn);
    }

    async giveUp() {
        if (this.isDestroyed) return;

        // Limpar timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Remover UI
        const container = document.getElementById('puzzle-container');
        if (container) container.remove();

        const timer = document.getElementById('darkness-timer');
        if (timer) timer.remove();

        const giveUpBtn = document.getElementById('give-up-btn');
        if (giveUpBtn) giveUpBtn.remove();

        await UI.hideText(0.3);
        await this.delay(1000);

        // Mensagem de reconhecimento de limitação
        await UI.showText(PHASE_DATA.phase7.giveUpMessage, null, 0.5);
        await this.delay(4000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(1000);

        // Mensagem final
        await UI.showText(PHASE_DATA.phase7.finalMessage, null, 0.5);
        await this.delay(4000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(1500);

        // Transição para Fase 8
        await this.complete();
    }

    async complete() {
        console.log('Fase 7 completa (por desistência)');

        this.scene.stopAnimation();

        // Aumentar luz levemente (preparação para Fase 8)
        if (this.ambientLight) {
            this.gsapTo(this.ambientLight, {
                intensity: 0.3,
                duration: 2
            });
        }

        await this.delay(2000);

        // Salvar progresso
        this.state.completePhase(7, {
            attempts: this.attempts,
            gaveUp: true,
            timeCompleted: Date.now()
        });

        // Próxima fase (SEM carta desta vez!)
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

        // Limpar timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Remover UIs
        const container = document.getElementById('puzzle-container');
        if (container) container.remove();

        const timer = document.getElementById('darkness-timer');
        if (timer) timer.remove();

        const giveUpBtn = document.getElementById('give-up-btn');
        if (giveUpBtn) giveUpBtn.remove();

        // Limpar partículas
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
