const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Start a quick giveaway')
        .addIntegerOption(opt => opt.setName('minutes').setDescription('How many minutes?').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true))
        .addStringOption(opt => opt.setName('prize').setDescription('What is the prize?').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const mins = interaction.options.getInteger('minutes');
        const winners = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');

        // Simple math: minutes * 60 seconds * 1000 milliseconds
        const durationMs = mins * 60 * 1000;

        try {
            await interaction.client.giveawaysManager.start(interaction.channel, {
                duration: durationMs,
                time: durationMs, // Added to fix the error in image_798d2e.png
                winnerCount: winners,
                prize: prize,
                hostedBy: interaction.user,
                messages: {
                    giveaway: '🎉 **GIVEAWAY** 🎉',
                    giveawayEnded: '🎉 **ENDED** 🎉',
                    inviteToParticipate: 'React with 🎉!',
                    winMessage: 'Congrats {winners}! You won **{prize}**!'
                }
            });

            await interaction.editReply("✅ Started!");
        } catch (err) {
            console.error(err);
            await interaction.editReply("❌ Error starting giveaway.");
        }
    }
};