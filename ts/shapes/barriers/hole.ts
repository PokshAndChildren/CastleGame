import {BarrierBottom} from "barrierBottom";
import {Player} from "../player";

export class Hole extends BarrierBottom {
    constructor(cvsWidth: number, floorY: number, hSpeed: number){
        super("hole", cvsWidth, floorY, hSpeed, "img/barriers/hole.png");
    }

    inBarrier(player: Player){
        var padding = this.paddingY();
        if( this.isUnderOrBelow(player) && (this.top() + this.paddingY() + 1 < player.bottom()))
        return true;
        else return false;
    }

    paddingY(){
        return this.img.height * 0.40;
    }
}
