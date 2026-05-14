const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays detailed information about a member')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get info about')
                .setRequired(false)),

    async execute(interaction) {
        // If no target is picked, it defaults to the user who ran the command
        const target = interaction.options.getMember('target') || interaction.member;

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setAuthor({ 
                name: target.user.tag, 
                iconURL: target.user.displayAvatarURL({ dynamic: true }) 
            })
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: '🆔 ID', value: `\`${target.id}\``, inline: true },
                { name: '📥 Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: '🗓️ Discord Since', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '🎭 Roles', value: `\`${target.roles.cache.size - 1}\``, inline: false }
            )
            .setFooter({ text: 'Hellz User Intelligence' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};