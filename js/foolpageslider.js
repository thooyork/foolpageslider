foolpageslider = {};

foolpageslider.module = (function(){
    var cssItem = '.bgitem';
    var cssContainer = '.fps-container';
    var cssLink = '.m';
    var currentBG = 0;
    var resizeTimer;
    var ww = $(window).width();
    var bp = 850;

    var setImages = function(){
        $(cssItem).each(function(idx, val){
            var $val = $(val);
            var bg = $val.find('.bgimg').attr('src');
            $val.css('background-image', 'url('+bg+')');
        });
    };
    
    var bindEvents = function(){
        $(cssLink).on('click', function(e){
            var me = $(this);
            var id = me.data(id);
            setSlideTween(id.id, true);
            $(cssLink).removeClass('active');
            me.addClass('active');

            //in mobile menu it is possible to have a closed state of the content item
            if((me.find('.content').css('height') != '0px') && (ww <= bp)){
                me.removeClass('active');
            }
        });

        $(window).on('resize', function(e) {
            clearTimeout(resizeTimer);
            ww = $(window).width();
            resizeTimer = setTimeout(function() {
               // do stuff here
               setSlideTween(currentBG, false);
            }, 250); 
        });

        if($(cssContainer).data("settings").tiltEffect){

            $(document).on('mousemove', function(e){
                var xPos = (e.clientX / $(window).width())-0.5;
                var yPos = (e.clientY / $(window).height())-0.5;
                yPos = -yPos;
                TweenLite.to($(cssContainer), 0.6, {rotationY: 5*xPos, rotationX: 5*yPos, ease:Power1.easeOut, transformPerspective:2500, transformOrigin:'center'});
            });

        }

    };

    var setSlideTween = function(id, boolAnimate){

        var allItems = $(cssItem);
        var allExceptCurrent = $(cssItem + '[data-id!="'+currentBG+'"]'); 
        var currentItem = $(cssItem + '[data-id="'+currentBG+'"]');
        var newItem = $(cssItem + '[data-id="'+id+'"]');
        var newContent = newItem.find('.content');
        var currentContent = currentItem.find('.content');
        var newHeadline = newContent.find('h2');
        
        allItems.css({'z-index':1,'opacity':1});
        newItem.css('z-index',3);
        
        if (boolAnimate){ 
            if(id > currentBG){
                // Slide in from BOTTOM
                TweenLite.set(newItem, {top:'100%'});
                TweenLite.set(newContent, {top:'100%', autoAlpha:0});
                TweenLite.set(newHeadline, {top:0});

                var tl = new TimelineLite();
                    tl.to(currentContent, 0.8, {top:"-100%", autoAlpha:0})
                    .to(currentItem, 1, {top:"-100%", autoAlpha:0.1}, "-=0.7")
                    .to(newItem, 0.6,{top:0, autoAlpha:1}, "-=1")
                    .to(newHeadline, 0.7, {top:'-'+newHeadline.height()}, "-=0.5")
                    .to(newContent, 0.8, {top:'55%', autoAlpha:0.5}, "-=1")
                    .to(newContent, 0.5, {autoAlpha:1}, "-=0.3");
            }
            else if (id < currentBG) {
                //Slide in from TOP
                TweenLite.set(newItem, {top:'-100%'});
                TweenLite.set(newContent, {top:'-100%', autoAlpha:0});
                TweenLite.set(newHeadline, {top:'-'+ (newHeadline.height() * 3)});

                var tl = new TimelineLite();
                    tl.to(currentContent, 0.8, {top:"100%", autoAlpha:0})
                    .to(currentItem, 1, {top:"100%", autoAlpha:0.1}, "-=0.7")
                    .to(newItem, 0.6,{top:0, autoAlpha:1}, "-=1")
                    .to(newHeadline, 0.7, {top:'-'+newHeadline.height()}, "-=0.5")
                    .to(newContent, 0.8, {top:'55%', autoAlpha:0.5}, "-=1")
                    .to(newContent, 0.5, {autoAlpha:1}, "-=0.3");
            }
        }
        else{
            // set Image w/o Animation e.g. on pageload
            TweenLite.set(newItem, {top:0, autoAlpha:1});
            
            var tl = new TimelineLite();
                tl.to(newItem, 1,{top:0, autoAlpha:1})
                  .to(newHeadline, 0.6, {top:'-'+newHeadline.height()}, "-=0.9")
                  .to(newContent, 0.8, {top:'55%', autoAlpha:0.5}, "-=1")
                  .to(newContent, 0.5, {autoAlpha:1}, "-=0.3");
            
            TweenLite.set($(cssLink), {className:'-=active'});
            TweenLite.set($(cssLink + '[data-id="'+id+'"]'), {className:'+=active'});
        }
        
        currentBG = id;

    };

    var addResponsiveMarkup = function(){
        $(cssItem).each(function(idx, val){
            var me = $(this);
            var id = me.data(id);
            var $markup = me.find('.content').clone();
            $(cssContainer).find('li[data-id='+id.id+']').append($markup);
        });
    };
 
    var init = function(){
        var settings = $(cssContainer).data("settings");
        var slide = settings.initialSlide;
        addResponsiveMarkup();

        setImages();
        bindEvents(); 
        
        setSlideTween(slide, false);
       
    };

    return {
 		init:init
    };

}());