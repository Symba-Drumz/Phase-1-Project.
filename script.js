document.addEventListener("DOMContentLoaded", () => {
    const masterVolume = document.getElementById("master-volume");
    const tempo = document.getElementById("tempo");
    const swing = document.getElementById("swing");
    const playButton = document.getElementById("play");
    const muteButton = document.getElementById("mute");
    const clearButton = document.getElementById("clear");
    const savePresetButton = document.getElementById("save-preset");
    const presetNameInput = document.getElementById("preset-name");
    const presetList = document.getElementById("preset-list");
    const kitSelector = document.getElementById("kit-selector");
    const effectSelector = document.getElementById("effect-selector");
    const gridCells = document.querySelectorAll(".grid div");
    const visualizer = document.getElementById("visualizer");

    let presets = JSON.parse(localStorage.getItem("drumPresets")) || [];
    let currentStep = 0;
    let isPlaying = false;
    let isMuted = false;
    let interval;
    
    function savePreset() {
        const presetName = presetNameInput.value.trim();
        if (!presetName) return;
        const preset = { 
            name: presetName, 
            volume: masterVolume.value, 
            tempo: tempo.value, 
            swing: swing.value,
            kit: kitSelector.value,
            effect: effectSelector.value,
            pattern: Array.from(gridCells).map(cell => cell.classList.contains("active"))
        };
        presets.push(preset);
        localStorage.setItem("drumPresets", JSON.stringify(presets));
        updatePresetList();
    }
    
    function loadPreset(index) {
        const preset = presets[index];
        masterVolume.value = preset.volume;
        tempo.value = preset.tempo;
        swing.value = preset.swing;
        kitSelector.value = preset.kit;
        effectSelector.value = preset.effect;
        gridCells.forEach((cell, i) => {
            cell.classList.toggle("active", preset.pattern[i]);
        });
    }
    
    window.deletePreset = function(index) {
        presets.splice(index, 1);
        localStorage.setItem("drumPresets", JSON.stringify(presets));
        updatePresetList();
    };
    
    function updatePresetList() {
        presetList.innerHTML = "";
        presets.forEach((preset, index) => {
            const div = document.createElement("div");
            div.classList.add("preset-item");
            div.innerHTML = `
                <span>${preset.name}</span>
                <button onclick="loadPreset(${index})">Load</button>
                <button onclick="deletePreset(${index})">Delete</button>
            `;
            presetList.appendChild(div);
        });
    }
    
    function stepSequencer() {
        const step = currentStep % 16;
        gridCells.forEach((cell, index) => {
            cell.classList.remove("current-step");
            if (index % 16 === step) {
                cell.classList.add("current-step");
                if (cell.classList.contains("active")) {
                    playSound();
                }
            }
        });
        currentStep++;
        interval = setTimeout(stepSequencer, 60000 / tempo.value / 4);
    }

    function playSound() {
        if (!isMuted) {
            visualizer.style.transform = `scale(${Math.random() * 0.5 + 1.2})`;
            visualizer.style.opacity = Math.random() * 0.5 + 0.5;
        }
    }

    function startPlayback() {
        if (!isPlaying) {
            isPlaying = true;
            stepSequencer();
            playButton.textContent = "Stop";
        }
    }
    
    function stopPlayback() {
        isPlaying = false;
        clearTimeout(interval);
        playButton.textContent = "Play";
    }
    
    function toggleMute() {
        isMuted = !isMuted;
        muteButton.textContent = isMuted ? "Unmute" : "Mute";
        
        if (isMuted) {
            masterVolume.dataset.previousVolume = masterVolume.value; // Store current volume
            masterVolume.value = 0; // Mute
        } else {
            masterVolume.value = masterVolume.dataset.previousVolume || 1; // Restore volume
        }
    }
    
    playButton.addEventListener("click", () => {
        isPlaying ? stopPlayback() : startPlayback();
    });
    
    muteButton.addEventListener("click", toggleMute);
    savePresetButton.addEventListener("click", savePreset);
    updatePresetList();
});
