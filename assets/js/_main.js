function resizeRectMatchPost () {
	var contentHeight = $("#cropcontent").height();
	$("#timeline .element").each(function () {
		$that = $(this);
		var lienNav = $('#content article').filter(function() {
			return $(this).attr('data-post') === $that.attr("data-post");
		});
		var mappedHeight = lienNav.height() / contentHeight;
		console.log(" lienNav.offset().height :  " + lienNav.height() + " $('#cropcontent').offset().height "  + contentHeight );
		$(this).height( mappedHeight * $("#timeline").height() );
	});
}

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
			numTitre = index;
		}

		dist =  ($(this).position().top + $(this).height())  - modwscrollTop;
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

function scrollTo( container, eles) {
//	console.log("scrolltop : " + eles[0] );
	$(container)
		.scrollTop(
			eles[0].offsetTop
		);
}

function updatePosNavID () {
	var scrollfromtop = $("#timeline").scrollTop();
	console.log( "scrollfromtop : " + scrollfromtop);
	var remappedScroll = scrollfromtop / $("#scrollZone").height() * $("#timeline").height();
	$("#navID").css("top", remappedScroll );
	return remappedScroll;
}

function quelElementVu ( elements, posScrollGlobal ) {

	return elementProche ( elements, posScrollGlobal );

}

function activePost ( elsViewed ) {

	var newTitreVu = elsViewed;

	if ( newTitreVu !== false ) {

		$('#timeline .element').removeClass("active");
		$('#content article').removeClass("active");
		var lienNav = $('#content article').filter(function() {
			return $(this).attr('data-post') === newTitreVu.attr("data-post");
		});
		lienNav.addClass("active");
		newTitreVu.addClass("active");
/*
		console.log("activated");
		console.log(lienNav);
*/

		return lienNav;
	}
	return false;
}

function activeRect ( elsViewed ) {

	var newTitreVu = elsViewed;

	if ( newTitreVu !== false ) {

		$('#timeline .element').removeClass("active");
		$('#content article').removeClass("active");
		var lienNav = $('#timeline .element').filter(function() {
			return $(this).attr('data-post') === newTitreVu.attr("data-post");
		});
		lienNav.addClass("active");
		newTitreVu.addClass("active");
/*
		console.log("activated");
		console.log(lienNav);
*/

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

		$(window).load(function() {

			// on retire toutes les PJ de la colonne des articles
			$("article img").each(function () {
				$(this).appendTo("#attachmentCol");
			});

			// on créé la ligne qui se balade dans la nav de gauche
			$("#timeline .container").append("<nav id='navID'></nav>");

			// on donne à la zone de scroll timeline la taille du maincontent
			$("#scrollZone").css("height", $("main #cropcontent").css("height"));

			// on donne à chaque rect la taille qu'il faut
			resizeRectMatchPost();

			// check du scroll pour éviter que les evts déclenchent le scroll
			var scrollinTimeline = false;
			var scrollinCropwindow = false;
			var pelementVu;

			// scroll sur timeline
			$("#timeline").scroll(function() {

				if ($("#timeline").is(':animated') || scrollinCropwindow === true ) {
					console.log("catched timelinescroll");
					return;
				}

				scrollinTimeline = true;

				console.log("timeline");

				// hauteur relative à la page
				var remappedScroll = updatePosNavID();

				var elementVu = quelElementVu ( $('#timeline .element'), remappedScroll);

				if ( elementVu !== pelementVu ) {
					pelementVu = elementVu;
					var postVu = activePost ( elementVu );
					scrollTo ( "#cropwindow", postVu );
				}

			});

			// scroll sur articles
			$("#cropwindow").scroll(function() {

				if ($("#cropwindow").is(':animated') || scrollinTimeline === true) {
					console.log("catched cropwindowscroll");
					return;
				}

				scrollinCropwindow = true;

				console.log("cropwindow");

				var scrollState = $("#cropwindow").scrollTop();


				// l'article en vu
				var elementVu = quelElementVu ( $('#cropwindow article'), scrollState);

				// on trouve le rect qui correspond dans la timeline
				var rectVu = activeRect ( elementVu );

				// on place le scroll dessus, et le repère sur le scroll
				$("#timeline").scrollTop(scrollState);

				// hauteur relative à la page



				//console.log("elementVu : ");
				//console.log( elementVu );

				//var postVu = activePost ( elementVu );

				//scrollTo ( "#cropwindow", postVu );

				//var postVu = activeRect ( elementVu );

				//scrollTo ( "#timeline", postVu );

			});

			$("#cropwindow").on('scrollstop', function() {
				console.log("cropwindowstop");
				if ( scrollinCropwindow === true) {
					scrollinTimeline = false;
					scrollinCropwindow = false;
				}
			});
			$("#timeline").on('scrollstop', function() {
				console.log("timelinestop");
				if ( scrollinTimeline === true) {
					scrollinTimeline = false;
					scrollinCropwindow = false;
				}
			});
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
