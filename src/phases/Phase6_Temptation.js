import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';
import { PHASE_DATA } from '../config/assets.js';

export class Phase6_Temptation extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.currentTemptation = 0;
        this.playerPos = { x: 0, y: 0 };
        this.mazeSize = 5;
        this.particles = [];

        // Iniciar música (usa courage-music como fallback)
        const music = this.audio.playMusic('temptation-music', { fadeIn: 2000 });
        if (!music) {
            console.warn('Música temptation não disponível, usando courage-music');
            this.audio.playMusic('courage-music', { fadeIn: 2000 });
        }
    }

    async init() {
        console.log('Iniciando Fase 6: A Tentação (Floresta Proibida)');

        // Background escuro
        this.scene.setBackgroundColor('#0f1a0f');

        // Criar cena
        await this.setupScene();

        // Introdução
        await this.intro();

        // Iniciar labirinto
        await this.startMaze();
    }

    async setupScene() {
        // Luz verde muito fraca (floresta sombria)
        const ambientLight = new THREE.AmbientLight(0x1a3d1a, 0.4);
        this.scene.scene.add(ambientLight);
        this.scene.currentObjects.push(ambientLight);

        // Névoa densa
        this.scene.scene.fog = new THREE.Fog(0x0f1a0f, 3, 12);

        // "Árvores" simples (cilindros escuros)
        for (let i = 0; i < 15; i++) {
            const geometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 8);
            const material = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
            const tree = new THREE.Mesh(geometry, material);

            const angle = (i / 15) * Math.PI * 2;
            const radius = 6 + Math.random() * 2;
            tree.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius - 5
            );

            this.scene.scene.add(tree);
            this.scene.currentObjects.push(tree);
        }
    }

    async intro() {
        if (this.isDestroyed) return;

        await UI.showText(PHASE_DATA.phase6.intro, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(1000);
    }

    async startMaze() {
        if (this.isDestroyed) return;

        await UI.showText("Use as setas do teclado para navegar...", null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;

        this.showMazeUI();
        this.presentTemptation(this.currentTemptation);
    }

    showMazeUI() {
        const container = document.createElement('div');
        container.id = 'maze-container';
        container.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
        `;

        // Grid do labirinto (simplificado - apenas visual)
        const mazeGrid = document.createElement('div');
        mazeGrid.id = 'maze-grid';
        mazeGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${this.mazeSize}, 60px);
            grid-template-rows: repeat(${this.mazeSize}, 60px);
            gap: 2px;
            background: rgba(15, 26, 15, 0.9);
            padding: 20px;
            border: 2px solid #2d5f2d;
            border-radius: 10px;
        `;

        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                const cell = document.createElement('div');
                cell.id = `cell-${x}-${y}`;
                cell.style.cssText = `
                    background: rgba(45, 95, 45, 0.3);
                    border: 1px solid #2d5f2d;
                    border-radius: 5px;
                    transition: all 0.3s;
                `;

                if (x === this.playerPos.x && y === this.playerPos.y) {
                    cell.style.background = 'rgba(212, 175, 55, 0.8)';
                    cell.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:30px;">✨</div>';
                }

                mazeGrid.appendChild(cell);
            }
        }

        container.appendChild(mazeGrid);
        document.body.appendChild(container);

        // Controles de setas
        this.setupControls();
    }

    setupControls() {
        this.keyHandler = (e) => {
            if (this.isDestroyed) return;

            let moved = false;
            const oldPos = { ...this.playerPos };

            if (e.key === 'ArrowUp' && this.playerPos.y > 0) {
                this.playerPos.y--;
                moved = true;
            } else if (e.key === 'ArrowDown' && this.playerPos.y < this.mazeSize - 1) {
                this.playerPos.y++;
                moved = true;
            } else if (e.key === 'ArrowLeft' && this.playerPos.x > 0) {
                this.playerPos.x--;
                moved = true;
            } else if (e.key === 'ArrowRight' && this.playerPos.x < this.mazeSize - 1) {
                this.playerPos.x++;
                moved = true;
            }

            if (moved) {
                this.updateMazeDisplay(oldPos);
                this.checkProgress();
            }
        };

        document.addEventListener('keydown', this.keyHandler);
    }

    updateMazeDisplay(oldPos) {
        // Limpar célula antiga
        const oldCell = document.getElementById(`cell-${oldPos.x}-${oldPos.y}`);
        if (oldCell) {
            oldCell.style.background = 'rgba(45, 95, 45, 0.3)';
            oldCell.innerHTML = '';
        }

        // Atualizar nova célula
        const newCell = document.getElementById(`cell-${this.playerPos.x}-${this.playerPos.y}`);
        if (newCell) {
            newCell.style.background = 'rgba(212, 175, 55, 0.8)';
            newCell.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:30px;">✨</div>';
        }
    }

    async checkProgress() {
        // Confusing logic: sometimes movement triggers temptation, sometimes loops back
        const totalMoves = Math.abs(this.playerPos.x) + Math.abs(this.playerPos.y);

        // Every 2-4 random moves (unpredictable)
        const triggerPoint = 2 + Math.floor(Math.random() * 3);

        if (totalMoves > 0 && totalMoves % triggerPoint === 0) {
            if (this.currentTemptation < PHASE_DATA.phase6.temptations.length) {
                await this.presentTemptation(this.currentTemptation);
                this.currentTemptation++;
            } else {
                // No exit - must ask for help
                await this.showNoExit();
            }
        }
    }

    async presentTemptation(index) {
        if (this.isDestroyed) return;

        const temptation = PHASE_DATA.phase6.temptations[index];

        // First voice (the lie)
        await this.delay(800);
        await UI.showText(temptation.voice, null, 0.5);

        // Whisper SFX
        try {
            this.audio.playSFX('wrong-sfx', { volume: 0.3, rate: 0.7 });
        } catch (error) {
            console.warn('SFX wrong não disponível');
        }

        await this.delay(2500);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(800);

        // Second voice (the "truth" - but not always helpful)
        await UI.showText(temptation.truth, null, 0.5);
        await this.delay(2500);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(1000);

        // Show choice buttons - player must decide which voice to follow
        this.showVoiceChoice(temptation);
    }

    showVoiceChoice(temptation) {
        const container = document.createElement('div');
        container.className = 'voice-choice-container';
        container.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            z-index: 100;
        `;

        // Button to follow first voice (the lie)
        const lieBtn = document.createElement('button');
        lieBtn.textContent = 'Seguir primeira voz';
        lieBtn.style.cssText = `
            padding: 15px 30px;
            background: rgba(139, 0, 0, 0.6);
            border: 2px solid rgba(139, 0, 0, 0.8);
            color: rgba(255, 255, 255, 0.8);
            font-size: 16px;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s;
        `;

        lieBtn.addEventListener('mouseenter', () => {
            lieBtn.style.background = 'rgba(139, 0, 0, 0.8)';
        });
        lieBtn.addEventListener('mouseleave', () => {
            lieBtn.style.background = 'rgba(139, 0, 0, 0.6)';
        });
        lieBtn.addEventListener('click', () => {
            container.remove();
            this.handleVoiceChoice(temptation, true);
        });

        // Button to follow second voice (the "truth")
        const truthBtn = document.createElement('button');
        truthBtn.textContent = 'Seguir segunda voz';
        truthBtn.style.cssText = `
            padding: 15px 30px;
            background: rgba(45, 95, 45, 0.6);
            border: 2px solid rgba(45, 95, 45, 0.8);
            color: rgba(255, 255, 255, 0.8);
            font-size: 16px;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s;
        `;

        truthBtn.addEventListener('mouseenter', () => {
            truthBtn.style.background = 'rgba(45, 95, 45, 0.8)';
        });
        truthBtn.addEventListener('mouseleave', () => {
            truthBtn.style.background = 'rgba(45, 95, 45, 0.6)';
        });
        truthBtn.addEventListener('click', () => {
            container.remove();
            this.handleVoiceChoice(temptation, false);
        });

        container.appendChild(lieBtn);
        container.appendChild(truthBtn);
        document.body.appendChild(container);
    }

    async handleVoiceChoice(temptation, followedLie) {
        if (this.isDestroyed) return;

        const progressMade = (followedLie && temptation.leadsToProgress) ||
                            (!followedLie && !temptation.leadsToProgress);

        if (progressMade) {
            // Correct choice - advance
            await UI.showText("O caminho se abre.", null, 0.3);
            await this.delay(1500);
            await UI.hideText(0.2);
        } else {
            // Wrong choice - loop back
            await UI.showText("Você já esteve aqui antes.", null, 0.3);
            await this.delay(1500);
            await UI.hideText(0.2);

            // Reset player position slightly (creates confusion)
            this.playerPos.x = Math.max(0, this.playerPos.x - 1);
            this.playerPos.y = Math.max(0, this.playerPos.y - 1);
            this.updateMazeDisplay({ x: this.playerPos.x + 1, y: this.playerPos.y + 1 });
        }
    }

    async showNoExit() {
        if (this.isDestroyed) return;

        await UI.hideText(0.3);
        await this.delay(1000);

        await UI.showText(PHASE_DATA.phase6.exitMessage, null, 0.5);
        await this.delay(4000);
        if (this.isDestroyed) return;

        // Mostrar botão "Pedir Ajuda"
        this.showHelpButton();
    }

    showHelpButton() {
        const helpBtn = document.createElement('button');
        helpBtn.id = 'help-button';
        helpBtn.textContent = 'Pedir Ajuda';
        helpBtn.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            padding: 20px 50px;
            background: #d4af37;
            color: #0f1a0f;
            border: none;
            border-radius: 10px;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            z-index: 101;
            transition: all 0.3s;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
        `;

        helpBtn.addEventListener('mouseenter', () => {
            helpBtn.style.transform = 'translateX(-50%) scale(1.1)';
        });

        helpBtn.addEventListener('mouseleave', () => {
            helpBtn.style.transform = 'translateX(-50%) scale(1)';
        });

        helpBtn.addEventListener('click', async () => {
            helpBtn.remove();
            await this.acceptHelp();
        });

        document.body.appendChild(helpBtn);
    }

    async acceptHelp() {
        if (this.isDestroyed) return;

        await UI.hideText(0.3);
        await this.delay(500);

        await UI.showText(PHASE_DATA.phase6.helpMessage, null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;

        // Luz desce do céu
        this.createHeavenlyLight();

        await this.delay(2000);

        await UI.hideText(0.3);
        await this.delay(1000);

        await this.complete();
    }

    createHeavenlyLight() {
        // Luz dourada descendo
        const lightGeometry = new THREE.CylinderGeometry(0.1, 2, 10, 32, 1, true);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(0, 5, -3);
        this.scene.scene.add(light);
        this.scene.currentObjects.push(light);

        // Animar descida
        this.gsapTo(light.position, {
            y: 0,
            duration: 2,
            ease: 'power2.out'
        });

        this.gsapTo(lightMaterial, {
            opacity: 0.6,
            duration: 2
        });

        // Partículas douradas
        for (let i = 0; i < 30; i++) {
            this.setTimeout(() => {
                const pos = new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    5,
                    -3
                );
                const particles = this.scene.createParticles(pos, 5, 0xd4af37);
                this.particles.push(...particles);
            }, i * 100);
        }
    }

    async complete() {
        console.log('Fase 6 completa!');

        this.scene.stopAnimation();

        // SFX de vitória
        try {
            this.audio.playSFX('victory-sfx');
        } catch (error) {
            console.warn('SFX vitória não disponível');
        }

        await this.delay(1000);

        // Versículo final
        await UI.showText(PHASE_DATA.phase6.verse, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
        await UI.hideText(0.5);
        await this.delay(1000);

        // Portal
        await this.showCompletionPortal();

        // Salvar progresso
        this.state.completePhase(6, {
            askedForHelp: true,
            timeCompleted: Date.now()
        });

        // Próxima carta
        this.requestNextCard();
    }

    async showCompletionPortal() {
        const geometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2d5f2d,
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
            'Pegue a sétima carta de Edwiges.',
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
        console.log('Destruindo Fase 6');

        super.destroy();

        // Remover event listener
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
        }

        // Remover UIs
        const maze = document.getElementById('maze-container');
        if (maze) maze.remove();

        const helpBtn = document.getElementById('help-button');
        if (helpBtn) helpBtn.remove();

        const voiceChoices = document.querySelectorAll('.voice-choice-container');
        voiceChoices.forEach(v => v.remove());

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
