const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greroll')
        .setDescription('Pick a new winner for a giveaway')
        .addStringOption(opt => opt.setName('message_id').setDescription('The ID of the giveaway message').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const messageId = interaction.options.getString('message_id');

        interaction.client.giveawaysManager.reroll(messageId)
            .then(() => {
                interaction.reply({ content: '✅ New winner picked!', flags: [MessageFlags.Ephemeral] });
            })
            .catch((err) => {
                interaction.reply({ content: `❌ Error: ${err}`, flags: [MessageFlags.Ephemeral] });
            });
    },
};