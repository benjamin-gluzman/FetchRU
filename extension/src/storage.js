import { getCourseInfo } from "../../src/shared/rutgersApi.js";

const localStorage = chrome.storage.local;

async function initializeStorage() {
    const courses = await getCourseInfo(),
          courseIndexMap = new Map();

    for(const course of courses) {
        for(const section of course.sections) {
            courseIndexMap.set(
                section.courseIndex,
                `${course.title} (${course.courseString}:${section.number})` 
            );
        }
    }

    await Promise.all([
        localStorage.set({ courseIndexMap: Object.fromEntries(courseIndexMap) }),
        localStorage.set({ watches: await getWatches() || [] })
    ]);
}

async function getCourseIndexMap() {
    return new Map(
        Object.entries(
            (await localStorage.get("courseIndexMap"))
            .courseIndexMap
        )
    );
}

async function getWatches() {
    return (await localStorage.get("watches")).watches;
}

async function addWatch(courseIndex) {
    const watches = (await localStorage.get("watches")).watches;
    watches.push(courseIndex);

    await localStorage.set({ watches });
}

async function removeWatch(courseIndex) {
    const watches = (await localStorage.get("watches")).watches;

    await localStorage.set({ watches: watches.filter(index => index != courseIndex) });
}

function trackWatches(currWatches) {
    localStorage.onChanged.addListener(async () => {
        const updatedWatches = (await localStorage.get("watches")).watches;
        currWatches.splice(0, currWatches.length, ...updatedWatches);

        try {
            await chrome.runtime.sendMessage({ action: "update_dom" });
        }
        catch(err) {
            console.log(`Error sending message: ${err}`);
        }
    });
}

export const storage = {
    initializeStorage,
    getCourseIndexMap,
    getWatches,
    addWatch,
    removeWatch,
    trackWatches,
};