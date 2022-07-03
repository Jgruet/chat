const User = require("./User.js");
const Channel = require("./Channel.js");
const Message = require("./Message.js");

module.exports = class ServerChat {
    constructor(server) {
        this.users = [];
        this.io = require("socket.io")(server);
        this.io.on("connection", (socket) => {
            this.onConnection(socket);
        });
        this.channels = [
            new Channel("main", "Main room"),
            new Channel("bar", "Bar"),
            new Channel("kitchen", "Kitchen"),
            new Channel("cellar", "Cellar"),
            new Channel("bedroom1", "Bedroom 1"),
            new Channel("bedroom2", "Bedroom 2"),
            new Channel("bedroom3", "Bedroom 3"),
        ];
    }

    onConnection(socket) {
        console.log(`client ${socket.id} is connected via WebSockets   `);
        // choix du pseudo
        socket.on(
            "client:user:send_username",
            this.submitUsername.bind(this, socket)
        );
        // deconnexion boutton
        socket.on(
            "client:user:disconnect",
            this.disconnected.bind(this, socket)
        );
        //deconnexion fermeture fenetre
        socket.on("disconnect", () => {
            this.disconnected(socket);
        });
        // utilisateur entrain d'écrire
        // saisie des utilisateurs
        socket.on(
            "client:message:typing",
            this.userTypingMessage.bind(this, socket)
        );

        socket.on(
            "client:message:send",
            this.receiveMessage.bind(this, socket)
        );
        socket.on("client:channel:change", this.changeChannel.bind(this, socket));
    }

    submitUsername(socket, username) {
        if (
            this.users.filter((user) => user.username === username).length != 0
        ) {
            socket.emit("server:user:username_exists");
        } else {
            socket.emit("server:channel:list", this.channels);
            socket.user = new User(socket.id, username);
            this.users.push(socket.user);
            socket.user.channel = "main";
            this.changeChannel(socket, "main");
            socket.emit("server:user:connect", username);
            let channelUsers = this.users.filter((user) => {return user.channel === socket.user.channel});
            this.io.emit("server:user:list", channelUsers);
        }
    }

    disconnected(socket) {
        if (socket.user != null) {
            let updatedUserList = this.users.filter(
                (user) => user.username !== socket.user.username
            );

            this.users = updatedUserList;
            this.io.emit("server:user:user_leave", updatedUserList);
        }
    }

    isWritting(socket) {
        socket.broadcast.emit("server:user:write_message", socket.user);
    }

    receiveMessage(socket, message) {
        let msg = new Message(socket.user.username, message);
        // Nous allons le stocker dans l'objet channel correspondant
        let channel = this.channels.find(
            (channel) => channel.name == socket.user.channel
        );
        channel.addMessage(msg);

        this.io.in(socket.user.channel).emit("server:message:send", {
            author: msg.author,
            message: msg.message,
            time: msg.time,
        });

    
        this.io.except(socket.user.channel).emit("server:message:notification", socket.user.channel);

    }

    changeChannel(socket, channel_in, channel_out = null) {
        // on vérifie que le salon dans lequel l'utilisateur veut entrer existe
        let index = this.channels.findIndex(
            (channel) => channel.name == channel_in
        );
        if (index != -1) {
            // maj objet User
            console.log('chanelin = '+ channel_in)
            if(socket.user != null && socket.user.channel != null){
                socket.user.channel = channel_in;
            } else {
                console.log(socket.user);
            }
           

            // L'utilisateur quitte un canal
            if(channel_out != null){
                socket.leave(channel_out);
                let channelUsersLeft = this.users.filter((user) => {return user.channel == channel_out})
                this.io.in(channel_out).emit("server:channel:list_user", channelUsersLeft); 
            }
            
            
            // L'utilisateur entre dans le nouveau canal - màj des users du channel + affichage
            socket.join(socket.user.channel);

            // Récupération des messages du channel rejoint
            let channel = this.channels[index];
            let messages = channel.messages.map((message) => {
                return {
                    author: message.author,
                    message: message.message,
                    time: message.time,
                };
            });
            socket.emit("server:messages:send", messages); // on envoie les messages du channel

            // On parcourt les utilisateurs pour récupérer ceux du channel rejoint
            let channelUsers = this.users.filter((user) => {return user.channel === channel_in})
            // On update la liste des utilisateurs a tous ceux du channel
            this.io.in(channel_in).emit("server:channel:list_user", channelUsers); 
            // Màj du salon dans lequel l'utilisateur est actuellement connecté
            socket.emit("server:channel:actualize", channel);
        } else {
            console.log(`le client ${socket.id} (pseudo :${socket.user.username}) 
                 a tenté une connexion sur un salon inexistant`);
        }
    }

    userTypingMessage(socket, status) {
        if(socket.user != null){
            // on met à jours le statut de l'utilisateur
            socket.user.isTyping = status;
            
            // on envoi l'information aux utilisateurs du même salon
            this.io.in(socket.user.channel).emit(
                'server:user:typing_list',
                // on filtre les utilisateurs du channel en train de saisir
                this.users.filter(user => 
                    (user.channel == socket.user.channel)
                )
             );
        }
     }
     
};
