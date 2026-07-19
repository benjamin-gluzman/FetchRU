import { client } from "../bot/bot.js";

async function safeReply(interaction, options) {
    try {
        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply();
        }

        await interaction.editReply(options);
    }
    catch (err) {
        console.error("Failed to reply:", err);
    }
}

async function safeAutocomplete(interaction, choices) {
    try {
        await interaction.respond(choices);
    }
    catch (err) {
        console.error("Failed to autocomplete:", err);
    }
}

async function safeSend(userId, options) {
    try {
        const user = await client.users.fetch(userId);
        await user.send(options);
    }
    catch (err) {
        console.error("Failed to send:", err);
    }
}

export {
    safeReply,
    safeAutocomplete,
    safeSend
};