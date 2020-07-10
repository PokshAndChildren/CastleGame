import {BarrierBottom} from "barrierBottom";
import {Player} from "../player";

export class Hole extends BarrierBottom {
    constructor(cvsWidth: number, floorY: number, hSpeed: number){
        super("hole", cvsWidth, floorY, hSpeed, "img/barriers/hole.png");
    }
    isHole(){
        return true;
    }
    inBarrier(player: Player){
        var padding = this.img.width / 4;
        return (this.left() + padding < player.right() && player.left() < this.right() - padding 
            && this.top() < player.bottom());
    }
}
