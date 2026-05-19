const OPEN_COURSES_URL = "https://classes.rutgers.edu/soc/api/openSections.json?year=2026&term=1&campus=NB";

async function fetchCourses() {
    const response = await fetch(OPEN_COURSES_URL);
    if(!response.ok) {
        console.log("fetch() failed");
        process.exit(0);
    }
    const openCourses = await response.json();

    return openCourses;
}

export {fetchCourses};