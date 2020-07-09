//x - вправо
//y - вниз
//width - ширина
//height - высота

var hSpeed = 20;

class Shape {
    constructor(name, x, y, hSpeed, vSpeed, imgSrc){
        this.name = name;
        this.x = x;
        this.y = y;
        this.hSpeed = hSpeed;
        this.vSpeed = vSpeed;
        this.img = new Image();
        this.img.src = imgSrc;
        this.loaded = false;
        this.customOnload = null;
        var shape = this;
        this.img.onload = function(){
            shape.loaded = true;
            shape.onload();
            if (shape.customOnload != null) {
                shape.customOnload();
            }
        }
    }
  
    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y);
    }

    onload() {
    }

    addOnload(handler){
        if (this.loaded)
            handler();
        else
            this.customOnload = handler;
    }

    move(){
        this.x += this.hSpeed;
        this.y += this.vSpeed;
    }

    left(){
        return this.x;
    }
    right(){
        return this.x + this.img.width;
    }
    top(){
        return this.y;
    }
    bottom(){
        return this.y + this.img.height;
    }
}

class Anyground extends Shape {
    constructor(name, vPart, hSpeed, imgSrc, cvs){
        super(name, 0, cvs.height * (1 - vPart), hSpeed, 0, imgSrc);
        this.vPart = vPart;
        this.width = cvs.width;
        this.height = cvs.height * vPart;
    }
    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, ctx.canvas.width, ctx.canvas.height*this.vPart);
        ctx.drawImage(this.img, this.x+ctx.canvas.width, this.y, ctx.canvas.width, ctx.canvas.height*this.vPart);
    }
    move(){
        super.move();
        if (this.x <= -this.width)
            this.x += this.width;
    }
}

class Background extends Anyground {
    constructor(cvs){
        super("background", 1, 0, "img/bg.jpg", cvs);
    }
}

class Foreground extends Anyground {
    constructor(cvs){
        super("foreground", 1/6, 0, "img/fg.png", cvs);
    }
}

class Barrier extends Shape {
    constructor(name, cvsWidth, floorY, hSpeed, imgSrc){
        super(name, cvsWidth + Math.random()*cvsWidth/4, floorY, hSpeed, 0, imgSrc);
    }

    getStand() {
        return null;
    }

    isHole() {
        return false;
    }
    inBarrier(player){
        var stand = this.getStand();
        if (stand == null)
            stand = this.top();
        return (this.left() < player.right() && player.left() < this.right() 
            && stand < player.bottom());
    }
}

class BarrierMiddle extends Barrier {
    constructor(name, cvsWidth, floorY, hSpeed, imgSrc){
        super(name, cvsWidth, floorY, hSpeed, imgSrc);
    }
    onload(){
        super.onload();
        this.y -= this.img.height;
    }
}

class BarrierBottom extends Barrier {
    constructor(name, cvsWidth, floorY, hSpeed, imgSrc){
        super(name, cvsWidth, floorY, hSpeed, imgSrc);
    }
    onload(){
        super.onload();
        this.y -= this.img.height*0.3;
    }
    /*inBarrier(player){

    }*/
}

class Pumpkin extends BarrierMiddle {
    constructor(cvsWidth, floorY, hSpeed){
        super("pumpkin", cvsWidth, floorY, hSpeed, "img/barriers/pumpkin.png");
    }

    getStand() {
        return this.top() + this.img.height / 3.5;
    }
}

class Barrel extends BarrierMiddle {
    constructor(cvsWidth, floorY, hSpeed){
        super("barrel", cvsWidth, floorY, hSpeed, "img/barriers/barrel.png");
    }
    getStand() {
        return this.top() + this.img.height / 20;
    }
}

class Pillar extends BarrierMiddle {
    constructor(cvsWidth, floorY, hSpeed){
        super("pillar", cvsWidth, floorY, hSpeed, "img/barriers/pillar.png");
    }
    getStand() {
        return null;
    }
}

class Hole extends BarrierBottom {
    constructor(cvsWidth, floorY, hSpeed){
        super("hole", cvsWidth, floorY, hSpeed, "img/barriers/hole.png");
    }
    isHole(){
        return true;
    }
}

class Player extends Shape {
    constructor(cvs, hSpeed, vSpeed, floorY){
        super("player", 0, 0, hSpeed, vSpeed, "img/player.png");
        this.floorY = floorY;
        this.inJump = false;
        this.requiredX = cvs.width/3;
        this.restart();
    }

    restart(){
        this.hSpeed = hSpeed;
        this.x = 0;
        this.y = 0;
        this.inJump = true;
    }

