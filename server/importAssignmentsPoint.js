function importPointsByTopic(courseId, topicId) {
    const courseWorks = toArray_(Classroom.Courses.CourseWork.list(courseId).courseWork)
        .filter((courseWork) => courseWork.topicId === topicId);
    importPointsByCourseWorks(courseId, courseWorks);
}

function importPointsByCourseWorks(courseId, courseWorks) {
    const formFiles = getFormsUnderTeacherFolder(courseId);
    courseWorks
        .filter(courseWork => courseWork.materials.length === 1 && courseWork.materials[0].form !== undefined)
        .forEach((courseWork) => {
            const publishedUrl = courseWork.materials[0].form.formUrl;
            const formFile = formFiles.find(file => file.getPublishedUrl() === publishedUrl);
            if (formFile !== undefined) importFormScoreToClassroom(courseId, courseWork.id, formFile);
        });
}

function getFormsUnderTeacherFolder(courseId) {
    const formMimeType = 'application/vnd.google-apps.form';
    const teacherFolder = Classroom.Courses.get(courseId).teacherFolder;
    return listUnderFolder(DriveApp.getFolderById(teacherFolder.id), formMimeType);
}

function listUnderFolder(folder, mimeType) {
    let targetFiles = [];
    const files = folder.getFiles();
    while (files.hasNext()) {
        const file = files.next();
        console.log("%s: type: %s", file, file.getMimeType());
        if (file.getMimeType() === mimeType) {
          console.log('RIGHT FORM');
          targetFiles.push(FormApp.openById(file.getId()));
        };
    }
    var folders = folder.getFolders();
    while (folders.hasNext()) {
        targetFiles = targetFiles.concat(listUnderFolder(folders.next(), mimeType));
    }
    return targetFiles;
}

function testImportPointsByTopic() {
    const courseId = '327809079990';
    const courseWorkId = '337331498440';
    const courseWork = Classroom.Courses.CourseWork.get(courseId, courseWorkId);
    Logger.log(importPointsByCourseWorks(courseId, [courseWork]));
}