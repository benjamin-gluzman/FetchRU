import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextDisplayBuilder} from "discord.js";

const WEBREG_URL = "https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92026&indexList="

function getWatchComponent() {

}

function getUnwatchComponent() {

}

function getSearchComponent(courseString, currPage, totalPages) {
    // CustomId Format: search-<courseString>-<page>
    const prevBtn = new ButtonBuilder()
    .setCustomId(`search-${courseString}-${+currPage - 1}`)
    .setLabel("Previous")
    .setStyle(ButtonStyle.Danger);

    const nextBtn = new ButtonBuilder()
    .setCustomId(`search-${courseString}-${+currPage + 1}`)
    .setLabel("Next")
    .setStyle(ButtonStyle.Success);

    if(currPage == 0) prevBtn.setDisabled(true);
    if(currPage == totalPages - 1) nextBtn.setDisabled(true);

    const row = new ActionRowBuilder()
    .addComponents(prevBtn, nextBtn);

    return row;
}

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

export const cm = {
    getSearchComponent,
};

export { getNotifyComponent };