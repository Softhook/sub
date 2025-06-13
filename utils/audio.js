// --- Audio System ---

// Sound Setup and Functions
function initializeSounds() {
  function setupSound(type, freqOrNoiseType, adsr, levels) {
    let soundObj;
    let env = new p5.Envelope();
    env.setADSR(adsr.aT, adsr.dT, adsr.sR, adsr.rT);
    env.setRange(levels.aL, levels.rL);

    if (type === 'osc') {
      soundObj = new p5.Oscillator(freqOrNoiseType); // freqOrNoiseType is actual frequency string like 'sine' or 'triangle'
    } else { // 'noise'
      soundObj = new p5.Noise(freqOrNoiseType); // freqOrNoiseType is noise type string like 'white' or 'pink'
    }
    soundObj.amp(env);
    return { sound: soundObj, envelope: env };
  }

  let sonarSound = setupSound('osc', 'sine', SONAR_ENV_ADSR, SONAR_ENV_LEVELS);
  sonarOsc = sonarSound.sound; 
  sonarEnv = sonarSound.envelope;

  let explosionNoiseSound = setupSound('noise', 'white', EXPLOSION_NOISE_ENV_ADSR, EXPLOSION_NOISE_ENV_LEVELS);
  explosionNoise = explosionNoiseSound.sound; 
  explosionEnv = explosionNoiseSound.envelope;
  let explosionBoomSound = setupSound('osc', 'triangle', EXPLOSION_BOOM_ENV_ADSR, EXPLOSION_BOOM_ENV_LEVELS);
  explosionBoomOsc = explosionBoomSound.sound; 
  explosionBoomEnv = explosionBoomSound.envelope;

  let bumpSound = setupSound('osc', 'triangle', BUMP_ENV_ADSR, BUMP_ENV_LEVELS);
  bumpOsc = bumpSound.sound; 
  bumpEnv = bumpSound.envelope;

  let torpedoSound = setupSound('noise', 'pink', TORPEDO_ENV_ADSR, TORPEDO_ENV_LEVELS);
  torpedoNoise = torpedoSound.sound; 
  torpedoEnv = torpedoSound.envelope;

  let lowAirSound = setupSound('osc', 'square', LOW_AIR_ENV_ADSR, LOW_AIR_ENV_LEVELS);
  lowAirOsc = lowAirSound.sound; 
  lowAirEnv = lowAirSound.envelope;

  // Initialize reactor hum
  let reactorHumSound = setupSound('osc', 'sawtooth', REACTOR_HUM_ENV_ADSR, REACTOR_HUM_ENV_LEVELS);
  reactorHumOsc = reactorHumSound.sound; 
  reactorHumEnv = reactorHumSound.envelope;
  reactorHumOsc.freq(REACTOR_HUM_FREQ);
  // Set up for continuous play with amplitude control
  reactorHumOsc.amp(0); // Start at zero volume

  // Initialize creature growl
  let creatureGrowlSound = setupSound('osc', 'sawtooth', CREATURE_GROWL_ENV_ADSR, CREATURE_GROWL_ENV_LEVELS);
  creatureGrowlOsc = creatureGrowlSound.sound; 
  creatureGrowlEnv = creatureGrowlSound.envelope;

  let gameOverImpact = setupSound('noise', 'white', GAME_OVER_IMPACT_ENV_ADSR, GAME_OVER_IMPACT_ENV_LEVELS);
  gameOverImpactNoise = gameOverImpact.sound; 
  gameOverImpactEnv = gameOverImpact.envelope;
  let gameOverGroan = setupSound('osc', 'sawtooth', GAME_OVER_GROAN_ENV_ADSR, GAME_OVER_GROAN_ENV_LEVELS);
  gameOverGroanOsc = gameOverGroan.sound; 
  gameOverGroanEnv = gameOverGroan.envelope;
  let gameOverFinalBoom = setupSound('noise', 'brown', GAME_OVER_FINAL_BOOM_ENV_ADSR, GAME_OVER_FINAL_BOOM_ENV_LEVELS);
  gameOverFinalBoomNoise = gameOverFinalBoom.sound; 
  gameOverFinalBoomEnv = gameOverFinalBoom.envelope;
}

