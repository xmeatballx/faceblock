var imgjs;
var imghtml;
var detections;
var submit;
var slider;
var boxPos;
var boxDim;
var boxes = [];
var uploaded;
var interval = 1000

function setup() {
	createCanvas(0, 0);
	boxDim = createVector(0, 0);
	boxPos = createVector(0, 0);
	imgjs = loadImage("crowd2.jpg");
	imghtml = document.getElementById("img");
	submit = document.getElementById("submit");
	submit.addEventListener("click", assignSrc);
	uploaded = true;
	detect();
}

function assignSrc() {
	background(255);
	imghtml.src = "image.jpg";
	imgjs = loadImage("image.jpg", () => {
		uploaded = true;
		detect();
	});
}

function draw() {
	if (boxes.length == 0) interval=1000;
	else interval=0;
	//background(255);
	resizeCanvas(imgjs.width, imgjs.height);
	image(imgjs, 0, 0);
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].display();
		console.log(uploaded);
	}
}

Promise.all([faceapi.nets.ssdMobilenetv1.loadFromUri("/models")]).then(detect);

function detect() {
	setInterval(async () => {
		detections = await faceapi.detectAllFaces(
			document.getElementById("img"),
			new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 })
		);
		if (uploaded == false && imgjs) {
			for (var i = 0; i < detections.length; i++) {
				boxPos.x = detections[i].box.x;
				boxPos.y = detections[i].box.y;
				boxDim.x = detections[i].box.width;
				boxDim.y = detections[i].box.height;
				boxes[i] = new Box(boxPos.x, boxPos.y, boxDim.x, boxDim.y);
			}
		} else {
			uploaded = false;
			boxes.length = 0;
		}
		//drawBox(boxPos.x, boxPos.y, boxDim.x, boxDim.y)
		// console.log(boxes.length)
	}, interval);
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
