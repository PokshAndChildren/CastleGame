import {Anyground} from "anyground";

export class Background extends Anyground {
    constructor(cvs: HTMLCanvasElement){
        super("background", 1, 0, "img/bg.jpg", cvs);
    }
}
