const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banish a member from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to banish')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the banish')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.reply({ content: "❌ **Target not found.**", ephemeral: true });
        }

        // Hierarchy Check (Wick Style)
        if (target.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ 
                content: "❌ **Error:** This user has a higher or equal aura. Action cancelled.", 
                ephemeral: true 
            });
        }

        try {
            await target.ban({ reason: `Moderator: ${interaction.user.tag} | Reason: ${reason}` });

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setAuthor({ name: 'Case: Banishment', iconURL: target.user.displayAvatarURL() })
                .addFields(
                    { name: '👤 Target', value: `\`${target.user.tag}\` (${target.id})`, inline: false },
                    { name: '🛡️ Moderator', value: `${interaction.user}`, inline: true },
                    { name: '📄 Reason', value: `\`${reason}\``, inline: true }
                )
                .setFooter({ text: 'Hellz Moderation' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I cannot ban this user. They might have a higher role than me.", 
                ephemeral: true 
            });
        }
    }
};