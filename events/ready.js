module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} is online! Aura levels: Maximum.`);
        
        // Set the bot's status
        client.user.setActivity('Hellz Security | ,commands', { type: 3 }); // Type 3 = Watching
    },
};