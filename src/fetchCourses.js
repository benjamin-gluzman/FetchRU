const OPEN_COURSES_URL = "https://classes.rutgers.edu/soc/api/openSections.json?year=2026&term=1&campus=NB";
const COURSE_INFO_URL = "https://classes.rutgers.edu/soc/api/courses.json?year=2026&term=1&campus=NB";

async function fetchCourses() {
    const response = await fetch(OPEN_COURSES_URL);
    if(!response.ok) {
        console.log("fetchCourses() fetch() failed");
        // process.exit(0);
    }

    const openCourses = await response.json();
    return openCourses;
}

async function getCourseInfo() {
    const response = await fetch(COURSE_INFO_URL);
    if(!response.ok) {
        console.log("getCourseInfo() fetch() failed");
    }

    const courseInfo = await response.json();
    const courseInfoMap = new Map();

    for(const course of courseInfo) {
        if(course.title === undefined) {
            console.log("Course missing title");
            continue;
        }
        const title = course.title;

        for(const section of course.sections) {
            courseInfoMap.set(section.index, title);
        }
    }

    return courseInfoMap;
}

export {getCourseInfo, fetchCourses};