import {BarrierMiddle} from "barrierMiddle";

export class Pillar extends BarrierMiddle {
    constructor(cvsWidth: number, floorY: number, hSpeed: number){
        super("pillar", cvsWidth, floorY, hSpeed, "img/barriers/pillar.png");
    }

    hasStand() {
        return false;
    }
}
