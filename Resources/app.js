	//UI dimension handling
var opacityIndex=0;
var cameraViewDisplayed=false;
var maxWidth=Ti.Platform.displayCaps.platformWidth;
var maxHeight=Ti.Platform.displayCaps.platformHeight;
var lDim;
var sDim;
var ratio;
//The image to be selected from the photo gallery
var isImagePortrait = false;

//var ImageFactory = require('ti.imagefactory');
//var IPHONE5 = false;
//if (Ti.Platform.displayCaps.platformHeight == 568) IPHONE5 = true;
//Ti.API.info('IPHONE5=' + IPHONE5);
//End UI dimension handling

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//Fade in animation
var anim_in = Titanium.UI.createAnimation();
anim_in.opacity = 1;
anim_in.duration = 1;

//Fade out animation
var anim_out = Titanium.UI.createAnimation();
anim_out.opacity = 0;
anim_out.duration = 1;

// create base UI tab and root window
var win1 = Titanium.UI.createWindow({
	title : 'Tab 1',
	backgroundImage : 'images/bg/background_metal_cells.png',
	fullscreen : true
});

//The preview image
var imageView = Titanium.UI.createImageView({
	height : 150,
	width :  200,
	top : 10,
	image : "images/main/square_graphic_old_image.png"//,
	//canScale : true,
	//hires : true
});

win1.add(imageView);

//The slideshow view
var viewSlideshow = Ti.UI.createView({
	backgroundImage : 'images/bg/background_metal_cells.png',
	opacity : 0,
	top : 0,
	bottom : 0,
	left : 0,
	right : 0,
	zIndex : 100
});

//Stop slideshow button
var buttonStopSlideshow = Titanium.UI.createButton({
	title : 'Stop',
	height : 50,
	width : 200,
	bottom : 10,
	zIndex : 101
});

//Stop slideshow button event listener
buttonStopSlideshow.addEventListener('click', function() {
	//close the slideshow view and clear the preview image (from camera roll) & slideshow image
	viewSlideshow.opacity = 0;
	imageView.image = '';
	slideshowThenImage.image = '';
	slideshowNowImage.image = '';
});

//slideshow content NOW
var slideshowNowImage = Titanium.UI.createImageView({
	canScale : true,
	opacity : 1,
	top : 20,
	left : 0
});

//slideshow content THEN
var slideshowThenImage = Titanium.UI.createImageView({
	canScale : true,
	opacity : 1,
	top : 220,
	right : 0
});

viewSlideshow.add(slideshowNowImage);
viewSlideshow.add(slideshowThenImage);
viewSlideshow.add(buttonStopSlideshow);
//End slideshow view setup

win1.add(viewSlideshow);

var popoverView;
var arrowDirection;

if (Titanium.Platform.osname == 'ipad') {
	// photogallery displays in a popover on the ipad and we
	// want to make it relative to our image with a left arrow
	arrowDirection = Ti.UI.iPad.POPOVER_ARROW_DIRECTION_LEFT;
	popoverView = imageView;
}

//Placeholder of the image that the user selects from the camera roll
var imageViewOverlay = Titanium.UI.createImageView({
  	width: maxWidth,
  	height: maxHeight 	
});

var b1 = Titanium.UI.createButton({
	backgroundImage: "images/main/select_image_button.png",
	backgroundSelectedImage:"images/main/select_image_button_highlighted.png",
	backgroundFocusedImage:"images/main/select_image_button_highlighted.png",
	bottom : 220,		
	height: 106,
	width: 322,
	focusable: true
});

Ti.include("ui/win/settingsWin.js");
Ti.include("ui/win/cameraWin.js");
Ti.include("ui/win/infoWin.js");

//Photo gallery event listener
b1.addEventListener('click', function() { 
	Titanium.Media.openPhotoGallery({

		success : function(event) {
			//var cropRect = event.cropRect;
			//photoGalleryImage = event.media;	
			slideshowThenImage.image = event.media;
			imageView.image = event.media;
						
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {				
				Ti.API.debug("Image width:"+event.media.width);
				Ti.API.debug("Image height:"+event.media.height);
				
				if (event.media.width>event.media.height) isImagePortrait=false;
				else isImagePortrait=true;
				ratio=(event.media.width/event.media.height).toFixed(2);
				
				// set image view
				Ti.API.debug('Our type was: ' + event.mediaType+", is ImagePortrait:"+isImagePortrait+", ratio:"+ratio);								
				
				if (!isImagePortrait){ //landscape
					Ti.API.debug("Change imageViewOverlay dimensions");
					lDim=maxWidth;					
					imageViewOverlay.width=lDim;
					sDim=lDim * ( (1/ratio).toFixed(2)  );				
					imageViewOverlay.height=sDim;
				}	else { //portrait
					lDim=maxHeight;
					imageViewOverlay.height=lDim;
					sDim=(lDim*ratio).toFixed(2);					
					imageViewOverlay.width=sDim;								
				}
				
				//Ti.API.debug('Ratio:'+imageViewOverlay.width/imageViewOverlay.height);
				Ti.API.debug("sDim:"+sDim+" , lDim:"+lDim);				
				Ti.API.debug('ImageViewOverlayWidth:'+imageViewOverlay.width+" , ImageViewOverlayHeight:" +imageViewOverlay.height);
				imageViewOverlay.image = event.media;
						
			} else {				
				// is this necessary?
			}
						
		},
		cancel : function() {

		},
		error : function(error) {
		},
		allowEditing : false,
		popoverView : popoverView,
		arrowDirection : arrowDirection,
		mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO]
	});
});

