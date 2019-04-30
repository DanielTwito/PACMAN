var context = canvas.getContext("2d");
var board;
var score;
var lives;
var pac_color;
var pacman;
var start_time;
var time_elapsed;
var interval;
var GHOSTS_NUM = 3;
var GHOSTS_COLORS = ["green", "red", "blue"];


class Character{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    getX(){
        return x;
    }

    getY(){
        return y;
    }

    setPosition(x,y) {
        this.x = x;
        this.y = y;
    }


    Draw(context){

    }

}

food = {
    big: {
        color: "red",
        value: 25,
        size: 16
    },
    medium:  {
        color: "blue",
        value: 15,
        size: 12
    },
    small:  {
        color: "black",
        value: 5,
        size: 9
    }
};

class Food extends Character{


    constructor(x,y,size){
        super(x,y);
        this.size=size;
    }

    getScore(){
        return food[this.size].value;
    }

    Draw(context) {
        var center = {};
        center.x = this.x * 60 + 30;
        center.y = this.y * 60 + 30;
        context.beginPath();
        context.arc(center.x, center.y,food[this.size].size, 0, 2 * Math.PI); // circle
        context.fillStyle = food[this.size].color; //color
        context.fill();
        context.font = "12px Arial";
        context.fillStyle = "white";
        context.fillText(food[this.size].value, center.x-4,center.y+3);
    }
}

class Wall extends Character{
    constructor(x,y){
        super(x, y);
    }
    Draw(context) {
        var center = {};
        center.x = this.x * 60 + 30;
        center.y = this.y * 60 + 30;
        context.beginPath();
        context.rect(center.x - 30, center.y - 30, 60, 60);
        context.fillStyle = "grey"; //color
        context.fill();
    }

}


class Pacman extends Character{


    constructor(x,y,color){
        super(x,y);
        this.color=color;
        this.direction = "Left";
    }

    Draw(context) {
        var center = {};
        center.x = this.x * 60 + 30;
        center.y = this.y * 60 + 30;
        context.beginPath();
        if(this.direction === "Right")
            context.arc(center.x, center.y, 30, (Math.PI / 180) * 40, (Math.PI / 180) * (320), false);
        if(this.direction === "Left")
            context.arc(center.x, center.y, 30, (Math.PI / 180) * 140, (Math.PI / 180) * (220), true);
        if(this.direction === "Up")
            context.arc(center.x, center.y, 30, (Math.PI / 180) * 240, (Math.PI / 180) * (300), true);
        if(this.direction === "Down")
            context.arc(center.x, center.y, 30, (Math.PI / 180) * 60, (Math.PI / 180) * (120), true);
        context.lineTo(center.x, center.y);
        context.fillStyle = this.color; //color
        context.fill();
        context.beginPath();
        if(this.direction === "Up" || this.direction === "Down")
            context.arc(center.x + 17, center.y , 5, 0, 2 * Math.PI); // circle
        else
            context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //color
        context.fill();
    }
}

class Ghost extends Character{
    constructor(x,y,color,direction){
        super(x, y);
        this.color = color;
        this.dir = direction;
        this.isWeak = false;
        this.radius = 25;
        this.isMoving = false;
        this.isBlinking = false;
        this.isDead = false;
        this.speed = 5;
        this.stepCounter = 0;

    }

