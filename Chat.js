var util = require("util");
var EventEmitter = require('events').EventEmitter;

var Chat = function(storage) {
    this.sessionStorage = storage;
    this.messages = [];
    this.users = [];
};

util.inherits(Chat, EventEmitter);

Chat.prototype.auth = function(name, password, sessionkey, callback) {
    console.log(arguments);
    if (sessionkey) {
        if (name == password) {
            console.log("user_join", name);
            this.sessionStorage.invoke("set", [sessionkey, name]);
            this.users.push(name);
            callback(null, "login ok");
            this.emit("user_join", name);
        } else {
            callback("Login fail", null);
        }
    } else {
        callback("Session key not found", null);
    }
};

Chat.prototype.disconnect = function(name) {
    delete this.users[name];
    this.emit("user_leave", name);
    console.log("user_leave", name);
}

Chat.prototype.addMessage = function(new_message, callback) {
    this.messages.push(new_message);
    this.emit("new_message", new_message);
    callback(null, {
        success: true
    });
};

Chat.prototype.getMessages = function(obj, callback) {
    callback(null, {
        messages: this.messages
    });
};

Chat.prototype.getUsers = function(obj, callback) {
    callback(null, {
        users: this.users
    });
};

exports = module.exports = Chat;