//Show camera button
var b2 = Titanium.UI.createButton({
	backgroundImage: "images/main/capture_image_button.png",
	backgroundSelectedImage:"images/main/capture_image_button_highlighted.png",
	backgroundFocusedImage:"images/main/capture_image_button_highlighted.png",
	bottom : 150,
	height: 106,
	width: 322,
	focusable: true
});

//Show camera event listener
b2.addEventListener('click', function() {
	cameraViewDisplayed=true;	
	Titanium.Media.showCamera({
		success : function(event) {
			//var cropRect = event.cropRect;
			//var image = event.media;
			//slideshowNowImage.height = 260;
			var targetHeight = 220;
			var targetWidth = 160;
			//slideshowNowImage.height = targetHeight;
			//slideshowNowImage.width = 320;
			//slideshowNowImage.width = targetWidth;
			slideshowThenImage.height = targetHeight;
			slideshowThenImage.width = targetWidth;
			slideshowNowImage.image = event.media;
			slideshowNowImage.height = targetHeight;
			slideshowNowImage.width = targetWidth;
		},
		cancel : function() {

		},
		error : function(error) {
			// create alert
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			// set message
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Device does not have video recording capabilities');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			// show alert
			a.show();
		},
		allowEditing : false,
		saveToPhotoGallery : true,
		mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO,
		showControls : false,
		overlay : cameraOverlayView,
		transform : Ti.UI.create2DMatrix().scale(1),
		animated : false
	});
});

var b3 =  Titanium.UI.createButton({	
	backgroundImage: "images/main/settings_button.png",
	backgroundSelectedImage: "images/main/settings_button_highlighted.png",
		backgroundFocusedImage:"images/main/settings_button_highlighted.png",
		bottom : 80,
		height: 106,
		width: 322,
		focusable: true	
});

//Settings event listener
b3.addEventListener('click', function() {		
	settingsWindow.open();
}); 

var b4 = Titanium.UI.createButton({
	backgroundImage : "images/main/info_button.png",
	backgroundSelectedImage:"images/main/info_button_highlighted.png",
	backgroundFocusedImage:"images/main/info_button_highlighted.png",	
	width: 105,
	height: 95,
	right : 0,
	bottom : 0,
	focusable: true
});

//info listener
b4.addEventListener('click', function() {		
	infoWindow.open();
});

win1.add(b1);
win1.add(b2);
win1.add(b3);
win1.add(b4);



