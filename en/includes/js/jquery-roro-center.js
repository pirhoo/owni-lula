// Place un élément au centre de l'écran (positionement absolu)
// l'élément à center ne dois pas être contenu dans un block positioné en RELATIVE !
(function($){
    $.fn.extend({
        center: function() {

            var obj = $(this);

            // Pour fonctionner pleinnement, cette fonction doit être appellée au chargement et au redimmensionement de la page
            $(window).resize(function () { $(obj).center(); });

            // -----------
            // Centre l'élement (ou les éléments)
            // au milieu de la page
            // ----------------------------------
            $(obj).each(function () {

                var x = ( $(window).width()  > $(this).outerWidth()  )  ? $(window).width()  / 2 - $(this).outerWidth()  / 2 : 0;
                var y = ( $(window).height() > $(this).outerHeight() )  ? $(window).height() / 2 - $(this).outerHeight() / 2 : 0;


                // recherche dans les éléments parents positionnés en absolute
                var par = $(this).parent();

                while( par.attr("nodeName") != "BODY") {

                    // l'élément est modifié
                    if( par.css("position") == "absolute" ) {
                        x -= par.css("left" ).replace("px", "").replace(",", ".") * 1;
                        y -= par.css("top").replace("px", "").replace(",", ".") * 1;
                    }

                    par = par.parent();
                }

                $(this).css({
                    position:"absolute",
                    left:x+"px",
                    top: y+"px",
                    margin:0
                });

            });
        }
    });
})(jQuery);