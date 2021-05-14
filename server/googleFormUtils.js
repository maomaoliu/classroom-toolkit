function getMaxPoints(formId) {
    var form = FormApp.openById(formId);
    const items = form.getItems();
    const point = items.reduce((totalPoints, item) => {
        if (item.getType() === FormApp.ItemType.CHECKBOX) {
            return item.asCheckboxItem().getPoints() + totalPoints;
        } else if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
            return item.asMultipleChoiceItem().getPoints() + totalPoints;
        } else { return totalPoints; }
    }, 0);
    return point;
}

function importFormScoreToClassroom(courseId, courseWorkId, form, students) {
    var emailAndScores = getQuizScore_(form);
    var studentIdAndEmails = getStudentsInfo_(students);
    var submissions = getSubmissions_(courseId, courseWorkId);

    for (var i = 0; i < submissions.length; i++) {
        var email = findObjectFromList_(studentIdAndEmails, 'id', submissions[i].userId).email;
        var emailAndScore = findObjectFromList_(emailAndScores, 'email', email);
        if (emailAndScore !== undefined) {
            var score = emailAndScore.score;
            var submission = { draftGrade: score };
            Classroom.Courses.CourseWork.StudentSubmissions.patch(submission, courseId, courseWorkId, submissions[i].id, { updateMask: "draftGrade" });
        }
    }
}

function getQuizScore_(form) {
    var emailAndScores = [];
    var formResponses = form.getResponses();
    for (var i = 0; i < formResponses.length; i++) {
        var formResponse = formResponses[i];
        var itemResponses = formResponse.getGradableItemResponses();
        var score = 0;
        for (var j = 0; j < itemResponses.length; j++) {
            var itemResponse = itemResponses[j];
            score += itemResponse.getScore();
        }
        emailAndScores.push({ email: formResponse.getRespondentEmail(), score: score });
    }
    return emailAndScores.reverse();
}

function getStudentsInfo_(students) {
    var studentIdAndEmails = [];
    for (var i = 0; i < students.length; i++) {
        studentIdAndEmails.push({ id: students[i].userId, email: students[i].profile.emailAddress });
    }
    return studentIdAndEmails;
}

function getSubmissions_(courseId, courseWorkId) {
    var studentSubmissions = Classroom.Courses.CourseWork.StudentSubmissions.list(courseId, courseWorkId).studentSubmissions;
    var submissions = [];
    for (var i = 0; i < studentSubmissions.length; i++) {
        submissions.push({ id: studentSubmissions[i].id, userId: studentSubmissions[i].userId });
    }
    return submissions;
}

function findObjectFromList_(list, keyName, value) {
    return list.find(o => o[keyName] === value);
}