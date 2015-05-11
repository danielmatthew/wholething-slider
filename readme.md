## tbaslider.v2.3.js

- Implemented destroy() method to stop slider; remove CSS etc.
- Fixed previous and next button navigation
- Prev & next transition now instant
- Added hover-based hide and show for next and prev controls

## slideshow_js-mq-v0.5js

- Uses [enquire.js]("//cdnjs.cloudflare.com/ajax/libs/enquire.js/2.1.2/enquire.min.js") to detect media queries
- Grabs classes to be applied at each column-breakpoint based on data-attributes
- Adds and remove classes based on media queries being fulfilled
- Only activates tbaSlider when criteria are met
- Calls .destroy() method on tbaSlider when media query is no longer matched

## To implement

- Reference [enquire.js](//cdnjs.cloudflare.com/ajax/libs/enquire.js/2.1.2/enquire.min.js") in document head
- Confirm breakpoints in slideshow
- Confirm element to be 'watched'
- Reference slideshow_js at end of template


## To do (if desired)
- [] allow breakpoints to be configured in function argument
- [] allow element to be specified in function argument   