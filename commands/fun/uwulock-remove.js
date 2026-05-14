const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uwulock-remove')
        .setDescription('Release someone from Uwulock')
        .addUserOption(opt => opt.setName('target').setDescription('The Target').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        if (global.uwuUsers.has(user.id)) {
            global.uwuUsers.delete(user.id);
            return interaction.reply({ content: `✅ **${user.username}** has been released from uwulock !`, flags: [MessageFlags.Ephemeral] });
        }
        await interaction.reply({ content: `The target wasn't uwulocked`, flags: [MessageFlags.Ephemeral] });
    },
};