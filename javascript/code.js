function doGet() {
  return HtmlService
      .createTemplateFromFile('index')
      .evaluate();
  // return HtmlService.createHtmlOutputFromFile('index');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}