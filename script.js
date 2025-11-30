document.addEventListener('DOMContentLoaded', function() {

    const gridElement = document.getElementById('grid');
    const toolButtons = document.querySelectorAll('.tool-btn');
    const toolDescription = document.getElementById('tool-description');

    let selectedTool = null;
    

    const toolDescriptions = {
        shovel: 'Лопата - позволяет выкапывать посаженные растения.',
        bucket: 'Ведро - позволяет выливать в клетку Воду и забирать её, превращая её в Землю.',
        swamper: 'Семена болотника - позволяют посадить болотник. Требует высокую влажность (70-100%).',
        potato: 'Семена картошки - позволяют посадить картошку. Требует среднюю влажность (40-80%).',
        cactus: 'Семена кактуса - позволяют посадить кактус. Требует низкую влажность (0-30%).'
    };
    

    
    const grid = [];
    const gridSize = 6;
    

    for (let y = 0; y < gridSize; y++) {
        grid[y] = [];

        for (let x = 0; x < gridSize; x++) {
            var a = Math.round(Math.random(1))

            if (a == 1) {
                grid[y][x] = new Water(x, y);
            } else {
                grid[y][x] = new Earth(x, y);
            }

            gridElement.appendChild(grid[y][x].createElement());
        }
    }
    

    function updateGridDisplay() {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                grid[y][x].updateDisplay();
            }
        }
    }
    

    function calculateMoisture() {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (grid[y][x] instanceof Earth) {

                    let waterNeighbors = 0;

                    const neighbors = [
                        {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1}, // up
                        {dx: -1, dy: 0},                     {dx: 1, dy: 0},  // mid
                        {dx: -1, dy: 1},  {dx: 0, dy: 1},  {dx: 1, dy: 1}   // dwon
                    ];
                    
                    neighbors.forEach(neighbor => {
                        const nx = x + neighbor.dx;
                        const ny = y + neighbor.dy;
                        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                            if (grid[ny][nx] instanceof Water) {
                                waterNeighbors++;
                            }
                        }
                    });
                    

                    grid[y][x].moisture = Math.min(100, waterNeighbors * 12.5);
                }
            }
        }
    }
    

    function updateEntireGrid() {
        calculateMoisture();
        updateGridDisplay();
    }
    

    updateEntireGrid();
    
   
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {

            toolButtons.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');

            selectedTool = this.dataset.tool;
            

            toolDescription.textContent = toolDescriptions[selectedTool];
        });
    });
    

    gridElement.addEventListener('click', function(e) {
        if (!selectedTool) {
            alert('Сначала выберите инструмент!');
            return;
        }
        
        const cellElement = e.target.closest('.cell');
        if (!cellElement) return;
        
        const x = parseInt(cellElement.dataset.x);
        const y = parseInt(cellElement.dataset.y);
        
        const newCell = grid[y][x].handleClick(selectedTool);
        
        if (newCell !== grid[y][x]) {
            grid[y][x] = newCell;
            const newElement = newCell.createElement();
            gridElement.replaceChild(newElement, cellElement);
            
            updateEntireGrid();
        } else {
            updateGridDisplay();
        }
    });
    
    function growPlants() {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (grid[y][x] instanceof Earth && grid[y][x].plant) {
                    grid[y][x].plant.grow(grid[y][x].moisture);
                }
            }
        }
        updateGridDisplay();
    }
    
    setInterval(function() {
        growPlants();
    }, 3000);
});