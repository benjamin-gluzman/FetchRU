import { database } from "../core/database.js";

const MAX_CHOICES = 25;

async function handleAutocomplete(interaction) {
    const commandName = interaction.commandName;
    if(commandName !== "unwatch" && commandName != "search") return;

    const focused = interaction.options.getFocused();

    const watchesInfo = database.getWatches(interaction.user.id)
        .map(courseIndex => database.getInfoByCourseIndex(courseIndex));

    const choices = watchesInfo
        .filter(watch => watch.courseIndex.startsWith(focused))
        .splice(0, MAX_CHOICES)
        .map(watch => ({
            name: `${watch.courseIndex} | ${watch.title} (${watch.courseString}:${watch.section})`,
            value: watch.courseIndex
        }));
    
    await interaction.respond(choices)
}

export { handleAutocomplete };