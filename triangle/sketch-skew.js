const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const risoColors = require("riso-colors");
const Color = require("canvas-sketch-util/color");

const settings = {
    dimensions: [1080, 1080],
    // animate: true,
};

const sketch = ({ context, width, height }) => {
    let x, y, w, h;
    let fill, stroke, blend;
    let rectangles = [];
    let colors = [random.pick(risoColors).hex, random.pick(risoColors).hex];
    const bgColor = random.pick(risoColors).hex;

    for (let i = 0; i < 80; i++) {
        x = width * Math.random();
        y = height * Math.random();
        w = Math.random() * 400 + 200;
        h = Math.random() * 200 + 40;
        fill = random.pick(colors);
        stroke = random.pick(colors);
        blend = Math.random() > 0.5 ? "overlay" : "source-over";
        rectangles.push({ x, y, w, h, fill, fill, stroke, blend });
    }
    let a = 50;
    return () => {
        // context.fillStyle = bgColor;
        context.fillStyle = "transparent";
        context.fillRect(0, 0, width, height);

        // context.rect(100, 400, 500, 500);
        // context.lineWidth = 20;
        context.save();
        context.translate(width * 0.5, height * 0.5);
        drawPolygon({ context, radius: 200, sides: 5 });
        context.lineWidth = 10;
        context.strokeStyle = "Black";
        context.stroke();
        context.restore();
        context.clip();

        rectangles.forEach((rect) => {
            const { x, y, w, h, fill, stroke, blend } = rect;
            context.save();
            context.translate(x, y);
            context.strokeStyle = stroke;
            context.fillStyle = fill;
            context.lineWidth = 10;
            context.globalCompositeOperation = blend;

            a = a + 0.01;
            drawSkewRect(a, context, w, h);

            const shadowColor = Color.offsetHSL(fill, 0, 0, -20);
            shadowColor.rgba[3] = 0.5;

            context.shadowColor = Color.style(shadowColor.rgba);
            context.shadowOffsetX = -10;
            context.shadowOffsetY = 20;

            context.fill();
            context.shadowColor = null;
            context.stroke();

            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.stroke();

            context.restore();
        });
        context.save();

        // context.strokeStyle = "black";
        // context.rect(100, 400, 500, 500);
        // context.lineWidth = 20;
        // context.stroke();
        // context.restore();
    };
};

const drawSkewRect = (deg, context, w, h) => {
    const angle = math.degToRad(deg);
    const rx = Math.cos(angle) * w;
    const ry = Math.sin(angle) * w;
    context.translate(rx * -0.5, (ry + h) * -0.5);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(rx, ry);
    context.lineTo(rx, ry + h);
    context.lineTo(0, h);
    context.closePath();

    return;
};

const drawPolygon = ({ context, radius, sides }) => {
    const slice = (Math.PI * 2) / sides;

    context.beginPath();
    context.moveTo(0, -radius);

    for (let i = 1; i < sides; i++) {
        let theta = i * slice - Math.PI * 0.5;
        context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
    }
    context.closePath();
};

canvasSketch(sketch, settings);
