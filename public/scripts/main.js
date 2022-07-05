import ClientChat from "./ClientChat.js";
new ClientChat();

document.querySelector("#audio img").addEventListener("click", () => {
    let audioControls = document.querySelector("#audio audio");
    let musicIcon = document.querySelector("#audio img");
    if (musicIcon.classList.contains("disabled")) {
        audioControls.play();
        musicIcon.classList.remove("disabled");
    } else {
        audioControls.pause();
        musicIcon.classList.add("disabled");
    }
});
