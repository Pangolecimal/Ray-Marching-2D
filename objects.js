class Point {
    constructor(dx, dy, ddst) {
        this.center = createVector(dx, dy);
        this.dst = ddst;
    }

    show() {
        stroke(map(this.dst, 0, maxRayDst.value(), 204, 0));
        strokeWeight(1);
        point(this.center.x, this.center.y);
    }
}

class Box {
    constructor(dx, dy, dw, dh) {
        this.center = createVector(dx, dy);
        this.dim = createVector(dw * 2, dh * 2);
    }

    show() {
        stroke(153, 51);
        strokeWeight(1);
        noFill();
        rect(this.center.x, this.center.y, this.dim.x, this.dim.y);
    }
}

class Circle {
    constructor(dx, dy, dr) {
        this.center = createVector(dx, dy);
        this.radius = dr;
    }

    show() {
        stroke(153, 51);
        strokeWeight(1);
        noFill();
        circle(this.center.x, this.center.y, this.radius * 2);
    }
}
