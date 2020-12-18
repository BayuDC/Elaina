const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");
module.exports = {
    name: "help",
    description: "List of all commands or info about a specific command",
    aliases: ["command", "h"],
    usage: "[command name]",
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
                            "My Commands",
                            message.client.user.displayAvatarURL({
                                dynamic: true,
                            })
                        )
                        .setDescription(
                            `${commandList}\n\nUse \`${prefix}help [command name]\` to get info about a specific command`
                        )
                );
                if (message.channel.type == "dm") return;
                await message.channel.send(
                    new MessageEmbed()
                        .setDescription(
                            "I have sent you a DM with all my commands!"
                        )
                        .setColor("#00a8ff")
                );
            } catch (error) {
                await message.channel.send(
                    new MessageEmbed()
                        .setDescription("it seems like I can't DM you!")
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
                    .setDescription("That is not a valid command!")
                    .setColor("#e74c3c")
            );
        const embed = new MessageEmbed()
            .setColor("#4cd137")
            .addField(
                command.name.charAt(0).toUpperCase() + command.name.slice(1),
                command.description
            )
            .addField(
                "Usage",
                `\`${prefix}${command.name}${
                    command.usage ? " " + command.usage : ""
                }\``
            );
        if (command.aliases)
            embed.addField("Aliases", `\`${command.aliases.join(", ")}\``);
        if (command.cooldown)
            embed.addField("Cooldown", `${command.cooldown} second(s)`);

        await message.channel.send(embed);
    },
};
