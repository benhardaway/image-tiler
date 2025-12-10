let img = document.getElementById("original");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let uploadedImage = null;

// IMPORTANT: Turn off smoothing (removes seams)
ctx.imageSmoothingEnabled = false;

document.getElementById("fileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    img.onload = () => {
        uploadedImage = file;
    };
    img.src = url;
});

document.getElementById("tileBtn").addEventListener("click", () => {
    if (!img.complete || img.naturalWidth === 0)
        return alert("Upload an image first!");

    // Use *natural* size (guaranteed integers)
    const W = img.naturalWidth;
    const H = img.naturalHeight;

    const qW = Math.floor(W / 2);
    const qH = Math.floor(H / 2);

    canvas.width = qW * 3;
    canvas.height = qH * 3;

    ctx.imageSmoothingEnabled = false;  // keep smoothing OFF after resize

    const Q1 = { sx: 0, sy: 0, sw: qW, sh: qH };
    const Q2 = { sx: qW, sy: 0, sw: qW, sh: qH };
    const Q3 = { sx: 0, sy: qH, sw: qW, sh: qH };
    const Q4 = { sx: qW, sy: qH, sw: qW, sh: qH };

    function draw(q, tx, ty) {
        ctx.drawImage(
            img,
            q.sx, q.sy, q.sw, q.sh,
            tx * qW, ty * qH, qW, qH
        );
    }

    // draw pattern
    draw(Q1, 0, 0);
    draw(Q2, 1, 0);

    draw(Q3, 0, 1);
    draw(Q4, 1, 1);
    draw(Q3, 2, 1)

    draw(Q2, 1, 2);
    draw(Q1, 2, 2);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "tiled.png";
    link.href = canvas.toDataURL();
    link.click();
});