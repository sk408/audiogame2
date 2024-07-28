document.addEventListener('DOMContentLoaded', function() {
    includeCanvasLogic(1, "#00f", 12, 13);
    includeCanvasLogic(2, "#f00", 12, 13);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
});

function handleKeyDown(e) {
    if (e.key === 's') {
        const x = lastX;
        const y = lastY;
        placeDot(x, y, lastCanvas);
    } else if (e.key === ' ') {
        startAudio();
    }
}

function handleKeyUp(e) {
    if (e.key === ' ') {
        stopAudio();
    }
}

function handleResize() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        canvas.width = window.innerWidth / 4;
        canvas.height = window.innerHeight * 0.8;

        const ctx = canvas.getContext('2d');
        const gridSizeX = canvas.width / 12;
        const gridSizeY = canvas.height / 13;

        updateDotsPosition(canvas, gridSizeX, gridSizeY);
        redrawCanvas(ctx, gridSizeX, gridSizeY);
        updateGrid(canvas.id.slice(-1));
    });
}

function updateDotsPosition(canvas, newGridSizeX, newGridSizeY) {
    const oldGridSizeX = canvas.width / 12;
    const oldGridSizeY = canvas.height / 13;

    dots.forEach(dot => {
        dot.x = Math.round(dot.x / oldGridSizeX) * newGridSizeX;
        dot.y = Math.round(dot.y / (oldGridSizeY/2)) * (newGridSizeY/2);
    });
}

let lastX, lastY, lastCanvas;

document.addEventListener('click', function(e) {
    const canvas1 = document.getElementById('gridCanvas1');
    const canvas2 = document.getElementById('gridCanvas2');
    const rect1 = canvas1.getBoundingClientRect();
    const rect2 = canvas2.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x >= rect1.left && x <= rect1.right && y >= rect1.top && y <= rect1.bottom) {
        lastCanvas = 1;
    } else if (x >= rect2.left && x <= rect2.right && y >= rect2.top && y <= rect2.bottom) {
        lastCanvas = 2;
    }

    const canvas = document.getElementById(`gridCanvas${lastCanvas}`);
    const rect = canvas.getBoundingClientRect();
    const gridSizeX = canvas.width / 12;
    const gridSizeY = canvas.height / 13;

    lastX = Math.round((x - rect.left) / gridSizeX) * gridSizeX;
    lastY = Math.round((y - rect.top) / (gridSizeY / 2)) * (gridSizeY / 2);
});

let score = 0;

function updateScore(points) {
    score += points;
    document.getElementById(`scoreDisplay${lastCanvas}`).textContent = `Score: ${score}`;
}

let randomDecibelLevels = [];

function generateRandomDecibelLevels() {
    const frequencies = [0, 125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    randomDecibelLevels = frequencies.map((frequency) => {
        const randomValue = Math.random();
        let decibelValue;
        if (frequency <= 2000) {
            if (randomValue < 0.55) {
                decibelValue = 5 + Math.floor(Math.random() * ((40 - 5) / 5 + 1)) * 5;
            } else if (randomValue < 0.85) {
                decibelValue = 40 + Math.floor(Math.random() * ((60 - 40) / 5 + 1)) * 5;
            } else if (randomValue < 0.95) {
                decibelValue = 60 + Math.floor(Math.random() * ((80 - 60) / 5 + 1)) * 5;
            } else {
                decibelValue = 80 + Math.floor(Math.random() * ((115 - 80) / 5 + 1)) * 5;
            }
        } else {
            if (randomValue < 0.35) {
                decibelValue = 5 + Math.floor(Math.random() * ((40 - 5) / 5 + 1)) * 5;
            } else if (randomValue < 0.70) {
                decibelValue = 40 + Math.floor(Math.random() * ((60 - 40) / 5 + 1)) * 5;
            } else if (randomValue < 0.93) {
                decibelValue = 60 + Math.floor(Math.random() * ((80 - 60) / 5 + 1)) * 5;
            } else {
                decibelValue = 80 + Math.floor(Math.random() * ((115 - 80) / 5 + 1)) * 5;
            }
        }
        return decibelValue;
    });
}

document.querySelectorAll('[id^="randomButton"]').forEach(button => {
    button.addEventListener('click', function() {
        generateRandomDecibelLevels();
        console.log("Random decibel levels generated for each frequency:", randomDecibelLevels);
    });
});

generateRandomDecibelLevels();
