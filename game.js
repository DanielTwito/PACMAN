var context = canvas.getContext("2d");
var board;
var score;
var lives;
var pac_color;
var pacman;
var start_time;
var time_elapsed;
var GAME_TIME=60;
var interval;
var mainLoop_intervalTime=150;
var intervalGhost;
var ghostUpdate_intervalTime=2500;
var bonusInterval;
var bonusInterval_intervalTime=500;
var countDownInterval;
var GHOSTS_NUM = 3;
var GHOSTS_COLORS = ["green", "red", "blue"];
var ghosts = [];
var before = [];
var ball_the_pacman_eat=0;
var balls_on_the_board=0;
var BALLS_NUM=0;
var beforeBonus = null;
var BOARD_ROWS = 15;
var BOARD_COLUMNS = 10;
var UP = "ArrowUp";
var DOWN = "ArrowDown";
var RIGHT = "ArrowRight";
var LEFT = "ArrowLeft";

// var before = null ;
var before = [] ;
//sounds
var openinig_song = document.getElementById( "opening_song" );
var eating_sound = document.getElementById( "eating_sound" );
var bonus_img = document.getElementById( "bonus" );
var clock_img = document.getElementById( "clock" );
var extra_life_img = document.getElementById( "extra_life" );
let bigBall = document.getElementById("big_color");
let mediumBall = document.getElementById("medium_color");
let smallBall = document.getElementById("small_color");
let ghostsNum = document.getElementById("ghostNumber");
let ballsNum = document.getElementById("ballNumber");
let gameTime = document.getElementById("game_time");
let up = document.getElementById("keyUp");
let down=document.getElementById("keyDown");
let right = document.getElementById("keyRight");
let left = document.getElementById("keyLeft");


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
        this.res = 45;
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
        size: 12
    },
    medium:  {
        color: "blue",
        value: 15,
        size: 9
    },
    small:  {
        color: "black",
        value: 5,
        size: 6
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
        center.x = this.x * this.res + 30;
        center.y = this.y * this.res + 30;
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
        center.x = this.x * this.res + 30;
        center.y = this.y * this.res + 30;
        context.beginPath();
        context.rect(center.x - 20, center.y - 20, 45, 45);
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
        this.r = 20;
    }

    Draw(context) {
        var center = {};
        center.x = this.x * this.res + 30;
        center.y = this.y * this.res + 30;
        context.beginPath();
        if(this.direction === "Right")
            context.arc(center.x, center.y, this.r, (Math.PI / 180) * 40, (Math.PI / 180) * (320), false);
        if(this.direction === "Left")
            context.arc(center.x, center.y, this.r, (Math.PI / 180) * 140, (Math.PI / 180) * (220), true);
        if(this.direction === "Up")
            context.arc(center.x, center.y, this.r, (Math.PI / 180) * 240, (Math.PI / 180) * (300), true);
        if(this.direction === "Down")
            context.arc(center.x, center.y, this.r, (Math.PI / 180) * 60, (Math.PI / 180) * (120), true);
        context.lineTo(center.x, center.y);
        context.fillStyle = this.color; //color
        context.fill();
        context.beginPath();
        if(this.direction === "Up" || this.direction === "Down")
            context.arc(center.x + 17, center.y , this.r/5 -1, 0, 2 * Math.PI); // circle
        else
            context.arc(center.x + 5, center.y - 15, this.r/5-1, 0, 2 * Math.PI); // circle
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
        this.radius = 15;
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

        this.x = this.x*this.res +30;
        this.y = this.y*this.res +30;

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
    constructor(x, y,img) {
        super(x, y);
        this.img=img;
    }

    Draw(context) {
        var center = {};
        center.x = this.x * this.res + 30;
        center.y = this.y * this.res + 30;
        context.drawImage(this.img,center.x - 20, center.y - 20);
    }

    getScore(){
        return 50;
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
    users["a"]=new User("a","a","","a@a.com","1/1/99","a");


    welcome.style.display="none";
    signup.style.display="none";
    login.style.display="none";
    settings.style.display="none";
    game.style.display="none";
    showOnly("welcome");
    // showOnly("gameBoard");
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

function setUpListener() {
    document.getElementById("welcome").addEventListener('click', () => {
        showOnly("welcome");
    })
    document.getElementById("register").addEventListener('click', () => {
        showOnly("signup");
    })

    // document.getElementById("login").addEventListener('click', () => {
    //     showOnly("login");
    // })
    document.getElementById("login_btn").addEventListener('click', () => {
        showOnly("login");
    })
    document.getElementById("signup_btn").addEventListener('click', () => {
        showOnly("signup");
    })

    document.getElementById("login_submit").addEventListener('click', () => {
        if(checkUserDetails()){
            showOnly("settings");
            document.getElementById("save_settings").addEventListener('click',()=>{
                if(validateSettingsFields()){
                    updateSettings();
                    showOnly("gameBoard");
                }
            });
            document.getElementById("random_settings").addEventListener('click',()=>{
                randomSettings();
                // showOnly("gameBoard");
            });

        }

    })
    document.getElementById("signIn_submit").addEventListener('click', () => {
        if(validateFields())
            addUser();
    })
    // document.getElementById("save_settings").addEventListener('click', () => {
    //     if(validateFields())
    //         addUser();
    // })
    // document.getElementById("random_settings").addEventListener('click', () => {
    //     if(validateFields())
    //         addUser();
    // })

    openinig_song.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);

    document.getElementById("restart").addEventListener('click',()=>{
        clearInterval(interval);
        clearInterval(intervalGhost);
        clearInterval(bonusInterval);
        updateSettings();
        Start();
    })
}


function updateSettings() {

    UP = up.value;
    DOWN = down.value;
    RIGHT = right.value;
    LEFT = left.value;
    GHOSTS_NUM = ghostsNum.value;
    BALLS_NUM = ballsNum.value;
    GAME_TIME = gameTime.value;
    food["big"].color = bigBall.value ;
    food["medium"].color = mediumBall.value;
    food["small"].color = smallBall.value;
}

function randomSettings() {

    up.value= "ArrowUp";
    down.value = "ArrowDown";
    right.value = "ArrowRight";
    left.value = "ArrowLeft";
    bigBall.value = getRandomColor();
    mediumBall.value = getRandomColor();
    smallBall.value = getRandomColor();
    ghostsNum.value = getRandomInt(1,3);
    ballsNum.value = getRandomInt(50,90);
    gameTime.value = getRandomInt(60,150);
}



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validateSettingsFields(){



    var nameReg = /^[A-Za-z]+$/;
    var numberReg =  /^[0-9]+$/;

    var inputVal = new Array(up.value,down.value,left.value,right.value,ghostsNum.value,ballsNum.value,gameTime.value);

    var inputMessage = new Array("UP key", "DOWN key", "LEFT key", "RIGHT key", "Num of Ghosts","Num of Balls","Game Time");
    var flag=true;
    $('.error').hide();
    //check up input
    if(inputVal[0] == ""){
        up.value = 'Enter your '  + inputMessage[0];
        flag=false;

    }

    //check down input
    if(inputVal[1] == ""){
        down.value = 'Enter your '  + inputMessage[1];
        flag=false;
    }

    //check left input
    if(inputVal[2] == ""){
        left.value = 'Enter your '  + inputMessage[2];
        flag=false;
    }

    //check right input
    if(inputVal[3] == ""){
        right.value = 'Enter your '  + inputMessage[3];
        flag=false;
    }

    //check ghosts
    if(inputVal[4] == ""){
        ghostsNum.value = 'Enter '  + inputMessage[4];
        flag=false;
    }
    else if(!numberReg.test(ghostsNum.value)){
        ghostsNum.value='Please enter a number';
        flag=false;
    }
    else if(ghostsNum.value < 1 || ghostsNum.value > 3){
        ghostsNum.value='Please enter number between 1-3';
        flag=false;
    }

    //check balls
    if(inputVal[5] == ""){
        ballsNum.value = 'Enter '  + inputMessage[5];
        flag=false;
    }
    else if(!numberReg.test(ballsNum.value)){
        ballsNum.value='Please enter a number';
        flag=false;
    }
    else if(ballsNum.value < 50 || ballsNum.value > 90){
        ballsNum.value='Please enter number between 50-90';
        flag=false;
    }

    //check time
    if(inputVal[6] == ""){
        gameTime.value = 'Enter '  + inputMessage[6];
        flag=false;
    }
    else if(!numberReg.test(gameTime.value)){
        gameTime.value='Please enter a number';
        flag=false;
    }
    else if(gameTime.value < 60){
        gameTime.value='The minimum game time is 60 seconds';
        flag=false;
    }


    return flag;

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
    var flag=true;
    $('.error').hide();
    //check username input
    if(inputVal[0] == ""){
        $('#userName_register').val( 'Please enter your'  + inputMessage[0]);
        flag=false;

    }
    else if(!userNameReg.test(userName)){
        $('#userName_register').val('placeholdeer',' Letters only');
        flag=false;
    }


    //check first name input
    if(inputVal[1] == ""){
        $('#firstName_register').val('Please enter your' + inputMessage[1]);
        flag=false;
    }
    else if(!nameReg.test(firstName)){
        $('#firstName_register').val('Letters only');
        flag=false;
    }


    //check last name imput
    if(inputVal[2] == ""){
        $('#lastName_regester').val('Please enter your ' + inputMessage[2]);
        flag=false;
    }
    else if(!nameReg.test(lastName)){
        $('#lastName_regester').val( 'Letters only');
        flag=false;
    }


    //check email
    if(inputVal[3] == ""){
        $('#email_regester').val('Please enter your' + inputMessage[3]);
        flag=false;
    }
    else if(!emailReg.test(email)){
        $('#email_regester').val('Please enter a valid email address');
        flag=false;
    }

    if(inputVal[4] == ""){
        $('#messageLabel').val('Please enter your' + inputMessage[4]);
        flag=false;
    }

    //check password
    if(inputVal[5] == "" ||!passReg.test(password) ){
        $('#password_regester').val('Please enter 8 char ad least one number and one letter');
        flag=false;
    }


    return flag;
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
            document.getElementById("user").innerHTML="welcome <u>"+users[userName].firstName+" "+users[userName].lastName+"</u>";
            showOnly("settings");
            return true;
        }
    }
    return false;
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
    openinig_song.play();
    ball_the_pacman_eat=0;
    balls_on_the_board=0;
    board = new Array();
    score = 0;
    lives = 3;
    pac_color = "yellow";
    var cnt = BOARD_ROWS * BOARD_COLUMNS;
    var food_remain = BALLS_NUM;
    var foodSizes = [0.6 * food_remain, 0.3 * food_remain, 0.1 * food_remain];
    var sum = foodSizes[0]+foodSizes[1]+foodSizes[2];
    foodSizes[0]+= food_remain - sum;
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

    for (var i = 0; i < BOARD_ROWS; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < BOARD_COLUMNS; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) ||
                (i === 6 && j === 1) || (i === 6 && j === 2) ||
                (i === 10 && j === 4) || (i === 10 && j === 5)||(i === 10 && j === 6) || (i === 10 && j === 7)
            ) {
                board[i][j] = new Wall(i, j);
            }
            else if (i%9 === 0 && j%(BOARD_COLUMNS-1) === 0 && ghost<GHOSTS_NUM) {
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
                        food_remain++;
                    }
                }else {
                    board[i][j] = null;
                }
                cnt--;
            }
        }
    }
    // board[9][0] = null;
    // board[BOARD_ROWS-1][0] = new Ghost(BOARD_ROWS-1, 0, GHOSTS_COLORS[ghost-1], "RIGHT");
    // ghosts[ghost-1] = board[BOARD_ROWS-1][0];

    let empty = findAllEmptyCell();
    let pos = empty[Math.floor(Math.random() * empty.length)];

    board[pos[0]][pos[1]] = new Pacman(pos[0],pos[1],pac_color);
    pacman= board[pos[0]][pos[1]];

    var emptyCell=[0,0];
    while (food_remain > 0) {
        emptyCell = findEmptyCell(board, emptyCell[0], emptyCell[1]);
        if(fillFood(emptyCell[0],emptyCell[1]))
            food_remain--;

    }
    emptyCell=findEmptyCell(board, emptyCell[0], emptyCell[1]);
    board[emptyCell[0]][emptyCell[1]]=new Bonus(emptyCell[0],emptyCell[1],bonus_img);
    bonus=board[emptyCell[0]][emptyCell[1]];

    emptyCell=findAllEmptyCell();
    emptyCell = emptyCell[Math.floor(Math.random() * emptyCell.length)];
    clock=board[emptyCell[0]][emptyCell[1]]=new Bonus(emptyCell[0],emptyCell[1],clock_img);

    emptyCell=findAllEmptyCell();
    emptyCell = emptyCell[Math.floor(Math.random() * emptyCell.length)];
    extra_life=board[emptyCell[0]][emptyCell[1]]=new Bonus(emptyCell[0],emptyCell[1],extra_life_img);

    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.key] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.key] = false;
    }, false);
    for (let i = 0; i < BOARD_ROWS; i++) {
        for (let j = 0; j < BOARD_COLUMNS; j++) {
            if(board[i][j] instanceof Food)
                balls_on_the_board++;
        }
    }
    interval = setInterval(mainLoop, mainLoop_intervalTime);
    intervalGhost = setInterval(ghostUpdate, ghostUpdate_intervalTime);
    bonusInterval = setInterval(bonusUpdate, bonusInterval_intervalTime);
}

