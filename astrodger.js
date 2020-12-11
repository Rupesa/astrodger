//////////////////////////////////////////////////////////////////////////////
//
//  astrodger.js 
//
//  Rui Olivera
//  Rui Santos
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//


var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
	
var triangleVertexColorBuffer = null;

var numAsteroide = Math.floor(Math.random() * 16);

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTz = 0.0;

// The local transformation parameters

// NAVE

// The translation vector 

var tx = -0.25;

var ty = -0.25;

var tz = 0.0;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;

// The scaling factors

var sx = 0.6;

var sy = 0.6;

var sz = 0.6;

// ASTEROIDE

var asteroides = [];
for (i=0;i<30;i++) {
	asteroides[i] = [0, 75, 0, 0, 0.1, 0.1, 0.1, -0.75, -0.75, -13, 1, 1, 0, 1, 1, 0];
}

var spawnCount = 0;

var spawnTop = 50;

// The translation vector 

// The rotation angles in degrees

var angleXX2 = 75;

var angleYY2 = 0.0;

var angleZZ2 = 0.0;

// The scaling factors

var sx2 = 0.1;

var sy2 = 0.1;

var sz2 = 0.1;

// GLOBAL Animation controls

var globalRotationYY_ON = 1;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// Local Animation controls

var rotationXX_ON = 0;

var rotationXX_DIR = 1;

var rotationXX_SPEED = 1;
 
var rotationYY_ON = 0;

var rotationYY_DIR = 1;

var rotationYY_SPEED = 1;
 
var rotationZZ_ON = 0;

var rotationZZ_DIR = 1;

var rotationZZ_SPEED = 1;

var asteriodesMOVE_ON = 0;

var score = 0;

var highscore = 0;
 
// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 1;

// NEW --- Model Material Features

// Ambient coef.

var kAmbi = [ 0.2, 0.2, 0.2 ];

// Difuse coef.

var kDiff = [ 0.7, 0.7, 0.7 ];

// Specular coef.

var kSpec = [ 0.7, 0.7, 0.7 ];

// Phong coef.

var nPhong = 100;

// Initial model has just ONE TRIANGLE

var vertices = [

		// FRONT FACE
		 
		-0.25, -0.25,  0.25,
		 
		 0.25, -0.25,  0.25,
		 
		 0.25,  0.25,  0.25,

		 
		 0.25,  0.25,  0.25,
		 
		-0.25,  0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		
		// TOP FACE
		
		-0.25,  0.25,  0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25,  0.25, -0.25,

		 
		 0.25,  0.25, -0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25,  0.25,  0.25,
		
		// BOTTOM FACE 
		
		-0.25, -0.25, -0.25,
		 
		 0.25, -0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 
		 0.25, -0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		 
		-0.25, -0.25, -0.25,
		
		// LEFT FACE 
		
		-0.25,  0.25,  0.25,
		 
		-0.25, -0.25, -0.25,

		-0.25, -0.25,  0.25,
		 
		 
		-0.25,  0.25,  0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25, -0.25, -0.25,
		
		// RIGHT FACE 
		
		 0.25,  0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 0.25, -0.25, -0.25,
		 
		 
		 0.25,  0.25, -0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25, -0.25,  0.25,
		
		// BACK FACE 
		
		-0.25,  0.25, -0.25,
		 
		 0.25, -0.25, -0.25,

		-0.25, -0.25, -0.25,
		 
		 
		-0.25,  0.25, -0.25,
		 
		 0.25,  0.25, -0.25,
		 
		 0.25, -0.25, -0.25,			 
];

// And their colour

