var proteinCenterOfMass;
var boca_piece_destinations;

var flash_colors;

//these get set in youtube story
var flash_time = 0;
var unflash_time = 0;

var movement_duration = 1.5;

var pullback_start_time = 3;
var cell_appears_time = 4;
var cell_move_time = 6;
var boca_explosion_start_time = 9;
var start_reproducing_time = 2;
var whole_thing_finish_time = 2000;

function update_bocavirus() {
	
	//-------camera Story stuff
	if( our_CurrentTime < pullback_start_time || whole_thing_finish_time < our_CurrentTime)
		EggCell.visible = false;
	else
		EggCell.visible = true;
	
	var cell_eaten_bocavirus_position = new THREE.Vector3( EggCell_initialposition.x - ( EggCell_initialposition.x - EggCell_radius ) * 2, 0, 0);
	
	for(var i = 0; i < EggCell.children.length; i++)
	{
		var phaseAddition = i/EggCell.children.length * 3;
		EggCell.children[i].scale.x = 1 + 0.04 * Math.sin(1.4* (our_CurrentTime-(cell_move_time+movement_duration+phaseAddition)));
		EggCell.children[i].scale.y = 1 + 0.04 * Math.sin(		our_CurrentTime-(cell_move_time+movement_duration+phaseAddition));
	}
	
	var eggCellPrevisiblePosition = EggCell_initialposition.clone();
	eggCellPrevisiblePosition.x += EggCell_radius * 1;
	
	if( our_CurrentTime < cell_appears_time + movement_duration )
		EggCell.position.copy( move_smooth_vectors(eggCellPrevisiblePosition, EggCell_initialposition, movement_duration, our_CurrentTime - cell_appears_time) );
	else if( our_CurrentTime < whole_thing_finish_time )
		EggCell.position.copy( move_smooth_vectors(EggCell_initialposition, cell_eaten_bocavirus_position, movement_duration, our_CurrentTime - cell_move_time) );
	else
		EggCell.position.copy( EggCell_initialposition );
	
	var rightmost_visible_x = EggCell_initialposition.x + EggCell_radius;
	var leftmost_visible_x = cell_eaten_bocavirus_position.x - EggCell_radius;
	var CEPx = ( rightmost_visible_x + leftmost_visible_x ) / 2;
	var CEPz = ( rightmost_visible_x - leftmost_visible_x ) / 2 / Math.tan( camera.fov / 360 * TAU / 2 );
//	console.log(( rightmost_visible_x - leftmost_visible_x ))
	var Cell_virus_visible_position = new THREE.Vector3( CEPx, 0, CEPz );
	
	var chap1camDefaultPosition = new THREE.Vector3(0,0,min_cameradist * 1.5);
	var pulledBackPosition = chap1camDefaultPosition.clone();
	pulledBackPosition.z = Cell_virus_visible_position.z;
	
	var cornucopia_camera_position = chap1camDefaultPosition.clone();
	cornucopia_camera_position.z *= 3;
	if( our_CurrentTime < cell_appears_time )
		camera.position.copy( move_smooth_vectors(chap1camDefaultPosition, pulledBackPosition, movement_duration, our_CurrentTime - pullback_start_time) );
	else if( our_CurrentTime < whole_thing_finish_time )
		camera.position.copy( move_smooth_vectors(pulledBackPosition, Cell_virus_visible_position, movement_duration, our_CurrentTime - cell_appears_time) );
	else
		camera.position.copy( chap1camDefaultPosition );
	
	
	//-------Rotation
	if(isMouseDown && !isMouseDown_previously && !Sounds.vertexGrabbed.isPlaying)
		Sounds.vertexGrabbed.play();
	if(!isMouseDown && isMouseDown_previously && !Sounds.vertexReleased.isPlaying)
		Sounds.vertexReleased.play();
	if( our_CurrentTime < cell_move_time + movement_duration || our_CurrentTime > whole_thing_finish_time )
	{
		if(isMouseDown) {
			bocavirus_MovementAngle = Mouse_delta.length() / 3;
			bocavirus_MovementAxis.set(-Mouse_delta.y, Mouse_delta.x, 0);
			bocavirus_MovementAxis.normalize();
			
			if( !Mouse_delta.equals( new THREE.Vector3() ) && rotation_understanding % 2 === 0 )
				rotation_understanding++;
		}
		else {
			bocavirus_MovementAngle *= 0.93;
		}
		if(!isMouseDown && rotation_understanding % 2 === 1)
			rotation_understanding++;
		
		var neo_bocavirus_axis = new THREE.Vector3();
		for(var i = 0; i < 60; i++) //the center ones don't need rotating
		{
			neo_bocavirus_proteins[i].updateMatrixWorld();
			neo_bocavirus_axis.copy(bocavirus_MovementAxis);
			neo_bocavirus_proteins[i].worldToLocal(neo_bocavirus_axis);
			neo_bocavirus_axis.normalize();
			neo_bocavirus_proteins[i].rotateOnAxis(neo_bocavirus_axis, bocavirus_MovementAngle);
			neo_bocavirus_proteins[i].updateMatrixWorld();
		}
	}
	
	//something random for the inner ones
	neo_bocavirus_proteins[60].quaternion.set(0.5000000020519008,0.8090169946743156,0.30901699027114626,0);
	neo_bocavirus_proteins[61].quaternion.set(-0.8090169559438056,0.3090169674858798,0.49999996515151934,0);
	neo_bocavirus_proteins[62].quaternion.set(0.49999999272583795,0.4999999985821715,-0.5,0.5000000031703612);
	neo_bocavirus_proteins[63].quaternion.set(0.8090170066863513,-0.5000000025362885,0,0.30901698773485736);

	//-------Colors
	var fadeto_time = 0.35;
	var fadeback_time = fadeto_time;
	var coloredness;
	if( our_CurrentTime < flash_time )
		coloredness = 0;
	else if( our_CurrentTime < flash_time + fadeto_time )
		coloredness = (our_CurrentTime - flash_time) / fadeto_time;
	else if( our_CurrentTime < unflash_time )
		coloredness = 1;
	else if( our_CurrentTime < unflash_time + fadeback_time )
		coloredness = 1 - ( our_CurrentTime - unflash_time ) / fadeback_time;
	else
		coloredness = 1;
	var default_r = 19/255;
	var default_g = 167/255;
	var default_b = 223/255;
	for(var i = 0; i < 60; i++)
	{
		var our_r = coloredness * flash_colors[i][0] + (1-coloredness) * default_r;
		var our_g = coloredness * flash_colors[i][1] + (1-coloredness) * default_g;
		var our_b = coloredness * flash_colors[i][2] + (1-coloredness) * default_b;
		
		neo_bocavirus_proteins[i].material.color.r = our_r;
		neo_bocavirus_proteins[i].material.color.g = our_g;
		neo_bocavirus_proteins[i].material.color.b = our_b;
	}
	
	//exploding
	var real_intended_destination = new THREE.Vector3();
	var boca_explosion_duration = 1.3;
	var boca_explodedness = ( our_CurrentTime - boca_explosion_start_time ) / boca_explosion_duration;
	if( boca_explodedness > 1 )
		boca_explodedness = 1;
	if( our_CurrentTime > whole_thing_finish_time )
		boca_explodedness = 0;
	
	if( cell_move_time + movement_duration < our_CurrentTime && our_CurrentTime < whole_thing_finish_time ) //at this time they get assigned (it has to be sensetive to the orientation of the thing)
		stmvHider.visible = false;
	else
		stmvHider.visible = true;
	
	{
		var point_along = move_smooth(1, boca_explodedness);

		EggCell.children[0].updateMatrixWorld();
		if(destination_assignments[0] !== 999 )
		{
			for(var i = 0; i < 60; i++ )
			{
				neo_bocavirus_proteins[destination_assignments[i]].position.copy(boca_piece_destinations[i]);
				neo_bocavirus_proteins[destination_assignments[i]].position.multiplyScalar(point_along);
				
				if( cell_move_time + movement_duration < our_CurrentTime && our_CurrentTime < whole_thing_finish_time )
				{
					neo_bocavirus_proteins[i].position.sub(EggCell.position);
					EggCell.children[0].localToWorld(neo_bocavirus_proteins[i].position );
				}
				
				neo_bocavirus_proteins[destination_assignments[i]].updateActualLocation();
				var actualLocationContribution = ((neo_bocavirus_proteins[destination_assignments[i]].actual_location.clone()).sub(neo_bocavirus_proteins[destination_assignments[i]].position)).multiplyScalar(point_along);
				neo_bocavirus_proteins[destination_assignments[i]].position.sub( actualLocationContribution );
			}
		}
	}
	if( our_CurrentTime < cell_move_time + movement_duration || whole_thing_finish_time < our_CurrentTime )
	{
		var undulationMultiplier = 1;
		if(isMouseDown)
			undulationMultiplier = 3;
		var phases = [Math.cos((ourclock.elapsedTime*undulationMultiplier - ourclock.startTime)*5 + TAU / 2),
		              Math.cos((ourclock.elapsedTime*undulationMultiplier - ourclock.startTime)*3.5 + TAU / 3),
		              Math.cos((ourclock.elapsedTime*undulationMultiplier - ourclock.startTime)*4 + TAU / 4),
		              Math.cos((ourclock.elapsedTime*undulationMultiplier - ourclock.startTime)*4.5 + TAU / 5) ];
		for(var i = 0; i < 60; i++ )
		{
			neo_bocavirus_proteins[i].position.set(0,0,0);
			neo_bocavirus_proteins[i].updateActualLocation();
			var undulateVector = neo_bocavirus_proteins[i].actual_location.clone();
			undulateVector.setLength( phases[Math.floor(i/15)] * 0.0168 );
			neo_bocavirus_proteins[i].position.add( undulateVector );
		}
	}
	
	for(var i = 0; i < reproduced_proteins.length; i++)
	{
		if( our_CurrentTime - start_reproducing_time > i * 0.8 )
		{
			var currentSize = reproduced_proteins[i].scale.x;
			var newSize = currentSize + 0.03;
			if(newSize > 1) newSize = 1;
			reproduced_proteins[i].scale.setScalar(newSize);
		}
	}
}

