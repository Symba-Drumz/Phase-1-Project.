document.addEventListener("DOMContentLoaded", () => {
    const drumKitContainer = document.getElementById("drum-kit");
    const drumKitSelector = document.getElementById("drum-kit-selector");
    const metronomeButton = document.getElementById("toggle-metronome");
    const playAlongButton = document.getElementById("play-along");
    const visualizer = document.getElementById("visualizer");
    let audioContext, analyser, dataArray, bufferLength;

    
    async function fetchDrumKit(kitType) {
        const response = await fetch("db.json"); 
        const data = await response.json();
        generateDrumPads(data[kitType]);
    }

    
    function generateDrumPads(kit) {
        drumKitContainer.innerHTML = "";
        kit.forEach(drum => {
            const button = document.createElement("button");
            button.classList.add("drum-pad");
            button.textContent = drum.name;
            button.addEventListener("click", () => playSound(drum.sound));
            drumKitContainer.appendChild(button);
        });
    }

    
    function playSound(sound) {
        const audio = new Audio(sound);
        audio.play();
        visualizeSound();
    }

    
    let metronomeInterval;
    function toggleMetronome() {
        if (metronomeInterval) {
            clearInterval(metronomeInterval);
            metronomeInterval = null;
        } else {
            metronomeInterval = setInterval(() => playSound("metronome.mp3"), 600);
        }
    }

    
    function startPlayAlong() {
        playSound("play-along-track.mp3");
    }

    
    function setupVisualizer() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
    }

    function visualizeSound() {
        const canvasCtx = visualizer.getContext("2d");
        canvasCtx.clearRect(0, 0, visualizer.width, visualizer.height);
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = "lime";
        dataArray.forEach((value, i) => {
            canvasCtx.fillRect(i * 4, visualizer.height - value, 3, value);
        });
    }

    
    drumKitSelector.addEventListener("change", () => fetchDrumKit(drumKitSelector.value));
    metronomeButton.addEventListener("click", toggleMetronome);
    playAlongButton.addEventListener("click", startPlayAlong);

    
    fetchDrumKit("default");
    setupVisualizer();
});
