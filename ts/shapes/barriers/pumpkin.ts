import {BarrierMiddle} from "barrierMiddle";

export class Pumpkin extends BarrierMiddle {
    constructor(cvsWidth: number, floorY: number, hSpeed: number){
        super("pumpkin", cvsWidth, floorY, hSpeed, "img/barriers/pumpkin.png");
    }

    getStand() {
        return this.top() + this.img.height / 3.5;
    }
}
