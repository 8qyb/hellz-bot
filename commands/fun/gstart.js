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
        // On dit à Discord de patienter (évite l'erreur de image_930c9c.png)
        await interaction.deferReply({ ephemeral: true });

        const duration = interaction.options.getString('duration');
        const winnerCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        const dmWinner = interaction.options.getBoolean('dm_winner') ?? false;

        const giveawayDuration = ms(duration);
        if (!giveawayDuration) {
            return interaction.editReply({ content: '❌ Invalid duration format (use 1h, 10m, 1d).' });
        }

        try {
            await interaction.client.giveawaysManager.start(interaction.channel, {
                duration: giveawayDuration,
                winnerCount,
                prize,
                messages: {
                    giveaway: '🎉 **GIVEAWAY STARTED** 🎉',
                    giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                    inviteToParticipate: 'React with 🎉 to participate!',
                    winMessage: 'Congratulations, {winners}! You won **{prize}**!'
                },
                extraData: { dmEnabled: dmWinner }
            });

            await interaction.editReply({ content: '✅ Giveaway successfully started!' });
        } catch (err) {
            console.error(err);
            await interaction.editReply({ content: '❌ An error occurred while starting the giveaway.' });
        }
    }
};