    Draw(ctx) {

        var tmp = {}
        tmp.x = this.x;
        tmp.y = this.y;

        this.x = this.x*60 +30;
        this.y = this.y*60 +30;

        if (!this.isDead) {
            // body color
            if (this.isWeak) {
                if (this.isBlinking) {
                    ctx.fillStyle = BLINKING_COLOR;
                }
                else {
                    ctx.fillStyle = WEAK_COLOR;
                }
            }
            else {
                ctx.fillStyle = this.color;
            }

            ctx.beginPath();

            ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
            ctx.moveTo(this.x - this.radius, this.y);


            // LEGS
            if (!this.isMoving) {
                ctx.lineTo(this.x - this.radius, this.y + this.radius);
                ctx.lineTo(this.x - this.radius + this.radius / 3, this.y + this.radius - this.radius / 4);
                ctx.lineTo(this.x - this.radius + this.radius / 3 * 2, this.y + this.radius);
                ctx.lineTo(this.x, this.y + this.radius - this.radius / 4);
                ctx.lineTo(this.x + this.radius / 3, this.y + this.radius);
                ctx.lineTo(this.x + this.radius / 3 * 2, this.y + this.radius - this.radius / 4);

                ctx.lineTo(this.x + this.radius, this.y + this.radius);
                ctx.lineTo(this.x + this.radius, this.y);
            }
            else {
                ctx.lineTo(this.x - this.radius, this.y + this.radius - this.radius / 4);
                ctx.lineTo(this.x - this.radius + this.radius / 3, this.y + this.radius);
                ctx.lineTo(this.x - this.radius + this.radius / 3 * 2, this.y + this.radius - this.radius / 4);
                ctx.lineTo(this.x, this.y + this.radius);
                ctx.lineTo(this.x + this.radius / 3, this.y + this.radius - this.radius / 4);
                ctx.lineTo(this.x + this.radius / 3 * 2, this.y + this.radius);
                ctx.lineTo(this.x + this.radius, this.y + this.radius - this.radius / 4);
                ctx.lineTo(this.x + this.radius, this.y);
            }


            ctx.fill();
        }


        if (this.isWeak) {

            if (this.isBlinking) {
                ctx.fillStyle = "#f00";
                ctx.strokeStyle = "f00";
            }
            else {
                ctx.fillStyle = "white";
                ctx.strokeStyle = "white";
            }

            //eyes
            ctx.beginPath();//left eye
            ctx.arc(this.x - this.radius / 2.5, this.y - this.radius / 5, this.radius / 5, 0, Math.PI * 2, true); // white
            ctx.fill();

            ctx.beginPath(); // right eye
            ctx.arc(this.x + this.radius / 2.5, this.y - this.radius / 5, this.radius / 5, 0, Math.PI * 2, true); // white
            ctx.fill();

            //mouth
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(this.x - this.radius + this.radius / 5, this.y + this.radius / 2);
            ctx.lineTo(this.x - this.radius + this.radius / 3, this.y + this.radius / 4);
            ctx.lineTo(this.x - this.radius + this.radius / 3 * 2, this.y + this.radius / 2);
            ctx.lineTo(this.x, this.y + this.radius / 4);
            ctx.lineTo(this.x + this.radius / 3, this.y + this.radius / 2);
            ctx.lineTo(this.x + this.radius / 3 * 2, this.y + this.radius / 4);
            ctx.lineTo(this.x + this.radius - this.radius / 5, this.y + this.radius / 2);
            ctx.stroke();
        }
        else {
            // EYES
            ctx.fillStyle = "white"; //left eye
            ctx.beginPath();
            ctx.arc(this.x - this.radius / 2.5, this.y - this.radius / 5, this.radius / 3, 0, Math.PI * 2, true); // white
            ctx.fill();

            ctx.fillStyle = "white"; //right eye
            ctx.beginPath();
            ctx.arc(this.x + this.radius / 2.5, this.y - this.radius / 5, this.radius / 3, 0, Math.PI * 2, true); // white
            ctx.fill();


            switch (this.dir) {

                case "UP":
                    ctx.fillStyle = "black"; //left eyeball
                    ctx.beginPath();
                    ctx.arc(this.x - this.radius / 3, this.y - this.radius / 5 - this.radius / 6, this.radius / 6, 0, Math.PI * 2, true); //black
                    ctx.fill();

                    ctx.fillStyle = "black"; //right eyeball
                    ctx.beginPath();
                    ctx.arc(this.x + this.radius / 3, this.y - this.radius / 5 - this.radius / 6, this.radius / 6, 0, Math.PI * 2, true); //black
                    ctx.fill();
                    break;

                case "DOWN":
                    ctx.fillStyle = "black"; //left eyeball
                    ctx.beginPath();
                    ctx.arc(this.x - this.radius / 3, this.y - this.radius / 5 + this.radius / 6, this.radius / 6, 0, Math.PI * 2, true); //black
                    ctx.fill();

                    ctx.fillStyle = "black"; //right eyeball
                    ctx.beginPath();
                    ctx.arc(this.x + this.radius / 3, this.y - this.radius / 5 + this.radius / 6, this.radius / 6, 0, Math.PI * 2, true); //black
                    ctx.fill();
                    break;

                case "LEFT":
                    ctx.fillStyle = "black"; //left eyeball
                    ctx.beginPath();
                    ctx.arc(this.x - this.radius / 3 - this.radius / 5, this.y - this.radius / 5, this.radius / 6, 0, Math.PI * 2, true); //black
                    ctx.fill();

                    ctx.fillStyle = "black"; //right eyeball
                    ctx.beginPath();
                    ctx.arc(this.x + this.radius / 3 - this.radius / 15, this.y - this.radius / 5, this.radius / 6, 0, Math.PI * 2, true); //black
                    ctx.fill();
                    break;

                case "RIGHT":
                    ctx.fillStyle = "black"; //left eyeball
                    ctx.beginPath();
                    ctx.arc(this.x - this.radius / 3 + this.radius / 15, this.y - this.radius / 5, this.radius / 6, 0, Math.PI * 2, true); //black
                    ctx.fill();

                    ctx.fillStyle = "black"; //right eyeball
                    ctx.beginPath();
                    ctx.arc(this.x + this.radius / 3 + this.radius / 5, this.y - this.radius / 5, this.radius / 6, 0, Math.PI * 2, true); //black
                    ctx.fill();
                    break;

            }

        }

        this.x = tmp.x;
        this.y = tmp.y;
    }
}

