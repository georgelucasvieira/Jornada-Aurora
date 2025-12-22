import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';
import { PHASE_DATA } from '../config/assets.js';

export class Phase4_Faith extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.currentChoice = 0;
        this.choices = PHASE_DATA.phase4.moralChoices;
        this.userChoices = [];
        this.particles = [];

        // Iniciar música (usa courage-music como fallback)
        const music = this.audio.playMusic('faith-music', { fadeIn: 2000 });
        if (!music) {
            console.warn('Música faith não disponível, usando courage-music');
            this.audio.playMusic('courage-music', { fadeIn: 2000 });
        }
    }

    async init() {
        console.log('Iniciando Fase 4: Ambição Redimida (Slytherin)');

        // Background verde/prata
        this.scene.setBackgroundColor('#0a2e1a');

        // Criar cena
        await this.setupScene();

        // Introdução
        await this.intro();

        // Iniciar escolhas
        await this.startChoices();
    }

    async setupScene() {
        // Luz esmeralda
        const ambientLight = new THREE.AmbientLight(0x2d5f3f, 0.5);
        this.scene.scene.add(ambientLight);
        this.scene.currentObjects.push(ambientLight);

        // Luz pontual prateada
        const silverLight = new THREE.PointLight(0xc0c0c0, 1, 100);
        silverLight.position.set(-2, 4, -5);
        this.scene.scene.add(silverLight);
        this.scene.currentObjects.push(silverLight);

        // Serpente animada
        try {
            const serpent = await this.scene.addModel('/assets/models/phase4/serpent.glb', {
                position: [0, 0, -4],
                scale: [0.6, 0.6, 0.6]
            });

            // Animação ondulante da serpente
            this.gsapTo(serpent.rotation, {
                y: Math.PI * 2,
                duration: 6,
                repeat: -1,
                ease: 'none'
            });
        } catch (error) {
            console.warn('Modelo da serpente não disponível');
            // Criar serpente placeholder
            const geometry = new THREE.TorusGeometry(0.5, 0.15, 8, 16);
            const material = new THREE.MeshPhongMaterial({ color: 0x2d5f3f });
            const serpent = new THREE.Mesh(geometry, material);
            serpent.position.set(0, 0, -4);
            serpent.rotation.x = Math.PI / 2;
            this.scene.scene.add(serpent);
            this.scene.currentObjects.push(serpent);
        }
    }

    async intro() {
        if (this.isDestroyed) return;

        await UI.showText(PHASE_DATA.phase4.intro, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(1000);
    }

    async startChoices() {
        if (this.isDestroyed) return;

        await this.presentChoice(this.currentChoice);
    }

    async presentChoice(choiceIndex) {
        if (this.isDestroyed) return;

        const choice = this.choices[choiceIndex];

        // Mostrar situação
        await UI.showText(choice.situation, null, 0.5);
        await this.delay(4000);
        if (this.isDestroyed) return;

        // Criar UI de opções
        this.showChoiceOptions(choice, choiceIndex);
    }

    showChoiceOptions(choice, choiceIndex) {
        const container = document.createElement('div');
        container.id = 'choice-options';
        container.style.cssText = `
            position: fixed;
            bottom: 150px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 100;
            max-width: 600px;
        `;

        choice.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.style.cssText = `
                padding: 15px 30px;
                background: rgba(45, 95, 63, 0.8);
                border: 2px solid #50c878;
                color: white;
                font-size: 18px;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s;
                text-align: left;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(45, 95, 63, 1)';
                button.style.transform = 'scale(1.02)';
                button.style.borderColor = '#c0c0c0';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(45, 95, 63, 0.8)';
                button.style.transform = 'scale(1)';
                button.style.borderColor = '#50c878';
            });

            button.addEventListener('click', () => {
                this.handleChoice(index, option, choice, choiceIndex);
            });

            container.appendChild(button);
        });

        document.body.appendChild(container);
    }

    async handleChoice(selectedIndex, option, choice, choiceIndex) {
        // Remover opções
        const container = document.getElementById('choice-options');
        if (container) {
            container.remove();
        }

        // Salvar escolha
        this.userChoices.push({
            choiceId: choice.id,
            selectedIndex,
            moral: option.moral
        });

        await UI.hideText(0.3);
        await this.delay(500);
        if (this.isDestroyed) return;

        // Feedback da escolha
        await UI.showText(option.feedback, null, 0.5);
        await this.delay(2500);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(500);

        // Mostrar referência bíblica
        await UI.showText(option.reference, null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(800);

        // Efeitos visuais baseados na escolha
        if (option.moral === 'ideal') {
            // Partículas verdes/douradas
            for (let i = 0; i < 20; i++) {
                const pos = new THREE.Vector3(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 3,
                    -3
                );
                const particles = this.scene.createParticles(pos, 5, 0x50c878);
                this.particles.push(...particles);
            }

            try {
                this.audio.playSFX('correct-sfx');
            } catch (error) {
                console.warn('SFX correct não disponível');
            }
        } else if (option.moral === 'fail') {
            // Partículas vermelhas/escuras
            for (let i = 0; i < 15; i++) {
                const pos = new THREE.Vector3(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 3,
                    -3
                );
                const particles = this.scene.createParticles(pos, 5, 0x8b0000);
                this.particles.push(...particles);
            }
        }

        // Próxima escolha ou conclusão
        this.currentChoice++;
        if (this.currentChoice < this.choices.length) {
            await this.delay(500);
            await this.presentChoice(this.currentChoice);
        } else {
            await this.delay(1000);
            await this.complete();
        }
    }

    async complete() {
        console.log('Fase 4 completa!');

        this.scene.stopAnimation();

        try {
            this.audio.playSFX('victory-sfx');
        } catch (error) {
            console.warn('SFX vitória não disponível');
        }

        // Calcular "pontuação moral"
        const idealChoices = this.userChoices.filter(c => c.moral === 'ideal').length;
        const failChoices = this.userChoices.filter(c => c.moral === 'fail').length;

        // Partículas baseadas no desempenho
        const particleColor = idealChoices >= 2 ? 0x50c878 : 0xc0c0c0;
        for (let i = 0; i < 30; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 3,
                -3
            );
            const particles = this.scene.createParticles(pos, 10, particleColor);
            this.particles.push(...particles);
        }

        await this.delay(1000);

        // Reflexão final (adaptada às escolhas)
        await this.finalReflection(idealChoices, failChoices);

        await UI.hideText(0.5);
        await this.delay(1000);

        await this.showCompletionPortal();

        this.state.completePhase(4, {
            choices: this.userChoices,
            idealChoices,
            failChoices,
            timeCompleted: Date.now()
        });

        // Mensagem final especial (última fase das 4 casas)
        this.showFinalMessage();
    }

    async finalReflection(idealChoices, failChoices) {
        if (this.isDestroyed) return;

        // Reflexão do Chapéu
        await UI.showText(PHASE_DATA.phase4.finalReflection, null, 0.5);
        await this.delay(6000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(800);

        // Versículo
        await UI.showText(PHASE_DATA.phase4.verse, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
    }

    async showCompletionPortal() {
        const geometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x50c878,
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

    showFinalMessage() {
        UI.showText(
            'As quatro casas revelaram seus segredos, Aurora. Coragem, Sabedoria, Lealdade e Fé... todas convergem para um único destino.',
            null,
            1
        );

        this.setTimeout(() => {
            UI.hideText(1);

            this.setTimeout(() => {
                UI.showText(
                    'A jornada continua...',
                    null,
                    2
                );
            }, 1500);
        }, 7000);
    }

    destroy() {
        console.log('Destruindo Fase 4');

        super.destroy();

        // Remover UI de opções se existir
        const optionsContainer = document.getElementById('choice-options');
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
