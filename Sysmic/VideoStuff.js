function initVideo()
{	
	// create the video element
	video = document.createElement( 'video' );
	video.src = "http://hamishtodd1.github.io/Sysmic/Data/Movie_0002.mp4";
	video.crossOrigin = "anonymous";
	
	 video.id = 'video';
	 video.type = ' video/mp4; codecs="theora, vorbis" ';
	
	video.load(); // must call after setting/changing source
	video.play();
	
//	video.currentTime = 290; //don't worry about the first column
	
	var videoImage = document.createElement( 'canvas' );
	videoImage.width = 640;
	videoImage.height = 480;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	movieScreen = new THREE.Mesh( 
			new THREE.PlaneGeometry( VIEWBOX_WIDTH,VIEWBOX_HEIGHT ),
			new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } ) );
	movieScreen.position.set(0,0,0);

	movieScreen.add(boundingbox.clone());
	
	Scene.add(movieScreen);
}

function update_video()
{
	if( typeof video !== 'undefined' && video.readyState === video.HAVE_ENOUGH_DATA)
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}
	
	if( Math.abs(MousePosition.x) < VIEWBOX_WIDTH / 2
		&& Math.abs(MousePosition.y) < VIEWBOX_HEIGHT / 2 
		&& isMouseDown && !isMouseDown_previously)
	{
		if( video.paused && !video.ended )
			video.play();
		else
			video.pause();
	}
}