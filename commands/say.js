module.exports = {
    name: "say",
    description: "Mengatakan sesuatu yang kamu inginkan",
    args: true,
    usage: "<apapun>",
    async execute(message, args) {
        const i =
            message.content.toLowerCase().indexOf(this.name) + this.name.length;
        const str = message.content.slice(i);

        if (message.deletable && !message.deleted) await message.delete();
        await message.channel.send(str);
    },
};
