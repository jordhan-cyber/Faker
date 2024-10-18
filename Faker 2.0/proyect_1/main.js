const imageMapping = {
    'a': '/img gestos/A.jpeg',
    'b': '/img gestos/B.jpeg',
    'c': '/img gestos/c.jpeg',
    'd': '/img gestos/D.jpeg',
    'e': '/img gestos/',
    'f': '/img gestos/E.jpeg',
    'g': '/img gestos/G.jpeg',
    'h': '/img gestos/H.jpeg',
    'i': '/img gestos/i.jpeg',
    'j': '/img gestos/',
    'k': '/img gestos/',
    'l': '/img gestos/L.jpeg',
    'm': '/img gestos/',
    'n': '/img gestos/N.jpeg',
    'o': '/img gestos/',
    'p': '/img gestos/P.jpeg',
    'q': '/img gestos/Q.jpeg',
    'r': '/img gestos/R.jpeg',
    's': '/img gestos/',
    't': '/img gestos/t.jpeg',
    'u': '/img gestos/',
    'v': '/img gestos/',
    'w': '/img gestos/',
    'x': '/img gestos/',
    'y': '/img gestos/',
    'z': '/img gestos/'
};

document.getElementById('generateButton').addEventListener('click', () => {
    generateImages();
});

document.getElementById('startRecognition').addEventListener('click', () => {
    startVoiceRecognition();
});

function generateImages() {
    const input = document.getElementById('wordInput').value.toLowerCase();
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = ''; // Limpiar imágenes previas

    for (let char of input) {
        if (imageMapping[char]) {
            const img = document.createElement('img');
            img.src = imageMapping[char];
            const div = document.createElement('div');
            div.classList.add('image');
            div.appendChild(img);
            imageContainer.appendChild(div);
        }
    }
}

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES';

    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript;
        document.getElementById('wordInput').value = spokenWord;
        generateImages();
    };

    recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
    };

    recognition.start();
}
