// 列出包含 keyWord 的 classroom
function listClassrooms(keyWord, pageSize) {
  var optionalArgs = {
    pageSize: pageSize
  };
  var response = Classroom.Courses.list(optionalArgs);
  var courses = response.courses;
  return courses.filter((value) => value.name.includes(keyWord));
}