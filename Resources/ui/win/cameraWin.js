//Opacity slider
var opacitySlider = Ti.UI.createSlider({
	min : 0,
	max : 10,
	value : 0,
	width : 300,
	height : 'auto',
	bottom: 100,
	zIndex : 102
});

opacitySlider.addEventListener('change', function(e) {
	//Ti.API.warn('Basic Slider - value = ' + Math.round(e.value) + ' act val ' + Math.round(opacitySlider.value));
	var value = Math.round(opacitySlider.value);
	var imgOpacity = 0;

	if (value == 10) imgOpacity = 1.0;
	else if (value == 9) imgOpacity = 0.9;
	else if (value == 8) imgOpacity = 0.8;
	else if (value == 7) imgOpacity = 0.7;
	else if (value == 6) imgOpacity = 0.6;
	else if (value == 5) imgOpacity = 0.5;
	else if (value == 4) imgOpacity = 0.4;
	else if (value == 3) imgOpacity = 0.3;
	else if (value == 2) imgOpacity = 0.2;
	else if (value == 1) imgOpacity = 0.1;
	else if (value == 0) imgOpacity = 0.0;	
	imageViewOverlay.opacity = imgOpacity;
	
});

//Shutter button
var shutterButton = Ti.UI.createButton({
	backgroundImage: "images/camera/vertical/camera_button.png",
	backgroundFocusedImage: "images/camera/vertical/camera_button_pressed.png",
	backgroundSelectedImage: "images/camera/vertical/camera_button_pressed.png",
	focusable:true,
	width : 93,
	height: 62,
	left : 116,
	bottom:16
});

//Shutter button event listener
shutterButton.addEventListener('click', function() {
	Ti.API.debug('Animating slideshowViewContainer');	
	slideshowViewContainer.animate(anim_in);			
	Ti.Media.takePicture();		
});

//Camera hide button
var cameraHideButon = Ti.UI.createButton({
	backgroundImage : "images/camera/vertical/back_button.png",
	backgroundFocusedImage:"images/camera/vertical/back_button_pressed.png",
	backgroundSelectedImage:"images/camera/vertical/back_button_pressed.png",
	focusable:true,
	width: 102,
	height: 88,
	right : 0,
	bottom: 0
});

//Camera hide button event listener
cameraHideButon.addEventListener('click', function() {
	cameraViewDisplayed=false;
	Ti.Media.hideCamera();
	
});

//Camera switch button
var cameraSwitchButon = Ti.UI.createButton({
	backgroundImage: "images/camera/vertical/camera_rotate_button.png",
	backgroundFocusedImage: "images/camera/vetical/camera_rotate_button_pressed.png",
	backgroundSelectedImage: "images/camera/vetical/camera_rotate_button_pressed.png",
	focusable:true,	
	width : 135,
	height: 75, 
	right:0,
	top:0
});

//Camera switch button event listener
cameraSwitchButon.addEventListener('click', function() {
	if (Ti.Media.camera == Ti.Media.CAMERA_FRONT) Ti.Media.switchCamera(Ti.Media.CAMERA_REAR);
	else  Ti.Media.switchCamera(Ti.Media.CAMERA_FRONT);
	
});

//Camera flash button
var cameraFlashButon = Ti.UI.createButton({
	backgroundImage: "images/camera/vertical/flash_button_auto.png",
	backgroundFocusedImage: "images/camera/vetical/camera_rotate_button_pressed.png",
	backgroundSelectedImage: "images/camera/vetical/camera_rotate_button_pressed.png",
	focusable:true,	
	width : 135,
	height: 75, 
	left:0,
	top:0	
});

//Flash button event listener
cameraFlashButon.addEventListener('click', function() {
	if (Ti.Media.cameraFlashMode == Ti.Media.CAMERA_FLASH_AUTO){ 
		Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_ON;
		cameraFlashButon.setBackgroundImage("images/camera/vertical/flash_button_on.png");
	} else if (Ti.Media.cameraFlashMode == Ti.Media.CAMERA_FLASH_ON)  {
		Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_OFF;
		cameraFlashButon.setBackgroundImage("images/camera/vertical/flash_button_off.png");
	} else {
		Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_AUTO;
		cameraFlashButon.setBackgroundImage("images/camera/vertical/flash_button_auto.png");
	}
});

//The camera toolbar
var cameraOverlayBottomToolbarView = Ti.UI.createView({
	bottom : 0,
	width : 320,
	height : 108,
	zIndex : 100,
	backgroundImage: "images/camera/vertical/bottom_menu.png"
});

var cameraOverlayTopToolbarView = Ti.UI.createView({
	top:0 ,
	width: 320,
	height: 85,
	zIndex:100,
	backgroundImage: "images/camera/vertical/top_border_background.png"
});

//Add the items to the camera toolbar
cameraOverlayBottomToolbarView.add(shutterButton);
cameraOverlayBottomToolbarView.add(cameraHideButon);
cameraOverlayTopToolbarView.add(cameraSwitchButon);
cameraOverlayTopToolbarView.add(cameraFlashButon);

//The actual overlay on the camera
var cameraOverlayView = Titanium.UI.createView({
	top : 0,
	left : 0,
	zIndex: 0
});

//cameraOverlayView.add(flashModeLabelView);
cameraOverlayView.add(opacitySlider);
cameraOverlayView.add(cameraOverlayTopToolbarView);
cameraOverlayView.add(cameraOverlayBottomToolbarView);
cameraOverlayView.add(imageViewOverlay);