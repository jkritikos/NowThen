//UI dimension handling
//UI dimension handling
var IPHONE5 = (Ti.Platform.displayCaps.platformHeight==568);	
Ti.API.info('IPHONE5='+IPHONE5);

var cameraViewDisplayed=false;
var maxWidth=Ti.Platform.displayCaps.platformWidth;
var maxHeight=Ti.Platform.displayCaps.platformHeight;

var maxOverlayWidth=maxWidth;
var maxOverlayHeight=maxHeight -  (IPHONE5?96:54);

var sWidth=200;
var sHeight=150;
var thenImage;
var nowImage;

//The image to be selected from the photo gallery
var isImagePortrait = false;
var opacityIndex=0;	
var opacity=50;
var slideshow=true;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

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
	image : "images/main/square_graphic_old_image.png",
	borderColor:'#000000',
    borderWidth: 5,
    borderRadius: 15
});

win1.add(imageView);

//The slideshow view
var slideshowViewContainer = Ti.UI.createView({
	backgroundImage : 'images/bg/background_metal_cells.png',
	opacity : 0,
	top : 0,
	bottom : 0,
	left : 0,
	right : 0,
	zIndex : 100
});

// initialize container view 
var slideshowView = Titanium.UI.createView({
	height: maxHeight,
	width: maxWidth,
	top:0,
	left:0	
});

var nowImageView,thenImageView;

//Animations
var anim_in = Titanium.UI.createAnimation({
	opacity : 1,
	duration: 1000	
});

var anim_out = Titanium.UI.createAnimation({
	opacity:0,
	duration: 1000
});

var fadeOutAnim = Ti.UI.createAnimation({
	opacity:0,
	duration: 1500
});
						
var fadeInAnim = Ti.UI.createAnimation({
	opacity:1,
	duration: 1500
});

var fadeOutListener=function() {	
	Ti.API.info('Complete fade out listener');
	thenImageView.animate(anim_out);
	nowImageView.animate(fadeInAnim);						
}		

var fadeInListener= function(){
	Ti.API.info('Complete fade in listener');
	thenImageView.animate(anim_in);
	nowImageView.animate(fadeOutAnim);	  
}				
			
//Stop slideshow button
var buttonStopSlideshow = Titanium.UI.createButton({
	title : 'Stop',
	height : 50,
	width : 200,
	bottom : 10,
	zIndex : 105
});

//Stop slideshow button event listener
buttonStopSlideshow.addEventListener('click', function() {
	//close the slideshow view and clear the preview image (from camera roll) & slideshow image
	slideshowViewContainer.animate(anim_out);
	fadeOutAnim.removeEventListener('complete',fadeOutListener);
	fadeInAnim.removeEventListener('complete',fadeInListener);
	slideshowView.remove(nowImageView);
	slideshowView.remove(thenImageView);
});


slideshowViewContainer.add(slideshowView);
slideshowViewContainer.add(buttonStopSlideshow);
//End slideshow view setup

win1.add(slideshowViewContainer);

var popoverView;
var arrowDirection;

if (Titanium.Platform.osname == 'ipad') {
	// photogallery displays in a popover on the ipad and we want to make it relative to our image with a left arrow
	arrowDirection = Ti.UI.iPad.POPOVER_ARROW_DIRECTION_LEFT;
	popoverView = imageView;
}

//Placeholder of the image that the user selects from the camera roll
var imageViewOverlay = Titanium.UI.createImageView({
  	width: maxOverlayWidth,
  	height: maxOverlayHeight,
  	top:0,
  	backgroundColor : '#FA5858'
});

