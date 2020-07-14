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
define("autopause", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AutoPause = void 0;
    // @ts-nocheck
    var AutoPause = /** @class */ (function () {
        function AutoPause() {
            this.mediaElements = [];
            this.playing = false;
            // Set the name of the hidden property and the change event for visibility
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            }
            else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            }
            else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            var self = this;
            // If the page is hidden, pause the video;
            // if the page is shown, play the video
            function handleVisibilityChange() {
                var e_1, _a, e_2, _b;
                if (document[hidden]) {
                    try {
                        for (var _c = __values(self.mediaElements), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var media = _d.value;
                            media.pause();
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    if (self.playing) {
                        try {
                            for (var _e = __values(self.mediaElements), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var media = _f.value;
                                media.play();
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
            }
            // Warn if the browser doesn't support addEventListener or the Page Visibility API
            if (typeof document.addEventListener === "undefined" || hidden === undefined) {
                console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
            }
            else {
                // Handle page visibility change   
                document.addEventListener(visibilityChange, handleVisibilityChange, false);
            }
        }
        AutoPause.prototype.add = function (media) {
            this.mediaElements.push(media);
            if (this.playing)
                media.play();
            else
                media.pause();
        };
        AutoPause.prototype.play = function () {
            var e_3, _a;
            this.playing = true;
            try {
                for (var _b = __values(this.mediaElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var media = _c.value;
                    media.play();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        AutoPause.prototype.pause = function () {
            var e_4, _a;
            this.playing = false;
            try {
                for (var _b = __values(this.mediaElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var media = _c.value;
                    media.pause();
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        return AutoPause;
    }());
    exports.AutoPause = AutoPause;
});
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
        Barrier.prototype.isOutdated = function () {
            return this.right() < 0;
        };
        Barrier.prototype.getStand = function () {
            return this.hasStand() ? this.top() + this.paddingY() : null;
        };
        Barrier.prototype.hasStand = function () {
            return false;
        };
        Barrier.prototype.isUnderOrBelow = function (player) {
            return this.left() + this.paddingX() < player.right() && player.left() < this.right() - this.paddingX();
        };
        Barrier.prototype.inBarrier = function (player) {
            var stand = this.getStand();
            if (stand == null)
                stand = this.top() + this.paddingY();
            return this.isUnderOrBelow(player) && stand < player.bottom();
        };
        Barrier.prototype.paddingX = function () {
            var pad = Math.floor(this.img.width / 15);
            return pad;
        };
        Barrier.prototype.paddingY = function () {
            var pad = Math.floor(this.img.height / 20);
            return pad;
        };
        return Barrier;
    }(shape_2.Shape));
    exports.Barrier = Barrier;
});
define("shapes/barriers/barrierBottom", ["require", "exports", "shapes/barriers/barrier"], function (require, exports, barrier_1) {
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
            this.y -= this.img.height * 0.35;
        };
        return BarrierBottom;
    }(barrier_1.Barrier));
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
        Hole.prototype.inBarrier = function (player) {
            var padding = this.paddingY();
            if (this.isUnderOrBelow(player) && (this.top() + this.paddingY() + 1 < player.bottom()))
                return true;
            else
                return false;
        };
        Hole.prototype.paddingY = function () {
            return this.img.height * 0.40;
        };
        return Hole;
    }(barrierBottom_1.BarrierBottom));
    exports.Hole = Hole;
});
define("shapes/player", ["require", "exports", "shapes/shape", "shapes/barriers/hole"], function (require, exports, shape_3, hole_1) {
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
            var e_5, _a;
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
                            if (barrier.isUnderOrBelow(this)) {
                                if (floorY == null || floorY > barrierStand) {
                                    floorY = barrierStand;
                                }
                            }
                        }
                        else if (barrier instanceof hole_1.Hole) {
                            var center = (this.left() + this.right()) / 2;
                            if (barrier.left() < center && center < barrier.right()) {
                                if (floorY == null || floorY > barrier.bottom()) {
                                    floorY = barrier.bottom();
                                }
                            }
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (barriers_1_1 && !barriers_1_1.done && (_a = barriers_1.return)) _a.call(barriers_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
            floorY = floorY !== null && floorY !== void 0 ? floorY : this.floorY;
            if (this.bottom() > floorY) {
                this.y = floorY - this.img.height;
                this.vSpeed = 0;
            }
            this.inJump = this.bottom() < floorY;
        };
        Player.prototype.jump = function (jumpSound, barriers) {
            if (!this.isInJump()) {
                // звук 
                jumpSound.play();
                this.vSpeed = Math.floor(-this.img.height / 12);
                this.y -= Math.floor(this.img.height / 1.7);
                this.move(barriers);
                return true;
            }
            return false;
        };
        Player.prototype.isInJump = function () {
            return this.inJump;
        };
        return Player;
    }(shape_3.Shape));
    exports.Player = Player;
});
define("shapes/barriers/barrierMiddle", ["require", "exports", "shapes/barriers/barrier"], function (require, exports, barrier_2) {
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
        BarrierMiddle.prototype.hasStand = function () {
            return true;
        };
        return BarrierMiddle;
    }(barrier_2.Barrier));
    exports.BarrierMiddle = BarrierMiddle;
});
define("shapes/barriers/pumpkin", ["require", "exports", "shapes/barriers/barrierMiddle"], function (require, exports, barrierMiddle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pumpkin = void 0;
    var Pumpkin = /** @class */ (function (_super) {
        __extends(Pumpkin, _super);
        function Pumpkin(cvsWidth, floorY, hSpeed) {
            var _this = _super.call(this, "pumpkin", cvsWidth, floorY, hSpeed, "img/barriers/pumpkin.png") || this;
            _this.boom = false;
            _this.boomImg = new Image();
            _this.boomImg.src = "img/barriers/boom.png";
            _this.boomAud = new Audio("audio/boom.mp3");
            return _this;
        }
        Pumpkin.prototype.paddingY = function () {
            return this.img.height / 3.5;
        };
        Pumpkin.prototype.inBarrier = function (player) {
            if (player.bottom() == this.getStand() && this.isUnderOrBelow(player)) {
                this.boom = true;
                this.boomAud.play();
            }
            return _super.prototype.inBarrier.call(this, player);
        };
        Pumpkin.prototype.isOutdated = function () {
            return this.boom || _super.prototype.isOutdated.call(this);
        };
        Pumpkin.prototype.draw = function (ctx) {
            if (this.boom) {
                var centerX = (this.right() + this.left()) / 2;
                var centerY = (this.top() + this.bottom()) / 2;
                var x = centerX - this.boomImg.width / 2;
                var y = centerY - this.boomImg.height / 2;
                ctx.drawImage(this.boomImg, x, y);
            }
            else {
                _super.prototype.draw.call(this, ctx);
            }
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
        return Barrel;
    }(barrierMiddle_2.BarrierMiddle));
    exports.Barrel = Barrel;
});
define("game", ["require", "exports", "autopause", "shapes/anygrounds/background", "shapes/anygrounds/foreground", "shapes/player", "shapes/barriers/pumpkin", "shapes/barriers/barrel", "shapes/barriers/hole"], function (require, exports, autopause_1, background_1, foreground_1, player_1, pumpkin_1, barrel_1, hole_2) {
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
    ctx.canvas.height = 1950;
    var bdyshImg = new Image();
    var gameOverImg = new Image();
    var countersGround = new Image();
    var liveImg = new Image();
    var startImg = new Image();
    bdyshImg.src = "img/bdysh.png";
    gameOverImg.src = "img/gameOver.png";
    countersGround.src = "img/countersGround.png";
    liveImg.src = "img/live.png";
    startImg.src = "img/start.png";
    var bg = new background_1.Background(cvs);
    var fg = new foreground_1.Foreground(cvs);
    var floorY = cvs.height - fg.height * 0.5;
    var player = new player_1.Player(cvs, hSpeed, 0, floorY);
    var sound = new Audio('audio/sound.mp3');
    var jumpAud = new Audio("audio/jump.mp3");
    var gameOverAud = new Audio("audio/gameOver.mp3");
    sound.loop = true;
    sound.autoplay = true;
    var autopause = new autopause_1.AutoPause();
    autopause.add(sound);
    var fakes = [
        new pumpkin_1.Pumpkin(cvs.width, floorY, 0),
        new barrel_1.Barrel(cvs.width, floorY, 0),
        new hole_2.Hole(cvs.width, floorY, 0)
    ];
    var barrierTypes = [barrel_1.Barrel, hole_2.Hole, pumpkin_1.Pumpkin];
    var barriers = [];
    function addBarrier() {
        var barrierTypeIndex = Math.floor(Math.random() * barrierTypes.length);
        var barrierType = barrierTypes[barrierTypeIndex];
        barriers.push(new barrierType(cvs.width, floorY, player.hSpeed - hSpeed));
    }
    var lives = 3;
    var score = 0;
    var wasClicked = false;
    function onClick() {
        if (!wasClicked) {
            wasClicked = true;
        }
    }
    var keydown = false;
    function onKeydown() {
        keydown = true;
        onClick();
    }
    function onKeyup() {
        keydown = false;
    }
    function gameOver() {
        autopause.pause();
        if (wasClicked)
            location.reload();
        else {
            ctx.drawImage(gameOverImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
            var text = "Всего " + score + "?";
            ctx.fillStyle = "#000";
            ctx.font = "200px Times New Roman";
            var textWidth = ctx.measureText(text).width;
            var textHeight = ctx.measureText('M').width;
            ctx.fillText(text, (cvs.width - textWidth) / 2, (cvs.height - textHeight) / 2 - 100);
            text = "Попробуй ещё раз!";
            ctx.fillStyle = "#000";
            ctx.font = "330px Times New Roman";
            var textWidth = ctx.measureText(text).width;
            var textHeight = ctx.measureText('M').width;
            ctx.fillText(text, (cvs.width - textWidth) / 2, (cvs.height + textHeight) / 2 + 85);
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
            if (lives == 0) {
                gameOverAud.play();
                gameOver();
            }
            else
                reStart();
        }
        else {
            ctx.drawImage(bdyshImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
            requestAnimationFrame(bdysh);
        }
    }
    function reStart() {
        autopause.play();
        bg.hSpeed = 0;
        fg.hSpeed = 0;
        player.restart(hSpeed);
        barriers = [];
        addBarrier();
        requestAnimationFrame(draw);
    }
    function draw() {
        var e_6, _a;
        // Сдвиг
        bg.move();
        fg.move();
        barriers.forEach(function (barrier) {
            barrier.move();
        });
        if (wasClicked && player.jump(jumpAud, barriers))
            addBarrier();
        else
            player.move(barriers);
        wasClicked = false;
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
        // Счет
        ctx.fillStyle = "#000";
        ctx.font = "70px Times New Roman";
        ctx.drawImage(countersGround, 70, 70, 375, 110);
        //ctx.drawImage(countersGround, 0, 0, ctx.canvas.width, Math.floor(ctx.canvas.height / 5));
        ctx.fillText("Счет: " + score, 135, 150);
        // Жизни
        var liveSize = 150;
        for (var i = 0; i < lives; i++) {
            ctx.drawImage(liveImg, ctx.canvas.width - (liveSize + 40) * (i + 1) - 75, 70, liveSize, liveSize);
        }
        // Подсчёт очков и удаление устаревших барьеров
        var oldScore = score;
        for (var i = barriers.length - 1; i >= 0; i--) {
            var bar = barriers[i];
            if (bar instanceof pumpkin_1.Pumpkin && bar.boom) {
                score += 2;
            }
            else if (bar.right() < player.left() && bar.right() >= player.left() - hSpeed) {
                score++;
            }
            if (bar.isOutdated()) {
                barriers.splice(i, 1);
            }
        }
        var speedScore = 20;
        var speedDiff = Math.floor(score / speedScore) - Math.floor(oldScore / speedScore);
        if (speedDiff > 0) {
            hSpeed += 1;
            bg.hSpeed = Math.floor(-hSpeed / 2);
            fg.hSpeed = -hSpeed;
            try {
                for (var barriers_2 = __values(barriers), barriers_2_1 = barriers_2.next(); !barriers_2_1.done; barriers_2_1 = barriers_2.next()) {
                    var i = barriers_2_1.value;
                    i.hSpeed = -hSpeed;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (barriers_2_1 && !barriers_2_1.done && (_a = barriers_2.return)) _a.call(barriers_2);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        var barScore = 25;
        if (Math.floor(score / barScore) - Math.floor(oldScore / barScore) > 0) {
            addBarrier();
        }
        if (keydown)
            onClick();
        requestAnimationFrame(draw);
    }
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("touchstart", onClick);
    var loadCounter = 0;
    function onload() {
        loadCounter++;
        if (loadCounter >= 3 + fakes.length) {
            if (wasClicked)
                reStart();
            else {
                ctx.drawImage(startImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
                var text = "ХРУМЗИК ВЕНЯ";
                ctx.fillStyle = "#000";
                ctx.font = "300px Times New Roman";
                var textWidth = ctx.measureText(text).width;
                var textHeight = ctx.measureText('M').width;
                ctx.fillText(text, (cvs.width - textWidth) / 2, (cvs.height + textHeight) / 2 - 250);
                var text = "или";
                ctx.fillStyle = "#000";
                ctx.font = "100px Times New Roman";
                var textWidth = ctx.measureText(text).width;
                var textHeight = ctx.measureText('M').width;
                ctx.fillText(text, (cvs.width - textWidth) / 2, (cvs.height + textHeight) / 2);
                var text = "ПРОГУЛКА ПО ЗАМКУ";
                ctx.fillStyle = "#000";
                ctx.font = "150px Times New Roman";
                var textWidth = ctx.measureText(text).width;
                var textHeight = ctx.measureText('M').width;
                ctx.fillText(text, (cvs.width - textWidth) / 2, (cvs.height + textHeight) / 2 + 180);
                requestAnimationFrame(onload);
            }
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
        Pillar.prototype.hasStand = function () {
            return false;
        };
        return Pillar;
    }(barrierMiddle_3.BarrierMiddle));
    exports.Pillar = Pillar;
});
//# sourceMappingURL=game.js.map