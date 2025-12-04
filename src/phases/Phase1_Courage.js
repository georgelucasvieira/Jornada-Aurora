import * as THREE from 'three';
import gsap from 'gsap';
import { BasePhase } from './BasePhase.js';
import { Transitions } from '../utils/Transitions.js';
import { UI } from '../utils/UI.js';
import { ASSETS, PHASE_DATA } from '../config/assets.js';

export class Phase1_Courage extends BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        super(sceneManager, audioManager, gameState);

        this.objectsFound = [];
        this.totalObjects = 5;
        this.objectMeshes = {};
        this.particles = [];
        this.progressIndicator = null;

        // Dados dos objetos
        this.objectsData = PHASE_DATA.phase1.objects;

        // Iniciar música IMEDIATAMENTE no constructor (antes do init)
        try {
            this.audio.playMusic('courage-music', { fadeIn: 2000 });
        } catch (error) {
            console.warn('Música courage não disponível:', error);
        }
    }

    async init() {
        console.log('Iniciando Fase 1: Coragem (Gryffindor)');

        // 1. Configurar background
        this.scene.setBackgroundColor('#4a0e0e'); // Vermelho escuro Gryffindor
        // this.scene.setBackground('/assets/textures/gryffindor-room.jpg');

        // 3. Criar cena
        await this.setupScene();

        // 4. Introdução do Chapéu
        await this.hatIntro();

        // 5. Iniciar gameplay
        this.startGameplay();
    }

    async setupScene() {
        // Adicionar luzes para dar atmosfera calorosa
        const warmLight = new THREE.PointLight(0xff9966, 1, 100);
        warmLight.position.set(0, 3, 0);
        this.scene.scene.add(warmLight);
        this.scene.currentObjects.push(warmLight);

        // Criar "lareira" simulada (luz pulsante)
        const fireLight = new THREE.PointLight(0xff6600, 1.5, 50);
        fireLight.position.set(-3, 0, -5);
        this.scene.scene.add(fireLight);
        this.scene.currentObjects.push(fireLight);

        // Animar fogo
        gsap.to(fireLight, {
            intensity: 2,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Criar os 5 objetos
        await this.createObjects();
    }

    async createObjects() {
        const objectTypes = ['sword', 'lion', 'wand', 'scroll', 'gold_key'];
        const positions = [
            { x: -5, y: 0, z: -3 },    // Espada (esquerda)
            { x: 2, y: -1, z: -3 },   // Leão (direita)
            { x: 0, y: -0.5, z: -2 },  // Varinha (centro baixo)
            { x: -1.5, y: 1, z: -4 },  // Pergaminho (esquerda cima)
            { x: 1.5, y: -0.5, z: -4 } // Chave (direita baixo)
        ];

        const rotations = [
            { x: 0, y: 0, z: 0 },    // Espada (esquerda)
            { x: 0, y: 1, z: 0 },   // Leão (direita)
            { x: 0, y: 1, z: 0 },  // Varinha (centro baixo)
            { x: 0, y: 0, z: 0 },  // Pergaminho (esquerda cima)
            { x: 0, y: 0, z: 0 } // Chave (direita baixo)
        ];

        const scales = {
            'sword': 1,
            'lion': 1,
            'wand': 0.1,
            'scroll': 0.01,
            'gold_key': 0.1
        };

        objectTypes.forEach(async (type, index) => {
            // const mesh = this.createObjectMesh(type);
            const mesh = await this.scene.addModel(`/assets/models/phase1/${type}.glb`);
            const pos = positions[index];
            mesh.position.set(pos.x, pos.y, pos.z);
            mesh.scale.setScalar(scales[type]);
            mesh.rotation.set(rotations[index].x, rotations[index].y, rotations[index].z);

            mesh.userData.type = type;
            mesh.userData.found = false;

            this.scene.scene.add(mesh);
            this.scene.currentObjects.push(mesh);
            this.scene.clickableObjects.push(mesh);

            this.objectMeshes[type] = mesh;

            // Animação idle (flutuar suavemente)
            gsap.to(mesh.position, {
                y: pos.y + 0.2,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });

        // Configurar raycaster para cliques
        this.scene.setupRaycaster((object) => this.onObjectClick(object));
    }

    createObjectMesh(type) {
        let geometry, material, mesh;

        switch (type) {
            case 'sword':
                // Espada simples
                const blade = new THREE.BoxGeometry(0.1, 1.5, 0.05);
                const handle = new THREE.BoxGeometry(0.3, 0.2, 0.05);
                material = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });

                mesh = new THREE.Group();
                const bladeMesh = new THREE.Mesh(blade, material);
                const handleMesh = new THREE.Mesh(handle, new THREE.MeshPhongMaterial({ color: 0x8b4513 }));
                handleMesh.position.y = -0.85;

                mesh.add(bladeMesh);
                mesh.add(handleMesh);
                break;

            case 'lion':
                // Leão (esfera com detalhes)
                geometry = new THREE.SphereGeometry(0.4, 32, 32);
                material = new THREE.MeshPhongMaterial({ color: 0xdaa520 });
                mesh = new THREE.Mesh(geometry, material);

                // Juba (spikes)
                for (let i = 0; i < 12; i++) {
                    const spike = new THREE.ConeGeometry(0.1, 0.3, 8);
                    const spikeMesh = new THREE.Mesh(spike, material);
                    const angle = (i / 12) * Math.PI * 2;
                    spikeMesh.position.x = Math.cos(angle) * 0.4;
                    spikeMesh.position.z = Math.sin(angle) * 0.4;
                    spikeMesh.lookAt(0, 0, 0);
                    mesh.add(spikeMesh);
                }
                break;

            case 'wand':
                // Varinha
                geometry = new THREE.CylinderGeometry(0.02, 0.03, 1, 16);
                material = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
                mesh = new THREE.Mesh(geometry, material);

                // Ponta brilhante
                const tip = new THREE.SphereGeometry(0.05, 16, 16);
                const tipMesh = new THREE.Mesh(tip, new THREE.MeshBasicMaterial({ color: 0xffff99 }));
                tipMesh.position.y = 0.5;
                mesh.add(tipMesh);

                // Brilho animado
                gsap.to(tipMesh.material, {
                    opacity: 0.5,
                    duration: 0.5,
                    repeat: -1,
                    yoyo: true
                });
                tipMesh.material.transparent = true;
                break;

            case 'scroll':
                // Pergaminho (cilindro)
                geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 32);
                material = new THREE.MeshPhongMaterial({ color: 0xf4e8d0 });
                mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.z = Math.PI / 2;
                break;

            case 'key':
                // Chave (formato simples)
                const keyBody = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
                const keyHead = new THREE.TorusGeometry(0.15, 0.03, 16, 32);
                material = new THREE.MeshPhongMaterial({ color: 0xffd700 });

                mesh = new THREE.Group();
                const bodyMesh = new THREE.Mesh(keyBody, material);
                const headMesh = new THREE.Mesh(keyHead, material);
                headMesh.position.y = 0.4;
                headMesh.rotation.x = Math.PI / 2;

                mesh.add(bodyMesh);
                mesh.add(headMesh);

                // Rotação constante
                gsap.to(mesh.rotation, {
                    y: Math.PI * 2,
                    duration: 4,
                    repeat: -1,
                    ease: 'none'
                });
                break;

            default:
                geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                material = new THREE.MeshPhongMaterial({ color: 0xffd700 });
                mesh = new THREE.Mesh(geometry, material);
        }

        return mesh;
    }

    async hatIntro() {
        const texts = [
            'Aqui está a Sala Comunal de Gryffindor, onde os corajosos se reúnem.',
            'Mas coragem verdadeira não vem apenas do coração... vem de algo maior.',
            'Procure pelos 5 objetos escondidos nesta sala. Cada um revelará uma verdade sobre a coragem.'
        ];

        // Tocar voz
        // this.audio.playVoice('hatPhase1Intro');

        for (const text of texts) {
            await UI.showText(text);
            await this.delay(2500); // Reduzido de 3000 para 2500
            await UI.hideText(0.3);
            await this.delay(300); // Reduzido de 500 para 300
        }
    }

    startGameplay() {
        // Criar indicador de progresso
        this.progressIndicator = UI.createProgressIndicator(
            this.objectsFound.length,
            this.totalObjects,
            'Objetos Encontrados'
        );

        this.progressIndicator.style.position = 'absolute';
        this.progressIndicator.style.top = '20px';
        this.progressIndicator.style.right = '20px';

        UI.addInteractive(this.progressIndicator);

        // Mostrar dica inicial
        UI.showText('Clique nos objetos dourados para descobrir seus segredos...', null, 0.5);

        setTimeout(() => {
            UI.hideText(0.5);
        }, 4000);
    }

    async onObjectClick(object) {
        const type = object.userData?.type || object.parent?.userData?.type;

        if (!type) return;

        // Verificar se já foi encontrado
        if (this.objectsFound.includes(type)) {
            UI.showToast('Você já encontrou este objeto!', 'info');
            return;
        }

        // Marcar como encontrado
        this.objectsFound.push(type);
        object.userData.found = true;

        // Efeitos visuais e sonoros
        await this.handleObjectFound(type, object);

        // Atualizar progresso
        this.updateProgress();

        // Verificar conclusão
        if (this.objectsFound.length >= this.totalObjects) {
            await this.delay(2000);
            await this.complete();
        }
    }

    async handleObjectFound(type, object) {
        const data = this.objectsData[type];

        // SFX
        try {
            this.audio.playSFX('click-sfx');
        } catch (error) {
            console.warn('SFX click não disponível');
        }

        // Partículas douradas
        const particles = this.scene.createParticles(object.position, 50, 0xffd700);
        this.particles.push(...particles);

        // Animação do objeto (pulsar e brilhar)
        await new Promise(resolve => {
            gsap.to(object.scale, {
                x: 1.3,
                y: 1.3,
                z: 1.3,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
                onComplete: resolve
            });
        });

        // Mostrar texto e versículo
        await UI.showText(data.narration, data.verse, 0.5);

        // Tocar voz do Chapéu para este objeto
        // this.audio.playVoice(`hatPhase1${type.charAt(0).toUpperCase() + type.slice(1)}`);

        // Aguardar leitura
        await this.delay(3000); // Reduzido de 4000 para 3000
        await UI.hideText(0.3); // Reduzido de 0.5 para 0.3
    }

    updateProgress() {
        // Atualizar UI de progresso
        const progressFill = this.progressIndicator.querySelector('.progress-bar-fill');
        const progressCount = this.progressIndicator.querySelector('.progress-count');

        const percentage = (this.objectsFound.length / this.totalObjects) * 100;

        gsap.to(progressFill, {
            width: `${percentage}%`,
            duration: 0.5,
            ease: 'power2.out'
        });

        progressCount.textContent = `${this.objectsFound.length}/${this.totalObjects}`;

        // Animação de celebração
        Transitions.pulse(this.progressIndicator, 1.1, 0.3);
    }

    async complete() {
        console.log('Fase 1 completa!');

        // Parar loop de animação de partículas
        this.scene.stopAnimation();

        // SFX de vitória
        try {
            this.audio.playSFX('victory-sfx');
        } catch (error) {
            console.warn('SFX vitória não disponível');
        }

        // Explosão de partículas
        for (let i = 0; i < 50; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 3,
                -3
            );
            const particles = this.scene.createParticles(pos, 10, 0xffd700);
            this.particles.push(...particles);
        }

        // Mensagem de conclusão
        await UI.showText(PHASE_DATA.phase1.saintMessage, null, 1);

        // Tocar voz final
        // this.audio.playVoice('hatPhase1Complete');

        await this.delay(6000);

        // Mostrar imagem São Jorge (se disponível)
        // TODO: Adicionar imagem

        await UI.hideText(0.5);
        await this.delay(1000);

        // Portal de conclusão
        await this.showCompletionPortal();

        // Salvar progresso
        this.state.completePhase(1, {
            objectsFound: this.objectsFound,
            timeCompleted: Date.now()
        });

        // Solicitar próxima carta
        this.requestNextCard();
    }

    async showCompletionPortal() {
        // Criar portal dourado no centro
        const geometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0
        });

        const portal = new THREE.Mesh(geometry, material);
        portal.position.set(0, 0, -3);
        this.scene.scene.add(portal);
        this.scene.currentObjects.push(portal);

        // Animação do portal
        gsap.to(portal.material, {
            opacity: 0.8,
            duration: 1
        });

        gsap.to(portal.rotation, {
            z: Math.PI * 2,
            duration: 3,
            repeat: -1,
            ease: 'none'
        });

        gsap.to(portal.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 2,
            ease: 'back.out(1.7)'
        });

        await UI.showText('Um portal se abriu... A próxima etapa da jornada aguarda.', null, 1);
        await this.delay(3000);
        await UI.hideText(0.5);
    }

    requestNextCard() {
        UI.showText(
            'Pegue a segunda carta de Edwiges para continuar.',
            null,
            1
        );

        setTimeout(() => {
            const game = window.game;
            if (game) {
                game.showCardModal();
            }
        }, 2000);
    }

    // delay() agora vem da BasePhase

    destroy() {
        console.log('Destruindo Fase 1');

        // Chamar cleanup da classe base (cancela timers e animações)
        super.destroy();

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

        // Limpar UI
        UI.clearInteractive();
        UI.hideText(0);
    }
}
