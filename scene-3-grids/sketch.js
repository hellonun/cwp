// video names: arms, shuffle, squad, talking

let vid;
let w, h;
let v1, v2, v3, v4;
let vs = [];
let i = 0;
let num = 1;
let mod = 1;

function setup() {
  vid = createVideo('shuffle.mp4');
  vid.loop();
  vid.hide();
  createCanvas(640, 480);

  w = width / num;
  h = height / num;
  v1 = createVector(0, 0);
  v2 = createVector(width / 2, 0);
  v3 = createVector(0, height / 2);
  v4 = createVector(width / 2, height / 2);
  vs.push(v1, v2, v3, v4);
  // console.log(vs);
}

function draw() {
  background(0);


  for (y = 0; y < num; y++) {
    for (x = 0; x < num; x++) {
      if (i % mod == 0) {
        image(vid, x * w, y * h, w, h, vs[i].x, vs[i].y, vid.width / 2, vid.height / 2);
        
      }
      i++;
        console.log(mod);

      if (i >= vs.length) {
        i = 0;
      }
    }
  }
  i = 0;
}

function keyPressed() {
  // shuffle array
  if (key == '1') {
    vs = shuffle(vs);
  }

  // shuffle where to draw
  if (key == '2') {
    mod++;
    if (mod >=num) {
      mod = 1;
    }
  }
  // change number of rows and columns
  if (key == '3') {
    if (num > 1) {
      num--;
      w = width / num;
      h = height / num;
    }

  }
  if (key == '4') {
    num++;
    w = width / num;
    h = height / num;
  }
}