var colors = [

		 // FRONT FACE
		 	
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,

		 	
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 			 
		 // TOP FACE
		 	
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,

		 	
		 0.50,  0.50,  0.50,
		 
		 0.50,  0.50,  0.50,
		 
		 0.50,  0.50,  0.50,
		 			 
		 // BOTTOM FACE
		 	
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,

		 	
		 0.00,  1.00,  1.00,
		 
		 0.00,  1.00,  1.00,
		 
		 0.00,  1.00,  1.00,
		 			 
		 // LEFT FACE
		 	
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,

		 	
		 1.00,  0.00,  1.00,
		 
		 1.00,  0.00,  1.00,
		 
		 1.00,  0.00,  1.00,
		 			 
		 // RIGHT FACE
		 	
		 0.25,  0.50,  0.50,
		 
		 0.25,  0.50,  0.50,
		 
		 0.25,  0.50,  0.50,

		 	
		 0.50,  0.25,  0.00,
		 
		 0.50,  0.25,  0.00,
		 
		 0.50,  0.25,  0.00,
		 			 
		 			 
		 // BACK FACE
		 	
		 0.25,  0.00,  0.75,
		 
		 0.25,  0.00,  0.75,
		 
		 0.25,  0.00,  0.75,

		 	
		 0.50,  0.35,  0.35,
		 
		 0.50,  0.35,  0.35,
		 
		 0.50,  0.35,  0.35,			 			 
];

var verticesAsteroide = [

	// FRONT FACE
	 
	-1.000000, 0.000000, -0.707000, 
	0.000000, 1.000000, 0.707000, 
	1.000000, 0.000000, -0.707000, 

	1.000000, 0.000000, -0.707000, 
	0.000000, 1.000000, 0.707000 ,
	0.000000, -1.000000, 0.707000 ,

	-1.000000, 0.000000, -0.707000 ,
	0.000000, -1.000000, 0.707000 ,
	0.000000, 1.000000, 0.707000 ,

	-1.000000, 0.000000, -0.707000 ,
	1.000000, 0.000000, -0.707000 ,
	0.000000, -1.000000, 0.707000	,		 
	];

// And their colour

var colorsAsteroide = [

	 // FRONT FACE
		 
	 1.00,  0.00,  0.00,
	 
	 1.00,  0.00,  0.00,
	 
	 1.00,  0.00,  0.00,

		 
	 1.00,  1.00,  0.00,
	 
	 1.00,  1.00,  0.00,
	 
	 1.00,  1.00,  0.00,
				  
	 // TOP FACE
		 
	 0.00,  0.00,  0.00,
	 
	 0.00,  0.00,  0.00,
	 
	 0.00,  0.00,  0.00,

		 
	 0.50,  0.50,  0.50,
	 
	 0.50,  0.50,  0.50,
	 
	 0.50,  0.50,  0.50,
		 
];



var normals = [

		// FRONTAL TRIANGLE
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
];

// Initial color values just for testing!!

// They are to be computed by the Phong Illumination Model


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex and the Color Buffers

function initBuffersNave() {	
	
	// Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors
		
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}

function initBuffersAsteroide() {	
	
	// Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesAsteroide), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = verticesAsteroide.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors
		
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsAsteroide), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colorsAsteroide.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Computing the illumination and rendering the model

