/// <reference path="typings/jquery/jquery.d.ts"/>
// Two-layout version
$(document).ready(function() {
  
// Breakpoints object - could feed this as argument to function
var breakpoints = {
	col1: "(max-width: 25.75em)",
	col2: "(min-width: 25.8125em)"
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

enquire
  // Col1
  .register(breakpoints.col1, {
    match: function() {
      $feature
        .removeClass(featureClasses.col2, featureClasses.col3, featureClasses.col4)
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
        .removeClass(featureClasses.col1, featureClasses.col3, featureClasses.col4)
        .addClass(featureClasses.col2)
        .tbaSlider();
    },
    unmatch: function () {
    	$feature.destroy();
    	$feature.removeClass(featureClasses.col2);
    	$feature.replaceWith($feature);
    }
  });
});