const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Start a giveaway')
        .addStringOption(opt => opt.setName('duration').setDescription('Ex: 1h, 1d, 10m').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true))
        .addStringOption(opt => opt.setName('prize').setDescription('What are you giving away?').setRequired(true))
        .addBooleanOption(opt => opt.setName('dm_winner').setDescription('Should the winner be DM\'d?'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        // 1. Defer the reply to prevent "Application did not respond"
        await interaction.deferReply({ ephemeral: true });

        const durationStr = interaction.options.getString('duration');
        const winnerCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        const dmWinner = interaction.options.getBoolean('dm_winner') ?? false;

        // 2. Convert duration string to milliseconds
        const milliseconds = ms(durationStr);

        if (!milliseconds || isNaN(milliseconds)) {
            return interaction.editReply({ content: '❌ Invalid duration! Use formats like `10m`, `1h`, or `1d`.' });
        }

        try {
            // 3. Start the giveaway
            await interaction.client.giveawaysManager.start(interaction.channel, {
                duration: milliseconds,
                winnerCount: winnerCount,
                prize: prize,
                hostedBy: interaction.user,
                messages: {
                    giveaway: '🎉 **GIVEAWAY STARTED** 🎉',
                    giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                    inviteToParticipate: 'React with 🎉 to participate!',
                    winMessage: 'Congratulations, {winners}! You won **{prize}**!',
                    noWinner: 'Giveaway cancelled, no valid participations.',
                    winners: 'Winners:',
                    endedAt: 'Ended at'
                },
                extraData: { 
                    dmEnabled: dmWinner 
                }
            });

            await interaction.editReply({ content: '✅ Giveaway is now live!' });

        } catch (err) {
            console.error('Giveaway Manager Error:', err);
            // This will help you see the REAL error in your Render logs
            await interaction.editReply({ content: `❌ Failed to start giveaway. Error: ${err.message}` });
        }
    }
};