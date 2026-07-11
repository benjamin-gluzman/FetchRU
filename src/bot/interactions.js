import { database } from "../database.js";
import { em } from "../ui/embeds.js";

async function handleInteraction(interaction) {
    const arr = interaction.customId.split(" ");
    
    switch(arr[0]) {
        case "rewatch": handleRewatch(interaction, arr[1]); break;
    }
}

async function handleRewatch(interaction, courseIndex) {
    database.addWatch(interaction.user.id, courseIndex);

    await interaction.reply({
        embeds: [ em.getRewatchEmbed(interaction.user, courseIndex) ]
    });
}

export { handleInteraction };