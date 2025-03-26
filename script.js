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
    const gridContainer = document.querySelector(".grid");
    const visualizer = document.getElementById("visualizer");

    let presets = JSON.parse(localStorage.getItem("drumPresets")) || [];
    let currentStep = 0;
    let isPlaying = false;
    let isMuted = false;
    let activePreset = null;
    let interval;

    function generateGrid() {
        gridContainer.innerHTML = "";
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 16; col++) {
                const cell = document.createElement("div");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.classList.add("grid-cell");
                gridContainer.appendChild(cell);

                cell.addEventListener("click", () => {
                    cell.classList.toggle("active");
                });
            }
        }
    }

    function savePreset() {
        const presetName = presetNameInput.value.trim();
        if (!presetName) return;
        
        const existingIndex = presets.findIndex(p => p.name === presetName);
        const preset = { 
            name: presetName, 
            volume: masterVolume.value, 
            tempo: tempo.value, 
            swing: swing.value,
            kit: kitSelector.value,
            effect: effectSelector.value,
            pattern: Array.from(gridContainer.children).map(cell => cell.classList.contains("active"))
        };
        
        if (existingIndex !== -1) {
            if (!confirm(`Preset \"${presetName}\" already exists. Overwrite?`)) return;
            presets[existingIndex] = preset;
        } else {
            presets.push(preset);
        }
        
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
        gridContainer.querySelectorAll(".grid-cell").forEach((cell, i) => {
            cell.classList.toggle("active", preset.pattern[i]);
        });
        activePreset = index;
        highlightActivePreset();
    }
    
    function highlightActivePreset() {
        document.querySelectorAll(".preset-item").forEach((item, i) => {
            item.classList.toggle("active-preset", i === activePreset);
        });
    }
    
    window.deletePreset = function(index) {
        if (!confirm("Are you sure you want to delete this preset?")) return;
        presets.splice(index, 1);
        localStorage.setItem("drumPresets", JSON.stringify(presets));
        updatePresetList();
        activePreset = null;
        highlightActivePreset();
    };
    
    function updatePresetList() {
        presetList.innerHTML = "";
        presets.forEach((preset, index) => {
            const div = document.createElement("div");
            div.classList.add("preset-item");
            if (index === activePreset) div.classList.add("active-preset");
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
        gridContainer.querySelectorAll(".grid-cell").forEach((cell, index) => {
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
            masterVolume.dataset.previousVolume = masterVolume.value;
            masterVolume.value = 0;
        } else {
            masterVolume.value = masterVolume.dataset.previousVolume || 1;
        }
    }

    playButton.addEventListener("click", () => {
        isPlaying ? stopPlayback() : startPlayback();
    });
    
    muteButton.addEventListener("click", toggleMute);
    savePresetButton.addEventListener("click", savePreset);
    
    generateGrid();
    updatePresetList();
});