var destination_assignments = Array(neo_bocavirus_proteins.length);

var EggCell_radius = 26;
var spayed_circle_radius = 10;
var EggCell_initialposition = new THREE.Vector3( EggCell_radius + spayed_circle_radius * 1.1,0,0);

function init_bocavirus_stuff()
{
	function changePosition(newPosition)
	{
		//want to put it in... the position that it would be in to have its actual_location at newPosition
		this.position.copy(newPosition);
		this.updateActualLocation();
		this.position.sub(this.actual_location);
		this.position.add(newPosition);
		this.updateActualLocation();
	}
	

	function updateActualLocation()
	{
		this.actual_location.copy(proteinCenterOfMass);
		this.updateMatrix();
		this.actual_location.applyMatrix4(this.matrix); //untested
	}
	
	for( var i = 0; i < destination_assignments.length; i++ )
		destination_assignments[i] = 999;
	
	var normalized_virtualico_vertices = Array(12);
	normalized_virtualico_vertices[0] = new THREE.Vector3(0, 	1, 	PHI);
	normalized_virtualico_vertices[1] = new THREE.Vector3( PHI,	0, 	1);
	normalized_virtualico_vertices[2] = new THREE.Vector3(0,	-1, PHI);
	normalized_virtualico_vertices[3] = new THREE.Vector3(-PHI,	0, 	1);
	normalized_virtualico_vertices[4] = new THREE.Vector3(-1, 	PHI,0);
	normalized_virtualico_vertices[5] = new THREE.Vector3( 1, 	PHI,0);
	normalized_virtualico_vertices[6] = new THREE.Vector3( PHI,	0,	-1);
	normalized_virtualico_vertices[7] = new THREE.Vector3( 1,	-PHI,0);
	normalized_virtualico_vertices[8] = new THREE.Vector3(-1,	-PHI,0);
	normalized_virtualico_vertices[9] = new THREE.Vector3(-PHI,	0,	-1);
	normalized_virtualico_vertices[10] = new THREE.Vector3(0, 	1,	-PHI);
	normalized_virtualico_vertices[11] = new THREE.Vector3(0,	-1,	-PHI);
	for(var i = 0; i < 12; i++)
		normalized_virtualico_vertices[i].normalize();
	
	var master_protein = new THREE.Mesh( new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({color:0x7997B3}) );
	
	proteinCenterOfMass = new THREE.Vector3(0,0,0);
	for(var i = 0,il=protein_vertices_numbers.length; i < il; i++){
		protein_vertices_numbers[i] /= 32;
		if(i%3===0)proteinCenterOfMass.x += protein_vertices_numbers[i];
		if(i%3===1)proteinCenterOfMass.y += protein_vertices_numbers[i];
		if(i%3===2)proteinCenterOfMass.z += protein_vertices_numbers[i];
	}
	proteinCenterOfMass.multiplyScalar(3/protein_vertices_numbers.length);
	
	master_protein.geometry.addAttribute( 'position', new THREE.BufferAttribute( protein_vertices_numbers, 3 ) );
	master_protein.geometry.setIndex( new THREE.BufferAttribute( coarse_protein_triangle_indices, 1 ) );
	
	var outlineColor = 0x000000;
	
	stmvHider = new THREE.Mesh(new THREE.CircleBufferGeometry(2.2,32),new THREE.MeshBasicMaterial({color:outlineColor}));
	stmvHider.position.z = 0.001;
	
	//aligns it with the color transformations we're going to do
	{
		var threefold_axis = new THREE.Vector3(1,1,1);
		threefold_axis.normalize();
		var fivefold_axis = normalized_virtualico_vertices[0].clone();
		master_protein.rotateOnAxis(threefold_axis, TAU / 3);
		master_protein.updateMatrixWorld();
		var tempaxis = fivefold_axis.clone();
		master_protein.worldToLocal(tempaxis);
		master_protein.rotateOnAxis(tempaxis, TAU / 5);
		master_protein.updateMatrixWorld();
	}
	
	//a way of avoiding intersections
	var twistAxis = proteinCenterOfMass.clone().normalize();
	master_protein.rotateOnAxis(twistAxis, 0.16); //just making it simpler
	master_protein.updateMatrixWorld();
	
	var bottomLayerGeometry = master_protein.geometry.clone();
	var bottomScale = 0.72;
	var top_layer_geometry = master_protein.geometry.clone();
	var topScale = 0.84; //carefully tuned so none of them penetrate. You can make the colored part larger but you have to make the outline smaller
	
//	var middle_layer_geometry = master_protein.geometry.clone();
//	var middleScale = (bottomScale + topScale)/2;
	
	for(var i = 0, il = bottomLayerGeometry.attributes.position.array.length / 3; i < il; i++ )
	{
		bottomLayerGeometry.attributes.position.array[i*3+0] = 	( bottomLayerGeometry.attributes.position.array[i*3+0] 	- proteinCenterOfMass.x ) * bottomScale + proteinCenterOfMass.x;
		bottomLayerGeometry.attributes.position.array[i*3+1] = 	( bottomLayerGeometry.attributes.position.array[i*3+1] 	- proteinCenterOfMass.y ) * bottomScale + proteinCenterOfMass.y;
		bottomLayerGeometry.attributes.position.array[i*3+2] = 	( bottomLayerGeometry.attributes.position.array[i*3+2] 	- proteinCenterOfMass.z ) * bottomScale + proteinCenterOfMass.z;
		
//		middle_layer_geometry.attributes.position.array[i*3+0] = 			( middle_layer_geometry.attributes.position.array[i*3+0] 			- proteinCenterOfMass.x ) * middleScale + proteinCenterOfMass.x;
//		middle_layer_geometry.attributes.position.array[i*3+1] = 			( middle_layer_geometry.attributes.position.array[i*3+1] 			- proteinCenterOfMass.y ) * middleScale + proteinCenterOfMass.y;
//		middle_layer_geometry.attributes.position.array[i*3+2] = 			( middle_layer_geometry.attributes.position.array[i*3+2] 			- proteinCenterOfMass.z ) * middleScale + proteinCenterOfMass.z;
		
		top_layer_geometry.attributes.position.array[i*3+0] = 			( top_layer_geometry.attributes.position.array[i*3+0] 			- proteinCenterOfMass.x ) * topScale + proteinCenterOfMass.x;
		top_layer_geometry.attributes.position.array[i*3+1] = 			( top_layer_geometry.attributes.position.array[i*3+1] 			- proteinCenterOfMass.y ) * topScale + proteinCenterOfMass.y;
		top_layer_geometry.attributes.position.array[i*3+2] = 			( top_layer_geometry.attributes.position.array[i*3+2] 			- proteinCenterOfMass.z ) * topScale + proteinCenterOfMass.z;
	}
	
	for(var i = 0; i < neo_bocavirus_proteins.length; i++)
	{
		neo_bocavirus_proteins[i] = new THREE.Mesh( bottomLayerGeometry, master_protein.material.clone() );
//		neo_bocavirus_proteins[i].add( new THREE.Mesh( middle_layer_geometry, 	new THREE.MeshBasicMaterial({color:outlineColor, side:THREE.BackSide}) ) );
		neo_bocavirus_proteins[i].add( new THREE.Mesh( top_layer_geometry, new THREE.MeshBasicMaterial({color:outlineColor, side:THREE.BackSide}) ) );
		neo_bocavirus_proteins[i].rotation.copy(master_protein.rotation)
		neo_bocavirus_proteins[i].updateMatrixWorld();
		
		neo_bocavirus_proteins[i].actual_location = new THREE.Vector3();
		neo_bocavirus_proteins[i].updateActualLocation = updateActualLocation;
		neo_bocavirus_proteins[i].changePosition = changePosition;
	}	
	
	//----------Creating the group
	//"1"
	var axis1 = normalized_virtualico_vertices[0].clone();
//	axis1.add(normalized_virtualico_vertices[3]);
	rotate_protein_bunch(axis1, 2 * TAU / 5, 1);
	
//	//"2"
	var axis2 = normalized_virtualico_vertices[0].clone();
	axis2.add(normalized_virtualico_vertices[4]);
	rotate_protein_bunch(axis2, TAU / 2, 2);
//	
//	//"3"
	var axis3a = normalized_virtualico_vertices[0].clone();
	rotate_protein_bunch(axis3a, TAU / 5, 3);
	var axis3b = normalized_virtualico_vertices[4].clone();
	axis3b.add(normalized_virtualico_vertices[3]);
	rotate_protein_bunch(axis3b, TAU / 2, 3);
	
//	//"4"
	var axis4a = normalized_virtualico_vertices[0].clone();
	axis4a.add(normalized_virtualico_vertices[4]);
	rotate_protein_bunch(axis4a,TAU / 2, 4);
	var axis4b = normalized_virtualico_vertices[4].clone();
	rotate_protein_bunch(axis4b,3*TAU / 5, 4);
	
	//tripling the proteins, now you have 15.
	for(var j = 0; j < 60; j += 15)
	{
		for(var i = 5; i < 10; i++ )
		{
			var specific_da = new THREE.Vector3(1,1,1);
			specific_da.normalize();
			neo_bocavirus_proteins[j+i].worldToLocal(specific_da);
			neo_bocavirus_proteins[j+i].rotateOnAxis(specific_da, TAU / 3);
			neo_bocavirus_proteins[j+i].updateMatrixWorld();
		}
		
		for(var i =10; i < 15; i++ )
		{
			var specific_da = new THREE.Vector3(1,1,1);
			specific_da.normalize();
			neo_bocavirus_proteins[j+i].worldToLocal(specific_da);
			neo_bocavirus_proteins[j+i].rotateOnAxis(specific_da, 2 * TAU / 3);
			neo_bocavirus_proteins[j+i].updateMatrixWorld();
		}
	}
	
	flash_colors = Array(60);
	for(var i = 0; i < flash_colors.length; i++ )
		flash_colors[i] = Array(3);
	for(var i = 0; i < 15; i++)
	{
		flash_colors[i][0] = 93/255;
		flash_colors[i][1] = 167/255;
		flash_colors[i][2] = 223/255;
	}
		
	
	for(var i = 15; i < 30; i++)
	{
		var specific_da = new THREE.Vector3(1,0,0);
		neo_bocavirus_proteins[i].worldToLocal(specific_da);
		neo_bocavirus_proteins[i].rotateOnAxis(specific_da, TAU / 2);
		neo_bocavirus_proteins[i].updateMatrixWorld();
		
		flash_colors[i][0] = 72/255;
		flash_colors[i][1] = 116/255;
		flash_colors[i][2] = 160/255;
	}
	for(var i = 30; i < 45; i++)
	{
		var specific_da = new THREE.Vector3(0,1,0);
		neo_bocavirus_proteins[i].worldToLocal(specific_da);
		neo_bocavirus_proteins[i].rotateOnAxis(specific_da, TAU / 2);
		neo_bocavirus_proteins[i].updateMatrixWorld();
		
		flash_colors[i][0] = 167/255;
		flash_colors[i][1] = 199/255;
		flash_colors[i][2] = 222/255;
	}
	for(var i = 45; i < 60; i++)
	{
		var specific_da = new THREE.Vector3(0,0,1);
		neo_bocavirus_proteins[i].worldToLocal(specific_da);
		neo_bocavirus_proteins[i].rotateOnAxis(specific_da, TAU / 2);
		neo_bocavirus_proteins[i].updateMatrixWorld();
		
		flash_colors[i][0] = 215/255;
		flash_colors[i][1] = 243/255;
		flash_colors[i][2] = 253/255;
	}
	
	EggCell = new THREE.Object3D();
	for(var i = 0; i < 6; i++)
	{
		EggCell.add( new THREE.Mesh(new THREE.PlaneGeometry(EggCell_radius * 2,EggCell_radius * 2),
				new THREE.MeshBasicMaterial({transparent: true} ) ) );
	}
	EggCell.position.copy(EggCell_initialposition);
	
	Cornucopia = new THREE.Mesh(new THREE.PlaneGeometry(playing_field_dimension*3,playing_field_dimension*3),
			new THREE.MeshBasicMaterial() );
	Cornucopia.position.z = -0.01;
	Cornucopia.visible = false;
	
	boca_piece_destinations = Array( neo_bocavirus_proteins.length );
	
	var too_close_to_others = 0;
	//they're arranged so r is going down
	for( var i = 0; i < 60; i++ )
	{
		boca_piece_destinations[i] = new THREE.Vector3();
		
		do {
			var dest_angle = Math.random() * TAU;
			
			boca_piece_destinations[i].x = Math.cos(dest_angle) * (i / boca_piece_destinations.length * 0.8 + 0.2) * spayed_circle_radius;
			boca_piece_destinations[i].y = Math.sin(dest_angle) * (i / boca_piece_destinations.length * 0.8 + 0.2) * spayed_circle_radius;
			
			too_close_to_others = 0;
			for( var j = 0; j < i; j++)
			{
				if( boca_piece_destinations[i].distanceTo(boca_piece_destinations[j]) < 1.3 )
					too_close_to_others = 1;
			}
		} while( boca_piece_destinations[i].length() > spayed_circle_radius || too_close_to_others === 1 )
	}
	var center_few_radius = 0.66;
	boca_piece_destinations[60] = new THREE.Vector3(center_few_radius,center_few_radius,0);
	boca_piece_destinations[61] = new THREE.Vector3(center_few_radius,-center_few_radius,0);
	boca_piece_destinations[62] = new THREE.Vector3(-center_few_radius,center_few_radius,0);
	boca_piece_destinations[63] = new THREE.Vector3(-center_few_radius,-center_few_radius,0);
	
	var rpPositions = [
			new THREE.Vector3(0,-11.9,0),
			new THREE.Vector3(8,2.76,0),
			new THREE.Vector3(-10.5,-19.7,0),
			new THREE.Vector3(17.180197621916296, 11.30955744796198,0),
			new THREE.Vector3(-14.607932149106873, 15.40033137013632,0),
			
			new THREE.Vector3(5.080356745290311, -10.292470489537159,0),
			new THREE.Vector3(-0.1,19.4,0),
			new THREE.Vector3(-20.97264603953411, -4.64231552675,0),
			new THREE.Vector3(8.854115836977508, -7.854532536103758,0),
			new THREE.Vector3(4.706960263530341, 11.606081319864234,0),
			
			new THREE.Vector3(20.318191179008444, -4.230280996777467, 0),
			new THREE.Vector3(-4.781952601117331, 7.3719618689,0),
			new THREE.Vector3(-14.534318401591644, 8.298928431069033,0),
			new THREE.Vector3(3.5956206890328177, 20.41585589614,0),
			new THREE.Vector3(-13.847488396507488, -12.792329,0)
	                   ];
	
	//the extra ones
	for(var i = 0; i < reproduced_proteins.length; i++)
	{
		reproduced_proteins[i] = new THREE.Mesh( master_protein.geometry.clone(), master_protein.material.clone() );
		reproduced_proteins[i].material.transparent = true;
		reproduced_proteins[i].material.color.setHex(0xD7F3FD)
		reproduced_proteins[i].rotation.copy(master_protein.rotation)
		reproduced_proteins[i].updateMatrixWorld();
		reproduced_proteins[i].geometry.computeFaceNormals();
		reproduced_proteins[i].geometry.computeVertexNormals();
		
		reproduced_proteins[i].actual_location = new THREE.Vector3();
		reproduced_proteins[i].updateActualLocation = updateActualLocation;
		reproduced_proteins[i].changePosition = changePosition;
		
		reproduced_proteins[i].scale.setScalar(0.00001);
		
		reproduced_proteins[i].position.copy(rpPositions[i]);
	}
	
	var protein_assigned = new Uint16Array(neo_bocavirus_proteins.length);
	for(var i = 0; i < protein_assigned.length; i++)
		protein_assigned[i] = 0;
	
	for(var i = 0; i < 60; i++ )
	{	
		var closest_length = 1000;
		for(var j = 0; j < 60; j++)
		{
			if(!protein_assigned[j])
			{
				if( neo_bocavirus_proteins[j].actual_location.distanceTo(boca_piece_destinations[i]) < closest_length)
				{
					destination_assignments[i] = j;
					closest_length = neo_bocavirus_proteins[j].actual_location.distanceTo( boca_piece_destinations[i] );
				}
			}
		}
		protein_assigned[ destination_assignments[i] ] = 1;
	}
	for(var i = 60; i < neo_bocavirus_proteins.length; i++ )
	{
		destination_assignments[i] = i;
	}	
}

//the seed index is which, in the group of five proteins in the "fundamental domain" like thing, this refers to
function rotate_protein_bunch(ouraxis, amt, seed_index)
{
	neo_bocavirus_proteins[seed_index].worldToLocal(ouraxis);
	ouraxis.normalize();
	for(var i = 0; i < 12; i++)
	{
		neo_bocavirus_proteins[i*5+seed_index].rotateOnAxis(ouraxis, amt);
		neo_bocavirus_proteins[i*5+seed_index].updateMatrixWorld();
	}
}