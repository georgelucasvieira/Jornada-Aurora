import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';
import { PHASE_DATA } from '../config/assets.js';

export class Phase8_Grace extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.particles = [];

        // Música tensa (usa courage-music como fallback)
        const music = this.audio.playMusic('grace-music', { fadeIn: 2000 });
        if (!music) {
            console.warn('Música grace não disponível, usando courage-music');
            this.audio.playMusic('courage-music', { fadeIn: 2000 });
        }
    }

    async init() {
        console.log('Iniciando Fase 8: A Graça (O Confronto Final)');

        // Background muito escuro
        this.scene.setBackgroundColor('#050505');

        // Criar cena
        await this.setupScene();

        // Introdução de Voldemort
        await this.voldemortIntro();

        // Enigma impossível
        await this.impossibleEnigma();
    }

    async setupScene() {
        // Luz quase nula
        const ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.1);
        this.scene.scene.add(ambientLight);
        this.scene.currentObjects.push(ambientLight);

        // Criar silhueta de Voldemort (figura escura ameaçadora)
        await this.createVoldemortSilhouette();

        // Varinha verde (ponto de luz verde apontando)
        this.createWand();
    }

    async createVoldemortSilhouette() {
        // Figura humanoide simples (placeholder)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.2, 1.5, 8);
        const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);

        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.9
        });

        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.set(0, 0.5, -4);

        const head = new THREE.Mesh(headGeometry, material.clone());
        head.position.set(0, 1.5, -4);

        this.scene.scene.add(body);
        this.scene.scene.add(head);
        this.scene.currentObjects.push(body, head);

        // Olhos vermelhos
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.08, 1.55, -3.75);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial.clone());
        rightEye.position.set(0.08, 1.55, -3.75);

        this.scene.scene.add(leftEye, rightEye);
        this.scene.currentObjects.push(leftEye, rightEye);

        // Pulsação dos olhos
        this.gsapTo(leftEye.material, {
            emissiveIntensity: 2,
            duration: 1,
            repeat: -1,
            yoyo: true
        });

        this.gsapTo(rightEye.material, {
            emissiveIntensity: 2,
            duration: 1,
            repeat: -1,
            yoyo: true
        });
    }

    createWand() {
        // Varinha (cilindro fino)
        const geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0x2d2d2d });
        const wand = new THREE.Mesh(geometry, material);

        wand.position.set(0.3, 1.2, -3.8);
        wand.rotation.z = -Math.PI / 4;

        this.scene.scene.add(wand);
        this.scene.currentObjects.push(wand);

        // Luz verde na ponta
        this.wandLight = new THREE.PointLight(0x00ff00, 0, 10);
        this.wandLight.position.set(0.5, 1.4, -3.8);
        this.scene.scene.add(this.wandLight);
        this.scene.currentObjects.push(this.wandLight);
    }

    async voldemortIntro() {
        if (this.isDestroyed) return;

        // Silêncio inicial
        await this.delay(3000);

        await UI.showText(PHASE_DATA.phase8.voldemortIntro, null, 0.5);
        await this.delay(5000);
        if (this.isDestroyed) return;

        await UI.hideText(0.3);
        await this.delay(5000); // 5s de silêncio antes do enigma

        if (this.isDestroyed) return;

        await UI.showText(PHASE_DATA.phase8.enigmaIntro, null, 0.5);
        await this.delay(3000);
        if (this.isDestroyed) return;
    }

    async impossibleEnigma() {
        if (this.isDestroyed) return;

        // Criar UI do enigma impossível
        this.createEnigmaUI();
        this.startCountdown();
    }

    createEnigmaUI() {
        const container = document.createElement('div');
        container.id = 'enigma-container';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(5, 5, 5, 0.95);
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 40px;
            z-index: 100;
            max-width: 600px;
        `;

        // Símbolos alquímicos falsos
        const symbols = ['☿', '♃', '♂', '♀', '♄', '☉', '☽', '⚕', '☥', '✡', '☪', '☬'];
        const runas = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'];

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        `;

        // Slots vazios (destino)
        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'enigma-slot';
            slot.style.cssText = `
                border: 2px dashed #00ff00;
                border-radius: 10px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                color: #00ff00;
            `;
            grid.appendChild(slot);
        }

        container.appendChild(grid);

        // Símbolos arrastáveis (impossível saber qual vai onde)
        const symbolsGrid = document.createElement('div');
        symbolsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
        `;

        [...symbols, ...runas].forEach(symbol => {
            const btn = document.createElement('div');
            btn.textContent = symbol;
            btn.draggable = true;
            btn.style.cssText = `
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff00;
                border-radius: 8px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                color: #00ff00;
                cursor: grab;
                transition: all 0.3s;
            `;

            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(0, 255, 0, 0.3)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(0, 255, 0, 0.1)';
            });

            symbolsGrid.appendChild(btn);
        });

        container.appendChild(symbolsGrid);

        // Mensagem confusa
        const hint = document.createElement('div');
        hint.textContent = 'Arraste os símbolos corretos para os slots na ordem certa...';
        hint.style.cssText = `
            margin-top: 20px;
            color: #00ff00;
            text-align: center;
            font-size: 14px;
            opacity: 0.7;
        `;
        container.appendChild(hint);

        document.body.appendChild(container);
    }

    startCountdown() {
        const timerEl = document.createElement('div');
        timerEl.id = 'final-timer';
        timerEl.textContent = '60';
        timerEl.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 60px;
            color: #ff0000;
            font-weight: bold;
            z-index: 100;
            text-shadow: 0 0 20px rgba(255, 0, 0, 1);
        `;

        document.body.appendChild(timerEl);

        let timeLeft = PHASE_DATA.phase8.enigmaDuration;

        const interval = setInterval(() => {
            if (this.isDestroyed) {
                clearInterval(interval);
                timerEl.remove();
                return;
            }

            timeLeft--;
            timerEl.textContent = timeLeft;

            // Batida cardíaca
            if (timeLeft <= 10) {
                timerEl.style.fontSize = timeLeft % 2 === 0 ? '70px' : '60px';

                // Música para
                if (timeLeft === 10) {
                    this.audio.stopMusic(500);
                }

                // Varinha brilha
                if (timeLeft === 8 && this.wandLight) {
                    this.gsapTo(this.wandLight, {
                        intensity: 2,
                        duration: 1
                    });
                }

                if (timeLeft === 5 && this.wandLight) {
                    this.gsapTo(this.wandLight, {
                        intensity: 5,
                        duration: 1
                    });
                }

                // "Avada..."
                if (timeLeft === 3) {
                    UI.showText("Avada...", null, 0);
                }

                // "...Kedavra!"
                if (timeLeft === 1) {
                    UI.hideText(0);
                    this.setTimeout(() => {
                        UI.showText("...Kedavra!", null, 0);
                    }, 100);
                }
            }

            if (timeLeft <= 0) {
                clearInterval(interval);
                timerEl.remove();
                this.avadaKedavra();
            }
        }, 1000);
    }

    async avadaKedavra() {
        if (this.isDestroyed) return;

        // FLASH VERDE TOTAL
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #00ff00;
            z-index: 9999;
        `;
        document.body.appendChild(flash);

        // Som (usar click ou victory como placeholder)
        try {
            this.audio.playSFX('victory-sfx', { rate: 0.5 });
        } catch (error) {
            console.warn('SFX não disponível');
        }

        await this.delay(1000);

        // Fade to black
        this.gsapTo(flash, {
            opacity: 0,
            duration: 2,
            onComplete: () => flash.remove()
        });

        // Limpar tudo
        const enigma = document.getElementById('enigma-container');
        if (enigma) enigma.remove();

        UI.hideText(0);

        await this.delay(3000);

        // SILÊNCIO ABSOLUTO (10s - morte, vazio)
        this.scene.setBackgroundColor('#000000');

        await this.delay(10000);

        // RESSURREIÇÃO
        await this.resurrection();
    }

    async resurrection() {
        if (this.isDestroyed) return;

        // Luz dourada começa a aparecer
        const lightGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0
        });

        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(0, 0, -3);
        this.scene.scene.add(light);
        this.scene.currentObjects.push(light);

        // Luz expande
        this.gsapTo(lightMaterial, {
            opacity: 1,
            duration: 5,
            ease: 'power1.out'
        });

        this.gsapTo(light.scale, {
            x: 3,
            y: 3,
            z: 3,
            duration: 5,
            ease: 'power1.out'
        });

        // Background vai clareando (mais lento)
        await this.delay(4000);

        this.scene.setBackgroundColor('#1a1410');

        await this.delay(3000); // Mais pausa antes da revelação

        // Revelação
        await this.revelation();
    }

    async revelation() {
        if (this.isDestroyed) return;

        // Revelar linha por linha (mais devagar)
        for (const line of PHASE_DATA.phase8.revelation) {
            if (this.isDestroyed) return;

            if (line === '') {
                await this.delay(2000); // Mais pausa em linhas vazias
                continue;
            }

            await UI.showText(line, null, 0.5);
            await this.delay(4000); // Mais tempo em cada linha
            await UI.hideText(0.3);
            await this.delay(1500); // Mais silêncio entre linhas
        }

        await this.delay(4000); // Mais pausa antes da mensagem principal

        // Mensagem principal
        await this.mainMessage();
    }

    async mainMessage() {
        if (this.isDestroyed) return;

        for (const line of PHASE_DATA.phase8.message) {
            if (this.isDestroyed) return;

            if (line === '') {
                await this.delay(2500); // Mais silêncio entre linhas
                continue;
            }

            await UI.showText(line, null, 0.5);
            await this.delay(5000); // Mais tempo por linha
            await UI.hideText(0.3);
            await this.delay(1200); // Mais pausa
        }

        await this.delay(4000); // Mais silêncio antes do versículo

        // Versículo
        await UI.showText(PHASE_DATA.phase8.verse, null, 0.5);
        await this.delay(8000);
        if (this.isDestroyed) return;
        await UI.hideText(0.5);
        await this.delay(4000); // Mais pausa antes da mensagem final

        // Mensagem final
        await this.finalMessage();
    }

    async finalMessage() {
        if (this.isDestroyed) return;

        // Background claro
        this.scene.setBackgroundColor('#ffd700');

        // Explosão de luz
        for (let i = 0; i < 100; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                -5 + Math.random() * 5
            );
            const particles = this.scene.createParticles(pos, 20, 0xffffff);
            this.particles.push(...particles);
        }

        // Vitória!
        try {
            this.audio.playMusic('victory-sfx', { fadeIn: 1000, volume: 0.8, loop: false });
        } catch (error) {
            console.warn('Música vitória não disponível');
        }

        await this.delay(3000); // Mais pausa inicial

        for (const line of PHASE_DATA.phase8.finalMessage) {
            if (this.isDestroyed) return;

            if (line === '') {
                await this.delay(2500); // Mais silêncio
                continue;
            }

            await UI.showText(line, null, 0.5);
            await this.delay(5500); // Mais tempo por linha
            await UI.hideText(0.3);
            await this.delay(1000); // Mais pausa
        }

        await this.delay(3000);

        // Completar jornada
        await this.complete();
    }

    async complete() {
        console.log('JORNADA COMPLETA!');

        // Salvar progresso final
        this.state.completePhase(8, {
            journeyComplete: true,
            timeCompleted: Date.now()
        });

        // Botão "Revelar Segredo" ou fim
        this.showFinalButton();
    }

    showFinalButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Fim da Jornada';
        btn.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            padding: 20px 60px;
            background: #ffd700;
            color: #1a1410;
            border: none;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            z-index: 101;
            transition: all 0.3s;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateX(-50%) scale(1.1)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateX(-50%) scale(1)';
        });

        btn.addEventListener('click', () => {
            // Poderia mostrar vídeo/mensagem especial
            // Por enquanto, apenas feedback
            UI.showText('Obrigado por jogar, Aurora. ❤️', null, 1);
        });

        document.body.appendChild(btn);
    }

    destroy() {
        console.log('Destruindo Fase 8');

        super.destroy();

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
