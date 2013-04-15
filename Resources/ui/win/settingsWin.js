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
		
if (Titanium.App.Properties.getString('opacity')!=null){	
	Ti.API.info('Getting opacity value:'+Titanium.App.Properties.getString('opacity'));	
	opacity=parseInt(Titanium.App.Properties.getString('opacity'));
	if (opacity==0) opacityIndex=0;
	else if (opacity==25) opacityIndex=1;
	else if (opacity==50) opacityIndex=2;
	else opacityIndex=3;
	Ti.API.info('Start-Opacity:'+opacity+",OpacityIndex:"+opacityIndex);	
}

		
var opacityImages =["opacity_button_0.png","opacity_button_25.png","opacity_button_50.png","opacity_button_100.png"];
	
var opacityButton = Titanium.UI.createButton({
	backgroundImage : "images/settings/"+opacityImages[opacityIndex],
	width: 322,
	height: 106,
	top :100 
});
	
opacityButton.addEventListener('click', function() {	
	if (opacityIndex==3)  opacityIndex=0;
	 else 	 opacityIndex++
	
	var imgPath="images/settings/"+opacityImages[opacityIndex];
		
	if (opacityIndex==0) opacity=0;
	else if (opacityIndex==1) opacity=15;
	else if (opacityIndex==2) opacity=50;
	else if (opacityIndex==3) opacity=100;
	
	Titanium.App.Properties.setString('opacity',  opacity);	
	opacityButton.setBackgroundImage(imgPath);
});

var slideshowIndex = 1;
var slideshowImages = ["slideshow_button_off.png","slideshow_button_on.png" ];
		
var slideShowButton = Titanium.UI.createButton({
	backgroundImage: "images/settings/"+slideshowImages[slideshowIndex],
	width: 322,
	height: 106,
	top: 200
});

slideShowButton.addEventListener('click',function() {
	if (slideshowIndex==1) {
		slideshowIndex=0;
		slideshow=true;
	} else {
		slideshowIndex=0;
		slideshow=false;
	}
	slideShowButton.setBackgroundImage("images/settings/"+slideshowImages[slideshowIndex]);
	
});
		
		
		
		
settingsWindow.add(opacityButton);
settingsWindow.add(slideShowButton);


