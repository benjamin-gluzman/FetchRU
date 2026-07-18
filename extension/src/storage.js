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

    localStorage.onChanged.addListener(async () => {
        try {
            await chrome.runtime.sendMessage({ action: "update_dom" });
        }
        catch(err) {
            console.log(`Error sending message: ${err}`);
        }
    });
}

async function getCourseIndexMap() {
    return new Map(
        Object.entries(
            await retry(async () => (await localStorage.get("courseIndexMap")).courseIndexMap, "getCourseIndexMap()")
        )
    );
}

async function getWatches() {
    return await retry(async () => (await localStorage.get("watches")).watches, "getWatches()")
}

async function addWatch(courseIndex) {
    const watches = await retry(async () => (await localStorage.get("watches")).watches, "addWatch()");
    watches.push(courseIndex);

    await retry(async () => await localStorage.set({ watches }), "addWatch()");
}

async function removeWatch(courseIndex) {
    const watches = await retry(async () => (await localStorage.get("watches")).watches, "removeWatch()");

    await retry(async () => await localStorage.set({ watches: watches.filter(index => index != courseIndex) }), "removeWatch()");
}

async function retry(operation, name) {
    const MAX_RETRIES = 3, RETRY_DELAY = 100;

    for (let attempt = 1; ; attempt++) {
        try {
            return await operation();
        }
        catch (err) {
            if (attempt === MAX_RETRIES) {
                console.error(`${name} failed after ${attempt} attempts`, err);
                throw err;
            }

            console.warn(`${name} failed (attempt ${attempt}), retrying...`);

            await new Promise(resolve =>
                setTimeout(resolve, RETRY_DELAY * attempt)
            );
        }
    }
}


export const storage = {
    initializeStorage,
    getCourseIndexMap,
    getWatches,
    addWatch,
    removeWatch,
};