// Assumes: `loadMod` function is already defined globally by mod-loader.js

(function () {
  const AUDIO = Symbol('audio');
  const GAIN = Symbol('gain');
  const WORKLET = Symbol('worklet');
  const ROW_CALLBACKS = Symbol('rowCallbacks');
  const SINGLE_CALLBACKS = Symbol('singleCallbacks');
  const STOP_CALLBACKS = Symbol('stopCallbacks');

  function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  class ModPlayer {
    constructor(audioContext) {
      this.mod = null;
      this.playing = false;
      this.fadeInterval = null;
      this.currentVolume = 0.7;
      
      // Make sure we have a valid audio context
      let ctx = audioContext;
      if (!ctx) {
        console.log("No audio context provided, creating new one");
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (ctx) {
        console.log("Audio context state:", ctx.state);
        // Try to resume the context immediately if it's suspended
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            console.log("Audio context resumed in constructor");
          }).catch(err => {
            console.warn("Failed to resume audio context in constructor:", err);
          });
        }
      }
      
      this[AUDIO] = ctx;
      this[GAIN] = null;
      this[WORKLET] = null;
      this[ROW_CALLBACKS] = [];
      this[SINGLE_CALLBACKS] = {};
      this[STOP_CALLBACKS] = [];
    }

    async load(modArrayBuffer) {
      if (this[WORKLET]) this.unload();

      // Make sure we have a valid audio context
      if (!this[AUDIO] || typeof this[AUDIO].createGain !== 'function') {
        console.error("Invalid audio context in ModPlayer");
        this[AUDIO] = new (window.AudioContext || window.webkitAudioContext)();
        console.log("Created new audio context as fallback");
      }

      try {
        this.mod = await loadMod(modArrayBuffer);
        console.log("MOD loaded successfully:", this.mod ? this.mod.title : "unknown");
        
        // Debug MOD structure
        if (this.mod) {
          console.log("MOD details:", {
            title: this.mod.title,
            instrumentCount: this.mod.instruments ? this.mod.instruments.length : 0,
            patternCount: this.mod.patterns ? this.mod.patterns.length : 0,
            length: this.mod.length,
            hasSamples: this.mod.instruments && this.mod.instruments.some(i => i && i.bytes && i.bytes.length > 0)
          });
          
          // Check if first instrument has valid sample data
          if (this.mod.instruments && this.mod.instruments.length > 1) {
            const firstInst = this.mod.instruments[1]; // Index 1 is typically the first instrument
            if (firstInst) {
              console.log("First instrument:", {
                name: firstInst.name,
                length: firstInst.length,
                hasSampleData: firstInst.bytes && firstInst.bytes.length > 0,
                sampleBytes: firstInst.bytes ? firstInst.bytes.length : 0
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading MOD file:", error);
        throw error;
      }

      // Create the gain node
      try {
        this[GAIN] = this[AUDIO].createGain();
        this[GAIN].gain.value = 0.7; // Increased volume from 0.3 to 0.7
        console.log("Gain node created with volume:", this[GAIN].gain.value);
      } catch (error) {
        console.error("Error creating gain node:", error);
        throw error;
      }

      try {
        console.log("Adding AudioWorklet module...");
        // Check if AudioWorklet is supported
        if (!this[AUDIO].audioWorklet) {
          throw new Error("AudioWorklet not supported in this browser");
        }
        
        // Use absolute URL to ensure worklet loads correctly
        const workletUrl = new URL('mod-player-worklet.js', window.location.href).href;
        console.log("Loading worklet from:", workletUrl);
        
        // Add the worklet module with absolute URL
        await this[AUDIO].audioWorklet.addModule(workletUrl);
        console.log("AudioWorklet module added successfully");
        
        // Create the worklet node
        this[WORKLET] = new AudioWorkletNode(this[AUDIO], 'mod-player-worklet');
        console.log("AudioWorklet node created");
        
        // Connect the audio nodes
        if (!this[WORKLET]) throw new Error("WorkletNode is null after creation");
        if (!this[GAIN]) throw new Error("GainNode is null after creation");
        
        this[WORKLET].connect(this[GAIN]);
        this[GAIN].connect(this[AUDIO].destination);
        this[WORKLET].port.onmessage = this.onmessage.bind(this);
        console.log("Audio nodes connected successfully");
      } catch (error) {
        console.error("Error setting up AudioWorklet:", error);
        throw error;
      }
      
      return this.mod;
    }
    
    // For compatibility with the game's existing audio context
    setAudioContext(context) {
      if (context && context.state && !this[AUDIO]) {
        console.log("Setting external audio context for MOD player");
        this[AUDIO] = context;
        return true;
      }
      return false;
    }

    onmessage(event) {
      const { data } = event;
      switch (data.type) {
        case 'row':
          for (let cb of this[ROW_CALLBACKS]) cb(data.position, data.rowIndex);

          const key = data.position + ':' + data.rowIndex;
          if (key in this[SINGLE_CALLBACKS]) {
            for (let cb of this[SINGLE_CALLBACKS][key]) {
              cb(data.position, data.rowIndex);
            }
          }
          break;

        case 'stop':
          for (let cb of this[STOP_CALLBACKS]) cb();
          break;
      }
    }

    watchRows(callback) {
      this[WORKLET]?.port.postMessage({ type: 'enableRowSubscription' });
      this[ROW_CALLBACKS].push(callback);
    }

    watch(position, row, callback) {
      this[WORKLET]?.port.postMessage({ type: 'enableRowSubscription' });
      const key = position + ':' + row;
      if (!(key in this[SINGLE_CALLBACKS])) {
        this[SINGLE_CALLBACKS][key] = [];
      }
      this[SINGLE_CALLBACKS][key].push(callback);
    }

    watchStop(callback) {
      this[WORKLET]?.port.postMessage({ type: 'enableStopSubscription' });
      this[STOP_CALLBACKS].push(callback);
    }

    unload() {
      if (this.playing) this.stop();
      if (!this[WORKLET]) return;

      this[WORKLET].disconnect();
      
      // Don't close the audio context as it may be shared with the game
      // this[AUDIO].close();

      this.mod = null;
      // Don't reset AUDIO as it may be shared with the game
      // this[AUDIO] = null; 
      this[WORKLET] = null;
      this[ROW_CALLBACKS] = [];
      this[SINGLE_CALLBACKS] = {};
      
      return true;
    }

    play() {
      if (this.playing || !this[WORKLET]) {
        console.log("Cannot play: already playing or worklet not initialized");
        return false;
      }

      console.log("Starting MOD playback...");
      
      try {
        // Make sure audio context is running
        if (this[AUDIO].state !== 'running') {
          console.log("Resuming audio context...");
          return this[AUDIO].resume()
            .then(() => {
              console.log("Audio context resumed successfully");
              return this._startPlayback();
            })
            .catch(err => {
              console.error("Error resuming audio context:", err);
              return false;
            });
        } else {
          // Audio context already running
          return this._startPlayback();
        }
      } catch (error) {
        console.error("Error in play():", error);
        return false;
      }
    }

    _startPlayback() {
      try {
        if (!this[WORKLET]) {
          console.error("Worklet not initialized");
          return false;
        }
        
        // Make sure we have a valid mod object
        if (!this.mod) {
          console.error("No MOD data available for playback");
          return false;
        }
        
        console.log("MOD data ready for playback:", 
                   "title:", this.mod.title || "unknown", 
                   "samples:", this.mod.instruments ? this.mod.instruments.length : "unknown");
        
        // Force the audio context to resume again just to be sure
        if (this[AUDIO] && typeof this[AUDIO].resume === 'function') {
          this[AUDIO].resume().catch(e => console.warn("Audio resume warning:", e));
        }
        
        // Send the play message to the worklet
        this[WORKLET].port.postMessage({
          type: 'play',
          mod: this.mod,
          sampleRate: this[AUDIO].sampleRate
        });
        
        console.log("Play message sent to worklet");
        this.playing = true;
        
        // Debug: Check audio connections are valid
        console.log("Audio routing check:", 
                   "Worklet connected:", this[WORKLET] ? "Yes" : "No", 
                   "Gain connected:", this[GAIN] ? "Yes" : "No",
                   "Audio running:", this[AUDIO] && this[AUDIO].state === "running" ? "Yes" : "No");
        
        return true;
      } catch (error) {
        console.error("Error starting playback:", error);
        return false;
      }
    }

    stop() {
      if (!this.playing) return false;

      this[WORKLET].port.postMessage({ type: 'stop' });
      this.playing = false;
      return true;
    }

    resume() {
      if (this.playing) return false;
      this[WORKLET].port.postMessage({ type: 'resume' });
      this.playing = true;
      return true;
    }

    setRow(position, row) {
      this[WORKLET].port.postMessage({
        type: 'setRow',
        position: position,
        row: row
      });
    }

    setVolume(volume) {
      if (this[GAIN]) {
        this[GAIN].gain.value = volume;
        this.currentVolume = volume;
      }
      return true;
    }
    
    // Direct method to silence music completely and stop playback
    silence() {
      console.log("Silencing and stopping music completely");
      
      // First set volume to zero immediately
      if (this[GAIN]) {
        // Immediately set to zero - no fade
        this[GAIN].gain.value = 0;
        this.currentVolume = 0;
        
        // Also stop any running fade interval
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
      }
      
      // Then stop the actual playback
      if (this.playing && this[WORKLET]) {
        console.log("Stopping MOD playback");
        this[WORKLET].port.postMessage({ type: 'stop' });
        this.playing = false;
      }
      
      return true;
    }
    
    // Add smooth volume fade function
    fadeVolume(targetVolume, durationMs = 1000) {
      // If target is 0 and we want it immediate, use silence() instead
      if (targetVolume === 0 && durationMs <= 100) {
        return this.silence();
      }
      
      // Clear any existing fade interval
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }
      
      if (!this[GAIN]) return false;
      
      // For immediate silence (volume = 0), make the transition much faster
      if (targetVolume === 0) {
        durationMs = Math.min(durationMs, 200); // Max 200ms for fade to silence
      }
      
      const startVolume = this.currentVolume;
      const volumeDiff = targetVolume - startVolume;
      
      // If the change is very small, just set it directly
      if (Math.abs(volumeDiff) < 0.01) {
        this[GAIN].gain.value = targetVolume;
        this.currentVolume = targetVolume;
        console.log(`Volume set directly to ${targetVolume} (small change)`);
        return true;
      }
      
      // For volume = 0, use faster transition with exponential curve
      const stepCount = Math.max(5, durationMs / 20); // Update every ~20ms but at least 5 steps
      const stepSize = volumeDiff / stepCount;
      let currentStep = 0;
      
      console.log(`Fading volume from ${startVolume} to ${targetVolume} over ${durationMs}ms`);
      
      this.fadeInterval = setInterval(() => {
        currentStep++;
        
        // Calculate new volume - use exponential curve for smoother fade
        let progress = currentStep / stepCount;
        let newVolume;
        
        if (targetVolume === 0) {
          // Exponential fade-out for silence (steeper curve)
          newVolume = startVolume * Math.pow(0.05, progress * 3);
          if (newVolume < 0.0005) newVolume = 0; // Snap to zero when very low
        } else {
          // Linear interpolation for other volume changes
          newVolume = startVolume + (volumeDiff * progress);
        }
        
        // Set the actual volume
        if (this[GAIN]) {
          this[GAIN].gain.value = newVolume;
          this.currentVolume = newVolume;
        }
        
        // Stop when we reach the target or finish all steps
        if (currentStep >= stepCount) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          // Ensure we end exactly at target volume
          if (this[GAIN]) {
            this[GAIN].gain.value = targetVolume;
            this.currentVolume = targetVolume;
          }
          console.log(`Volume fade complete: ${targetVolume}`);
        }
      }, durationMs / stepCount);
      
      return true;
    }
    
    // Add isPlaying getter for compatibility with the game
    get isPlaying() {
      return this.playing;
    }
    
    // Method to check if the audio is audible
    get isAudible() {
      return this[GAIN] && this[GAIN].gain.value > 0.001 && this.playing;
    }
  }

  // Expose globally
  window.ModPlayer = ModPlayer;
})();
