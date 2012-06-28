(function(labitrack){

labitrack.utils = {};
labitrack.utils.new_context = function(w, h){
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	return canvas.getContext('2d');
};

// Color quantization using Euclidean distance
// https://en.wikipedia.org/wiki/Euclidean_distance
// We don't do any alpha blending for now
labitrack.utils.convert_to_monochrome = function(data){
	var p = data.data;
	for(var i = 0, l = p.length; i < l; i+=4) {
		var v = (p[i+3] === 0 // handle alpha
		         ||
		           (Math.pow(p[i], 2) + Math.pow(p[i+1], 2) + Math.pow(p[i+2], 2))
		           >
		           (Math.pow(255-p[i], 2) + Math.pow(255-p[i+1], 2) + Math.pow(255-p[i+2], 2))
		        ) * 255;
		p[i] = p[i+1] = p[i+2] = v;
		p[i+3] = 255;
	}
};

labitrack.utils.time = function(callback){
	var start = Date.now();
	var end = start;
	callback();
	end = Date.now();
	return end - start;
};

}(labitrack));