function boardClean() {


    for (let i = 0; i < BOARD_ROWS; i++) {
        for (let j = 0; j < BOARD_COLUMNS; j++) {
            if(board[i][j] instanceof Ghost){
                board[i][j] = null;
            }
        }

    }
}

//restart the game after disqulification
function startAfterDisqualified() {
    clearInterval(interval);
    clearInterval(intervalGhost);
    clearTimeout(countDownInterval);
    score = score-10;
    lives--;
    pac_color = pac_color;
    for (var i = 0; i < GHOSTS_NUM; i++) {
        var ghostX = ghosts[i].x;
        var ghostY = ghosts[i].y;
        board[ghostX][ghostY] = before[i];
    }
    Draw();
    alert(lives +" lives left! press enter to continue");
    boardClean();
    ghosts=[];
    var ghost=0;
    for (var i = 0; i < BOARD_ROWS; i++) {
        for (var j = 0; j < BOARD_COLUMNS; j++) {
            if (i % (BOARD_ROWS-1) === 0 &&  j%(BOARD_COLUMNS-1) === 0 && ghost < GHOSTS_NUM) {
                board[i][j] = new Ghost(i, j, GHOSTS_COLORS[ghost], "RIGHT");
                ghosts[ghost] = board[i][j];
                ghost++;
            }
        }
    }


    let empty = findAllEmptyCell();
    let pos = empty[Math.floor(Math.random() * empty.length)];
    board[pos[0]][pos[1]] = new Pacman(pos[0],pos[1],pac_color);
    pacman= board[pos[0]][pos[1]];

    openinig_song.pause();
    openinig_song.currentTime=0;
    console.log(board);
    openinig_song.play();
    keysDown = {};
    interval = setInterval(mainLoop,mainLoop_intervalTime);
    intervalGhost = setInterval(ghostUpdate,ghostUpdate_intervalTime);

}


