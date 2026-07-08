const TERMS = {
    SPRING: 1,
    SUMMER: 7,
    FALL: 9
}

const OPEN_COURSES_URL = `https://classes.rutgers.edu/soc/api/openSections.json?year=2026&term=${TERMS.FALL}&campus=NB`;
const COURSE_INFO_URL = `https://classes.rutgers.edu/soc/api/courses.json?year=2026&term=${TERMS.FALL}&campus=NB`;

async function getOpenCourses() {
    const response = await fetch(OPEN_COURSES_URL);
    if(!response.ok) {
        console.log("getOpenCourses() fetch() failed");
        return;
    }

    const openCourses = await response.json();

    return openCourses;
}

async function getCourseInfo() {
    const response = await fetch(COURSE_INFO_URL);
    if(!response.ok) {
        console.log("getCourseInfo() fetch() failed");
        return;
    }

    const courseInfo = await response.json();

    return courseInfo.map(course => ({
            title: course.title,
            courseString: course.courseString,
            sections: course.sections.map(section => ({
                index: section.index,
                number: section.number
            }))
        }));
}

export { getOpenCourses, getCourseInfo };