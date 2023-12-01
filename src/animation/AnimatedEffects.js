// 点击特效
export const clickEffect = () => {
    let balls = [];
    let longPressed = false;
    let longPress;
    let multiplier = 0;
    let width, height;
    let origin;
    let normal;
    let ctx;
    const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
    const pointer = document.createElement("span");
    pointer.classList.add("pointer");
    document.body.appendChild(pointer);

    const updateSize = () => {
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(2, 2);
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
        origin = {
            x: width / 2,
            y: height / 2
        };
        normal = {
            x: width / 2,
            y: height / 2
        };
    };

    class Ball {
        constructor(x = origin.x, y = origin.y) {
            this.x = x;
            this.y = y;
            this.angle = Math.PI * 2 * Math.random();
            if (longPressed == true) {
                this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
            } else {
                this.multiplier = randBetween(6, 12);
            }
            this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
            this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
            this.r = randBetween(8, 12) + 3 * Math.random();
            this.color = colours[Math.floor(Math.random() * colours.length)];
        };
        update() {
            this.x += this.vx - normal.x;
            this.y += this.vy - normal.y;
            normal.x = -2 / window.innerWidth * Math.sin(this.angle);
            normal.y = -2 / window.innerHeight * Math.cos(this.angle);
            this.r -= 0.3;
            this.vx *= 0.9;
            this.vy *= 0.9;
        };
    };

    const pushBalls = (count = 1, x = origin.x, y = origin.y) => { for (let i = 0; i < count; i++) { balls.push(new Ball(x, y)); }; };

    const randBetween = (min, max) => { return Math.floor(Math.random() * max) + min; };

    const loop = () => {
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.r < 0) continue;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
            ctx.fill();
            b.update();
        };
        if (longPressed == true) {
            multiplier += 0.2;
        } else if (!longPressed && multiplier >= 0) {
            multiplier -= 0.4;
        }
        removeBall();
        requestAnimationFrame(loop);
    };

    const removeBall = () => {
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) { balls.splice(i, 1); }
        };
    };

    if (canvas.getContext && window.addEventListener) {
        ctx = canvas.getContext("2d");
        updateSize();
        window.addEventListener('resize', updateSize, false);
        loop();
        window.addEventListener("mousedown", (e) => {
            pushBalls(randBetween(10, 20), e.clientX, e.clientY);
            document.body.classList.add("is-pressed");
            longPress = setTimeout(() => {
                document.body.classList.add("is-longpress");
                longPressed = true;
            }, 500);
        }, false);
        window.addEventListener("mouseup", (e) => {
            clearInterval(longPress);
            if (longPressed == true) {
                document.body.classList.remove("is-longpress");
                pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e.clientX, e.clientY);
                longPressed = false;
            }
            document.body.classList.remove("is-pressed");
        }, false);
        window.addEventListener("mousemove", (e) => {
            let x = e.clientX;
            let y = e.clientY;
            pointer.style.top = y + "px";
            pointer.style.left = x + "px";
        }, false);
    } else {
        console.log("canvas or addEventListener is unsupported!");
    }
};


