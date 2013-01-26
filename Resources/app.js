// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

function flashLabelViewFadeOut(){
	flashModeLabelView.animate(anim_out);
}

//The image to be selected from the photo gallery
var isPhotoGalleryImagePortrait = false;

//The current camera flash status
var currentFlashStatus = "";

//Fade in animation
var anim_in = Titanium.UI.createAnimation();
anim_in.opacity=1;
anim_in.duration = 1;

//Fade out animation
var anim_out = Titanium.UI.createAnimation();
anim_out.opacity=0;
anim_out.duration = 1;

// create base UI tab and root window
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'black',
    fullscreen:true
});

//The preview image
var imageView = Titanium.UI.createImageView({
	height:150,
	width:190,
	top:70,
	backgroundColor:'#999',
	canScale:true,
	hires:true
});

win1.add(imageView);

//The slideshow view
var viewSlideshow = Ti.UI.createView({
	backgroundColor:'gray',
	opacity:0,
	top:0,
	bottom:0,
	left:0,
	right:0,
	zIndex:100
});

//Stop slideshow button
var buttonStopSlideshow = Titanium.UI.createButton({
	title:'Stop',
	height:50,
	width:200,
	bottom:10,
	zIndex:101
});

//Stop slideshow button event listener
buttonStopSlideshow.addEventListener('click', function(){
	//close the slideshow view and clear the preview image (from camera roll) & slideshow image
	viewSlideshow.opacity = 0;
	imageView.image = '';
	slideshowThenImage.image = '';
	slideshowNowImage.image = '';
});

//slideshow content NOW
var slideshowNowImage = Titanium.UI.createImageView({
	canScale:true,
	opacity:1,
	top:20,
	left:0
});

//slideshow content THEN
var slideshowThenImage = Titanium.UI.createImageView({
	canScale:true,
	opacity:1,
	top:220,
	right:0
});

viewSlideshow.add(slideshowNowImage);
viewSlideshow.add(slideshowThenImage);
viewSlideshow.add(buttonStopSlideshow);
//End slideshow view setup


win1.add(viewSlideshow);

//The actual overlay on the camera
var cameraOverlayView = Titanium.UI.createImageView({
	top:0,
	left:0
});

//The label for the flash mode
var flashModeLabelView = Ti.UI.createLabel({
	bottom:80,
	color:"red",
	textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER,
	backgroundColor:'white',
	height:32,
	width:120,
	borderRadius:8,
	opacity:0,
	left:10
})

cameraOverlayView.add(flashModeLabelView);

//Opacity slider
var opacitySlider = Ti.UI.createSlider({
	min:0,
	max:10,
	value:0,
	width:300,
	height:'auto',
	top:30,
	zIndex:101
});

cameraOverlayView.add(opacitySlider);

opacitySlider.addEventListener('change',function(e){
	Ti.API.warn('Basic Slider - value = ' + Math.round(e.value) + ' act val ' + Math.round(opacitySlider.value));
	var value = Math.round(opacitySlider.value);
	var imgOpacity = 0;
	
	if(value == 10) imgOpacity = 1.0;
	else if(value == 9) imgOpacity = 0.9;
	else if(value == 8) imgOpacity = 0.8;
	else if(value == 7) imgOpacity = 0.7;
	else if(value == 6) imgOpacity = 0.6;
	else if(value == 5) imgOpacity = 0.5;
	else if(value == 4) imgOpacity = 0.4;
	else if(value == 3) imgOpacity = 0.3;
	else if(value == 2) imgOpacity = 0.2;
	else if(value == 1) imgOpacity = 0.1;
	else if(value == 0) imgOpacity = 0.0;
	imageViewOverlay.opacity = imgOpacity;
});

//The camera toolbar
var cameraOverlayToolbarView = Ti.UI.createView({
	bottom:0,
	width:320,
	height:50,
	zIndex:100,
	backgroundColor:'black'
})

cameraOverlayView.add(cameraOverlayToolbarView);

//Shutter button
var shutterButton = Ti.UI.createButton({
	title: "!!",
	width: 50,
	left: 150
});

