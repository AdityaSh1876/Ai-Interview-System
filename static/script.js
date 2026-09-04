const video = document.getElementById("video");

if (video) {
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: false,
        })
        .then(function (stream) {
            video.srcObject = stream;

            document.getElementById("camera-status").innerText = "Camera is ON";
        })
        .catch(function (error) {
            document.getElementById("camera-status").innerText =
                "Camera permission denied";

            console.log(error);
        });
}

function startVoice() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.");

        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.continuous = false;

    recognition.onstart = function () {
        console.log("Listening...");
    };

    recognition.onresult = function (event) {
        const text = event.results[0][0].transcript;

        document.getElementById("answer").value += text + " ";
    };

    recognition.onerror = function (event) {
        console.log("Speech error:", event.error);
    };

    recognition.start();
}

let timeLeft = 60;

const timer = document.getElementById("timer");

if (timer) {
    timer.innerText = timeLeft;

    const countdown = setInterval(function () {
        timeLeft--;

        timer.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);

            const form = document.querySelector("form");

            if (form) {
                form.submit();
            }
        }
    }, 1000);
}