function findEmptyCell(board, i, k) {

    for(var j=k;i<BOARD_ROWS;i++){
        for (; j < BOARD_COLUMNS; j++) {
            if (board[i][j] === null)
                return[i, j];
        }
        if (j===BOARD_COLUMNS)
            j=0;
    }

}

function findAllEmptyCell() {
    var cells = [];
    for(var i=0;i<BOARD_ROWS;i++){
        for (var j=0; j < BOARD_COLUMNS; j++) {
            if (board[i][j] === null)
                cells.push([i,j]);
        }
    }
    return cells;

}

/**
 * @return {number}
 */
function GetKeyPressed() {
    if (keysDown[UP]) {
        return 1;
    }
    if (keysDown[DOWN]) {
        return 2;
    }
    if (keysDown[LEFT]) {
        return 3;
    }
    if (keysDown[RIGHT]) {
        return 4;
    }
}


function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    lblLives.value = lives;
    for (var i = 0; i < BOARD_ROWS; i++) {
        for (var j = 0; j < BOARD_COLUMNS; j++) {
            if(board[i][j] instanceof Wall) {
                    board[i][j].Draw(context);
            }
        }
    }

    for (var i = 0; i < BOARD_ROWS; i++) {
        for (var j = 0; j < BOARD_COLUMNS; j++) {
            if(board[i][j] instanceof Food) {
                board[i][j].Draw(context);
            }
        }
    }


    for (var i = 0; i < ghosts.length; i++) {
                ghosts[i].Draw(context);
    }
    if(bonus!==null) {
        board[bonus.x][bonus.y].Draw(context);
    }
    if(clock!==null) {
        board[clock.x][clock.y].Draw(context);
    }
    if(extra_life!==null) {
        board[extra_life.x][extra_life.y].Draw(context);
    }
    if(pacman !== null)
        if(board[pacman.x][pacman.y]!==null) {
            board[pacman.x][pacman.y].Draw(context);
    }
}


