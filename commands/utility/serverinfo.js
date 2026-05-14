const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays detailed information about the server'),

    async execute(interaction) {
        const { guild } = interaction;
        
        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle(`${guild.name} Statistics`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '👥 Members', value: `\`${guild.memberCount}\``, inline: true },
                { name: '💎 Boosts', value: `\`${guild.premiumSubscriptionCount || 0}\``, inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: false }
            )
            .setFooter({ text: 'Hellz Server Intelligence' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};