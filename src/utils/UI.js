import { Transitions } from './Transitions.js';

export class UI {
    static get textBox() {
        return document.getElementById('text-box');
    }

    static get textContent() {
        return document.getElementById('text-content');
    }

    static get textVerse() {
        return document.getElementById('text-verse');
    }

    static get interactiveContainer() {
        return document.getElementById('interactive-container');
    }

    // Mostrar caixa de texto com narração e versículo opcional
    static async showText(narration, verse = null, duration = 0.5) {
        this.textContent.textContent = narration;

        if (verse) {
            this.textVerse.textContent = verse;
            this.textVerse.classList.remove('hidden');
        } else {
            this.textVerse.classList.add('hidden');
        }

        this.textBox.classList.remove('hidden');
        await Transitions.showElement(this.textBox, duration);
    }

    // Esconder caixa de texto
    static async hideText(duration = 0.5) {
        await Transitions.hideElement(this.textBox, duration);
        this.textBox.classList.add('hidden');
    }

    // Atualizar texto sem ocultar/mostrar
    static async updateText(narration, verse = null) {
        await Transitions.animateText(this.textContent, narration);

        if (verse) {
            this.textVerse.textContent = verse;
            this.textVerse.classList.remove('hidden');
        } else {
            this.textVerse.classList.add('hidden');
        }
    }

    // Criar botão interativo
    static createButton(text, onClick, className = '') {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `game-button ${className}`;
        button.addEventListener('click', onClick);
        return button;
    }

    // Criar elemento de progresso (ex: 3/5 objetos)
    static createProgressIndicator(current, total, label = '') {
        const container = document.createElement('div');
        container.className = 'progress-indicator';
        container.innerHTML = `
            <div class="progress-label">${label}</div>
            <div class="progress-count">${current}/${total}</div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${(current / total) * 100}%"></div>
            </div>
        `;
        return container;
    }

    // Limpar container interativo
    static clearInteractive() {
        this.interactiveContainer.innerHTML = '';
    }

    // Adicionar elemento ao container interativo
    static addInteractive(element) {
        this.interactiveContainer.appendChild(element);
    }

    // Mostrar mensagem temporária (toast)
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        Transitions.slideIn(toast, 'top', 0.3);

        setTimeout(async () => {
            await Transitions.slideOut(toast, 'top', 0.3);
            toast.remove();
        }, duration);
    }

    // Criar overlay clicável (para avançar diálogos)
    static createClickToContinue(onContinue) {
        const overlay = document.createElement('div');
        overlay.className = 'click-to-continue';
        overlay.innerHTML = '<p class="click-hint">Clique para continuar...</p>';

        overlay.addEventListener('click', () => {
            overlay.remove();
            if (onContinue) onContinue();
        });

        document.body.appendChild(overlay);
        Transitions.pulse(overlay.querySelector('.click-hint'), 1.1, 1);

        return overlay;
    }

    // Criar contador regressivo visual
    static createCountdown(seconds, onComplete) {
        const countdown = document.createElement('div');
        countdown.className = 'countdown-timer';
        countdown.innerHTML = `
            <div class="countdown-circle">
                <div class="countdown-number">${seconds}</div>
            </div>
        `;

        this.addInteractive(countdown);

        let remaining = seconds;
        const interval = setInterval(() => {
            remaining--;
            countdown.querySelector('.countdown-number').textContent = remaining;

            if (remaining <= 0) {
                clearInterval(interval);
                countdown.remove();
                if (onComplete) onComplete();
            }
        }, 1000);

        return countdown;
    }

    // Criar animação de "objeto coletado"
    static animateCollectedObject(element, position) {
        const clone = element.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = `${position.x}px`;
        clone.style.top = `${position.y}px`;
        clone.style.pointerEvents = 'none';

        document.body.appendChild(clone);

        const progressUI = document.querySelector('#progress-ui');
        const targetRect = progressUI?.getBoundingClientRect() || { left: 100, top: 100 };

        Transitions.createTimeline()
            .to(clone, {
                left: targetRect.left,
                top: targetRect.top,
                scale: 0.3,
                duration: 0.8,
                ease: 'power2.in',
                onComplete: () => {
                    clone.remove();
                }
            });
    }
}
