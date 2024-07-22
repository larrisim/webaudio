const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let firstBeat = true;
let tempo;
let timeSignature;

function createClickSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'triangle';

    if (firstBeat == true) {
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);

    }
    else{

        oscillator.frequency.setValueAtTime(250, audioContext.currentTime);
    }

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.04);
}

let current16thNote 
let isPlaying = false;

let lookahead = 25.0;
let scheduleAheadTime = 0.1;
let nextNoteTime = 0.0;

function nextNote() {
    const secondsPerBeat = 60.0 / (tempo/4);
    nextNoteTime += 0.25 * secondsPerBeat;

    firstBeat = false;
    current16thNote++;
    console.log(current16thNote);
    if (current16thNote === timeSignature * 1) {

        firstBeat = true;
        current16thNote = 0;
    }
}

function scheduleNote() {
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        createClickSound();
        nextNote();
    }
}

function scheduler() {
    if (isPlaying) {
        scheduleNote();
        setTimeout(scheduler, lookahead);
    }
}

function startMetronome() {
    if (!isPlaying) {
        isPlaying = true;
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        scheduler();
    }
}

function stopMetronome() {
    isPlaying = false;
}


document.getElementById('metronomeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    tempo = document.getElementById('tempo').value;
    timeSignature = document.getElementById('timeSignature').value;
    console.log(`Tempo: ${tempo} BPM, Time Signature: ${timeSignature}`);
    console.log(timeSignature * 4);
    
    firstBeat = true;
    current16thNote = 0;
    startMetronome();

});

document.querySelector('.stopButton').addEventListener('click', stopMetronome);
