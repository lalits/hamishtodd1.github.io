function initialize_QS_stuff()
{	
	QS_center = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({color:0x000000, transparent: true, opacity:0}));
	var starting_triangle_vertices = Array(3);
	starting_triangle_vertices[0] = new THREE.Vector3(0,0.05,0);
	starting_triangle_vertices[1] = new THREE.Vector3( 0.073,-0.3,0);
	starting_triangle_vertices[2] = new THREE.Vector3(-0.073,-0.3,0);
	for(var i = 0; i < 5; i++)
	{
		for(var j = 0; j < 3; j++)
			QS_center.geometry.vertices.push(starting_triangle_vertices[j].clone());
		
		QS_center.geometry.vertices[i*3+0].applyAxisAngle(z_central_axis, TAU / 5 * i);
		QS_center.geometry.vertices[i*3+1].applyAxisAngle(z_central_axis, TAU / 5 * i);
		QS_center.geometry.vertices[i*3+2].applyAxisAngle(z_central_axis, TAU / 5 * i);
		
		QS_center.geometry.faces.push( new THREE.Face3(i*3+0,i*3+2,i*3+1) );
	}
	QS_center.scale.setScalar(0.13,0.13,0.13);
	
	QS_measuring_stick = new THREE.Object3D();
	QS_measuring_stick.scale.setScalar(0.013,0.03,0.03);
	var num_measuringstick_dashes = 12;
	QS_measuring_stick.add( new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({color:0x000000, transparent: true, opacity:0})) );
	for(var i = 0; i < num_measuringstick_dashes; i++)
	{
		if(i)
			QS_measuring_stick.add( QS_measuring_stick.children[0].clone() );
		QS_measuring_stick.children[i].position.y = -0.5 - 2 * i;
	}
	QS_measuring_stick.add(new THREE.Mesh(new THREE.CircleGeometry(0.5), new THREE.MeshBasicMaterial({color:0x000000, transparent: true, opacity:0})));
	QS_measuring_stick.children[QS_measuring_stick.children.length - 1].position.y = -1 - 2 * (num_measuringstick_dashes - 1); 
	
	cutout_vector0 = new THREE.Vector3(0,0.5/Math.sin(TAU/10),0);
	cutout_vector1 = new THREE.Vector3(PHI/2,0.5/Math.sin(TAU/10)-Math.cos(3/20*TAU),0);
	cutout_vector0_player = cutout_vector0.clone();
	cutout_vector1_player = cutout_vector1.clone();
	
	for(var i = 0; i < quasicutout_intermediate_vertices.length; i++ )
		quasicutout_intermediate_vertices[i] = new THREE.Vector3(0,0,0);	
	for(var i = 0; i < quasicutouts_vertices_components.length; i++)
		quasicutouts_vertices_components[i] = new Array(0,0,1);
 	
 	var dodeca_line_pairs = new Uint16Array([
 	    2,1,	1,11,	11,20,	20,29,	29,2,
// 	    2,4,	4,5,	5,6,	6,1,
// 	    1,13,	13,14,	14,15,	15,11,
// 	    11,22,	22,23,	23,24,	24,20,
// 	    20,31,	31,32,	32,33,	33,29,
// 	    29,39,	39,40,	40,41,	41,2, //the other five faces
 	    
// 	    0,1,0,2 //useful for seeing a triangle
 	    
// 	    4,8,	8,9,	9,10,	10,5,
// 	    13,17,	17,18,	18,19,	19,14,
// 	    22,26,	26,27,	27,28,	28,23,
// 	    31,35,	35,36,	36,37,	37,32,
// 	    39,43,	43,44,	44,45,	45,40
 		]);
 	
 	nearby_quasicutouts = new Array(
 		[45,1,12],
 		[13,0,49],
 		[0,49,6],
 		[49,6,18],
 		[6,18,13],
 		[18,13,0],
 		
 		[19,3,48],
 		[3,48,54],
 		[48,54,999],
 		[54,999,19],
 		[999,19,3],
 		
 		[1,12,23],
 		[24,11,5],
 		[11,5,17],
 		[5,17,29],
 		[17,29,24],
 		[29,24,11],
 		
 		[30,14,4],
 		[14,4,10],
 		[4,10,999],
 		[10,999,30],
 		[999,30,14],
 		
 		[12,23,34],
 		[35,22,16],
 		[22,16,28],
 		[16,28,40],
 		[28,40,35],
 		[40,35,22],
 		
 		[41,25,15],
 		[25,15,21],
 		[15,21,999],
 		[21,999,41],
 		[999,41,25],
 		
 		[23,34,45],
 		[46,33,27],
 		[33,27,39],
 		[27,39,51],
 		[39,51,46],
 		[51,46,33],
 		
 		[52,36,26],
 		[36,26,32],
 		[26,32,999],
 		[32,999,52],
 		[999,52,36],
 		
 		[34,45,1],
 		[2,44,38],
 		[44,38,50],
 		[38,50,7],
 		[50,7,2],
 		[7,2,44],
 		
 		[8,47,37],
 		[47,37,43],
 		[37,43,999],
 		[43,999,8],
 		[999,8,47]
 	);
 	
 	dodeca = new THREE.Mesh(new THREE.Geometry(),new THREE.MeshBasicMaterial);
 	dodeca.quaternion.set( //nice pose for touchscreen
 			-0.18925818997218433,
 		 	-0.03191667812850291,
 		 	-0.1469739296093246,
 		 	0.9703408304306739 );
 	
// 	dodeca = new THREE.LineSegments( new THREE.Geometry(), new THREE.LineBasicMaterial({
// 		color: 0x00ffff,
// 		transparent: true,
// 		opacity: 0.5}), THREE.LineSegmentsPieces );
// 	dodeca.visible = false;
 	dodeca.geometry.faces.push(new THREE.Face3(0,0,0));
 	for(var i = 0; i < 47; i++)
 		dodeca.geometry.vertices.push(new THREE.Vector3());
 	//if you want to bring dodeca back you need to work out how to redo this
