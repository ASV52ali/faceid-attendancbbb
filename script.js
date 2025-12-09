const video = document.getElementById("camera");
const btn = document.getElementById("captureBtn");
const status = document.getElementById("status");
const nameInput = document.getElementById("nameInput");

// --- لینک Web App Google Sheet ---
const GOOGLE_WEBHOOK = "https://script.google.com/macros/s/AKfycbxF8ZjC9WHtn5EvExGidW5SwPptu0naEZJCDtINem1VOnn7cnB3DSTfLWxSn10NbaIt/exec";

// فعال کردن وبکم
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => video.srcObject = stream)
.catch(err => status.innerText = "دوربین فعال نشد");

// ثبت حضور
btn.onclick = () => {
    const name = nameInput.value.trim() || "ناشناس";
    status.innerText = "در حال ثبت حضور...";

    // گرفتن عکس
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoUrl = canvas.toDataURL("image/png"); // Base64

    // ارسال به Google Sheet
    fetch(GOOGLE_WEBHOOK, {
        method: "POST",
        body: JSON.stringify({
            timestamp: new Date().toLocaleString("fa-IR"),
            name: name,
            photoUrl: photoUrl
        })
    })
    .then(res => {
        if (res.ok) status.innerText = "✔ حضور ثبت شد";
        else status.innerText = "❌ خطا در ثبت حضور";
    })
    .catch(err => {
        console.error(err);
        status.innerText = "❌ خطا در ارسال";
    });
};
