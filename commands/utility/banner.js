const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Displays the profile banner of a member')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to view (leave blank for yourself)')
                .setRequired(false)),

    async execute(interaction) {
        // On récupère l'utilisateur (User object)
        const targetUser = interaction.options.getUser('target') || interaction.user;
        
        // On doit fetch l'utilisateur complet pour obtenir la bannière
        const user = await targetUser.fetch(); 

        if (!user.bannerURL()) {
            return interaction.reply({ 
                content: "❌ This user has no banner.", 
                ephemeral: true 
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle(`${user.username}'s Banner`)
            .setImage(user.bannerURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: 'Hellz Utility' });

        await interaction.reply({ embeds: [embed] });
    }
};