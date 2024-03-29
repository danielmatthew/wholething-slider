/// <reference path="typings/jquery/jquery.d.ts"/>

$(document).ready(function() {
  

// Breakpoints object - could feed this as argument to function
var breakpoints = {
  col1: "(max-width: 25.249em)",
  col2: "(min-width: 25.25em) and (max-width: 50.49em)",
  col3: "(min-width: 50.5em)"
};

// Our DOM element to modify - could feed this as argument to function
var $feature = $('#feature-grid');

// Store the classes to be assigned for each column
var featureClasses = {
  col1: $feature.data('col1'),
  col2: $feature.data('col2'),
  col3: $feature.data('col3'),
  col4: $feature.data('col4')
};

// Clone feature before slider is initialised
var $cloned = $feature.clone();
$cloned.removeClass(featureClasses.col1).addClass(featureClasses.col2);
console.log($cloned);

// Regular expression
var re = /(feature-layout--[A-z]*)/g;

enquire
  // Col1
  .register(breakpoints.col1, {
    match: function() {
      $feature
        .removeClass(featureClasses.col2, featureClasses.col3)
        .addClass(featureClasses.col1);
        
    },
    unmatch: function() {
      $feature.removeClass(featureClasses.col1);
    }
  })
  // Col2
  .register(breakpoints.col2, {
    match: function() {
      $feature
        .removeClass(featureClasses.col1, featureClasses.col3)
        .addClass('feature-layout--grid');
    },
    unmatch: function() {
      $feature.removeClass(featureClasses.col2);
    }
  })
  // Col3
  .register(breakpoints.col3, {
    match: function() {
      $feature
        .removeClass(featureClasses.col1, featureClasses.col2, featureClasses.col4)
        .addClass(featureClasses.col3)
        .removeClass('feature-layout--grid')
        .tbaSlider();
    },
    unmatch: function() {
      $feature.destroy();
      $feature.removeClass(featureClasses.col3);
      $feature.replaceWith($feature);
    }
  });

// Function replaces all classes matching regex with empty string
var replaceClasses = function() {
  $feature.attr('class', function(i, c) {
    return c.replace(re, '');
  });   
};

});