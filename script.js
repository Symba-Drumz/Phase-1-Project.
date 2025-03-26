document.addEventListener("DOMContentLoaded", () => {
    const gridCells = document.querySelectorAll(".grid div");
    const playButton = document.getElementById("play");
    const tempoControl = document.getElementById("tempo");
    const volumeControl = document.getElementById("master-volume");
    const swingControl = document.getElementById("swing");
    const visualizer = document.getElementById("visualizer");
    const savePresetButton = document.getElementById("save-preset");
    const presetList = document.getElementById("preset-list");

    const drumSounds = [
        "kick", "snare", "closedHihat", "openHihat", "lowTom", "mediumTom", "highTom", "crash"
    ];

    let currentStep = 0;
    let isPlaying = false;
    let presets = JSON.parse(localStorage.getItem("drumPresets")) || [];

    function playSound(sound) {
        const audio = new Audio(`sounds/${sound}.wav`);
        audio.volume = volumeControl.value / 100; // Normalize volume
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
            cell.classList.remove("current-step"); // Remove highlight from previous step
            if (index % 16 === step) {
                cell.classList.add("current-step"); // Highlight active step
                if (cell.classList.contains("active")) {
                    playSound(drumSounds[Math.floor(index / 16)]);
                }
            }
        });
        currentStep++;
        requestAnimationFrame(() => setTimeout(stepSequencer, 60000 / tempoControl.value / 4));
    }

    function startPlayback() {
        if (!isPlaying) {
            isPlaying = true;
            stepSequencer();
            playButton.classList.add("playing");
            playButton.textContent = "Stop";
        }
    }

    function stopPlayback() {
        isPlaying = false;
        playButton.classList.remove("playing");
        playButton.textContent = "Play";
    }

    playButton.addEventListener("click", () => {
        if (isPlaying) {
            stopPlayback();
        } else {
            startPlayback();
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
        visualizer.style.transform = `scale(${Math.random() * 0.5 + 1.2})`;
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
        presetList.innerHTML = ""; // Clear existing list
        presets.forEach((_, index) => {
            const presetContainer = document.createElement("div");
            presetContainer.classList.add("preset-item");

            // Create Load Button
            const loadBtn = document.createElement("button");
            loadBtn.textContent = `Load Preset ${index + 1}`;
            loadBtn.addEventListener("click", () => loadPreset(index));

            // Create Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-preset");
            deleteBtn.addEventListener("click", () => deletePreset(index));

            // Append buttons to container
            presetContainer.appendChild(loadBtn);
            presetContainer.appendChild(deleteBtn);
            presetList.appendChild(presetContainer);
        });
    }

    function deletePreset(index) {
        presets.splice(index, 1); // Remove from array
        localStorage.setItem("drumPresets", JSON.stringify(presets)); // Update localStorage
        updatePresetList(); // Refresh the list
    }

    savePresetButton.addEventListener("click", savePreset);
    updatePresetList();
});
