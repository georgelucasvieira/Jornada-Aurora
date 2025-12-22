import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';
import { PHASE_DATA } from '../config/assets.js';

export class Phase3_Loyalty extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.eventsData = PHASE_DATA.phase3.events;
        this.currentOrder = [];
        this.draggedElement = null;
        this.particles = [];

        // Iniciar música (usa courage-music como fallback)
        const music = this.audio.playMusic('loyalty-music', { fadeIn: 2000 });
        if (!music) {
            console.warn('Música loyalty não disponível, usando courage-music');
            this.audio.playMusic('courage-music', { fadeIn: 2000 });
        }
    }

    async init() {
        console.log('Iniciando Fase 3: Lealdade (Hufflepuff)');

        // Background amarelo/preto
        this.scene.setBackgroundColor('#2b1f0a');

        // Criar cena
        await this.setupScene();

        // Iniciar puzzle
        await this.startPuzzle();
    }

    async setupScene() {
        // Luz âmbar
        const warmLight = new THREE.AmbientLight(0xffcc66, 0.6);
        this.scene.scene.add(warmLight);
        this.scene.currentObjects.push(warmLight);

        // Luz pontual dourada
        const sunLight = new THREE.PointLight(0xffdd55, 1.2, 100);
        sunLight.position.set(2, 3, -4);
        this.scene.scene.add(sunLight);
        this.scene.currentObjects.push(sunLight);

        // Texugo ou planta (símbolo Hufflepuff)
        try {
            const badger = await this.scene.addModel('/assets/models/phase3/badger.glb', {
                position: [0, 0, -4],
                scale: [0.8, 0.8, 0.8]
            });
        } catch (error) {
            console.warn('Modelo do texugo não disponível, criando placeholder');
            // Criar texugo placeholder (esfera dourada)
            const geometry = new THREE.SphereGeometry(0.4, 32, 32);
            const material = new THREE.MeshPhongMaterial({ color: 0xffdd55 });
            const badger = new THREE.Mesh(geometry, material);
            badger.position.set(0, 0, -4);
            this.scene.scene.add(badger);
            this.scene.currentObjects.push(badger);

            // Animação idle
            this.gsapTo(badger.position, {
                y: 0.3,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

    async startPuzzle() {
        if (this.isDestroyed) return;

        // Introdução
        await UI.showText("Ordene os eventos da vida de São José cronologicamente...", null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(500);

        // Criar UI de drag-and-drop
        this.createDragDropUI();
    }

    createDragDropUI() {
        // Container principal
        const container = document.createElement('div');
        container.id = 'drag-drop-container';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 800px;
            z-index: 100;
        `;

        // Área de itens (embaralhados)
        const itemsArea = document.createElement('div');
        itemsArea.id = 'items-area';
        itemsArea.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(43, 31, 10, 0.8);
            border: 2px solid #ffdd55;
            border-radius: 10px;
            min-height: 150px;
        `;

        // Embaralhar eventos
        const shuffled = [...this.eventsData].sort(() => Math.random() - 0.5);

        shuffled.forEach((event, index) => {
            const card = this.createEventCard(event, index);
            itemsArea.appendChild(card);
        });

        // Área de ordenação (slots)
        const slotsArea = document.createElement('div');
        slotsArea.id = 'slots-area';
        slotsArea.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background: rgba(255, 221, 85, 0.1);
            border: 2px dashed #ffdd55;
            border-radius: 10px;
            min-height: 300px;
        `;

        for (let i = 0; i < this.eventsData.length; i++) {
            const slot = this.createSlot(i + 1);
            slotsArea.appendChild(slot);
        }

        // Botão de verificar
        const checkButton = document.createElement('button');
        checkButton.textContent = 'Verificar Ordem';
        checkButton.style.cssText = `
            margin-top: 20px;
            padding: 15px 40px;
            background: #ffdd55;
            color: #2b1f0a;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        `;

        checkButton.addEventListener('mouseenter', () => {
            checkButton.style.transform = 'scale(1.05)';
        });

        checkButton.addEventListener('mouseleave', () => {
            checkButton.style.transform = 'scale(1)';
        });

        checkButton.addEventListener('click', () => this.checkOrder());

        container.appendChild(itemsArea);
        container.appendChild(slotsArea);
        container.appendChild(checkButton);
        document.body.appendChild(container);
    }

    createEventCard(event, index) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.eventId = event.id;
        card.draggable = true;
        card.style.cssText = `
            padding: 15px;
            background: rgba(255, 221, 85, 0.9);
            border: 2px solid #ffcc66;
            border-radius: 8px;
            cursor: grab;
            color: #2b1f0a;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s;
            min-width: 200px;
        `;

        card.textContent = event.text;

        // Drag events
        card.addEventListener('dragstart', (e) => {
            card.style.opacity = '0.5';
            card.style.cursor = 'grabbing';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('eventId', event.id);
        });

        card.addEventListener('dragend', (e) => {
            card.style.opacity = '1';
            card.style.cursor = 'grab';
        });

        return card;
    }

    createSlot(position) {
        const slot = document.createElement('div');
        slot.className = 'event-slot';
        slot.dataset.position = position;
        slot.style.cssText = `
            padding: 20px;
            background: rgba(255, 221, 85, 0.1);
            border: 2px dashed #ffdd55;
            border-radius: 8px;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffdd55;
            font-size: 14px;
            transition: all 0.3s;
        `;

        slot.innerHTML = `<span style="opacity: 0.5;">Posição ${position}</span>`;

        // Drop events
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            slot.style.background = 'rgba(255, 221, 85, 0.3)';
            slot.style.borderStyle = 'solid';
        });

        slot.addEventListener('dragleave', (e) => {
            slot.style.background = 'rgba(255, 221, 85, 0.1)';
            slot.style.borderStyle = 'dashed';
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            const eventId = parseInt(e.dataTransfer.getData('eventId'));
            const card = document.querySelector(`[data-event-id="${eventId}"]`);

            if (card) {
                // Remover card anterior do slot se existir
                const existingCard = slot.querySelector('.event-card');
                if (existingCard) {
                    document.getElementById('items-area').appendChild(existingCard);
                }

                // Adicionar novo card ao slot
                slot.innerHTML = '';
                slot.appendChild(card);
            }

            slot.style.background = 'rgba(255, 221, 85, 0.1)';
            slot.style.borderStyle = 'dashed';
        });

        return slot;
    }

    async checkOrder() {
        // Coletar ordem atual
        const slots = document.querySelectorAll('.event-slot');
        const currentOrder = [];

        slots.forEach((slot, index) => {
            const card = slot.querySelector('.event-card');
            if (card) {
                currentOrder.push({
                    position: index + 1,
                    eventId: parseInt(card.dataset.eventId)
                });
            }
        });

        // Verificar se todos os slots estão preenchidos
        if (currentOrder.length !== this.eventsData.length) {
            await UI.showText("Preencha todas as posições antes de verificar.", null, 0.5);
            await this.delay(2000);
            await UI.hideText(0.3);
            return;
        }

        // Verificar se está correto
        let isCorrect = true;
        for (let i = 0; i < currentOrder.length; i++) {
            const event = this.eventsData.find(e => e.id === currentOrder[i].eventId);
            if (event.correctOrder !== currentOrder[i].position) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            await this.onCorrectOrder();
        } else {
            await this.onWrongOrder();
        }
    }

    async onCorrectOrder() {
        // Remover UI
        const container = document.getElementById('drag-drop-container');
        if (container) {
            container.remove();
        }

        // SFX
        try {
            this.audio.playSFX('correct-sfx');
        } catch (error) {
            console.warn('SFX correct não disponível');
        }

        await UI.showText("Perfeito! A jornada de São José está completa.", null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(500);

        // Animação da árvore crescendo
        await this.growTree();

        // Pergunta moral
        await this.moralChoice();
    }

    async onWrongOrder() {
        try {
            this.audio.playSFX('wrong-sfx');
        } catch (error) {
            console.warn('SFX wrong não disponível');
        }

        await UI.showText("Não está certo... tente novamente.", null, 0.5);
        await this.delay(2000);
        await UI.hideText(0.3);
    }

    async growTree() {
        // Criar árvore (placeholder)
        const geometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        const material = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
        const tree = new THREE.Mesh(geometry, material);
        tree.position.set(0, -2, -3);
        tree.scale.y = 0;
        this.scene.scene.add(tree);
        this.scene.currentObjects.push(tree);

        // Animar crescimento
        await new Promise(resolve => {
            this.gsapTo(tree.scale, {
                y: 1,
                duration: 2,
                ease: 'power2.out',
                onComplete: resolve
            });

            this.gsapTo(tree.position, {
                y: 0,
                duration: 2,
                ease: 'power2.out'
            });
        });

        await UI.showText("A fidelidade dá frutos...", null, 0.5);
        await this.delay(2500);
        await UI.hideText(0.3);
    }

    async moralChoice() {
        if (this.isDestroyed) return;

        const choice = PHASE_DATA.phase3.moralChoice;

        // Mostrar pergunta
        await UI.showText(choice.question, null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;

        // Criar UI de escolha
        this.showMoralChoiceUI(choice);
    }

    showMoralChoiceUI(choice) {
        const container = document.createElement('div');
        container.id = 'moral-choice-container';
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

        choice.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.style.cssText = `
                padding: 15px 30px;
                background: rgba(255, 221, 85, 0.8);
                border: 2px solid #ffdd55;
                color: #2b1f0a;
                font-size: 18px;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(255, 221, 85, 1)';
                button.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(255, 221, 85, 0.8)';
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('click', () => {
                this.handleMoralChoice(index, choice);
            });

            container.appendChild(button);
        });

        document.body.appendChild(container);
    }

    async handleMoralChoice(selectedIndex, choice) {
        // Remover UI
        const container = document.getElementById('moral-choice-container');
        if (container) {
            container.remove();
        }

        await UI.hideText(0.3);
        await this.delay(500);
        if (this.isDestroyed) return;

        // Mostrar explicação
        await UI.showText(choice.explanation, null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(800);

        // Completar fase
        await this.complete();
    }

    async complete() {
        console.log('Fase 3 completa!');

        this.scene.stopAnimation();

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
            const particles = this.scene.createParticles(pos, 10, 0xffdd55);
            this.particles.push(...particles);
        }

        await this.delay(1000);

        // Reflexão final
        await this.finalReflection();

        await UI.hideText(0.5);
        await this.delay(1000);

        await this.showCompletionPortal();

        this.state.completePhase(3, {
            completed: true,
            timeCompleted: Date.now()
        });

        this.requestNextCard();
    }

    async finalReflection() {
        if (this.isDestroyed) return;

        await UI.showText(PHASE_DATA.phase3.finalReflection, null, 0.5);
        await this.delay(6000);
        if (this.isDestroyed) return;
        await UI.hideText(0.3);
        await this.delay(800);

        await UI.showText(PHASE_DATA.phase3.verse, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;
    }

    async showCompletionPortal() {
        const geometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffdd55,
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
            'Pegue a quarta carta de Edwiges.',
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
        console.log('Destruindo Fase 3');

        super.destroy();

        // Remover UIs
        const dragDrop = document.getElementById('drag-drop-container');
        if (dragDrop) dragDrop.remove();

        const moralChoice = document.getElementById('moral-choice-container');
        if (moralChoice) moralChoice.remove();

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