function computeIllumination( mvMatrix ) {

	// Phong Illumination Model
	
	// Clearing the colors array
	
	for( var i = 0; i < colors.length; i++ )
	{
		colors[i] = 0.0;
	}
	
    // SMOOTH-SHADING 

    // Compute the illumination for every vertex

    // Iterate through the vertices
    
    for( var vertIndex = 0; vertIndex < vertices.length; vertIndex += 3 )
    {	
		// For every vertex
		
		// GET COORDINATES AND NORMAL VECTOR
		
		var auxP = vertices.slice( vertIndex, vertIndex + 3 );
		
		var auxN = normals.slice( vertIndex, vertIndex + 3 );

        // CONVERT TO HOMOGENEOUS COORDINATES

		auxP.push( 1.0 );
		
		auxN.push( 0.0 );
		
        // APPLY CURRENT TRANSFORMATION

        var pointP = multiplyPointByMatrix( mvMatrix, auxP );

        var vectorN = multiplyVectorByMatrix( mvMatrix, auxN );
        
        normalize( vectorN );

		// VIEWER POSITION
		
		var vectorV = vec3();
		
		if( projectionType == 0 ) {
		
			// Orthogonal 
			
			vectorV[2] = 1.0;
		}	
		else {
			
		    // Perspective
		    
		    // Viewer at ( 0, 0 , 0 )
		
			vectorV = symmetric( pointP );
		}
		
        normalize( vectorV );

	    // Compute the 3 components: AMBIENT, DIFFUSE and SPECULAR
	    
	    // FOR EACH LIGHT SOURCE
	    
	    for(var l = 0; l < lightSources.length; l++ )
	    {
			if( lightSources[l].isOff() ) {
				
				continue;
			}
			
	        // INITIALIZE EACH COMPONENT, with the constant terms
	
		    var ambientTerm = vec3();
		
		    var diffuseTerm = vec3();
		
		    var specularTerm = vec3();
		
		    // For the current light source
		
		    ambient_Illumination = lightSources[l].getAmbIntensity();
		
		    int_Light_Source = lightSources[l].getIntensity();
		
		    pos_Light_Source = lightSources[l].getPosition();
		    
		    // Animating the light source, if defined
		    
		    var lightSourceMatrix = mat4();
		    
		    // COMPLETE THE CODE FOR THE OTHER ROTATION AXES
		    
		    if( lightSources[l].isRotYYOn() ) 
		    {
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[l].getRotAngleYY() ) );
			}
			
	        for( var i = 0; i < 3; i++ )
	        {
			    // AMBIENT ILLUMINATION --- Constant for every vertex
	   
			    ambientTerm[i] = ambient_Illumination[i] * kAmbi[i];
	
	            diffuseTerm[i] = int_Light_Source[i] * kDiff[i];
	
	            specularTerm[i] = int_Light_Source[i] * kSpec[i];
	        }
	    
	        // DIFFUSE ILLUMINATION
	        
	        var vectorL = vec4();
	
	        if( pos_Light_Source[3] == 0.0 )
	        {
	            // DIRECTIONAL Light Source
	            
	            vectorL = multiplyVectorByMatrix( 
							lightSourceMatrix,
							pos_Light_Source );
	        }
	        else
	        {
	            // POINT Light Source
	
	            // TO DO : apply the global transformation to the light source?
	
	            vectorL = multiplyPointByMatrix( 
							lightSourceMatrix,
							pos_Light_Source );
				
				for( var i = 0; i < 3; i++ )
	            {
	                vectorL[ i ] -= pointP[ i ];
	            }
	        }
	
			// Back to Euclidean coordinates
			
			vectorL = vectorL.slice(0,3);
			
	        normalize( vectorL );
	
	        var cosNL = dotProduct( vectorN, vectorL );
	
	        if( cosNL < 0.0 )
	        {
				// No direct illumination !!
				
				cosNL = 0.0;
	        }
	
	        // SEPCULAR ILLUMINATION 
	
	        var vectorH = add( vectorL, vectorV );
	
	        normalize( vectorH );
	
	        var cosNH = dotProduct( vectorN, vectorH );
	
			// No direct illumination or viewer not in the right direction
			
	        if( (cosNH < 0.0) || (cosNL <= 0.0) )
	        {
	            cosNH = 0.0;
	        }
	
	        // Compute the color values and store in the colors array
	        
	        var tempR = ambientTerm[0] + diffuseTerm[0] * cosNL + specularTerm[0] * Math.pow(cosNH, nPhong);
	        
	        var tempG = ambientTerm[1] + diffuseTerm[1] * cosNL + specularTerm[1] * Math.pow(cosNH, nPhong);
	        
	        var tempB = ambientTerm[2] + diffuseTerm[2] * cosNL + specularTerm[2] * Math.pow(cosNH, nPhong);
	        
			colors[vertIndex] += tempR;
	        
	        // Avoid exceeding 1.0
	        
			if( colors[vertIndex] > 1.0 ) {
				
				colors[vertIndex] = 1.0;
			}
	        
	        // Avoid exceeding 1.0
	        
			colors[vertIndex + 1] += tempG;
			
			if( colors[vertIndex + 1] > 1.0 ) {
				
				colors[vertIndex + 1] = 1.0;
			}
			
			colors[vertIndex + 2] += tempB;
	        
	        // Avoid exceeding 1.0
	        
			if( colors[vertIndex + 2] > 1.0 ) {
				
				colors[vertIndex + 2] = 1.0;
			}
	    }	
	}
}