var galleryBtn = Titanium.UI.createButton({
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
galleryBtn.addEventListener('click', function() { 
	Titanium.Media.openPhotoGallery({

		success : function(event) {
									
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {	
				
				thenImage=event.media;
				
				if (thenImage.width>thenImage.height) isImagePortrait=false;
				else isImagePortrait=true;
				var ratio=(thenImage.width/thenImage.height).toFixed(2);
						
				var d;
				if (!isImagePortrait){ //landscape																					
					d=getDimensionLandscape(isImagePortrait,true,0,sWidth,sHeight,ratio,false);
					imageView.top=20;						
				}	else { //portrait								
					d=getDimensionPortrait(isImagePortrait,true,0,sWidth,sHeight,ratio,false);
					imageView.top=10;															
				}
											
				imageView.width=d.width;				
				imageView.height=d.height;
				imageView.image = thenImage;
								
				var dimObj;
				if (!isImagePortrait){
					imageViewOverlay.width=maxOverlayWidth;
					imageViewOverlay.height=(maxOverlayHeight*ratio).toFixed(2);
					dimObj=getDimensionPortrait(isImagePortrait,true,0,maxOverlayWidth,maxOverlayHeight,ratio,false);
					imageViewOverlay.width=dimObj.width;
					imageViewOverlay.height=dimObj.height;
					imageViewOverlay.top='25%'- (IPHONE5?96:54);	
					imageViewOverlay.image = thenImage;		
				} else { //portrait
					imageViewOverlay.height=maxOverlayHeight;
					imageViewOverlay.width=(maxOverlayHeight*ratio).toFixed(2);				
					dimObj=getDimensionPortrait(isImagePortrait,true,0,maxOverlayWidth,maxOverlayHeight,ratio,false);
					imageViewOverlay.width=dimObj.width;
					imageViewOverlay.height=dimObj.height;
					imageViewOverlay.top=0;
					imageViewOverlay.image = thenImage;					
				}													
			} 				
		},
		cancel : function() {},
		error : function(error) {
		},
		allowEditing : false,
		popoverView : popoverView,
		arrowDirection : arrowDirection,
		mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO]
	});
});

//Show camera button
var cameraBtn = Titanium.UI.createButton({
	backgroundImage: "images/main/capture_image_button.png",
	backgroundSelectedImage:"images/main/capture_image_button_highlighted.png",
	backgroundFocusedImage:"images/main/capture_image_button_highlighted.png",
	bottom : 150,
	height: 106,
	width: 322,
	focusable: true
});

//Show camera event listener
cameraBtn.addEventListener('click', function() {
	cameraViewDisplayed=true;	
	Titanium.Media.showCamera({
		success : function(event) {
			fadeOutAnim.addEventListener('complete',fadeOutListener);			
			fadeInAnim.addEventListener('complete',fadeInListener);	
			
				
			
			nowImage = event.media;
							
			var isNowImagePortrait=false;
			if (nowImage.width > nowImage.height) isNowImagePortrait=false;
			else isNowImagePortrait=true;
															
			var nowRatio=(nowImage.width/nowImage.height).toFixed(2);
			var nowD=getDimensionPortrait(isNowImagePortrait,false,0,maxWidth,maxHeight,nowRatio,true);		
			
			nowImageView = Ti.UI.createImageView({
				opacity:1,
				borderWidth:3,
				borderColor:'#777',
				width:nowD.width,
				height:nowD.height,			
				image:nowImage
			});

			slideshowView.add(nowImageView);	
			
			var thenD=getDimensionPortrait(isImagePortrait,false,0,maxWidth,maxHeight,thenRatio,true);
			var thenRatio=(thenImage.width/thenImage.height).toFixed(2);	
			
			thenImageView = Ti.UI.createImageView({
				opacity:0,	
				borderWidth:3,
				borderColor:'#777',
				width:thenD.width,
				height:thenD.height,
				image:thenImage		
			});
						
			slideshowView.add(thenImageView);
			nowImageView.animate(fadeInAnim);				
			
		},
		cancel : function() {
			Ti.API.info('Cancelling');
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
			Ti.API.debug("Camera overlay width:"+cameraOverlayView.width+" "+cameraOverlayView.height);
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

var settingsBtn =  Titanium.UI.createButton({	
	backgroundImage: "images/main/settings_button.png",
	backgroundSelectedImage: "images/main/settings_button_highlighted.png",
	backgroundFocusedImage:"images/main/settings_button_highlighted.png",
	bottom : 80,
	height: 106,
	width: 322,
	focusable: true	
});

//Settings event listener
settingsBtn.addEventListener('click', function() {		
	settingsWindow.open();
}); 

var infoBtn = Titanium.UI.createButton({
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
infoBtn.addEventListener('click', function() {		
	infoWindow.open();
});

win1.add(galleryBtn);
win1.add(cameraBtn);
win1.add(settingsBtn);
win1.add(infoBtn);

var currentOrientation = Ti.Gesture.getOrientation();

function getDimensionPortrait(isImagePortrait,doRotate,degreesToRotate,mWidth,mHeight,ratio,fit){
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
												
			if ((sDim>mWidth) && fit){
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

function getDimensionLandscape(isImagePortrait,doRotate,degreesToRotate,mWidth,mHeight,ratio,fit){
	var lDim;
	var sDim;
	
	var dimObj=new Object();
	if (doRotate){
		if (!isImagePortrait){					
			lDim=mHeight;										
			sDim=lDim * ( (1/ratio).toFixed(2)  );
			if ((sDim>mWidth) && fit) {
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
	if (cameraViewDisplayed && thenImage){
				
		var newOrientation=e.orientation;
		Ti.API.info('Current ORIENTATION = '+currentOrientation+' changed to = ' + newOrientation);
		
		var doRotate=false;
		var degreesToRotate = 0;		
		var matrix2d = Ti.UI.create2DMatrix();
		var matrix2dImage = Ti.UI.create2DMatrix();
		var dimObj;
		var ratio=(thenImage.width/thenImage.height).toFixed(2);
		
		Ti.API.debug('ImageViewOverlayWidth:'+imageViewOverlay.width+" , ImageViewOverlayHeight:" +imageViewOverlay.height);
		switch (newOrientation) {
			case Ti.UI.PORTRAIT:
				Ti.API.info("Portrait");			
				doRotate=true;
				degreesToRotate = 0;
				dimObj=getDimensionPortrait(isImagePortrait,true,degreesToRotate,maxOverlayWidth,maxOverlayHeight,ratio,false);								
	 			break;
			case Ti.UI.UPSIDE_PORTRAIT:
				Ti.API.info("Upside Portrait");			
				doRotate=true;
				degreesToRotate = 180;	
				dimObj=getDimensionPortrait(isImagePortrait,true,degreesToRotate,maxOverlayWidth,maxOverlayHeight,ratio,false);													
				break;				
			case Ti.UI.LANDSCAPE_LEFT:
				Ti.API.info("Landscape left");
				degreesToRotate = -90;
				doRotate=true;
				dimObj=getDimensionLandscape(isImagePortrait,true,degreesToRotate,maxOverlayWidth,maxOverlayHeight,ratio,false);
				break;
			case Ti.UI.LANDSCAPE_RIGHT: //landsca[e]							
				Ti.API.info("Landscape right");
				degreesToRotate = 90;
				doRotate=true;
				dimObj=getDimensionLandscape(isImagePortrait,true,degreesToRotate,maxOverlayWidth,maxOverlayHeight,ratio,false);			
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
		
		if (dimObj && dimObj.doRotate){
				
			matrix2d = matrix2d.rotate(degreesToRotate);
			matrix2dImage = matrix2dImage.rotate(degreesToRotate);
			// in degrees			
			
			if (isImagePortrait){				
				if (newOrientation==Ti.UI.LANDSCAPE_LEFT || newOrientation==Ti.UI.LANDSCAPE_RIGHT){
					imageViewOverlay.top='25%'- (IPHONE5?96:54);					
				} else imageViewOverlay.top=0;		
			} else { //Landscape			
				if (newOrientation==Ti.UI.LANDSCAPE_LEFT || newOrientation==Ti.UI.LANDSCAPE_RIGHT)
					imageViewOverlay.top=(IPHONE5?96:54);
			    else 
			    	imageViewOverlay.top='25%'- (IPHONE5?96:54);
			}
	
			var rotateFast = Ti.UI.createAnimation({
				transform : matrix2d,
				duration : 400
			});
	
			var rotateFastImage = Ti.UI.createAnimation({
				transform : matrix2dImage,
				anchorPoint : {x : 0.5, y : 0.5},
				duration : 400
			});
			
			imageViewOverlay.animate(rotateFastImage);		
			cameraHideButon.animate(rotateFast);	
			slideshowView.animate(rotateFast);	
				
			imageViewOverlay.height=dimObj.height;
			imageViewOverlay.width=dimObj.width;
			imageViewOverlay.image=thenImage;
		
		}			
	}
});

win1.open();
