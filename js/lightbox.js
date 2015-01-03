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
	} else if (e.keyCode == 27) {
		hideLightbox();
	}
});

var curProjectId = "";
var curImageIndex = 0;

function main () {
	$(".project .thumbnails img").click (imageClicked);
	$(".lightbox-overlay").click (hideLightbox);
	centerThumbs();
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
	
	//put .animate instead of .css("display", "block")
	$(".lightbox-display").animate({opacity: "show"}); 
	
	centerArrows();
	$("#right-arrow").unbind("click").click (nextImage);
	$("#left-arrow").unbind("click").click (previousImage);
	$("#x").unbind("click").click (hideLightbox);
}

function hideLightbox() {
	$(".lightbox-display").css("display", "none");
}

// this function gets the window height and the height
// of the icons so that they can be centered vertically
function centerArrows() {
	var windowHeight = $(window).height();
	var arrowHeight = $(".arrows").height();
	var top = (windowHeight - arrowHeight) / 2;
	$(".arrows").css("margin-top", top);
}

// do something with the real dimensions of the image
function realDimensions(elem, callback) {
	var image = new Image(); // or document.createElement('img')
	var width, height;
	image.onload = function() {
	  width = this.width;
	  height = this.height;
	  callback(width,height, elem);
	};
	image.src = $(elem).attr('src');
}

// this function centers the overflowing horizontal
// thumbnail images
function centerThumbs() {
	var thumbBoxWidth = $(".thumb-box").width();
	var thumbBox2Width = $(".thumb-box2").width();
	
	var scaledHeight = $(".thumb-box").height();
	var scaledHeight2 = $(".thumb-box2").height();
	
	$(".horizontal img").each(function (index, elem){
		realDimensions(elem, function (width, height, elem) {
			var isThumbBox = $(elem).parent().hasClass("thumb-box");
			
			var scaledWidth = (width / height) * scaledHeight;
			var scaledWidth2 = (width / height) * scaledHeight2;
			
			if (isThumbBox) {
				var thumbMargin = (thumbBox2Width - scaledWidth) / 2;
				$(elem).css("margin-left", thumbMargin);
			} else {
				var thumb2Margin = (thumbBox2Width - scaledWidth2) / 2;
				$(elem).css("margin-left", thumb2Margin);
			}
		});
	});
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
	
	// Check the dimensions of the image
	// Center vertically or horizontally
	realDimensions(".lightbox img", function(w, h, elem){
		var W = $(".lightbox").width();
		var H = $(".lightbox").height();
		$helper = $(".lightbox .helper");
		$caption = $(".lightbox-caption");
		$elem = $(elem);
		
		if (w*H <= h*W) {
			// (w/W) <= (h/H): image will be full-height, centered horizontally
			$elem.removeClass("center-vert");
			$elem.addClass("center-hor");
			$elem.css("margin-top",0);
			
			var displayWidth = w*(H/h);
			var captionWidth = displayWidth - parseInt($caption.css("padding-left"));
			$caption.css("width", captionWidth);
		} else {
			// (w/W) > (h/H): image will be full-width, centered vertically
			$elem.removeClass("center-hor");
			$elem.addClass("center-vert");
			
			var displayHeight = h*(W/w);
			var captionWidth = W - parseInt($caption.css("padding-left"));
			
			$caption.css("width", captionWidth);
			$elem.css("margin-top",(H-displayHeight) / 2.0);
		}
	});
}



function nextImage () {
	var setLength = $("#" + curProjectId + " img").size ();
	showLightboxImage (curProjectId, (curImageIndex + 1) %setLength);
}

function previousImage () {
	var setLength = $("#" + curProjectId + " img").size ();
	showLightboxImage (curProjectId, (curImageIndex - 1) %setLength);
}