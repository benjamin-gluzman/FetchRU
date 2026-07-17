import "./popup.css";
import { storage } from "./storage.js";

const watchesList = document.querySelector("#watchesList");

// Display stored watches
document.addEventListener("DOMContentLoaded", async () => {
    await loadWatches();
});

// Update DOM when a course being watched is removed (meaning it opened) in the background
chrome.runtime.onMessage.addListener(async (message) => {
    if(message.action === "update_dom") {
        await loadWatches();
    }
});

createInteractionHandlers();


function createInteractionHandlers() {
    const courseIndexInput = document.querySelector("#courseIndex"),
          errorBox = document.querySelector("#error"),
          addWatchBtn = document.querySelector("#addWatchBtn");

    courseIndexInput.addEventListener("keydown", async (event) => {
        if(event.key === "Enter")
            await addNewWatch();
        else
            errorBox.classList.remove("active");
    });

    addWatchBtn.addEventListener("click", async () => {
        await addNewWatch();
    });

    async function addNewWatch() {
        const courseIndex = courseIndexInput.value;
        if(!(await isValidCourseIndex(courseIndex))) return;

        courseIndexInput.value = "";

        storage.addWatch(courseIndex);
        watchesList.appendChild(createNewWatch(courseIndex));
    }

    // Returns true if the index is valid, false otherwise
    async function isValidCourseIndex(courseIndex) {
        if(!isInteger(courseIndex) || !(await storage.hasCourseIndex(courseIndex))) {
            errorBox.textContent = "Invalid course index";
            errorBox.classList.add("active");
            return false;
        }

        const watches = await storage.getWatches();
        if(watches.includes(courseIndex)) {
            errorBox.textContent = "Duplicate course index";
            errorBox.classList.add("active");
            return false;
        }

        return true;
    }

    function isInteger(courseIndex) {
        if(courseIndex.trim() === "") return false;

        return Number.isInteger(Number(courseIndex));
    }
}

async function loadWatches() {
    watchesList.replaceChildren();
    const watches = await storage.getWatches();
    
    for(const courseIndex of watches) {
        watchesList.appendChild(createNewWatch(courseIndex));
    }
    
    const watchCount = document.querySelector("#watchCount");
    watchCount.textContent = watches.length;
}

function createNewWatch(courseIndex) {
    const item = document.createElement("li"),
          h3 = document.createElement("h3"),
          removeBtn = document.createElement("button");
    
    h3.textContent = `${courseIndex}`;

    removeBtn.classList.add("removeWatchBtn");
    removeBtn.addEventListener("click", async () => {
        await storage.removeWatch(courseIndex);
        loadWatches();
    });

    item.append(h3, removeBtn);
    return item;
}