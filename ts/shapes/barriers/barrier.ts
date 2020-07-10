import {Shape} from "../shape";
import {Player} from "../player";

export class Barrier extends Shape {
    constructor(name: string, cvsWidth: number, floorY: number, hSpeed: number, imgSrc: string){
        super(name, cvsWidth + Math.random()*cvsWidth/6, floorY, hSpeed, 0, imgSrc);
    }

    getStand(): number | null {
        return null;
    }

    isHole() {
        return false;
    }
    inBarrier(player: Player){
        var stand = this.getStand();
        if (stand == null)
            stand = this.top();
        return (this.left() < player.right() && player.left() < this.right() 
            && stand < player.bottom());
    }
}
