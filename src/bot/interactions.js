import { database } from "../core/database.js";
import { em } from "../ui/embeds.js";
import { safeReply } from "./responses.js";

async function handleInteraction(interaction) {
    const fields = interaction.customId.split("-");
    
    switch(fields[0]) {
        case "rewatch": handleRewatch(interaction, fields); break;
    }
}

async function handleRewatch(interaction, fields) {
    // rewatch-<index>
    const courseIndex = fields[1];
    database.addWatch(interaction.user.id, courseIndex);

    await safeReply(interaction, {
        embeds: [ em.getRewatchEmbed(interaction.user, courseIndex) ]
    });
}

export { handleInteraction };