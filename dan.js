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

// Our DOM element to modify
var $feature = $('#feature-grid');

// Store the classes to be assigned for each column
var featureClasses = {
  col1: $feature.data('col1'),
  col2: $feature.data('col2'),
  col3: $feature.data('col3'),
  col4: $feature.data('col4'),
};

// Clone feature before slider is initialised
var $cloned = $feature.clone();

// Regular expression
var re = /(feature-layout--[A-z]*)/g;


enquire
// Col1
.register("(max-width: 20.74em)", {
  match: function() {
    $feature.removeClass(featureClasses.col2, featureClasses.col3);
    $feature.addClass(featureClasses.col1);
  },
  unmatch: function() {
    $feature.removeClass(featureClasses.col1);
  }
})
// Col2
.register("(min-width: 25.25em)", {
  match: function() {
    $feature.removeClass(featureClasses.col1, featureClasses.col3);
    $feature.addClass(featureClasses.col2);
  },
  unmatch: function() {
    $feature.removeClass(featureClasses.col2);
  }
})
// Col3
.register("(min-width: 50.5em)", {
  match: function() {
    console.log('Col3 matched!');
    $feature.removeClass(featureClasses.col1, featureClasses.col2, featureClasses.col4);
    $feature.addClass(featureClasses.col3);
    $feature.tbaSlider();
  },
  unmatch: function() {
    $feature.destroy();
    $feature.replaceWith(this.cloned);
    $feature.removeClass(featureClasses.col3);
  }
});

var replaceClasses = function() {
  $feature.attr('class', function(i, c) {
    return c.replace(re, '');
  });   
};