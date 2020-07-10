import {Background} from "shapes/anygrounds/background";
import {Foreground} from "shapes/anygrounds/foreground";
import {Player} from "shapes/player";
import {Barrier} from "shapes/barriers/barrier";
import {Pumpkin} from "shapes/barriers/pumpkin";
import {Barrel} from "shapes/barriers/barrel";
import {Hole} from "shapes/barriers/hole";

//x - вправо
//y - вниз
//width - ширина
//height - высота

var hSpeed = 20;

var cvs = document.getElementById("canvas") as HTMLCanvasElement;
var ctx = cvs!.getContext("2d") as CanvasRenderingContext2D;

ctx.canvas.width  = 4000;
ctx.canvas.height = 2000;

var bdyshImg = new Image();
var gameOverImg = new Image();
var countersGround = new Image();
bdyshImg.src = "img/bdysh.png";
gameOverImg.src = "img/gameOver.png";
countersGround.src = "img/countersGround.png";
var bg = new Background(cvs);
var fg = new Foreground(cvs);
var floorY = cvs.height - fg.height*0.5;
var player = new Player(cvs, hSpeed, 0, floorY);

var fakes = [
    new Pumpkin(cvs.width, floorY, 0),
    new Barrel(cvs.width, floorY, 0),
    new Hole(cvs.width, floorY, 0)
];

var barrierTypes = [Barrel, Hole, Pumpkin];
var barriers : Barrier[] = [];

function addBarrier(){
    var barrierTypeIndex = Math.floor(Math.random() * barrierTypes.length);
    var barrierType = barrierTypes[barrierTypeIndex];
    barriers.push(new barrierType(cvs.width, floorY, player.hSpeed - hSpeed));
}

var wasKeydown = false;
function onKeydown() {
    if (!player.isInJump() && !wasKeydown) {
        wasKeydown = true;
        addBarrier();
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
    player.restart(hSpeed);
    barriers = [];
    addBarrier();
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
    //ctx.drawImage(countersGround, 0, 0, ctx.canvas.width, Math.floor(ctx.canvas.height / 5));
    //ctx.fillStyle = "#000";
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
        reStart();
    }
}

player.addOnload(onload);
bg.addOnload(onload);
fg.addOnload(onload);
for (let i = 0; i < fakes.length; i++) {
    const fake = fakes[i];
    fake.addOnload(onload);
}
