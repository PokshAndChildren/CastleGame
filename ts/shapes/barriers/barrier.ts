import {Shape} from "../shape";
import {Player} from "../player";

export class Barrier extends Shape {
    constructor(name: string, cvsWidth: number, floorY: number, hSpeed: number, imgSrc: string){
        super(name, cvsWidth + Math.random()*cvsWidth/6, floorY, hSpeed, 0, imgSrc);
    }

    isOutdated(){
        return this.right() < 0;
    }

    getStand(): number | null {
        return this.hasStand() ? this.top() + this.paddingY() : null;
    }

    hasStand(){
        return false;
    }

    isUnderOrBelow(player: Player){
        return this.left() + this.paddingX() < player.right() && player.left() < this.right() - this.paddingX();
    }

    inBarrier(player: Player){
        var stand = this.getStand();
        if (stand == null)
            stand = this.top() + this.paddingY();
        return this.isUnderOrBelow(player) && stand < player.bottom();
    }
 
    paddingX(){
        var pad = Math.floor(this.img.width / 15);
        return pad;
    }
 
    paddingY(){
        var pad = Math.floor(this.img.height / 20);
        return pad;
    }
}
