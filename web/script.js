document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('game-board');
    const caughtMiceSpan = document.getElementById('caught-mice');
    const safeMiceSpan = document.getElementById('safe-mice');
    const gameOverMessage = document.getElementById('game-over-message');
    const resetButton = document.getElementById('reset-button');

    const GRID_WIDTH = 40;
    const GRID_HEIGHT = 20;
    const CELL_SIZE = 20; // in pixels

    let cat, mice, houses;
    let caughtMice = 0;
    let safeMice = 0;
    let gameOver = false;
    let catMoveCount = 0;

    class Entity {
        constructor(y, x, className, char) {
            this.y = y;
            this.x = x;
            this.element = document.createElement('div');
            this.element.className = `entity ${className}`;
            this.element.textContent = char;
            this.updatePosition();
            boardElement.appendChild(this.element);
        }

        updatePosition() {
            this.element.style.top = `${this.y * CELL_SIZE}px`;
            this.element.style.left = `${this.x * CELL_SIZE}px`;
        }
        
        hide() {
            this.element.style.display = 'none';
        }
    }

    class Cat extends Entity {
        constructor(y, x) {
            super(y, x, 'cat', '🐈');
        }
    }

    class Mouse extends Entity {
        constructor(y, x, id) {
            super(y, x, 'mouse', '🐁');
            this.id = id;
            this.safe = false;
        }
    }

    class House extends Entity {
        constructor(y, x) {
            super(y, x, 'house', '🏠');
            this.occupied_by_mouse_id = null;
        }
    }

    function generateRandomPosition(occupied) {
        let y, x, posKey;
        do {
            y = Math.floor(Math.random() * GRID_HEIGHT);
            x = Math.floor(Math.random() * GRID_WIDTH);
            posKey = `${y},${x}`;
        } while (occupied.has(posKey));
        occupied.add(posKey);
        return { y, x };
    }

    function initializeGame() {
        // Clear board
        boardElement.innerHTML = '';
        
        // Reset state
        const occupiedPositions = new Set();
        
        const catPos = generateRandomPosition(occupiedPositions);
        cat = new Cat(catPos.y, catPos.x);

        mice = [];
        for (let i = 1; i <= 3; i++) {
            const mousePos = generateRandomPosition(occupiedPositions);
            mice.push(new Mouse(mousePos.y, mousePos.x, i));
        }

        houses = [];
        for (let i = 0; i < 3; i++) {
            const housePos = generateRandomPosition(occupiedPositions);
            houses.push(new House(housePos.y, housePos.x));
        }
        
        caughtMice = 0;
        safeMice = 0;
        gameOver = false;
        catMoveCount = 0;
        
        updateStatus();
        gameOverMessage.classList.add('hidden');
        resetButton.classList.add('hidden');
    }
    
    function moveMice() {
        const availableHouses = houses.filter(h => h.occupied_by_mouse_id === null);

        mice.forEach(mouse => {
            if (mouse.safe || (mouse.y === cat.y && mouse.x === cat.x)) {
                return;
            }

            if (availableHouses.length === 0) {
                return;
            }

            let nearestHouse = availableHouses[0];
            let minDistance = Infinity;

            availableHouses.forEach(house => {
                const distance = Math.abs(mouse.y - house.y) + Math.abs(mouse.x - house.x);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestHouse = house;
                }
            });

            if (mouse.y < nearestHouse.y) mouse.y++;
            else if (mouse.y > nearestHouse.y) mouse.y--;

            if (mouse.x < nearestHouse.x) mouse.x++;
            else if (mouse.x > nearestHouse.x) mouse.x--;
            
            mouse.updatePosition();
        });
    }

    function checkCollisions() {
        // Cat and Mice
        mice.forEach(mouse => {
            if (!mouse.safe && cat.y === mouse.y && cat.x === mouse.x) {
                mouse.safe = true; // Effectively remove from play
                mouse.hide();
                caughtMice++;
            }
        });

        // Mice and Houses
        mice.forEach(mouse => {
            if (!mouse.safe) {
                houses.forEach(house => {
                    if (house.occupied_by_mouse_id === null && mouse.y === house.y && mouse.x === house.x) {
                        mouse.safe = true;
                        mouse.hide();
                        house.occupied_by_mouse_id = mouse.id;
                        house.element.textContent = '🏡'; // "Lights on" emoji
                        house.element.classList.add('occupied'); // For styling
                        safeMice++;
                    }
                });
            }
        });
        
        updateStatus();
        checkGameOver();
    }

    function updateStatus() {
        caughtMiceSpan.textContent = caughtMice;
        safeMiceSpan.textContent = safeMice;
    }

    function checkGameOver() {
        if (gameOver) return;

        if (safeMice + caughtMice === mice.length) {
            gameOver = true;
            let msg = '';
            if (safeMice === mice.length) {
                msg = "All mice are safe! You lose. 😿";
            } else if (caughtMice === mice.length) {
                msg = "You caught all the mice! You win! 🏆";
            } else {
                msg = "Game over! A valiant effort. 🐾";
            }
            gameOverMessage.textContent = msg;
            gameOverMessage.classList.remove('hidden');
            resetButton.classList.remove('hidden');
        }
    }

    function handleKeyPress(e) {
        if (gameOver) {
            return;
        }

        let targetY = cat.y;
        let targetX = cat.x;

        switch (e.key) {
            case 'ArrowUp':
                targetY--;
                break;
            case 'ArrowDown':
                targetY++;
                break;
            case 'ArrowLeft':
                targetX--;
                break;
            case 'ArrowRight':
                targetX++;
                break;
            default:
                return; // Ignore other keys
        }

        // If no key was pressed that would cause a move
        if (targetY === cat.y && targetX === cat.x) {
            return;
        }

        // Clamp to grid boundaries
        targetY = Math.max(0, Math.min(GRID_HEIGHT - 1, targetY));
        targetX = Math.max(0, Math.min(GRID_WIDTH - 1, targetX));

        // If move was against a boundary, it might not be a "new" move
        if (targetY === cat.y && targetX === cat.x) {
            return;
        }
        
        // Check if the target is a house
        const isBlockedByHouse = houses.some(h => h.y === targetY && h.x === targetX);
        if (isBlockedByHouse) {
            return; // Cat cannot enter a house
        }

        // It's a valid move
        cat.y = targetY;
        cat.x = targetX;
        
        cat.updatePosition();
        catMoveCount++;
        if (catMoveCount % 2 === 0) {
            moveMice();
        }
        checkCollisions();
    }

    // --- Main ---
    initializeGame();
    resetButton.addEventListener('click', initializeGame);
    window.addEventListener('keydown', handleKeyPress);
}); 