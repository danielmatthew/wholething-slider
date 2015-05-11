/*
 * tbaSlider - Version 2.0
 * June 14, 2012 - Developed structure with much of the functionality not working.
 *                 Further functionaly to be added in later versions.
 *
 * Sept 12, 2013 - Added coins, numbers, play, pause, next, and previous functionality.
 *
 * This jQuery plugin and its content is copyright of Wholething Ltd,
 * 5 Jupiter House, Calleva Park, Aldermaston, Reading, Berkshire, RG7 8NN
 * Â© Wholething Ltd 2012. All rights reserved.
 *
 * Any redistribution or reproduction of part or all of the contents in
 * any form is prohibited.
 *
 * http://www.wholething.co.uk/
 */

// A standard jQuery plugin, http://docs.jquery.com/Plugins/Authoring
// designed and coded by Todd B Adams  http://www.toddbadams.co.uk/
(function ($) {

  var methods = {
    init: function () {
      // store this object
      var self = this;


      // merge data attributes with defaults
      self.settings = $.extend({
        'transition': 'fade',               // fade
        'speed': 3000,                      // Slide transition speed (milliseconds)
        'delay': 5000,                      // length of time a slide shows (milliseconds)
        'startSlide': 0,                    // starting Slide (0 index, -1 for random)
        'autoStart': true,                  // start the slideshow in play mode
        'playButtonLabel':
          '<span class="play">&nbsp;</span>',   // label for the play button
        'pauseButtonLabel':
          '<span class="pause">&nbsp;</span>', // label for the pause button
        'showCoins': false,                 // show coins (boxes, or circles) for navigation
        'showNumbers': false,               // show numbers (boxes, or circles) for navigation
        'showNextPrev': false,              // Next & Prev navigation (true, false)
        'showPlayPause': false,             // play/pause navigation (true, false)
        'childElement': '.feature-layout__item',      // the dom element that is a slide of our slideshow
        'titleDescriptionElement': 'dl.title_description', // title and description selector
        'titleDescriptionInDelay': 0,    // delay from start of image transition in to title/description transition
        'titleDescriptionInSpeed': 500,     // speed of title/description transition in
        'titleDescriptionOutDelay': 0,      // delay from start of image transition out to title/description transition
        'titleDescriptionOutSpeed': 500,    // speed of title/description transition out
        'titleDescriptionTransition': 'fade'// type of title/description transition
      }, {
        'speed': self.attr("data-speed"),
        'delay': self.attr("data-delay"),
        'startSlide': self.attr("data-startSlide"),
        'autoStart': self.attr("data-autoStart"),
        'showCoins': self.attr("data-showCoins"),
        'showNumbers': self.attr("data-showNumbers"),
        'showNextPrev': self.attr("data-showNextPrev"),
        'showPlayPause': self.attr("data-showPlayPause"),
        'titleDescriptionInDelay': self.attr("data-titleDescriptionInDelay"),
        'titleDescriptionInSpeed': self.attr("data-titleDescriptionInSpeed"),
        'titleDescriptionOutDelay': self.attr("data-titleDescriptionOutDelay"),
        'titleDescriptionOutSpeed': self.attr("data-titleDescriptionOutSpeed"),
        'titleDescriptionTransition': self.attr("data-titleDescriptionTransition")
      });

      // initialize
      self.init = function () {
        // flag to indicate in transistion between slides
        self.inTransistion = false;

        // find slide elements
        self.$slides = self.find(self.settings.childElement);

        // find slide titles
        self.$titles = self.find(self.settings.titleDescriptionElement);

        // find the content wrapper
        self.$content = self.find('.feature-layout__group');

        // define the current slide number
        // current slide (-1 indicates random start)
        var index = self.settings.startSlide == -1 ?
          Math.floor(Math.random() * (1 + self.$slides.length)) :
          self.settings.startSlide;
        if (index < 0) index = 0;
        if (index >= self.$slides.length) index = self.$slides.length - 1;
        self.currentSlide = index;

        // initialize each slide
        self.initSlides();

        // initialize each title
        self.initTitles();

        // initialize all of the controls
        self.initControls();

        // handle links click (could be coin, thumb, or number)
        self.initLinks();

        // if auto start is set, run the play function
        if (self.settings.autoStart == true) self.play();
      };

      // Initialize the slides
      self.initSlides = function () {
        self.$slides.each(function (index, el) {
          // place the element in the zIndex (current 3, everything else 1)
          var zIndex = self.currentSlide == index ? 3 : 1;
          // determin display (currrent 'inline', everything else is 'none')
          var display = self.currentSlide == index ? 'inline' : 'none';
          $(el).css('z-index', zIndex).css('display', display);
        });
      };

      // Initialize the slide titles
      self.initTitles = function () {
        self.$titles.each(function (index, el) {
          // determin display (currrent 'block', everything else is 'none')
          var display = self.currentSlide == index ? 'block' : 'none';
          $(el).css('display', display);
        });
      };

      // Initialize the link clicks
      self.initLinks = function () {
        if (self.$links != undefined) {
          self.$links.click(function (e) {
            self.stop();
            //We have clicked a link, that means we want to instantly switch the slide, pass in 'true'
            self.GoToSlide($(this).data('index'), true);
          });
        }
      };

      // initialize controls
      self.initControls = function () {
        // find the controls dom element
        self.$content.append('<div class="controls"></div>');
        self.$controls = self.find('div.controls');

        // if all controls are not shown then hide
        if (!self.settings.showCoins &&
          !self.settings.showNextPrev &&
          !self.settings.showNumbers &&
          !self.settings.showPlayPause &&
          !self.settings.showThumbs) {
          $(self.$controls).remove();
        }
        // initialize coins, thumbs, numbers, next/prev, play/pause
        self.initCoins();
        self.initNumbers();
        self.initPlayPause();
        self.initNextPrev();

        // hover to view controls only if we are a no-touch device
        if ($('html').hasClass('no-touch')) {
          $(self.$content).mouseenter(function () {
            if (self.$controls != undefined) self.$controls.fadeIn('fast');
            if (self.$nextPrev != undefined) self.$nextPrev.fadeIn('fast');
          });
          $(self.$content).mouseleave(function () {
            if (self.$controls != undefined) self.$controls.fadeOut('fast');
            if (self.$nextPrev != undefined) self.$nextPrev.fadeOut('fast');
          });

          if (self.$controls != undefined) self.$controls.fadeOut('fast');
          if (self.$nextPrev != undefined) self.$nextPrev.fadeOut('fast');
        }
      };

      // initialize Coins
      self.initCoins = function () {
        // check to see this feature is enabled
        if (!self.settings.showCoins) return;

        var html = "";
        self.$slides.each(function (index, el) {
          // if index is starting slide make the li active
          var cssClass = 'coin' + (self.currentSlide == index ? ' active' : '');
          html += '<li class="' + cssClass + '" data-index="' + index + '">&nbsp;</li>';
        });
        self.$controls.append('<ul class="coins">' + html + '</ul>');
        // create array of links (used later to get click event)
        self.$links = self.find('li.coin');
      };

      // initialize Numbers
      self.initNumbers = function () {
        // check to see this feature is enabled
        if (!self.settings.showNumbers) return;

        var html = "";
        self.$slides.each(function (index, el) {
          // if index is starting slide make the li active
          var cssClass = 'number' + (self.currentSlide == index ? ' active' : '');
          html += '<li class="' + cssClass + '" data-index="' + index + '">' + (index + 1) + '</li>';
        });
        self.$controls.append('<ul class="numbers">' + html + '</ul>');
        // create array of links (used later to get click event)
        self.$links = self.find('li.number');
      };

      // initialize Numbers
      self.initPlayPause = function () {
        // play status
        self.isPlaying = false;

        // check to see this feature is enabled
        if (!self.settings.showPlayPause) return;

        var html = "";
        self.$slides.each(function (index, el) {
          // if index is starting slide make the li active
          var cssClass = 'number' + (self.currentSlide == index ? ' active' : '');
          html += '<li class="' + cssClass + '" data-index="' + index + '">' + (index + 1) + '</li>';
        });
        var label = self.settings.autoStart ? self.settings.pauseButtonLabel : self.settings.playButtonLabel;
        self.$controls.append('<button class="playpause">' + label + '</button>');
        // create array of links (used later to get click event)
        self.$playPauseBtn = self.find('.playpause');
        // click
        self.$playPauseBtn.click(function (e) {
          if ($(this).html() == self.settings.pauseButtonLabel) {
            self.stop();
          } else {
            self.play();
          }
        });
      };

      // initialize next previous
      self.initNextPrev = function () {
        // ensure we have enabled this feature
        if (!self.settings.showNextPrev) return;

        var html = '<div class="next-prev"><div class="next" ></div><div class="prev" ></div></div>';
        self.$content.append(html);
        self.$nextPrev = self.find('.next-prev');
        self.$next = self.find('.next-prev .next');
        self.$next.click(function () {
          self.stop();
          self.GoToSlide(self.nextSlideNumber());
        });
        self.$prev = self.find('.next-prev .next');
        self.$prev.click(function () {
          self.stop();
          self.GoToSlide(self.prevSlideNumber());
        });
      };

      // determine next slide number
      self.nextSlideNumber = function () {
        return (self.currentSlide < self.$slides.length - 1) ? self.currentSlide + 1 : 0;
      };

      // determine previous slide number
      self.prevSlideNumber = function () {
        return (self.currentSlide > 0) ? self.currentSlide - 1 : self.$slides.length;
      };

      // perform a simple cross fade
      self.fadeGotoSlide = function (index, disableTransition) {
        if (self.inTransistion) return;
        // indicate we are in transition
        self.inTransistion = true;
        // make the next image second from top
        $(self.$slides[index]).css('z-index', 2).css('display', 'list-item');

        //Check if the animation has been disabled, if so we switch the slide instantly and exit
        if (disableTransition) {
          self.handleSlide(index);
          return true;
        }

        $(self.$slides[self.currentSlide])
          .fadeOut(self.settings.speed, function () {
            self.handleSlide(index);
          });
      };

      /**
       * Handle the actual sliding. This should be wrapped in the appropriate animation function
       * (fadeIn/Out etc) or can be called standalone if you do not want an animation to occur.
       * @param index
       */
      self.handleSlide = function (index) {
        // if we have coins remove the active from current coin
        if (self.$links != undefined) $(self.$links[self.currentSlide]).removeClass('active');
        // hide the title for current slide
        $(self.$titles[self.currentSlide]).hide();

        // move the current slide to the bottom
        $(self.$slides[self.currentSlide]).css('z-index', 1);
        // set current slide to what was the next slide
        self.currentSlide = index;
        // make coin/image/number active
        if (self.$links != undefined) $(self.$links[self.currentSlide]).addClass('active');
        // transition of title/description
        $(self.$titles[index])
          .delay(self.settings.titleDescriptionInDelay)
          .fadeIn(self.settings.titleDescriptionInSpeed);

        self.inTransistion = false;

        // make the current image the top one
        $(self.$slides[self.currentSlide]).css('z-index', 3).css('display', 'list-item');
      };

      // go to slide by index
      // optionally pass a boolean to disable the transition effect
      self.GoToSlide = function (index, disableTransition) {
        switch (self.settings.transition) {
          case 'fade':
            self.fadeGotoSlide(index, disableTransition);
            break;
          default:
            // todo: add more transistions
            self.fadeGotoSlide(index, disableTransition);
        }
      };

      // play next slide and loop while isPlaying is true
      self.loopToNext = function () {
        setTimeout(function () {
          if (self.isPlaying) {
            self.GoToSlide(self.nextSlideNumber());
            self.loopToNext();
          }
        }, self.settings.delay);
      };

      // Play
      self.play = function () {
        // set a flag indicating the slide show is now playing
        self.isPlaying = true;

        // set the text of the play button to pause
        if (self.settings.showPlayPause) {
          self.$playPauseBtn
            .html(self.settings.pauseButtonLabel);
        }

        // loop and play
        self.loopToNext();
      };

      // Stop
      self.stop = function () {
        // set a flag indicating the slide show is not playing
        self.isPlaying = false;

        // set the text of the play button to pause
        if (self.settings.showPlayPause) {
          self.$playPauseBtn
            .html(self.settings.playButtonLabel);
        }
      };

      // Destroy
      self.destroy = function() {
        // Stop slider
        self.isPlaying = false;
        // Remove inline styles
        self.$slides.removeAttr('style');
        if (self.inTransistion = true) {
          self.$slides.css({'display': 'block', 'z-index': '1'});
        }
        
      };

      // init
      self.init();
    }
  };

  $.fn.tbaSlider = function (method) {
    // Method calling logic
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.tbaSlider');
    }
  };
})(jQuery);

// On document read
$(document).ready(function () {
  /* find all layout--slideshow */
  // $('.feature-layout--slideshow').tbaSlider();
});

