import {Shape} from "shape";
import {Barrier} from "barriers/barrier";

export class Player extends Shape {
    private inJump: boolean;
    private requiredX: number;
    private floorY: any;

    constructor(cvs: HTMLCanvasElement, hSpeed: number, vSpeed: number, floorY: any){
        super("player", 0, 0, hSpeed, vSpeed, "img/player.png");
        this.floorY = floorY;
        this.inJump = true;
        this.requiredX = cvs.width/3;
        this.restart(hSpeed);
    }

    restart(hSpeed: number){
        this.hSpeed = hSpeed;
        this.x = 0;
        this.y = 0;
        this.inJump = true;
    }

    move() : void;
    move(barriers: Iterable<Barrier>) : void;
    move(barriers?: Iterable<Barrier>) {
        var oldBottom = this.bottom();
        this.vSpeed += this.img.height / 350;
        super.move();
        if (this.x > this.requiredX){
            this.x = this.requiredX;
            this.hSpeed = 0;
        }
        var floorY = null;
        if (barriers){
            for (const barrier of barriers) {
                var barrierStand = barrier.getStand();
                if (barrierStand != null && oldBottom <= barrierStand){
                    if (barrier.left() < this.right() && this.left() < barrier.right()){
                        if (floorY == null || floorY > barrierStand) {
                            floorY = barrierStand;
                        }
                    }
                }
                else if (barrier.isHole()){
                    var center = (this.left() + this.right()) / 2;
                    if (barrier.left() < center && center < barrier.right()){
                        if (floorY == null || floorY > barrier.bottom()) {
                            floorY = barrier.bottom();
                        }
                    }
                }
            }
        }
        floorY = floorY ?? this.floorY;
        if (this.bottom() > floorY) {
            this.y = floorY - this.img.height;
            this.vSpeed = 0;
        }
        this.inJump = this.bottom() < floorY; 
    }

    jump(jampAud: any, barriers: Iterable<Barrier>){
        // звук 
        jampAud.play();
        this.vSpeed = Math.floor(-this.img.height / 12);
        this.y -= Math.floor(this.img.height / 1.7);
        this.move(barriers);
    }

    isInJump(){
        return this.inJump;
    }
}
