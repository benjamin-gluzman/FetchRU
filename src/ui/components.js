import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextDisplayBuilder} from "discord.js";

const WEBREG_URL = "https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92026&indexList="

function getNotifyComponent(courseIndex) {
    // CustomId Format: rewatch-<index>
    const registerBtn = new ButtonBuilder()
    .setURL(WEBREG_URL + courseIndex)
    .setLabel("Register")
    .setStyle(ButtonStyle.Link);

    const rewatchBtn = new ButtonBuilder()
    .setCustomId(`rewatch-${courseIndex}`)
    .setLabel("Rewatch")
    .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
    .addComponents(registerBtn, rewatchBtn);

    return row;
}

export { getNotifyComponent };