const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const zoom = document.getElementById("zoom");
const rotate = document.getElementById("rotate");
const download = document.getElementById("download");
const editorContainer = document.getElementById("editor-container");
const uploadButton = document.querySelector(".upload-button");

const defaultEditorContainerSize = 500;
const defaultCanvasSize = 2000;

let editorContainerSize = defaultEditorContainerSize;
let canvasSize = defaultCanvasSize;

let img = new Image();
let frame = new Image();
let drag = false;
let offsetX = 0,
  offsetY = 0,
  imgX = 0,
  imgY = 0;
let imageLoaded = false;
ctx.imageSmoothingEnabled = false;
frame.src = "/images/frame_1_1.png";

const handleScreenSize = () => {
  editorContainer.style.width = `${editorContainerSize}px`;
  editorContainer.style.height = `${editorContainerSize}px`;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.style.transform = `scale(${editorContainerSize / canvasSize})`;
  frameLoaded = true;
  drawImage();
};

frame.onload = () => {
  handleScreenSize();
};

upload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

img.onload = () => {
  imageLoaded = true;
  //   uploadButton.style.top = "100px";
  //   uploadButton.style.left = "10px"; // Keep at top-left
  //   uploadButton.style.transform = "none";
  uploadButton.style.background = "rgba(11, 204, 27, 0.7)";
  uploadButton.querySelector("h6").innerHTML = "Change Image";
  download.style.display = "block";
  imgX = 0;
  imgY = 0;
  zoom.value = 1;
  rotate.value = 0;
  drawImage();
};

function drawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2 + imgX, canvas.height / 2 + imgY);
  ctx.rotate((rotate.value * Math.PI) / 180);

  const scale = zoom.value;
  let scaledWidth = img.width * scale;
  let scaledHeight = img.height * scale;

  ctx.drawImage(
    img,
    -scaledWidth / 2,
    -scaledHeight / 2,
    scaledWidth,
    scaledHeight
  );
  ctx.restore();
  ctx.drawImage(frame, 0, 0, canvasSize, canvasSize);
}

[zoom, rotate].forEach((control) => {
  control.addEventListener("input", drawImage);
});

editorContainer.addEventListener("mousedown", startDrag);
editorContainer.addEventListener("touchstart", startDrag, {
  passive: false,
});

document.addEventListener("mousemove", dragImage);
document.addEventListener("touchmove", dragImage, { passive: false });

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

function startDrag(e) {
  e.preventDefault(); // Prevents scrolling on mobile while dragging
  drag = true;

  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let clientY = e.touches ? e.touches[0].clientY : e.clientY;

  offsetX = clientX - imgX;
  offsetY = clientY - imgY;
  editorContainer.style.cursor = "grabbing";
}

function dragImage(e) {
  if (!drag) return;
  e.preventDefault();

  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let clientY = e.touches ? e.touches[0].clientY : e.clientY;

  imgX = clientX - offsetX;
  imgY = clientY - offsetY;
  drawImage();
}

function stopDrag() {
  drag = false;
  editorContainer.style.cursor = "grab";
}

download.addEventListener("click", () => {
  if (!imageLoaded) {
    alert("Please upload an image before downloading!");
    return;
  }

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "RRLS-FRAME.jpeg";
    link.click();
  });
  // const dataUrl = canvas.to("image/jpeg", 1.0);
  // console.log({ dataUrl });
});

const handleResize = () => {
  const x = window.matchMedia("(max-width: 500px)");
  if (x.matches) {
    editorContainerSize = 350;
    handleScreenSize();
  } else {
    editorContainerSize = defaultEditorContainerSize;
    handleScreenSize();
  }
};
handleResize();
window.addEventListener("resize", handleResize);
