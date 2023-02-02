const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');

const uploadFile = file => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://example.com/upload');
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(file);
  });
};

const render = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const options = {};
  const faces = faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions(options)).map(face => {
    const { x, y, width, height } = face.boundingBox;
    context.clearRect(x, y, width, height);
    context.drawImage(video, x, y, width, height, x, y, width, height);
  });
  requestAnimationFrame(render);
};

navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
  video.srcObject = stream;
  requestAnimationFrame(render);
});

uploadButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) {
    return alert('Please select a file to upload.');
  }

  uploadFile(file)
    .then(response => {
