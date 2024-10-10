let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let timerInterval;
let elapsedTime = 0;
const recordings = []; // To keep track of recordings
const privateFolderFiles = []; // To keep track of private folder files
// DOM Elements
const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');
const playButton = document.getElementById('play');
const saveButton = document.getElementById('save');
const audioElement = document.getElementById('audio');
const recordingAnimation = document.getElementById('recording-animation');
const timerDisplay = document.getElementById('timer');

const listRecordingsModal = document.getElementById('list-recordings-modal');
const setReminderModal = document.getElementById('set-reminder-modal');
const privateFolderModal = document.getElementById('private-folder-modal');

const listRecordingsClose = document.getElementById('list-recordings-close');
const setReminderClose = document.getElementById('set-reminder-close');
const privateFolderClose = document.getElementById('private-folder-close');

const reminderForm = document.getElementById('reminder-form');
const recordingsList = document.getElementById('recordings-list');
const uploadForm = document.getElementById('upload-form');
const fileUpload = document.getElementById('file-upload');
const privateFolderList = document.getElementById('private-folder-list');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Event Listeners for Buttons
recordButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
playButton.addEventListener('click', playRecording);
saveButton.addEventListener('click', saveRecording);

document.getElementById('list-recordings').addEventListener('click', () => {
    listRecordingsModal.style.display = 'block';
});
document.getElementById('set-reminder').addEventListener('click', () => {
    setReminderModal.style.display = 'block';
});
document.getElementById('private-folder').addEventListener('click', () => {
    privateFolderModal.style.display = 'block';
});

listRecordingsClose.addEventListener('click', () => {
    listRecordingsModal.style.display = 'none';
});
setReminderClose.addEventListener('click', () => {
    setReminderModal.style.display = 'none';
});
privateFolderClose.addEventListener('click', () => {
    privateFolderModal.style.display = 'none';
});

reminderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const date = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    alert(`Reminder set for ${date} at ${time}`);
    setReminderModal.style.display = 'none';
});

uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const file = fileUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const audioUrl = reader.result;
            privateFolderFiles.push(audioUrl);
            updatePrivateFolderList();
            fileUpload.value = ''; // Clear the file input
        };
        reader.readAsDataURL(file);
    }
});
// Recording Functions
function startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioElement.src = audioUrl;
                playButton.disabled = false;
                saveButton.disabled = false;
                recordings.push(audioUrl); // Store the recording URL
                updateRecordingsList(); // Update the list of recordings
                recordingAnimation.style.display = 'none'; // Hide animation
                stopButton.disabled = true;
                recordButton.disabled = false;
                clearInterval(timerInterval);
                audioChunks = []; // Reset audio chunks
                elapsedTime = 0; // Reset timer
                timerDisplay.textContent = '00:00'; // Reset timer display
            };
            mediaRecorder.start();
            isRecording = true;
            recordingAnimation.style.display = 'block'; // Show animation
            timerInterval = setInterval(updateTimer, 1000);
            recordButton.disabled = true;
            stopButton.disabled = false;
            playButton.disabled = true;
            saveButton.disabled = true;
        }).catch(error => {
            console.error('Error accessing microphone:', error);
        });
    } else {
        alert('Media Devices not supported.');
    }
}

function stopRecording() {
    if (isRecording && mediaRecorder) {
        mediaRecorder.stop();
        isRecording = false;
    }
}

function playRecording() {
    if (audioElement.src) {
        audioElement.play();
    }
}

function saveRecording() {
    if (audioElement.src) {
        const link = document.createElement('a');
        link.href = audioElement.src;
        link.download = 'recording.wav';
        link.click();
    }
}

function updateTimer() {
    elapsedTime++;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateRecordingsList() {
    recordingsList.innerHTML = '';
    recordings.forEach((recording, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = recording;
        link.textContent = `Recording ${index + 1}`;
        link.download = `recording${index + 1}.wav`;
        listItem.appendChild(link);
        recordingsList.appendChild(listItem);
    });
}

function updatePrivateFolderList() {
    privateFolderList.innerHTML = '';
    privateFolderFiles.forEach((file, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = file;
        link.textContent = `Private File ${index + 1}`;
        link.download = `private-file${index + 1}.wav`;
        listItem.appendChild(link);
        privateFolderList.appendChild(listItem);
    });
}

// Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        themeToggle.checked = savedTheme === 'night';
    } else {
        body.classList.add('day'); // Default theme
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.remove('day');
            body.classList.add('night');
            localStorage.setItem('theme', 'night');
        } else {
            body.classList.remove('night');
            body.classList.add('day');
            localStorage.setItem('theme', 'day');
        }
    });
});

// Modal Handling
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const closeButtons = document.querySelectorAll('.close');
    const loginMessage = document.getElementById('login-message');

    // Show Login Modal
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
        loginModal.classList.add('active');
        // Show sliding message
        loginMessage.style.opacity = '1';
        loginMessage.style.transform = 'translateY(0)';
        // Hide message after some time
        setTimeout(() => {
            loginMessage.style.opacity = '0';
            loginMessage.style.transform = 'translateY(-100%)';
        }, 3000); // Message will hide after 3 seconds
    });

    // Show Register Modal
    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'block';
        registerModal.classList.add('active');
    });

    // Close Modals when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            loginModal.classList.remove('active');
            registerModal.classList.remove('active');
        });
    });

    // Close Modals when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            loginModal.classList.remove('active');
        } else if (event.target === registerModal) {
            registerModal.style.display = 'none';
            registerModal.classList.remove('active');
        }
    });
});
