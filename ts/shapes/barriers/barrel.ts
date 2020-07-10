import {BarrierMiddle} from "barrierMiddle";

export class Barrel extends BarrierMiddle {
    constructor(cvsWidth: number, floorY: number, hSpeed: number){
        super("barrel", cvsWidth, floorY, hSpeed, "img/barriers/barrel.png");
    }
    getStand() {
        return this.top() + this.img.height / 20;
    }
}
