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
ctx.canvas.height = 1950;

var bdyshImg = new Image();
var gameOverImg = new Image();
var countersGround = new Image();
var liveImg = new Image();
bdyshImg.src = "img/bdysh.png";
gameOverImg.src = "img/gameOver.png";
countersGround.src = "img/countersGround.png";
liveImg.src = "img/live.png";
var bg = new Background(cvs);
var fg = new Foreground(cvs);
var floorY = cvs.height - fg.height*0.5;
var player = new Player(cvs, hSpeed, 0, floorY);

var sound = new Audio('audio/sound.mp3');
var jampAud = new Audio("audio/jamp.mp3");
var gameOverAud = new Audio("audio/gameOver.mp3");
sound.loop = true;
sound.autoplay = true;

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

var lives = 3;
var score = 0;

var wasKeydown = false;
function onKeydown() {
    sound.play();
    if ((lives == 0 || !player.isInJump()) && !wasKeydown) {
        wasKeydown = true;
        addBarrier();
    }
}

function gameOver(){
    sound.pause();
    if (wasKeydown)
        location.reload();   
    else {
        ctx.drawImage(gameOverImg, 0, 0, ctx.canvas.width, ctx.canvas.height);

        var text = "Счет: ";
        ctx.fillStyle = "#000";
        ctx.font = "200px Times New Roman";
        var textWidth = ctx.measureText(text).width;
        var textHeight = ctx.measureText('M').width;
        ctx.fillText(text + score, (cvs.width - textWidth)/2, (cvs.height - textHeight)/2);

        var text = "Попробуй ещё раз!";
        ctx.fillStyle = "#000";
        ctx.font = "330px Times New Roman";
        var textWidth = ctx.measureText(text).width;
        var textHeight = ctx.measureText('M').width;
        ctx.fillText(text, (cvs.width - textWidth)/2, (cvs.height + textHeight)/2);
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
        if (lives == 0){
            gameOverAud.play();
            gameOver();
        }
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
        player.jump(jampAud, barriers);
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
    
    // Счет
    ctx.fillStyle = "#000";
    ctx.font = "70px Times New Roman";
    ctx.drawImage(countersGround, 70, 70, 375, 110);
    //ctx.drawImage(countersGround, 0, 0, ctx.canvas.width, Math.floor(ctx.canvas.height / 5));
    ctx.fillText("Счет: " + score, 135, 150);

    // Жизни
    var liveSize = 150;
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(liveImg, ctx.canvas.width - (liveSize+15)*(i+1) - 75, 70, liveSize, liveSize);
    }

    for (let i = barriers.length - 1; i >= 0; i--) {
        const bar = barriers[i];
        if (bar.right() < player.left() && bar.right() >= player.left() - hSpeed){
            score ++;
        }
        if (bar.right() < 0) {
            barriers.splice(i, 1);
        }
    }
    
    requestAnimationFrame(draw);
}


document.addEventListener("keydown", onKeydown);
document.addEventListener("mousedown", onKeydown);
document.addEventListener("touchstart", onKeydown);

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
