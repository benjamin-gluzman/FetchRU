import "./popup.css";
import { storage } from "./storage.js";

const courseIndexMap = await storage.getCourseIndexMap();

const watchesList = document.querySelector("#watchesList");

// Display stored watches
await loadWatches();

createInteractionHandlers();

// Update DOM when a course being watched is removed (meaning it opened) in the background
chrome.runtime.onMessage.addListener(async (message) => {
    if(message.action === "update_dom") {
        await loadWatches();
    }
});


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
        let isValid = true;
        const watches = await storage.getWatches();

        if(!isInteger(courseIndex)) {
            errorBox.textContent = "⚠ Invalid course index. Please enter a 5-digit index.";
            isValid = false;
        }
        else if(!courseIndexMap.has(courseIndex)) {
            errorBox.textContent = "Course index does not exist";
            isValid = false;
        }
        else if(watches.includes(courseIndex)) {
            errorBox.textContent = "Duplicate course index";
            isValid = false;
        }

        if(!isValid) errorBox.classList.add("active");
        return isValid;
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
    const li =          document.createElement("li"),
          watchInfo =   document.createElement("div"),
          index =       document.createElement("span"),
          divider =     document.createElement("span"),
          course =      document.createElement("span"),
          removeBtn =   document.createElement("button");
    
    
    index.textContent = courseIndex;
    divider.textContent = "•";
    course.textContent = courseIndexMap.get(courseIndex);

    removeBtn.addEventListener("click", async () => {
        await storage.removeWatch(courseIndex);
        loadWatches();
    });


    watchInfo.classList.add("watchInfo");
    index.classList.add("index");
    divider.classList.add("divider");
    course.classList.add("course");
    removeBtn.classList.add("removeWatchBtn");


    watchInfo.append(index, divider, course);
    li.append(watchInfo, removeBtn);
    
    return li;
}