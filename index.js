const express = require("express");
const app = express();
app.use(express.static("public"));
app.listen(process.env.PORT || 3000);

const multer = require("multer");
const path = require("path");
var storage = multer.diskStorage({
	destination: function (req, file, cd) {
		cd(null, "public");
	},
	filename: function (req, file, cb) {
		cb(null, "image.jpg");
	},
});

var upload = multer({ storage: storage });

app.post("/upload", upload.single("photo"), (req, res, err) => {
	console.log(err);
});