	//UI dimension handling

var cameraViewDisplayed=false;
var maxWidth=Ti.Platform.displayCaps.platformWidth;
var maxHeight=Ti.Platform.displayCaps.platformHeight;
var sWidth=200;
var sHeight=150;
var initialImage;
var ratio;
//The image to be selected from the photo gallery
var isImagePortrait = false;
var opacityIndex=0;	
var opacity=50;
var slideshow=true;


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
	height : sHeight,
	width :  sWidth,
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
	viewSlideshow.opacity = parseInt(opacity);
	imageView.image = "images/main/square_graphic_old_image.png";
	//slideshowThenImage.image = "";
	//slideshowNowImage.image = "";
	viewSlideshow.close();
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
									
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {	
				initialImage=event.media			
				//Ti.API.debug("Image width:"+initialImage.width);
				//Ti.API.debug("Image height:"+initialImage.height);
				
				if (initialImage.width>initialImage.height) isImagePortrait=false;
				else isImagePortrait=true;
				ratio=(initialImage.width/initialImage.height).toFixed(2);
				
				// set image view
				Ti.API.debug('Our type was: ' + event.mediaType+", is ImagePortrait:"+isImagePortrait+", ratio:"+ratio);								
				//Ti.API.debug('sWidth:' + sWidth+", sHeight:"+sHeight);
				var dimObj;
				if (!isImagePortrait){ //landscape											
					imageViewOverlay.width=maxWidth;							
					imageViewOverlay.height=maxWidth * ( (1/ratio).toFixed(2)  );
					dimObj=getDimensionPortrait(isImagePortrait,true,0,sWidth,sHeight);											
				}	else { //portrait					
					imageViewOverlay.height=maxHeight;								
					imageViewOverlay.width=(maxHeight*ratio).toFixed(2);			
					dimObj=getDimensionPortrait(isImagePortrait,true,0,sWidth,sHeight);									
				}
				imageView.image = initialImage;
				imageView.width=dimObj.width;
				imageView.height=dimObj.height;
				slideshowThenImage.image = initialImage;
				slideshowThenImage.width=imageViewOverlay.width;
				slideshowThenImage.height=imageViewOverlay.height;				
				imageViewOverlay.image = initialImage;
				var dimObj
						
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

function getDimensionPortrait(isImagePortrait,doRotate,degreesToRotate,mWidth,mHeight){
	var lDim;
	var sDim;	
	
	var dimObj=new Object();
	
	if (doRotate){
		if (!isImagePortrait){ //landscape
			lDim=mWidth;
			sDim= lDim * ( (1/ratio).toFixed(2)  );		
			dimObj.width=lDim;
			dimObj.height=sDim;					
		} else { //portrait
			lDim=mHeight;
			sDim=(mHeight * ratio).toFixed(2);										
			if (sDim>mWidth){
				sDim=mWidth;
				lDim=mWidth * ( (1/ratio).toFixed(2));
			}
			dimObj.width=sDim;
			dimObj.height=lDim;		
		}
	}		
	dimObj.doRotate=doRotate;
	dimObj.degreesToRotate=degreesToRotate;
	return dimObj;
}

function getDimensionLandscape(isImagePortrait,doRotate,degreesToRotate,mWidth,mHeight){
	var lDim;
	var sDim;
	
	var dimObj=new Object();
	if (doRotate){
		if (!isImagePortrait){					
			lDim=mHeight;										
			sDim=lDim * ( (1/ratio).toFixed(2)  );
			if (sDim>mWidth) {
				sDim=mWidth;
				lDim=(sDim*ratio).toFixed(2);
			}				
			dimObj.height=sDim;
			dimObj.width=lDim;
		}	else {
			lDim=mWidth;					
			sDim=(lDim*ratio).toFixed(2);					
			dimObj.height=lDim;
			dimObj.width=sDim;									
		}			
	}		
	dimObj.doRotate=doRotate;
	dimObj.degreesToRotate=degreesToRotate;
	return dimObj;
}

Ti.Gesture.addEventListener('orientationchange', function(e) {
	
	if (cameraViewDisplayed){
		var newOrientation=e.orientation;
		//Ti.API.info('Current ORIENTATION = '+currentOrientation+' changed to = ' + newOrientation);
		
		var doRotate=false;
		var degreesToRotate = 0;		
		var matrix2d = Ti.UI.create2DMatrix();
		var matrix2dImage = Ti.UI.create2DMatrix();
		var dimObj;
		
		switch (newOrientation) {
			case Ti.UI.PORTRAIT:
				Ti.API.info("Portrait");
				doRotate=true;
				degreesToRotate = 0;
				dimObj=getDimensionPortrait(isImagePortrait,true,degreesToRotate,maxWidth,maxHeight);										
	 			break;
			case Ti.UI.UPSIDE_PORTRAIT:
				Ti.API.info("Upside Portrait");
				doRotate=true;
				degreesToRotate = 180;	
				dimObj=getDimensionPortrait(isImagePortrait,true,degreesToRotate,maxWidth,maxHeight);										
				break;				
			case Ti.UI.LANDSCAPE_LEFT:
				Ti.API.info("Landscape left");
				degreesToRotate = -90;
				doRotate=true;
				dimObj=getDimensionLandscape(isImagePortrait,true,degreesToRotate,maxWidth,maxHeight);
				break;
			case Ti.UI.LANDSCAPE_RIGHT: //landsca[e]							
				Ti.API.info("Landscape right");
				degreesToRotate = 90;
				doRotate=true;
				dimObj=getDimensionLandscape(isImagePortrait,true,degreesToRotate,maxWidth,maxHeight);			
				break;   			
			case Ti.UI.FACE_UP:
				Ti.API.info("Face up");
				doRotate=false;
				dimObj=new Object();
				dimObj.doRotate=false;
				break;
			case Ti.UI.FACT_DOWN:
				Ti.API.info("Face down");
				doRotate=false;
				dimObj=new Object();
				dimObj.doRotate=false;
				break;
			case Ti.UI.UNKNOWN:
				Ti.API.info("Unknown");
				doRotate=false;
				dimObj=new Object();
				dimObj.doRotate=false;
				break;
			default:
				Ti.API.info("Default");
				doRotate=false;
				dimObj=new Object();
				dimObj.doRotate=false;
				break;			
		}
		
		if (dimObj.doRotate){
			Ti.API.info("doRotate:"+dimObj.doRotate);
			Ti.API.info("degreesToRotate:"+dimObj.degresToRotate);
			
			imageViewOverlay.height=dimObj.height;
			imageViewOverlay.width=dimObj.width;
			imageViewOverlay.image=initialImage;
			
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
			
			imageViewOverlay.animate(rotateFastImage);		
			cameraHideButon.animate(rotateFast);		
		}
				
	}
});

win1.open();
