import { database } from "../core/database.js";
import { em } from "../ui/embeds.js";
import { safeReply } from "./responses.js";
import { INVALID_REQUESTS } from "./commands.js";

async function handleInteraction(interaction) {
    const fields = interaction.customId.split("-");
    
    switch(fields[0]) {
        case "rewatch": handleRewatch(interaction, fields); break;
    }
}

async function handleRewatch(interaction, fields) {
    // rewatch-<index>
    const courseIndex = fields[1];
    if(database.getWatches(interaction.user.id).includes(courseIndex)) {
        await safeReply(interaction, {
            embeds: [ em.getInvalidRequestEmbed(interaction.user, INVALID_REQUESTS.DUPLICATE_INDEX) ]
        });
        return;
    }

    database.addWatch(interaction.user.id, courseIndex);

    await safeReply(interaction, {
        embeds: [ em.getRewatchEmbed(interaction.user, courseIndex) ]
    });
}

export { handleInteraction };