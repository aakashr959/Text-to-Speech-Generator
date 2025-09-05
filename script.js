let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");
let textarea = document.querySelector("textarea");
let button = document.querySelector("button");
let errorDiv = document.createElement("div");
errorDiv.className = "error";
document.querySelector(".hero").appendChild(errorDiv);

// Initialize loading spinner
let loadingSpinner = document.createElement("div");
loadingSpinner.className = "loading";
button.prepend(loadingSpinner);

// Initialize speech synthesis
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];
    
    voices.forEach((voice, i) => {
        const option = new Option(voice.name, i);
        if (voice.default) {
            option.selected = true;
            speech.voice = voice;
        }
        voiceSelect.options[i] = option;
    });
};

// Handle voice selection
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Handle speech synthesis
button.addEventListener("click", () => {
    const text = textarea.value.trim();
    
    if (!text) {
        showError("Please enter some text to convert to speech");
        return;
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        button.innerHTML = '<img src="play button.png">Listen';
        return;
    }

    speech.text = text;
    loadingSpinner.style.display = "inline-block";
    button.disabled = true;

    speech.onstart = () => {
        loadingSpinner.style.display = "none";
        button.disabled = false;
        button.innerHTML = '<img src="play button.png">Stop';
    };

    speech.onend = () => {
        button.innerHTML = '<img src="play button.png">Listen';
    };

    speech.onerror = () => {
        showError("An error occurred while converting text to speech");
        loadingSpinner.style.display = "none";
        button.disabled = false;
    };

    window.speechSynthesis.speak(speech);
});

// Handle text input validation
textarea.addEventListener("input", () => {
    if (textarea.value.trim()) {
        errorDiv.classList.remove("show");
    }
});

// Error handling function
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add("show");
    setTimeout(() => {
        errorDiv.classList.remove("show");
    }, 3000);
}
