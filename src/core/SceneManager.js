import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class SceneManager {
    constructor(canvasId = 'three-canvas') {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Arrays para gerenciar objetos da cena
        this.currentObjects = [];
        this.clickableObjects = [];

        // Raycaster para interação com cliques
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // GLTF Loader
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();

        // Posição inicial da câmera
        this.camera.position.z = 5;

        // Iluminação padrão
        this.setupDefaultLighting();

        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());

        // Animation loop
        this.clock = new THREE.Clock();
        this.isAnimating = false;
    }

    setupDefaultLighting() {
        // Luz ambiente suave
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Luz direcional principal
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);
    }

    clear() {
        // Remove todos os objetos da cena (exceto luzes)
        this.currentObjects.forEach(obj => {
            this.scene.remove(obj);

            // Dispose de geometria e materiais para liberar memória
            if (obj.geometry) obj.geometry.dispose();

            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(material => material.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });

        this.currentObjects = [];
        this.clickableObjects = [];
    }

    setBackground(imagePath) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                imagePath,
                (texture) => {
                    this.scene.background = texture;
                    resolve(texture);
                },
                undefined,
                (error) => {
                    console.error('Erro ao carregar background:', error);
                    reject(error);
                }
            );
        });
    }

    setBackgroundColor(color) {
        this.scene.background = new THREE.Color(color);
    }

    addModel(modelPath, options = {}) {
        const {
            position = [0, 0, 0],
            rotation = [0, 0, 0],
            scale = [1, 1, 1],
            clickable = false
        } = options;

        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                modelPath,
                (gltf) => {
                    const model = gltf.scene;

                    model.position.set(...position);
                    model.rotation.set(...rotation);
                    model.scale.set(...scale);

                    this.scene.add(model);
                    this.currentObjects.push(model);

                    if (clickable) {
                        this.clickableObjects.push(model);
                    }

                    resolve(model);
                },
                undefined,
                (error) => {
                    console.error('Erro ao carregar modelo:', error);
                    reject(error);
                }
            );
        });
    }

    addMesh(geometry, material, options = {}) {
        const {
            position = [0, 0, 0],
            rotation = [0, 0, 0],
            scale = [1, 1, 1],
            clickable = false
        } = options;

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(...position);
        mesh.rotation.set(...rotation);
        mesh.scale.set(...scale);

        this.scene.add(mesh);
        this.currentObjects.push(mesh);

        if (clickable) {
            this.clickableObjects.push(mesh);
        }

        return mesh;
    }

    setupRaycaster(onClickCallback) {
        const handleClick = (event) => {
            // Calcula posição do mouse normalizada (-1 a +1)
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Atualiza raycaster
            this.raycaster.setFromCamera(this.mouse, this.camera);

            // Verifica interseções com objetos clicáveis
            const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);

            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;

                // Procura o objeto pai original (pode estar em hierarquia)
                let targetObject = clickedObject;
                while (targetObject.parent && !this.clickableObjects.includes(targetObject)) {
                    targetObject = targetObject.parent;
                }

                onClickCallback(targetObject, intersects[0]);
            }
        };

        window.addEventListener('click', handleClick);

        // Retorna função para remover listener se necessário
        return () => window.removeEventListener('click', handleClick);
    }

    createParticles(position, count = 20, color = 0xffd700) {
        const particles = [];
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color });

        for (let i = 0; i < count; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);

            particle.position.copy(position);

            // Velocidade aleatória
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                Math.random() * 0.15,
                (Math.random() - 0.5) * 0.1
            );

            particle.userData.life = 1.0;
            particle.userData.decay = Math.random() * 0.01 + 0.01;

            this.scene.add(particle);
            particles.push(particle);
        }

        return particles;
    }

    updateParticles(particles) {
        particles.forEach((particle, index) => {
            if (particle.userData.life > 0) {
                // Aplica gravidade e movimento
                particle.userData.velocity.y -= 0.002;
                particle.position.add(particle.userData.velocity);

                // Diminui vida
                particle.userData.life -= particle.userData.decay;

                // Fade out
                particle.material.opacity = particle.userData.life;
                particle.material.transparent = true;
            } else {
                // Remove partícula morta
                this.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
                particles.splice(index, 1);
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    startAnimation(callback) {
        if (this.isAnimating) return;

        this.isAnimating = true;

        const animate = () => {
            if (!this.isAnimating) return;

            requestAnimationFrame(animate);

            const delta = this.clock.getDelta();
            const elapsed = this.clock.getElapsedTime();

            // Callback customizado por fase
            if (callback) {
                callback(delta, elapsed);
            }

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    stopAnimation() {
        this.isAnimating = false;
    }

    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    setCameraLookAt(x, y, z) {
        this.camera.lookAt(x, y, z);
    }
}
