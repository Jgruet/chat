export default class UserInterface {
    constructor() {
        this.typing = false;
    }
    usernameSubmit(alertPseudo = false) {
        if (alertPseudo === true) {
            alert(`Choisissez un autre pseudo, celui ci est déjà utilisé !`);
            return;
        }

        let user = document.querySelector("#username").value;
        if (user != "") {
            document.dispatchEvent(
                new CustomEvent("local:user:send_username", {
                    detail: { user: user },
                })
            );
        } else {
            alert("Please fill a username");
        }
    }

    listenInterface() {
        document
            .querySelector("#login")
            .addEventListener("click", this.usernameSubmit);
        document
            .querySelector("#disconnect")
            .addEventListener("click", this.userDisconnect);
        document
            .querySelector("textarea")
            .addEventListener("keyup", function (e) {
                if (e.keyCode != 13) {
                    this.userTyping();
                }
            }.bind(this));
        document
            .querySelector("#send-message")
            .addEventListener("click", this.sendMessage);
        document
            .querySelector("#send-message")
            .addEventListener("click", this.sendMessage);
        document
            .querySelector("#message")
            .addEventListener("keydown", function (e) {
                if (e.keyCode === 13) {
                    // Ctrl + Enter
                    if (e.ctrlKey) {
                        e.target.value += "\n";
                        // Enter
                    } else {
                        this.sendMessage();
                    }
                }
            }.bind(this));
    }

    connectUser(username) {
        window.sessionStorage.setItem("username", username); // Fait persister le pseudo en session storage
        document.querySelector(".welcome-panel").classList.add("disabled");
        document.querySelectorAll(".chat").forEach((element) => {
            element.classList.remove("disabled");
        });
        document.querySelector("#disconnect").classList.add("visible");
    }

    listUsers(users) {
        let userList = document.querySelector(".userlist ul");
        if (userList) {
            userList.innerHTML = "";
            users.map((user) => {
                let li = document.createElement("li");
                li.innerHTML = user.username.replace(/(<([^>]+)>)/gi, "");
                li.dataset.id = user.id;
                userList.appendChild(li);
            });
        }
    }

    userDisconnect(e) {
        e.preventDefault();
        document.querySelector("body").dataset.channel = "";
        document.dispatchEvent(new CustomEvent("local:user:disconnect"));
        window.sessionStorage.removeItem("username");
        document.querySelectorAll(".chat").forEach((element) => {
            element.classList.add("disabled");
        });
        document.querySelector(".welcome-panel").classList.remove("disabled");
        document.querySelector("#disconnect").classList.remove("visible");
    }

    userTyping() {
        //document.dispatchEvent(new CustomEvent("local:user:writting"));
        if (this.typing !== true) {
            this.typing = true;
            document.dispatchEvent(
                new CustomEvent("local:message:typing", {
                    detail: { status: this.typing },
                })
            );
        } else {
            // sinon on supprime le précédent timer
            window.clearTimeout(this.timerTyping);
        }
        // on crée un nouveau timer au bout de 3 seondes on changera le statut à false
        this.timerTyping = window.setTimeout(() => {
            this.typing = false;
            document.dispatchEvent(
                new CustomEvent("local:message:typing", {
                    detail: { status: this.typing },
                })
            );
        }, 1000);
    }

    handleFeather(users) {
        users.forEach(function (user) {
            let writter = document.querySelector(
                `.userlist li[data-id="${user.id}"]`
            );
            if (user.isTyping === true) {
                writter.dataset.action = "writting";
            } else {
                writter.dataset.action = "";
            }
        });
    }

    listChannels(channels) {
        // Lister tous les channels existants
        let channelList = document.querySelector(".channels ul");
        if (channelList) {
            channelList.innerHTML = "";
            channels.map((channel) => {
                let li = document.createElement("li");
                li.innerHTML = channel.displayName;
                li.dataset.name = channel.name;
                channelList.appendChild(li);
            });
        }
        // Création d'écouteur d'évènement sur les channels pour pouvoir changer
        document.querySelectorAll(".channels ul li").forEach((element) => {
            element.addEventListener("click", (e) => {
                let channel_in = e.currentTarget.dataset["name"];
                let channel_out =
                    document.querySelector("body").dataset.channel;
                document.dispatchEvent(
                    new CustomEvent("local:channel:change", {
                        detail: { channel_in, channel_out },
                    })
                );
            });
        });
    }

    sendMessage() {
        let message = document.querySelector("#message").value;
        if (message != "") {
            message = message.replace(/\n/g, '<br>\n');
            // dispatchEvent -> lance l'event (trigger)
            document.dispatchEvent(
                new CustomEvent("local:message:send", { detail: { message } })
            );
            // on vide le champs du message
            document.querySelector("#message").value = "";
        }
    }

    listMessages(messages, clean = false) {
        if (clean) document.querySelector("#listingMessages").innerHTML = "";
        if (messages.length > 0) {
            document
                .querySelector(".chat.messages")
                .classList.add("has-messages");
        } else {
            document
                .querySelector(".chat.messages")
                .classList.remove("has-messages");
        }
        if ("content" in document.createElement("template")) {
            let template = document.querySelector("#messagesTpl");
            messages.forEach((message) => {
                let clone = document.importNode(template.content, true);
                clone.querySelector(".time small").innerHTML = message.time;
                clone.querySelector(".author").innerHTML =
                    message.author.replace(/(<([^>]+)>)/gi, "") + " :";
                clone.querySelector(".message-content").innerHTML =
                    message.message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, "");
                document.querySelector("#listingMessages").appendChild(clone);
            });
            document.querySelector("#listingMessages").scrollTop = document.querySelector("#listingMessages").scrollHeight;
            document.querySelector('.write-box textarea').value = '';
        }
    }

    stylingChannel(channel) {
        document.querySelector("body").dataset.channel = channel.name;
        //document.querySelector(".chat-box").dataset.channel = channel.name;
        document.querySelectorAll(".channels li").forEach((channel) => {
            channel.classList.remove("active");
        });
        document
            .querySelector(`.channels li[data-name="${channel.name}"]`)
            .classList.add("active");
        document.querySelector(".channel-name h2").innerHTML =
            channel.displayName;
    }

    channelNotification(channel) {
        const unreadChannel = document.querySelector(
            `.channels li[data-name="${channel}"]`
        );
        unreadChannel.classList.add("unread");
        unreadChannel.addEventListener("click", (e) => {
            e.currentTarget.classList.remove("unread");
        });
    }
}