// 背景爱心特效
let animationID = null;
const animation = () => {
    let flow, c, $, w, h, msX, msY, midX, midY, num = 650, parts = [], begin = 50, repeat = 20, end = Math.PI * 2, force = null, msdn = false;

    const canvas = document.createElement("canvas");
    canvas.id = "backgroundEffects";
    document.body.appendChild(canvas);

    const start = () => {
        c = document.getElementById('backgroundEffects');
        $ = c.getContext('2d');
        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;
        midX = w / 2;
        midY = h / 2;
        force = Math.max(w, h) * 0.09;
        flow = begin;
        animationID = requestAnimationFrame(create);
        run();
    };

    const run = () => {
        animationID = requestAnimationFrame(run);
        go();
    };

    class Part {
        constructor() {
            this.deg = 0;
            this.rad = 0;
            this.x = 0;
            this.y = 0;
            this.distX = 0;
            this.distY = 0;
            this.color = `rgb(${Math.floor(Math.random() * 130)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100)})`;
            this.size;
        }
    }

    const create = () => {
        let n = num;
        while (n--) {
            let p = new Part();
            p.deg = Math.floor(Math.random() * 360);
            p.rad = Math.floor(Math.random() * w * 0.5);
            p.x = p.distX = Math.floor(Math.random() * w);
            p.y = p.distY = Math.floor(Math.random() * h);
            p.size = 1 + Math.floor(Math.random() * (p.rad * 0.055));
            parts[n] = p;
        }
        c.onmousemove = msmv;
        c.onmousedown = msdn;
        c.onmouseup = msup;

        let int = setInterval(() => {
            flow--;
            if (flow === repeat) clearInterval(int);
        }, 20);
    };

    const go = () => {
        $.globalCompositeOperation = 'source-over';
        $.fillStyle = 'hsla(242, 30%, 5%, .55)';
        $.fillRect(0, 0, w, h);
        $.globalCompositeOperation = 'lighter';
        let mx = msX;
        let my = msY;
        let bounds = force;
        if (msdn) { bounds = force * 2; };
        let n = num;
        while (n--) {
            let p = parts[n];
            let radi = (Math.PI / 180) * p.deg;
            p.distX = midX + p.rad * Math.cos(radi);
            p.distY = midY + p.rad * Math.sin(radi) * 0.4;
            if (mx && my) {
                let react = Math.floor(bounds * 0.5 + Math.random() * (bounds * 0.9));
                if (
                    p.distX - mx > 0 &&
                    p.distX - mx < bounds &&
                    p.distY - my > 0 &&
                    p.distY - my < bounds
                ) {
                    p.distX += react;
                    p.distY += react;
                } else if (
                    p.distX - mx > 0 &&
                    p.distX - mx < bounds &&
                    p.distY - my < 0 &&
                    p.distY - my > -bounds
                ) {
                    p.distX += react;
                    p.distY -= react;
                } else if (
                    p.distX - mx < 0 &&
                    p.distX - mx > -bounds &&
                    p.distY - my > 0 &&
                    p.distY - my < bounds
                ) {
                    p.distX -= react;
                    p.distY += react;
                } else if (
                    p.distX - mx < 0 &&
                    p.distX - mx > -bounds &&
                    p.distY - my < 0 &&
                    p.distY - my > -bounds
                ) {
                    p.distY -= react;
                    p.distY -= react;
                }
            }
            p.x += (p.distX - p.x) / flow;
            p.y += (p.distY - p.y) / flow;
            let x = p.x;
            let y = p.y;
            let s = p.size * (p.y * 1.5) / h;
            if (s < 0.1) {
                s = 0;
            }
            $.beginPath();
            $.fillStyle = p.color;
            $.arc(x, y, s, 0, end, true);
            $.fill();
            $.closePath();
            let vary;
            if (p.size < 2) {
                vary = 4;
            } else if (p.size < 3) {
                vary = 3;
            } else if (p.size < 4) {
                vary = 2;
            } else {
                vary = 1;
            }
            vary *= p.y / (h * 0.9);
            p.deg += vary;
            p.deg = p.deg % 360;
        }
    };

    const msmv = (e) => {
        let p = getPos(e.target);
        let sX = window.pageXOffset;
        let sY = window.pageYOffset;
        msX = e.clientX - p.x + sX;
        msY = e.clientY - p.y + sY;
    };

    msdn = (e) => { msdn = true; };

    const msup = (e) => { msdn = false; };

    const getPos = (el) => {
        let cosmo = {};
        cosmo.x = el.offsetLeft;
        cosmo.y = el.offsetTop;
        while (el.offsetParent) {
            el = el.offsetParent;
            cosmo.x += el.offsetLeft;
            cosmo.y += el.offsetTop;
        }
        return cosmo;
    };
    return start;
};

export const startAnimation = () => { return animationID = requestAnimationFrame(animation()); };
export const stopAnimation = () => { return cancelAnimationFrame(animationID) };

