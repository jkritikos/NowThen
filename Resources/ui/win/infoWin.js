	var googleLink = "http://google.com";
	
	//Create info window
	var infoWindow = Titanium.UI.createWindow({
		title : 'Info',
		backgroundImage : 'images/bg/background_metal_cells.png',
		modal : true,
		navBarHidden:true
	});
	
	var infoCloseButton = Titanium.UI.createButton({
		backgroundImage : "images/info/back_button.png",
		backgroundFocusedImage:"images/main/back_button_pressed.png",
		width: 102,
		height: 88,
		right : 0,
		bottom : 0
	});
	
	var websiteButton = Titanium.UI.createButton({
		backgroundImage: "images/info/website_button.png",
		backgroundFocusedImage: "images/info/website_button_shaded.png",
		width:458,
		height:182,
		top:50
	});
	
	var guideButton = Titanium.UI.createButton({
		backgroundImage: "images/info/guide_button.png",
		backgroundFocusedImage: "images/info/guide_button_shade.png",
		width: 458,
		height:182,
		top:150
	});
	
	//Info Close button event listener
	infoCloseButton.addEventListener('click', function() {
		infoWindow.close();
	});
	
	websiteButton.addEventListener('click',function () {
		Titanium.Platform.openURL(googleLink); 
	});

	infoWindow.add(infoCloseButton);
	infoWindow.add(websiteButton);
	infoWindow.add(guideButton);
	