document.addEventListener("DOMContentLoaded", () => {
    const gridCells = document.querySelectorAll(".grid div");
    const playButton = document.getElementById("play");
    const tempoControl = document.getElementById("tempo");
    const volumeControl = document.getElementById("volume");
    const swingControl = document.getElementById("swing");
    const visualizer = document.getElementById("visualizer");
    const savePresetButton = document.getElementById("save-preset");
    const loadPresetButton = document.getElementById("load-preset");
    const presetList = document.getElementById("preset-list");
    
    const drumSounds = [
        "kick", "snare", "closedHihat", "openHihat", "lowTom", "mediumTom", "highTom", "crash"
    ];
    
    let currentStep = 0;
    let isPlaying = false;
    let interval;
    let presets = JSON.parse(localStorage.getItem("drumPresets")) || [];
    
    function playSound(sound) {
        const audio = new Audio(`sounds/${sound}.wav`);
        audio.volume = volumeControl.value;
        audio.play();
        animateVisualizer();
    }
    
    gridCells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            cell.classList.toggle("active");
        });
    });
    
    function stepSequencer() {
        const step = currentStep % 16;
        gridCells.forEach((cell, index) => {
            if (index % 16 === step && cell.classList.contains("active")) {
                playSound(drumSounds[Math.floor(index / 16)]);
            }
        });
        currentStep++;
        requestAnimationFrame(() => setTimeout(stepSequencer, 60000 / tempoControl.value / 4));
    }
    
    function startPlayback() {
        if (!isPlaying) {
            isPlaying = true;
            stepSequencer();
        }
    }
    
    function stopPlayback() {
        isPlaying = false;
    }
    
    playButton.addEventListener("click", () => {
        if (isPlaying) {
            stopPlayback();
            playButton.textContent = "Play";
        } else {
            startPlayback();
            playButton.textContent = "Stop";
        }
    });
    
    tempoControl.addEventListener("input", () => {
        if (isPlaying) {
            stopPlayback();
            startPlayback();
        }
    });
    
    // Improved Visualizer Effect
    function animateVisualizer() {
        visualizer.style.transform = `scale(${Math.random() * 0.5 + 1})`;
        visualizer.style.opacity = Math.random() * 0.5 + 0.5;
    }
    
    // Preset Saving & Loading
    function savePreset() {
        const preset = Array.from(gridCells).map(cell => cell.classList.contains("active"));
        presets.push(preset);
        localStorage.setItem("drumPresets", JSON.stringify(presets));
        updatePresetList();
    }
    
    function loadPreset(index) {
        const preset = presets[index];
        gridCells.forEach((cell, i) => {
            cell.classList.toggle("active", preset[i]);
        });
    }
    
    function updatePresetList() {
        presetList.innerHTML = "";
        presets.forEach((_, index) => {
            const btn = document.createElement("button");
            btn.textContent = `Preset ${index + 1}`;
            btn.addEventListener("click", () => loadPreset(index));
            presetList.appendChild(btn);
        });
    }
    
    savePresetButton.addEventListener("click", savePreset);
    updatePresetList();
});