// 	dodeca.geometry.setIndex( new THREE.BufferAttribute( dodeca_line_pairs, 1 ) );
 	
 	var axis = new THREE.Vector3(0,0,-1);
	var pentagon = Array(5);
	pentagon[0] = new THREE.Vector3(0,0.5/Math.sin(TAU/10),0);
	for(var i = 1; i < 5; i++) {
		pentagon[i] = pentagon[0].clone();
		pentagon[i].applyAxisAngle(axis, i*TAU/5);
	}
	
	var quasilattice_generator = Array(5);
	for(var i = 0; i < 5; i++) {
		quasilattice_generator[i] = pentagon[(i+1)%5].clone();
		quasilattice_generator[i].sub( pentagon[i] );
	}
	
	quasilattice_default_vertices[0] = pentagon[0].clone();
	quasilattice_default_vertices[1] = quasilattice_default_vertices[0].clone(); 	quasilattice_default_vertices[1].add(quasilattice_generator[3]); quasilattice_default_vertices[1].sub(quasilattice_generator[1]);
	quasilattice_default_vertices[2] = quasilattice_default_vertices[0].clone(); 	quasilattice_default_vertices[2].add(quasilattice_generator[3]); quasilattice_default_vertices[2].add(quasilattice_generator[0]);
	quasilattice_default_vertices[4] = quasilattice_default_vertices[2].clone(); 	quasilattice_default_vertices[4].add(quasilattice_generator[4]);
	quasilattice_default_vertices[3] = quasilattice_default_vertices[4].clone(); 	quasilattice_default_vertices[3].sub(quasilattice_generator[3]);
	quasilattice_default_vertices[5] = quasilattice_default_vertices[4].clone(); 	quasilattice_default_vertices[5].sub(quasilattice_generator[2]);
	quasilattice_default_vertices[6] = quasilattice_default_vertices[4].clone(); 	quasilattice_default_vertices[6].add(quasilattice_generator[3]);
	
	//the invisible helpers
	quasilattice_default_vertices[7] = quasilattice_default_vertices[1].clone();	quasilattice_default_vertices[7].add(pentagon[2]);
	
//	quasilattice_default_vertices[9] = quasilattice_default_vertices[7].clone(); 	quasilattice_default_vertices[9].add(quasilattice_generator[4]);
//	quasilattice_default_vertices[10] =quasilattice_default_vertices[9].clone();	quasilattice_default_vertices[10].add(quasilattice_generator[0]);
//	quasilattice_default_vertices[7] = quasilattice_default_vertices[3].clone();	quasilattice_default_vertices[7].sub(quasilattice_generator[2]); quasilattice_default_vertices[7].sub(quasilattice_generator[1]);
//	quasilattice_default_vertices[8] = quasilattice_default_vertices[1].clone(); 	quasilattice_default_vertices[8].add(quasilattice_generator[4]);
//	quasilattice_default_vertices[11] = quasilattice_default_vertices[6].clone();	quasilattice_default_vertices[11].sub(quasilattice_generator[2]);
//	quasilattice_default_vertices[12] = quasilattice_default_vertices[8].clone(); 	quasilattice_default_vertices[12].add(quasilattice_generator[3]);
//	quasilattice_default_vertices[13] = quasilattice_default_vertices[12].clone();	quasilattice_default_vertices[13].add(quasilattice_generator[4]);
//	quasilattice_default_vertices[14] = quasilattice_default_vertices[9].clone(); 	quasilattice_default_vertices[14].sub(quasilattice_generator[1]);
//	quasilattice_default_vertices[15] = quasilattice_default_vertices[14].clone(); 	quasilattice_default_vertices[15].sub(quasilattice_generator[2]);
//	quasilattice_default_vertices[16] = quasilattice_default_vertices[15].clone(); 	quasilattice_default_vertices[16].sub(quasilattice_generator[3]);
//	quasilattice_default_vertices[17] = quasilattice_default_vertices[16].clone(); 	quasilattice_default_vertices[17].add(quasilattice_generator[0]);
	
	//the number found in one-fifth of the lattice
	var num_points = 8;
	
	for( var i = 1; i < 5; i++){
		for(var j = 0; j < num_points; j++) {
			quasilattice_default_vertices[i*num_points+j] = quasilattice_default_vertices[j].clone();
			quasilattice_default_vertices[i*num_points+j].applyAxisAngle(axis, i*TAU/5);
		}
	}
	quasilattice_default_vertices[quasilattice_default_vertices.length - 1] = new THREE.Vector3(0,0,0);
	
	
	
	var spoke_to_side_angle = 3 * TAU / 20;
	
	var second_hand = new THREE.Vector3(1,0,0); //d
	
	var hour_hand = second_hand.clone(); //a,b,c
	hour_hand.setLength(PHI-1);
	
	var minute_hand = second_hand.clone(); //e,f
	minute_hand.setLength(Math.tan(TAU/10));
	minute_hand.applyAxisAngle(z_central_axis, TAU / 20);
	
	for(var i = 0; i < stable_points.length; i++)
		stable_points[i] = new THREE.Vector3();
	
