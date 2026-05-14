const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Start a giveaway')
        .addStringOption(opt => opt.setName('duration').setDescription('Ex: 1h, 1d, 10m').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true))
        .addStringOption(opt => opt.setName('prize').setDescription('What are you giving away?').setRequired(true))
        .addBooleanOption(opt => opt.setName('dm_winner').setDescription('Should the winner be DM'd?'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const duration = interaction.options.getString('duration');
        const winnerCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        const dmWinner = interaction.options.getBoolean('dm_winner') ?? false;

        await interaction.client.giveawaysManager.start(interaction.channel, {
            duration: ms(duration),
            winnerCount,
            prize,
            messages: {
                giveaway: '🎉 **GIVEAWAY STARTED** 🎉',
                giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                inviteToParticipate: 'React with 🎉 to participate!',
                winMessage: dmWinner 
                    ? 'Congratulations, {winners}! You won **{prize}**! Check your DMs.' 
                    : 'Congratulations, {winners}! You won **{prize}**!'
            }
        }).then((data) => {
            if (dmWinner) {
                // We'll handle the DM in the giveawayEnd event below
                data.extraData = { dmEnabled: true }; 
            }
            interaction.reply({ content: 'Giveaway started!', ephemeral: true });
        });
    }
};