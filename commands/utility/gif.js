const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Search for a GIF')
        .addStringOption(option => 
            option.setName('search')
                .setDescription('The term to search for')
                .setRequired(true)),

    async execute(interaction) {
        const query = interaction.options.getString('search');

        // Intégration du lien de recherche Giphy
        const gifUrl = `https://giphy.com/search/${encodeURIComponent(query)}`;
        
        await interaction.reply({ 
            content: `🔍 Results for: **${query}**\n${gifUrl}` 
        });
    }
};