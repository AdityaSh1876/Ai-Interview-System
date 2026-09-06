const video = document.getElementById("video");

const cameraStatus =
    document.getElementById("camera-status");


if (video) {

    if (
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
    ) {

        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: false
            })

            .then(function(stream) {

                video.srcObject = stream;

                if (cameraStatus) {

                    cameraStatus.innerText =
                        "Camera is ON âœ…";

                }

            })

            .catch(function(error) {

                if (cameraStatus) {

                    cameraStatus.innerText =
                        "Camera permission denied âŒ";

                }

                console.log(
                    "Camera error:",
                    error
                );

            });

    }

}

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Speech recognition is not supported by this browser."
        );

        return;

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-US";


    recognition.interimResults =
        false;


    recognition.continuous =
        false;


    const button =
        document.getElementById(
            "voice-button"
        );


    recognition.onstart =
        function() {

            if (button) {

                button.innerText =
                    "ðŸŽ¤ Listening...";

            }

        };


    recognition.onresult =
        function(event) {

            const text =
                event
                    .results[0][0]
                    .transcript;


            const answer =
                document.getElementById(
                    "answer"
                );


            if (answer) {

                if (answer.value.trim() !== "") {

                    answer.value +=
                        " " + text;

                } else {

                    answer.value =
                        text;

                }

            }

        };


    recognition.onerror =
        function(event) {

            console.log(
                "Speech error:",
                event.error
            );

        };


    recognition.onend =
        function() {

            if (button) {

                button.innerText =
                    "ðŸŽ¤ Start Speaking";

            }

        };


    recognition.start();

}

let timeLeft = 60;

const timer =
    document.getElementById("timer");


if (timer) {

    timer.innerText =
        timeLeft;


    const countdown =
        setInterval(
            function() {

                timeLeft--;

                timer.innerText =
                    timeLeft;


                if (timeLeft <= 0) {

                    clearInterval(
                        countdown
                    );


                    const form =
                        document.getElementById(
                            "answer-form"
                        );


                    if (form) {

                        const answer =
                            document.getElementById(
                                "answer"
                            );


                        // Prevent empty answer
                        // from blocking submission.

                        if (
                            answer &&
                            answer.value.trim() === ""
                        ) {

                            answer.value =
                                "No answer provided.";

                        }


                        form.submit();

                    }

                }

            },
            1000
        );

}

/* =========================================================
   Additive UI enhancements below.
   Nothing above this line was changed â€” camera, speech
   recognition, and the 60-second timer logic are untouched.
   ========================================================= */

(function () {
    "use strict";

    // ---- Resume drag & drop + filename preview (index page) ----
    var dropzone = document.getElementById("upload-zone");
    var fileInput = document.getElementById("resume-input");
    var fileNameEl = document.getElementById("resume-filename");

    if (dropzone && fileInput && fileNameEl) {

        function showFileName() {
            if (fileInput.files && fileInput.files.length > 0) {
                fileNameEl.textContent = fileInput.files[0].name;
                dropzone.classList.add("has-file");
            } else {
                fileNameEl.textContent = "No file selected";
                dropzone.classList.remove("has-file");
            }
        }

        fileInput.addEventListener("change", showFileName);

        ["dragenter", "dragover"].forEach(function (evt) {
            dropzone.addEventListener(evt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add("dragging");
            });
        });

        ["dragleave", "drop"].forEach(function (evt) {
            dropzone.addEventListener(evt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove("dragging");
            });
        });

        dropzone.addEventListener("drop", function (e) {
            var files = e.dataTransfer.files;
            if (files && files.length > 0) {
                fileInput.files = files;
                showFileName();
            }
        });

        showFileName();
    }

    // ---- Live camera indicator (interview page) ----
    var cameraStatusEl = document.getElementById("camera-status");
    var cameraCardEl = document.getElementById("camera-card");

    if (cameraStatusEl && cameraCardEl && window.MutationObserver) {

        var applyCameraState = function () {
            var text = cameraStatusEl.textContent || "";
            cameraCardEl.classList.remove("camera-live", "camera-off");

            if (text.indexOf("ON") !== -1) {
                cameraCardEl.classList.add("camera-live");
            } else if (text.indexOf("denied") !== -1 || text.indexOf("Starting") !== -1) {
                cameraCardEl.classList.add("camera-off");
            }
        };

        var cameraObserver = new MutationObserver(applyCameraState);
        cameraObserver.observe(cameraStatusEl, {
            childList: true,
            characterData: true,
            subtree: true
        });
        applyCameraState();
    }

    // ---- Low-time visual warning on the timer pill (interview page) ----
    var timerTextEl = document.getElementById("timer");
    var timerBoxEl = document.getElementById("timer-box");

    if (timerTextEl && timerBoxEl && window.MutationObserver) {

        var checkTimerLow = function () {
            var value = parseInt(timerTextEl.textContent, 10);
            if (!isNaN(value) && value <= 10) {
                timerBoxEl.classList.add("timer-low");
            } else {
                timerBoxEl.classList.remove("timer-low");
            }
        };

        var timerObserver = new MutationObserver(checkTimerLow);
        timerObserver.observe(timerTextEl, {
            childList: true,
            characterData: true,
            subtree: true
        });
        checkTimerLow();
    }
})();
