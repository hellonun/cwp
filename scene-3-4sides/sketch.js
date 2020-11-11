// arms, shuffle, squad, talking

let vid;

let vs = []; // source image vectors
let imageOrigins = []; // image origin vectors
let rotateOrigins = []; // rotation origin vectors

let w = 320;
let h = 240;

let chosenOne = 0;
let chosenOnes = [];

function setup() {
  vid = createVideo('shuffle.mp4');
  vid.loop();
  vid.hide();
  createCanvas(800, 800);

  // source image
  v1 = createVector(0, 0);
  v2 = createVector(w, 0);
  v3 = createVector(w, h);
  v4 = createVector(0, h);22
  vs.push(v1, v2, v3, v4);
  chosenOnes.push(v1, v2, v3, v4);

  // image origin
  i1 = createVector(h, 0);
  i2 = createVector(width, h);
  i3 = createVector(width - h, height);
  i4 = createVector(0, height - h);
  imageOrigins.push(i1, i2, i3, i4);

  // rotation origin
  r1 = createVector(width / 2, 0.15 * height);
  r2 = createVector(width - (0.15 * width), height / 2);
  r3 = createVector(width / 2, height - (0.15 * width));
  r4 = createVector(0.15 * width, height / 2);
  rotateOrigins.push(r1, r2, r3, r4);

  angleMode(DEGREES);
}

function draw() {
  background(0);
  for (i = 0; i < imageOrigins.length; i++) {
    push();
    translate(rotateOrigins[i].x, rotateOrigins[i].y)
    rotate(90 * i);
    rect(0, 0, 10, 10);
    image(vid, -w / 2, -h / 2, w, h, vs[i].x, vs[i].y, w, h);
    pop();
  }

}


function keyPressed() {
  // rotate anti clockwise
  if (key == 1) {
    vs.push(vs[0]);
    vs.splice(0, 1);
  }

  // rotate clockwise
  if (key == 2) {
    vs.splice(0, 0, vs[vs.length - 1]);
    vs.splice(vs.length - 1, 1);
  }

  // show only 1 person
  if (key == 3) {
    vs = [];
    chosenOne++;
    if (chosenOne >= 4) {
      chosenOne = 0;
    }
    for (i = 0; i < 4; i++) {
      vs.push(chosenOnes[chosenOne]);
    }
  }

  // show 4 people
  if (key == 4) {
    vs = chosenOnes;
  }
}