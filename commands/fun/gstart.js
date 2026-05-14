const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Start a giveaway')
        .addStringOption(opt => opt.setName('duration').setDescription('Ex: 10m, 1h').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true))
        .addStringOption(opt => opt.setName('prize').setDescription('What are you giving away?').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        // Use the new flag format to clear the thinking state quickly
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const duration = interaction.options.getString('duration');
        const milliseconds = ms(duration);

        if (!milliseconds) return interaction.editReply("❌ Invalid duration.");

        try {
            await interaction.client.giveawaysManager.start(interaction.channel, {
                duration: milliseconds,
                winnerCount: interaction.options.getInteger('winners'),
                prize: interaction.options.getString('prize'),
                messages: {
                    giveaway: '🎉 **GIVEAWAY** 🎉',
                    giveawayEnded: '🎉 **ENDED** 🎉',
                    inviteToParticipate: 'React with 🎉 to enter!',
                    winMessage: 'Congrats {winners}! You won **{prize}**!',
                    noWinner: 'No valid entrants.',
                    winners: 'Winners:',
                    endedAt: 'Ended at'
                }
            });

            return interaction.editReply("✅ Giveaway started!");
        } catch (err) {
            console.error(err);
            return interaction.editReply(`❌ Error: ${err.message}`);
        }
    }
};