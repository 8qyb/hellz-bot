const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gend')
        .setDescription('End a giveaway')
        .addStringOption(opt => opt.setName('query').setDescription('Giveaway ID or Prize Name').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        try {
            await interaction.client.giveawaysManager.end(query);
            await interaction.reply('✅ Giveaway ended!');
        } catch (e) {
            await interaction.reply(`❌ Not found or already ended.`);
        }
    }
};