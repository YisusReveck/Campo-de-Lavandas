const audio = document.getElementById("song");
const btn = document.getElementById("audioBtn");
const iconSoundOn = document.getElementById("iconSoundOn");
const iconSoundOff = document.getElementById("iconSoundOff");

// Cambia el texto del botón según el estado
function updateButton() {
    if (audio.paused) {
        iconSoundOn.style.display = "block";
        iconSoundOff.style.display = "none";
    } else {
        iconSoundOn.style.display = "none";
        iconSoundOff.style.display = "block";
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