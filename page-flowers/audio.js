const audio = document.getElementById("song");
const btn = document.getElementById("audioBtn");
const iconPlay = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");

// Cambia el texto del botón según el estado
function updateButton() {
    if (audio.paused) {
        iconPlay.style.display = "block";
        iconPause.style.display = "none";
    } else {
        iconPlay.style.display = "none";
        iconPause.style.display = "block";
    }
}

// Evento del botón
btn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updateButton();
});

// Si el autoplay falla (muy común por políticas del navegador)
audio.addEventListener("play", updateButton);
audio.addEventListener("pause", updateButton);

// Inicialización (por si ya está reproduciendo)
updateButton();