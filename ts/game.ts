import {AutoPause} from "autopause";
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
bdyshImg.src = "img/bdysh.png";

var liveImg = new Image();
liveImg.src = "img/live.png";

var borderImg = new Image();
borderImg.src = "img/border.png";

// var gameOverImg = new Image();
//gameOverImg.src = "img/gameOver.png";
var gameOverImg = borderImg;

// var countersGround = new Image();
// countersGround.src = "img/countersGround.png";
var countersGround = borderImg;

// var startImg = new Image();
// startImg.src = "img/start.png";
var startImg = borderImg;

// var winImg = new Image();
// winImg.src = "img/win.png";
var winImg = borderImg;

var bg = new Background(cvs);
var fg = new Foreground(cvs);
var floorY = cvs.height - fg.height*0.5;
var player = new Player(cvs, hSpeed, 0, floorY);

var sound = new Audio('audio/sound.mp3');
var jumpAud = new Audio("audio/jump.mp3");
var gameOverAud = new Audio("audio/gameOver.mp3");
sound.loop = true;
sound.autoplay = true;
var autopause = new AutoPause();
autopause.add(sound);

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
var maxScore = 250;
var score = 0;

var wasClicked = false;
function onClick() {
    if (!wasClicked) {
        wasClicked = true;
    }
}
var keydown = false;
function onKeydown(){
    keydown = true;
    onClick();
}
function onKeyup(){
    keydown = false;
}

function win(){
    autopause.pause();
    if (wasClicked)
        location.reload();   
    else {
        ctx.drawImage(winImg, 0, 0, ctx.canvas.width, ctx.canvas.height);

        var text = "Твой результат - " + score + "!";
        ctx.fillStyle = "#000";
        ctx.font = "200px Times New Roman";
        var textWidth = ctx.measureText(text).width;
        var textHeight = ctx.measureText('M').width;
        ctx.fillText(text, (cvs.width - textWidth)/2, (cvs.height - textHeight)/2 - 100 );

        text = "Победа!";
        ctx.fillStyle = "#000";
        ctx.font = "330px Times New Roman";
        var textWidth = ctx.measureText(text).width;
        var textHeight = ctx.measureText('M').width;
        ctx.fillText(text, (cvs.width - textWidth)/2, (cvs.height + textHeight)/2 + 85);
        requestAnimationFrame(win);
    }
}

function gameOver(){
    autopause.pause();
    if (wasClicked)
        location.reload();   
    else {
        ctx.drawImage(gameOverImg, 0, 0, ctx.canvas.width, ctx.canvas.height);

        var text = "Всего " + score + "?";
        ctx.fillStyle = "#000";
        ctx.font = "200px Times New Roman";
        var textWidth = ctx.measureText(text).width;
        var textHeight = ctx.measureText('M').width;
        ctx.fillText(text, (cvs.width - textWidth)/2, (cvs.height - textHeight)/2 - 100 );

        text = "Попробуй ещё раз!";
        ctx.fillStyle = "#000";
        ctx.font = "330px Times New Roman";
        var textWidth = ctx.measureText(text).width;
        var textHeight = ctx.measureText('M').width;
        ctx.fillText(text, (cvs.width - textWidth)/2, (cvs.height + textHeight)/2 + 85);
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
    autopause.play();
    bg.hSpeed = 0;
    fg.hSpeed = 0;
    player.restart(hSpeed);
    barriers = [];
    addBarrier();
    requestAnimationFrame(draw);
}

function draw() {
    if (score >= maxScore && barriers.length == 0){
        bg.hSpeed = 0;
        fg.hSpeed = 0;
        player.hSpeed = hSpeed;
        player.finished = true;
    }
    if (player.x >= ctx.canvas.width){
        wasClicked = false;
        win();
        return;
    }
    // Сдвиг
    bg.move();
    fg.move();
    barriers.forEach(barrier => {
        barrier.move();
    });
    if (wasClicked && player.jump(jumpAud, barriers)){
        sound.play();
        if (score < maxScore) {
            addBarrier();
        }
    }
    else
        player.move(barriers);
    wasClicked = false;

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
        ctx.drawImage(liveImg, ctx.canvas.width - (liveSize + 40)*(i+1) - 75, 70, liveSize, liveSize);
    }

    // Подсчёт очков и удаление устаревших барьеров
    var oldScore = score;
    for (let i = barriers.length - 1; i >= 0; i--) {
        const bar = barriers[i];
        if (bar instanceof Pumpkin && bar.boom) {
            score += 2;
        }
        else if (bar.right() < player.left() && bar.right() >= player.left() - hSpeed){
            score ++;
        }
        if (bar.isOutdated()) {
            barriers.splice(i, 1);
        }
    }
    var speedScore = 20;
    var speedDiff = Math.floor(score / speedScore) - Math.floor(oldScore / speedScore);
    if (speedDiff > 0) {
        hSpeed += 1;
        bg.hSpeed = Math.floor(-hSpeed / 2);
        fg.hSpeed = -hSpeed;  
        
        for (const i of barriers) {
            i.hSpeed = -hSpeed;  
        }
    }
    var barScore = 25;
    if (Math.floor(score / barScore) - Math.floor(oldScore / barScore) > 0) {
        addBarrier();
    }

    if (keydown)
        onClick();
    
    requestAnimationFrame(draw);
}


document.addEventListener("keydown", onKeydown);
document.addEventListener("keyup", onKeyup);
document.addEventListener("mousedown", onClick);
document.addEventListener("touchstart", onClick);

var loadCounter = 0;
function onload(){
    loadCounter++;
    if (loadCounter >= 3 + fakes.length){
        if (wasClicked)
            reStart();
        else {    
            ctx.drawImage(startImg, 0, 0, ctx.canvas.width, ctx.canvas.height);

            var text = "ХРУМЗИК ВЕНЯ";
            ctx.fillStyle = "#000";
            ctx.font = "300px Times New Roman";
            var textWidth = ctx.measureText(text).width;
            var textHeight = ctx.measureText('M').width;
            ctx.fillText(text, (cvs.width - textWidth)/2, (cvs.height + textHeight)/2 - 250);

            var text = "или";
            ctx.fillStyle = "#000";
            ctx.font = "100px Times New Roman";
            var textWidth = ctx.measureText(text).width;
            var textHeight = ctx.measureText('M').width;
            ctx.fillText(text, (cvs.width - textWidth)/2, (cvs.height + textHeight)/2);

            var text = "ПРОГУЛКА ПО ЗАМКУ";
            ctx.fillStyle = "#000";
            ctx.font = "150px Times New Roman";
            var textWidth = ctx.measureText(text).width;
            var textHeight = ctx.measureText('M').width;
            ctx.fillText(text, (cvs.width - textWidth)/2, (cvs.height + textHeight)/2 + 180);

            requestAnimationFrame(onload);
        }
    }
}

player.addOnload(onload);
bg.addOnload(onload);
fg.addOnload(onload);
for (let i = 0; i < fakes.length; i++) {
    const fake = fakes[i];
    fake.addOnload(onload);
}
