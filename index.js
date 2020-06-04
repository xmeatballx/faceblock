const express = require("express");
const app = express();
app.use(express.static("public"));

const multer = require("multer");
const path = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public");
  },
  filename: function (req, file, cb) {
    cb(null, 'image.jpg');
  }
});

var upload = multer({ storage: storage });

app.post("/upload", upload.single("photo"), (req, res) => {
	if (req.file) res.sendFile(__dirname + '/public/uploaded.html')
});

var http = require('http').createServer(app);
var fs = require('fs');
const io = require('socket.io')(http);
io.on("connection", (socket) => {
	socket.on('image state', (state) => {
		if (state == true) fs.unlinkSync(__dirname + '/public/image.jpg')
	})
})
http.listen(process.env.PORT || 3000);
