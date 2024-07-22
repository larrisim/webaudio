window.AudioContext = window.AudioContext || window.webkitAudioContext;

let ctx 
let volume

const PlayBtn = document.querySelector(".play");
const SineBtn = document.querySelector(".sine");
const SquareBtn = document.querySelector(".square");
const TriangleBtn = document.querySelector(".triangle");
const SawtoothBtn = document.querySelector(".sawtooth");

const oscillators = {};

let atv = 0;

const keyboardFrequencyMap = {

    '90': 60,  //Z - C
    '83': 61, //S - C#
    '88': 62,  //X - D
    '68': 63, //D - D#
    '67': 64,  //C - E
    '86': 65,  //V - F
    '71': 66, //G - F#
    '66': 67,  //B - G
    '72': 68, //H - G#
    '78': 69,  //N - A
    '74': 70,//J - A#
    '77': 71,  //M - B
    '188': 72,
    '76': 73,
    '190': 74,
    '186': 75,
    '191': 76,
    
  }

  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);


let soundtype = "sine";

SineBtn.addEventListener("click", () => {
    
    soundtype = "sine";

});

SquareBtn.addEventListener("click", () => {
    
    soundtype = "square";
});

TriangleBtn.addEventListener("click", () => {
    
    soundtype = "triangle";

});

SawtoothBtn.addEventListener("click", () => {
    
    soundtype = "sawtooth";

});



PlayBtn.addEventListener("click", () => {
    
    ctx = new AudioContext();

})

function midiToFreq(number) {
    const a = 440;
    return (a / 32) * (2 ** ((number - 9 ) / 12));
}

if (navigator.requestMIDIAccess){
    navigator.requestMIDIAccess().then(success, failure);
}

function failure(midiAccess) {
    console.log("Couldn't connect to midi");

}

function success(midiAccess){

    midiAccess.addEventListener('statechange', updateDevices);

    const inputs = midiAccess.inputs;

    inputs.forEach((input) => {
        input.addEventListener('midimessage', handleInput);
    })
}

function handleInput(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];

    switch (command){
        case 144:
        if (velocity > 0) {
            noteOn(note, velocity); 
        }else{
            noteOff(note);
        }
        break;
        case 128:
            noteOff(note);
            break;
    }
}

function noteOn(note, velocity) {
        
    const osc = ctx.createOscillator();
    
    const oscGain = ctx.createGain();

    oscGain.gain.value = (1/127) * velocity * volume;

    const velocityGainAmount = (1/127) * velocity;
    const velocityGain = ctx.createGain();
    velocityGain.value = velocityGainAmount;

    osc.type = soundtype;

    osc.frequency.value = midiToFreq(note);

    osc.connect(oscGain);
    oscGain.connect(velocityGain);
    velocityGain.connect(ctx.destination);

    osc.gain = oscGain;
    oscillators[note.toString()] = osc;
    osc.start();
}

function noteOff(note) {

    const osc = oscillators[note.toString()]; 
    const oscGain = osc.gain;

    oscGain.gain.setValueAtTime(oscGain.gain.value, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

    setTimeout(() => {
        osc.stop();
      }, 500);
    // osc.stop();
    delete oscillators[note.toString()];

}

function updateDevices(event){
    console.log("hello");
}

function keyDown(event){
    const key = (event.detail || event.which).toString();

    if (key == 81 && atv > -24) {
        atv = atv - 12;
    }
    else if (key == 87 && atv < 24) {
        atv = atv + 12;
    }
    else{
    const note = keyboardFrequencyMap[key] + atv;

    if (keyboardFrequencyMap[key] && ! oscillators[note.toString()]) {

        const velocity = 55;
        noteOn(note, velocity);
    }
    }
}

function keyUp(event){
    const key = (event.detail || event.which).toString();
    if (key != 81 && key != 87){
    const note = keyboardFrequencyMap[key] + atv;

    if (keyboardFrequencyMap[key] && oscillators[note.toString()]) {
        noteOff(note);
}
}
}

function updateValue(value) {
    document.getElementById('sliderValue').textContent = value;
    volume = value * 0.01;
}

// Initialize the value display
document.addEventListener('DOMContentLoaded', (event) => {
    const slider = document.getElementById('slider');
    updateValue(slider.value);
});
