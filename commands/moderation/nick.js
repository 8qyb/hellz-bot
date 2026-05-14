const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Change a members nickname')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user whose nickname you want to change')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('nickname')
                .setDescription('The new nickname (leave blank to reset)')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const newNick = interaction.options.getString('nickname');

        if (!target) {
            return interaction.reply({ content: "❌ **Target not found.**", ephemeral: true });
        }
        
        // Hierarchy Check
        if (target.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ 
                content: "❌ **Error:** Target aura is higher than yours.", 
                ephemeral: true 
            });
        }

        try {
            await target.setNickname(newNick || null);

            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setDescription(`✅ **${target.user.tag}** nickname has been updated.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "❌ **Error:** I cannot change this user's nickname. Check my permissions or role hierarchy.", 
                ephemeral: true 
            });
        }
    }
};