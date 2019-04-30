$(document).ready(function() {

  /*Libraries*/
  $('.slick-slider').slick({
    autoplay: true,
    dots: true
  });

  /*Main*/
  $('.burger').on('click', function () {
    $(this).toggleClass('active');
    $('.mobile-aside').toggleClass('active');
  });

});
