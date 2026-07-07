import { fetchCourses, getCourseInfo } from "./fetchCourses.js";
import { startBot, client } from "./bot.js";
import * as database from "./database.js"

const FETCH_INTERVAL = 5000;


// const courseInfoMap = await getCourseInfo();

process.on("SIGINT", async () => {
    console.log("Shutting down bot");
    client.destroy();
    process.exit(0);
});

startBot(database);

setInterval( async () => {
    const openCourses = await fetchCourses();

    for(const course_index of openCourses) {
        const user_ids = database.getUsers(course_index);

        for(const user_id of user_ids) {
            const user = await client.users.fetch(user_id);
            
            await user.send(`${course_index} is now open!`);

            database.removeWatch(user_id, course_index);
        }
    }

}, FETCH_INTERVAL);

