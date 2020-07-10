import {Anyground} from "anyground";

export class Foreground extends Anyground {
    constructor(cvs: HTMLCanvasElement){
        super("foreground", 1/6, 0, "img/fg.png", cvs);
    }
}