function UpdatePosition() {

    board[pacman.x][pacman.y] = null;
    var x = GetKeyPressed();

    switch (x) {
        case 1:
            if (pacman.y > 0 && !(board[pacman.x][pacman.y - 1] instanceof Wall)) {
            pacman.y--;
            pacman.direction = "Up";
            }
            break;
        case 2:
            if (pacman.y < BOARD_COLUMNS-1 && !(board[pacman.x][pacman.y + 1] instanceof Wall)) {
                pacman.y++;
                pacman.direction = "Down";
            }
            break;
        case 3:
            if (pacman.x > 0 && !(board[pacman.x-1][pacman.y] instanceof Wall)) {
                pacman.x--;
                pacman.direction = "Left";
            }
            break;
        case 4:
            if (pacman.x < BOARD_ROWS-1 && !(board[pacman.x+1][pacman.y] instanceof Wall)) {
                pacman.x++;
                pacman.direction = "Right";
            }
            break;
    }

    // if(board[pacman.x][pacman.y] instanceof Ghost){
    //
    //     startAfterDisqualified();
    //     return;
    // }
    if (board[pacman.x][pacman.y] instanceof Food) {
        score+=board[pacman.x][pacman.y].getScore();
        ball_the_pacman_eat++;
        eating_sound.currentTime=0;
        eating_sound.play();
    }

    else if(board[pacman.x][pacman.y] instanceof Bonus) {
        if (board[pacman.x][pacman.y] === clock) {
            GAME_TIME = GAME_TIME + 10;
            clock = null;

        }else if(board[pacman.x][pacman.y] === extra_life){
            lives++;
            extra_life=null;
        }
        else {
            score += board[pacman.x][pacman.y].getScore();
            clearInterval(bonusInterval)
            bonus = null;
        }
        eating_sound.currentTime = 0;
        eating_sound.play();
    }
    for (let i = 0; i < ghosts.length; i++) {
        if(ghosts[i].x === pacman.x && ghosts[i].y === pacman.y){
            board[pacman.x][pacman.y] = null;
            board[ghosts[i].x][ghosts[i].y] = ghosts[i];
            startAfterDisqualified();
            return;
        }
    }

    board[pacman.x][pacman.y] = pacman;

    var currentTime = new Date();
    // time_elapsed = GAME_TIME - ((currentTime - start_time) / 1000);
    time_elapsed = GAME_TIME;
    if (score >= 20 && time_elapsed <= 10) {
        pacman.color = "green";
    }
    if (score === 5000) {
        window.clearInterval(interval);
        window.alert("Game completed");
    }
    // else {
    //     Draw();
    // }
}


