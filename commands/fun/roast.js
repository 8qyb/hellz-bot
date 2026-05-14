const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roast')
        .setDescription('Destroy someone with an elite roast')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to destroy')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const author = interaction.user;

        const roasts = [
            "You’re the reason God created the middle finger.",
            "Shut up, you look like a background character in your own life.",
            "Your breath smells like a graveyard. Stay back.",
            "You’re so ugly, when you look in the mirror, your reflection walks away.",
            "I’d slap you, but that would be animal abuse.",
            "You got the IQ of a speed bump.",
            "Your family tree is a straight line.",
            "Shut your mouth before I put my foot in it.",
            "You’re the type to get lost in a one-way street.",
            "I don’t hate you, but if you were on fire and I had a cup of water, I’d drink it.",
            "You look like you struggle with a 'push' door.",
            "Your hairline is in a long-distance relationship with your eyebrows.",
            "Go touch some grass and find a personality.",
            "You’re like a cloud. When you disappear, it’s a beautiful day."
        ];

        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('🔥 ELITE ROAST')
            .setDescription(`${target}, listen carefully:\n\n**"${randomRoast}"**`)
            .setFooter({ text: `Destroyed by ${author.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};