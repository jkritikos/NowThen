var settingsWindow = Titanium.UI.createWindow({
		title : 'Settings',
		backgroundImage : 'images/bg/settings_background.png',
		modal : true,
		navBarHidden:true		
	});
	
//Settings close button
var settingsCloseButton = Titanium.UI.createButton({	
		backgroundImage : "images/settings/back_button.png",
		backgroundFocusedImage:"images/settings/back_button_pressed.png",
		width: 102,
		height: 88,
		right : 0,
		bottom : 0
	});
	
//Settings close button event listener
settingsCloseButton.addEventListener('click', function() {
		settingsWindow.close();
	});
	
settingsWindow.add(settingsCloseButton);
		
var opacityImages =["opacity_button_0.png","opacity_button_25.png","opacity_button_50.png","opacity_button_100.png"];
	
var opacityButton = Titanium.UI.createButton({
		backgroundImage : "images/settings/"+opacityImages[opacityIndex],
		width: 308,
		height: 82,
		top :100 
	});
	
opacityButton.addEventListener('click', function() {
			if (opacityIndex==3) opacityIndex=0;
			else opacityIndex++;
			var imgPath="images/settings/"+opacityImages[opacityIndex];
			//Ti.API.info("Image path:"+imgPath);
			opacityButton.setBackgroundImage(imgPath);
		});
		
var slideshowSlider = Titanium.UI.createSwitch({
			value : false,
			top:250,
			backgroundImage:'images/settings/slideshow_button_off.png'//,
			//highlightedThumbImage:'images/settings/slideshow_button off_shaded transition.png'
		});
		
settingsWindow.add(opacityButton);
settingsWindow.add(slideshowSlider);


