import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';
import { PHASE_DATA } from '../config/assets.js';

export class Phase2_Wisdom extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.currentRiddle = 0;
        this.riddlesData = PHASE_DATA.phase2.riddles;
        this.booksFound = [];
        this.eagle = null;
        this.books = [];
        this.particles = [];

        // Iniciar música (usa courage-music como fallback)
        const music = this.audio.playMusic('wisdom-music', { fadeIn: 2000 });
        if (!music) {
            console.warn('Música wisdom não disponível, usando courage-music');
            this.audio.playMusic('courage-music', { fadeIn: 2000 });
        }
    }

    async init() {
        console.log('Iniciando Fase 2: Sabedoria (Ravenclaw)');

        // Background azul/bronze
        this.scene.setBackgroundColor('#0e1a40');

        // Criar cena
        await this.setupScene();

        // Iniciar enigmas
        await this.startRiddles();
    }

    async setupScene() {
        // Luz azulada
        const ambientLight = new THREE.AmbientLight(0x4a5f8f, 0.5);
        this.scene.scene.add(ambientLight);
        this.scene.currentObjects.push(ambientLight);

        // Luz pontual prateada
        const moonLight = new THREE.PointLight(0xaaccff, 1, 100);
        moonLight.position.set(0, 5, -5);
        this.scene.scene.add(moonLight);
        this.scene.currentObjects.push(moonLight);

        // Águia de bronze (centro da cena)
        try {
            this.eagle = await this.scene.addModel('/assets/models/phase2/eagle.glb', {
                position: [0, 0.5, -4],
                scale: [1, 1, 1]
            });
        } catch (error) {
            console.warn('Modelo da águia não disponível, usando placeholder');
            // Criar águia placeholder
            const geometry = new THREE.ConeGeometry(0.3, 0.8, 8);
            const material = new THREE.MeshPhongMaterial({ color: 0xcd7f32 });
            this.eagle = new THREE.Mesh(geometry, material);
            this.eagle.position.set(0, 0.5, -4);
            this.scene.scene.add(this.eagle);
            this.scene.currentObjects.push(this.eagle);
        }

        // Criar 3 livros (estantes) que brilharão quando resposta correta
        await this.createBooks();
    }

    async createBooks() {
        const bookPositions = [
            { x: -3, y: 0, z: -3 },
            { x: 0, y: 0.5, z: -2.5 },
            { x: 3, y: 0, z: -3 }
        ];

        for (let i = 0; i < 3; i++) {
            try {
                const book = await this.scene.addModel('/assets/models/phase2/book.glb', {
                    position: [bookPositions[i].x, bookPositions[i].y, bookPositions[i].z],
                    scale: [0.5, 0.5, 0.5]
                });
                book.userData.riddleIndex = i;
                book.userData.glowing = false;
                this.books.push(book);
            } catch (error) {
                // Placeholder
                const geometry = new THREE.BoxGeometry(0.3, 0.4, 0.1);
                const material = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
                const book = new THREE.Mesh(geometry, material);
                book.position.set(bookPositions[i].x, bookPositions[i].y, bookPositions[i].z);
                book.userData.riddleIndex = i;
                book.userData.glowing = false;
                this.scene.scene.add(book);
                this.scene.currentObjects.push(book);
                this.books.push(book);
            }
        }
    }

    async startRiddles() {
        if (this.isDestroyed) return;

        // Apresentar enigma atual
        await this.presentRiddle(this.currentRiddle);
    }

    async presentRiddle(riddleIndex) {
        if (this.isDestroyed) return;

        const riddle = this.riddlesData[riddleIndex];

        // Mostrar pergunta
        await UI.showText(riddle.question, null, 0.5);
        await this.delay(4000);
        if (this.isDestroyed) return;

        // Criar UI de opções
        this.showRiddleOptions(riddle, riddleIndex);
    }

    showRiddleOptions(riddle, riddleIndex) {
        // Criar container de opções
        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'riddle-options';
        optionsContainer.style.cssText = `
            position: fixed;
            bottom: 150px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 100;
        `;

        riddle.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.style.cssText = `
                padding: 15px 30px;
                background: rgba(74, 95, 143, 0.8);
                border: 2px solid #aaccff;
                color: white;
                font-size: 18px;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(74, 95, 143, 1)';
                button.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(74, 95, 143, 0.8)';
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('click', () => {
                this.handleAnswer(index, option.correct, riddle, riddleIndex);
            });

            optionsContainer.appendChild(button);
        });

        document.body.appendChild(optionsContainer);
    }

    async handleAnswer(selectedIndex, isCorrect, riddle, riddleIndex) {
        // Remover opções
        const optionsContainer = document.getElementById('riddle-options');
        if (optionsContainer) {
            optionsContainer.remove();
        }

        await UI.hideText(0.3);
        await this.delay(500);
        if (this.isDestroyed) return;

        if (isCorrect) {
            // Resposta correta
            try {
                this.audio.playSFX('correct-sfx');
            } catch (error) {
                console.warn('SFX correct não disponível');
            }

            // Livro específico brilha
            await this.illuminateBook(riddleIndex);

            // Mostrar versículo
            await UI.showText(riddle.bibleVerse, null, 0.5);
            await this.delay(4000);
            if (this.isDestroyed) return;
            await UI.hideText(0.3);
            await this.delay(800);

            // Próximo enigma ou conclusão
            this.currentRiddle++;
            if (this.currentRiddle < this.riddlesData.length) {
                await this.presentRiddle(this.currentRiddle);
            } else {
                await this.complete();
            }
        } else {
            // Resposta errada
            try {
                this.audio.playSFX('wrong-sfx');
            } catch (error) {
                console.warn('SFX wrong não disponível');
            }

            await UI.showText("Não é isso... pense novamente.", null, 0.5);
            await this.delay(2000);
            if (this.isDestroyed) return;
            await UI.hideText(0.3);
            await this.delay(500);

            // Mostrar opções novamente
            this.showRiddleOptions(riddle, riddleIndex);
        }
    }

    async illuminateBook(bookIndex) {
        const book = this.books[bookIndex];
        if (!book || book.userData.glowing) return;

        book.userData.glowing = true;

        // Partículas azuis
        const particles = this.scene.createParticles(book.position, 50, 0x4a9eff);
        this.particles.push(...particles);

        // Animação de brilho
        const originalY = book.position.y;
        await new Promise(resolve => {
            this.gsapTo(book.position, {
                y: originalY + 0.3,
                duration: 1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
                onComplete: resolve
            });
        });
    }

    async complete() {
        console.log('Fase 2 completa!');

        this.scene.stopAnimation();

        // SFX
        try {
            this.audio.playSFX('victory-sfx');
        } catch (error) {
            console.warn('SFX vitória não disponível');
        }

        // Partículas
        for (let i = 0; i < 30; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 3,
                -3
            );
            const particles = this.scene.createParticles(pos, 10, 0x4a9eff);
            this.particles.push(...particles);
        }

        await this.delay(1000);

        // Reflexão final
        await this.finalReflection();

        await UI.hideText(0.5);
        await this.delay(1000);

        // Portal
        await this.showCompletionPortal();

        // Salvar progresso
        this.state.completePhase(2, {
            riddlesSolved: this.currentRiddle,
            timeCompleted: Date.now()
        });

        // Próxima carta
        this.requestNextCard();
    }

    async finalReflection() {
        if (this.isDestroyed) return;

        await UI.showText(PHASE_DATA.phase2.finalReflection, null, 0.5);
        await this.delay(6000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(800);

        await UI.showText(PHASE_DATA.phase2.verse, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
    }

    async showCompletionPortal() {
        const geometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x4a9eff,
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
            'Pegue a terceira carta de Edwiges.',
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
        console.log('Destruindo Fase 2');

        super.destroy();

        // Remover UI de opções se existir
        const optionsContainer = document.getElementById('riddle-options');
        if (optionsContainer) {
            optionsContainer.remove();
        }

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
