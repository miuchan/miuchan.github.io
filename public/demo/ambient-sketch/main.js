const noteMap = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11
};

const progression = [
  {
    name: 'Cmaj7',
    pad: ['C4', 'E4', 'G4', 'B4'],
    bass: 'C2',
    lead: ['E4', 'G4', 'B4', 'D5', 'G5']
  },
  {
    name: 'Am9',
    pad: ['A3', 'C4', 'E4', 'G4', 'B4'],
    bass: 'A2',
    lead: ['C4', 'E4', 'G4', 'A4', 'C5', 'E5']
  },
  {
    name: 'Fmaj7',
    pad: ['F3', 'A3', 'C4', 'E4'],
    bass: 'F2',
    lead: ['A3', 'C4', 'E4', 'G4', 'A4', 'C5']
  },
  {
    name: 'Gsus4',
    pad: ['G3', 'C4', 'D4', 'F4'],
    bass: 'G2',
    lead: ['D4', 'F4', 'G4', 'A4', 'C5', 'D5']
  }
];

const stepsPerChord = 4;
const totalSteps = progression.length * stepsPerChord;
const lookahead = 0.1;
const scheduleAheadTime = 0.75;
const TARGET_GAIN = 0.45;

let audioCtx;
let masterGain;
let isPlaying = false;
let tempo = 78;
let currentStep = 0;
let nextNoteTime = 0;
let schedulerId = null;
let visualTimers = new Set();

const toggleBtn = document.getElementById('toggle');
const tempoSlider = document.getElementById('tempo');
const tempoValue = document.getElementById('tempoValue');
const chordDisplay = document.getElementById('currentChord');
const noteDisplay = document.getElementById('currentNote');

function midiFromNote(note) {
  const match = note.match(/^([A-G][b#]?)(-?\d)$/);
  if (!match) {
    throw new Error(`无法解析音符: ${note}`);
  }
  const [, pitch, octaveStr] = match;
  const octave = Number(octaveStr);
  return noteMap[pitch] + (octave + 1) * 12;
}

function frequencyFromNote(note) {
  const midi = midiFromNote(note);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = TARGET_GAIN;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    return audioCtx.resume();
  }
  return Promise.resolve();
}

function scheduleVisualUpdate({ chord, note, time }) {
  const delay = Math.max(time - audioCtx.currentTime, 0);
  const timer = setTimeout(() => {
    chordDisplay.textContent = chord;
    noteDisplay.textContent = note ?? '休止';
    visualTimers.delete(timer);
  }, delay * 1000);
  visualTimers.add(timer);
}

function clearVisualTimers() {
  visualTimers.forEach((timer) => clearTimeout(timer));
  visualTimers.clear();
}

function scheduleTone(note, time, duration, { type = 'sine', gain = 0.2, attack = 0.02, release = 0.25 } = {}) {
  const osc = audioCtx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(frequencyFromNote(note), time);

  const amp = audioCtx.createGain();
  amp.gain.setValueAtTime(0, time);
  amp.gain.linearRampToValueAtTime(gain, time + attack);
  amp.gain.setValueAtTime(gain, time + Math.max(duration - release, attack));
  amp.gain.linearRampToValueAtTime(0, time + duration);

  osc.connect(amp);
  amp.connect(masterGain);

  osc.start(time);
  osc.stop(time + duration + 0.05);
}

function schedulePad(chord, time, duration) {
  chord.pad.forEach((note, index) => {
    const weight = index === 0 ? 0.18 : 0.12;
    scheduleTone(note, time, duration, {
      type: index % 2 === 0 ? 'triangle' : 'sine',
      gain: weight,
      attack: 0.35,
      release: 0.45
    });
  });
}

function scheduleBass(chord, time, beatLength) {
  scheduleTone(chord.bass, time, beatLength * 2.2, {
    type: 'sine',
    gain: 0.22,
    attack: 0.03,
    release: 0.4
  });
}

function pickLeadNote(chordIndex, stepWithinChord) {
  const options = progression[chordIndex].lead;
  const bias = (stepWithinChord % options.length + Math.random()) % options.length;
  return options[Math.floor(bias)];
}

function scheduleLead(chordIndex, stepWithinChord, time, stepLength) {
  const shouldRest = stepWithinChord !== 0 && Math.random() < 0.18;
  if (shouldRest) {
    scheduleVisualUpdate({ chord: progression[chordIndex].name, note: null, time });
    return;
  }
  const note = pickLeadNote(chordIndex, stepWithinChord);
  scheduleTone(note, time, stepLength * 0.95, {
    type: 'sine',
    gain: 0.16,
    attack: 0.04,
    release: 0.2
  });
  scheduleVisualUpdate({ chord: progression[chordIndex].name, note, time });
}

function scheduleStep(step, time) {
  const chordIndex = Math.floor(step / stepsPerChord) % progression.length;
  const stepWithinChord = step % stepsPerChord;
  const secondsPerBeat = 60 / tempo;
  const stepLength = secondsPerBeat / 4;
  const chord = progression[chordIndex];

  if (stepWithinChord === 0) {
    schedulePad(chord, time, secondsPerBeat * stepsPerChord);
    scheduleBass(chord, time, secondsPerBeat);
  }

  scheduleLead(chordIndex, stepWithinChord, time, stepLength);
}

function nextStep() {
  const stepLength = (60 / tempo) / 4;
  nextNoteTime += stepLength;
  currentStep = (currentStep + 1) % totalSteps;
}

function scheduler() {
  if (!isPlaying) {
    return;
  }
  while (isPlaying && nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    scheduleStep(currentStep, nextNoteTime);
    nextStep();
  }
  schedulerId = setTimeout(scheduler, lookahead * 1000);
}

function start() {
  ensureAudioContext().then(() => {
    clearVisualTimers();
    isPlaying = true;
    toggleBtn.textContent = '⏸ 暂停播放';
    toggleBtn.classList.add('active');
    currentStep = 0;
    nextNoteTime = audioCtx.currentTime + 0.1;
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(TARGET_GAIN, now + 0.6);
    scheduler();
  });
}

function stop() {
  if (!audioCtx) return;
  isPlaying = false;
  toggleBtn.textContent = '▶︎ 开始播放';
  toggleBtn.classList.remove('active');
  if (schedulerId) {
    clearTimeout(schedulerId);
    schedulerId = null;
  }
  clearVisualTimers();
  chordDisplay.textContent = '—';
  noteDisplay.textContent = '—';
  const now = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
}

toggleBtn.addEventListener('click', () => {
  if (isPlaying) {
    stop();
  } else {
    start();
  }
});

tempoSlider.addEventListener('input', (event) => {
  tempo = Number(event.target.value);
  tempoValue.textContent = tempo.toString();
});

window.addEventListener('visibilitychange', () => {
  if (document.hidden && isPlaying) {
    stop();
  }
});
