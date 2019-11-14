$(document).ready(function(){
  changeBackground();
});

function changeBackground() {
  var appID = "9c89b71b1f64592d8c158c4e09c3b76207d2c066b97cb231396dbff515e7aec7";
    // var url = 'https://api.unsplash.com/photos/random?client_id='+pappID;
    // var url = "https://api.unsplash.com/search/photos?page=1&query=office&client_id="+appID;

var count = 475,     // for nature tag
    tag = "dark",
    randomPage = Math.floor(Math.random() * parseInt(count/11)),
    randomImageInPage = Math.floor(Math.random() * (11)),
    url = 'https://api.unsplash.com/search/photos?page='+randomPage+'&query='+tag+'&client_id='+appID;

    $.getJSON(url,function (data) {
      if (data !== undefined) {
        var backgroundImage = data.results[randomImageInPage].urls.full;
        console.log(backgroundImage);
        $('body').css('background-image', 'url(' + backgroundImage + ')');
      }

    })
}