function drawModelNave( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	
	// NEW - Aux. Function for computing the illumination
	//coco
	//computeIllumination( mvMatrix );
	
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	initBuffersNave();
	
	// Drawing 
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

function drawModelAsteroide( angleXX2, angleYY2, angleZZ2, 
	sx2, sy2, sz2,
	txasteroide1, tyasteroide1, tzasteroide,
	mvMatrix,
	primitiveType ) {

	// The the global model transformation is an input

	// Concatenate with the particular model transformations

	// Pay attention to transformation order !!

	mvMatrix = mult( mvMatrix, translationMatrix( txasteroide1, tyasteroide1, tzasteroide ) );
			
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ2 ) );

	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY2 ) );

	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX2 ) );

	mvMatrix = mult( mvMatrix, scalingMatrix( sx2, sy2, sz2 ) );
			
	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// NEW - Aux. Function for computing the illumination
	//coco
	//computeIllumination( mvMatrix );

	// Associating the data to the vertex shader

	// This can be done in a better way !!

	initBuffersAsteroide();

	// Drawing 

	// primitiveType allows drawing as filled triangles / wireframe / vertices

	if( primitiveType == gl.LINE_LOOP ) {

	// To simulate wireframe drawing!

	// No faces are defined! There are no hidden lines!

	// Taking the vertices 3 by 3 and drawing a LINE_LOOP

	var i;

	for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {

	gl.drawArrays( primitiveType, 3 * i, 3 ); 
	}
	}	
	else {

	gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 

	}	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// Global transformation !!
		
		globalTz = 0.0;
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 15 );
		
		// Global transformation !!
		
		globalTz = -2.5;

		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = translationMatrix( 0, 0, globalTz );
	
	// Instantianting the current model
		
	drawModelNave( angleXX, angleYY, angleZZ, 
	           sx, sy, sz,
	           tx, ty, tz,
	           mvMatrix,
			   primitiveType );
	
		
	addAsteroid(mvMatrix);

}

function addAsteroid(mvMatrix) {
	for (i=0;i<30;i++){
		if (asteroides[i][0]==1) {
			drawModelAsteroide( asteroides[i][1], asteroides[i][2], asteroides[i][3], 
				asteroides[i][4], asteroides[i][5], asteroides[i][6],
				asteroides[i][7], asteroides[i][8], asteroides[i][9],
				mvMatrix,
				primitiveType );
		}
	}
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

var elapsed = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		elapsed = timeNow - lastTime;
		
		// Global rotation
		
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// Local rotations
		
		if( rotationXX_ON ) {

			angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationYY_ON ) {

			angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationZZ_ON ) {

			angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
		}

		// Rotating the light sources
	
		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {

				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleYY( angle );
			}
		}
	}
	
	lastTime = timeNow;
}

var gameOver = false;