//Shutter button event listener
shutterButton.addEventListener('click', function(){
	Ti.Media.takePicture();
	viewSlideshow.animate(anim_in);		
	
	//start slideshow
	//slideshowNowImage.animate(anim_out);
	//slideshowThenImage.animate(anim_in);
});

//Camera hide button
var cameraHideButon = Ti.UI.createButton({
	title: "X",
	width: 50,
	right: 10
});

//Camera hide button event listener
cameraHideButon.addEventListener('click', function(){
	Ti.Media.hideCamera();
});

//Camera switch button
var cameraSwitchButon = Ti.UI.createButton({
	title: "S",
	width: 50,
	left: 80
});

//Camera switch button event listener
cameraSwitchButon.addEventListener('click', function(){
	if (Ti.Media.camera == Ti.Media.CAMERA_FRONT){
		Ti.Media.switchCamera(Ti.Media.CAMERA_REAR);
	} else {
		Ti.Media.switchCamera(Ti.Media.CAMERA_FRONT);
	}
});

//Camera flash button
var cameraFlashButon = Ti.UI.createButton({
	title: "F",
	width: 50,
	left: 10
});

//Flash button event listener
cameraFlashButon.addEventListener('click', function(){
	//Cancel any fade out animation in progress
	clearTimeout(flashFadeOutInterval);
	
	if (Ti.Media.cameraFlashMode == Ti.Media.CAMERA_FLASH_AUTO)	{
		currentFlashStatus = "Flash On";		
		Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_ON;
		flashModeLabelView.text = currentFlashStatus;
	} else if (Ti.Media.cameraFlashMode == Ti.Media.CAMERA_FLASH_ON) {
		currentFlashStatus = "Flash Off";
		Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_OFF;
		flashModeLabelView.text = currentFlashStatus;
	} else {
		currentFlashStatus = "Flash Auto";
		Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_AUTO;
		flashModeLabelView.text = currentFlashStatus;
	}
	
	flashModeLabelView.opacity = 0.7;
	var flashFadeOutInterval = setTimeout(function(){flashLabelViewFadeOut()},3000);
});

//Add the items to the camera toolbar
cameraOverlayToolbarView.add(shutterButton);
cameraOverlayToolbarView.add(cameraHideButon);
cameraOverlayToolbarView.add(cameraSwitchButon);
cameraOverlayToolbarView.add(cameraFlashButon);

//Placeholder of the image that the user selects from the camera roll 
var imageViewOverlay = Titanium.UI.createImageView({
	opacity:0.0,
	top:-52,
	left:0,
	canScale:true
});

cameraOverlayView.add(imageViewOverlay);

var popoverView;
var arrowDirection;

if (Titanium.Platform.osname == 'ipad')
{
	// photogallery displays in a popover on the ipad and we
	// want to make it relative to our image with a left arrow
	arrowDirection = Ti.UI.iPad.POPOVER_ARROW_DIRECTION_LEFT;
	popoverView = imageView;
}

var b1 = Titanium.UI.createButton({
	title:'Browse photos',
	height:50,
	width:200,
	bottom:130
});

//Photo gallery event listener
b1.addEventListener('click', function(){
	Titanium.Media.openPhotoGallery({

	success:function(event)	{
		//var cropRect = event.cropRect;
		//photoGalleryImage = event.media;
		imageView.image = event.media;
		
		slideshowThenImage.image = event.media;
		
		if(event.media.height > event.media.width){
			isPhotoGalleryImagePortrait = true;
			
		} else {
			isPhotoGalleryImagePortrait = false;
		}
		
		// set image view
		Ti.API.debug('Our type was: '+event.mediaType);
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
			//imageView.image = image;
			imageViewOverlay.image = event.media;
		} else {
			// is this necessary?
		}

		//Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);

	},
	cancel:function(){

	},
	error:function(error)	{
	},
	allowEditing:false,
	popoverView:popoverView,
	arrowDirection:arrowDirection,
	mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
});
});

//Show camera button
var b2 = Titanium.UI.createButton({
	title:'Take photo',
	width:200,
	height:50,
	bottom:70
});

