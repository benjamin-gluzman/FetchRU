import { fetchCourses, getCourseInfo } from "./fetchCourses.js";
import { startBot, client } from "./bot.js";

const FETCH_INTERVAL = 5000;

const courseUserMap = new Map();
const courseInfoMap = await getCourseInfo();

process.on("SIGINT", async () => {
    console.log("Shutting down bot");
    client.destroy();
    process.exit(0);
});

startBot(courseUserMap);

setInterval( async () => {
    const openCourses = await fetchCourses();
    for(let [courseIndex, userIds] of courseUserMap) {
        if(openCourses.includes(courseIndex)) {        

            for(const userId of userIds) {
                const user = await client.users.fetch(userId);
                await user.send(`${courseIndex} is now open!\nCourse Title: ${courseInfoMap.get(courseIndex)}`);
            }

            courseUserMap.set(courseIndex, []);
        }   
    }
}, FETCH_INTERVAL);