module.exports = {
    name: "say",
    description: "Say something you want",
    args: true,
    usage: "<any>",
    execute(message, args) {
        const i =
            message.content.toLowerCase().indexOf(this.name) + this.name.length;
        const str = message.content.slice(i);
        message.channel.send(str).then(() => {
            if (message.channel.type == "dm") return;
            message.delete();
        });
    },
};
