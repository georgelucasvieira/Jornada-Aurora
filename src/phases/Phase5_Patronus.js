import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';
import { PHASE_DATA } from '../config/assets.js';

export class Phase5_Patronus extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.selectedMemories = [];
        this.selectedPrayer = null;
        this.dementors = [];
        this.lightPower = 0;
        this.confrontActive = false;
        this.particles = [];

        // Iniciar música (usa courage-music como fallback)
        const music = this.audio.playMusic('patronus-music', { fadeIn: 2000 });
        if (!music) {
            console.warn('Música patronus não disponível, usando courage-music');
            this.audio.playMusic('courage-music', { fadeIn: 2000 });
        }
    }

    async init() {
        console.log('Iniciando Fase 5: O Patrono (Defesa Contra as Trevas)');

        // Background escuro/sombrio
        this.scene.setBackgroundColor('#1a0f2e');

        // Criar cena
        await this.setupScene();

        // Introdução
        await this.intro();

        // Parte 1: Escolher memórias
        await this.selectMemories();
    }

    async setupScene() {
        // Luz muito fraca
        const ambientLight = new THREE.AmbientLight(0x2d1f4d, 0.3);
        this.scene.scene.add(ambientLight);
        this.scene.currentObjects.push(ambientLight);

        // Névoa/fog
        this.scene.scene.fog = new THREE.Fog(0x1a0f2e, 5, 15);

        // Criar dementadores (sombras flutuantes)
        this.createDementors();
    }

    createDementors() {
        const count = PHASE_DATA.phase5.dementorCount;

        for (let i = 0; i < count; i++) {
            // Sombra simples (esfera preta com transparência)
            const geometry = new THREE.SphereGeometry(0.3, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.7
            });
            const dementor = new THREE.Mesh(geometry, material);

            // Posição aleatória nas bordas
            const angle = (i / count) * Math.PI * 2;
            const radius = 8;
            dementor.position.set(
                Math.cos(angle) * radius,
                Math.random() * 2 - 1,
                Math.sin(angle) * radius - 5
            );

            dementor.userData.clicked = false;
            dementor.userData.initialPos = dementor.position.clone();

            this.scene.scene.add(dementor);
            this.scene.currentObjects.push(dementor);
            this.dementors.push(dementor);

            // Animação flutuante
            this.gsapTo(dementor.position, {
                y: dementor.position.y + 0.5,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

    async intro() {
        if (this.isDestroyed) return;

        await UI.showText(PHASE_DATA.phase5.intro, null, 0.5);
        await this.delay(4000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(1000);
    }

    async selectMemories() {
        if (this.isDestroyed) return;

        await UI.showText("Escolha 3 memórias que trazem luz ao seu coração:", null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;

        this.showMemoriesUI();
    }

    showMemoriesUI() {
        const container = document.createElement('div');
        container.id = 'memories-container';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            z-index: 100;
            padding: 30px;
            background: rgba(26, 15, 46, 0.9);
            border: 2px solid #6a4c9c;
            border-radius: 15px;
        `;

        PHASE_DATA.phase5.memories.forEach((memory) => {
            const button = document.createElement('button');
            button.innerHTML = `
                <div style="font-size: 40px; margin-bottom: 10px;">${memory.icon}</div>
                <div style="font-size: 16px;">${memory.text}</div>
            `;
            button.style.cssText = `
                padding: 20px;
                background: rgba(106, 76, 156, 0.3);
                border: 2px solid #6a4c9c;
                color: white;
                font-size: 18px;
                cursor: pointer;
                border-radius: 10px;
                transition: all 0.3s;
                min-width: 150px;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(106, 76, 156, 0.6)';
                button.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('selected')) {
                    button.style.background = 'rgba(106, 76, 156, 0.3)';
                    button.style.transform = 'scale(1)';
                }
            });

            button.addEventListener('click', () => {
                if (button.classList.contains('selected')) {
                    // Desselecionar
                    button.classList.remove('selected');
                    button.style.background = 'rgba(106, 76, 156, 0.3)';
                    button.style.borderColor = '#6a4c9c';
                    this.selectedMemories = this.selectedMemories.filter(m => m !== memory.id);
                } else if (this.selectedMemories.length < 3) {
                    // Selecionar
                    button.classList.add('selected');
                    button.style.background = 'rgba(212, 175, 55, 0.6)';
                    button.style.borderColor = '#d4af37';
                    this.selectedMemories.push(memory.id);
                    this.lightPower += 33;

                    // Efeito de luz
                    this.addLightBurst();
                }

                // Se 3 memórias selecionadas, mostrar botão continuar
                if (this.selectedMemories.length === 3) {
                    this.showContinueButton(container);
                }
            });

            container.appendChild(button);
        });

        document.body.appendChild(container);
    }

    addLightBurst() {
        // Partículas douradas
        for (let i = 0; i < 10; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                -3
            );
            const particles = this.scene.createParticles(pos, 5, 0xd4af37);
            this.particles.push(...particles);
        }

        // Aumentar luz ambiente levemente
        const ambientLight = this.scene.scene.children.find(child => child.type === 'AmbientLight');
        if (ambientLight) {
            this.gsapTo(ambientLight, {
                intensity: ambientLight.intensity + 0.1,
                duration: 0.5
            });
        }
    }

    showContinueButton(container) {
        const continueBtn = document.createElement('button');
        continueBtn.textContent = 'Continuar';
        continueBtn.style.cssText = `
            grid-column: 1 / -1;
            padding: 15px;
            background: #d4af37;
            color: #1a0f2e;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.3s;
        `;

        continueBtn.addEventListener('mouseenter', () => {
            continueBtn.style.transform = 'scale(1.05)';
        });

        continueBtn.addEventListener('mouseleave', () => {
            continueBtn.style.transform = 'scale(1)';
        });

        continueBtn.addEventListener('click', async () => {
            container.remove();
            await UI.hideText(0.3);
            await this.delay(500);
            await this.selectPrayer();
        });

        container.appendChild(continueBtn);
    }

    async selectPrayer() {
        if (this.isDestroyed) return;

        await UI.showText("Agora... qual é seu verdadeiro Patrono?", null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;

        this.showPrayersUI();
    }

    showPrayersUI() {
        const container = document.createElement('div');
        container.id = 'prayers-container';
        container.style.cssText = `
            position: fixed;
            bottom: 150px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 100;
        `;

        PHASE_DATA.phase5.prayers.forEach((prayer) => {
            const button = document.createElement('button');
            button.textContent = prayer.text;
            button.style.cssText = `
                padding: 20px 40px;
                background: rgba(106, 76, 156, 0.8);
                border: 2px solid #6a4c9c;
                color: white;
                font-size: 20px;
                cursor: pointer;
                border-radius: 10px;
                transition: all 0.3s;
                min-width: 300px;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(106, 76, 156, 1)';
                button.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(106, 76, 156, 0.8)';
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('click', async () => {
                this.selectedPrayer = prayer.id;
                container.remove();
                await UI.hideText(0.3);
                await this.delay(500);
                await this.startConfrontation();
            });

            container.appendChild(button);
        });

        document.body.appendChild(container);
    }

    async startConfrontation() {
        if (this.isDestroyed) return;

        await UI.showText("Os Dementadores se aproximam! Clique neles para expulsá-los com a luz!", null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;

        this.confrontActive = true;
        this.startTimer();

        // Configurar raycaster para cliques
        this.scene.clickableObjects = [...this.dementors];
        this.scene.setupRaycaster((object) => this.onDementorClick(object));

        // Dementadores começam a se aproximar
        this.dementors.forEach((dementor, index) => {
            this.setTimeout(() => {
                if (!this.isDestroyed && this.confrontActive) {
                    this.gsapTo(dementor.position, {
                        x: (Math.random() - 0.5) * 4,
                        y: (Math.random() - 0.5) * 2,
                        z: -2,
                        duration: 5,
                        ease: 'power1.in'
                    });
                }
            }, index * 200);
        });
    }

    startTimer() {
        const timerEl = document.createElement('div');
        timerEl.id = 'timer';
        timerEl.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 40px;
            color: #d4af37;
            font-weight: bold;
            z-index: 100;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
        `;

        let timeLeft = PHASE_DATA.phase5.confrontDuration;
        timerEl.textContent = timeLeft;
        document.body.appendChild(timerEl);

        const interval = setInterval(() => {
            if (this.isDestroyed || !this.confrontActive) {
                clearInterval(interval);
                timerEl.remove();
                return;
            }

            timeLeft--;
            timerEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(interval);
                timerEl.remove();
                this.checkVictory();
            }
        }, 1000);
    }

    async onDementorClick(dementor) {
        if (!this.confrontActive || dementor.userData.clicked) return;

        dementor.userData.clicked = true;

        // SFX
        try {
            this.audio.playSFX('correct-sfx');
        } catch (error) {
            console.warn('SFX correct não disponível');
        }

        // Explosão de luz
        const particles = this.scene.createParticles(dementor.position, 30, 0xd4af37);
        this.particles.push(...particles);

        // Dementor desaparece
        this.gsapTo(dementor.material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.scene.scene.remove(dementor);
            }
        });

        // Verificar se todos foram eliminados
        const allClicked = this.dementors.every(d => d.userData.clicked);
        if (allClicked) {
            this.confrontActive = false;
            await this.delay(1000);
            await this.victory();
        }
    }

    async checkVictory() {
        this.confrontActive = false;

        const clickedCount = this.dementors.filter(d => d.userData.clicked).length;
        const halfCount = Math.floor(this.dementors.length / 2);

        if (clickedCount >= halfCount) {
            await this.victory();
        } else {
            await this.retry();
        }
    }

    async retry() {
        if (this.isDestroyed) return;

        await UI.showText("A escuridão é forte... mas você pode tentar novamente.", null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);

        // Resetar dementadores
        this.dementors.forEach(d => {
            d.userData.clicked = false;
            d.material.opacity = 0.7;
            d.position.copy(d.userData.initialPos);
        });

        await this.delay(1000);
        await this.startConfrontation();
    }

    async victory() {
        if (this.isDestroyed) return;

        console.log('Fase 5 completa!');

        this.scene.stopAnimation();

        // SFX de vitória
        try {
            this.audio.playSFX('victory-sfx');
        } catch (error) {
            console.warn('SFX vitória não disponível');
        }

        // Explosão de luz
        for (let i = 0; i < 50; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4,
                -3
            );
            const particles = this.scene.createParticles(pos, 15, 0xd4af37);
            this.particles.push(...particles);
        }

        await this.delay(1000);

        // Mensagem final
        await UI.showText(PHASE_DATA.phase5.finalMessage, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(800);

        // Versículo
        await UI.showText(PHASE_DATA.phase5.verse, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
        await UI.hideText(0.5);
        await this.delay(1000);

        // Portal
        await this.showCompletionPortal();

        // Salvar progresso
        this.state.completePhase(5, {
            memories: this.selectedMemories,
            prayer: this.selectedPrayer,
            timeCompleted: Date.now()
        });

        // Próxima carta
        this.requestNextCard();
    }

    async showCompletionPortal() {
        const geometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0
        });

        const portal = new THREE.Mesh(geometry, material);
        portal.position.set(0, 0, -3);
        this.scene.scene.add(portal);
        this.scene.currentObjects.push(portal);

        this.gsapTo(portal.material, {
            opacity: 0.8,
            duration: 1
        });

        this.gsapTo(portal.rotation, {
            z: Math.PI * 2,
            duration: 3,
            repeat: -1,
            ease: 'none'
        });

        this.gsapTo(portal.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 2,
            ease: 'back.out(1.7)'
        });

        await this.delay(2000);
    }

    requestNextCard() {
        UI.showText(
            'Pegue a sexta carta de Edwiges.',
            null,
            1
        );

        this.setTimeout(() => {
            const game = window.game;
            if (game) {
                game.showCardModal();
            }
        }, 2000);
    }

    destroy() {
        console.log('Destruindo Fase 5');

        super.destroy();

        // Remover UIs
        const memories = document.getElementById('memories-container');
        if (memories) memories.remove();

        const prayers = document.getElementById('prayers-container');
        if (prayers) prayers.remove();

        const timer = document.getElementById('timer');
        if (timer) timer.remove();

        // Limpar partículas
        this.particles.forEach(p => {
            this.scene.scene.remove(p);
            if (p.geometry) p.geometry.dispose();
            if (p.material) p.material.dispose();
        });

        // Limpar fog
        this.scene.scene.fog = null;

        this.scene.clear();

        UI.clearInteractive();
        UI.hideText(0);
    }
}