//Show camera event listener
b2.addEventListener('click', function(){
	
	Titanium.Media.showCamera({

	success:function(event)	{
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
	cancel:function(){

	},
	error:function(error){
		// create alert
		var a = Titanium.UI.createAlertDialog({title:'Camera'});

		// set message
		if (error.code == Titanium.Media.NO_CAMERA)	{
			a.setMessage('Device does not have video recording capabilities');
		} else {
			a.setMessage('Unexpected error: ' + error.code);
		}

		// show alert
		a.show();
	},
	allowEditing:false,
	saveToPhotoGallery: true,
	mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO,
	showControls : false,
	overlay:cameraOverlayView,
	transform: Ti.UI.create2DMatrix().scale(1),
	animated:false
});
});

var b3 = Titanium.UI.createButton({
	title:'Settings',
	width:200,
	height:50,
	bottom:10
});

//Settings event listener
b3.addEventListener('click', function(){
	//Create settings window
	var settingsWindow = Titanium.UI.createWindow({  
	    title:'Settings',
	    backgroundColor:'gray',
	    modal:true
	});
	
	//Settings close button
	var settingsCloseButton = Titanium.UI.createButton({
		title:'Close',
		width:200,
		height:50,
		bottom:10
	});
	
	//Settings close button event listener
	settingsCloseButton.addEventListener('click', function(){
		settingsWindow.close();
	});
	
	settingsWindow.add(settingsCloseButton);
	
	//settings table rows
	var settingsTableData = [];
	var row = Ti.UI.createTableViewRow();
	var label = Ti.UI.createLabel({
		text:'Default opacity',
		left:5
	});
	
	row.add(label);
	
	var labelOpacityValue = Ti.UI.createLabel({
		text:'25%',
		right:5
	})
	
	row.add(labelOpacityValue);
	
	settingsTableData.push(row);
	
	var tableviewSettings = Titanium.UI.createTableView({
		data:settingsTableData,
		style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		separatorColor:TABLE_SEPARATOR,
		bottom:40
	});
	
	settingsWindow.add(tableviewSettings);
	settingsWindow.open();
});

win1.add(b1);
win1.add(b2);
win1.add(b3);

//Orientation handling
Ti.Gesture.addEventListener('orientationchange',function(e) {
    Ti.App.fireEvent('orient', {portrait:e.source.isPortrait()});
});

Ti.App.addEventListener('orient', function(evt) {
	//var currentOrientation = Ti.UI.orientation;
	var currentOrientation = Ti.Gesture.getOrientation();
	
	Ti.API.info('ORIENTATION change to = '+currentOrientation);
	//alert('orientation '+currentOrientation);
	var matrix2d = Ti.UI.create2DMatrix();
	var matrix2dImage = Ti.UI.create2DMatrix();
	var degreesToRotate = 0;
	
	if(currentOrientation == Ti.UI.PORTRAIT){
		degreesToRotate = 0;
		imageViewOverlay.top = -52;
	} else if(currentOrientation == Ti.UI.UPSIDE_PORTRAIT){
		degreesToRotate = 180;	
		imageViewOverlay.top = -52;
	} else if(currentOrientation == Ti.UI.LANDSCAPE_LEFT){
		degreesToRotate = -90;
		matrix2dImage = matrix2dImage.scale(1.5);
		//matrix2dImage = matrix2dImage.scale(-1.5);
		imageViewOverlay.top = 0;
		
	} else if(currentOrientation == Ti.UI.LANDSCAPE_RIGHT){
		matrix2dImage = matrix2dImage.scale(1.5);
		degreesToRotate = 90;
		imageViewOverlay.top = 0;
	}
	
    Ti.API.info('Rotating '+degreesToRotate);
	matrix2d = matrix2d.rotate(degreesToRotate); // in degrees
	matrix2dImage = matrix2dImage.rotate(degreesToRotate); // in degrees
    
	var rotateFast = Ti.UI.createAnimation({
		transform: matrix2d,
		duration: 400
	});
	
	var rotateFastImage = Ti.UI.createAnimation({
		transform: matrix2dImage,
		duration: 400
	});
	
    imageViewOverlay.animate(rotateFastImage);
    //imageViewOverlay.animate(rotateFast);
    cameraFlashButon.animate(rotateFast);
    shutterButton.animate(rotateFast);
    cameraHideButon.animate(rotateFast);
    cameraSwitchButon.animate(rotateFast);
});	

win1.open();
