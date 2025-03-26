document.addEventListener("DOMContentLoaded", () => {
    const gridCells = document.querySelectorAll(".grid div");
    const playButton = document.getElementById("play");
    const tempoControl = document.getElementById("tempo");
    const volumeControl = document.getElementById("volume");
    const swingControl = document.getElementById("swing");
    const visualizer = document.getElementById("visualizer");
    
    const drumSounds = [
        "kick", "snare", "closedHihat", "openHihat", "lowTom", "mediumTom", "highTom", "crash"
    ];
    
    let currentStep = 0;
    let isPlaying = false;
    let interval;
    
    function playSound(sound) {
        const audio = new Audio(`sounds/${sound}.wav`);
        audio.volume = volumeControl.value;
        audio.play();
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
    }
    
    function startPlayback() {
        if (!isPlaying) {
            isPlaying = true;
            interval = setInterval(stepSequencer, 60000 / tempoControl.value / 4);
        }
    }
    
    function stopPlayback() {
        isPlaying = false;
        clearInterval(interval);
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
            clearInterval(interval);
            startPlayback();
        }
    });
    
    // Visualizer Effect
    function animateVisualizer() {
        visualizer.style.transform = `scale(${Math.random() * 0.5 + 1})`;
        requestAnimationFrame(animateVisualizer);
    }
    animateVisualizer();
    
});
