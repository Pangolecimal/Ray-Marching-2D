let numBoxes = 3,
    numCircles = 3;

let boxes = [numBoxes],
    circles = [numCircles];

let points = [];
let minDst = 0.001,
    maxDst = 1000,
    iterations = 100;

let showObjects,
    showContour;

let maxRayDst;

function setup() {
    createCanvas(800, 800);
    rectMode(RADIUS);

    showObjects = createCheckbox().size(100, 25).checked(true);
    showContour = createCheckbox().size(100, 25).checked(true);
    maxRayDst = createSlider(0, width/2, 200, 0.1);

    let maxRad = min(width, height) * (0.5 / (numBoxes + numCircles));
    for (let i = 0; i < numBoxes; i++) {
        boxes[i] = new Box(
            random(maxRad, width - maxRad),
            random(maxRad, height - maxRad),
            random(maxRad / 2, maxRad), random(maxRad / 2, maxRad));
    }
    for (let i = 0; i < numCircles; i++) {
        circles[i] = new Circle(
            random(maxRad, width - maxRad),
            random(maxRad, height - maxRad),
            random(maxRad / 2, maxRad));
    }
}

function draw() {
    background(0);

    let mouse;
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        mouse = createVector(mouseX, mouseY);
    } else {
        mouse = createVector(width / 2, height / 2);
    }

    for (let a = 0; a < 360; a += 0.1) {
        let totalDst = 0;
        let point = createVector(mouse.x, mouse.y);
        let dst = dstToScene(point);
        dst = dst < 0 ? 0 : dst;
        let dir = createVector(cos(radians(a)), sin(radians(a)));
        let i = 0;
        while (dst > minDst && dst < maxDst && i < iterations) {
            totalDst += dst;
            point.add(dir.x * dst, dir.y * dst);
            dst = dstToScene(point);
            i++;
        }
        if (dst <= minDst) {
            points.push(new Point(point.x, point.y, totalDst));
        }
    }

    if (showContour.checked()) {
        beginShape();
        fill(51, 51);
        stroke(204, 51);
        strokeWeight(1);
        for (let i = 0; i < points.length; i++) {
            let dir = p5.Vector.sub(points[i].center, mouse);
            dir.limit(maxRayDst.value());
            vertex(dir.x + mouse.x, dir.y + mouse.y);
        }
        endShape(CLOSE);
    } else {
        stroke(153, 51);
        for (let i = 0; i < points.length; i++) {
            points[i].show();
        }
    }

    points = [];
    if (showObjects.checked()) {
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].show();
        }
        for (let i = 0; i < circles.length; i++) {
            circles[i].show();
        }
    }
}

function dstToScene(point) {
    let sceneDst = width * 2;

    for (let i = 0; i < circles.length; i++) {
        let circleDst = dstToCircle(point, circles[i]);
        sceneDst = min(abs(sceneDst), abs(circleDst));
    }

    for (let i = 0; i < boxes.length; i++) {
        let boxDst = dstToBox(point, boxes[i]);
        sceneDst = min(abs(sceneDst), abs(boxDst));
    }

    let edgeDst = dstToEdges(point);
    sceneDst = min(abs(sceneDst), abs(edgeDst));

    return sceneDst;
}

function dstToCircle(point, c) {
    return sqrt(sq(point.x - c.center.x) + sq(point.y - c.center.y)) - c.radius;
}

function dstToBox(p, b) {
    let dx = max((b.center.x - b.dim.x) - p.x, 0, p.x - (b.center.x + b.dim.x));
    let dy = max((b.center.y - b.dim.y) - p.y, 0, p.y - (b.center.y + b.dim.y));
    let distance = sqrt(dx * dx + dy * dy);
    if (distance == 0) {
        distance = -min(
            min(p.x - (b.center.x - b.dim.x), (b.center.x + b.dim.x) - p.x),
            min(p.y - (b.center.y - b.dim.y), (b.center.y + b.dim.y) - p.y));
    }
    return distance;
}

function dstToEdges(p) {
    let xDst = min(p.x, width - p.x);
    let yDst = min(p.y, height - p.y);
    return min(xDst, yDst);
}
