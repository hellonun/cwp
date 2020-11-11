
let outMessage = 'H';

let video;
let poseNet;
let poses;
let confidenceThreshold = 0.3;
let net;

let bodyImg;
let startImgIndex = 1;
let imgCount = 20;
let imgArray = [];
let imgJson = [];
let currentImgIndex;
let imgWidth = 640;
let imgHeight = 480;

let startPlaying = false;
let keypointsToRecord = [0, 1, 2, 5, 6, 7, 8, 9, 10] //nose, eyes, shoulders, elbows, wrists

function setup() {
  createCanvas(imgWidth, imgHeight);
  // video = createCapture(VIDEO);
  // video = createVideo('WUT_0181.mp4', vidLoad);
  // video.size(600, 338);
  text("loading YG...", 280, height / 2);

  for (let i = startImgIndex; i <= imgCount; i++) {
    let imgName;
    let vidName;
    if (i < 100) {
      imgName = 'paded/' + i + '.jpg';
      vidName = 'paded/' + i + '.mp4';
    } else if (i < 1000) {
      imgName = 'thumbs/' + i + '.jpg';
      vidName = 'thumbs/' + i + '.mp4';
    } else {
      imgName = 'thumbs/' + i + '.jpg';
      vidName = 'thumbs/' + i + '.mp4';
    }

    let img = createImg(imgName, imgLoad);
    img.size(imgWidth, imgHeight);
    img.hide();
    let imgRecord = {
      "name": imgName,
      "vidName": vidName,
      "img": img
    }
    imgArray.push(imgRecord);
    // console.log("loaded " + imgRecord.name);
  }

  console.log("done loading");

  pixelDensity(1);
  currentImgIndex = startImgIndex;
  loadPosenet();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function vidLoad() {
  video.loop();
  video.volume(0);
  video.size(imgWidth, imgHeight);
  video.hide();

  // loadPosenet();
}

function imgLoad() {
}

async function loadPosenet() {
  net = await posenet.load({
    architecture: 'ResNet50',
    outputStride: 16,
    // inputResolution: { width: 300, height: 300 },
    quantBytes: 4
  });

  // select('#status').html('Model Loaded');
  console.log("posenet loaded")
}

async function estimatePose(bodyImg) {
  // tfjs poseNet
  const pose = await net.estimateSinglePose(bodyImg.img.elt, {
    flipHorizontal: false
  });

  // console.log(pose)
  if (!pose) return;


  // let rightWrist = pose.keypoints[10];

  // bodyImg.x = floor(rightWrist.position.x);
  // bodyImg.y = floor(rightWrist.position.y);

  // console.log("estimated " + bodyImg.name);

  image(bodyImg.img, 0, 0);
  fill(255, 0, 0);


  // Log facial keypoints.
  bodyImg.keypoints = [];

  keypointsToRecord.forEach((ptNum) => {
    const kp = pose.keypoints[ptNum];
    // console.log(position);
    bodyImg.keypoints.push({
      pt: ptNum,
      x: kp.position.x,
      y: kp.position.y
    });
    
    // console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
    ellipse(kp.position.x, kp.position.y, 10);
  })




  console.log("estimated " + bodyImg.name);

}

async function estimateFace(faceImg) {
  // // tfjs poseNet
  // const pose = await net.estimateSinglePose(faceImg.img.elt, {
  //   flipHorizontal: false
  // });
  console.log(faceImg)
  const predictions = await net.estimateFaces({
    input: faceImg.img.elt,
    // flipHorizontal:
  });
  // poses = pose;
  // setTimeout(estimateFace, 25);
  // if (!poses) return;

  if (predictions.length > 0) {


    image(faceImg.img, 0, 0);
    fill(255, 0, 0);

    for (let i = 0; i < predictions.length; i++) {
      const keypoints = predictions[i].scaledMesh;

      // Log facial keypoints.
      faceImg.keypoints = [];

      keypointsToRecord.forEach((ptNum) => {
        const [x, y, z] = keypoints[ptNum];

        faceImg.keypoints.push({
          pt: ptNum,
          x: x,
          y: y
        });
        console.log(faceImg.keypoints);
        // console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
        ellipse(x, y, 10);
      })
      for (let i = 0; i < keypointsToRecord.length; i++) {

      }
    }


    console.log("estimated " + faceImg.name);
  }

}


function draw() {
  if (startPlaying) {
    // let xc = constrain(mouseX, 200)


    // imgArray.forEach(img => {
    //   if (dist(img.x, img.y, mouseX, mouseY) <= 5) {
    //     image(img.img, 0, 0, 600, 338);
    //     console.log(mouseX, mouseY);
    //     return;
    //   } else {

    //   }
    // })

    let minImg = imgArray[0];
    let minDist = dist(minImg.x, minImg.y, mouseX, mouseY);
    imgArray.forEach(img => {
      let currentDist = dist(img.x, img.y, mouseX, mouseY);
      if (currentDist < minDist) {
        minImg = img;
        minDist = currentDist;
      }
    })
    image(minImg.img, 0, 0, imgWidth, imgHeight);
    //     console.log(mouseX, mouseY);

  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  if (!poses) return;

  let pose = poses;
  let rightWrist = pose.keypoints[10];

  fill(255, 0, 0);
  ellipse(rightWrist.position.x, rightWrist.position.y, 50);
}

function replaceImgArray(imgs) {
  imgArray = [];
  let keys = Object.keys(imgs);
  keys.forEach(k => {
    let newImgName = imgs[k].name;

    let newImg = createImg(newImgName, imgLoad);
    newImg.size(imgWidth, imgHeight);
    newImg.hide();
    imgs[k].img = newImg;

    imgArray.push(imgs[k]);
  })
  console.log("loaded json!");
  console.log(imgArray);
}

function keyPressed() {
  if (key == 'e') {
    console.log('start estimating')
    //------------start estiating post for each img
    imgArray.forEach(currentImg => {
      estimatePose(currentImg);
    })
  } else if (key == 'p') {
    console.log("start playing!");
    startPlaying = true;
  } else if (key == 's') {
    console.log("saving json!");
    let jsonArray = [];
    imgArray.forEach(img => {
      let obj = {};
      obj.name = img.name;
      obj.vidName = img.vidName;
      obj.keypoints = img.keypoints;
      // obj.x = img.x;
      // obj.y = img.y;
      jsonArray.push(obj);
    })
    saveJSON(jsonArray, 'body640x480.json');
  } else if (key == 'l') {
    loadJSON('face640x480.json', replaceImgArray);
  }
}


function mousePressed() {
  console.log(mouseX, mouseY);
}