/***********************************************
Jump.js
by Reka Szepesvari

This code scrolls down on the page to a specific section.
***********************************************/

// Wait till the page settles before setting up the scrolling and jumping
$(document).ready(jumpMain);

function jumpMain () {
	$(".project-menu a").click (function (eventObject) {
		var anchor = eventObject.target;
		var href = $(anchor).attr("href");	// get the href
		
		// HACK: Don't hardcode the offset amount
		var top = $(href).offset().top - 70;
		$("html, body").animate({scrollTop: top + "px"}, 700);
		return false;
	});
	
	// Populate the list of ranges
	var ranges = [];
	var populateRanges = function() {
		ranges = [];
		$(".project").each(function (idx, project) {
			var $project = $(project);
			
			// Extracting the project id's from html 
			// and then instead of "project-" making them "title-"
			var projectName = $project.attr("id");
			var splitProjectName = projectName.split("-");
			projectName = "#title-" + splitProjectName[1];
			
			// getting the bottom position of the project div
			var top = $(projectName).offset().top - 70;
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
	}
	
	// event-handler: makes the project menu title red
	// for current project
	var scrollHandler = function (data) {
		// This makes sure the ranges get updated every once in a while
		(_.debounce(populateRanges, 1000, true))();

		// Get the scroll top
		// HACK: it's adjusted to make the red happen earlier
		var top = $(document).scrollTop() + 200;
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