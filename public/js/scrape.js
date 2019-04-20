
//   When click the scrape button
$('#scrape').click( function () {

    var currentURL = window.location.origin;
    
    window.location = currentURL + "/scrape/";
  });