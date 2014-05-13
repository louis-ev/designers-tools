
function elementProche ( modwscrollTop ) {
	var dist = 0;
	var pDist = 10000000000;
	var titreactif;
	//optimisation : stocker le numéro d'article plutôt que l'article : http://jsperf.com/jquery-each-this-vs-eq-index
	var numTitre = -1;
	var $titres = $('#timeline .element');
	$titres.each(function(index) {
		dist =  (document.documentElement.offsetHeight * ( $(this).position().top / document.documentElement.clientHeight ) ) - modwscrollTop;
/*console.log("$(this).offset().top : " + $(this).position().top + " (document.documentElement.offsetHeight * ( $(this).offset().top / document.documentElement.clientHeight ) )  : " + (document.documentElement.offsetHeight * ( $(this).offset().top / document.documentElement.clientHeight ) )  + " dist : " + dist); */

		if (dist > 0 && dist < pDist) {
			pDist = dist;
			numTitre = index;
		}

	});
	if ( numTitre !== -1 ) {
		titreactif = $titres.eq(numTitre);
		return titreactif;
	}
	return false;
}

function scrolltop(eles) {
    $('#cropcontent').css( "top", -eles.position().top );
}



(function($) {

// Use this variable to set up the common and page specific functions. If you
// rename this variable, you will also need to rename the namespace below.
var Roots = {
  // All pages
  common: {
    init: function() {
      // JavaScript to be fired on all pages
    }
  },
  home: {
    init: function() {

		$("main").append("<nav id='nav'></nav>");
		$("main article").each ( function() {
			$("main #nav").html($(this).clone());
		});
    }
  },
  flux: {
    init: function() {
		console.log("load");

		// on créé la ligne qui se balade dans la nav de gauche
		$("#timeline .container").append("<nav id='navID'></nav>");

		//var titreVu = elementProche(window.pageYOffset);

		$(window).scroll(function() {

			console.log("scroll");

			var posScrollPage = window.pageYOffset;
			var scrollRemappedWindow = document.documentElement.clientHeight / document.documentElement.offsetHeight;
			var remappedScroll = posScrollPage / document.documentElement.offsetHeight * document.documentElement.clientHeight;

			console.log("scroll");

			$("#navID").css("top", remappedScroll );

			var newTitreVu = elementProche( window.pageYOffset );
			console.log(newTitreVu);

			if ( newTitreVu !== false ) {

				$('#timeline .element').removeClass("active");
				$('.content article').removeClass("active");
				var lienNav = $('.content article').filter(function() {
					return $(this).attr('data-post') === newTitreVu.attr("data-post");
				});
				lienNav.addClass("active");
				newTitreVu.addClass("active");
				console.log("activated");

				scrolltop (lienNav);

				titreVu = newTitreVu;

			}

		});

    }
  }

};

// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
var UTIL = {
  fire: function(func, funcname, args) {
    var namespace = Roots;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    UTIL.fire('common');

    $.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
      UTIL.fire(classnm);
    });
  }
};

$(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
