const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a previously locked channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            // Reset SendMessages permission to null (neutral) for @everyone
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null
            });

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setTitle('🔓 CHANNEL UNLOCKED')
                .setDescription('Lockdown lifted. Standard access has been restored.')
                .setFooter({ text: 'Hellz Security' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I don't have permission to modify this channel's settings.", 
                ephemeral: true 
            });
        }
    }
};