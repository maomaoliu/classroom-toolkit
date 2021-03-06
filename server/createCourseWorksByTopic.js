function createCourseWorks(courseId, topicName, practiceDueTime, assignmentDueTime) {
    const materials = loadMaterials().filter(material => material.topic === topicName).sort((a, b) => judgeDiff_(b.title, a.title));
    const topicId = getOrCreateTopicId_(courseId, topicName);
    const teacherFolder = getTeacherFolder_(courseId);
    const topicFolder = getOrCreateTopicFolder_(teacherFolder, topicName);
    materials.forEach(material => {
        let dueTime = isPracticeAssignment_(material.title) ? practiceDueTime : assignmentDueTime;
        if (material.materialType === 'material') createMaterial_(material, topicId, courseId);
        if (material.materialType === 'assignment') createAssignment_(material, topicId, courseId, dueTime, topicFolder);
    })
}

function getTeacherFolder_(courseId) {
    const folderId = Classroom.Courses.get(courseId).teacherFolder.id;
    return DriveApp.getFolderById(folderId);
}

function getOrCreateTopicFolder_(teacherFolder, topicName) {
    const subfolders = teacherFolder.getFolders();
    while (subfolders.hasNext()) {
        const folder = subfolders.next();
        if (folder.getName() === topicName) return folder;
    }
    const topicFolder = DriveApp.createFolder(topicName);
    return topicFolder.moveTo(teacherFolder);
}

function getOrCreateTopicId_(courseId, topicName) {
    const topic = listTopics_(courseId).find(t => t.name === topicName);
    if (topic !== undefined) return topic.topicId;
    return Classroom.Courses.Topics.create({ name: topicName }, courseId).topicId;
}

function createMaterial_(material, topicId, courseId) {
    let courseWorkToCreate = {
        title: material.title,
        description: buildDescription_(material.content),
        materials: buildLinkOnlyAttachements_(material.content),
        state: 'PUBLISHED',
        topicId: topicId
    };
    Classroom.Courses.CourseWorkMaterials.create(courseWorkToCreate, courseId);
}

function createAssignment_(material, topicId, courseId, dueTime, topicFolder) {
    const dateObject = new Date(dueTime);
    const attachments = buildAttachements_(material.content, topicFolder);
    const maxPoints = getPoints_(material.title, attachments);
    let courseWorkToCreate = {
        title: material.title,
        description: buildDescription_(material.content),
        materials: attachments,
        state: 'PUBLISHED',
        workType: 'ASSIGNMENT',
        dueDate: buildDueDate_(dateObject),
        dueTime: buildDueTime_(dateObject),
        maxPoints: maxPoints,
        topicId: topicId
    }
    Classroom.Courses.CourseWork.create(courseWorkToCreate, courseId);
}

function getPoints_(title, attachments) {
    if (isPracticeAssignment_(title) && attachments.length === 1) {
        return attachments[0].link !== undefined ? getMaxPoints(getFileIdFromUrl(attachments[0].link.url)) : 1;
    }
    return 1;
}

function buildDueDate_(dueTime) {
    return {
        year: parseInt(dueTime.getUTCFullYear()),
        month: parseInt(dueTime.getUTCMonth() + 1),
        day: parseInt(dueTime.getUTCDate()),
    };
}

function buildDueTime_(dueTime) {
    return {
        hours: parseInt(dueTime.getUTCHours()),
        minutes: parseInt(dueTime.getUTCMinutes()),
        seconds: 0,
        nanos: 0
    };
}

function buildDescription_(content) {
    const description = content.find(each => each.type === 'description');
    return description === undefined ? '' : description.info;
}

function buildLinkOnlyAttachements_(content) {
    const attachmentContents = content.filter(each => each.type !== 'description');
    var copiedAttachments = [];
    attachmentContents.forEach(attachment => {
        copiedAttachments.push(buildLinkAttachment_(attachment.info));
    });
    return copiedAttachments;
}

function buildAttachements_(content, topicFolder) {
    const attachmentContents = content.filter(each => each.type !== 'description');
    var copiedAttachments = [];
    attachmentContents.forEach(attachment => {
        try {
            const file = DriveApp.getFileById(getFileIdFromUrl(attachment.info));
            const fileCopied = file.makeCopy(file.getName(), topicFolder);
            copiedAttachments.push(buildAttachment_(fileCopied, attachment.type));
        } catch (error) {
            copiedAttachments.push(buildLinkAttachment_(attachment.info));
        }
    });
    return copiedAttachments;
}

function buildAttachment_(file, attachmentType) {
    if (attachmentType === 'link') { return buildLinkAttachment_(file.getUrl()) }
    if (attachmentType === 'driveFileViewMode') { return buildDriveFileAttachment_(file.getId(), 'VIEW') }
    if (attachmentType === 'driveFileCopyMode') { return buildDriveFileAttachment_(file.getId(), 'STUDENT_COPY') };
}

function buildLinkAttachment_(url) {
    return {
        link: { url: url }
    };
}

function buildDriveFileAttachment_(fileId, shareMode) {
    return {
        driveFile:
        {
            driveFile: { id: fileId },
            shareMode: shareMode
        }
    };
}

function isPracticeAssignment_(title) {
    return title.includes('?????????');
}

function getFileIdFromUrl(url) {
    const regex = /\/([^\/]+)\/([^\/]+)$/g; // .../../{id}/...
    const found = url.match(regex);
    return found === null ? url : found[0].substr(1, found[0].lastIndexOf('/') - 1);
}


function testCreateCourseWorks() {
    const courseId = '225663248186';
    const topicName = '1 ????????????';
    createCourseWorks(courseId, topicName, "2021-06-12T19:30", "2021-06-14T23:59");
}