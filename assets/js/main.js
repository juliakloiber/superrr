/**
 * Author: CReich
 * Company: Rainbow Unicorn
 * Date: 14.06.2017
 * Created: 15:16
 **/
(function(window){

    Controller.prototype.constructor = Controller;
    Controller.prototype = {

    };

    var ref, $, $header, $headerSpacer, $headerWrap, $html, $body, $mainNav, $pageWrap, $navToggle, lastScrollTop, $logo, $scrollHint, $scrollHintWrap, $logoInner,
        superrrTimeline, isFrontPage, sm_controller, sm_scene, initialized, $naviagtionLeftWrap, $naviagtionLeftVictims, $naviToggle, batchBlock;
    function Controller(jQuery){

        $ = jQuery;
        ref = this;
        lastScrollTop = 0;

        Logger.useDefaults();
        Logger.setLevel(Logger.OFF);

        var browser = ref.getBrowser();
        var name = browser.name.toLowerCase();
        if(ref.isMobileDevice()) {
            name+="-mobile";
        }
        $('body').addClass(name).addClass('version-' + browser.version.toLowerCase());

    };

    Controller.prototype.init = function(){

        isFrontPage = window.is_front_page;

        Logger.log("Startup page.");
        Logger.log("isFrontPage -> " + isFrontPage);
        Logger.log("header spacer -> " + $('.header-spacer').length);


        $html = $('html');
        $body = $('body');
        $headerWrap = $('.header-wrap');
        $header = $('.header');
        $headerSpacer = $('.header-spacer');
        $logo = $('.logo');
        $logoInner = $('.logo-inner');
        $mainNav = $('.main-nav');
        $scrollHintWrap = $('.scroll-hint-wrap');
        $scrollHint = $('.scroll-hint');
        $pageWrap = $('.page-wrap');
        $naviToggle = $('.navigation-left-open-wrap');

        $navToggle = $('.nav-toggle');
        $navToggle.click(function(e){
            e.preventDefault();
            ref.toggleMenu();
        });

        $('.blog-post').fitVids();

        if(ref.viewport().width >= 1024){
            $(".sticky").stickr({
                duration: 0,
                offsetTop: 30,
                offsetBottom: 30
            });
        }

        $('.fade-in').viewportChecker({
            classToAdd: 'animated fadeInUp',
            offset: 100
        });

        if(!initialized) ref.addEventHandlers();
        ref.setupSuperrrAnimation();
        ref.initBatches();
        ref.resize();

        var $block1 = $logoInner.find('.block1');
        if($block1.length > 0){
            var $block1_txt_array = $block1.text().split('');
            $block1.empty();
            for(var a=0; a< $block1_txt_array.length; ++a){
                var char = $block1_txt_array[a];
                $block1.html($block1.html()+'<span>' + char + '</span>');
            }
        }


        var $block2 = $logoInner.find('.block2');

        if($block2.length > 0){
            var $block2_txt_array = $block2.text().split('');
            $block2.empty();
            for(a=0; a< $block2_txt_array.length; ++a){
                char = $block2_txt_array[a];
                $block2.html($block2.html()+'<span>' + char + '</span>');
            }
        }

        var $spansblock1 = $($block1.find('span'));
        var $spansblock2 = $($block2.find('span'));
        var timeline = new TimelineMax({delay:0, paused:false})
            .to($body, 0.5, {opacity:1, ease:Sine.easeOut})
            .staggerFrom($spansblock1, 0.05, {delay:.25,opacity:0, ease:Sine.easeIn}, .25)
            .staggerFrom($spansblock2, 0.05, {delay:.25, opacity:0, ease:Sine.easeIn}, .25);

        $naviagtionLeftWrap = $('.navigation-left-wrap');
        $naviagtionLeftVictims = $('.navigation-left-victim');
        $('.nav-close-btn').click(function(){
            ref.closeLeftNavigation();
        });
        $('.navigation-left-open-wrap').click(function(){
            if(!$naviagtionLeftWrap.hasClass('open')){
                ref.openLeftNavigation();
            } else {
                ref.closeLeftNavigation();
            }
        });

        // Save and restore `scrollLeft`.
        window.onpageshow = (event) => {
            document.querySelectorAll(".card-holder").forEach((cardHolder) => {
                var key = cardHolder.dataset.category + "-scrollLeft";

                cardHolder.scrollLeft = localStorage.getItem(key);

                Logger.log("cardHolder.scrollLeft -> " + cardHolder.scrollLeft);

                var current = parseInt(cardHolder.scrollLeft/$('.card').width());
                $('.cards-navigation').find('.card-dot').eq(current).addClass('active');

                // Save scrollLeft.
                cardHolder.onscroll = (event) => {
                    localStorage.setItem(key, cardHolder.scrollLeft)
                }
            })
        }
        document.querySelectorAll(".card-holder").forEach((cardHolder) => {
            // Scroll cards into view.

            cardHolder.querySelectorAll('.card').forEach((card) => {
                card.onclick = (event) => {
                    ref.nextCard(cardHolder, card);
                    return false
                }

            })
        });

        $('.batch-inner.support').mouseover(function() {
            if(batchBlock) return;
            batchBlock = true;
            TweenMax.to($(this).find('.svg-hover'), 1.5, {rotation:"+=360", transformOrigin:"50% 50%", onComplete: ref.onBatchRotate });
        }).mouseout(function() {

        });

        if($('html').hasClass('touch')) {
            Logger.log("Add swipe events....");
            document.addEventListener('swiped-left', function(e) {
                if($naviagtionLeftWrap.hasClass('open')){
                    ref.closeLeftNavigation();
                }
            });
        }

        initialized = true;

    };

    Controller.prototype.onBatchRotate = function(){
        batchBlock = false;
    }

    Controller.prototype.nextCard = function(cardHolder, card){
        var targetOffset = card.offsetLeft - cardHolder.childNodes[1].offsetLeft
        var currentOffset = cardHolder.scrollLeft;
        var current = parseInt(cardHolder.scrollLeft/$('.card').width());
        $('.cards-navigation').find('.card-dot').each(function(){
            $(this).removeClass('active');
        });
        $('.cards-navigation').find('.card-dot').eq(current).addClass('active');

        var rect = card.getBoundingClientRect()

        if (0 <= rect.left && rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
            return true
        }

        Logger.log("cardHolder? ", cardHolder);

        cardHolder.scrollTo({
            top: 0,
            left: targetOffset,
            behavior: "smooth"
        })

    }

    Controller.prototype.openLeftNavigation = function(){
        //open navigation
        $naviagtionLeftWrap.addClass('animated open');
        $naviagtionLeftVictims.addClass('nav-open');
    }

    Controller.prototype.closeLeftNavigation = function(){
        //close navigation
        $naviagtionLeftWrap.removeClass('open');
        $naviagtionLeftVictims.removeClass('nav-open');
    }

    /*********************
     mobile menu toggle
     *********************/
    Controller.prototype.setupSuperrrAnimation = function(){

        //the header ticker
        sm_controller = new ScrollMagic.Controller();
        superrrTimeline = new TimelineMax({delay:0})
            .set($header, {height: '12vh', backgroundPosition: '0% 0%'})
            .set($logo, {fontSize: ref.getTargetFontsize()})
            .fromTo($header, 1, {backgroundPosition: '0% 0%', ease:Sine.easeInOut}, {backgroundPosition: '0% 100%', ease:Sine.easeInOut},'transform')
            .addPause();


        var h = ref.viewport().height - $header.height();
        $('.navigation-left-wrap-inner').height(h);


        sm_scene = new ScrollMagic.Scene({triggerElement: "body", triggerHook: 'onLeave', duration: $('body').height(), offset: 0})
            .setTween(superrrTimeline)
            //.addIndicators({name: "#trigger"}) // add indicators (requires plugin)
            .addTo(sm_controller);



        //backgrounds
        $('.background-image').each(function(){

            var sm_bg_controller = new ScrollMagic.Controller();
            var timeline = new TimelineMax({delay:0})
                .set($(this), {backgroundPosition: '0% 0%'})
                .to($(this), 5, {backgroundPosition: '0% 50%'},'transform')
                .addPause();
            var sm_bg_scene = new ScrollMagic.Scene({triggerElement: $(this)[0], triggerHook: 'onEnter', duration: '100%', offset: 0})
                .setTween(timeline)
                //.addIndicators({name: "#trigger"}) // add indicators (requires plugin)
                .addTo(sm_bg_controller);
        });

        var $bgFooter = $('.background-image-footer');
        var sm_bgf_controller = new ScrollMagic.Controller();
        var timeline = new TimelineMax({delay:0})
            .set($bgFooter, {backgroundPosition: '0% 0%'})
            .to($bgFooter, 3, {backgroundPosition: '0% 100%'},'transform')
            .addPause();
        var sm_bgf_scene = new ScrollMagic.Scene({triggerElement: $bgFooter[0], triggerHook: 'onEnter', duration: '100%'})
            .setTween(timeline)
            //.addIndicators({name: "#trigger"}) // add indicators (requires plugin)
            .addTo(sm_bgf_controller);

    };

    Controller.prototype.setHeaderAnimation = function(){

        Logger.log("setHeaderAnimation -> " + hasLargeHeader);

        if(hasLargeHeader){

            var fs = '19vw';
            if($('.header').hasClass('fellows')){
                fs = '12vw';
            }
            if(superrrTimeline){
                Logger.log("KILL superrrTimeline -> " + superrrTimeline);
                superrrTimeline.kill();
            }

            //header animation only on frontpage
            sm_controller = new ScrollMagic.Controller();
            superrrTimeline = new TimelineMax({delay:0})
                .set($headerWrap, {className:'+=no-cursor'})
                .set($logo, {className:'+=no-events'})
                .fromTo($header, 8, {height: '100vh', backgroundPosition: '0% 0%'},{height: '12vh', backgroundPosition: '0% 100%'},'transform')
                .fromTo($headerSpacer, 8, {height: '100vh'}, {height: '12vh'},'transform')
                .fromTo($scrollHintWrap, 8, {height: '100vh'}, {height: '0vh'},'transform')
                .fromTo($logo, 8, {fontSize: fs, top:'40%'}, {fontSize: ref.getTargetFontsize(), top:'50%'},'transform')
                .fromTo($logoInner, 8, {skewX: ref.getTargetSkew(), scaleY: ref.getFontScale(), paddingLeft:ref.getPaddingLeft(), ease:Sine.easeOut}, {skewX: -15, scaleY: 1, paddingLeft:'2vw', ease:Sine.easeOut},'transform')
                .set($logo, {className:'-=no-events'})
                .set($headerWrap, {className:'+=no-cursor'})
                .addPause();

            sm_scene = new ScrollMagic.Scene({triggerElement: "#trigger", triggerHook: 'onLeave', duration: '100%', offset: 0})
                .setTween(superrrTimeline)
                //.addIndicators({name: "#trigger"}) // add indicators (requires plugin)
                .addTo(sm_controller);
        }
    };

    Controller.prototype.getTargetSkew = function(){
        if(ref.viewport().width < 414){
            return -10;
        } else if(ref.viewport().width >= 414 && ref.viewport().width < 768) {
            return -8;
        } else if(ref.viewport().width >= 768 && ref.viewport().width < 1024) {
            return -8;
        } else if(ref.viewport().width >= 1024 && ref.viewport().width < 1200) {
            return -8;
        } else if(ref.viewport().width >= 1200 && ref.viewport().width < 1400) {
            return -15;
        } else if(ref.viewport().width >= 1400 && ref.viewport().width < 1600) {
            return -15;
        } else if(ref.viewport().width >= 1600 && ref.viewport().width < 1920){
            return -13;
        } else {
            return -15;
        }
    };

    Controller.prototype.getFontScale = function(){
        if(ref.viewport().width < 414){
            return '6';
        } else if(ref.viewport().width >= 414 && ref.viewport().width < 768) {
            return '8';
        } else if(ref.viewport().width >= 768 && ref.viewport().width < 1024) {
            return '7';
        } else if(ref.viewport().width >= 1024 && ref.viewport().width < 1200) {
            return '3.75';
        } else if(ref.viewport().width >= 1200 && ref.viewport().width < 1400) {
            return '4';
        } else if(ref.viewport().width >= 1400 && ref.viewport().width < 1600) {
            return '3.5';
        } else if(ref.viewport().width >= 1600 && ref.viewport().width < 1920){
            return '2.5';
        } else {
            return '2.75';
        }
    };

    Controller.prototype.getTargetFontsize = function(){

        if(ref.viewport().width < 414){
            return '12vw';
        } else if(ref.viewport().width >= 414 && ref.viewport().width < 768) {
            return '12vw';
        } else if(ref.viewport().width >= 768 && ref.viewport().width < 1024) {
            return '7vw';
        } else if(ref.viewport().width >= 1024 && ref.viewport().width < 1200) {
            return '7vw';
        } else if(ref.viewport().width >= 1200 && ref.viewport().width < 1400) {
            return '6vw';
        } else if(ref.viewport().width >= 1400 && ref.viewport().width < 1600) {
            return '4vw';
        } else if(ref.viewport().width >= 1600 && ref.viewport().width < 1920){
            return '4vw';
        } else {
            return '5.25rem';
        }
    };

    Controller.prototype.getPaddingLeft = function(){
        if(ref.viewport().width < 414){
            return '12vw';
        } else if(ref.viewport().width >= 414 && ref.viewport().width < 768) {
            return '14vw';
        } else if(ref.viewport().width >= 768 && ref.viewport().width < 1024) {
            return '10vw';
        } else if(ref.viewport().width >= 1024 && ref.viewport().width < 1200) {
            return '4vw';
        } else if(ref.viewport().width >= 1200 && ref.viewport().width < 1400) {
            return '7vw';
        } else if(ref.viewport().width >= 1400 && ref.viewport().width < 1600) {
            return '6vw';
        } else if(ref.viewport().width >= 1600 && ref.viewport().width < 1920){
            return '6vw';
        } else {
            return '5.5vw';
        }
    };

    Controller.prototype.initBatches = function(){
        var preload = [];
        $('.batch-svg').each(function(){
            var job = {};
            job.url = $(this).attr('data-src');
            job.type = $(this).prop('nodeName');
            job.$elem = $(this);
            preload.push(job);
        });
        ref.loadBatches(preload);
    };

    Controller.prototype.loadBatches = function(preload){
        var promises = [];
        for (var i = 0; i < preload.length; i++) {
            (function(job, promise) {

                Logger.log("job.type == " + job.type);

                job.$elem[0].addEventListener('load', function() {

                    //Logger.log("OBJECT loaded: " + job.url);

                    promise.resolve();
                }, true);
                job.$elem.attr('data',job.url);

            })(preload[i], promises[i] = $.Deferred());
        }
        $.when.apply($, promises).done(function() {
            ref.animateBatches();
        });
    };

    Controller.prototype.animateBatches = function(){

        var batches = document.getElementsByClassName("batch-svg");

        $('.landing-batch').mouseover(function() {
            TweenMax.fromTo($(this).find('.landing-batch'), 1, {rotation:"0", transformOrigin:"50% 50%"}, {rotation:"360", transformOrigin:"50% 50%"});
        }).mouseout(function() {

        });

        for(var i = 0, length = batches.length; i < length; i++) {
            var batch = batches[i];
            if(batch && batch.getSVGDocument){
                var doc = batch.getSVGDocument();

                var $parent = $(batch).closest('.section');

                Logger.log("$parenttt -> " + $parent);


                if(doc){
                    var name = doc.getElementById("name");
                    var superrr = doc.getElementById("super");

                    Logger.log("name -> " + name);
                    Logger.log("superrr fff -> " + superrr);

                    if($parent.hasClass('left')){
                        TweenMax.to(name, 300, {rotation:"3600", transformOrigin:"50% 50%", ease:Linear.easeNone, repeat:-1},'ani')
                    } else {
                        TweenMax.to(name, 300, {rotation:"-3600", transformOrigin:"50% 50%", ease:Linear.easeNone, repeat:-1},'ani')
                    }
                }

            }

        }
    };

    /*********************
     mobile menu toggle
     *********************/
    Controller.prototype.toggleMenu = function(){

        Logger.log("toggleMenu");

        if($body.hasClass('nav-open')){

            //close
            $navToggle.removeClass('active');
            $body.removeClass('nav-open');
            $mainNav.removeClass('open');

        } else {

            //open
            $navToggle.addClass('active');
            $body.addClass('nav-open');
            $mainNav.addClass('open');
        }
    };

    Controller.prototype.addEventHandlers = function(){


        /*********************
        scroll event
        *********************/
        //$(document.body).on('touchmove', ref.onScroll); // for mobile
        $(window).on('scroll', ref.onScroll);
        ref.onScroll();

        /*********************
        scroll to #id
        *********************/
            // Select all links with hashes
        $('a[href*="#"]')
            // Remove links that don't actually link to anything
            .not('[href="#"]')
            .not('[href="#0"]')
            .click(function(event) {
                // On-page links

                if (
                    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                    &&
                    location.hostname == this.hostname
                ) {
                    // Figure out element to scroll to
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    // Does a scroll target exist?
                    if (target.length) {
                        // Only prevent default if animation is actually gonna happen
                        event.preventDefault();
                        $('html, body').animate({
                            scrollTop: target.offset().top - 100
                        }, 1000, function() {
                            // Callback after animation
                            // Must change focus!

                            if(openAccordionIndex){
                                ref.openAccordion(openAccordionIndex);
                                openAccordionIndex = null;
                            }

                            var $target = $(target);
                            $target.focus();
                            if ($target.is(":focus")) { // Checking if the target was focused
                                return false;
                            } else {
                                $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                                $target.focus(); // Set focus again
                            };
                        });
                    }
                }
            });

        /*********************
        resize event
        *********************/
        var delay = (function(){
            var timer = 0;
            return function(callback, ms){
                clearTimeout (timer);
                timer = setTimeout(callback, ms);
            };
        })();

        $(window).resize(function () {
            delay(function () {
                ref.resize();
            }, 50);
        });
        ref.resize();
    };

    /*********************
     scroll event handler
     *********************/
    Controller.prototype.onScroll = function(){
        var st = $(this).scrollTop();

        if(st != null){
            if($scrollHint){
                if(!$scrollHint.hasClass('gone')){
                    $scrollHint.addClass('gone');
                } else {
                    if(st == 0){
                        $scrollHint.removeClass('gone');
                    }
                }
            }

            if(ref.viewport().width < 960){
                if (st > lastScrollTop){
                    // downscroll code
                    //$naviToggle.addClass('gone');
                } else {
                    // upscroll code
                    $naviToggle.removeClass('gone');
                }
            }

            if(st < 10){
                $naviToggle.removeClass('gone');
                //show header ticker
                $html.removeClass('ticker-hidden');
            } else {
                //hide header ticker
                if(!$html.hasClass('ticker-hidden')) $html.addClass('ticker-hidden');
            }

            lastScrollTop = st;
        }
    };

    /*********************
    resize event handler
    *********************/
    Controller.prototype.resize = function(){
        TweenMax.set($pageWrap,{scrollPaddingTop: $header.height()+'px'});
        TweenMax.set($('html'),{scrollPaddingTop: ($header.height()+50)+'px'});
        if(ref.viewport().width >= 960){
            $naviToggle.removeClass('gone');
        }
        ref.setupSuperrrAnimation();
    };

    /*********************
    viewport().width, viewport().height
    *********************/
    Controller.prototype.viewport = function()
    {
        var e = window, a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
    };

    /*********************
    get browser type + version
    *********************/
    Controller.prototype.getBrowser = function()
    {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
            return {name:'IE',version:(tem[1]||'')};
        }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return {
            name: M[0],
            version: M[1]
        };
    };

    /*
     *
     * GENERIC HELPERS - GETTER/SETTER FUNCTIONS
     *
     * */

    //this returns the "real" windows width/height as used in media queries (returns Object{ width:x, height:y })
    Controller.prototype.viewport = function()
    {
        var e = window, a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
    };

    /*********************
     is it mobile?
     *********************/
    Controller.prototype.isMobileDevice = function()
    {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    window.Controller = Controller;

}(window));
