/***********************************************
Lightbox.js
by Reka Szepesvari

This code makes a light-box pop-up and display
the active image and image-set.
***********************************************/

$(document).ready (main);

$(document).keyup(function(e){
	if (e.keyCode == 37) {
		previousImage();
	} else if (e.keyCode == 39) {
		nextImage();
	}
});

var curProjectId = "";
var curImageIndex = 0;

function main () {
	$(".project .thumbnails img").click (imageClicked);
	$(".lightbox-overlay").click (hideLightbox);
	$("#right-arrow").click (nextImage);
	$("#left-arrow").click (previousImage);
}

// The callback function when an image is clicked
// Will display the lightbox with the specified image and project
function imageClicked (eventObject) {
	var img = eventObject.target;		// get the image target from the event
	var projectId = $(img).parents(".project").attr("id");	// get the project id
	
	// Searches the ancestor list (".thumbnails") for the corresponding index of this image
	var imageIndex = $(img).parents(".thumbnails").children().index($(img).parent());
	
	// Display the lightbox and pass in the project/image
	showLightbox(projectId, imageIndex);
}

function showLightbox (projectId, imageIndex) {
	showLightboxImage(projectId, imageIndex);
	$(".lightbox-display").css("display", "block");
}

function hideLightbox() {
	$(".lightbox-display").css("display", "none");
}

// Change the current lightbox image
// Also, set the global variables: curProjectId and curImageIndex
function showLightboxImage (projectId, imageIndex){
	curProjectId = projectId;
	curImageIndex = imageIndex;
	
	// Extract the "src" from the specified image
	var cssSelector = "#" + projectId + " .thumbnails img";
	var src = $(cssSelector).eq(imageIndex).attr("src");
	
	// TODO: Should probably animate this
	$(".lightbox img").attr("src",src);
}



function nextImage () {
	var setLength = $("#" + curProjectId + " img").size ();
	showLightboxImage (curProjectId, (curImageIndex + 1) %setLength);
}

function previousImage () {
	var setLength = $("#" + curProjectId + " img").size ();
	showLightboxImage (curProjectId, (curImageIndex - 1) %setLength);
}