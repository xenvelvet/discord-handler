const { Events, EmbedBuilder } = require('discord.js');
/** @type {import('../lib/types/index.ts').Event} */

module.exports = {
    name: 'onInteraction', event: Events.InteractionCreate, once: true,

    async execute(client, interaction) {
        if (
            !interaction.isChatInputCommand() && !interaction.isContextMenuCommand() && !interaction.isAutocomplete()
        ) return;

        if (!interaction.guild) return;
        const Command = client.slashCommands.get(interaction.commandName);

        if (!Command) return;

        const embed = new EmbedBuilder().setColor('Red')
        if (Command.devOnly && !client.developer.includes(interaction.user.id)) return interaction.reply({ embeds: [embed.setDescription(`Warning! Access Restricted Developer Command Detected.`)], flags: 'Ephemeral' });
        if (Command.userPermissions && Command.userPermissions.length !== 0) {
            if (!interaction.member.permissions.has(Command.userPermissions)) return interaction.reply({ embeds: [embed.setDescription(`You need \`${Command.userPermissions || Command.userPermissions.join(', ')}\` permission(s) to execute this command!`)], flags: 'Ephemeral' });
        } if (Command.botPermissions && Command.botPermissions.length !== 0) {
            if (!interaction.guild.members.me.permissions.has(Command.botPermissions)) return interaction.reply({ embeds: [embed.setDescription(`I need \`${Command.botPermissions || Command.botPermissions.join(', ')}\` permission(s) to execute this command!`)], flags: 'Ephemeral' });
        }
        Command.execute(client, interaction);
    }
}