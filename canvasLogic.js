function includeCanvasLogic(canvasId, color, numSquaresX, numSquaresY) {
    const canvas = document.getElementById(`gridCanvas${canvasId}`);
    const ctx = canvas.getContext('2d');
    const dotRadius = 8;
    let dots = [];
    let gridSizeX, gridSizeY;
    canvas.width = window.innerWidth / 4;
    canvas.height = window.innerHeight * .8;

    function redrawCanvas(gridSizeX, gridSizeY) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const frequencies = [0, 125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
        const decibels = Array.from({ length: canvas.height / gridSizeY + 1 }, (_, i) => -10 + i * 10);
        const decibelsHalf = Array.from({ length: canvas.height / (gridSizeY / 2) + 1 }, (_, i) => -10 + i * 5);
        ctx.fillStyle = color;
        for (let i = 0; i <= frequencies.length; i++) {
            const x = i * gridSizeX;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.fillText(frequencies[i] + "hz" || '', x + 5, 15);
        }
        for (let i = 0; i <= decibels.length; i++) {
            const y = i * gridSizeY;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.fillText(decibels[i] + "dB" || '', 5, y - 5);
        }
        for (let i = 0; i <= decibelsHalf.length; i++) {
            const y = i * (gridSizeY / 2);
            ctx.fillText(decibelsHalf[i] + "dB" || '', 5, y - 5);
        }
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
        for (let dot of dots) {
            drawDot(dot.x, dot.y);
        }
        dots.sort((a, b) => a.x - b.x);
        for (let i = 0; i < dots.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[i + 1].x, dots[i + 1].y);
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
    }

    let dotColor = color;

    function drawDot(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
    }

    function placeDot(x, y, currentId) {
        dots = dots.filter(dot => dot.x !== x);
        dots.push({ x, y });
        redrawCanvas();
        updateGrid();
        const frequencyIndex = Math.floor(x / gridSizeX);
        const decibelLevel = -10 + Math.floor(y / (gridSizeY / 2)) * 5;
        if (randomDecibelLevels[frequencyIndex] === decibelLevel && currentId === canvasId) {
            updateScore(1000);
        } else if (randomDecibelLevels[frequencyIndex] !== decibelLevel && currentId === canvasId) {
            updateScore(-5000);
        }
    }

    function removeDot(index) {
        dots.splice(index, 1);
        redrawCanvas()
        updateGrid();
    }

    function updateGrid() {
        gridSizeX = canvas.width / numSquaresX;
        gridSizeY = canvas.height / numSquaresY;
        redrawCanvas(gridSizeX, gridSizeY);
    }

    let clickCount = 0;
    canvas.addEventListener('click', function (e) {
        clickCount++;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const lastY = Math.round(mouseY / (gridSizeY / 2)) * (gridSizeY / 2);
        const lastX = Math.round(mouseX / gridSizeX) * gridSizeX;
        setTimeout(() => {
            if (clickCount >= 2) {
                const gridY = Math.round(mouseY / (gridSizeY / 2)) * (gridSizeY / 2);
                const gridX = Math.round(mouseX / gridSizeX) * gridSizeX;
                const dotIndex = dots.findIndex(dot => dot.x === gridX && dot.y === gridY);
                if (dotIndex !== -1) {
                    removeDot(dotIndex);
                } else {
                    placeDot(gridX, gridY, canvasId);
                }
            }
            clickCount = 0;
        }, 200);
    });

    const decibelIndicator = document.getElementById(`decibelIndicator${canvasId}`);
    let indicatorInterval;
    canvas.addEventListener('mousedown', function (e) {
        decibelIndicator.classList.add('flashing');
        const rect = canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const gridY = Math.round(mouseY / (gridSizeY / 2)) * (gridSizeY / 2);
        const decibelIndex = gridY / (gridSizeY / 2);
        const decibelLevel = -10 + decibelIndex * 5;
        decibelIndicator.textContent = `Decibel Level: ${decibelLevel}dB`;
        indicatorInterval = setInterval(() => {
            const rect = canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            const gridY = Math.round(mouseY / (gridSizeY / 2)) * (gridSizeY / 2);
            const decibelIndex = gridY / (gridSizeY / 2);
            const decibelLevel = -10 + decibelIndex * 5;
            decibelIndicator.textContent = `Decibel Level: ${decibelLevel}dB`;
        }, 500);
    });

    canvas.addEventListener('mouseup', function (e) {
        decibelIndicator.classList.remove('flashing');
        clearInterval(indicatorInterval);
        setTimeout(() => {
            document.getElementById(`randomButton${canvasId}`).classList.remove('lightUp');
        }, 100);
    });

    canvas.addEventListener('mousedown', function (e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridY = Math.round(mouseY / (gridSizeY / 2)) * (gridSizeY / 2);
        const decibelIndex = gridY / (gridSizeY / 2);
        const decibelLevel = -10 + decibelIndex * 5;
        const gridX = Math.round(mouseX / gridSizeX) * gridSizeX;
        const frequencyIndex = Math.floor(gridX / gridSizeX);
        const randomChance = Math.random();
        if (randomDecibelLevels[frequencyIndex] <= decibelLevel || randomChance < 0.1) {
            document.getElementById(`randomButton${canvasId}`).classList.add('lightUp');
        } else {
            document.getElementById(`randomButton${canvasId}`).classList.remove('lightUp');
        }
    });

    let tempX = null;
    let flashInterval = null;
    let holdStart;
    let holdTimeout;

    canvas.addEventListener('mousedown', function (e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridY = Math.round(mouseY / (gridSizeY / 2)) * (gridSizeY / 2);
        const gridX = Math.round(mouseX / gridSizeX) * gridSizeX;
        tempX = { x: gridX, y: gridY };
        holdStart = Date.now();
        holdTimeout = setTimeout(() => {
            flashInterval = setInterval(() => {
                ctx.beginPath();
                ctx.moveTo(gridX - 10, gridY - 10);
                ctx.lineTo(gridX + 10, gridY + 10);
                ctx.moveTo(gridX + 10, gridY - 10);
                ctx.lineTo(gridX - 10, gridY + 10);
                ctx.strokeStyle = 'red';
                ctx.stroke();
                setTimeout(() => {
                    redrawCanvas(gridSizeX, gridSizeY);
                }, 100);
            }, 300);
        }, 1);
    });

    canvas.addEventListener('mouseup', function (e) {
        if (tempX) {
            clearInterval(flashInterval);
            flashInterval = null;
            clearTimeout(holdTimeout);
            redrawCanvas(gridSizeX, gridSizeY);
            tempX = null;
        }
    });

    updateGrid();
}