function mainLoop() {
    if(isGameOver()){
        finishGame();
    }else {
        Draw();
        UpdatePosition();
    }
}

function isGameOver() {
    return GAME_TIME === -1 || ball_the_pacman_eat === balls_on_the_board || lives === 0;

    if(lives<=0)
        return true;
    for (let i = 0; i < BOARD_ROWS; i++) {
        for (let j = 0; j < BOARD_COLUMNS; j++) {
            if(board[i][j] instanceof Food)
                return false;
        }
    }

    return true;
}

function finishGame(){
    openinig_song.pause();
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(interval);
    clearInterval(intervalGhost);
    clearInterval(bonusInterval);
    if(ball_the_pacman_eat == balls_on_the_board){
        alert("Game Over You WIN!!");
    }
    if(lives === 0 ){
        alert("You Lost!");
    }else if ( time_elapsed <0.05){
        if(score<150){
           alert("You can do better then " + score+" points!");
        }else{
            alert("We have a Winner!!!" );
        }

    }

}
function ghostUpdate() {
    for (var i = 0; i < GHOSTS_NUM; i++) {
        var ghostX = ghosts[i].x;
        var ghostY = ghosts[i].y;
        board[ghostX][ghostY]=before[i];
        var move = getPossibaleMoves(ghosts[i]);
        var y = getMove(i,move);
        var x = y[Math.floor(Math.random() * y.length)];
        if (x === "Up") {
            ghosts[i].y--;
            ghosts[i].dir = "UP"
        } else if (x === "Down") {
            ghosts[i].y++;
            ghosts[i].dir = "DOWN"
        } else if (x === "Left") {
            ghosts[i].x--;
            ghosts[i].dir = "LEFT"
        } else if (x === "Right") {
            ghosts[i].x++;
            ghosts[i].dir = "RIGHT"
        }
        // if(ghosts[i].x === pacman.x && ghosts[i].y === pacman.y){
        //     board[pacman.x][pacman.y] = null;
        //     board[ghosts[i].x][ghosts[i].y] = ghosts[i];
        //     startAfterDisqualified();
        //     return;
        // }
        before[i]=board[ghosts[i].x][ghosts[i].y];
        board[ghosts[i].x][ghosts[i].y] = ghosts[i];
    }
    // Draw();
}

