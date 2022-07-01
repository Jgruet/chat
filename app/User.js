module.exports = class User {
    constructor(socketId, username) {  
        this.id = socketId;
        this.username = username;
        this.channel= null;
        this.isTyping = false;
    }
}
