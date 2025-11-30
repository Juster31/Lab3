class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.plant = null;
        this.element = null;
    }
    

    createElement() {
        const cell = document.createElement('div');
        cell.className = `cell ${this.type}`;
        cell.dataset.x = this.x;
        cell.dataset.y = this.y;
        this.element = cell;
        return cell;
    }
    

    updateDisplay() {
        if (!this.element) return;
        

        this.element.innerHTML = '';
        

        if (this.plant) {
            const img = document.createElement('img');
            img.src = this.plant.image;
            img.className = 'plant-image';
            img.alt = this.plant.name;
            
            const stage = document.createElement('div');
            stage.className = 'plant-stage';
            stage.textContent = this.plant.getStageText();
            
            this.element.appendChild(img);
            this.element.appendChild(stage);
        }
    }
    

    handleClick(tool) {
        calculateMoisture();
        updateGridDisplay();
        return this;
    }
}


class Water extends Cell {
    constructor(x, y) {
        super(x, y);
        this.type = 'water';
    }
    
    handleClick(tool) {
        if (tool === 'bucket') {

            const newCell = new Earth(this.x, this.y);
            newCell.moisture = 100; 
            return newCell;
        }
        return this;
    }
}


class Earth extends Cell {
    constructor(x, y) {
        super(x, y);
        this.type = 'earth';
        this.moisture = 0; 
    }
    

    updateDisplay() {
        if (!this.element) return;
        

        const hue = 45; 
        const saturation = 80; 
        const lightness = 80 - (this.moisture / 100) * 80; 
        
        this.element.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        this.element.innerHTML = '';
        
        if (!this.plant) {
            const moistureText = document.createElement('div');
            moistureText.className = 'moisture-text';
            moistureText.textContent = `${Math.round(this.moisture)}%`;
            moistureText.style.color = this.moisture > 50 ? 'white' : 'black';
            moistureText.style.fontSize = '12px';
            moistureText.style.fontWeight = 'bold';
            this.element.appendChild(moistureText);
        }
        
        if (this.plant) {
            const img = document.createElement('img');
            img.src = this.plant.image;
            img.className = 'plant-image';
            img.alt = this.plant.name;
            
            const stage = document.createElement('div');
            stage.className = 'plant-stage';
            stage.textContent = this.plant.getStageText();
            
            this.element.appendChild(img);
            this.element.appendChild(stage);
        }
    }
    
    handleClick(tool) {
        if (tool === 'bucket') {
            
            return new Water(this.x, this.y);
        } else if (tool === 'shovel' && this.plant) {

            this.plant = null;
            this.updateDisplay();
            return this;
        } else if (tool === 'swamper' && !this.plant) {

            this.plant = new Swamper();
            this.updateDisplay();
            return this;
        } else if (tool === 'potato' && !this.plant) {

            this.plant = new Potato();
            this.updateDisplay();
            return this;
        } else if (tool === 'cactus' && !this.plant) {

            this.plant = new Cactus();
            this.updateDisplay();
            return this;
        }
        return this;
    }
}


class Plant {
    constructor(name, image, minMoisture, maxMoisture) {
        this.name = name;
        this.image = image;
        this.minMoisture = minMoisture;
        this.maxMoisture = maxMoisture;
        this.growthStage = 0; 
        this.isDead = false;
    }

    getStageText() {
        if (this.isDead) return 'Dead';
        return this.growthStage;
    }
    

    grow(moisture) {
        if (this.isDead) return;
        

        if (moisture >= this.minMoisture && moisture <= this.maxMoisture) {
            if (this.growthStage < 3) {
                this.growthStage++;
            }
        } else {
            this.isDead = true;
        }
    }
}


class Swamper extends Plant {
    constructor() {
        super('Болотник', 'Swamper.jpg', 70, 100);
    }
}


class Potato extends Plant {
    constructor() {
        super('Картошка', 'Potato.png', 40, 80);
    }
}

class Cactus extends Plant {
    constructor() {
        super('Кактус', 'Cactus.png', 0, 30);
    }
}