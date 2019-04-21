var context = canvas.getContext("2d");
var board;
var score;
var lives;
var pac_color;
var pacman;
var start_time;
var time_elapsed;
var interval;



class Charecter {
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

class Food extends Charecter{

    constructor(x,y,color){
        super(x,y);
        this.color=color
    }

    getScore(){
        return 1;

    }
    Draw(context) {
        var center = {};
        center.x = this.x * 60 + 30;
        center.y = this.y * 60 + 30;
        context.beginPath();
        context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
        context.fillStyle = this.color; //color
        context.fill();
    }
}

class Wall extends Charecter{
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
class Pacman extends Charecter{

    direction;

    constructor(x,y,color){
        super(x,y);
        this.color=color;

    }

    Draw(context) {
        var center = {};
        center.x = this.x * 60 + 30;
        center.y = this.y * 60 + 30;
        context.beginPath();
        context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
        context.lineTo(center.x, center.y);
        context.fillStyle = this.color; //color
        context.fill();
        context.beginPath();
        context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //color
        context.fill();
    }
}

class Ghost extends Charecter{
    constructor(x,y){
        super(x, y);
    }

    Draw(context) {
    }
}

class Bonus extends Charecter{
    constructor(x,y){
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
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                board[i][j] =new Wall(i,j);
            } else {
                var randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    food_remain--;
                    board[i][j] = new Food(i,j,"black");
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
        board[emptyCell[0]][emptyCell[1]] = new Food(emptyCell[0],emptyCell[1],"black");
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
        }
    }
    if (x === 2) {
        if (pacman.y < 9 && !(board[pacman.x][pacman.y + 1] instanceof Wall)) {
            pacman.y++;
        }
    }
    if (x === 3) {
        if (pacman.x > 0 && !(board[pacman.x-1][pacman.y] instanceof Wall)) {
            pacman.x--;
        }
    }
    if (x === 4) {
        if (pacman.x < 9 && !(board[pacman.x+1][pacman.y] instanceof Wall)) {
            pacman.x++;
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
    if (score === 50) {
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