function playSound(soundName) {
  if (!audioInitialized || (getAudioContext() && getAudioContext().state !== 'running')) return;

  function ensureStarted(soundObject) {
    if (soundObject && !soundObject.started && typeof soundObject.start === 'function') {
      soundObject.start();
    }
  }

  try {
    if (soundName === 'sonar') {
      ensureStarted(sonarOsc); 
      sonarOsc.freq(SONAR_FREQ); 
      sonarEnv.play(sonarOsc);
    } else if (soundName === 'explosion') {
      ensureStarted(explosionNoise); 
      explosionEnv.play(explosionNoise);
      ensureStarted(explosionBoomOsc); 
      explosionBoomOsc.freq(random(EXPLOSION_BOOM_MIN_FREQ, EXPLOSION_BOOM_MAX_FREQ)); 
      explosionBoomEnv.play(explosionBoomOsc);
    } else if (soundName === 'bump') {
      ensureStarted(bumpOsc); 
      bumpOsc.freq(BUMP_FREQ); 
      bumpEnv.play(bumpOsc);
    } else if (soundName === 'torpedo') {
      ensureStarted(torpedoNoise); 
      torpedoEnv.play(torpedoNoise);
    } else if (soundName === 'lowAir') {
      ensureStarted(lowAirOsc); 
      lowAirOsc.freq(LOW_AIR_FREQ); 
      lowAirEnv.play(lowAirOsc);
    } else if (soundName === 'creatureGrowl') {
      ensureStarted(creatureGrowlOsc); 
      creatureGrowlOsc.freq(random(CREATURE_GROWL_MIN_FREQ, CREATURE_GROWL_MAX_FREQ)); 
      creatureGrowlEnv.play(creatureGrowlOsc);
    } else if (soundName === 'gameOver') {
      ensureStarted(gameOverImpactNoise);
      gameOverImpactEnv.play(gameOverImpactNoise);

      setTimeout(() => {
        ensureStarted(gameOverGroanOsc);
        gameOverGroanOsc.freq(random(GAME_OVER_GROAN_MIN_FREQ, GAME_OVER_GROAN_MAX_FREQ));
        gameOverGroanEnv.play(gameOverGroanOsc);
        gameOverGroanOsc.freq(GAME_OVER_GROAN_PITCH_DOWN_TARGET_FREQ, GAME_OVER_GROAN_PITCH_DOWN_TIME, GAME_OVER_GROAN_PITCH_DOWN_DELAY); // Pitch down
      }, GAME_OVER_GROAN_DELAY_MS);

      setTimeout(() => {
        ensureStarted(gameOverFinalBoomNoise);
        gameOverFinalBoomEnv.play(gameOverFinalBoomNoise);
      }, GAME_OVER_FINAL_BOOM_DELAY_MS);
    }
  } catch (e) { 
    // console.error("Sound error:", soundName, e); 
  }
}

function updateReactorHum(distanceToGoal) {
  if (!audioInitialized || !reactorHumOsc) return;
  
  // Calculate volume based on distance (closer = louder)
  let volume = 0;
  if (distanceToGoal < REACTOR_HUM_MAX_DISTANCE) {
    // Exponential falloff for more realistic audio spatialization
    let normalizedDistance = distanceToGoal / REACTOR_HUM_MAX_DISTANCE;
    volume = REACTOR_HUM_ENV_LEVELS.aL * (1 - Math.pow(normalizedDistance, 0.7));
  }

  // Reduce overall hum volume by multiplying with a factor (e.g., 0.5 for half volume)
  const HUM_VOLUME_FACTOR = 0.3; // Lower this value for quieter hum
  volume *= HUM_VOLUME_FACTOR;
  
  // Apply volume directly to oscillator for continuous play
  if (reactorHumOsc.started) {
    reactorHumOsc.amp(volume, 0.1); // Smooth transition over 0.1 seconds
  }
  
  reactorHumAmplitude = volume;
}
