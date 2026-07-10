import { getOpenCourses } from "./rutgersApi.js";
import { database } from "./database.js";
import { get_notify_embed } from "./ui/embeds.js";
import { get_notify_component } from "./ui/components.js";
import { client } from "./bot/bot.js";

const FETCH_INTERVAL = 5000;

function startPolling() {
    setInterval( async () => {
        const openCourses = await getOpenCourses();

        for(const course_index of openCourses) {
            const user_ids = database.getUsers(course_index);

            for(const user_id of user_ids) {
                const user = await client.users.fetch(user_id);
                
                // possibly await this
                await notify_user_of_open_course(user, course_index);
                
                // move this to another file
                database.removeWatch(user_id, course_index);
            }
        }

    }, FETCH_INTERVAL);
}

async function notify_user_of_open_course(user, course_index) {
    const course_info = database.getInfoByCourseIndex(course_index);

    await user.send({
        embeds: [ get_notify_embed(course_info, course_index) ],
        components: [ get_notify_component(course_index) ]
    });
}

export { startPolling };