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

$.extend($.easing,
{
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t = t / (d / 2)) < 1) { return c/2*t*t*t*t*t + b; }
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    }

});

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
/*
	$(container)
		.scrollTop(
			eles[0].offsetTop
		);
*/
	if ( eles[0] !== undefined ) {
		$(container).animate({
			scrollTop : eles[0].offsetTop
		}, {
			queue: false,
			duration: 200,
			easing: "easeInOutQuint"
		});
	}


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

function activeElemnts ( elesVu, $where ) {

	if ( elesVu !== false ) {

		var lienNav = $where.filter(function() {
			return $(this).attr('data-post') === elesVu.attr("data-post");
		});
		lienNav.addClass("active");
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
				console.log( '$(this).closest("article").data("post") : ' + $(this).closest("article").data("post") );

				var datapost = $(this).closest("article").data("post");

				//other stuff
				if ($(this).parent("a").length) {
					$(this).closest("a").appendTo("#attachmentCol").attr("target", "_blank").attr("data-post", datapost );
				}
				else {
					$(this).wrap("<a href='" + $(this).attr("src") + "'></a>").parent().appendTo("#attachmentCol").attr("target", "_blank").attr("data-post", datapost );

				}

			});

			// placer les pieces jointes en abs et en hauteur
/*
			$("#attachmentCol a").each(function () {
				$that = $(this);
				var eles = $("#cropwindow article").filter(function() {
					return $(this).attr('data-post') === $that.attr("data-post");
				});
				$(this).css("top", eles.offset().top);
			});
*/

			// on retire toutes les PJ de la colonne des articles
			$("#timeline .element").each(function () {
				var titreMail = $(this).data("title");
/*
				var memeSujet = $('article .name h2').filter(function() {
					return $(this).text() === titreMail;
				});
*/
				//console.log(memeSujet);
				$(this).css("background-color", "#" + intToARGB(hashCode(titreMail)).substring(0,6) );

			});

			$("#timeline").addClass("offhovered");
			$("#timeline").hover(function() {
				$(this).toggleClass("offhovered");
			});

			// on supprime les styles dans les mails
			$("article .entry-summary *").removeAttr( 'style' );

			// on place les apercu de mail de la timeline a la bonne hauteur d'après leur data-ancienetepercent
			$("#timeline .element").each( function () {
				$(this).css("top", $(this).data("ancienetepercent") * $("main #timeline .container").height() );
				$(this).css("opacity", 1);
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
			var scrollinAttachment = false;
			var pelementVu =  quelElementVu ( $('#timeline .element'), 0);

			// scroll sur timeline
			$("#timeline").scroll(function() {

				if ($("#timeline").is(':animated') || scrollinCropwindow === true || scrollinAttachment === true  ) {
					console.log("catched timelinescroll");
					return;
				}

				scrollinTimeline = true;

//				console.log("timeline");

				// hauteur relative à la page
				var remappedScroll = updatePosNavID();

				var elementVu = quelElementVu ( $('#timeline .element'), remappedScroll);

				if ( elementVu.data("post") !== pelementVu.data("post") ) {

					pelementVu = elementVu;

					$("#timeline .active").removeClass("active");
					var elesVu = activeElemnts ( elementVu, $('#timeline .element') );

					$("#cropwindow .active").removeClass("active");
					var postVu = activeElemnts ( elementVu, $('#cropwindow article') );
					scrollTo ( "#cropwindow", postVu );

					$("#attachmentCol .active").removeClass("active");
					var attachmentVu = activeElemnts ( elementVu, $('#attachmentCol a') );
					if ( attachmentVu !== false ) {
						scrollTo ( "#attachmentCol", attachmentVu );
					}

				}

			});

			// scroll sur articles
			$("#cropwindow").scroll(function() {

				if ($("#cropwindow").is(':animated') || scrollinTimeline === true || scrollinAttachment === true ) {
					console.log("catched cropwindowscroll");
					return;
				}

				scrollinCropwindow = true;

				console.log("cropwindow");

				var scrollState = $("#cropwindow").scrollTop();
				$("#timeline").scrollTop(scrollState);

				var remappedScroll = updatePosNavID();

				var elementVu = quelElementVu ( $('#cropwindow article'), scrollState);

				console.log('elementVu.data("post") : ' + elementVu.data("post"));
				console.log('pelementVu.data("post") : ' + pelementVu.data("post"));

				if ( elementVu.data("post") !== pelementVu.data("post") ) {

					pelementVu = elementVu;

					$("#timeline .active").removeClass("active");
					var elesVu = activeElemnts ( elementVu, $('#timeline .element') );

					$("#cropwindow .active").removeClass("active");
					var postVu = activeElemnts ( elementVu, $('#cropwindow article') );

					$("#attachmentCol .active").removeClass("active");
					var attachmentVu = activeElemnts ( elementVu, $('#attachmentCol a') );
					if ( attachmentVu !== false ) {
						scrollTo ( "#attachmentCol", attachmentVu );
					}
				}

			});

			// scroll sur articles
			$("#attachmentCol").scroll(function() {

				if ( $("#attachmentCol").is(':animated') || scrollinTimeline === true || scrollinCropwindow === true ) {
					console.log("catched attachmentColscroll");
					return;
				}

				scrollinAttachment = true;

				console.log("attachmentCol");


				var scrollState = $("#attachmentCol").scrollTop();

				var elementVu = quelElementVu ( $('#attachmentCol a'), scrollState);

				$("#timeline .active").removeClass("active");
				var elesVu = activeElemnts ( elementVu, $('#timeline .element') );
				elesVuTop = elesVu.offset().top;
				$("#timeline").scrollTop(elesVuTop);

				$("#cropwindow .active").removeClass("active");
				var postVu = activeElemnts ( elementVu, $('#cropwindow article') );
				scrollTo ( "#cropwindow", postVu );

/*
				$("#attachmentCol .active").removeClass("active");
				var attachmentVu = activeElemnts ( elementVu, $('#attachmentCol a') );
*/

			});

			$("#cropwindow").on('scrollstop', function() {
				console.log("cropwindowstop");
				if ( scrollinCropwindow === true) {
					scrollinTimeline = false;
					scrollinCropwindow = false;
					scrollinAttachment = false;
				}
			});
			$("#timeline").on('scrollstop', function() {
				console.log("timelinestop");
				if ( scrollinTimeline === true) {
					scrollinTimeline = false;
					scrollinCropwindow = false;
					scrollinAttachment = false;
				}
			});
			$("#attachmentCol").on('scrollstop', function() {
				console.log("attachmentColstop");
				if ( scrollinAttachment === true) {
					scrollinTimeline = false;
					scrollinCropwindow = false;
					scrollinAttachment = false;
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
