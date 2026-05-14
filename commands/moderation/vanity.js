const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vanity')
        .setDescription('Set server vanity URL')
        .addStringOption(option => option.setName('code').setDescription('The code').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const code = interaction.options.getString('code');
        try {
            await interaction.guild.setVanityCode(code);
            await interaction.reply({ content: `🔗 Vanity set to: **discord.gg/${code}**` });
        } catch (error) {
            await interaction.reply({ content: `❌ Error: ${error.message}`, flags: [MessageFlags.Ephemeral] });
        }
    },
};