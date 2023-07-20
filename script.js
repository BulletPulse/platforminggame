document.addEventListener("DOMContentLoaded", () => {
    const player = document.getElementById("player");
    const start = document.getElementById("start");
    const finish = document.getElementById("finish");
    const obstacles = document.getElementsByClassName("obstacle");

    let playerX = 50;
    let playerY = 250;
    let movingLeft = false;
    let movingRight = false;
    let jumping = false;
    let jumpForce = 12;
    let gravity = 0.6;
    let velocityY = 0;

    const moveSpeed = 5;

    // Set focus to the game container so that it can receive keyboard input
    const gameContainer = document.getElementById("game-container");
    gameContainer.setAttribute("tabindex", "0");
    gameContainer.focus();

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "a":
                movingLeft = true;
                break;
            case "d":
                movingRight = true;
                break;
            case "w":
                if (!jumping) {
                    jumping = true;
                    velocityY = -jumpForce;
                }
                break;
        }
    });

    document.addEventListener("keyup", (event) => {
        switch (event.key) {
            case "a":
                movingLeft = false;
                break;
            case "d":
                movingRight = false;
                break;
        }
    });

    function movePlayer() {
        if (movingLeft && playerX > 0) {
            playerX -= moveSpeed;
        }
        if (movingRight && playerX + player.clientWidth < gameContainer.clientWidth) {
            playerX += moveSpeed;
        }

        // Apply gravity
        velocityY += gravity;
        playerY += velocityY;

        // Collision with the ground (Adjust the ground level as needed)
        const groundLevel = 225;
        if (playerY >= groundLevel) {
            playerY = groundLevel;
            velocityY = 0;
            jumping = false;
        }

        // Obstacle collision detection
        for (const obstacle of obstacles) {
            if (
                playerX + player.clientWidth > obstacle.offsetLeft &&
                playerX < obstacle.offsetLeft + obstacle.clientWidth &&
                playerY + player.clientHeight > obstacle.offsetTop &&
                playerY < obstacle.offsetTop + obstacle.clientHeight
            ) {
                // Collision detected, stop the player from moving
                if (velocityY > 0 && playerY + player.clientHeight - velocityY <= obstacle.offsetTop) {
                    playerY = obstacle.offsetTop - player.clientHeight;
                    velocityY = 0;
                    jumping = false;
                } else if (velocityY < 0 && playerY - velocityY >= obstacle.offsetTop + obstacle.clientHeight) {
                    playerY = obstacle.offsetTop + obstacle.clientHeight;
                    velocityY = 0;
                } else if (movingLeft && playerX + player.clientWidth - moveSpeed <= obstacle.offsetLeft) {
                    playerX = obstacle.offsetLeft - player.clientWidth;
                } else if (movingRight && playerX + moveSpeed >= obstacle.offsetLeft + obstacle.clientWidth) {
                    playerX = obstacle.offsetLeft + obstacle.clientWidth;
                }
            }
        }

        // Check if the player has reached the finish line
        if (
            playerX + player.clientWidth >= finish.offsetLeft &&
            playerX <= finish.offsetLeft + finish.clientWidth &&
            playerY + player.clientHeight >= finish.offsetTop &&
            playerY <= finish.offsetTop + finish.clientHeight
        ) {
            alert("Congratulations! You reached the finish!");
            resetGame();
        }

        player.style.left = playerX + "px";
        player.style.top = playerY + "px";
    }

    function resetGame() {
        playerX = 50;
        playerY = 250;
        movingLeft = false;
        movingRight = false;
        jumping = false;
        velocityY = 0;
        player.style.left = playerX + "px";
        player.style.top = playerY + "px";
    }

    setInterval(movePlayer, 16);
});
