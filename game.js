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
var ghosts = [];

class User{
    constructor(userName,firstName,lastName,email,date,password){
        this.userName=userName;
        this.firstName=firstName;
        this.lastName=lastName;
        this.email=email;
        this.date=date;
        this.password=password;

    }

}

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

    isEatable(){

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

    isEatable(){
        return true;
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

    isEatable(){
        return false;
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

    isEatable(){
        return false;
    }
}

class Bonus extends Character {
    constructor(x, y) {
        super(x, y);
    }

    Draw(context) {

    }

    isEatable(){
        return true;
    }
}


window.addEventListener("load", init, false);

function init(){
    let welcome = document.getElementById("welcome_div");
    let signup = document.getElementById("signup_div");
    let login = document.getElementById("login_div");
    let settings = document.getElementById("settings_div");
    let game = document.getElementById("gameBoard");
    pages={
        "welcome":welcome,
        "signup":signup,
        "login":login,
        "settings":settings,
        "gameBoard":game,
    }
    // user data key=userName value=passwors
    users={}
    users["a"]=new User("a","a","a","a@a.com","1/1/99","a");


    welcome.style.display="none";
    signup.style.display="none";
    login.style.display="none";
    settings.style.display="none";
    game.style.display="none";
    showOnly("welcome");
    setUpListener();
}


function showOnly(div) {
    if (pages.hasOwnProperty(div)) {
        for (var key in pages) {
            if (key === div) {
                pages[key].style.display = 'block'
            } else {
                pages[key].style.display = "none"
            }
        }
    }
    if(div === "gameBoard"){
        Start();
    }


}

function setUpListener(){
    document.getElementById("welcome").addEventListener('click',()=>{
        showOnly("welcome");
    })
    document.getElementById("settings").addEventListener('click',()=>{
        showOnly("settings");
    })
    document.getElementById("register").addEventListener('click',()=>{
        showOnly("signup");
    })

    document.getElementById("login").addEventListener('click',()=>{
        showOnly("login");
    })
    document.getElementById("login_btn").addEventListener('click',()=>{
        showOnly("login");
    })
    document.getElementById("signup_btn").addEventListener('click',()=>{
        showOnly("signup");
    })

    document.getElementById("login_submit").addEventListener('click',()=>{
        checkUserDetails();
    })
    document.getElementById("signIn_submit").addEventListener('click',()=>{
        validateFields();
        // addUser();
    })




}


function validateFields() {
    var nameReg = /^[A-Za-z]+$/;
    var numberReg =  /^[0-9]+$/;
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var userNameReg = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/
    var passReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    var userName = $('#userName_register').val();
    var firstName = $('#firstName_register').val();
    var lastName = $('#lastName_regester').val();
    var email = $('#email_regester').val();
    var password = $('#password_regester').val();
    var inputVal = new Array(userName, firstName, lastName, email, password);

    var inputMessage = new Array("user name", "first name", "last name", "email", "birthday","password");

    $('.error').hide();
    //check username input
    if(inputVal[0] == ""){
        $('#userName_register').val( 'Please enter your'  + inputMessage[0]);
    }
    else if(!userNameReg.test(userName)){
        $('#userName_register').val('placeholdeer',' Letters only');
    }


    //check first name input
    if(inputVal[1] == ""){
        $('#firstName_register').val('Please enter your' + inputMessage[1]);
    }
    else if(!nameReg.test(firstName)){
        $('#firstName_register').val('Letters only');
    }


    //check last name imput
    if(inputVal[2] == ""){
        $('#lastName_regester').val('Please enter your ' + inputMessage[2]);
    }
    else if(!nameReg.test(lastName)){
        $('#lastName_regester').val( 'Letters only');
    }


    //check email
    if(inputVal[3] == ""){
        $('#email_regester').val('Please enter your' + inputMessage[3]);
    }
    else if(!emailReg.test(email)){
        $('#email_regester').val('Please enter a valid email address');
    }

    if(inputVal[4] == ""){
        $('#messageLabel').val('Please enter your' + inputMessage[4]);
    }

    //check password
    if(inputVal[5] == "" ||!passReg.test(password) ){
        $('#password_regester').val('Please enter 8 char ad least one number and one letter');
    }



}


function addUser () {

    let uname = document.getElementById("userName_register").value;
    let firstName=document.getElementById("firstName_register").value;
    let lastName = document.getElementById("lastName_regester").value;
    let email = document.getElementById("email_regester").value;
    let birthDate = document.getElementById("birthDate_regester").value;
    let password = document.getElementById("password_regester").value;

    let userObj = new User(uname,firstName,lastName,email,birthDate,password);
    users[uname]=userObj;
    alert("thank you!")
    showOnly("welcome");
    clearAllTextFiealds();

}

function checkUserDetails() {

    let userName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    if (userName in users) {
        if(users[userName].password === password) {
            clearAllTextFiealds();
            showOnly("gameBoard");
        }
    }
}

function clearAllTextFiealds(){
    document.getElementById("userName").value='';
    document.getElementById("password").value='';
    document.getElementById("userName_register").value='';
    document.getElementById("firstName_register").value='';
    document.getElementById("lastName_regester").value='';
    document.getElementById("email_regester").value='';
    document.getElementById("birthDate_regester").value='';
    document.getElementById("password_regester").value='';
}

function Start() {
    board = new Array();
    score = 0;
    lives = 3;
    pac_color = "yellow";
    var cnt = 100;
    var food_remain = 50;
    var foodSizes = [0.6 * food_remain, 0.3 * food_remain, 0.1 * food_remain]
    var pacman_remain = 1;
    var ghost = 0;
    start_time = new Date();

    function fillFood(i, j) {
        var rnd = Math.random();
        if (rnd <= 0.6 && foodSizes[0]>0) {
            board[i][j] = new Food(i, j, "small");
            foodSizes[0]--;
            return true;
        }
        else if (rnd > 0.6 && rnd<=0.9 && foodSizes[1]>0){
            board[i][j] = new Food(i,j,"medium");
            foodSizes[1]--;
            return true;
        }
        else if (rnd >0.9 && foodSizes[2]>0){
            board[i][j] = new Food(i,j,"big");
            foodSizes[2]--;
            return true;
        }
        return false;
    }

    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                board[i][j] = new Wall(i, j);
            }
            else if (i%9 === 0 && j%9 === 0 && ghost<GHOSTS_NUM) {
                board[i][j] = new Ghost(i, j, GHOSTS_COLORS[ghost], "RIGHT");
                ghosts[ghost] = board[i][j];
                ghost++;
            }
            else {
                var randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    food_remain--;
                    if(!fillFood(i,j)){
                        board[i][j] = null;
                    }
                }
                else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
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
    var emptyCell=[0,0];
    while (food_remain > 0) {
        emptyCell = findEmptyCell(board, emptyCell[0], emptyCell[1]);
        if(fillFood(emptyCell[0],emptyCell[1]))
            food_remain--;

    }

    keysDown = {};
        addEventListener("keydown", function (e) {
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
    }, false);
    interval = setInterval(mainLoop, 120);
}

function findEmptyCell(board, i, k) {

    for(var j=k;i<10;i++){
        for (; j < 10; j++) {
            if (board[i][j] === null)
                return[i, j];
        }
        if (j===10)
            j=0;
    }

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
            if(board[i][j]!==null) {
                // console.log(i +"  "+j);
                board[i][j].Draw(context);
            }
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
