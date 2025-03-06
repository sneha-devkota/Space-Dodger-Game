// script.js

let spaceship = document.getElementById('spaceship');
let gameSound = document.getElementById('gameSound');
let gameArea = document.getElementById('gameArea');
let scoreDisplay = document.getElementById('score');

let spaceshipX = 50; // Initial horizontal position of spaceship (in percentage)
let moveSpeed = 5;  // Speed at which the spaceship moves
let score = 0; // Initialize the score

let asteroids = []; // Array to store asteroids

// Set spaceship position initially and use rocket emoji
spaceship.textContent = '🚀'; // Rocket emoji for the spaceship
spaceship.style.left = spaceshipX + '%';
spaceship.style.fontSize = '50px'; // Adjust the font size of the spaceship emoji

// Event listener for arrow key movements
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && spaceshipX > 0) {
        spaceshipX -= moveSpeed;
        spaceship.style.left = spaceshipX + '%';
    } else if (event.key === 'ArrowRight' && spaceshipX < 90) {
        spaceshipX += moveSpeed;
        spaceship.style.left = spaceshipX + '%';
    }
});

// Play background sound on key press
document.addEventListener('keydown', function() {
    if (gameSound) {
        gameSound.play().catch(error => {
            console.log("Sound play error: ", error.message);
        });
    }
});

// Create a new asteroid using an emoji
function createAsteroid() {
    let asteroid = document.createElement('span');
    asteroid.classList.add('asteroid');
    asteroid.textContent = '🌑'; // Moon emoji for the asteroid

    // Randomly position the asteroid horizontally within the game area
    let randomX = Math.random() * 100;
    asteroid.style.left = randomX + '%';
    
    // Set a random size for the asteroid
    let size = Math.random() * (60 - 30) + 30; // Size between 30px and 60px
    asteroid.style.fontSize = `${size}px`; // Set the emoji size

    // Add the asteroid to the game area
    gameArea.appendChild(asteroid);

    // Push the asteroid to the asteroids array for collision detection
    asteroids.push(asteroid);
    
    // Set a random speed for the asteroid
    let speed = Math.random() * (5 - 2) + 2; // Speed between 2 and 5

    // Animate the asteroid's movement downwards
    asteroid.style.animationDuration = `${speed}s`;

    // Remove asteroid once it reaches the bottom
    setTimeout(() => {
        if (gameArea.contains(asteroid)) {
            gameArea.removeChild(asteroid);
        }
        asteroids = asteroids.filter(a => a !== asteroid);
        // Update score when asteroid reaches bottom
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
    }, speed * 1000);
}

// Adjusted bounding box function
function getAdjustedBoundingBox(rect, reductionFactor) {
    const widthReduction = rect.width * reductionFactor;
    const heightReduction = rect.height * reductionFactor;

    return {
        top: rect.top + heightReduction / 2,
        right: rect.right - widthReduction / 2,
        bottom: rect.bottom - heightReduction / 2,
        left: rect.left + widthReduction / 2,
    };
}

// Collision detection function (Updated)
function checkCollision(asteroid) {
    let asteroidRect = asteroid.getBoundingClientRect();
    let spaceshipRect = spaceship.getBoundingClientRect();

    // Reduce bounding boxes for more accurate collision detection
    let adjustedAsteroidRect = getAdjustedBoundingBox(asteroidRect, 0.2); // 20% reduction
    let adjustedSpaceshipRect = getAdjustedBoundingBox(spaceshipRect, 0.2); // 20% reduction
    
    // Check if the spaceship collides with any asteroid
    if (
        adjustedAsteroidRect.right > adjustedSpaceshipRect.left &&
        adjustedAsteroidRect.left < adjustedSpaceshipRect.right &&
        adjustedAsteroidRect.bottom > adjustedSpaceshipRect.top &&
        adjustedAsteroidRect.top < adjustedSpaceshipRect.bottom
    ) {
        // Collision detected: End the game or show a game over screen
        alert("Game Over!");
        location.reload(); // Reload the game
    }
}

// Game loop
function gameLoop() {
    // Check for collision with all asteroids
    asteroids.forEach(asteroid => {
        checkCollision(asteroid);
    });

    // Generate new asteroids
    if (Math.random() < 0.02) { // 2% chance to create an asteroid every frame
        createAsteroid();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();  // Start the game loop
