import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextDisplayBuilder} from "discord.js";

const WEBREG_URL = "https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92026&indexList="

function get_watch_components() {

}

function get_unwatch_components() {

}

function get_notify_component(course_index) {
    const registerBtn = new ButtonBuilder()
    .setURL(WEBREG_URL + course_index)
    .setLabel("Register")
    .setStyle(ButtonStyle.Link);

    const rewatchBtn = new ButtonBuilder()
    .setCustomId(`rewatch ${course_index}`)
    .setLabel("Rewatch")
    .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
    .addComponents(registerBtn, rewatchBtn);

    return row;
}

export { get_notify_component };