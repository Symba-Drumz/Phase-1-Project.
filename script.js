document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play");
    const stopButton = document.getElementById("stop");
    const resetButton = document.getElementById("reset");
    const savePresetButton = document.getElementById("save-preset");
    const loadPresetSelect = document.getElementById("load-preset");
    const tempoInput = document.getElementById("tempo");
    const volumeInput = document.getElementById("volume");
    const grid = document.querySelector(".grid");
    const visualizer = document.getElementById("visualizer");
    const numSteps = 16;
    const drumSounds = {
        crash: "sounds/crash.wav",
        highTom: "sounds/high-tom.wav",
        midTom: "sounds/mid-tom.wav",
        lowTom: "sounds/low-tom.wav",
        openHihat: "sounds/open-hihat.wav",
        closedHihat: "sounds/closed-hihat.wav",
        snare: "sounds/snare.wav",
        kick: "sounds/kick.wav"
    };

    let isPlaying = false;
    let currentStep = 0;
    let interval;
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let volumeGain = audioContext.createGain();
    volumeGain.connect(audioContext.destination);

    volumeInput.addEventListener("input", () => {
        volumeGain.gain.value = volumeInput.value / 100;
    });

    function generateGrid() {
        Object.keys(drumSounds).forEach(drum => {
            const row = document.createElement("div");
            row.classList.add("row");
            row.dataset.drum = drum;
            
            for (let i = 0; i < numSteps; i++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.step = i;
                cell.addEventListener("click", () => {
                    cell.classList.toggle("active");
                });
                row.appendChild(cell);
            }
            grid.appendChild(row);
        });
    }

    function playStep() {
        document.querySelectorAll(".row").forEach(row => {
            const drum = row.dataset.drum;
            const activeCell = row.children[currentStep];
            if (activeCell.classList.contains("active")) {
                playSound(drum);
                animateVisualizer();
            }
        });
        currentStep = (currentStep + 1) % numSteps;
    }

    function playSound(drum) {
        const sound = new Audio(drumSounds[drum]);
        sound.volume = volumeGain.gain.value;
        sound.play();
    }

    function startSequencer() {
        if (!isPlaying) {
            isPlaying = true;
            interval = setInterval(playStep, 60000 / tempoInput.value / 4);
        }
    }

    function stopSequencer() {
        isPlaying = false;
        clearInterval(interval);
        currentStep = 0;
    }

    function resetSequencer() {
        document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("active"));
        stopSequencer();
    }

    function animateVisualizer() {
        visualizer.style.transform = `scale(${1 + Math.random() * 0.3})`;
        setTimeout(() => {
            visualizer.style.transform = "scale(1)";
        }, 100);
    }

    function savePreset() {
        const preset = [];
        document.querySelectorAll(".row").forEach(row => {
            const rowState = [];
            row.querySelectorAll(".cell").forEach(cell => {
                rowState.push(cell.classList.contains("active"));
            });
            preset.push(rowState);
        });
        localStorage.setItem("drumkitPreset", JSON.stringify(preset));
        alert("Preset saved!");
    }

    function loadPreset() {
        const preset = JSON.parse(localStorage.getItem("drumkitPreset"));
        if (preset) {
            document.querySelectorAll(".row").forEach((row, rowIndex) => {
                row.querySelectorAll(".cell").forEach((cell, cellIndex) => {
                    cell.classList.toggle("active", preset[rowIndex][cellIndex]);
                });
            });
        }
    }

    tempoInput.addEventListener("input", () => {
        if (isPlaying) {
            clearInterval(interval);
            interval = setInterval(playStep, 60000 / tempoInput.value / 4);
        }
    });

    playButton.addEventListener("click", startSequencer);
    stopButton.addEventListener("click", stopSequencer);
    resetButton.addEventListener("click", resetSequencer);
    savePresetButton.addEventListener("click", savePreset);
    loadPresetSelect.addEventListener("change", loadPreset);

    generateGrid();
});
