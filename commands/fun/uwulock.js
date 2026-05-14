const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uwulock')
        .setDescription('Uwulock the target')
        .addUserOption(opt => opt.setName('target').setDescription('The Target').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        global.uwuUsers.add(user.id);
        await interaction.reply({ content: `✨ **${user.username}** is now uwulocked.` });
    },
};