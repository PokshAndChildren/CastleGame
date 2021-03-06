import {Shape} from "shape";
import {Barrier} from "barriers/barrier";
import { Hole } from "./barriers/hole";

export class Player extends Shape {
    private inJump: boolean;
    private requiredX: number;
    private floorY: any;
    public finished: boolean = false;

    constructor(cvs: HTMLCanvasElement, hSpeed: number, vSpeed: number, floorY: any){
        super("player", 0, 0, hSpeed, vSpeed, "img/player.png");
        this.floorY = floorY;
        this.inJump = true;
        this.requiredX = cvs.width/4;
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
        if (this.x > this.requiredX && !this.finished){
            this.x = this.requiredX;
            this.hSpeed = 0;
        }
        var floorY = null;
        if (barriers){
            for (const barrier of barriers) {
                var barrierStand = barrier.getStand();
                if (barrierStand != null && oldBottom <= barrierStand){
                    if (barrier.isUnderOrBelow(this)){
                        if (floorY == null || floorY > barrierStand) {
                            floorY = barrierStand;
                        }
                    }
                }
                else if (barrier instanceof Hole){
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

    jump(jumpSound: any, barriers: Iterable<Barrier>){
        if (!this.isInJump()) {
            // звук 
            jumpSound.play();
            this.vSpeed = Math.floor(-this.img.height / 12);
            this.y -= Math.floor(this.img.height / 1.7);
            this.move(barriers);
            return true;
        }
        return false;
    }

    isInJump(){
        return this.inJump;
    }
}
