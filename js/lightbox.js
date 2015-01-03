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
var onScreen = ".lightbox .main-img";
var offScreen = ".lightbox .secondary-img";

function main () {
	$(".project .thumbnails img").click (imageClicked);
	
	$(".lightbox-overlay, .lightbox").click (hideLightbox)
	.children().click(function(e) {
		if ($(e.currentTarget).css("opacity") > 0.5) {
			return false;
		}
	});
	
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
	showLightboxImage(projectId, imageIndex,true);
	
	//put .animate instead of .css("display", "block")
	$(".lightbox-display").animate({opacity: "show"}); 
	
	centerArrows();
	$("#right-arrow").unbind("click").click (nextImage);
	$("#left-arrow").unbind("click").click (previousImage);
	$("#x").unbind("click").click (hideLightbox);
}

function hideLightbox(event) {
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
var showLightboxImage = _.throttle(function (projectId, imageIndex, firstShow){
	curProjectId = projectId;
	curImageIndex = imageIndex;

	// Extract the "src" and "alt"/caption from the specified image
	var cssSelector = "#" + projectId + " .thumbnails img";
	var src = $(cssSelector).eq(imageIndex).attr("src");
	var cap = $(cssSelector).eq(imageIndex).attr("alt");
	
	// Decide whether to animate things
	var animateTime = 700;
	if (firstShow) {
		animateTime = 0;
	}
	
	// Modify the offscreen image to come onscreen
	$(offScreen).attr("src",src);
	$(offScreen).animate({opacity: 1.0, "z-index": 1000000000}, animateTime);
	$(onScreen).animate({opacity: 0.0, "z-index": -1}, animateTime);
	
	// Check the dimensions of the image
	// Center vertically or horizontally
	// Also animates the caption
	realDimensions(offScreen, function(w, h, elem){
		var W = $(".lightbox").width();
		var H = $(".lightbox").height();
		var displayHeight, displayWidth;
		$caption = $(".lightbox-caption");
		$elem = $(elem);
		
		// Decide on the final dimensions of the image (depending on ratios)
		if (w*H <= h*W) {
			// Full height image, centered vertically
			displayHeight = H;
			displayWidth = w*(H/h);
		} else {
			// Full width image, centered horizontally
			displayWidth = W;
			displayHeight = h*(W/w);
		}
		
		// Set the dimensions of the image
		// Also center the image vertically and horizontally
		var imageLeft = (W - displayWidth) / 2.0;
		var imageTop = (H - displayHeight) / 2.0;
		$elem.height(displayHeight).width(displayWidth);
		$elem.css({
			left: imageLeft,
			top : imageTop
		});
		
		// Set the height/width/position of the caption
		captionProperties = {
			width: displayWidth - parseInt($caption.css("padding-left")),
			left : imageLeft,	// to match the image above
			top  : imageTop + displayHeight
		};
		
		// Set the text and animate the caption of the lightbox image
		$(".lightbox-caption").text(cap);
		$caption.animate(captionProperties, animateTime);
	});
	
	// Swap on and off-screen
	var tmp = onScreen;
	onScreen = offScreen;
	offScreen = tmp;
}, 700);

function nextImage () {
	var setLength = $("#" + curProjectId + " img").size ();
	showLightboxImage (curProjectId, (curImageIndex + 1) %setLength, false);
}

function previousImage () {
	var setLength = $("#" + curProjectId + " img").size ();
	showLightboxImage (curProjectId, (curImageIndex - 1) %setLength, false);
}