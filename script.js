const video = document.getElementById('video');
const canvas = document.querySelector('.face');
const context = canvas.getContext('2d');

async function startWebcam() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    video.srcObject = stream;
    await video.play();

    requestAnimationFrame(detectFaces);
  }
}

async function detectFaces() {
  const faces = await window.faceapi.detectAllFaces(video).withFaceLandmarks().withFaceExpressions();

  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];

    context.drawImage(
      video,
      face.detection.box._x,
      face.detection.box._y,
      face.detection.box._width,
      face.detection.box._height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }