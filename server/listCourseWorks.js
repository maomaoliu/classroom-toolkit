function listCourseWork(courseId) {
    const topics = listTopics_(courseId);
    topics.push({ topicId: undefined, name: 'No Topic' });
    let groupedCourseWorks = topics.map((topic) => { return { topic: topic, courseWorks: [] } });
    const courseWorks = Classroom.Courses.CourseWork.list(courseId).courseWork;
    courseWorks.forEach((courseWork) => {
        groupedCourseWorks.find(o => o.topic.topicId === courseWork.topicId).courseWorks.push({ id: courseWork.id, title: courseWork.title, state: courseWork.state, alternateLink: courseWork.alternateLink });
    });
    sortGroupedCourseWork_(groupedCourseWorks)
    return groupedCourseWorks;
}

function listTopics_(courseId) {
    const topics = Classroom.Courses.Topics.list(courseId);
    return Object.keys(topics).length === 0 ? [] : topics.topic;
}

function sortGroupedCourseWork_(groupedCourseWorks) {
    groupedCourseWorks.forEach((courseWork) => courseWork.courseWorks.sort((a, b) => judgeDiff_(a.title, b.title)));
    groupedCourseWorks.sort((a, b) => judgeDiff_(a.topic.name, b.topic.name));
}

function judgeDiff_(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}