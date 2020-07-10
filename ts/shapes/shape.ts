export class Shape {
    name: string;
    x: number;
    y: number;
    hSpeed: number;
    vSpeed: number;
    img: HTMLImageElement;

    private loaded: boolean;
    private customOnload?: () => void;

    constructor(name: string, x: number, y: number, hSpeed: number, vSpeed: number, imgSrc: string){
        this.name = name;
        this.x = x;
        this.y = y;
        this.hSpeed = hSpeed;
        this.vSpeed = vSpeed;
        this.img = new Image();
        this.img.src = imgSrc;
        this.loaded = false;
        var shape = this;
        this.img.onload = function(){
            shape.loaded = true;
            shape.onload();
            if (shape.customOnload) {
                shape.customOnload();
            }
        }
    }
  
    draw(ctx: CanvasRenderingContext2D){
        ctx.drawImage(this.img, this.x, this.y);
    }

    onload() {
    }

    addOnload(handler: () => void){
        if (this.loaded)
            handler();
        else
            this.customOnload = handler;
    }

    move(){
        this.x += this.hSpeed;
        this.y += this.vSpeed;
    }

    left(){
        return this.x;
    }
    right(){
        return this.x + this.img.width;
    }
    top(){
        return this.y;
    }
    bottom(){
        return this.y + this.img.height;
    }
}
