const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greroll')
        .setDescription('Reroll a giveaway')
        .addStringOption(opt => opt.setName('query').setDescription('Giveaway ID or Prize Name').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        try {
            await interaction.client.giveawaysManager.reroll(query);
            await interaction.reply('✅ Rerolled!');
        } catch (e) {
            await interaction.reply(`❌ No ended giveaway found.`);
        }
    }
};