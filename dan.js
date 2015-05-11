/// <reference path="typings/jquery/jquery.d.ts"/>
// Maybe generate breakpoints up here based off Tom's grid system calculations?
// Idea is to use data-attributes to allow author to determine what class is applied
// at a particular breakpoint: so, col1=list col2=grid col3=slideshow
// Calculate those breakpoints?

// var breakpoints = {
//   col2: "25.75em",
//   col3: "50.5em"
// }; 

var breakpoints = {};

var $feature = $('#feature-grid');
var featureClasses = {
  col1: $feature.data('col1'),
  col2: $feature.data('col2'),
  col3: $feature.data('col3'),
  col4: $feature.data('col4'),
};

// Clone feature before slider is initialised
var $cloned = $feature.clone();


enquire
.register("(max-width: 20.74em)", {
  match: function() {
    console.log("Screen is less than", "col1");
    $feature.addClass(featureClasses.col1);
    // $feature.removeClass(featureClasses.col2, featureClasses.col3, featureClasses.col4);    
  },
  unmatch: function() {
    $feature.removeClass(featureClasses.col1);
  }
})

.register("(min-width: 20.75em)", {

  match: function() {
    console.log("Screen is 25.75em", "col2");
    $feature.addClass(featureClasses.col2);
  },

  unmatch: function() {
    $feature.removeClass(featureClasses.col2);
  }
})

.register("(min-width: 50.5em)", {


  match: function() {
    console.log("Screen is 50.5em!", "col3");
    // $feature.removeClass();
    $feature.addClass("feature-layout--slideshow");
    $feature.tbaSlider();
  },

  unmatch: function() {
    $feature.destroy();
    // $feature.replaceWith($cloned).addClass('feature-layout--grid');
    $feature.removeClass(featureClasses.col3);
  }

});