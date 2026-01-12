```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Canvas 벚꽃 잎 (원근감 + 모바일)</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background: linear-gradient(to bottom, #fff5f8, #ffe0e9);
        }
        canvas {
            display: block;
        }
    </style>
</head>
<body>

<canvas id="cherryBlossomCanvas"></canvas>

<script>
    const canvas = document.getElementById('cherryBlossomCanvas');
    const ctx = canvas.getContext('2d');

    let DPR = window.devicePixelRatio || 1;

    function resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width * DPR;
        canvas.height = height * DPR;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resizeCanvas();

    const petals = [];
    let petalCount = Math.floor((window.innerWidth * window.innerHeight) / 12000);

    class Petal {
        constructor(initial = false) {
            this.reset(initial);
        }

        reset(initial = false) {
            this.depth = Math.random(); // 0 (뒤) ~ 1 (앞)

            this.baseSize = Math.random() * 6 + 6;
            this.size = this.baseSize * (0.5 + this.depth);

            this.x = Math.random() * window.innerWidth;
            this.y = initial
                    ? Math.random() * window.innerHeight * 0.7
                    : -30;

            this.speedY = (Math.random() * 0.8 + 0.4) * (0.5 + this.depth);
            this.speedX = (Math.random() * 0.6 - 0.3) * (0.5 + this.depth);

            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() * 0.02 - 0.01) * (0.5 + this.depth);

            this.swing = Math.random() * 1.5 + 0.5;
            this.swingStep = Math.random() * Math.PI * 2;

            this.opacity = 0.4 + this.depth * 0.6;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.size / 10, this.size / 10);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-5, -6, -12, -2, 0, 10);
            ctx.bezierCurveTo(12, -2, 5, -6, 0, 0);

            const gradient = ctx.createRadialGradient(0, 2, 0, 0, 2, 12);
            gradient.addColorStop(0, `rgba(255,230,235,${this.opacity})`);
            gradient.addColorStop(1, `rgba(255,170,190,${this.opacity * 0.9})`);

            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.restore();
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.swingStep) * 0.4;
            this.rotation += this.rotationSpeed;
            this.swingStep += 0.03;

            if (this.y > window.innerHeight + 40) {
                this.reset();
            }

            if (this.x > window.innerWidth + 40) this.x = -40;
            if (this.x < -40) this.x = window.innerWidth + 40;
        }
    }

    function init() {
        petals.length = 0;
        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal(true));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        DPR = window.devicePixelRatio || 1;
        resizeCanvas();
        petalCount = Math.floor((window.innerWidth * window.innerHeight) / 12000);
        init();
    });

    init();
    animate();
</script>

</body>
</html>
```