    move(barriers){
        var oldBottom = this.bottom();
        this.vSpeed += this.img.height / 350;
        super.move();
        if (this.x > this.requiredX){
            this.x = this.requiredX;
            this.hSpeed = 0;
        }
        var floorY = this.floorY;
        barriers.forEach(barrier => {
            var barrierStand = barrier.getStand();
            if (barrierStand != null && oldBottom <= barrierStand){
                if (barrier.left() < this.right() && this.left() < barrier.right()){
                    floorY = barrierStand;
                }
            }
            else if (barrier.isHole()){
                var center = (this.left() + this.right()) / 2;
                if (barrier.left() < center && center < barrier.right()){
                    floorY = barrier.bottom();
                }
            }
        });
        if (this.bottom() > floorY) {
            this.y = floorY - this.img.height;
            this.vSpeed = 0;
        }
        this.inJump = this.bottom() < floorY; 
    }

    jump(barriers){
        this.vSpeed = Math.floor(-this.img.height / 12);
        this.y -= Math.floor(this.img.height / 1.7);
        this.move(barriers);
    }

    isInJump(){
        return this.inJump;
    }
}

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

ctx.canvas.width  = 3000;
ctx.canvas.height = 3000*window.innerHeight/window.innerWidth;

var bdyshImg = new Image();
var gameOverImg = new Image();
var countersGround = new Image();
bdyshImg.src = "img/bdysh.png";
gameOverImg.src = "img/gameOver.png";
countersGround.src = "img/countersGround.png";
var bg = new Background(cvs);
var fg = new Foreground(cvs);
var floorY = cvs.height - fg.height*0.5;
var player = new Player(cvs, 0, 0, floorY);

var fakes = [
    new Pumpkin(cvs, floorY),
    new Barrel(cvs, floorY),
    new Hole(cvs, floorY)
];

var barrierTypes = [Barrel, Hole, Pumpkin];
var barriers = [];

var wasKeydown = false;
function onKeydown() {
    if (!player.isInJump() && !wasKeydown) {
        wasKeydown = true;
        var barrierTypeIndex = Math.floor(Math.random() * barrierTypes.length);
        var barrierType = barrierTypes[barrierTypeIndex];
        barriers.push(new barrierType(cvs.width, floorY, player.hSpeed - hSpeed));
    }
}

var livesCounter = 0;
var lives = 3;
function gameOver(){
    if (livesCounter == 0)
        livesCounter = 30;
    else
        livesCounter--;
    if (livesCounter == 0)
        location.reload();   
    else {
        ctx.drawImage(gameOverImg, 0, 0, ctx.canvas.width, ctx.canvas.height)
        requestAnimationFrame(gameOver);
    }
    
}

var bdyshCounter = 0;
function bdysh(){
    if (bdyshCounter == 0)
        bdyshCounter = 20;
    else
        bdyshCounter--;
    if (bdyshCounter == 0){
        lives--;
        if (lives == 0)
            gameOver();
        else
            reStart();
    } 
    else {
        ctx.drawImage(bdyshImg, 0, 0, ctx.canvas.width, ctx.canvas.height)
        requestAnimationFrame(bdysh);
    }
}

function reStart(){
    bg.hSpeed = 0;
    fg.hSpeed = 0;
    player.restart();
    barriers = [];
    requestAnimationFrame(draw);
}

function draw() {
    // Сдвиг
    bg.move();
    fg.move();
    barriers.forEach(barrier => {
        barrier.move();
    });
    if (wasKeydown){
        wasKeydown = false;
        player.jump(barriers);
    }
    else
        player.move(barriers);

    // Проверка на конец выбегания
    if (player.hSpeed == 0) {
        bg.hSpeed = -hSpeed / 2;
        fg.hSpeed = -hSpeed;
        barriers.forEach(barrier => {
            barrier.hSpeed = -hSpeed;
        });
    }
    
    // Проверка на столкновение с барьером
    var inBarrier = false;
    barriers.forEach(barrier => {
        if (barrier.inBarrier(player)){
            inBarrier = true;
        }
    });
    if (inBarrier) {
        bdysh();
        return;
    }

    // Рисование
    bg.draw(ctx);
    fg.draw(ctx);
    barriers.forEach(barrier => {
        barrier.draw(ctx);
    });
    player.draw(ctx);
    ctx.drawImage(countersGround, 0, 0, ctx.canvas.width, Math.floor(ctx.canvas.height / 5));
    ctx.fillStyle = "#000";
    //ctx.font = "24px Verdana";
    //ctx.fillText("Счет: " + score, 10, Math.floor(ctx.canvas.height));

    requestAnimationFrame(draw);
}

document.addEventListener("keydown", onKeydown);
document.addEventListener("mousedown", onKeydown);

var loadCounter = 0;
function onload(){
    loadCounter++;
    if (loadCounter >= 3 + fakes.length){    
        draw();
    }
}

player.addOnload(onload);
bg.addOnload(onload);
fg.addOnload(onload);
for (let i = 0; i < fakes.length; i++) {
    const fake = fakes[i];
    fake.addOnload(onload);
}