// 列出包含 keyWord 的 classroom
function listClassrooms(keyWord, pageSize) {
  const optionalArgs = {
    pageSize: pageSize
  };
  const response = Classroom.Courses.list(optionalArgs);
  const courses = response.courses;
  return courses.filter((value) => value.name.includes(keyWord));
}