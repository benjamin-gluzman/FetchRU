import { database } from "../database.js";
import { em } from "../ui/embeds.js";

async function handleInteraction(interaction) {
    const arr = interaction.customId.split(" ");
    
    switch(arr[0]) {
        case "rewatch": handleRewatch(interaction, arr[1]); break;
    }
}

async function handleRewatch(interaction, course_index) {
    database.addWatch(interaction.user.id, course_index);

    await interaction.reply({
        embeds: [ em.getRewatchEmbed(interaction, course_index) ]
    });
}

export { handleInteraction };