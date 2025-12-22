import { Howl, Howler } from 'howler';

export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.currentMusic = null;
        this.currentVoice = null;
        this.masterVolume = 1.0;
        this.musicVolume = 0.7;
        this.sfxVolume = 1.0;
        this.voiceVolume = 1.0;
    }

    preload(soundMap) {
        const promises = [];

        Object.entries(soundMap).forEach(([key, config]) => {
            const promise = new Promise((resolve, reject) => {
                let howlConfig;

                if (typeof config === 'string') {
                    // Configuração simples: apenas path
                    howlConfig = {
                        src: [config],
                        preload: true,
                        onload: () => resolve(key),
                        onloaderror: (id, error) => {
                            console.warn(`Falha ao carregar som ${key}: ${config}`, error);
                            resolve(key); // Resolver ao invés de rejeitar para não travar
                        }
                    };
                } else if (typeof config === 'object' && config.src) {
                    // Configuração completa
                    howlConfig = {
                        ...config,
                        onload: () => resolve(key),
                        onloaderror: (id, error) => {
                            console.warn(`Falha ao carregar som ${key}:`, error);
                            resolve(key); // Resolver ao invés de rejeitar para não travar
                        }
                    };
                } else {
                    console.error(`Configuração inválida para som ${key}:`, config);
                    resolve(key); // Resolver para não travar
                    return;
                }

                try {
                    const sound = new Howl(howlConfig);
                    this.sounds.set(key, sound);
                } catch (error) {
                    console.error(`Erro ao criar Howl para ${key}:`, error);
                    resolve(key); // Resolver para não travar
                }
            });

            promises.push(promise);
        });

        return Promise.all(promises);
    }

    playMusic(key, options = {}) {
        const {
            fadeIn = 2000,
            volume = this.musicVolume,
            loop = true
        } = options;

        if (!this.sounds.has(key)) {
            console.warn(`Música não encontrada: ${key}`);
            return null;
        }

        const music = this.sounds.get(key);

        // Se o som não carregou corretamente, retornar null
        if (!music || music.state() === 'unloaded') {
            console.warn(`Música ${key} não foi carregada corretamente`);
            return null;
        }

        // Parar música atual com fade out
        const previousMusic = this.currentMusic; // Salvar referência à música antiga
        if (previousMusic) {
            try {
                const currentVolume = previousMusic.volume();
                previousMusic.fade(currentVolume, 0, 1000);

                setTimeout(() => {
                    previousMusic.stop(); // Parar a música ANTIGA, não a atual
                }, 1000);
            } catch (error) {
                console.warn('Erro ao parar música anterior:', error);
            }
        }

        // Tocar nova música
        try {
            music.loop(loop);
            music.volume(0);
            music.play();
            music.fade(0, volume, fadeIn);

            this.currentMusic = music;

            return music;
        } catch (error) {
            console.warn(`Erro ao tocar música ${key}:`, error);
            return null;
        }
    }

    stopMusic(fadeOut = 1000) {
        if (this.currentMusic) {
            const currentVolume = this.currentMusic.volume();
            this.currentMusic.fade(currentVolume, 0, fadeOut);

            setTimeout(() => {
                if (this.currentMusic) {
                    this.currentMusic.stop();
                    this.currentMusic = null;
                }
            }, fadeOut);
        }
    }

    pauseMusic() {
        if (this.currentMusic && this.currentMusic.playing()) {
            this.currentMusic.pause();
        }
    }

    resumeMusic() {
        if (this.currentMusic && !this.currentMusic.playing()) {
            this.currentMusic.play();
        }
    }

    playSFX(key, options = {}) {
        const {
            volume = this.sfxVolume,
            rate = 1.0
        } = options;

        if (!this.sounds.has(key)) {
            console.warn(`SFX não encontrado: ${key}`);
            return null;
        }

        const sfx = this.sounds.get(key);

        // Se o som não carregou corretamente, retornar null
        if (!sfx || sfx.state() === 'unloaded') {
            console.warn(`SFX ${key} não foi carregado corretamente`);
            return null;
        }

        try {
            sfx.volume(volume);
            sfx.rate(rate);
            sfx.play();

            return sfx;
        } catch (error) {
            console.warn(`Erro ao tocar SFX ${key}:`, error);
            return null;
        }
    }

    playVoice(key, options = {}) {
        const {
            volume = this.voiceVolume,
            onEnd = null,
            onPlay = null
        } = options;

        if (!this.sounds.has(key)) {
            console.warn(`Voz não encontrada: ${key}`);
            return null;
        }

        const voice = this.sounds.get(key);

        // Se o som não carregou corretamente, retornar null
        if (!voice || voice.state() === 'unloaded') {
            console.warn(`Voz ${key} não foi carregada corretamente`);
            return null;
        }

        try {
            // Parar voz atual se houver
            if (this.currentVoice && this.currentVoice.playing()) {
                this.currentVoice.stop();
            }

            voice.volume(volume);

            const soundId = voice.play();

            if (onPlay) {
                onPlay();
            }

            if (onEnd) {
                voice.once('end', onEnd);
            }

            this.currentVoice = voice;

            return { sound: voice, id: soundId };
        } catch (error) {
            console.warn(`Erro ao tocar voz ${key}:`, error);
            return null;
        }
    }

    stopVoice() {
        if (this.currentVoice) {
            this.currentVoice.stop();
            this.currentVoice = null;
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        Howler.volume(this.masterVolume);
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume(this.musicVolume);
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setVoiceVolume(volume) {
        this.voiceVolume = Math.max(0, Math.min(1, volume));
        if (this.currentVoice) {
            this.currentVoice.volume(this.voiceVolume);
        }
    }

    muteAll() {
        Howler.mute(true);
    }

    unmuteAll() {
        Howler.mute(false);
    }

    stopAll() {
        this.stopMusic();
        this.stopVoice();
        this.sounds.forEach(sound => sound.stop());
    }

    getSound(key) {
        return this.sounds.get(key);
    }

    isPlaying(key) {
        const sound = this.sounds.get(key);
        return sound ? sound.playing() : false;
    }

    getDuration(key) {
        const sound = this.sounds.get(key);
        return sound ? sound.duration() : 0;
    }
}