//	var lowest_unused_stablepoint = 0;
//	for(var ourvertex = 0; ourvertex < 7; ourvertex++){
//		//quasilattice_default_vertices.length; i++){
//		var stablepoint_first_recording = lowest_unused_stablepoint;
//		
//		deduce_stable_points_from_fanning_vertex(hour_hand, ourvertex, spoke_to_side_angle);
//		deduce_stable_points_from_fanning_vertex(minute_hand, ourvertex, spoke_to_side_angle);
//		deduce_stable_points_from_fanning_vertex(second_hand, ourvertex, spoke_to_side_angle);
//		
//		var desired_segment_addition = lowest_unused_stablepoint - stablepoint_first_recording;
////		console.log(desired_segment_addition);
//		console.log(lowest_unused_stablepoint)
//		for(var turn = 1; turn < 5; turn++){
//			var stablepoint_recording = lowest_unused_stablepoint;
//			
//			var segmentvertex = ourvertex+turn*7;
//			
//			deduce_stable_points_from_fanning_vertex(hour_hand, segmentvertex, spoke_to_side_angle);
//			deduce_stable_points_from_fanning_vertex(minute_hand, segmentvertex, spoke_to_side_angle);
//			deduce_stable_points_from_fanning_vertex(second_hand, segmentvertex, spoke_to_side_angle);
//			
//			var stablepoint_addition = lowest_unused_stablepoint - stablepoint_recording;
//			
////			console.log(stablepoint_addition);
////			if(stablepoint_addition != desired_segment_addition)
////				console.log(ourvertex, turn);
//			
//		}
//		console.log(lowest_unused_stablepoint)
//	}
	for(var i = 0; i < quasilattice_default_vertices.length; i++){
		if(i%8==7 || i == quasilattice_default_vertices.length-1)
			continue;
		deduce_stable_points_from_fanning_vertex(hour_hand, i, spoke_to_side_angle);
		deduce_stable_points_from_fanning_vertex(minute_hand, i, spoke_to_side_angle);
		deduce_stable_points_from_fanning_vertex(second_hand, i, spoke_to_side_angle);
	}
	for(var i = 0; i<stable_points.length; i++){
		for(var j = i+1; j<stable_points.length; j++){
			if(stable_points[i].distanceTo(stable_points[j]) < 0.0001){
				console.log("culled some stable points: ", i,j,stable_points[j],stable_points[i])
				stable_points.splice(j,1);
				j--;
			}
		}
	}
	for(var i = 0; i<stable_points.length; i++){
		if(stable_points[i].length() > 3.48 ){ //the length of HPV's cutouts
			stable_points.splice(i,1);
			i--;
		}	
	}
	remove_stable_point_and_its_rotations(4);
	remove_stable_point_and_its_rotations(5);
	remove_stable_point_and_its_rotations(9);
	
	remove_stable_point_and_its_rotations(10);
	remove_stable_point_and_its_rotations(10);//convex
	remove_stable_point_and_its_rotations(10);//convex
	remove_stable_point_and_its_rotations(10);//convex
	
	remove_stable_point_and_its_rotations(11); //Crossovers - Konevtsova's fault!
	
	remove_stable_point_and_its_rotations(12);
	remove_stable_point_and_its_rotations(12); 
	remove_stable_point_and_its_rotations(12); 
	remove_stable_point_and_its_rotations(12);//convex
	remove_stable_point_and_its_rotations(12);//convex
	remove_stable_point_and_its_rotations(12);//convex
	remove_stable_point_and_its_rotations(12);//convex
	remove_stable_point_and_its_rotations(13);//convex
	remove_stable_point_and_its_rotations(13); 
	remove_stable_point_and_its_rotations(13);
	remove_stable_point_and_its_rotations(13);
	remove_stable_point_and_its_rotations(17);//convex
	remove_stable_point_and_its_rotations(17);//convex
	remove_stable_point_and_its_rotations(20);
	remove_stable_point_and_its_rotations(20);
	remove_stable_point_and_its_rotations(21);
	remove_stable_point_and_its_rotations(21);
	remove_stable_point_and_its_rotations(22);//ugly
	remove_stable_point_and_its_rotations(23);//convex
	remove_stable_point_and_its_rotations(23);
	remove_stable_point_and_its_rotations(26);
	remove_stable_point_and_its_rotations(0); //Sort of our fault for wanting points on dodeca vertices. Which is arguably bad because are there really rotationally symmetric proteins?
	//NOTE because of that last one, the number you see it as is one less than the number you need to deduct from here
	remove_stable_point_and_its_rotations(10);//ugly
