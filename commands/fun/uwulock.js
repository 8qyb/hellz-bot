const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uwulock')
        .setDescription('Lock a user in UwU mode')
        .addUserOption(option => option.setName('target').setDescription('The victim').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        global.uwuUsers.add(user.id);
        await interaction.reply({ content: `✨ **${user.username}** is now locked in UwU mode!` });
    },
};