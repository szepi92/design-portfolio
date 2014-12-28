/***********************************************
Jump.js
by Reka Szepesvari

This code scrolls down on the page to a specific section.
***********************************************/
$(document).ready (jumpMain);

function jumpMain () {
	$(".project-menu a").click (function (eventObject) {
		var anchor = eventObject.target;
		var href = $(anchor).attr("href");	// get the href
		
		// TODO: change the 80 to actually get the margin-top from the CSS code 
		// (.project-details)
		var top = $(href).offset().top - 65; 
		
		$("html, body").animate({scrollTop: top + "px"}, 700);

		return false;
	});
	
	// Populate the list of ranges
	var ranges = [];
	$(".project").each(function (idx, project) {
		var $project = $(project);
		
		// Extracting the project id's from html 
		// and then instead of "project-" making them "title-"
		var projectName = $project.attr("id");
		var splitProjectName = projectName.split("-");
		projectName = "#title-" + splitProjectName[1];
		
		// getting the bottom position of the project div
		var top = $project.offset().top;
		if (idx == 0) {
			top = 0;
		}
		
		// making an object for the project 
		var projectRange = {
			top: top,
			id: projectName
		};
		ranges.push(projectRange);
	});
	
	// event-handler: makes the project menu title red
	// for current project
	var scrollHandler = function (data) {
		var top = $(window).scrollTop() + $("#page-title").outerHeight() + $(".project-details h2").outerHeight() + 250;
		for (i=0; i < ranges.length; i++) {
			var x = ranges[i].top;
			var y;
			if (i+1 < ranges.length) {
				y = ranges[i+1].top;
			} else {
				y = 1.0/0.0;
			}
			
			if (top >= x && top < y) {
				$(".project-menu a").css({color: "black"});
				$(".project-menu a[href=" + '"' + ranges[i].id + '"' + "]").css({color: "#e1005f"});
				break;
			}
		};
	}
	
	$(window).scroll(_.debounce(scrollHandler, 50));
}