//	remove_stable_point_and_its_rotations(6); //ugly
//	remove_stable_point_and_its_rotations(5); //ugly
	remove_stable_point_and_its_rotations(3); //ugly
	
	quasicutout_meshes = Array(stable_points.length / 5);
	var num_quasi_mesh_triangles = 18;
	var color_selection = Array(num_quasi_mesh_triangles); //actually much less because some triangles are in quads
	for(var i = 0; i < color_selection.length; i++){
		if(i==2 || i==4 || i==6 || i==8)
			color_selection[i] = color_selection[i-1];
		else if( 9 <= i && i <= 13) //pent
			color_selection[i] = color_selection[0];
		else if( i === 14 || i === 15 ) //alt thin
			color_selection[i] = color_selection[1];
		else if( i === 16 || i === 17 ) //alt fat
			color_selection[i] = color_selection[3];
		else if( i === 0 )
			color_selection[i] = new THREE.Color( 93/255, 167/255,223/255 );
		else if( i === 1 ) //thin
			color_selection[i] = new THREE.Color( 72/255,116/255,160/255 );
		else if( i === 3 ) //fat
			color_selection[i] = new THREE.Color( 167/255,199/255,222/255 );
//		else if( i === 5 ) //random shape. Shares an edge with all the existing colors
//			color_selection[i] = new THREE.Color( 1,0.5,0.5 );
		else if( i === 7 ) //defect
			color_selection[i] = new THREE.Color( 216/256,244/256,254/256 );
		else
			color_selection[i] = new THREE.Color(216/256,244/256,254/256 );
	}
	/*
	 * Note these are shapes on the FLAT lattice. The shapes on the sphere change, and it's not nice to see these change (you could hide them though)
	 * 0 is inner pentagon
	 * 1, 2 are inner thin
	 * 3, 4 are inner fat
	 * 5, 6 is a rhombus of any kind you like
	 * 7, 8 are topological defects
	 * 9 - 13 is outer pentagon (12 and 13 are useless, speedup would be to remove them, as well as the invisible vertex)
	 * 14, 15 is outer thin
	 * 16, 17 is outer fat
	 * important: if you're only going to have one triangle of a shape, it must be the lower of the two
	 * This all goes by the flat
	 * shouldn't you have a random color shape for the hexagons
	 */
	
	var EdgesColor = new THREE.Color(0,0,0);
	
	var one_quasicutout_vertices = quasilattice_default_vertices.length * 2 + NUM_QUASICUTOUT_EDGES * 6;
	
	Forced_edges = Array(quasicutout_meshes.length);
	Forced_edges[0] = new Uint16Array([1,2]);
	Forced_edges[1] = new Uint16Array([1,2]);
	Forced_edges[2] = new Uint16Array([1,2]);
	Forced_edges[3] = new Uint16Array([]);
	Forced_edges[4] = new Uint16Array([14,15]);
	Forced_edges[5] = new Uint16Array([1,2, 3,4]);
	Forced_edges[6] = new Uint16Array([1,2, 3,4]);
	Forced_edges[7] = new Uint16Array([1, 3,4, 7,8, 16,17]);
	Forced_edges[8] = new Uint16Array([3,4]);
	Forced_edges[9] = new Uint16Array([16,17]);
	Forced_edges[10] = new Uint16Array([7,8, 4,3]);
	Forced_edges[11] = new Uint16Array([3,4]); //a very crazy one
	Forced_edges[12] = new Uint16Array([7,8]);
	Forced_edges[13] = new Uint16Array([7,8]);
	Forced_edges[14] = new Uint16Array([]);
	Forced_edges[15] = new Uint16Array([14,15]);
	Forced_edges[16] = new Uint16Array([7,8, 9,10,11]);
	Forced_edges[17] = new Uint16Array([7,8, 9,10,11]);
	Forced_edges[18] = new Uint16Array([5,6, 17]);
	Forced_edges[19] = new Uint16Array([]);
	Forced_edges[20] = new Uint16Array([5]); //this one needs overhauling too
	Forced_edges[21] = new Uint16Array([14,15, 5,6]);
	Forced_edges[22] = new Uint16Array([14,15, 7,8]);
	
	var QM_materials = Array(2);
	QM_materials[0] = new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors});
	QM_materials[1] = new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors}); //one of these
	var ourmultimaterial = new THREE.MultiMaterial(QM_materials);
	
	var theirfaceindices = new Uint16Array(3);
	var ourfaceindices = new Uint16Array(3);
	
	for(var i = 0; i < quasicutout_meshes.length; i++)
	{ //one of these for each stable point
		quasicutout_meshes[i] = new THREE.Mesh( new THREE.Geometry(), ourmultimaterial );
		for(var j = 0; j < 60; j++)
		{ //each quasicutout
			for(var k = 0; k < quasilattice_default_vertices.length * 2; k++ ) //TODO memory save opportunity, and probably speedup: you do NOT need the maximum in all of them!
				quasicutout_meshes[i].geometry.vertices.push(new THREE.Vector3(0,0,0));
			
			for(var k = 0; k < num_quasi_mesh_triangles; k++)
			{ //TODO speedup(?): clone
				var indexA = 0;
				var indexB = 0;
				var indexC = 0;
				
				if(i===0){
					if(k===0){	indexA = 2;		indexB = 4;		indexC = 6;		}
					
					if(k===1){	indexA = 4;		indexB = 2;		indexC = 3;		}
					
					if(k===7){	indexA = 4;		indexB = 3;		indexC = 5;		}
				} else if(i===1){
					if(k===0){	indexA = 0;		indexB = 2;		indexC = 6;		}
					
					if(k===1){	indexA = 2;		indexB = 0;		indexC = 3;		}
					
					if(k===7){	indexA = 3;		indexB = 0;		indexC = 1;		}
				} else if(i===2){
					if(k===0){	indexA = 0;		indexB = 2;		indexC = 6;		}
					
					if(k===1){	indexA = 2;		indexB = 0;		indexC = 3;		}
					
					if(k===7){	indexA = 3;		indexB = 0;		indexC = 1;		}
				} else if(i===3){
					if(k===0){	indexA = 24;		indexB = 26;	indexC = 36;	}
					
					if(k===1){	indexA = 24;		indexB = 0;		indexC = 26;	}
					if(k===2){	indexA = 8;			indexB = 26;	indexC = 0;		}
					
					if(k===3){	indexA = 24;		indexB = 6;		indexC = 0;		}
					if(k===4){	indexA = 12;		indexB = 0;		indexC = 6;		}
					
					if(k===16){	indexA = 14;		indexB =  8;	indexC = 32;		}
					if(k===17){	indexA = 32;		indexB = 15;	indexC = 14;		}
					
					if(k===7){	indexA = 35;		indexB = 34;	indexC = 33;		}
					
					if(k===9){	indexA = 14;		indexB = 10;	indexC =  2;		}
					if(k===10){	indexA = 14;		indexB = 34;	indexC = 10;		}
					if(k===11){	indexA = 14;		indexB = 33;	indexC = 34;		}
				} else if(i===4){
					if(k===0){	indexA = 30;		indexB = 32;	indexC = 42;	}
					
					if(k===1){	indexA = 30;		indexB =  0;	indexC = 32;	}
					if(k===2){	indexA = 32;		indexB =  0;	indexC = 8;	}
					
					if(k===3){	indexA =  0;		indexB = 30;	indexC = 6;		}
					if(k===4){	indexA = 12;		indexB = 0;		indexC = 6;		}
					
					if(k===16){	indexA = 14;		indexB =  8;	indexC = 15;		}
					if(k===17){	indexA = 15;		indexB =  8;	indexC = 21;		}
					
					if(k===7){	indexA = 40;		indexB = 39;	indexC = 41;		}
					
					if(k===9){	indexA =  0;		indexB = 12;	indexC = 8;		}
					if(k===10){	indexA =  8;		indexB = 12;	indexC = 38;		}
					if(k===11){	indexA = 38;		indexB = 12;	indexC = 18;		}
					
					if(k===14){	indexA = 21;		indexB =  8;	indexC = 38;		}
					if(k===15){	indexA = 40;		indexB = 20;	indexC = 39;		}
					
					/* without our cheating vertex
					 * 	if(k===0){	indexA = 24;		indexB = 26;	indexC = 36;	}
					
						if(k===1){	indexA = 8;			indexB = 24;	indexC = 0;		}
						if(k===2){	indexA = 24;		indexB = 8;		indexC = 26;	}
						
						if(k===3){	indexA = 12;		indexB = 0;		indexC = 6;		}
						if(k===4){	indexA = 24;		indexB = 6;		indexC = 0;		}
					 */
				} else if(i===5){
					if(k===0){	indexA = 4;			indexB = 42;	indexC = 2;		}
					
					if(k===1){	indexA = 12;		indexB = 20;	indexC = 0;		}
					if(k===2){	indexA = 2;			indexB = 16;	indexC = 4;		}
					
					if(k===3){	indexA = 20;		indexB = 26;	indexC = 0;		}
					if(k===4){	indexA = 16;		indexB = 2;		indexC = 28;	}
					
					if(k===7){	indexA =  9;		indexB =  6;	indexC =  7;	}
					
					if(k===9){	indexA = 12;		indexB = 24;	indexC = 20;	}
					if(k===10){	indexA = 24;		indexB =  6;	indexC = 20;		}
					if(k===11){	indexA = 24;		indexB = 30;	indexC =  6;	}
					
					if(k===14){	indexA = 26;		indexB = 20;	indexC = 33;	}
					if(k===15){	indexA = 26;		indexB = 33;	indexC = 27;	}
					
					if(k===16){	indexA = 33;		indexB = 20;	indexC =  6;	}
					if(k===17){	indexA = 33;		indexB =  6;	indexC =  9;	}
					
					/* without cheat
					if(k===0){	indexA = 4;			indexB = 36;	indexC = 2;		}
					
					if(k===1){	indexA = 12;		indexB = 20;	indexC = 0;		}
					if(k===2){	indexA = 2;			indexB = 16;	indexC = 4;		}
					
					if(k===3){	indexA = 20;		indexB = 26;	indexC = 0;		}
					if(k===4){	indexA = 16;		indexB = 2;		indexC = 28;	}
					*/
				} else if(i===6){
					if(k===0){	indexA = 4;			indexB = 36;	indexC = 2;		}
					
					if(k===1){	indexA = 12;		indexB = 20;	indexC = 0;		}
					if(k===2){	indexA = 2;			indexB = 16;	indexC = 4;		}
					
					if(k===3){	indexA = 20;		indexB = 26;	indexC = 0;		}
					if(k===4){	indexA = 16;		indexB = 2;		indexC = 28;	}
					
					if(k===16){	indexA = 20;		indexB = 6;		indexC = 26;	}
					if(k===17){	indexA = 9;			indexB = 26;	indexC = 6;		}
					
					if(k===7){	indexA = 9;			indexB =  6;	indexC = 7;		}

					if(k===9){	indexA = 22;		indexB = 14;	indexC = 26;	}
					if(k===10){	indexA = 22;		indexB = 26;	indexC =  8;	}
					if(k===11){	indexA = 26;		indexB = 27;	indexC =  8;	}
				} else if(i===7){ //this requires third fat rhomb 
					//it's almost certainly a fool's errand to try to find the vertices you need
					if(k===0){	indexA = 2;			indexB = 60;	indexC = 0;			}
					
					if(k===1){	indexA = 12;		indexB = 20;	indexC = 0;		}
					if(k===2){	indexA = 2;			indexB = 16;	indexC = 4;			}
					
					if(k===3){	indexA = 20;		indexB = 26;	indexC = 0;		}
					if(k===4){	indexA = 16;		indexB = 2;		indexC = 28;	}
					
					if(k===5){	indexA = 18;		indexB = 30;	indexC = 24;		}
					if(k===6){	indexA = 30;		indexB = 18;	indexC = 54;		}
					
					if(k===7){	indexA = 58;		indexB = 57;	indexC = 59;		}
					if(k===8){	indexA = 30;		indexB = 31;	indexC = 32;		} //you might need another in the defect

					if(k===9){	indexA = 12;		indexB = 36;	indexC = 56;	}
					if(k===10){	indexA = 12;		indexB = 24;	indexC = 36;		}
					if(k===11){	indexA = 12;		indexB = 56;	indexC = 20;		}
					
					if(k===16){	indexA = 36;		indexB = 24;	indexC = 30;		}
					if(k===17){	indexA = 32;		indexB = 33;	indexC = 38;		} //only appears when pulled on
				} else if(i===8){
					if(k===0){	indexA = 6;			indexB = 8;		indexC = 12;		}
					
					if(k===1){	indexA = 8;			indexB = 6;		indexC = 0;		}
					if(k===2){	indexA = 8;			indexB = 0;		indexC = 3;		}
					
					if(k===3){	indexA = 8;			indexB = 3;		indexC = 2;		}
					
					if(k===7){	indexA = 3;			indexB = 0;		indexC = 1;		}
				} else if(i===9){
					if(k===0){	indexA = 6;			indexB = 8;		indexC = 18;	}
					
					if(k===1){	indexA = 8;			indexB = 6;		indexC = 14;	}
					if(k===2){	indexA = 8;			indexB = 14;	indexC = 2;		}
					
					if(k===3){	indexA = 14;		indexB = 6;		indexC = 0;		}
					if(k===4){	indexA = 14;		indexB = 0;		indexC = 3;		}
					
					if(k===16){	indexA = 14;		indexB = 3;		indexC = 2;		}
					
					if(k===7){	indexA =  3;		indexB = 0;		indexC = 1;		}
				} else if(i===10){
					if(k===0){	indexA = 20;		indexB = 24;	indexC = 18;	}
					
					if(k===1){	indexA = 20;		indexB = 18;	indexC = 0;		}
					if(k===2){	indexA = 20;		indexB = 0;		indexC = 8;		}
					
					if(k===3){	indexA = 20;		indexB = 8;		indexC = 2;		}
					if(k===4){	indexA = 2;			indexB = 8;		indexC = 9;		}
					
					if(k===7){	indexA =  10;		indexB =  9;	indexC = 11;	}
					if(k===8){	indexA =  10;		indexB =  2;	indexC = 9;		}
				} else if(i===11){
					if(k===0){	indexA = 0;			indexB = 2; 	indexC = 48;	}
					
					if(k===1){	indexA = 2;			indexB = 0;		indexC = 14;	}
					if(k===2){	indexA = 2;			indexB = 14;	indexC = 22;		}
					
					if(k===3){	indexA = 2;			indexB = 22;	indexC = 16;		}
					if(k===4){	indexA = 12;		indexB = 18;	indexC = 24;		}
					
					if(k===7){	indexA = 45;		indexB = 47;	indexC = 46;	}
					if(k===8){	indexA = 45;		indexB = 46;	indexC = 21;	}
					
					if(k===9){	indexA = 26;		indexB = 22;	indexC = 14;	}
					if(k===10){	indexA = 26;		indexB = 46;	indexC = 22;	} 
					
					if(k===11){	indexA = 27;		indexB = 21;	indexC = 46;	}
					
					if(k===12){	indexA = 27;		indexB = 46;	indexC = 26;	}
				} else if(i===12){
					if(k===0){	indexA = 6;			indexB = 8; 	indexC = 30;	}
					
					if(k===1){	indexA = 8;			indexB = 6;		indexC = 14;	}
					if(k===2){	indexA = 8;			indexB = 14;	indexC = 2;		}
					
					if(k===3){	indexA = 14;		indexB = 6;		indexC = 0;		}
					if(k===4){	indexA = 20;		indexB = 14;	indexC = 0;		}
					
					if(k===9){	indexA = 14;		indexB = 20;	indexC = 2;		}
					if(k===10){	indexA = 2;			indexB = 20;	indexC = 21;	}
					
					if(k===8){	indexA = 20;		indexB =  0;	indexC =  3;	}
					if(k===7){	indexA = 3;			indexB =  0;	indexC =  1;	}
				} else if(i===13){
					if(k===0){	indexA = 18;		indexB = 20; 	indexC = 24;	}
					
					if(k===1){	indexA = 20;		indexB = 18;	indexC = 0;		}
					if(k===2){	indexA = 20;		indexB = 0;		indexC = 8;		}
					
					if(k===3){	indexA = 20;		indexB = 8;		indexC = 2;		}
					if(k===4){	indexA = 2;			indexB = 8;		indexC = 9;		}
					
					if(k===7){	indexA = 0;			indexB = 1;		indexC = 3;		}
					if(k===8){	indexA = 0;			indexB = 3;		indexC = 8;		}
				} else if(i===14){
					if(k===0){	indexA = 12;		indexB = 14;	indexC = 30;	}

					if(k===1){	indexA = 14;		indexB = 12;	indexC = 20;	}
					if(k===2){	indexA = 14;		indexB = 20;	indexC = 2;		}
					
					if(k===3){	indexA = 14;		indexB = 2;		indexC = 22;	}
					if(k===4){	indexA = 22;		indexB = 2;		indexC = 8;		}
					
					if(k===7){	indexA =  6;		indexB = 7;		indexC = 9;	}
					
					if(k===9){	indexA =  6;		indexB =  2;	indexC = 20;	}
					if(k===10){	indexA =  6;		indexB =  3;	indexC =  2;	}
					if(k===11){	indexA =  6;		indexB =  9;	indexC =  3;	}
				} else if(i===15){ 
					if(k===0){	indexA = 12;		indexB = 14;	indexC = 30;	}

					if(k===1){	indexA = 14;		indexB = 12;	indexC = 20;	}
					if(k===2){	indexA = 14;		indexB = 20;	indexC = 2;		}
					
					if(k===3){	indexA = 12;		indexB = 0;		indexC = 20;	}
					if(k===4){	indexA = 20;		indexB = 0;		indexC = 6;		}
					
					if(k===9){	indexA = 20;		indexB = 6;		indexC = 2;	}
					if(k===10){	indexA = 2;			indexB = 6;		indexC = 9;		}
					
					if(k===7){	indexA = 6;			indexB = 7;		indexC = 9;		}
					
					if(k===14){	indexA = 9;			indexB = 8;		indexC = 2;		}
				} else if(i===16){
					if(k===0){	indexA = 6;			indexB = 8; 	indexC = 30;	}
					
					if(k===1){	indexA = 8;			indexB = 6;		indexC = 14;	}
					if(k===2){	indexA = 8;			indexB = 14;	indexC = 2;		}
					
					if(k===3){	indexA = 14;		indexB = 6;		indexC = 0;		}
					if(k===4){	indexA = 20;		indexB = 14;	indexC = 0;		}
					
					if(k===9){	indexA = 14;		indexB = 20;	indexC = 2;		}
					if(k===10){	indexA = 2;			indexB = 20;	indexC = 21;	}
					
					if(k===7){	indexA = 22;		indexB = 21;	indexC = 23;	}
					if(k===8){	indexA = 21;		indexB = 22;	indexC =  2;	}
				} else if(i===17){
					if(k===0){	indexA = 12;		indexB = 14; 	indexC = 42;	}

					if(k===1){	indexA = 14;		indexB = 12;	indexC = 20;	}
					if(k===2){	indexA = 14;		indexB = 20;	indexC = 2;		}
					
					if(k===3){	indexA = 12;		indexB = 0;		indexC = 20;	}
					if(k===4){	indexA = 20;		indexB = 0;		indexC = 26;	}
					
					if(k===9){	indexA = 2;			indexB = 20;	indexC = 26;	}
					if(k===10){	indexA = 2;			indexB = 26;	indexC = 27;	}
					
					if(k===7){	indexA = 28;		indexB = 27;	indexC = 29;	}
					if(k===8){	indexA = 28;		indexB =  2;	indexC = 27;	}
				} else if(i===18){
					if(k===0){	indexA = 24;		indexB = 26; 	indexC = 42;	}

					if(k===1){	indexA = 8;			indexB = 24;	indexC = 0;		}
					if(k===2){	indexA = 24;		indexB = 8;		indexC = 26;		}
					
					if(k===3){	indexA = 12;		indexB = 0;		indexC = 6;		}
					if(k===4){	indexA = 24;		indexB = 6;		indexC = 0;		}
					
					if(k===8){	indexA = 15;		indexB = 18;	indexC = 21;	}
					if(k===7){	indexA = 18;		indexB = 19;	indexC = 21;	}
					
					if(k===17){	indexA = 8;			indexB = 15;	indexC = 14;		} //change the number of this
//					if(k===18){	indexA = 9;			indexB = 14;	indexC = 15;		} //change the number of this
					
					if(k===9){	indexA = 18;		indexB = 0;		indexC = 12;		}
					if(k===10){	indexA = 18;		indexB = 8;		indexC = 0;		}
					if(k===11){	indexA = 8;			indexB = 18;	indexC = 15;		}
				} else if(i===19){ //also requires a third fat rhomb
					if(k===0){	indexA = 12;		indexB = 14; 	indexC = 42;	}

					if(k===1){	indexA = 14;		indexB = 12;	indexC = 26;	}
					if(k===2){	indexA = 14;		indexB = 26;	indexC = 2;		}
					
					if(k===3){	indexA = 12;		indexB = 0;		indexC = 26;	}
					if(k===4){	indexA = 26;		indexB = 0;		indexC = 32;	}
					
					if(k===5){	indexA = 32;		indexB = 0;		indexC = 18;	}
					if(k===6){	indexA = 18;		indexB = 6;		indexC = 32;	}
					
					if(k===7){	indexA = 6;			indexB = 7;		indexC = 9;	}
					
					if(k===9){	indexA = 32;		indexB =  2;	indexC = 26;	}
					if(k===10){	indexA = 32;		indexB = 20;	indexC =  2;	}
					if(k===11){	indexA = 32;		indexB = 21;	indexC = 20;	}
					
					if(k===16){	indexA = 32;		indexB = 6;		indexC = 21;	}
					if(k===17){	indexA = 6;			indexB = 9;		indexC = 21;	}
				} else if(i===20){ //third fat rhomb
					if(k===0){	indexA = 12;		indexB = 14; 	indexC = 42;	}

					if(k===1){	indexA = 14;		indexB = 12;	indexC = 26;	}
					if(k===2){	indexA = 14;		indexB = 26;	indexC = 2;		}
					
					if(k===3){	indexA = 12;		indexB = 0;		indexC = 26;	}
					if(k===4){	indexA = 26;		indexB = 0;		indexC = 6;		}
					
					if(k===5){	indexA =  6;		indexB =  0;	indexC = 18;	}
					if(k===6){	indexA = 20;		indexB = 21;	indexC =  8;	}
					
					if(k===7){	indexA = 34;		indexB = 33;	indexC = 35;	}
					
					if(k===9){	indexA = 26;		indexB = 20;	indexC = 2;		}
					if(k===10){	indexA = 26;		indexB = 32;	indexC = 20;	}
					if(k===11){	indexA = 26;		indexB = 6;		indexC = 32;	}
					
					if(k===16){	indexA =  8;		indexB = 21;	indexC = 34;	}
					if(k===17){	indexA = 34;		indexB = 21;	indexC = 33;	}
				} else if(i===21){
					if(k===0){	indexA = 30;		indexB = 32; 	indexC = 48;	}

					if(k===1){	indexA = 32;		indexB = 30;	indexC = 0;		}
					if(k===2){	indexA = 32;		indexB =  0;	indexC =  8;	}
					
					if(k===3){	indexA =  6;		indexB =  0;	indexC = 30;	}
					if(k===4){	indexA = 12;		indexB =  0;	indexC = 6;		}
					
					if(k===5){	indexA =  8;		indexB = 38;	indexC = 14;	}
					if(k===6){	indexA = 14;		indexB = 38;	indexC = 39;	}
					 
					if(k===7){	indexA = 18;		indexB = 19;	indexC = 21;	}
					
					if(k===9){	indexA =  0;		indexB = 38;	indexC =  8;	}
					if(k===10){	indexA =  0;		indexB = 18;	indexC = 38;	}
					if(k===11){	indexA =  0;		indexB = 12;	indexC = 18;	}
					
					if(k===14){	indexA = 18;		indexB = 21;	indexC = 38;	}
					if(k===15){	indexA = 20;		indexB = 14;	indexC = 39;	}
				} else if(i===22){
					if(k===0){	indexA = 12;		indexB = 14; 	indexC = 42;	}

					if(k===1){	indexA = 14;		indexB = 12;	indexC = 26;	}
					if(k===2){	indexA = 14;		indexB = 26;	indexC = 2;		}
					
					if(k===3){	indexA = 12;		indexB = 0;		indexC = 26;	}
					if(k===4){	indexA = 26;		indexB = 0;		indexC = 6;		}
					
					if(k===5){	indexA =  8;		indexB =  2;	indexC = 21;	}
					if(k===6){	indexA = 21;		indexB = 33;	indexC =  8;	}
					
					if(k===7){	indexA = 34;		indexB = 33;	indexC = 35;	}
					if(k===8){	indexA = 34;		indexB =  8;	indexC = 33;	}
					
					if(k===9){	indexA = 26;		indexB = 20;	indexC = 2;		}
					if(k===10){	indexA = 26;		indexB = 32;	indexC = 20;	}
					if(k===11){	indexA = 26;		indexB = 6;		indexC = 32;	}

					if(k===14){	indexA = 21;		indexB =  2;	indexC = 20;	}
				}
				
				var ourmaterialindex;
				if( ( j%11 === 0 && (indexA % 2 === 1 || indexB % 2 === 1 || indexC % 2 === 1 ) ) || j % 11 !== 0 )
					ourmaterialindex = 1;
				else
					ourmaterialindex = 0;
				
				if( k === 7 && // singularities mustn't be triplicated
						( j % 11 === 1 || j % 11 === 5 || j % 11 === 4 || j % 11 === 10 )
						) {
					indexA = 0;
					indexB = 0;
					indexC = 0;
				}
									
				quasicutout_meshes[i].geometry.faces.push( new THREE.Face3(
					j * one_quasicutout_vertices + indexA,
					j * one_quasicutout_vertices + indexB,
					j * one_quasicutout_vertices + indexC,
 					new THREE.Vector3(1,0,0),
 					color_selection[k],
 					ourmaterialindex ) );
			}
			
			//this is the edges
			for(var k = 0; k < NUM_QUASICUTOUT_EDGES * 6; k++)
				quasicutout_meshes[i].geometry.vertices.push(new THREE.Vector3());
			
			for(var k = 0; k < NUM_QUASICUTOUT_EDGES; k++)
			{
				for(var m = 0; m < prism_triangle_indices.length / 3; m++ ) //each triangle of the prism
				{
					var lowest_edge_vertex_index = quasilattice_default_vertices.length * 2 + 6 * k;
					quasicutout_meshes[i].geometry.faces.push( new THREE.Face3(
							j * one_quasicutout_vertices + lowest_edge_vertex_index + prism_triangle_indices[m*3+0], 
							j * one_quasicutout_vertices + lowest_edge_vertex_index + prism_triangle_indices[m*3+1], 
							j * one_quasicutout_vertices + lowest_edge_vertex_index + prism_triangle_indices[m*3+2],
		 					new THREE.Vector3(1,0,0), //Face normal; unused
		 					EdgesColor,
		 					1 ) ); // change to 0 to stop disappearance.
				}
			}
		}
		
//		var evenedge = 0;
//		for(var j = 0; j < quasicutout_meshes[i].geometry.faces.length; j++){
//			ourfaceindices[0] = quasicutout_meshes[i].geometry.faces[j].a;
//			ourfaceindices[1] = quasicutout_meshes[i].geometry.faces[j].b;
//			ourfaceindices[2] = quasicutout_meshes[i].geometry.faces[j].c;
//			for(var k = 0; k < 3; k++){
//				var v1 = ourfaceindices[k];
//				var v2 = ourfaceindices[( k+1 ) % 3];
//				
//				for(var l = 0; l < quasicutout_meshes[i].geometry.faces.length; l++){
//					theirfaceindices[0] = quasicutout_meshes[i].geometry.faces[l].a;
//					theirfaceindices[1] = quasicutout_meshes[i].geometry.faces[l].b;
//					theirfaceindices[2] = quasicutout_meshes[i].geometry.faces[l].c;
////					for(var m = 0; m < 3; m++){
////						var u1 = theirfaceindices[m];
////						var u2 = theirfaceindices[( m+1 ) % 3];
////						
////						if( (v1 === u1 && v2 === u2) || (v1 === u2 && v2 === u1))
////							if(v1 % 2 === 0 && v2 % 2 === 0)
////								evenedge = 1;
////					}
//				}
//			}
//		}
//		console.log(evenedge)
	}
	
	for(var i = 0; i < num_quasi_mesh_triangles; i++)
	{
		var resultarray = new Uint16Array(17);
		for(var j = 0; j < num_quasi_mesh_triangles; j++)
		{
			if( triangle_in_same_shape(i,j) )
			{
				
			}
		}
	}
	
	one_fifth_stablepoints = stable_points.length / 5;
	//so why aren't 26 and 2
	for(var i = 0; i < one_fifth_stablepoints; i++){
		var rotations = Array(5);
		rotations[0] = stable_points[i].clone();
		for(var j = 1; j < 5; j++){
			rotations[j] = rotations[0].clone();
			rotations[j].applyAxisAngle(z_central_axis,TAU/5 * j);
			for(var k = one_fifth_stablepoints; k < stable_points.length; k++ ){
				if(	Math.abs(rotations[j].x - stable_points[k].x) < 0.00001 &&
					Math.abs(rotations[j].y - stable_points[k].y) < 0.00001 ) {
					var proper_index = j * one_fifth_stablepoints + i;
					if( k !== proper_index){
						var temp = stable_points[proper_index].clone();
						stable_points[proper_index].copy(stable_points[k]);
						stable_points[k].copy(temp);
					}
					break;
				}
				if(k === stable_points.length - 1)
					console.log("couldn't find the right point")
			}
		}
	}
	
	//INITIAL STATE
	cutout_vector0.copy(stable_points[8]);
	cutout_vector1.copy(cutout_vector0);	
	cutout_vector1.applyAxisAngle(z_central_axis, -TAU/5);
	cutout_vector0_player = cutout_vector0.clone();
	cutout_vector1_player = cutout_vector1.clone();
	
	//first one is right corner, second is left corner, last is top
	dodeca_triangle_vertex_indices = new Array(
	    [1,2,0],
	    
	    [2,1,3],
	    [4,2,3],
	    [5,4,3],
	    [6,5,3],
	    [1,6,3],
	    
	    [4,5,7],
	    [8,4,7],
	    [9,8,7],
	    [10,9,7],
	    [5,10,7],
	    
	    [11,1,0],
	    
	    [1,11,12],
	    [13,1,12],
	    [14,13,12],
	    [15,14,12],
	    [11,15,12],
	    
	    [13,14,16],
	    [17,13,16],
	    [18,17,16],
	    [19,18,16],
	    [14,19,16],
	    
	    [20,11,0],
	    
	    [11,20,21],
	    [22,11,21],
	    [23,22,21],
	    [24,23,21],
	    [20,24,21],
	    
	    [22,23,25],
	    [26,22,25],
	    [27,26,25],
	    [28,27,25],
	    [23,28,25],
	    
	    [29,20,0],
	    
	    [20,29,30],
	    [31,20,30],
	    [32,31,30],
	    [33,32,30],
	    [29,33,30],
	    
	    [31,32,34],
	    [35,31,34],
	    [36,35,34],
	    [37,36,34],
	    [32,37,34],
	    
	    [2,29,0],
	    
	    [29,2,38],
	    [39,29,38],
	    [40,39,38],
	    [41,40,38],
	    [2,41,38],
	    
	    [39,40,42],
	    [43,39,42],
	    [44,43,42],
	    [45,44,42],
	    [40,45,42],
	    
		[9,18,46],
		[44,9,46],
		[36,44,46],
		[27,36,46],
		[18,27,46]
		);
	
	dodeca_derivations = new Array(
			[999,999,999],
			[999,999,999],
			[999,999,999],
			
			[1,2,0],
			[3,2,1],
			[3,4,2],
			[3,5,4],
			
			[5,4,3],
			[7,4,5],
			[7,8,4],
			[7,9,8],
			
			[0,1,2],
			
			[11,1,0],
			[12,1,11],
			[12,13,1],
			[12,14,13],
			
			[14,13,12],
			[16,13,14],
			[16,17,13],
			[16,18,17],
			
			[0,11,1],
			
			[20,11,0],
			[21,11,20],
			[21,22,11],
			[21,23,22],
			
			[23,22,21],
			[25,22,23],
			[25,26,22],
			[25,27,26],
			
			[0,20,11],
			
			[29,20,0],
			[30,20,29],
			[30,31,20],
			[30,32,31],
			
			[32,31,30],
			[34,31,32],
			[34,35,31],
			[34,36,35],
			
			[2,29,0],
			[38,29,2],
			[38,39,29],
			[38,40,39],
			
			[40,39,38],
			[42,39,40],
			[42,43,39],
			[42,44,43]);
	
	deduce_dodecahedron(0);
}