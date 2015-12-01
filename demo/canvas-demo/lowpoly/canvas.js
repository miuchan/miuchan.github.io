var getControlDots = function (element, x, y) {
  var ctrlDots = [],
    blockWidth = element.width/x,
    blockHeight = element.height/y;
  for(var i = 0; i <= x; i++) {
    ctrlDots[i] = [];
    for(var j = 0; j <= y; j++) {
      ctrlDots[i][j] = {x: Math.floor(i*blockWidth), y: Math.floor(j*blockHeight)};
    }
  }
  console.log(ctrlDots);
  return ctrlDots;
}

var getRandomDots = function (element, x, y) {
  var blockWidth = element.width/x,
      blockHeight = element.height/y,
  	  randomDots = [
  					 [0, 0], 
  					 [0, element.height],
  					 [element.width, 0],
  					 [element.width, element.height]
  				   ];
    
  for (var i = 0; i < x; i++) {
    for (var j = 0; j < y; j++) {
      var dotX = Math.floor((Math.random() + i) * blockWidth),
          dotY = Math.floor((Math.random() + j) * blockHeight);
      randomDots.push([ dotX, dotY ]);
    }
  }
  return randomDots;
}
        
var getRandomHexColor = function () {
	var fromColor = parseInt("0xC2185B", 16),
		toColor = parseInt("0xE91E63", 16),
		scale = toColor - fromColor;	
	return "#" + Math.floor((Math.random()) * scale + fromColor).toString(16);
}

var getRandomRGBColor = function () {
	var r = 233 + Math.floor((Math.random() * 10 * 2)), 
		g = 26 + Math.floor((Math.random() * 10 * 18)), 
		b = 96 + Math.floor((Math.random() * 10 * 13));
	return "rgb("+r+","+g+","+b+")";
}

var getRGB = function (i) {
	var colors = [
		// [233, 26, 96],
		// [235, 44, 109],
		// [237, 62, 121],
		[238, 80, 134],
		[240, 98, 146],
		[242, 116, 158],
		[243, 134, 171],
		[245, 152, 183],
		// [247, 170, 196],
		// [249, 188, 208],
		// [254, 205, 221]
	];
	var index = Math.floor(Math.random()*1*colors.length);
	var index = (i+4)%5;
	return colors[index];
}

var getHex = function (i) {
	var colors = [
		'#EF5350',
		'#EC407A',
		'#AB47BC',
		'#7E57C2',
		'#5C6BC0',
		'#42A5F5',
		'#29B6F6',
		'#26C6DA',
		'#26A69A',
		'#66BB6A',
		'#9CCC65',
		'#D4E157',
		'#FFEE58',
		'#FFCA28',
		'#FFA726'
	];
	var index = Math.floor(Math.random()*1*colors.length);
	var index = (i+14)%15;
	return colors[index];
}

window.requestAnimFrame = (function(){  
		return  function( callback ){  
		          window.setTimeout(callback, 1000 / 40);  
		        };  
		})();


var getDots = function (randomDots, a, b, step)
{

	var dots = [],
		flag = Math.floor(Math.random()+0.5),
		angle = Math.PI/2;
	step = (a > b) ? step / a : step / b;
    for(var i = 0; i < randomDots.length; i ++) {

    	
    	// a *= Math.floor(Math.random()*5);
    	// b *= Math.floor(Math.random()*5);
   
   		dots.push([randomDots[i][0] + a * i * Math.cos(step+i*angle), randomDots[i][1] - b * i * Math.sin(step-i*angle)]);
    
    	
    }
    return dots;
};

(function(){
  var oCvs = document.getElementById('cvs');
    if(cvs.getContext){
        var context = oCvs.getContext('2d');
      	context.clearRect(0,0,oCvs.width,oCvs.height); 
      	oCvs.width = oCvs.width;
      	oCvs.height = oCvs.height; 
	    context.translate(0.5, 0.5);
	    context.lineWidth = 1;
	    // context.strokeStyle = "#000";
	    var randomDots = getRandomDots(oCvs, 4, 2);
	    var triangles = Delaunay.triangulate(randomDots);
	    var step = 0;
	    var draw = function () {
	    	step +=0.3;
	    	var dots = getDots(randomDots, 20, 4, step);
	    	
		    for(var i=0;i < triangles.length; i+=3) {
			    var x1 = dots[triangles[i]][0],
				    x2 = dots[triangles[i+1]][0],
				    x3 = dots[triangles[i+2]][0],
				    y1 = dots[triangles[i]][1],
				    y2 = dots[triangles[i+1]][1],
				    y3 = dots[triangles[i+2]][1];

			    context.save();
			    context.beginPath();
			    context.moveTo(x1, y1);
			    context.lineTo(x2, y2);
			    context.lineTo(x3, y3);
			    context.closePath();
			    // context.fillStyle = getRandomRGBColor();
			    // var colorR = Math.floor(233+2*Math.random()*10),
			    	// colorG = Math.floor(26+18*Math.random()*10),
			    	// colorB = Math.floor(96+10*Math.random()*10);
			    // context.fillStyle = "rgb("+colorR+","+colorG+","+colorB+")";
			    var rgb = getRGB(i);
			    var gra = context.createLinearGradient(x1, y1, x2, y2);
			    // gra.addColorStop(0.8, "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")");
			    // gra.addColorStop(0.2, "rgb("+(rgb[0]+6)+","+(rgb[1]+54)+","+(rgb[2]+39)+")");
			    gra.addColorStop(0.8, getHex(i));
			    gra.addColorStop(0.2, getHex(i+2));
			    context.fillStyle = gra;
			    context.fill();
			    context.restore();
			}
		    var dotsLenth = dots.length;
		    /*
		    for(var i = 0; i < dotsLenth; i++) {
		        context.beginPath();
		         context.arc(dots[i][0], dots[i][1], 15, 0, 2*Math.PI);
		        context.closePath();
		        context.stroke();
		      
		    }
		    */
		    requestAnimFrame(draw); 
	    }
			
	    draw();
	     
    }
})();

