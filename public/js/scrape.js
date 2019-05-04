
//   When click the scrape button
//$('#scrape').click( function () {

  //  var currentURL = window.location.origin;
    
  //  window.location = currentURL + "/scrape/";
  //});

 
//Click to scrape
$(document).on("click", ".scrape", function(){
  $(".load").html("<img id='wait' src='./img/loading.gif'>");
  $.get( "/scrape", function (req, res) {
      console.log(res);
  }).then(function(data) {
      window.location.href = "/";
  });
});

$(document).on("click", ".home", function(){
  $.get( "/", function (req, res) {
      console.log(res);
  }).then(function(data) {
      window.location.href = "/";
  });
});