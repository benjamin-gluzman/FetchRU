import { database } from "../database.js";
import { em } from "../ui/embeds.js";
import { cm } from "../ui/components.js";

async function handleInteraction(interaction) {
    const fields = interaction.customId.split("-");
    
    switch(fields[0]) {
        case "rewatch": handleRewatch(interaction, fields); break;
        case "search": handleSearch(interaction, fields); break;
    }
}

async function handleSearch(interaction, fields) {
    // search-<courseString>-<page>
    const courseString = fields[1], newPage = fields[2];

    const courseInfo = database.getInfoByCourseString(courseString),
        sectionInfo = database.getSectionInfoByCourseString(courseString);

    await interaction.update({
        embeds: [ em.getSearchEmbed(interaction.user, courseInfo, sectionInfo, newPage) ],
        components: [ cm.getSearchComponent(courseString, newPage, sectionInfo.length) ]
    });
}

async function handleRewatch(interaction, fields) {
    // rewatch-<index>
    const courseIndex = fields[1];
    database.addWatch(interaction.user.id, courseIndex);

    await interaction.reply({
        embeds: [ em.getRewatchEmbed(interaction.user, courseIndex) ]
    });
}

export { handleInteraction };