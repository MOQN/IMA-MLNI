// Oct 13 2019
// MOQN

/*
This is based on the example code of ml5.js
https://ml5js.org/
*/
console.log('ml5 version:', ml5.version);


let bodypix;
let segmentation;

let cam;
let img;


const options = {
  outputStride: 8, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.3, // 0 - 1, defaults to 0.5
}

// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
// take a look at the index of body parts

/*
PartId  PartName
-1      (no body part)
0       leftFace
1       rightFace
2       rightUpperLegFront
3       rightLowerLegBack
4       rightUpperLegBack
5       leftLowerLegFront
6       leftUpperLegFront
7       leftUpperLegBack
8       leftLowerLegBack
9       rightFeet
10      rightLowerLegFront
11      leftFeet
12      torsoFront
13      torsoBack
14      rightUpperArmFront
15      rightUpperArmBack
16      rightLowerArmBack
17      leftLowerArmFront
18      leftUpperArmFront
19      leftUpperArmBack
20      leftLowerArmBack
21      rightHand
22      rightLowerArmFront
23      leftHand
*/


function setup() {
  createCanvas(640, 480);

  cam = createCapture(cam);
  cam.size(width, height);
  // cam.hide();

  img = createImage(width, height);

  bodypix = ml5.bodyPix(cam, modelReady);
}


function draw() {
  background(255);

  if (segmentation !== undefined) {
    let w = segmentation.raw.width;
    let h = segmentation.raw.height;
    let data = segmentation.raw.data;

    img.loadPixels();
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let index = x + y*w; // ***

        if ( data[index] >= 0 ) {
          img.pixels[index*4 + 0] = 255;
          img.pixels[index*4 + 1] = 0;
          img.pixels[index*4 + 2] = 0;
          img.pixels[index*4 + 3] = 255;
        } else {
          // transparent
          img.pixels[index*4 + 0] = 0;
          img.pixels[index*4 + 1] = 0;
          img.pixels[index*4 + 2] = 0;
          img.pixels[index*4 + 3] = 0;
        }
      }
    }
    img.updatePixels();
  }
  image( cam, 0, 0 );
  image( img, 0, 0 );
}



///// bodypix functions /////

function modelReady() {
  console.log('Model Ready!');
  bodypix.segmentWithParts(gotResults, options);
}


function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  segmentation = result;

  //image(segmentation.image, 0, 0, width, height);
  //console.log( segmentation.raw.data.length ); 320 * 240 - 1

  bodypix.segmentWithParts(gotResults, options);
}
