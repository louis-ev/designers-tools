
function elementProche ( $titres, modwscrollTop ) {
	var dist = 0;
	var pDist = 10000000000;
	var titreactif;
	//optimisation : stocker le numéro d'article plutôt que l'article : http://jsperf.com/jquery-each-this-vs-eq-index
	var numTitre = -1;

	// modwscrollTop

	$titres.each(function(index) {
		dist =  $(this).position().top - modwscrollTop;

//console.log("$(this).position().top : " + $(this).position().top + " (document.documentElement.offsetHeight * ( $(this).offset().top / document.documentElement.clientHeight ) )  : " + (document.documentElement.offsetHeight * ( $(this).offset().top / document.documentElement.clientHeight ) )  + " dist : " + dist);

		if (dist > 0 && dist < pDist) {
			pDist = dist;
			numTitre = index - 1;
		}

	});

	if ( numTitre !== -1 ) {
		titreactif = $titres.eq(numTitre);
		return titreactif;
	}
	return false;
}

function scrollTo( container, eles) {
//	console.log("scrolltop : " + eles[0] );
	$(container)
		.animate({
			scrollTop: eles[0].offsetTop
		}, {
			queue: false,
			duration: 30
		});

}

function updatePosNavID ( scrollfromtop ) {

	var remappedScroll = scrollfromtop / $("#scrollZone").height() * $("#timeline").height();
	$("#navID").css("top", remappedScroll );
	return remappedScroll;

}

function quelElementVu ( posScrollGlobal ) {

	return elementProche ( $('#timeline .element'), posScrollGlobal );

}

function quelPostVu ( elsViewed ) {

	var newTitreVu = elsViewed;

	if ( newTitreVu !== false ) {

		$('#timeline .element').removeClass("active");
		$('.content article').removeClass("active");
		var lienNav = $('.content article').filter(function() {
			return $(this).attr('data-post') === newTitreVu.attr("data-post");
		});
		lienNav.addClass("active");
		newTitreVu.addClass("active");
		console.log("activated");
		console.log(lienNav);

		return lienNav;
	}
	return false;
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

		// on donne à la zone de scroll timeline la taille qu'il faut
		$("#scrollZone").css("height", $("main #cropcontent").css("height"));

		//var titreVu = elementProche(window.pageYOffset);

		// scroll sur timeline
		$("#timeline").scroll(function() {

			var scrollState = $("#timeline").scrollTop();

			// hauteur relative à la page
			var remappedScroll = updatePosNavID(scrollState);

			var elementVu = quelElementVu (remappedScroll);

			var postVu = quelPostVu ( elementVu );

			scrollTo ( "#cropwindow", postVu );

		});





		$("plopla").scroll(function() {

			console.log("scroll");

			var posScrollPage = window.pageYOffset;
			var scrollRemappedWindow = document.documentElement.clientHeight / document.documentElement.offsetHeight;
			var remappedScroll = posScrollPage / document.documentElement.offsetHeight * document.documentElement.clientHeight;


			$("#navID").css("top", remappedScroll );


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