class Bonus extends Character {
    constructor(x, y) {
        super(x, y);
    }

    Draw(context) {

    }
}


window.addEventListener("load", Start, false);

function Start() {
    board = new Array();
    score = 0;
    lives = 3;
    pac_color = "yellow";
    var cnt = 100;
    var food_remain = 50;
    var smallFood = 0.6 * food_remain;
    var mediumFood = 0.3 * food_remain;
    var bigFood = 0.1 * food_remain;
    var pacman_remain = 1;
    var ghost = 0;
    start_time = new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                board[i][j] = new Wall(i, j);
            }
            else if (i%9 === 0 && j%9 === 0 && ghost<GHOSTS_NUM) {
                board[i][j] = new Ghost(i, j, GHOSTS_COLORS[ghost], "RIGHT");
                ghost++;
            }
            else {
                var randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    food_remain--;
                    var rnd = Math.random();
                    if (rnd <= 0.6 && smallFood>0) {
                        board[i][j] = new Food(i, j, "small");
                        smallFood--;
                    }
                    else if (rnd > 0.6 && rnd<=0.9 && mediumFood>0){
                        board[i][j] = new Food(i,j,"medium");
                        mediumFood--;
                    }
                    else if (rnd >0.9 && bigFood>0){{
                        board[i][j] = new Food(i,j,"big");
                        bigFood--;
                    }
                } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                    pacman_remain--;
                    board[i][j] = new Pacman(i,j,pac_color);
                    pacman= board[i][j];
                } else {
                    board[i][j] = null;
                }
                cnt--;
            }
        }
    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = new Food(emptyCell[0], emptyCell[1], "big");
        food_remain--;

    }

    keysDown = {};
        addEventListener("keydown", function (e) {
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
    }, false);
    interval = setInterval(mainLoop, 90);
}

function fillFood(){

    }
}
function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * 9) + 1);
    var j = Math.floor((Math.random() * 9) + 1);
    while (board[i][j] !== null) {
        i = Math.floor((Math.random() * 9) + 1);
        j = Math.floor((Math.random() * 9) + 1);
    }
    return [i, j];
}

/**
 * @return {number}
 */
function GetKeyPressed() {
    if (keysDown['ArrowUp']) {
        return 1;
    }
    if (keysDown['ArrowDown']) {
        return 2;
    }
    if (keysDown['ArrowLeft']) {
        return 3;
    }
    if (keysDown['ArrowRight']) {
        return 4;
    }
}


function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    lblLives.value = lives;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if(board[i][j]!==null)
                board[i][j].Draw(context);
    }
    }


}


function UpdatePosition() {
    board[pacman.x][pacman.y] = null;
    var x = GetKeyPressed();
    if (x === 1) {
        if (pacman.y > 0 && !(board[pacman.x][pacman.y - 1] instanceof Wall)) {
            pacman.y--;
            pacman.direction = "Up";
        }
    }
    if (x === 2) {
        if (pacman.y < 9 && !(board[pacman.x][pacman.y + 1] instanceof Wall)) {
            pacman.y++;
            pacman.direction = "Down";
        }
    }
    if (x === 3) {
        if (pacman.x > 0 && !(board[pacman.x-1][pacman.y] instanceof Wall)) {
            pacman.x--;
            pacman.direction = "Left";
        }
    }
    if (x === 4) {
        if (pacman.x < 9 && !(board[pacman.x+1][pacman.y] instanceof Wall)) {
            pacman.x++;
            pacman.direction = "Right";
        }
    }

    if (board[pacman.x][pacman.y] instanceof Food) {
        score+=board[pacman.x][pacman.y].getScore();
    }
    board[pacman.x][pacman.y] = pacman;

    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 20 && time_elapsed <= 10) {
        pacman.color = "green";
    }
    if (score === 5000) {
        window.clearInterval(interval);
        window.alert("Game completed");
    } else {
        Draw();
    }
}


function mainLoop() {
    UpdatePosition();
    Draw();
};
