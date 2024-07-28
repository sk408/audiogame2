const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;
let gainNode;
let beepInterval;

function startAudio() {
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(getFrequency(), audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.start();

    beepInterval = setInterval(() => {
        oscillator.frequency.setValueAtTime(getFrequency(), audioCtx.currentTime);
        oscillator.start();
    }, 650);
}

function stopAudio() {
    clearInterval(beepInterval);
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
    if (gainNode) {
        gainNode.disconnect();
    }
}

function getFrequency() {
    const frequencies = [0, 125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const frequencyIndex = Math.round(lastX / (canvas.width / 12));
    return frequencies[frequencyIndex] || 440;
}

function playBeep(frequency) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function startContinuousBeep(frequency) {
    stopContinuousBeep();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.start();

    beepInterval = setInterval(() => {
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        setTimeout(() => {
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        }, 200);
    }, 650);
}

function stopContinuousBeep() {
    clearInterval(beepInterval);
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
    if (gainNode) {
        gainNode.disconnect();
    }
}

function setVolume(volume) {
    if (gainNode) {
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    }
}

function createNoiseBuffer() {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    return buffer;
}

function playNoise(duration) {
    const noiseBuffer = createNoiseBuffer();
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    noiseSource.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseSource.start();
    noiseSource.stop(audioCtx.currentTime + duration);
}

function playTone(frequency, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
}
