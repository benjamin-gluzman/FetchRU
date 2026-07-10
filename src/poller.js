import { getOpenCourses } from "./rutgersApi.js";
import { database } from "./database.js";
import { notify_user_of_open_course } from "./notifications.js";
import { client } from "./bot.js";

const FETCH_INTERVAL = 5000;

function startPolling() {
    setInterval( async () => {
        const openCourses = await getOpenCourses();

        for(const course_index of openCourses) {
            const user_ids = database.getUsers(course_index);

            for(const user_id of user_ids) {
                const user = await client.users.fetch(user_id);
                
                notify_user_of_open_course(user, course_index);
                
                // move this to another file
                database.removeWatch(user_id, course_index);
            }
        }

    }, FETCH_INTERVAL);
}

export { startPolling };