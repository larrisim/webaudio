class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.growthRate = 1; // Pixels per frame
    }

    update() {
        this.radius += this.growthRate;
    }

    display() {
        stroke(100);
        noFill();
        ellipse(this.x, this.y, this.radius * 2);
    }
}

// class Circle{
//     constructor(cx, cy, angle){
//         this.cx = cx;
//         this.cy = cy;
//         this.angle = angle;

//     }    

//     display(){
//         push();
//         translate(this.cx, this.cy);
//         noFill();
//         // ellipse(0,0, r*2, r*2);
//         let c = map(abs(this.angle % TWO_PI), 0, TWO_PI, 0, 255);
//         noStroke();
//         fill(c);

//         let x = r *cos(this.angle);
//         let y = r *sin(this.angle);
//         // fill(0);
    
//         // ellipse(x, y, 5, 5);
//         arc(x , y, size, size, this.angle, this.angle + PI/2);
//         pop();
//     }

//     move(speed){
//         this.angle -= speed;
//     }

// }