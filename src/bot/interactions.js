import { database } from "../database.js";
import { em } from "../ui/embeds.js";

async function handle_interaction(interaction) {
    const arr = interaction.customId.split(" ");
    
    switch(arr[0]) {
        case "rewatch": handle_rewatch(interaction, arr[1]); break;
    }
}

async function handle_rewatch(interaction, course_index) {
    database.addWatch(interaction.user.id, course_index);

    await interaction.reply({
        embeds: [ em.get_rewatch_embed(interaction, course_index) ]
    });
}

export { handle_interaction };