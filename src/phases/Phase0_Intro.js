import * as THREE from 'three';
import { BasePhase } from './BasePhase.js';
import { UI } from '../utils/UI.js';

export class Phase0_Intro extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.letter = null;
        this.sortingHat = null;
        this.particles = [];
    }

    async init() {
        console.log('Iniciando Fase 0: Prólogo');

        // 1. Configurar cena
        // this.scene.setBackgroundColor('#2c2c2c');
        this.scene.setBackground('/assets/textures/phase0-bg.png');

        // 2. Tocar música de fundo (se disponível)
        try {
            this.audio.playMusic('intro-music', { fadeIn: 3000 });
        } catch (error) {
            console.warn('Música não disponível:', error);
        }

        // 3. Sequência de introdução
        await this.introSequence();
    }

    async introSequence() {
        // Aguardar brevemente antes de começar
        await this.delay(300);
        if (this.isDestroyed) return;

        // Passo 1: Som de coruja (se disponível)
        try {
            this.audio.playSFX('owl-sfx');
        } catch (error) {
            console.warn('SFX coruja não disponível');
        }
        await this.delay(500);
        if (this.isDestroyed) return;

        // Passo 2: Criar e animar carta voando
        await this.animateLetter();
        if (this.isDestroyed) return;

        // Passo 3: Carta se abre e mostra texto
        await this.openLetter();
        if (this.isDestroyed) return;

        // Passo 4: Aparição do Chapéu Seletor
        await this.summonSortingHat();
        if (this.isDestroyed) return;

        // Passo 5: Narração do Chapéu
        await this.hatNarration();
        if (this.isDestroyed) return;

        // Passo 6: Solicitar primeira carta
        this.requestFirstCard();
    }

    async animateLetter() {
        // Guard: se fase foi destruída, cancelar
        if (this.isDestroyed) return;

        // Criar carta como sprite 2D (placeholder)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Desenhar envelope simples
        ctx.fillStyle = '#f4e8d0';
        ctx.fillRect(0, 0, 256, 128);
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 256, 128);

        // Lacre
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.arc(128, 64, 20, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const geometry = new THREE.PlaneGeometry(2, 1);

        this.letter = new THREE.Mesh(geometry, material);
        this.letter.position.set(0, -5, -3);
        this.scene.scene.add(this.letter);

        // Animação: carta voa para o centro
        await new Promise(resolve => {
            this.gsapTo(this.letter.position, {
                y: 0,
                duration: 2,
                ease: 'power2.out',
                onComplete: resolve
            });

            this.gsapTo(this.letter.rotation, {
                z: Math.PI * 0.1,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        });

        // Guard novamente após async
        if (this.isDestroyed) return;
    }

    async openLetter() {
        // Guard: se fase foi destruída, cancelar
        if (this.isDestroyed) return;

        // Animação da carta abrindo (rotação)
        await new Promise(resolve => {
            this.gsapTo(this.letter.rotation, {
                x: Math.PI * 2,
                duration: 1,
                ease: 'power2.in',
                onComplete: resolve
            });
        });

        // Guard novamente após async
        if (this.isDestroyed) return;

        // Criar partículas douradas
        this.createMagicParticles(this.letter.position);

        // Mostrar texto da carta
        await UI.showText(
            'Prezada Aurora, você foi aceita para uma jornada extraordinária...',
            null,
            1
        );

        // Guard novamente após async
        if (this.isDestroyed) return;

        await this.delay(3000);

        // Guard novamente após async
        if (this.isDestroyed) return;

        // Carta desaparece
        await new Promise(resolve => {
            this.gsapTo(this.letter.material, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    this.scene.scene.remove(this.letter);
                    resolve();
                }
            });
        });

        // Guard novamente após async
        if (this.isDestroyed) return;

        await UI.hideText(0.5);
    }

    async summonSortingHat() {
        // Guard: se fase foi destruída, cancelar
        if (this.isDestroyed) return;

        // Carregar modelo 3D real do Chapéu Seletor
        try {
            this.sortingHat = await this.scene.addModel('/assets/models/sorting-hat.glb', {
                position: [0, 0, -3],
                scale: [0, 0, 0] // Começar invisível para animação
            });

            // Guard novamente após async
            if (this.isDestroyed) return;

            console.log('Chapéu Seletor carregado:', this.sortingHat);

            // Partículas ao aparecer
            this.createMagicParticles(new THREE.Vector3(0, 0, -3));

            // Animação de aparição usando BasePhase
            await new Promise(resolve => {
                this.gsapTo(this.sortingHat.scale, {
                    x: 5.0,
                    y: 5.0,
                    z: 5.0,
                    duration: 1.5,
                    ease: 'back.out(1.7)',
                    onComplete: resolve
                });
            });

            // Guard novamente
            if (this.isDestroyed) return;

            // Animação idle (balançar suavemente)
            this.gsapTo(this.sortingHat.rotation, {
                z: Math.PI * 0.05,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

        } catch (error) {
            console.error('Erro ao carregar Chapéu Seletor:', error);
            // Fallback: criar cone simples
            const geometry = new THREE.ConeGeometry(0.5, 1.5, 32);
            const material = new THREE.MeshPhongMaterial({
                color: 0x4a3520,
                shininess: 10
            });

            this.sortingHat = new THREE.Mesh(geometry, material);
            this.sortingHat.position.set(0, 0, -3);
            this.sortingHat.rotation.z = Math.PI * 0.1;
            this.sortingHat.scale.set(0, 0, 0);

            this.scene.scene.add(this.sortingHat);
            this.scene.currentObjects.push(this.sortingHat);

            // Animação de aparição
            await new Promise(resolve => {
                this.gsapTo(this.sortingHat.scale, {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    duration: 1.5,
                    ease: 'back.out(1.7)',
                    onComplete: resolve
                });
            });

            // Animação idle
            this.gsapTo(this.sortingHat.rotation, {
                z: -Math.PI * 0.05,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        }
    }

    async hatNarration() {
        const dialogues = [
            {
                text: 'Bem-vinda, Aurora.',
                duration: 2000
            },
            {
                text: 'Sou o Chapéu Seletor, e serei eu quem guiará você nesta jornada extraordinária.',
                duration: 4000
            },
            {
                text: 'Você foi escolhida para uma missão especial... uma jornada que testará sua coragem, sabedoria, lealdade e fé.',
                duration: 5000
            },
            {
                text: 'Ao longo do caminho, você descobrirá verdades profundas sobre o amor que vence a morte.',
                duration: 4500
            },
            {
                text: 'Está pronta?',
                duration: 2000
            },
            {
                text: 'Então vamos começar.',
                duration: 2500
            }
        ];

        for (const dialogue of dialogues) {
            // Tocar voz para cada diálogo (placeholder até dublar frase por frase)
            try {
                this.audio.playVoice('hat-phase0-voice-0');
            } catch (error) {
                console.warn('Voice hat-intro não disponível:', error);
            }

            await UI.showText(dialogue.text);

            // Animação do chapéu "falando"
            this.animateHatTalking();

            await this.delay(dialogue.duration);
            await UI.hideText(0.3);
            await this.delay(500);
        }
    }

    animateHatTalking() {
        // Pequena animação de "boca" (balançar)
        this.gsapTo(this.sortingHat.rotation, {
            z: Math.PI * 0.15,
            duration: 0.1,
            repeat: 5,
            yoyo: true
        });
    }

    requestFirstCard() {
        // Mostrar instrução final
        UI.showText(
            'Pegue a primeira carta de Edwiges e insira o código para começar sua jornada.',
            null,
            1
        );

        // Abrir modal de input de carta (já existe no main.js)
        this.setTimeout(() => {
            const game = window.game;
            if (game) {
                game.showCardModal();
            }
        }, 2000);
    }

    createMagicParticles(position) {
        const particleCount = 200;
        const particles = this.scene.createParticles(position, particleCount, 0xffd700);
        this.particles.push(...particles);
    }

    // delay() agora vem da BasePhase

    destroy() {
        console.log('Destruindo Fase 0');

        // Chamar cleanup da classe base (cancela timers e animações)
        super.destroy();

        // Remover carta explicitamente (se ainda existir)
        if (this.letter) {
            this.scene.scene.remove(this.letter);
            if (this.letter.geometry) this.letter.geometry.dispose();
            if (this.letter.material) {
                if (this.letter.material.map) this.letter.material.map.dispose();
                this.letter.material.dispose();
            }
            this.letter = null;
        }

        // Remover chapéu explicitamente (se ainda existir)
        if (this.sortingHat) {
            this.scene.scene.remove(this.sortingHat);
            if (this.sortingHat.geometry) this.sortingHat.geometry.dispose();
            if (this.sortingHat.material) this.sortingHat.material.dispose();
            this.sortingHat = null;
        }

        // Parar música
        // this.audio.stopMusic(1000);

        // Limpar partículas
        this.particles.forEach(p => {
            this.scene.scene.remove(p);
            if (p.geometry) p.geometry.dispose();
            if (p.material) p.material.dispose();
        });

        // Limpar cena
        this.scene.clear();

        // Esconder UI
        UI.hideText(0);
    }
}
