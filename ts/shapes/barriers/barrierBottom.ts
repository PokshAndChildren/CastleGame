import {Barrier} from "barrier";

export class BarrierBottom extends Barrier {
    constructor(name: string, cvsWidth: number, floorY: number, hSpeed: number, imgSrc: string){
        super(name, cvsWidth, floorY, hSpeed, imgSrc);
    }
    onload(){
        super.onload();
        this.y -= this.img.height*0.4;
    }
}
