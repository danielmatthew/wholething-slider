//Query
(function () {

    var MediaQuery = window.MediaQuery = function (selector) {
        if (!(this instanceof MediaQuery)) {
            return new MediaQuery(selector);
        }

        this.el = $(selector);

        if (!this.el.length) {
            console.log("Can't find the element: " + selector);
        }

        this.$win = $(window);
        this.grid = GridSystem();

        this.assign();
        this.bind();
        this.run();
    };

    MediaQuery.prototype = {
        bind: function () {
            this.$win.on('resize', $.proxy(this.run, this));
        },

        assign: function () {
            this.breakPoints = [];
            this.classList = '';

            for (var x = 1; x < this.grid.colWidths.length; x++) {
                var className = this.el.data('col' + x) || '';

                this.breakPoints.push({
                    col: x,
                    width: this.grid.colWidths[x],
                    class: className
                });

                this.classList += className + ' ';
            }
        },

        run: function () {
            var width = this.$win.width(),
                breakPoint = 0;

            for (var x = 0; x < this.breakPoints.length; x++) {
               if (this.breakPoints[x].width < width) {
                 breakPoint = this.breakPoints[x];
               }
            }


           if (breakPoint === 0 || breakPoint === 'undefined') {
             breakPoint = this.breakPoints[0];
           }

            if (this.el.hasClass(breakPoint.class)) { return true; }
            this.el.removeClass(this.classList).addClass(breakPoint.class);

        }

    };


})();


//Grid system
(function () {
    var GridSystem = window.GridSystem = function (colCount) {
        if (!(this instanceof GridSystem)) {
            return new GridSystem();
        }

        // Usual size of 1em in pixels
        this.base_size = 16;
        // Design based on four columns - each 23.75em (412px)
        this.col = 23.75;
        this.gutter = this.base_size;
        this.colCount = colCount || 4;
        this.colWidth = (this.col * this.base_size); // 412px

        this.colWidths = this.calcCols();
    };

    GridSystem.prototype = {
        calcCols: function () {
            var widths = [];
            for (var x = 1; x <= this.colCount; x++) {
                widths[x] = this.calcCol(x);
            }
            return widths;
        },
        calcCol: function (col) {
            var gutterWidth = (this.gutter * col) + this.gutter;

            return (this.colWidth * col) + gutterWidth;
        }
    };
})();



// STICKY NAV
(function () {
    var Sticky = window.Sticky = function (selector, classes) {
        if (!(this instanceof Sticky)) {
            return new Sticky(selector, classes);
        }
        this.el = $(selector);

        if (!this.el.length) {
            throw new Error("Can't find the element: " + selector);
        }

        this.classes = classes || {
            stuck: "screen__nav-top--stuck",
            sticky: "screen__nav-top--sticky"
        };
        this.$win = $(window);

        this.el_offset_top = this.el.offset().top;

        this.bind();
        this.run();

    };

    Sticky.prototype = {
        bind: function () {
            this.$win.on('scroll', $.proxy(this.run, this));
        },
        run: function () {
            var scroll_top = this.$win.scrollTop();
            if (scroll_top > this.el_offset_top) {
                this.el.removeClass(this.classes.sticky).addClass(this.classes.stuck);
            } else {
                this.el.removeClass(this.classes.stuck).addClass(this.classes.sticky);
            }
        }
    };
})();

// TOGGLES BURGER AND RESETS ON RESIZE
(function () {
    var magic_number = 809,
        burger_el = null,
        menu_el = null,
        $window = null;

    function bind() {
        burger_el = $("#burger"),
            menu_el = $("#menu"),
            $window = $(window);

        burger_el.on("click", menu_el.toggle);
        $window.on('resize', run);
    }

    function run() {
        if ($window.width() >= magic_number) {
            if (menu_el.css("display") == "block") {
                menu_el.css("display", "table");
            }
        } else {
            menu_el.attr("style", "");
        }
    }

    window.Burger = function () {
        bind();
        run();
    };
})();

$(document).ready(function() {
    $("#burger").click(function () {
        $("#menu").toggle();
    });
});

$(window).load(function () {
    var burger = Burger();


    var nav = Sticky("#sticky_navigation");


    var slideshowQuery = MediaQuery('#feature-slideshow');
    var gridQuery = MediaQuery('#feature-grid');
});
