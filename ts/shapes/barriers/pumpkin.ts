import {BarrierMiddle} from "barrierMiddle";
import { Player } from "../player";

export class Pumpkin extends BarrierMiddle {
    boom: boolean;
    private boomImg : HTMLImageElement;
    private boomAud: HTMLAudioElement;

    constructor(cvsWidth: number, floorY: number, hSpeed: number){
        super("pumpkin", cvsWidth, floorY, hSpeed, "img/barriers/pumpkin.png");
        this.boom = false;
        this.boomImg = new Image();
        this.boomImg.src = "img/barriers/boom.png";
        this.boomAud = new Audio("audio/boom.mp3");
    }

    paddingY() {
        return this.img.height / 3.5;
    }

    inBarrier(player: Player){
        if (player.bottom() == this.getStand() && this.isUnderOrBelow(player)){
            this.boom = true;
            this.boomAud.play();
            player.vSpeed = Math.floor(-this.img.height / 24);
        }
        return super.inBarrier(player);
    }

    isOutdated(){
        return this.boom || super.isOutdated();
    }

    draw(ctx: CanvasRenderingContext2D){
        if (this.boom){
            let centerX = (this.right() + this.left()) / 2;
            let centerY = (this.top() + this.bottom()) / 2;
            let x = centerX - this.boomImg.width / 2;
            let y = centerY - this.boomImg.height / 2;
            ctx.drawImage(this.boomImg, x, y);
        }
        else{
            super.draw(ctx);
        }

    }
}
