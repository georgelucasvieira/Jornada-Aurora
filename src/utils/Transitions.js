import gsap from 'gsap';

export class Transitions {
    static get overlay() {
        return document.getElementById('transition-overlay');
    }

    static fadeOut(duration = 1) {
        return gsap.to(this.overlay, {
            opacity: 1,
            duration,
            ease: 'power2.inOut',
            pointerEvents: 'all'
        });
    }

    static fadeIn(duration = 1) {
        return gsap.to(this.overlay, {
            opacity: 0,
            duration,
            ease: 'power2.inOut',
            pointerEvents: 'none'
        });
    }

    static async transition(fromPhase, toPhase, duration = 0.5) {
        // Fade out
        await this.fadeOut(duration);

        // Destruir fase anterior
        if (fromPhase && typeof fromPhase.destroy === 'function') {
            fromPhase.destroy();
        }

        // Inicializar nova fase
        if (toPhase && typeof toPhase.init === 'function') {
            await toPhase.init();
        }

        // Fade in
        await this.fadeIn(duration);
    }

    static flashColor(color = '#ffffff', duration = 0.1) {
        const tl = gsap.timeline();

        tl.to(this.overlay, {
            backgroundColor: color,
            opacity: 1,
            duration,
            ease: 'power1.in'
        });

        tl.to(this.overlay, {
            opacity: 0,
            duration: duration * 2,
            ease: 'power1.out'
        });

        return tl;
    }

    static avadaKedavra() {
        const tl = gsap.timeline();

        // Flash verde intenso (Avada Kedavra)
        tl.to(this.overlay, {
            backgroundColor: '#00ff00',
            opacity: 1,
            duration: 0.1,
            ease: 'power4.in'
        });

        // Fade to black (morte)
        tl.to(this.overlay, {
            backgroundColor: '#000000',
            opacity: 1,
            duration: 2,
            ease: 'power4.in'
        });

        // Silêncio/escuridão absoluta (5 segundos)
        tl.to({}, { duration: 5 });

        // Luz dourada suave (ressurreição/graça)
        tl.to(this.overlay, {
            backgroundColor: '#ffd700',
            opacity: 0.3,
            duration: 3,
            ease: 'power2.out'
        });

        // Fade out final
        tl.to(this.overlay, {
            opacity: 0,
            duration: 2,
            ease: 'power1.out'
        });

        return tl;
    }

    static showElement(element, duration = 0.5, options = {}) {
        const {
            opacity = 1,
            y = 0,
            scale = 1,
            ease = 'power2.out'
        } = options;

        return gsap.to(element, {
            opacity,
            y,
            scale,
            duration,
            ease,
            display: 'block'
        });
    }

    static hideElement(element, duration = 0.5, options = {}) {
        const {
            y = 20,
            scale = 0.95,
            ease = 'power2.in'
        } = options;

        return gsap.to(element, {
            opacity: 0,
            y,
            scale,
            duration,
            ease,
            onComplete: () => {
                element.style.display = 'none';
            }
        });
    }

    static typewriter(element, text, speed = 50) {
        element.textContent = '';
        const chars = text.split('');
        let index = 0;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (index < chars.length) {
                    element.textContent += chars[index];
                    index++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    static shake(element, intensity = 10, duration = 0.5) {
        return gsap.to(element, {
            x: `+=${intensity}`,
            duration: duration / 8,
            repeat: 7,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }

    static pulse(element, scale = 1.1, duration = 0.5) {
        return gsap.to(element, {
            scale,
            duration: duration / 2,
            repeat: 1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }

    static glow(element, color = '#ffd700', duration = 1) {
        return gsap.to(element, {
            boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
            duration: duration / 2,
            repeat: 1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }

    static slideIn(element, direction = 'left', duration = 0.5) {
        const directions = {
            left: { x: -100 },
            right: { x: 100 },
            top: { y: -100 },
            bottom: { y: 100 }
        };

        gsap.set(element, {
            ...directions[direction],
            opacity: 0
        });

        return gsap.to(element, {
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            ease: 'power2.out'
        });
    }

    static slideOut(element, direction = 'left', duration = 0.5) {
        const directions = {
            left: { x: -100 },
            right: { x: 100 },
            top: { y: -100 },
            bottom: { y: 100 }
        };

        return gsap.to(element, {
            ...directions[direction],
            opacity: 0,
            duration,
            ease: 'power2.in'
        });
    }

    static animateText(element, text, duration = 1) {
        const tl = gsap.timeline();

        tl.to(element, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                element.textContent = text;
            }
        });

        tl.to(element, {
            opacity: 1,
            duration: 0.5
        });

        return tl;
    }

    static createTimeline(options = {}) {
        return gsap.timeline(options);
    }
}