function processAsteroids() {
	score++;
	spawnCount++;

	if (gameOver) {
		gameOver = false;
		window.alert("Game Over");
				reset();
				return;
	}

	if ((score % 500 == 0) && (spawnTop > 5)) spawnTop = spawnTop-5;

	for (i=0;i<30;i++){

		if(asteroides[i][9] >= 3) {
			asteroides[i][0] = 0;
		}
		if (asteroides[i][0] == 1) {
			//Colisão
			if(tx == asteroides[i][7] && ty == asteroides[i][8] && ((Math.abs(tz - asteroides[i][9])) < 0.4)){
				gameOver = true;
			}
			//Speed and Spin
			asteroides[i][9] += elapsed / 100;
			asteroides[i][1] += asteroides[i][10] * asteroides[i][13] * (90 * elapsed) / 1000.0;
			asteroides[i][2] += asteroides[i][11] * asteroides[i][14] * (90 * elapsed) / 1000.0;
		}
	}
	//New Asteroid
	if (spawnCount >= spawnTop) {
		spawnCount = 0;
		if (getFreeIndex() != -1) {
			asteroides[i][0] = 1;
			asteroides[i][7] = (Math.floor(Math.random() * 4) * 0.5) -0.75;
			asteroides[i][8] = (Math.floor(Math.random() * 4) * 0.5) -0.75; 
			asteroides[i][9] = -13; 
			var x = (Math.floor(Math.random() * 2));
			if (x == 0) x = -1;
			var y = (Math.floor(Math.random() * 2));
			if (y == 0) y = -1;
			asteroides[i][10] = x;
			asteroides[i][11] = y;
			asteroides[i][13] = (Math.floor(Math.random() * 6) + 1) / 5;
			asteroides[i][14] = (Math.floor(Math.random() * 6) + 1) / 5;
		}
	}
}

function getFreeIndex() {
	for (i=0;i<30;i++){
		if (asteroides[i][0]==0) return i;
	}
	return -1;
}


function reset() {
	if(score>highscore) highscore = score;
	score = 0;
	spawnTop = 50;
	spawnCount = 0;
	for (i=0;i<30;i++){
		asteroides[i][0]=0;
	}
	tx = -0.25;
	ty = -0.25;
	return -1;
}


//----------------------------------------------------------------------------

// Timer

function tick() {

	document.getElementById('ScoreLabel').innerHTML = score;
	
	requestAnimFrame(tick);
	
	drawScene();
	
	animate();

	if (asteriodesMOVE_ON==1) processAsteroids();
}




//----------------------------------------------------------------------------
//
//  User Interaction
//


//----------------------------------------------------------------------------

function setEventListeners(){
	
	// Simplified OBJ file loading
	
	// Vertices are replicated
	
	// Disregarding face indices
	
	// Adapted from:
	
	// http://stackoverflow.com/questions/23331546/how-to-use-javascript-to-read-local-text-file-and-read-line-by-line
	

	// Text file loading
	
	// Adapted from:
	
	// http://stackoverflow.com/questions/23331546/how-to-use-javascript-to-read-local-text-file-and-read-line-by-line
	
	
	
	// Key events
	document.addEventListener("keypress", function(event) {
		var key = event.keyCode; // ASCII

		switch(key){
			case 97: //left ou 37/97
				if (tx > -0.75) tx -= 0.5;
				break;
			case 100: //right ou 39/100
				if (tx < 0.75) tx += 0.5;
				break;
			case 119: //up ou 38/119
				if (ty < 0.75) ty += 0.5;	
				break;
			case 115: //down ou 40/115
				if (ty > -0.75) ty -= 0.5;
				break;

			case 187:
				scale_up()
				break;
			case 189:
				scale_down()
				break;

			case 82:
				reset()
				break;

			default:
				break;
			}

			drawScene()
		}
	);   
	
	document.getElementById("Start-asteriode-movement").onclick = function(){
		
		// Switching on / off
		
		if( asteriodesMOVE_ON ) {
			
			asteriodesMOVE_ON = 0;
		}
		else {
			
			asteriodesMOVE_ON = 1;
		}  
	};

}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );

		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	initBuffersNave();

	initBuffersAsteroide();
	
	tick();		// NEW --- A timer controls the rendering / animation    

}


