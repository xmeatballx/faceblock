var imgjs;
var imghtml;
var detections;
var submit;
var slider;
var boxPos;
var boxDim;
var boxes = [];

function setup() {
	createCanvas(0, 0);
	boxDim = createVector(0, 0);
	boxPos = createVector(0, 0);
	imgjs = loadImage("image.jpg", () => {
		boxes.length = 0;
		awaitDetection = setInterval(detect, 1000);

	});
	imghtml = document.getElementById("img");
}

function draw() {
	resizeCanvas(imgjs.width, imgjs.height);
	image(imgjs, 0, 0);
	if (boxes.length > 0) clearInterval(awaitDetection);
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].display();
	}
}

Promise.all([faceapi.nets.ssdMobilenetv1.loadFromUri("/models")]).then(detect);

var awaitDetection = setInterval(detect, 1000);

async function detect() {
	detections = await faceapi.detectAllFaces(
		document.getElementById("img"),
		new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 })
	);
	if (imgjs) {
		for (var i = 0; i < detections.length; i++) {
			boxPos.x = detections[i].box.x;
			boxPos.y = detections[i].box.y;
			boxDim.x = detections[i].box.width;
			boxDim.y = detections[i].box.height;
			boxes[i] = new Box(boxPos.x, boxPos.y, boxDim.x, boxDim.y);
			console.log(boxes[i].x)
		}
	}
}


class Box {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	display() {
		fill(0);
		rect(this.x, this.y, this.w, this.h);
	}
}
