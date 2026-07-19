import { getOpenCourses } from "../shared/rutgersApi.js";
import { database } from "./database.js";
import { getNotifyEmbed } from "../ui/embeds.js";
import { getNotifyComponent } from "../ui/components.js";
import { safeSend } from "../bot/responses.js";

const FETCH_INTERVAL = 5000;

async function pollCourses() {
    const openCourses = await getOpenCourses();

    for(const courseIndex of openCourses) {
        const userIds = database.getUsers(courseIndex);

        for(const userId of userIds) {                
            await notifyUser(userId, courseIndex);
            
            database.removeWatch(userId, courseIndex);
        }
    }

    setTimeout(pollCourses, FETCH_INTERVAL);
}

async function notifyUser(userId, courseIndex) {
    const courseInfo = database.getInfoByCourseIndex(courseIndex);

    await safeSend(userId, {
        embeds: [ getNotifyEmbed(courseInfo, courseIndex) ],
        components: [ getNotifyComponent(courseIndex) ]
    });
}

export { pollCourses };