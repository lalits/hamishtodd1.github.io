/*
	OI JOHN AND IAN WHAT DO I FRIKKIN DO

	May want to pull out an actual picture of a mouse cursor and put it where you want

	The youtube thing is a colossal perverse incentive
		Subtleties in interactive learning is your raison d'etre, but here we are, making something non-interactive

	TODO for slack demo:
		-VR interaction / funkiness in which you move your head and hand around and camera is in right place
		-Working on tablets. Phones get embed and maybe message. No need to worry about address bar

	Once presentation is done
		-Would be nice if people could spectate live
		-send to haxiomic, get "make it nicer looking for free by doing this:"
		-fix lighting
		-editing suite?

	First things to put in/actually do
		-my favourite 3d patterns/neoshapes
		-Something with bloody puzzles
		-pwg
		-Maryam Mirzakhani, 14th of July

	You can bring interface bits on and off, less need to think about some great big "game state" thing
*/

(function init()
{
	var vrAndRecording = WEBVR && WEBVR.isAvailable() && window.location.href === "http://localhost:9090/";
	if(vrAndRecording)
	{
		console.log("Full setup")
	}
	else
	{
		console.log("Playback setup")
	}
	var platform = getPlatform()
	if(platform === "phone" )
	{
		//and a message telling you it's better on desktop
		var iframe = document.createElement("iframe");
	    iframe.setAttribute("src","https://www.youtube.com/embed/agOdP2Bmieg"); 
	    iframe.style.width  = window.innerWidth;
	    iframe.style.height = window.innerHeight;

	    document.body.appendChild(iframe);
	    return;
	}

	var launcher = {
		initCompleted:false,
		dataLoaded:{
			recordedFrames:false,
		},
		attemptLaunch: function()
		{
			for(var data in this.dataLoaded)
			{
				if( !this.dataLoaded[data] )
				{
					return;
				}
			}

			if(!this.initCompleted)
			{
				return;
			}

			render();
		}
	}

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor(0xFFFFFF)
	document.body.appendChild( renderer.domElement );

	initCameraAndRendererResizeSystemAndCameraRepresentation(renderer);

	var ourVrEffect = new THREE.VREffect( renderer );

	function render()
	{
		loop( controllers, vrAndRecording )
		ourVrEffect.requestAnimationFrame( function()
		{
			//a reasonable indicator is ourVREffect.isPresenting
			ourVrEffect.render( scene, camera );
			render();
		} );
	}
	
	initPlaybackSystemAndMaybeRecordingSystem( launcher, vrAndRecording );

	setUpSpectatorScene()
	addExtraForVR()

	var controllers = initControllers();
	if( vrAndRecording )
	{
		initVrInputSystem(controllers, ourVrEffect, renderer);
	}

	// var goose = new Goose();
	// goose.position.z = -0.1
	// scene.add(goose);

	mouse = initMouse(renderer);

	// initPwg();
	
	// initStereographicThreeSphere();
	// initStereographicTwoSphere();
	// initShapeMaker();
	// initIrreg();
	// initMyGraph();
	// initVectorFields();
	initDogGame();
	
	// var allPolyhedra = [];
	// initSnapShapes( allPolyhedra );
	// initSnapShapesPresentation( allPolyhedra );

	{
		// var testObject = new THREE.Mesh( new THREE.SphereGeometry(0.01), new THREE.MeshLambertMaterial( {} ) );
		// camera.add(testObject);
		// testObject.position.z = -0.1;
		// // testObject.update = function()
		// // {
		// // 	this.position.y = 0.01*Math.sin(ourClock.getElapsedTime()*4);
		// // 	this.rotation.z = Math.sin(ourClock.getElapsedTime()*4.1);
		// // }
		// bestowDefaultMouseDragProperties(testObject);
		// markedThingsToBeUpdated.push(testObject);
		// clickables.push(testObject);
		// markObjectProperty(testObject.scale,"y")
		// markPositionAndQuaternion(testObject);

		// function testChangeValue(valueBetweenZeroAndOne)
		// {
		// 	testObject.scale.y = 1 + 0.7 * (valueBetweenZeroAndOne-0.5);
		// }
		// var testSlider = SliderSystem(testChangeValue, 0, true );
		// testObject.scale.y = 1;
		// testSlider.setValue(0.5)
		// testSlider.setDimensions(0.1)
		// testSlider.position.set(0,0.08,-0.4)
		// scene.add(testSlider)
		// markedThingsToBeUpdated.push(testSlider);

		// initImages();
	}

	launcher.initCompleted = true;
	launcher.attemptLaunch();
})();