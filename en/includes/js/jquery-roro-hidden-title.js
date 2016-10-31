
// espace de nommage dédiée aux hidden-titles
var RR_HTITLE = {};

// permet de savoir si oui ou nom le title peut être caché
RR_HTITLE.readyToHide = true;

(function($){
    $.fn.extend({
        addTitle : function (addClass) {

            var target = $(this);
            if(target == undefined) target = $(".addTitle");
            if(addClass == undefined) addClass = "";


            $(target).each( function (index) {

                var title = $(this).attr("title");
                var href  = $(this).attr("href");

                if( title != "" && ! $(this).hasClass("titleCreated") ) {

                    $(this).addClass("titleCreated");
                    var count = $(".hiddenTitle").length;
                    var content;

                    $(this).attr("title", "");
                    content = '<span class="hiddenTitle '+addClass+'">' + title + '</span>';

                    $(document.body).append(content);
                    RR_HTITLE.showTitle(count, this);
                }

            });

            $(".hiddenTitle").mouseenter(function () {
                RR_HTITLE.readyToHide = false;
            });

        }
    })
})(jQuery);


RR_HTITLE.showTitle = function (index, trigger) {

    var title = $(".hiddenTitle:eq("+index+")");

    $(trigger).mouseenter(function () {

        $("img", title).trigger("appear");

        // positione
        var thatTop  = $(trigger).offset().top - $(title).outerHeight() - 20;
        var thatLeft = $(trigger).offset().left + 30;
        $(title).css({position: "absolute", top: thatTop, left: thatLeft});

        // affiche
        $(".hiddenTitle").stop().hide();
        $(title).stop().show();
    });

    $(trigger).mouseleave(function () {

        RR_HTITLE.readyToHide = true;
        setTimeout(function () {
            if(RR_HTITLE.readyToHide)
                $(title).stop().hide();
        }, 500);
    });


    $(title).mouseleave(function () {
        $(title).stop().hide();
    });


}

/* -----------------------------

.hiddenTitle {
    position:absolute;
    top:0px;
    z-index:4000;

    font-size:0.8em;

    background:#404040;
    display:block;
    color:#f2f2f2;
    padding:3px;

    box-shadow: gray 0px 3px 15px;
    -moz-box-shadow: gray 0px 3px 15px;
    -webkit-box-shadow: gray 0px 3px 15px;
    -khtml-box-shadow: gray 0px 3px 15px;

    border-radius:5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    -khtml-border-radius: 5px;

    display:none;

}

.hiddenTitle:before {
    content:url("./images/bottomArrow3.png");
    width:0px;
    height:0px;
    display:block;
    position:relative;
    top:-15px;
    left:5px;
}


 */