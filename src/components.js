import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextDisplayBuilder} from "discord.js";

function createWatchComponents(courseIndex) {
    const content = new TextDisplayBuilder()
        .setContent(`Watching \`${courseIndex}\` index`);

    return [content];
}

function createUnwatchComponents(courseIndex) {
    const content = new TextDisplayBuilder()
        .setContent(`Stopped watching \`${courseIndex}\` index`);

    return [content];
}

function createCheckComponents() {
    
}


export { createWatchComponents, createUnwatchComponents, createCheckComponents };