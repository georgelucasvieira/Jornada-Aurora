import gsap from 'gsap';

/**
 * Classe base para todas as fases
 * Gerencia cleanup automático de timers, animações e recursos
 */
export class BasePhase {
    constructor(sceneManager, audioManager, gameState) {
        this.scene = sceneManager;
        this.audio = audioManager;
        this.state = gameState;

        // Sistema de rastreamento para cleanup
        this.timers = []; // setTimeout IDs
        this.gsapAnimations = []; // GSAP tweens/timelines
        this.isDestroyed = false; // Flag para cancelar operações async
    }

    /**
     * Versão segura de setTimeout que é automaticamente cancelada no destroy
     */
    setTimeout(callback, delay) {
        if (this.isDestroyed) return null;

        const timerId = setTimeout(() => {
            if (!this.isDestroyed) {
                callback();
            }
            // Remover da lista após executar
            this.timers = this.timers.filter(id => id !== timerId);
        }, delay);

        this.timers.push(timerId);
        return timerId;
    }

    /**
     * Versão segura de delay que pode ser cancelada
     */
    delay(ms) {
        return new Promise((resolve, reject) => {
            if (this.isDestroyed) {
                reject(new Error('Phase destroyed'));
                return;
            }

            const timerId = this.setTimeout(() => {
                resolve();
            }, ms);

            // Se for destruído durante o delay, rejeitar a promise
            if (timerId === null) {
                reject(new Error('Phase destroyed'));
            }
        });
    }

    /**
     * Wrapper para animações GSAP que são rastreadas automaticamente
     */
    gsapTo(target, vars) {
        if (this.isDestroyed) {
            // Resolver onComplete imediatamente se existir
            if (vars.onComplete) {
                vars.onComplete();
            }
            return null;
        }

        const tween = gsap.to(target, vars);
        this.gsapAnimations.push(tween);
        return tween;
    }

    gsapTimeline(vars) {
        if (this.isDestroyed) {
            // Resolver onComplete imediatamente se existir
            if (vars && vars.onComplete) {
                vars.onComplete();
            }
            return null;
        }

        const timeline = gsap.timeline(vars);
        this.gsapAnimations.push(timeline);
        return timeline;
    }

    /**
     * Cancela todos os timers e animações pendentes
     */
    cleanup() {
        // Cancelar todos os timers
        this.timers.forEach(timerId => {
            clearTimeout(timerId);
        });
        this.timers = [];

        // Parar todas as animações GSAP
        this.gsapAnimations.forEach(anim => {
            if (anim && typeof anim.kill === 'function') {
                anim.kill();
            }
        });
        this.gsapAnimations = [];
    }

    /**
     * Verifica se a fase foi destruída (para guards em async)
     */
    checkDestroyed() {
        if (this.isDestroyed) {
            throw new Error('Phase was destroyed');
        }
    }

    /**
     * Método base destroy - deve ser chamado por todas as subclasses
     */
    destroy() {
        console.log(`Destruindo fase base...`);
        this.isDestroyed = true;
        this.cleanup();
    }

    /**
     * Métodos que devem ser implementados pelas subclasses
     */
    async init() {
        throw new Error('init() must be implemented by subclass');
    }
}
