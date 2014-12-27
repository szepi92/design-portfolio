/***********************************************
Jump.js
by Reka Szepesvari

This code scrolls down on the page to a specific section.
***********************************************/
$(document).ready (main);

function main () {
	$(".project-menu a").click (function (eventObject) {
		var anchor = eventObject.target;
		var href = $(anchor).attr("href");	// get the href
		
		// TODO: change the 80 to actually get the margin-top from the CSS code 
		// (.project-details)
		var top = $(href).offset().top - 65; 
		
		$("html, body").animate({scrollTop: top + "px"}, 700);
		
		$(".project-menu a").css({color: "black"});
		$(anchor).css({color: "#e1005f"});

		return false;
	});
	
	/*var scrollBar = $(window).scrollTop();
	
	var offsets = [];
	
	$(".project-details h2").each(function (object) {
		var topObject = $(object).offset().top;
		offsets.push(topObject);
	});

	function goRed () {
		
	}*/
}