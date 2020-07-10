import {Shape} from "../shape";

export class Anyground extends Shape {
    vPart: number;
    width: number;
    height: number;

    constructor(name: string, vPart: number, hSpeed: number, imgSrc: string, cvs: HTMLCanvasElement){
        super(name, 0, cvs.height * (1 - vPart), hSpeed, 0, imgSrc);
        this.vPart = vPart;
        this.width = cvs.width;
        this.height = cvs.height * vPart;
    }

    draw(ctx: CanvasRenderingContext2D){
        ctx.drawImage(this.img, this.x, this.y, ctx.canvas.width, ctx.canvas.height*this.vPart);
        ctx.drawImage(this.img, this.x+ctx.canvas.width, this.y, ctx.canvas.width, ctx.canvas.height*this.vPart);
    }

    move(){
        super.move();
        if (this.x <= -this.width)
            this.x += this.width;
    }
}
