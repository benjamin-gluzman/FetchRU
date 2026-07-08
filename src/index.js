import { getOpenCourses, getCourseInfo } from "./fetchCourses.js";
import { startBot, client } from "./bot.js";
import { database } from "./database.js";

process.on("SIGINT", async () => {
    console.log("Shutting down bot");
    client.destroy();
    process.exit(0);
});

const FETCH_INTERVAL = 5000;

database.importCourseInfo(await getCourseInfo());
startBot();

setInterval( async () => {
    const openCourses = await getOpenCourses();

    for(const course_index of openCourses) {
        const user_ids = database.getUsers(course_index);

        for(const user_id of user_ids) {
            const user = await client.users.fetch(user_id);
            
            await user.send(`${course_index} is now open!`);

            database.removeWatch(user_id, course_index);
        }
    }

}, FETCH_INTERVAL);

