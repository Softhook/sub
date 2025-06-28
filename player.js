// Assumes: `loadMod` function is already defined globally by loader.js

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
      this[AUDIO] = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      this[GAIN] = null;
      this[WORKLET] = null;
      this[ROW_CALLBACKS] = [];
      this[SINGLE_CALLBACKS] = {};
      this[STOP_CALLBACKS] = [];
    }

    async load(modArrayBuffer) {
      if (this[WORKLET]) this.unload();

      this.mod = await loadMod(modArrayBuffer);

      this[GAIN] = this[AUDIO].createGain();
      this[GAIN].gain.value = 0.3;

      await this[AUDIO].audioWorklet.addModule('mod-player-worklet.js');

      this[WORKLET] = new AudioWorkletNode(this[AUDIO], 'mod-player-worklet');
      this[WORKLET].connect(this[GAIN]).connect(this[AUDIO].destination);
      this[WORKLET].port.onmessage = this.onmessage.bind(this);
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
      this[AUDIO].close();

      this.mod = null;
      this[AUDIO] = null;
      this[WORKLET] = null;
      this[ROW_CALLBACKS] = [];
      this[SINGLE_CALLBACKS] = {};
    }

    play() {
      if (this.playing || !this[WORKLET]) return;

      this[AUDIO].resume();
      this[WORKLET].port.postMessage({
        type: 'play',
        mod: this.mod,
        sampleRate: this[AUDIO].sampleRate
      });

      this.playing = true;
    }

    stop() {
      if (!this.playing) return;

      this[WORKLET].port.postMessage({ type: 'stop' });
      this.playing = false;
    }

    resume() {
      if (this.playing) return;
      this[WORKLET].port.postMessage({ type: 'resume' });
      this.playing = true;
    }

    setRow(position, row) {
      this[WORKLET].port.postMessage({
        type: 'setRow',
        position: position,
        row: row
      });
    }

    setVolume(volume) {
      if (this[GAIN]) this[GAIN].gain.value = volume;
    }
  }

  // Expose globally
  window.ModPlayer = ModPlayer;
})();