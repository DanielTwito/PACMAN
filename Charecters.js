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

    constructor(x,y){
        super(x,y);
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
        context.fillStyle = "black"; //color
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

// export {Charecter,Food,Wall,Pacman,Ghost,Bonus};


