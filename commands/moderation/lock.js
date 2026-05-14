const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock down the current channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            // Edit permission overwrites for @everyone to disable sending messages
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setTitle('🔒 CHANNEL LOCKED')
                .setDescription('This channel has been placed under lockdown by the administration.')
                .setFooter({ text: 'Access Restricted' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I don't have permission to lock this channel.", 
                ephemeral: true 
            });
        }
    }
};