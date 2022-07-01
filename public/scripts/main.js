/* let sock = new io.connect(document.location.host);
document.querySelector("#login").addEventListener("click", (e) => {
    if (document.querySelector("#username").value != "") {
        sock.emit(
            "client:send:username",
            document.querySelector("#username").value
        );
    } else {
        alert("Please fill a username");
    }
});
sock.on("server:user:username_exists", (message) => alert(message));
sock.on("server:user:connect", () => {
    document.querySelector(".welcome-panel").classList.add("disabled");
    document.querySelector(".chat-box").classList.remove("disabled");
});
sock.on("server:user:user_join", (users) => {
    updateUserList(users);
});

document.querySelector("textarea").addEventListener("keyup", (e) => {
    sock.emit(
        "client:user:write_message",
        document.querySelector("#username").value
    );
});

sock.on("server:user:user_leave", (users) => {
    updateUserList(users);
});

sock.on("server:user:write_message", (username) => {
    userIsWritting(username);
});

document.querySelector("#disconnect").addEventListener("click", (e) => {
    e.preventDefault();
    sock.emit("client:user:disconnect");
    document.querySelector(".chat-box").classList.add("disabled");
    document.querySelector(".welcome-panel").classList.remove("disabled");
}); */

/**
 * Fill the user list with connected users
 * @param {array} users
 */
/* function updateUserList(users) {
    let userList = document.querySelector(".userlist ul");
    userList.innerHTML = "";
    if (userList) {
        users.map((user) => {
            let li = document.createElement("li");
            li.innerHTML = user;
            li.dataset.name = user;
            userList.appendChild(li);
        });
    }
} */

/**
 * Mark user currently writting a message
 * @param {string} username
 */
/* function userIsWritting(username) {
    const user = document.querySelector(`li[data-name="${username}"]`);
    user.dataset.action = "writting";
} */
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
