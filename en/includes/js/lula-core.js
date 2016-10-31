

$(function () {
    //SOUND
    soundManager.onready(function() {
	if (soundManager.supported()) {
		soundManager.createSound('ambiantSound','./media/data/generique.mp3');
	} else {
		//TODO
	}
    });
    
    var app = new Lula();
    app.init();
    
});


function Lula() {

    var MEDIA_DIR = "media/";
    var DATA_DIR  = MEDIA_DIR + "data/";
    var IMG_DIR   = MEDIA_DIR + "img/";

    // liste des thématiques
    this.thematiques = null;
    // liste des diapo
    this.diapos = null;
    // liste des mini-diapos
    this.miniDiapos = null;

    // index de la thématique courante
    this.i_thema = 0;
    // index du diapo courant
    this.i_diapo = 0;
    // index du mini_diapo courant
    this.i_mini_diapo = 0;
    
    this.init = function() {

        var that = this;

        // charge les thématiques
        $.getJSON( DATA_DIR + 'thematiques.json', function(data) {

            // enregistre le résultat dans le bon attribut
            that.thematiques = data.data;

            // charge ensuite les diapos
            $.getJSON( DATA_DIR + 'diapos.json', function(data) {

                // enregistre le résultat dans le bon attribut
                that.diapos = data.data;


                // charge ensuite les diapos
                $.getJSON( DATA_DIR + 'mini-diapos.json', function(data) {

                    // enregistre le résultat dans le bon attribut
                    that.miniDiapos = data.data;

                    // dessine les diapos et les thématiques
                    that.draw();

                });

            });

        });
    }


    this.draw = function() {
        
        // vide la barre des thématiques
        $(".nav .thumbs").html("");

        // dessine la barre des thématiques
        for(index in this.thematiques) {
            $(".nav .thumbs").append("<li title='<h2>"+this.thematiques[index].titre+"</h2><p>"+this.thematiques[index].desc+"</p>'><img src='"+IMG_DIR+this.thematiques[index].ID+".jpg' alt='' /></li>");
        }
        
        // vide la bobine de diapos
        $(".bobine").html("");
        
        // dessine les diapos
        for(index in this.diapos) {
            
            var content  = "<div class='diapo "+ ( index % 2 == 0 ? "pair" : "impair" ) +"'>";
                    content += "<div class='media'><img src='" + IMG_DIR + this.diapos[index].media + "' alt='' /></div>";
                    content += "<div class='brief'>";
                        content += "<h2>" + this.diapos[index].titre + "</h2>";
                        content += "<div class='desc'>" + this.diapos[index].desc + "</div>";
                    content += "</div>";
                content += "</div>";

            $(".bobine").append(content);
        }

        // place les évènements
        this.bind();


        // active la première thématique
        this.go2Diapo(0);
    }

    this.bind = function () {
        var that = this;
        
        // déclenche le changement de thématique
        $(".nav .thumbs li").unbind().click(function () {
				
				// stop le son si on est sur le dernier slide
				if ( that.i_diapo+1 == that.diapos.length )
        			soundManager.stop('ambiantSound');
        		            
               that.i_thema = $(this).index();
               that.go2Thema( that.i_thema, true);
               
        }).mouseenter(function () {
            // déplace le hover jusqu'à la miniature
            var x = 6 + $(this).index() * 104;
            $(".thumbs").stop().animate({backgroundPosition:x+"px 12px"}, 400);
        
        }).mouseleave(function () {

            // réstaure le hover jusqu'à la thématique courante
            var x = 6 + that.i_thema * 104;
            $(".thumbs").stop().animate({backgroundPosition:x+"px 12px"}, 400);
            
        });

        $(".next").click(function () {
			// lance le son si on est sur le dernier slide
			if ( that.i_diapo+2 == that.diapos.length )
        		soundManager.play('ambiantSound');
            
            if(that.i_diapo + 1 < that.diapos.length)
                that.go2Diapo(++that.i_diapo);
            
        });

        $(".previous").click(function () {
			// stop le son si on est sur le dernier slide
			if ( that.i_diapo+1 == that.diapos.length )
        		soundManager.stop('ambiantSound');
        		
            if(that.i_diapo - 1 >= 0)
                that.go2Diapo(--that.i_diapo);

        });

        // dessine les titres
        $(".nav .thumbs li").addTitle("thema");


        // ----------
        // Déclenche la pop (vidéo, image, diaporama)
        // ------------------------------------------
		
       
        // pour chaque diapo
        $(".media").each(function (i) {

             // c'est une vidéo
            if(that.diapos[i].video != undefined) {

                $(this).click(function () {

                    // place la vidéo depuis youtube dans la popup
                    //$("#popup .content").html('<iframe class="youtube-player" type="text/html" width="640" height="400" src="http://www.youtube.com/embed/'+that.diapos[i].video+'" frameborder="0"></iframe><div class="desc"><center>'+that.diapos[i].vlegende+'</center></div>')
					$("#popup .content").html('<object width="640" height="400"><param name="movie" value="http://www.youtube.com/v/'+that.diapos[i].video+'?fs=1&amp;hl=fr_FR&amp;rel=0&autoplay=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+that.diapos[i].video+'?fs=1&amp;hl=fr_FR&amp;rel=0&autoplay=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="640" height="400"></embed></object><div class="desc"><center>'+that.diapos[i].vlegende+'</center></div>')

                    // affiche la popup
                    that.showPopup();

                     // cache les boutons de navigation du diapo qui sont peut-être encore visibles
                     $("#popup .previous").hide();
                     $("#popup .next").hide();

                });

            // c'est une image
            } else if(that.diapos[i].image != undefined) {

                $(this).click(function () {

                    // place l'image
                    $("#popup .content").html('<img class="big" src="' + IMG_DIR + that.diapos[i].image +'" alt="" />')

                    // affiche la popup
                    that.showPopup();


                     // cache les boutons de navigation du diapo qui sont peut-être encore visibles
                     $("#popup .previous").hide();
                     $("#popup .next").hide();
                });
                
            // c'est un mini-diapo
            } else if(that.diapos[i].diapo != undefined) {

                $(this).click(function () {


                    that.startMiniDiapo(that.diapos[i].diapo);

                });
            }
            
        });
        

        
    }


    this.go2Thema = function(index, majDiapo) {
		
		if(index < this.thematiques.length && index >= 0) {
        	 // anime la barre
            var x = 6 + index * 104;
            $(".thumbs").stop().animate({backgroundPosition:x+"px 12px"}, 400);

            // met à jour le titre
            $(".nav h2").html( this.thematiques[index].titre );
       
            if(majDiapo) {
                
                var i = 0;
                for(; this.diapos[i].thematique != index && i <  this.diapos.length; i++) {}
                this.go2Diapo(i);
                
            }

        }
    }

    this.go2Diapo = function(index) {
        if(index < this.diapos.length && index >= 0) {
            this.i_diapo = index;
            // anime la bobine
            $(".bobine").animate({marginLeft:-1*index*1056}, 1000);
            
            // met à jour la barre de thématique
            this.go2Thema( this.diapos[index].thematique , false);

            if(index == 0)
                $(".previous").fadeOut(400);
            else
                $(".previous").fadeIn(400);

            if(index == this.diapos.length - 1)
                $(".next").fadeOut(400);
            else
                $(".next").fadeIn(400);

        }

    }

    this.go2MiniDiapo = function (miniDiapo, index) {

        var that = this;

        // le mini-diapo existe dans l'array'
        if(miniDiapo < that.miniDiapos.length && miniDiapo >= 0) {

            
            // le diapo (slide) existe dans le mini-diapo
            if(index < that.miniDiapos[miniDiapo].length && index >= 0) {

                $("#popup .mini-diapos").fadeOut(400, function() {

                    // insère les différents contenus
                    // ------------------------------

                    // intègre le diapo demandé
                    $("#popup .mini-diapos").html("<img class='small' src='"+ IMG_DIR + miniDiapo + "/" + that.miniDiapos[miniDiapo][index].image + "' alt='' />");

                    // intègre les sources
                    $("#popup .mini-diapos").append("<div class='source'>" + that.miniDiapos[miniDiapo][index].source + "</div>")

                    // insère le titre et la description
                    $("#popup .mini-diapos").append("<div class='desc'><strong>" + that.miniDiapos[miniDiapo][index].titre + "</strong> - "+ that.miniDiapos[miniDiapo][index].desc +"</div>")


                    // configure les boutons de navigation
                    // -----------------------------------
                    
                    // il n'y a pas un précédent
                    if(index == 0) {
                        
                        $("#popup .previous").unbind("click").hide();

                    // il y a un précédent
                    } else if (index > 0) {
                        
                        $("#popup .previous").show().unbind("click").click(function () {
                            that.go2MiniDiapo(miniDiapo, index - 1);
                        });
                    }

                    // il n'y a pas de suivant
                    if(index == that.miniDiapos[miniDiapo].length - 1) {

                        $("#popup .next").unbind("click").hide();

                    // il y a un suivant
                    } else if (index < that.miniDiapos[miniDiapo].length - 1) {

                        $("#popup .next").show().unbind("click").click(function () {
                            that.go2MiniDiapo(miniDiapo, index + 1);
                        });
                    }
                    
                    $("#popup .mini-diapos").fadeIn(400);
                });
                
                
            }
            
        }
    }

    this.startMiniDiapo = function(index) {
        
        var that = this;
        that.i_mini_diapo = 0;

        // place l'image
        $("#popup .content").html('<div class="mini-diapos"></div>');

        that.go2MiniDiapo(index, that.i_mini_diapo);

        // show popup
        that.showPopup();
        
    }
    
    this.showPopup = function() {

        $("#mask").show();
        $("#popup").show();

        $("#popup .close").click(function () {
		
		//soundManager.toggleMute('ambiantSound');
		
            $("#mask").hide();
            $("#popup").hide();

        });
    }
    
}

