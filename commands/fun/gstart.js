const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Start a giveaway')
        .addStringOption(opt => opt.setName('duration').setDescription('Ex: 10m, 1h, 1d').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true))
        .addStringOption(opt => opt.setName('prize').setDescription('What are you giving away?').setRequired(true))
        .addBooleanOption(opt => opt.setName('dm_winner').setDescription('Should the winner be DM\'d?'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        // Fix for the warning in image_873718.png: Using flags instead of ephemeral
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const durationStr = interaction.options.getString('duration');
        const winnerCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        const dmWinner = interaction.options.getBoolean('dm_winner') ?? false;

        const milliseconds = ms(durationStr);

        // Validation to prevent the "time is not a number" error
        if (!milliseconds || typeof milliseconds !== 'number') {
            return interaction.editReply({ content: '❌ Invalid duration format! Use something like `10m`, `1h`, or `1d`.' });
        }

        try {
            await interaction.client.giveawaysManager.start(interaction.channel, {
                duration: milliseconds, // This is 'time' for the manager
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
                    endedAt: 'Ended at',
                    hostedBy: 'Hosted by: {user}'
                },
                extraData: { 
                    dmEnabled: dmWinner 
                }
            });

            await interaction.editReply({ content: '✅ Giveaway is now live!' });

        } catch (err) {
            console.error('Giveaway Manager Error:', err);
            await interaction.editReply({ content: `❌ Failed to start: ${err.message}` });
        }
    }
};