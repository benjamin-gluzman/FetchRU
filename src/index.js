import { fetchCourses } from "./fetchCourses.js";
import { startBot, client } from "./bot.js";

const FETCH_INTERVAL = 5000;

const courseMap = new Map();

process.on("SIGINT", async () => {
    console.log("Shutting down bot");
    client.destroy();
    process.exit(0);
});

startBot(courseMap);

setInterval( async () => {
    const openCourses = await fetchCourses();
    for(let [course, userIds] of courseMap) {
        if(openCourses.includes(course)) {        
            let toRemove = [];

            for(const userId of userIds) {
                const user = await client.users.fetch(userId);
                await user.send(`${course} is now open!`);

                toRemove.push(userId);
            }

            courseMap.set(course, userIds.filter(userId => !toRemove.includes(userId)));
        }

    }
}, FETCH_INTERVAL);