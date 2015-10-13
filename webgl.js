var gl;
var frame = 0;

//=========================================================================================
// Shaders
//=========================================================================================
var vertexShaderSource = "\
precision highp float;\
uniform mat4 projection;\
uniform mat4 modelview;\
attribute vec4 a_position;\
attribute vec4 a_color;\
varying vec4 v_color;\
void main() {\
  v_color = a_color;\
  gl_Position = projection * modelview * a_position;\
}";

var fragmentShaderSource = "\
precision mediump float;\
varying vec4 v_color;\
void main () {\
  gl_FragColor = v_color;\
}";

//=========================================================================================
// Main Loop
//=========================================================================================
function matrixRotate(matrix, angle_deg, axis){
  
  
  var angle = angle_deg * 3.1415 / 180;
  
  switch(axis){
    case "x": 
      matrix[5] = Math.cos(angle);
      matrix[6] = Math.sin(angle);  
      matrix[9] = -Math.sin(angle);  
      matrix[10] = Math.cos(angle); 
    break;
    case "y":
      matrix[0] = Math.cos(angle);
      matrix[2] = -Math.sin(angle);  
      matrix[8] = Math.sin(angle);  
      matrix[10] = Math.cos(angle); 
    break;
    case "z":
      matrix[0] = Math.cos(angle);
      matrix[1] = Math.sin(angle);  
      matrix[4] = -Math.sin(angle);  
      matrix[5] = Math.cos(angle);  
    break;
    default:
  }

  return matrix;
}

function webGLStart() {
  var canvas = document.getElementById("webgl-canvas");
  gl = initWebGL(canvas);

  var vertexShader   = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  var fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  var program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
	 
   
  var mat_mv = modelview;
  var mat_p  = projection;
  
  mat_p[0] = 2.0/1440.0;
  mat_p[5] = 2.0/540.0;

  mat_mv = matrixRotate(mat_mv,20*frame,"z");
  
  gl.uniformMatrix4fv(gl.getUniformLocation(program,"projection"),gl.FALSE,mat_p);
  gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelview"),gl.FALSE,mat_mv);
   
  drawScene(gl, program);
  
  frame++;
  setTimeout(webGLStart,10);
}

function mainloop(){
  
  mainloop();
}

function drawScene(gl, program){
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, rect, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  var colorLocation = gl.getAttribLocation(program, "a_color");
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, yellow, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(colorLocation);
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
  
  var elementBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, rect_idx, gl.STATIC_DRAW);
  
  gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_BYTE,0);
  
}