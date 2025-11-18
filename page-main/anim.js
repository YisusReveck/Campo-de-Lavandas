const glitchChars = ['#', '@', '$', '%', '&', '*', '0', '1', '{', '}', '[', ']', '/', '\\', '|', '~', '^', '?', '!', '<', '>'];

function initGlitchText() {
    const textElement = document.getElementById('glitchText');
    const originalText = textElement.textContent.trim();

    // Dividir en palabras, y cada palabra en caracteres
    const words = originalText.split(' ');
    textElement.innerHTML = words.map((word, wordIndex) => {
        const chars = word.split('').map((char, charIndex) => {
            return `<span class="char" data-original="${char}">${char}</span>`;
        }).join('');
        return `<span class="word">${chars}</span>`;
    }).join(' ');

    const chars = textElement.querySelectorAll('.char');

    function randomGlitch() {
        // Seleccionar aleatoriamente entre 1 y 3 caracteres para hacer glitch
        const numGlitches = Math.floor(Math.random() * 3) + 1;
        const availableIndices = Array.from(chars).map((_, i) => i);

        for (let i = 0; i < numGlitches && availableIndices.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const charIndex = availableIndices[randomIndex];
            availableIndices.splice(randomIndex, 1);

            const char = chars[charIndex];
            const originalChar = char.dataset.original;

            // Cambiar a símbolo glitch
            const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            char.textContent = glitchChar;
            char.classList.add('glitch');

            // Restaurar después de 100-300ms
            const duration = Math.random() * 200 + 100;
            setTimeout(() => {
                char.textContent = originalChar;
                char.classList.remove('glitch');
            }, duration);
        }

        // Próximo glitch entre 500ms y 2000ms
        const nextGlitch = Math.random() * 1500 + 500;
        setTimeout(randomGlitch, nextGlitch);
    }

    // Iniciar el efecto glitch
    setTimeout(randomGlitch, 1000);
}

// Iniciar cuando cargue la página
window.addEventListener('load', initGlitchText);