import { getOpenCourses } from "../../src/shared/rutgersApi.js";
import { storage } from "./storage.js";

await storage.initializeStorage();

const [currWatches, courseInfo] = await Promise.all([
    storage.getWatches(), 
    storage.getStoredCourseInfo()
]);

storage.trackWatches(currWatches);
startPolling();

function startPolling() {
    const FETCH_INTERVAL = 5000;

    setInterval(async () => {
        const openCourses = (await getOpenCourses()).sort();
        console.log(currWatches);
        for(const courseIndex of currWatches) {
            if(containsIndex(openCourses, courseIndex)) {
                await notifyUser(courseIndex);
                await storage.removeWatch(courseIndex);
            }
        }
        
    }, FETCH_INTERVAL);
}

async function notifyUser(courseIndex) {
    await chrome.notifications.create({
        type: "basic",
        iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        title: "Course Open!",
        message: `${courseIndex} is now open!`
    });
}

function containsIndex(openCourses, courseIndex) {
    let l = 0, r = openCourses.length - 1;
    while(l <= r) {
        let m = Math.trunc(l + (r - l) / 2);
        if(openCourses[m] === courseIndex) {
            return true;
        }
        else if(openCourses[m] > courseIndex) {
            r = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    
    return false;
}