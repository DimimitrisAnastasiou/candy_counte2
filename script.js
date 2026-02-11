const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countText = document.getElementById("count");

const MODEL_ID = "YOUR_MODEL_ID";   // example: coco/1
const API_KEY = "YOUR_API_KEY";

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
})
.catch(err => alert("Camera error: " + err));

// Create client
const client = new inferencejs.InferenceJS();
const modelWorkerId = "worker";

// Load model
client.loadModel(
    "https://detect.roboflow.com/" + MODEL_ID,
    API_KEY
).then(model => {

    setInterval(async () => {

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const predictions = await model.infer(canvas);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0);

        let count = 0;

        predictions.forEach(p => {
            if (p.confidence > 0.5) {
                count++;

                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    p.x - p.width/2,
                    p.y - p.height/2,
                    p.width,
                    p.height
                );
            }
        });

        countText.innerText = "Count: " + count;

    }, 1000);

});