function getPossibaleMoves(Obj) {
    var posX = Obj.x;
    var posY = Obj.y;
    var ans =[];
    if(  (posY - 1) >= 0  && !(board[posX][posY - 1] instanceof Wall) && !(board[posX][posY - 1] instanceof Ghost)) {
        ans.push("Up");
    }
    if(  (posY + 1) <= (BOARD_COLUMNS-1)  && !(board[posX][posY + 1] instanceof Wall) && !(board[posX][posY + 1] instanceof Ghost) )  {
        ans.push("Down");
    }
    if(  (posX - 1) >= 0  && !(board[posX-1][posY] instanceof Wall) && !(board[posX-1][posY] instanceof Ghost) ) {
        ans.push("Left");
    }
    if(  (posX + 1) <= (BOARD_ROWS-1)  && !(board[posX+1][posY] instanceof Wall) && !(board[posX+1][posY] instanceof Ghost) ){
        ans.push("Right");
    }
    return ans;
}

function getMove(ghost_index,moves) {
    var targetX = pacman.x;
    var targetY = pacman.y;
    var ghostX = ghosts[ghost_index].x;
    var ghostY = ghosts[ghost_index].y;
    var ans = [];

    if(targetX-ghostX > 0) {
        if ( moves.includes("Right") ) {
            ans.push("Right");
        }else if (moves.includes("Down")) {
            ans.push("Down");
        }else if ( moves.includes("Right")){
            ans.push("Right");
        }
    }else if ( targetX - ghostX < 0){
        if(moves.includes("Left")){
            ans.push("Left");
        }else if (moves.includes("Down")){
            ans.push("Down");
        }else if (moves.includes("Up")){
            ans.push("Up");
        }
    }

    if ( targetY - ghostY > 0 ){
        if (moves.includes("Down")){
            ans.push("Down");
        }else if ( moves.includes("Right") ){
            ans.push("Right");
        }else if ( moves.includes("Left") ){
            ans.push("Left");
        }

    }else if ( targetY - ghostY < 0){
        if ( moves.includes("Up") ) {
            ans.push("Up");
        }else if ( moves.includes("Right") ){
            ans.push("Right");
        }else if ( moves.includes("Left") ){
            ans.push("Left");
        }
    }

    return ans;
}


function bonusUpdate() {
    var move = getPossibaleMoves(bonus);
    var x = move[Math.floor(Math.random() * move.length)];
    board[bonus.x][bonus.y]=beforeBonus;
    if (x === "Up") {
        bonus.y--;
    } else if (x === "Down") {
       bonus.y++;
    } else if (x === "Left") {
       bonus.x--;
    } else if (x === "Right") {
        bonus.x++;
    }
    beforeBonus=board[bonus.x][bonus.y]
    board[bonus.x][bonus.y] = bonus;
}

function countDown() {
    GAME_TIME--;

}