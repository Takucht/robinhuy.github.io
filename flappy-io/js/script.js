var character, scoreArea;
var obstacles = [];

var gameArea = {
    canvas: document.createElement('canvas'),
    start: function () {
        // Create canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (window.innerWidth > 768) {
            this.canvas.width = 480;
            this.canvas.height = 270;
            // this.canvas.width = window.innerWidth * 70 / 100;
            // this.canvas.height = window.innerHeight * 50 / 100;
        }
        this.context = this.canvas.getContext('2d');

        // Insert canvas to body
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        // Update game area every 20ms
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function startGame() {
    character = new GameComponent(30, 30, 'img/io.png', 10, 120, 'image');
    character.gravity = 0.2;
    // scoreArea = new GameComponent("30px", "Consolas", "black", 280, 40, "text");
    gameArea.start();
}

function GameComponent(width, height, model, x, y, type) {
    this.type = type;
    if (type == 'image') {
        this.image = new Image();
        this.image.src = model;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;

    this.update = function () {

        var ctx = gameArea.context;

        if (type == "image") {
            if (this.angle == 0) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.translate(-12, 0);
                ctx.drawImage(this.image, this.x, 0, this.width, this.height);
                ctx.restore();
            }
        } else {
            ctx.fillStyle = model;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    };

    this.newPosition = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;

        this.y += this.speedY + this.gravitySpeed;
        this.hitTopOrBottom();
    };

    this.hitTopOrBottom = function () {
        var touchBottom = gameArea.canvas.height - this.height;

        if (this.y > touchBottom) {
            this.y = touchBottom;
            this.gravitySpeed = 0;
        }

        if (this.y < 0) {
            this.y = 0;
        }
    };

    this.crashWith = function (otherObj) {
        var left = this.x;
        var right = this.x + this.width;
        var top = this.y;
        var bottom = this.y + this.height;
        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + (otherObj.width);
        var otherTop = otherObj.y;
        var otherBottom = otherObj.y + (otherObj.height);
        var crash = true;

        if (bottom < otherTop || top > otherBottom || right < otherLeft || left > otherRight) {
            crash = false;
        }

        return crash;
    }
}

function updateGameArea() {
    var canvasWidth, canvasHeight, height, gap, minHeight, maxHeight, minGap, maxGap;

    // Game over when character hit obstacles
    for (i = 0; i < obstacles.length; i++) {
        if (character.crashWith(obstacles[i])) {
            return;
        }
    }

    gameArea.clear();
    gameArea.frameNo += 1;

    // Add obstacles every 150px
    if (gameArea.frameNo == 1 || (gameArea.frameNo / 150) % 1 == 0) {
        canvasWidth = gameArea.canvas.width;
        canvasHeight = gameArea.canvas.height;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        // Add top obstacle
        obstacles.push(new GameComponent(20, height, "green", canvasWidth, 0));

        // Add bottom obstacle
        obstacles.push(new GameComponent(20, canvasHeight - height - gap, "green", canvasWidth, height + gap));
    }

    // Move obstacles to left 1px
    for (i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 1;
        obstacles[i].update();
    }

    // scoreArea.text = "SCORE: " + gameArea.frameNo;
    // scoreArea.update();
    character.newPosition();
    character.update();
}

function moveUp() {
        if (character.y > 0) {
            character.gravity = -0.4;
            character.angle = -15 * Math.PI / 180;
        }
}

function moveDown() {
    if (character.y < gameArea.canvas.height - character.height) {
        character.gravity = 0.2;
        character.angle = 0;
    }
}

function stopMove() {
    character.speedX = 0;
    character.speedY = 0;
}