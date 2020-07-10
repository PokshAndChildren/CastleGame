var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define("shapes/shape", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Shape = void 0;
    var Shape = /** @class */ (function () {
        function Shape(name, x, y, hSpeed, vSpeed, imgSrc) {
            this.name = name;
            this.x = x;
            this.y = y;
            this.hSpeed = hSpeed;
            this.vSpeed = vSpeed;
            this.img = new Image();
            this.img.src = imgSrc;
            this.loaded = false;
            var shape = this;
            this.img.onload = function () {
                shape.loaded = true;
                shape.onload();
                if (shape.customOnload) {
                    shape.customOnload();
                }
            };
        }
        Shape.prototype.draw = function (ctx) {
            ctx.drawImage(this.img, this.x, this.y);
        };
        Shape.prototype.onload = function () {
        };
        Shape.prototype.addOnload = function (handler) {
            if (this.loaded)
                handler();
            else
                this.customOnload = handler;
        };
        Shape.prototype.move = function () {
            this.x += this.hSpeed;
            this.y += this.vSpeed;
        };
        Shape.prototype.left = function () {
            return this.x;
        };
        Shape.prototype.right = function () {
            return this.x + this.img.width;
        };
        Shape.prototype.top = function () {
            return this.y;
        };
        Shape.prototype.bottom = function () {
            return this.y + this.img.height;
        };
        return Shape;
    }());
    exports.Shape = Shape;
});
define("shapes/anygrounds/anyground", ["require", "exports", "shapes/shape"], function (require, exports, shape_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Anyground = void 0;
    var Anyground = /** @class */ (function (_super) {
        __extends(Anyground, _super);
        function Anyground(name, vPart, hSpeed, imgSrc, cvs) {
            var _this = _super.call(this, name, 0, cvs.height * (1 - vPart), hSpeed, 0, imgSrc) || this;
            _this.vPart = vPart;
            _this.width = cvs.width;
            _this.height = cvs.height * vPart;
            return _this;
        }
        Anyground.prototype.draw = function (ctx) {
            ctx.drawImage(this.img, this.x, this.y, ctx.canvas.width, ctx.canvas.height * this.vPart);
            ctx.drawImage(this.img, this.x + ctx.canvas.width, this.y, ctx.canvas.width, ctx.canvas.height * this.vPart);
        };
        Anyground.prototype.move = function () {
            _super.prototype.move.call(this);
            if (this.x <= -this.width)
                this.x += this.width;
        };
        return Anyground;
    }(shape_1.Shape));
    exports.Anyground = Anyground;
});
define("shapes/anygrounds/background", ["require", "exports", "shapes/anygrounds/anyground"], function (require, exports, anyground_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Background = void 0;
    var Background = /** @class */ (function (_super) {
        __extends(Background, _super);
        function Background(cvs) {
            return _super.call(this, "background", 1, 0, "img/bg.jpg", cvs) || this;
        }
        return Background;
    }(anyground_1.Anyground));
    exports.Background = Background;
});
define("shapes/anygrounds/foreground", ["require", "exports", "shapes/anygrounds/anyground"], function (require, exports, anyground_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Foreground = void 0;
    var Foreground = /** @class */ (function (_super) {
        __extends(Foreground, _super);
        function Foreground(cvs) {
            return _super.call(this, "foreground", 1 / 6, 0, "img/fg.png", cvs) || this;
        }
        return Foreground;
    }(anyground_2.Anyground));
    exports.Foreground = Foreground;
});
define("shapes/barriers/barrier", ["require", "exports", "shapes/shape"], function (require, exports, shape_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Barrier = void 0;
    var Barrier = /** @class */ (function (_super) {
        __extends(Barrier, _super);
        function Barrier(name, cvsWidth, floorY, hSpeed, imgSrc) {
            return _super.call(this, name, cvsWidth + Math.random() * cvsWidth / 6, floorY, hSpeed, 0, imgSrc) || this;
        }
        Barrier.prototype.getStand = function () {
            return null;
        };
        Barrier.prototype.isHole = function () {
            return false;
        };
        Barrier.prototype.inBarrier = function (player) {
            var stand = this.getStand();
            if (stand == null)
                stand = this.top();
            return (this.left() < player.right() && player.left() < this.right()
                && stand < player.bottom());
        };
        return Barrier;
    }(shape_2.Shape));
    exports.Barrier = Barrier;
});
define("shapes/player", ["require", "exports", "shapes/shape"], function (require, exports, shape_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = void 0;
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(cvs, hSpeed, vSpeed, floorY) {
            var _this = _super.call(this, "player", 0, 0, hSpeed, vSpeed, "img/player.png") || this;
            _this.floorY = floorY;
            _this.inJump = true;
            _this.requiredX = cvs.width / 3;
            _this.restart(hSpeed);
            return _this;
        }
        Player.prototype.restart = function (hSpeed) {
            this.hSpeed = hSpeed;
            this.x = 0;
            this.y = 0;
            this.inJump = true;
        };
        Player.prototype.move = function (barriers) {
            var e_1, _a;
            var oldBottom = this.bottom();
            this.vSpeed += this.img.height / 350;
            _super.prototype.move.call(this);
            if (this.x > this.requiredX) {
                this.x = this.requiredX;
                this.hSpeed = 0;
            }
            var floorY = null;
            if (barriers) {
                try {
                    for (var barriers_1 = __values(barriers), barriers_1_1 = barriers_1.next(); !barriers_1_1.done; barriers_1_1 = barriers_1.next()) {
                        var barrier = barriers_1_1.value;
                        var barrierStand = barrier.getStand();
                        if (barrierStand != null && oldBottom <= barrierStand) {
                            if (barrier.left() < this.right() && this.left() < barrier.right()) {
                                if (floorY == null || floorY > barrierStand) {
                                    floorY = barrierStand;
                                }
                            }
                        }
                        else if (barrier.isHole()) {
                            var center = (this.left() + this.right()) / 2;
                            if (barrier.left() < center && center < barrier.right()) {
                                if (floorY == null || floorY > barrier.bottom()) {
                                    floorY = barrier.bottom();
                                }
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (barriers_1_1 && !barriers_1_1.done && (_a = barriers_1.return)) _a.call(barriers_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            floorY = floorY !== null && floorY !== void 0 ? floorY : this.floorY;
            if (this.bottom() > floorY) {
                this.y = floorY - this.img.height;
                this.vSpeed = 0;
            }
            this.inJump = this.bottom() < floorY;
        };
        Player.prototype.jump = function (barriers) {
            this.vSpeed = Math.floor(-this.img.height / 12);
            this.y -= Math.floor(this.img.height / 1.7);
            this.move(barriers);
        };
        Player.prototype.isInJump = function () {
            return this.inJump;
        };
        return Player;
    }(shape_3.Shape));
    exports.Player = Player;
});
define("shapes/barriers/barrierMiddle", ["require", "exports", "shapes/barriers/barrier"], function (require, exports, barrier_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BarrierMiddle = void 0;
    var BarrierMiddle = /** @class */ (function (_super) {
        __extends(BarrierMiddle, _super);
        function BarrierMiddle(name, cvsWidth, floorY, hSpeed, imgSrc) {
            return _super.call(this, name, cvsWidth, floorY, hSpeed, imgSrc) || this;
        }
        BarrierMiddle.prototype.onload = function () {
            _super.prototype.onload.call(this);
            this.y -= this.img.height;
        };
        return BarrierMiddle;
    }(barrier_1.Barrier));
    exports.BarrierMiddle = BarrierMiddle;
});
define("shapes/barriers/pumpkin", ["require", "exports", "shapes/barriers/barrierMiddle"], function (require, exports, barrierMiddle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pumpkin = void 0;
    var Pumpkin = /** @class */ (function (_super) {
        __extends(Pumpkin, _super);
        function Pumpkin(cvsWidth, floorY, hSpeed) {
            return _super.call(this, "pumpkin", cvsWidth, floorY, hSpeed, "img/barriers/pumpkin.png") || this;
        }
        Pumpkin.prototype.getStand = function () {
            return this.top() + this.img.height / 3.5;
        };
        return Pumpkin;
    }(barrierMiddle_1.BarrierMiddle));
    exports.Pumpkin = Pumpkin;
});
define("shapes/barriers/barrel", ["require", "exports", "shapes/barriers/barrierMiddle"], function (require, exports, barrierMiddle_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Barrel = void 0;
    var Barrel = /** @class */ (function (_super) {
        __extends(Barrel, _super);
        function Barrel(cvsWidth, floorY, hSpeed) {
            return _super.call(this, "barrel", cvsWidth, floorY, hSpeed, "img/barriers/barrel.png") || this;
        }
        Barrel.prototype.getStand = function () {
            return this.top() + this.img.height / 20;
        };
        return Barrel;
    }(barrierMiddle_2.BarrierMiddle));
    exports.Barrel = Barrel;
});
define("shapes/barriers/barrierBottom", ["require", "exports", "shapes/barriers/barrier"], function (require, exports, barrier_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BarrierBottom = void 0;
    var BarrierBottom = /** @class */ (function (_super) {
        __extends(BarrierBottom, _super);
        function BarrierBottom(name, cvsWidth, floorY, hSpeed, imgSrc) {
            return _super.call(this, name, cvsWidth, floorY, hSpeed, imgSrc) || this;
        }
        BarrierBottom.prototype.onload = function () {
            _super.prototype.onload.call(this);
            this.y -= this.img.height * 0.4;
        };
        return BarrierBottom;
    }(barrier_2.Barrier));
    exports.BarrierBottom = BarrierBottom;
});
define("shapes/barriers/hole", ["require", "exports", "shapes/barriers/barrierBottom"], function (require, exports, barrierBottom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hole = void 0;
    var Hole = /** @class */ (function (_super) {
        __extends(Hole, _super);
        function Hole(cvsWidth, floorY, hSpeed) {
            return _super.call(this, "hole", cvsWidth, floorY, hSpeed, "img/barriers/hole.png") || this;
        }
        Hole.prototype.isHole = function () {
            return true;
        };
        Hole.prototype.inBarrier = function (player) {
            var padding = this.img.width / 4;
            return (this.left() + padding < player.right() && player.left() < this.right() - padding
                && this.top() < player.bottom());
        };
        return Hole;
    }(barrierBottom_1.BarrierBottom));
    exports.Hole = Hole;
});
define("game", ["require", "exports", "shapes/anygrounds/background", "shapes/anygrounds/foreground", "shapes/player", "shapes/barriers/pumpkin", "shapes/barriers/barrel", "shapes/barriers/hole"], function (require, exports, background_1, foreground_1, player_1, pumpkin_1, barrel_1, hole_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //x - вправо
    //y - вниз
    //width - ширина
    //height - высота
    var hSpeed = 20;
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext("2d");
    ctx.canvas.width = 4000;
    ctx.canvas.height = 2000;
    var bdyshImg = new Image();
    var gameOverImg = new Image();
    var countersGround = new Image();
    bdyshImg.src = "img/bdysh.png";
    gameOverImg.src = "img/gameOver.png";
    countersGround.src = "img/countersGround.png";
    var bg = new background_1.Background(cvs);
    var fg = new foreground_1.Foreground(cvs);
    var floorY = cvs.height - fg.height * 0.5;
    var player = new player_1.Player(cvs, hSpeed, 0, floorY);
    var fakes = [
        new pumpkin_1.Pumpkin(cvs.width, floorY, 0),
        new barrel_1.Barrel(cvs.width, floorY, 0),
        new hole_1.Hole(cvs.width, floorY, 0)
    ];
    var barrierTypes = [barrel_1.Barrel, hole_1.Hole, pumpkin_1.Pumpkin];
    var barriers = [];
    function addBarrier() {
        var barrierTypeIndex = Math.floor(Math.random() * barrierTypes.length);
        var barrierType = barrierTypes[barrierTypeIndex];
        barriers.push(new barrierType(cvs.width, floorY, player.hSpeed - hSpeed));
    }
    var lives = 1;
    var score = 0;
    var wasKeydown = false;
    function onKeydown() {
        if ((lives == 0 || !player.isInJump()) && !wasKeydown) {
            wasKeydown = true;
            addBarrier();
        }
    }
    function gameOver() {
        if (wasKeydown)
            location.reload();
        else {
            ctx.drawImage(gameOverImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
            var text = "Попробуй ещё раз!";
            ctx.fillStyle = "#000";
            ctx.font = "330px Times New Roman";
            var textWidth = ctx.measureText(text).width;
            var textHeight = ctx.measureText('M').width;
            ctx.fillText(text, (cvs.width - textWidth) / 2, (cvs.height + textHeight) / 2);
            requestAnimationFrame(gameOver);
        }
    }
    var bdyshCounter = 0;
    function bdysh() {
        if (bdyshCounter == 0)
            bdyshCounter = 20;
        else
            bdyshCounter--;
        if (bdyshCounter == 0) {
            lives--;
            if (lives == 0)
                gameOver();
            else
                reStart();
        }
        else {
            ctx.drawImage(bdyshImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
            requestAnimationFrame(bdysh);
        }
    }
    function reStart() {
        bg.hSpeed = 0;
        fg.hSpeed = 0;
        player.restart(hSpeed);
        barriers = [];
        addBarrier();
        requestAnimationFrame(draw);
    }
    function draw() {
        // Сдвиг
        bg.move();
        fg.move();
        barriers.forEach(function (barrier) {
            barrier.move();
        });
        if (wasKeydown) {
            wasKeydown = false;
            player.jump(barriers);
        }
        else
            player.move(barriers);
        // Проверка на конец выбегания
        if (player.hSpeed == 0) {
            bg.hSpeed = -hSpeed / 2;
            fg.hSpeed = -hSpeed;
            barriers.forEach(function (barrier) {
                barrier.hSpeed = -hSpeed;
            });
        }
        // Проверка на столкновение с барьером
        var inBarrier = false;
        barriers.forEach(function (barrier) {
            if (barrier.inBarrier(player)) {
                inBarrier = true;
            }
        });
        if (inBarrier) {
            bdysh();
            return;
        }
        // Рисование
        bg.draw(ctx);
        fg.draw(ctx);
        barriers.forEach(function (barrier) {
            barrier.draw(ctx);
        });
        player.draw(ctx);
        //ctx.drawImage(countersGround, 0, 0, ctx.canvas.width, Math.floor(ctx.canvas.height / 5));
        //ctx.drawImage(countersGround, 0, 0, ctx.canvas.width, Math.floor(ctx.canvas.height / 5));
        ctx.fillStyle = "#fff";
        ctx.font = "70px Times New Roman";
        ctx.fillText("Счет: " + score, 60, 130);
        for (var i = barriers.length - 1; i >= 0; i--) {
            var bar = barriers[i];
            if (bar.right() < player.left() && bar.right() >= player.left() - hSpeed) {
                score++;
            }
            if (bar.right() < 0) {
                barriers.splice(i, 1);
            }
        }
        requestAnimationFrame(draw);
    }
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("mousedown", onKeydown);
    var loadCounter = 0;
    function onload() {
        loadCounter++;
        if (loadCounter >= 3 + fakes.length) {
            reStart();
        }
    }
    player.addOnload(onload);
    bg.addOnload(onload);
    fg.addOnload(onload);
    for (var i = 0; i < fakes.length; i++) {
        var fake = fakes[i];
        fake.addOnload(onload);
    }
});
define("shapes/barriers/pillar", ["require", "exports", "shapes/barriers/barrierMiddle"], function (require, exports, barrierMiddle_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pillar = void 0;
    var Pillar = /** @class */ (function (_super) {
        __extends(Pillar, _super);
        function Pillar(cvsWidth, floorY, hSpeed) {
            return _super.call(this, "pillar", cvsWidth, floorY, hSpeed, "img/barriers/pillar.png") || this;
        }
        Pillar.prototype.getStand = function () {
            return null;
        };
        return Pillar;
    }(barrierMiddle_3.BarrierMiddle));
    exports.Pillar = Pillar;
});
//# sourceMappingURL=game.js.map