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

function importFormScoreToClassroom(courseId, courseWorkId, formId) {
    var form = FormApp.openById(formId);
    var emailAndScores = getQuizScore_(form);
    var studentIdAndEmails = getStudentsInfo_(courseId);
    var submissions = getSubmissions_(courseId, courseWorkId);

    for (var i = 0; i < submissions.length; i++) {
        var email = findObjectFromList(studentIdAndEmails, 'id', submissions[i].userId).email;
        var emailAndScore = findObjectFromList(emailAndScores, 'email', email);
        if (emailAndScore !== undefined) {
            var score = emailAndScore.score;
            var submission = { draftGrade: score };
            var response = Classroom.Courses.CourseWork.StudentSubmissions.patch(submission, courseId, courseWorkId, submissions[i].id, { updateMask: "draftGrade" });
            Logger.log(response);
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
    return emailAndScores;
  }
  
  function getStudentsInfo_(courseId) {
    var students = Classroom.Courses.Students.list(courseId).students;
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
    Logger.log(submissions);
    return submissions;
  }