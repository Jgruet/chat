import UI from "./UserInterface.js";

export default class ClientChat {
    constructor() {
        this.socket = io.connect(document.location.host);
        this.UI = new UI();

        this.listenServer();
        this.transmitUiServer();
        this.UI.listenInterface();
    }

    listenServer() {
        this.socket.on("server:user:username_exists", () =>
            this.UI.usernameSubmit(true)
        );
        this.socket.on("server:user:connect", (username) =>
            this.UI.connectUser(username)
        );
        //this.socket.on('server:user:connect', this.UI.connectUser); @équivalent ligne du dessus
        this.socket.on("server:user:list", this.UI.listUsers);
        this.socket.on("server:user:user_leave", this.UI.listUsers);
        this.socket.on("server:user:write_message", this.UI.addFeather);
        this.socket.on("server:channel:list", this.UI.listChannels);
        // réception d’un message
        this.socket.on("server:message:send", (message) => {
            this.UI.listMessages([message], false);
        });
        // réception de plusieurs messages (changement de channels)
        this.socket.on("server:messages:send", (messages, channel) => {
            this.UI.listMessages(messages, true);
            //this.UI.stylingChannel(channel);
        });
        this.socket.on("server:user:typing_list", (users) => {
            this.UI.handleFeather(users);
        });
        this.socket.on("server:channel:list_user",this.UI.listUsers);
        this.socket.on('server:channel:actualize', (channel) => this.UI.stylingChannel(channel))
        this.socket.on('server:message:notification', this.UI.channelNotification)
    }

    transmitUiServer() {
        document.addEventListener("local:user:send_username", (event) => {
            this.socket.emit("client:user:send_username", event.detail.user);
        });
        document.addEventListener("local:user:disconnect", () => {
            this.socket.emit("client:user:disconnect");
        });
        document.addEventListener("local:message:send", (event) => {
            this.socket.emit("client:message:send", event.detail.message);
        });
        document.addEventListener("local:channel:change", (event) => {
            this.socket.emit("client:channel:change", event.detail.channel_in, event.detail.channel_out);
        });
        document.addEventListener("local:message:typing", (event) => {
            this.socket.emit("client:message:typing", event.detail.status);
        });
    }
}