var currentOrientation = Ti.Gesture.getOrientation();
//Orientation handling
Ti.Gesture.addEventListener('orientationchange', function(e) {
	
	if (cameraViewDisplayed){
		var newOrientation=e.orientation;
		Ti.API.info('Current ORIENTATION = '+currentOrientation+' changed to = ' + newOrientation);
		
		var degreesToRotate = 0;		
		var matrix2d = Ti.UI.create2DMatrix();
		var matrix2dImage = Ti.UI.create2DMatrix();
		
		switch (newOrientation) {
			case Ti.UI.PORTRAIT:
				degreesToRotate = 0;
				
				if (!isImagePortrait){ //landscape
					lDim=maxWidth;
					sDim= lDim * ( (1/ratio).toFixed(2)  );
					imageViewOverlay.height=sDim;
					imageViewOverlay.width=lDim;
					
				} else { //portrait
					lDim=maxHeight;
					sDim=(maxHeight * ratio).toFixed(2);										
					if (sDim>maxWidth){
						sDim=maxWidth;
						lDim=maxWidth * ( (1/ratio).toFixed(2));
					}
					imageViewOverlay.height=lDim;
					imageViewOverlay.width=sDim;
				}
										
	 			break;
			case Ti.UI.UPSIDE_PORTRAIT:
				degreesToRotate = 180;				
				
				if (!isImagePortrait){ //landscape
					lDim=maxWidth;
					sDim= lDim * ( (1/ratio).toFixed(2)  );
					imageViewOverlay.height=sDim;
					imageViewOverlay.width=lDim;
					
				} else { //portrait
					lDim=maxHeight;
					sDim=(maxHeight * ratio).toFixed(2);										
					if (sDim>maxWidth){
						sDim=maxWidth;
						lDim=maxWidth * ((1/ratio).toFixed(2));
					}
					imageViewOverlay.height=lDim;
					imageViewOverlay.width=sDim;
				}
						
				break;
			case Ti.UI.LANDSCAPE_LEFT:
				degreesToRotate = -90;
				
				if (!isImagePortrait){					
					lDim=maxHeight;										
					sDim=lDim * ( (1/ratio).toFixed(2)  );
					if (sDim>maxWidth) {
						sDim=maxWidth;
						lDim=(sDim*ratio).toFixed(2);
					}				
					imageViewOverlay.height=sDim;
					imageViewOverlay.width=lDim;
				}	else {
					lDim=maxWidth;					
					sDim=(lDim*ratio).toFixed(2);		
					Ti.API.info('lDim:'+lDim);
					Ti.API.info('sDim:'+sDim);
					Ti.API.info(ratio);				
					imageViewOverlay.height=lDim;
					imageViewOverlay.width=sDim;	
					Ti.API.info('Alert left:'+sDim+' - ImageViewOverlayWidth:'+imageViewOverlay.width);			
				}			
				break;
			case Ti.UI.LANDSCAPE_RIGHT: //landsca[e]				
				//matrix2dImage = matrix2dImage.scale(1.5);
				degreesToRotate = 90;			
				if (!isImagePortrait){					
					lDim=maxHeight;										
					sDim=lDim * ( (1/ratio).toFixed(2)  );
					if (sDim>maxWidth) {
						sDim=maxWidth;
						lDim=(sDim*ratio).toFixed(2);
					}				
					imageViewOverlay.height=sDim;
					imageViewOverlay.width=lDim;
				}	else { //portrait
					lDim=maxWidth;					
					sDim=(lDim*ratio).toFixed(2);		
					Ti.API.info('lDim:'+lDim);
					Ti.API.info('sDim:'+sDim);
					Ti.API.info(ratio);					
					imageViewOverlay.height=lDim;
					imageViewOverlay.width=sDim;		
					Ti.API.info('Alert right:'+sDim+' - ImageViewOverlayWidth:'+imageViewOverlay.width);	
				}					
				break;   			
		}
					
		Ti.API.debug("sDim:"+sDim+" , lDim:"+lDim);				
		Ti.API.debug('ImageViewOverlayWidth:'+imageViewOverlay.width+" , ImageViewOverlayHeight:" +imageViewOverlay.height);				
		
		matrix2d = matrix2d.rotate(degreesToRotate);
		// in degrees
		matrix2dImage = matrix2dImage.rotate(degreesToRotate);
		// in degrees

		var rotateFast = Ti.UI.createAnimation({
			transform : matrix2d,
			duration : 400
		});

		var rotateFastImage = Ti.UI.createAnimation({
			transform : matrix2dImage,
			duration : 400
		});
		
		/*
		var pWidth = Ti.Platform.displayCaps.platformWidth;
		var pHeight = Ti.Platform.displayCaps.platformHeight;
		Ti.App.SCREEN_WIDTH = (pWidth > pHeight) ? pHeight : pWidth;
		Ti.App.SCREEN_HEIGHT = (pWidth > pHeight) ? pWidth : pHeight;
		
		Ti.API.info("Screen width:"+pWidth);
		Ti.API.info("Screen height:"+pHeight);
		
		Ti.API.info('ImageViewOverlay width:'+imageViewOverlay.width);
		Ti.API.info('ImageViewOverlay height:'+imageViewOverlay.height);
		Ti.API.info('ImageViewOverlay image width:'+imageViewOverlay.image.width);
		Ti.API.info('ImageViewOverlay image height:'+imageViewOverlay.image.height);
		Ti.API.info('ImageViewOverlay size width:'+imageViewOverlay.size.width);
		Ti.API.info('ImageViewOverlay size height:'+imageViewOverlay.size.height);
		Ti.API.info('ImageViewOverlay to image width:'+imageViewOverlay.toImage().width);
		Ti.API.info('ImageViewOverlay to image height:'+imageViewOverlay.toImage().height);
		*/
		//imageViewOverlay.animate({view:imageViewOverlayTmp,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
		imageViewOverlay.animate(rotateFastImage);		
		//imageViewOverlay.animate(rotateFast);
		//cameraFlashButon.animate(rotateFast);
		//shutterButton.animate(rotateFast);
		cameraHideButon.animate(rotateFast);
		//cameraSwitchButon.animate(rotateFast);		
	}
});

win1.open();
