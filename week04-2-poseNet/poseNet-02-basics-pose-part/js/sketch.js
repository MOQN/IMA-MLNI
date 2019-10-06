console.log('ml5 version:', ml5.version);

let cam;
let poseNet;
let poses = [];

function setup() {
  createCanvas( 640, 480 );
  background(0);
  // webcam
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  //poseNet
  poseNet = ml5.poseNet(cam, modelReady);
  poseNet.on( 'pose', function(results){
    poses = results;
  } );
}

function draw() {
  image( cam, 0, 0 ); // ( video, x, y, (w), (h) )

  noStroke();
  for (let i = 0; i < poses.length; i++) {
    console.log(poses[i].pose.nose);
    let point = poses[i].pose.nose; // try other points, e.g. pose.leftEye, ...
    fill(255, 0, 0);
    ellipse(point.x, point.y, 5, 5);
  }

  fill(0, 255, 0);
  text('Open the Console window and check the object.', 10, 20);
}

function modelReady() {
  console.log("Model Loaded!");
}
