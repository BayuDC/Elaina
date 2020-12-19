const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");
module.exports = {
    name: "help",
    description: "Menampilkan daftar command dan cara penggunaannya",
    aliases: ["command", "h"],
    usage: "[nama command]",
    async execute(message, args) {
        const { commands } = message.client;
        if (!args.length) {
            // ? list of all commands
            const commandList = commands
                .map((command) => `- ${command.name}`)
                .join("\n");
            try {
                await message.author.send(
                    new MessageEmbed()
                        .setColor("#4cd137")
                        .setAuthor(
                            "Daftar Command",
                            message.client.user.displayAvatarURL({
                                dynamic: true,
                            })
                        )
                        .setDescription(
                            `${commandList}\n\nKetik \`${prefix}help [nama command]\` untuk menampilkan cara penggunaannya`
                        )
                );
                if (message.channel.type == "dm") return;
                await message.channel.send(
                    new MessageEmbed()
                        .setDescription("Bantuan telah dikirimkan via DM")
                        .setColor("#00a8ff")
                );
            } catch (error) {
                await message.channel.send(
                    new MessageEmbed()
                        .setDescription("Bantuan gagal dikirimkan via DM")
                        .setColor("#e74c3c")
                );
            }
            return;
        }
        // ? info about a specific command
        const commandName = args[0].toLowerCase();
        const command =
            commands.get(commandName) ||
            commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );
        if (!command)
            return await message.channel.send(
                new MessageEmbed()
                    .setDescription("Command tidak ditemukan!")
                    .setColor("#e74c3c")
            );
        const embed = new MessageEmbed()
            .setColor("#4cd137")
            .addField(
                command.name.charAt(0).toUpperCase() + command.name.slice(1),
                command.description
            )
            .addField(
                "Cara Menggunakan",
                `\`${prefix}${command.name}${
                    command.usage ? " " + command.usage : ""
                }\``
            );
        if (command.aliases)
            embed.addField("Nama Lain", `\`${command.aliases.join(", ")}\``);
        if (command.cooldown)
            embed.addField("Cooldown", `${command.cooldown} detik`);

        await message.channel.send(embed);
    },
};
