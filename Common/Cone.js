const DefaultNumSides = 8;

function Cone( gl, numSides, vertexShaderId, fragmentShaderId ) {
    
    var vertShdr = vertexShaderId || "Cone-vertex-shader";
    var fragShdr = fragmentShaderId || "Cone-fragment-shader";
    
    this.program = initShaders(gl, vertShdr, fragShdr);
    
    if ( this.program < 0 ) {
        alert( "Error: Cone shader pipeline failed to compile.\n\n" +
              "\tvertex shader id:  \t" + vertShdr + "\n" +
              "\tfragment shader id:\t" + fragShdr + "\n" );
        return;
    }
    
    var n = numSides || DefaultNumSides;
    
    var theta = 0.0;
    var dTheta = 2.0 * Math.PI / n;
    
    this.positions = { numComponents : 3 };
    this.colors = {numComponents : 3 };

    //Color
    var positions = [ 0.0, 0.0, 0.0 ];
    var colors = [0.4, 0.6, 0.8];
    var indices = [ 0 ];
    
    for ( var i = 0; i < n; ++i ) {
        theta = i * dTheta;
        positions.push( Math.cos(theta), Math.sin(theta), 4.0 );
        colors.push(1.0, 0.0, 0.0);
        
        indices.push(n - i);
    }
    // Size of CONE/ Stretch/Color
    positions.push( 0.0, 0.0, 0.0 );
    colors.push(1.0, 0.0, 0.0);
    
    
    indices.push(n);
    
    this.indices = { count : indices.length };
    
  
    indices.push(n + 1);
    

    indices = indices.concat( indices.slice(1,n+2).reverse() );

    
    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );
    
    this.colors.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.colors.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );
    
    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );
    
    this.positions.attributeLoc = gl.getAttribLocation( this.program, "vPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );
    
    this.colors.attributeLoc = gl.getAttribLocation( this.program, "vColor" );
    gl.enableVertexAttribArray( this.colors.attributeLoc );
    
    this.uniforms = {
        MV : undefined,
        P : undefined
    };
    
    this.uniforms.MV = gl.getUniformLocation(this.program, "MV");
    this.uniforms.P = gl.getUniformLocation(this.program, "P");
    
    this.MV = mat4();
    this.P = mat4();
    
    this.render = function () {
        gl.useProgram( this.program );
        
        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer(
                               this.positions.attributeLoc,
                               this.positions.numComponents,
                               gl.FLOAT,
                               gl.FALSE,
                               3 * Float32Array.BYTES_PER_ELEMENT,
                               0
                               );
        
        gl.bindBuffer( gl.ARRAY_BUFFER, this.colors.buffer );
        gl.vertexAttribPointer(
                               this.colors.attributeLoc,
                               this.colors.numComponents,
                               gl.FLOAT,
                               gl.FALSE,
                               3 * Float32Array.BYTES_PER_ELEMENT,
                               0
                               );
        
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
        
        gl.uniformMatrix4fv( this.uniforms.MV, gl.FALSE, flatten(this.MV) );
        gl.uniformMatrix4fv( this.uniforms.P, gl.FALSE, flatten(this.P) );
        
        
       
        gl.drawElements( gl.TRIANGLE_FAN, this.indices.count, gl.UNSIGNED_SHORT, 0 );
        
       
        var offset = this.indices.count * 2 ;
        gl.drawElements( gl.TRIANGLE_FAN, this.indices.count, gl.UNSIGNED_SHORT, offset );
    }
};
