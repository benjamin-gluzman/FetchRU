import { getOpenCourses } from "./rutgersApi.js";
import { database } from "./database.js";
import { getNotifyEmbed } from "./ui/embeds.js";
import { getNotifyComponent } from "./ui/components.js";
import { client } from "./bot/bot.js";

const FETCH_INTERVAL = 5000;

function startPolling() {
    setInterval( async () => {
        const openCourses = await getOpenCourses();

        for(const courseIndex of openCourses) {
            const userIds = database.getUsers(courseIndex);

            for(const userId of userIds) {
                const user = await client.users.fetch(userId);
                
                await notifyUser(user, courseIndex);
                
                // move this to another file
                database.removeWatch(userId, courseIndex);
            }
        }

    }, FETCH_INTERVAL);
}

async function notifyUser(user, courseIndex) {
    const courseInfo = database.getInfoByCourseIndex(courseIndex);

    await user.send({
        embeds: [ getNotifyEmbed(courseInfo, courseIndex) ],
        components: [ getNotifyComponent(courseIndex) ]
    });
}

export { startPolling };