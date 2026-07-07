const TERMS = {
    SPRING: 1,
    SUMMER: 7,
    FALL: 9
}

const OPEN_COURSES_URL = `https://classes.rutgers.edu/soc/api/openSections.json?year=2026&term=${TERMS.FALL}&campus=NB`;
const COURSE_INFO_URL = `https://classes.rutgers.edu/soc/api/courses.json?year=2026&term=${TERMS.FALL}&campus=NB`;

async function fetchCourses() {
    const response = await fetch(OPEN_COURSES_URL);
    if(!response.ok) {
        console.log("fetchCourses() fetch() failed");
        // process.exit(0);
    }

    let openCourses = await response.json();
    // openCourses = openCourses.map((course) => parseInt(course));

    // sort openCourses

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