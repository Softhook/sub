// --- Sound Manager ---

class SoundManager {
    constructor() {
        this.sounds = {};
        this.audioContext = null;
        this.audioInitialized = false;
        this.soundEnabled = true;
    }

    async initializeAudio() {
        if (this.audioInitialized) return;
        
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume audio context if it's suspended (required for autoplay policies)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.audioInitialized = true;
            console.log('Audio initialized successfully');
        } catch (error) {
            console.warn('Failed to initialize audio:', error);
            this.soundEnabled = false;
        }
    }

    loadSounds() {
        // Placeholder for sound loading
        // In a real implementation, you would load actual sound files
        console.log('Sound loading placeholder - sounds would be loaded here');
    }

    playSound(soundName, volume = 1.0) {
        if (!this.soundEnabled || !this.audioInitialized) return;
        
        // Placeholder for sound playing
        // In a real implementation, you would play the loaded sound
        console.log(`Playing sound: ${soundName} at volume ${volume}`);
    }

    playSonarPing() {
        this.playSound('sonarPing', 0.3);
    }

    playTorpedoFire() {
        this.playSound('torpedoFire', 0.5);
    }

    playExplosion() {
        this.playSound('explosion', 0.7);
    }

    playEnemyHit() {
        this.playSound('enemyHit', 0.6);
    }

    playPlayerHit() {
        this.playSound('playerHit', 0.8);
    }

    playLevelComplete() {
        this.playSound('levelComplete', 0.6);
    }

    playGameOver() {
        this.playSound('gameOver', 0.8);
    }

    playAmbientSonar() {
        if (Math.random() < 0.001) { // Very low chance for ambient pings
            this.playSound('ambientSonar', 0.1);
        }
    }

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    isSoundEnabled() {
        return this.soundEnabled && this.audioInitialized;
    }
}

// Global sound manager instance
let soundManager = null;

// Initialize sound manager
function initializeSoundManager() {
    if (!soundManager) {
        soundManager = new SoundManager();
    }
    return soundManager;
}
