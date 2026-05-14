const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Start a giveaway')
        .addIntegerOption(opt => opt.setName('minutes').setDescription('Duration in minutes').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true))
        .addStringOption(opt => opt.setName('prize').setDescription('The prize').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await interaction.reply({ content: '⏳ Starting...', ephemeral: true });
        const duration = interaction.options.getInteger('minutes') * 60000;

        try {
            await interaction.client.giveawaysManager.start(interaction.channel, {
                duration: duration,
                winnerCount: interaction.options.getInteger('winners'),
                prize: interaction.options.getString('prize'),
            });
            await interaction.editReply('✅ Giveaway started!');
        } catch (e) {
            await interaction.editReply(`❌ Error: ${e.message}`);
        }
    }
};