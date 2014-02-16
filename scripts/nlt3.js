
/*
 * Defines a shape using a non-linear (arbitrary) transformation, f(x, y)->(x, y)'.
 * Outlines should be lists of points, which are connected by a line segment.
 * 
 * min_px defines a threshold to throw out segments,
 * until the distance between the first and last transformed point exceeds the threshold.
 * 
 */
// recursive division and agglomeration
// DIV: for a line to, test if midpoint is colinear; if not, recursively line to until sufficient colinearity is found
// AGG: if current point is colinear with next point, don't add it

function nltFill3(ctx, outlines, t, cls2, tpt) {
//	var cls2 = cls / 2;
	var outlinen = outlines.length;
	for (var outlinei = 0; outlinei < outlinen; ++outlinei) {
		var outline = outlines[outlinei];
		nltFill3_(ctx, outline, t, cls2, tpt);
	}
}
function nltFill3_(ctx, outline, t, cls2, tpt) {
	var n = outline.length;
	t(outline[0], outline[1], tpt);
	var mx = tpt[0];
	var my = tpt[1];
	var px = tpt[0];
	var py = tpt[1];
	ctx.beginPath();
	ctx.moveTo(px, py);
	t(outline[2], outline[3], tpt);
	var x = tpt[0];
	var y = tpt[1];
//		var lx = px;
//		var ly = py;
	for (var i = 4; i < n; i += 2) {
//			alert("[" + i + "] / " + n);
		t(outline[i], outline[i + 1], tpt);
		var nx = tpt[0];
		var ny = tpt[1];
		/*
			var dx = x - x0;
			var dy = y - y0;
			if (minPx <= dx || minPx <= dy || minPx2 <= dx * dx + dy * dy) {
				ctx.lineTo(x, y);
//				alert("line to " + x + ", " + y);
				x0 = x;
				y0 = y;
			}
			*/
//			lineto(ctx, 
//					px, py, outline[i - 4], outline[i - 3], 
//					x, y, outline[i - 2], outline[i - 1],
//					nx, ny, 
//					cls, t, tpt);
//			var dx = x - lx;
//			var dy = y - ly;
//			if ((minPx <= dx || minPx <= dy || minPx2 <= dx * dx + dy * dy) 
//					//&& !isCollinear(px, py, x, y, nx, ny, cls2)
//					) {
			lineto3(ctx, 
					px, py, outline[i - 4], outline[i - 3], 
					x, y, outline[i - 2], outline[i - 1],
					nx, ny,
					cls2, t, tpt);
//				lx = x;
//				ly = y;
//			}
		px = x;
		py = y;
		x = nx;
		y = ny;
	}
	lineto3(ctx, 
			px, py, outline[n - 4], outline[n - 3],
			x, y, outline[n - 2], outline[n - 1],
			mx, my,
			cls2, t, tpt);
	//ctx.lineTo(mx, my);
	// Close
	lineto3(ctx, 
			x, y, outline[n - 2], outline[n - 1],
			mx, my, outline[0], outline[1],
			mx, my,
			cls2, t, tpt);
	ctx.closePath();
	ctx.fill();
}

function nltFill2(ctx, outlines, t, cls2, tpt) {
//	var cls2 = cls / 2;
	var outlinen = outlines.length;
	
	for (var outlinei = 0; outlinei < outlinen; ++outlinei) {
		var outline = outlines[outlinei];
		var n = outline.length;
		t(outline[0], outline[1], tpt);
		var mx = tpt[0];
		var my = tpt[1];
		var px = tpt[0];
		var py = tpt[1];
		ctx.beginPath();
		ctx.moveTo(px, py);
		t(outline[2], outline[3], tpt);
		var x = tpt[0];
		var y = tpt[1];
//		var lx = px;
//		var ly = py;
		for (var i = 4; i < n; i += 2) {
//			alert("[" + i + "] / " + n);
			t(outline[i], outline[i + 1], tpt);
			var nx = tpt[0];
			var ny = tpt[1];
			/*
			var dx = x - x0;
			var dy = y - y0;
			if (minPx <= dx || minPx <= dy || minPx2 <= dx * dx + dy * dy) {
				ctx.lineTo(x, y);
//				alert("line to " + x + ", " + y);
				x0 = x;
				y0 = y;
			}
			*/
//			lineto(ctx, 
//					px, py, outline[i - 4], outline[i - 3], 
//					x, y, outline[i - 2], outline[i - 1],
//					nx, ny, 
//					cls, t, tpt);
//			var dx = x - lx;
//			var dy = y - ly;
//			if ((minPx <= dx || minPx <= dy || minPx2 <= dx * dx + dy * dy) 
//					//&& !isCollinear(px, py, x, y, nx, ny, cls2)
//					) {
				lineto2(ctx, 
						px, py, outline[i - 4], outline[i - 3], 
						x, y, outline[i - 2], outline[i - 1],
						nx, ny,
						cls2, t, tpt);
//				lx = x;
//				ly = y;
//			}
			px = x;
			py = y;
			x = nx;
			y = ny;
		}
		lineto2(ctx, 
				px, py, outline[n - 4], outline[n - 3],
				x, y, outline[n - 2], outline[n - 1],
				mx, my,
				cls2, t, tpt);
		//ctx.lineTo(mx, my);
		// Close
		lineto2(ctx, 
				x, y, outline[n - 2], outline[n - 1],
				mx, my, outline[0], outline[1],
				mx, my,
				cls2, t, tpt);
		ctx.closePath();
		ctx.fill();
	}
}

function nltFill1(ctx, outlines, t, cls2, tpt) {
//	var cls2 = cls / 2;
	for (var outlinei = 0, outlinen = outlines.length; outlinei < outlinen; ++outlinei) {
		ctx.beginPath();
		var outline = outlines[outlinei];
		var n = outline.length;
		t(outline[0], outline[1], tpt);
		var mx = tpt[0];
		var my = tpt[1];
		var px = tpt[0];
		var py = tpt[1];
		ctx.moveTo(px, py);
		t(outline[2], outline[3], tpt);
		var x = tpt[0];
		var y = tpt[1];
		for (var i = 4; i < n; i += 2) {
			t(outline[i], outline[i + 1], tpt);
			var nx = tpt[0];
			var ny = tpt[1];
			lineto1(ctx, 
					px, py, outline[i - 4], outline[i - 3], 
					x, y, outline[i - 2], outline[i - 1],
					nx, ny,
					cls2, t, tpt);
			px = x;
			py = y;
			x = nx;
			y = ny;
		}
		lineto1(ctx, 
				px, py, outline[n - 4], outline[n - 3],
				x, y, outline[n - 2], outline[n - 1],
				mx, my,
				cls2, t, tpt);
		// Close
		lineto1(ctx, 
				x, y, outline[n - 2], outline[n - 1],
				mx, my, outline[0], outline[1],
				mx, my,
				cls2, t, tpt);
		ctx.closePath();
		ctx.fill();
	}
}

// places lineTo onto the context up to (x, y), given 1st order history and future
/*
function lineto(ctx, px, py, opx, opy, x, y, ox, oy, nx, ny, cls, t, tpt) {
	if (! isCollinear(px, py, x, y, nx, ny, cls)) {
		lineto2(ctx, px, py, opx, opy, x, y, ox, oy, cls, t, tpt);
	}
	// else wait for the line in the future
}
*/
function lineto3(ctx, px, py, opx, opy, x, y, ox, oy, nx, ny, cls2, t, tpt) {
	var omidx = (opx + ox) / 2;
	var omidy = (opy + oy) / 2;
	var omid1x = (opx + omidx) / 2;
	var omid1y = (opy + omidy) / 2;
	var omid2x = (omidx + ox) / 2;
	var omid2y = (omidy + oy) / 2;
	
	t(omidx, omidy, tpt);
	var midx = tpt[0];
	var midy = tpt[1];
//	if (isCollinear(px, py, midx, midy, x, y, cls2)) {
		// 2nd order
		
		t(omid1x, omid1y, tpt);
		var mid1x = tpt[0];
		var mid1y = tpt[1];
		
		t(omid2x, omid2y, tpt);
		var mid2x = tpt[0];
		var mid2y = tpt[1];
		
		var c1 = isCollinear(px, py, mid1x, mid1y, midx, midy, cls2);
		var c2 = isCollinear(midx, midy, mid2x, mid2y, x, y, cls2);
		if (c1 && c2) {
			if (! isCollinear(px, py, x, y, nx, ny, cls2)) {
				ctx.lineTo(x, y);
			}
		}
		else if (c1) {
			ctx.lineTo(midx, midy);
			
			lineto3(ctx, midx, midy, omidx, omidy, mid2x, mid2y, omid2x, omid2y, mid2x, mid2y, cls2, t, tpt);
			lineto3(ctx, mid2x, mid2y, omid2x, omid2y, x, y, ox, oy, nx, ny, cls2, t, tpt);
		}
		else if (c2) {
			
			lineto3(ctx, px, py, opx, opy, mid1x, mid1y, omid1x, omid1y, mid1x, mid1y, cls2, t, tpt);
			lineto3(ctx, mid1x, mid1y, omid1x, omid1y, midx, midy, omidx, omidy, x, y, cls2, t, tpt);
			ctx.lineTo(x, y);
		}
		
//	}
	else {
		// Subdivide both sides
//		lineto3(ctx, px, py, opx, opy, midx, midy, omidx, omidy, x, y, cls2, t, tpt);
//		lineto3(ctx, midx, midy, omidx, omidy, x, y, ox, oy, nx, ny, cls2, t, tpt);
		lineto3(ctx, px, py, opx, opy, mid1x, mid1y, omid1x, omid1y, mid1x, mid1y, cls2, t, tpt);
		lineto3(ctx, mid1x, mid1y, omid1x, omid1y, midx, midy, omidx, omidy, x, y, cls2, t, tpt);
		lineto3(ctx, midx, midy, omidx, omidy, mid2x, mid2y, omid2x, omid2y, mid2x, mid2y, cls2, t, tpt);
		lineto3(ctx, mid2x, mid2y, omid2x, omid2y, x, y, ox, oy, nx, ny, cls2, t, tpt);
	}
}
function lineto2(ctx, px, py, opx, opy, x, y, ox, oy, nx, ny, cls2, t, tpt) {
	var omidx = (opx + ox) / 2;
	var omidy = (opy + oy) / 2;
	
	t(omidx, omidy, tpt);
	var midx = tpt[0];
	var midy = tpt[1];
//	if (isCollinear(px, py, midx, midy, x, y, cls2)) {
		// 2nd order
		
		if (isCollinear(px, py, midx, midy, x, y, cls2)) {
			if (! isCollinear(px, py, x, y, nx, ny, cls2)) {
				ctx.lineTo(x, y);
			}
		}
		
		
//	}
	else {
		// Subdivide both sides
//		lineto3(ctx, px, py, opx, opy, midx, midy, omidx, omidy, x, y, cls2, t, tpt);
//		lineto3(ctx, midx, midy, omidx, omidy, x, y, ox, oy, nx, ny, cls2, t, tpt);
		lineto2(ctx, px, py, opx, opy, midx, midy, omidx, omidy, x, y, cls2, t, tpt);
		lineto2(ctx, midx, midy, omidx, omidy, x, y, ox, oy, nx, ny, cls2, t, tpt);
	}
}
function lineto1(ctx, px, py, opx, opy, x, y, ox, oy, nx, ny, cls2, t, tpt) {
	if (! isCollinear(px, py, x, y, nx, ny, cls2)) {
	
	var omidx = (opx + ox) / 2;
	var omidy = (opy + oy) / 2;
	
	t(omidx, omidy, tpt);
	var midx = tpt[0];
	var midy = tpt[1];
//	if (isCollinear(px, py, midx, midy, x, y, cls2)) {
		// 2nd order
		
		if (isCollinear(px, py, midx, midy, x, y, cls2)) {
			ctx.lineTo(x, y);
		}
		else {
			
			// Subdivide both sides
	//		lineto3(ctx, px, py, opx, opy, midx, midy, omidx, omidy, x, y, cls2, t, tpt);
	//		lineto3(ctx, midx, midy, omidx, omidy, x, y, ox, oy, nx, ny, cls2, t, tpt);
			lineto1(ctx, px, py, opx, opy, midx, midy, omidx, omidy, x, y, cls2, t, tpt);
			lineto1(ctx, midx, midy, omidx, omidy, x, y, ox, oy, nx, ny, cls2, t, tpt);
		}
	}
}
function isCollinear(x1, y1, x2, y2, x3, y3, cls2) {
	return Math.abs(x3 * (y1 - y2) + x1 * (y2 - y3) + x2 * (y3 - y1)) <= cls2;
}


// use the elliptic LUT
// ept = [x, depth]
// len must be positive
function ellipticPt(tw, len, ept) {
	var s = elliptic_lut_tw / tw;
	len *= s;
	var i = 2 * (elliptic_ss_lut_max - 1 < len
        	? elliptic_ss_lut_max - 1
        	: Math.floor(len));
	ept[0] = elliptic_ss_lut[i] / s;
	ept[1] = elliptic_ss_lut[i + 1];
}
/*
function ellipticPtNorm(len, ept) {
	var e = elliptic_ss_lut[elliptic_ss_lut_max - 1 < len
        	? elliptic_ss_lut_max - 1
        	: Math.floor(len)];
	ept[0] = e[3];
	ept[1] = e[4];
//	if (e[0] < 0) {
//		ept[0] = elliptic_lut[e[1]][1];
//		ept[1] = elliptic_lut[e[1]][2];
//	}
//	else if (elliptic_lut.length <= e[1]) {
//		ept[0] = elliptic_lut[e[0]][1];
//		ept[1] = elliptic_lut[e[0]][2];
//	}
//	else {
//	var i0 = e[0];
//	var i1 = e[1];
//		var u = e[2];
//		ept[0] = elliptic_lut[i0][1] * (1 - u) + elliptic_lut[i1][1] * u;
//		ept[1] = elliptic_lut[i0][2] * (1 - u) + elliptic_lut[i1][2] * u;
//	}
}
*/
function stepf(u) {
	if (1 <= u) { return 0; }
	var i = step_lut_sample_n * u;
	var i0 = Math.floor(i);
	var iu = i - i0;
	return iu <= 0 ? step_lut[i0] : ((1 - iu) * step_lut[i0] + iu * step_lut[i0 + 1]);
}

/*
 * Samples the unit space based on p
 * Breaks into fs.length equally spaces units
 * centers a Stepf on each unit
 * hfLut[i] represents the height fraction for sample i
 */
function createHfLut(fs, hfLut, n) {
	//var n = 1 + Math.ceil(1.0 / p);
	var b = 0.65;
	var u0 = 0.0;
	var u1 = 1.0;
	var nn = 1;
//	var fsn = fs.length;
	var fis = (u1 - u0) / functionSummaries.length;
	for (var i = 0; i < n; ++i) {
		var u = (1.0 * i) / n;
		var fic = Math.floor(functionSummaries.length * u);
		var v = 0;
		var fi0 = Math.max(0, fic - nn), fi1 = Math.min(functionSummaries.length - 1, fic + nn);
		for (var fi = fi0;
			fi <= fi1; ++fi) {
			var ficu = u0 + fis / 2 + fis * fi;
			var su = b * (u - ficu) * 2.0 / fis;
//			alert("" + fi + ":" + su);
			v += fs[fi] * (su < 0 ? stepf(-su) : stepf(su));
		}
		hfLut[i] = v;
		
		
		
	}
	hfLut[n] = hfLut[n - 1];
//	alert(hfLut);
}
// u on [0, 1]
function hfLut(hfLut, n, u) {
//	return hfLut[Math.floor(n * u)];
	var i = n * u;
	var i0 = Math.floor(i);
	var iu = i - i0;
	return iu <= 0 ? hfLut[i0] : ((1 - iu) * hfLut[i0] + iu * hfLut[i0 + 1]);
}





function init() {


	$("input[name='audio']").change( function() {
		setWordAudioEnabled($(this).is(':checked'));
	});
	$("input[name='order']").change( function() {
		var val = $(this).val();
		if ("0" == val) {
			orderIndex = 0;
			loadState = 0;
		}
		else if ("1" == val) {
			orderIndex = 1;
			loadState = 0;
		}
		else if ("2" == val) {
			orderIndex = 2;
			loadState = 0;
		}
		else if ("3" == val) {
			orderIndex = 3;
			loadState = 0;
		}
		else if ("4" == val) {
			orderIndex = 4;
			loadState = 0;
		}
	});
	
//	initView();
	
	resize();
}

function resize() {

	var tw = $("#thesurfaceContainer").width();
	var th = $("#thesurfaceContainer").height();
	
	var thesurface = document.getElementById("thesurface");
	thesurface.width = tw;
	thesurface.height = th;
	

//	$("#thesurface").width($("#thesurfaceContainer").width());
//	$("#thesurface").height($("#thesurfaceContainer").height());
	
	paint();
}


var stepTime0 = 0;
var stepCount = 0;
var stepCountPeriod = 24;
var meanFps = 0;

function step() {
	if (0 == (stepCount % stepCountPeriod)) {
		var time = new Date().getTime();
		meanFps = 1000.0 * stepCountPeriod / (time - stepTime0);
		stepTime0 = time;
//		stepCount = 0;
	}
	++stepCount;
	
	// Accelerated scrolling ...
	if (! down) {
		fOff += pScrollStepPerFrame;
		pScrollStepPerFrame *= scrollStepDegrade;
	}
	
	paint();
}

//var temprfs = new Array(ptn);

var SURFACE_OUTLINE=[[false, 0,0, 0,1, 1,1, 1,0]];

var fOff = 0;
var ifOff = 0;


var tept = [0, 0];
var tpt = [0, 0];



var py0 = 0.03;
var py1 = 1 - py0;
function py(u) {
	return (1 - u) * py0 + u * py1;
}
var px0 = 0.01;
var px1 = 1 - px0;
function px(u) {
	return (1 - u) * px0 + u * px1;
}

var fsRects = new Array(functionSummaries.length);
for (var i = 0; i < functionSummaries.length; ++i) {
	var x0 = px(i / functionSummaries.length);
	var x1 = px((i + 1) / functionSummaries.length);
	var y0 = py(0);
	var y1 = py(1);
	fsRects[i] = [x0,y0, x0,y1, x1,y1, x1,y0];
}


var yearIndex = 0;
var orderIndex = 1;


// normal w/h
var nw = 1;
var nh = 1;
// center w/h
var cw = 1;
var ch = 1;
var w;
var h;

var sidebarw;
var sidebarh;
var sidebar0y;
var sidebar0wi;
var sidebarLineh;

var bw;
var bh;


var epfCorrection = (1.0 + envelope_pinchf);


var speechBox = [0, 0, 0, 0];


var owfs = new Array(wordSummaries.length + 1);
function initView() {
	var fOffi = 0;
	for (var owi = 0; owi < wordSummaries.length; ++owi) {
		owfs[owi] = fOffi;
		
		var wi = yearOrder[yearIndex][orderIndex][owi];
		var wf = yearDetails[yearIndex][wi][1] <= 0 ? 0
//				: yearDetails[yearIndex][wi][1] / yearSummaries[yearIndex][7];
		: Math.log(yearDetails[yearIndex][wi][1]) / Math.log(yearSummaries[yearIndex][7]);
		var wwf = (1 - wf) * minwf + wf * maxwf;
		
		fOffi += Math.max(wwf + 0.1, 1.0);
	}
	owfs[wordSummaries.length] = fOffi;
	
	startSpeech();
}

function owif(fOff) {
	var owi = binarySearch(owfs, 0, wordSummaries.length, fOff);
	if (owi < 0) {
		owi = -owi - 2;
	}
	return owi < 0 ? 0 : owi;
}


var minwf = 0.25;
var maxwf = 0.8;
var s = 0.8;
var minhf = 0.3;
var maxhf = 0.8;

var envelopeLoadAhead = 1;
var wordAudioThresh = 0.25;
//var wordAudioThresh = 0.01;

var loadState = 0;


var yearfs = new Array(yearSummaries.length);
var yearAdvf = 0.1;
var yearPushDownf = 0.03;
for (var yi = 0; yi < yearSummaries.length; ++yi) {
	yearfs[yi] = 0;
}



// mult the width of the screen
//var extentLenf = 0.8; 
var extentLenf = 1.2; 
function paint() {

	
	
	var thesurface = document.getElementById("thesurface");
	var ctx = thesurface.getContext("2d");
	w = thesurface.width;
	h = thesurface.height;


	ctx.save();
		
	ctx.clearRect(0, 0, w, h);

	if (null == getYearDetails(yearIndex) || null == getYearOrder(yearIndex)) {
//		ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
//		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.font = "14px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.fillText("Loading year " + yearSummaries[yearIndex][0], 24 * Math.cos(stepCount * Math.PI / fps) + w / 2, h / 2);
		loadState = 0;
	}
	else if (0 == loadState) {
		initView();
		loadState = 1;
	}
	

	
		
		// Years
		for (var yi = 0; yi < yearSummaries.length; ++yi) {
			var t = yearIndex == yi ? 1 : 0;
			yearfs[yi] = (1 - yearAdvf) * yearfs[yi] + yearAdvf * t;
		}
		
		bw = w / yearSummaries.length;
		var bfh = bw / 4;
		bh =  bfh + yearPushDownf * h;
		
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.font = Math.floor(bfh) + "px sans-serif";
		var maxAmount = 0;
		var maxAccounts = 0;
		var maxWords = 0;
		for (var yi = 0; yi < yearSummaries.length; ++yi) {
			var amount = yearSummaries[yi][1];
			var accounts = yearSummaries[yi][2];
			var words = yearSummaries[yi][3];
			if (maxAmount < amount) { maxAmount = amount; }
			if (maxAccounts < accounts) { maxAccounts = accounts; }
			if (maxWords < words) { maxWords = words; }
		}
		
		
		var ybh = bh - bfh - 12;
		var ybyOff = bfh + 8;
		var ybxOff = (bw - 13) / 2;
		for (var yi = 0; yi < yearSummaries.length; ++yi) {
			var hover = mousePt[1] < bh && yi * bw < mousePt[0] && mousePt[0] < (yi + 1) * bw;
			var u = yearfs[yi];
			ctx.translate(yi * bw, 0);
				if (0.01 < u) {
					ctx.fillStyle = "rgba(230, 230, 230, " + u + ")";
					ctx.fillRect(0, 0, bw, bh);
				}
				ctx.fillStyle = hover ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, " + (0.3 * (1 - u) + 1.0 * u) + ")";
				ctx.fillText("" + yearSummaries[yi][0], 0.5 * bw, 4);
				
				ctx.fillStyle = "rgba(255, 0, 0, 1)";
				ctx.fillRect(ybxOff, ybyOff, 3, (yearSummaries[yi][1] / maxAmount) * ybh);
				ctx.fillStyle = "rgba(0, 0, 255, 1)";
				ctx.fillRect(ybxOff + 5, ybyOff, 3, (yearSummaries[yi][2] / maxAccounts) * ybh);
				ctx.fillStyle = "rgba(0, 0, 0, 1)";
				ctx.fillRect(ybxOff + 10, ybyOff, 3, (yearSummaries[yi][3] / maxWords) * ybh);
			ctx.translate(-(yi * bw), 0);
		}
		
		// Summary text for the current year
		ctx.font = "10px sans-serif";
		var text1 = readableDollar(yearSummaries[yearIndex][1]) + " spending for year";
		var text2 = yearSummaries[yearIndex][2] + " accounts for year";
		var text3 = yearSummaries[yearIndex][3] + " words for year";
		var atw1 = ctx.measureText(text1).width;
		var atw2 = ctx.measureText(text2).width;
		var atw3 = ctx.measureText(text3).width;
		var atw = atw1 + 8 + atw2 + 8 + atw3;
		var lxoff = yearIndex * bw;
		if (lxoff < 4) { lxoff = 4; }
		else if (w - 4 < lxoff + atw) {
			lxoff = w - 4 - atw;
		}
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
			ctx.fillText(text1, lxoff, bh + 4);
			ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
			ctx.fillText(text2, lxoff + atw1 + 8, bh + 4);
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.fillText(text3, lxoff + atw1 + 8 + atw2 + 8, bh + 4);
		
			

			// FIXME: org this function into sub-funcs
			if (0 == loadState) { return; }
			
			
			
			var text = speechActive ? "READER ON" : "READER OFF";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.font = "10px sans-serif";
			
			speechBox[0] = 4;
			speechBox[1] = bh + 20;
			speechBox[2] = speechBox[0] + 2 + ctx.measureText(text).width + 2;
			speechBox[3] = speechBox[1] + 10 + 2;
			var hover = speechBox[0] < mousePt[0] && mousePt[0] < speechBox[2]
			&& speechBox[1] < mousePt[1] && mousePt[1] < speechBox[3];
			ctx.fillStyle = hover ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.3)";
			ctx.fillText(text, speechBox[0] + 2, speechBox[1]);
			
			
			

			var cfOff = fOff + ifOff;
			
			
		// context side bar
		
			
		 sidebarh = h - bh - 12;
	 sidebarw = 0;
	 var p1 = 70;
//		var p1 = 106;
		var p2 = 70;
		var p3 = 26;
		var p4 = 4;
			var lineh = 9;
			var sowi = owif(cfOff);
			var sowf = owfs[sowi];
			var sowflen = owfs[sowi + 1] - sowf;
			var yOff0 = bh + 12 + sidebarh / 2 + lineh / 2;
			var yOff = -lineh * (cfOff - sowf) / sowflen + yOff0;
			sidebar0y = yOff;
			sidebar0wi = sowi;
			sidebarLineh = lineh;
			

			
			ctx.font = lineh + "px sans-serif";
			ctx.textAlign = "right";
			ctx.textBaseline = "top";
			var wi = yearOrder[yearIndex][orderIndex][sowi];
			var text1 = wordSummaries[wi][0];
//			var text2 = "#" + (sowi + 1);
			var text3 = readableDollar(yearDetails[yearIndex][wi][0]);
			var text4 = "" + yearDetails[yearIndex][wi][1];
			var tw1 = ctx.measureText(text1).width;
			if (sidebarw < tw1) { sidebarw = tw1; }

			
			ctx.fillStyle = "rgba(0, 0, 255, 0.5)"; 
			ctx.fillText(text4, w - p4, yOff);
			ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
			ctx.fillText(text3, w - p3, yOff);
//			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
//			ctx.fillText(text2, w - p2, yOff);

			ctx.fillStyle = "rgba(0, 0, 0, 1)";
			ctx.fillText(text1, w - p1, yOff);
			var linesExtent = Math.floor((sidebarh / 2 - lineh / 2) / lineh);
			// top
			for (var i = 1; i <= linesExtent; ++i) {
				if (sowi - i < 0) { break; }
				wi = yearOrder[yearIndex][orderIndex][sowi - i];
				text1 = wordSummaries[wi][0];
				text2 = "#" + (sowi - i + 1);
				text3 = readableDollar(yearDetails[yearIndex][wi][0]);
				text4 = "" + yearDetails[yearIndex][wi][1];
				tw1 = ctx.measureText(text1).width;
				if (sidebarw < tw1) { sidebarw = tw1; }
				var lyOff = yOff - i * lineh;
				ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
				ctx.fillText(text4, w - p4, lyOff);
				ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
				ctx.fillText(text3, w - p3, lyOff);
//				ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
//				ctx.fillText(text2, w - p2, lyOff);
				ctx.fillStyle = "rgba(0, 0, 0, 1)";
				ctx.fillText(text1, w - p1, lyOff);
			}
			// bottom
			for (var i = 1; i <= linesExtent; ++i) {
				if (wordSummaries.length <= sowi + i) { break; }
				wi = yearOrder[yearIndex][orderIndex][sowi + i];
				text1 = wordSummaries[wi][0];
				text2 = "#" + (sowi + i + 1);
				text3 = readableDollar(yearDetails[yearIndex][wi][0]);
				text4 = "" + yearDetails[yearIndex][wi][1];
				tw1 = ctx.measureText(text1).width;
				if (sidebarw < tw1) { sidebarw = tw1; }
				var lyOff = yOff + i * lineh;
				ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
				ctx.fillText(text4, w - p4, lyOff);
				ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
				ctx.fillText(text3, w - p3, lyOff);
//				ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
//				ctx.fillText(text2, w - p2, lyOff);
				ctx.fillStyle = "rgba(0, 0, 0, 1)";
				ctx.fillText(text1, w - p1, lyOff);
			}

			sidebarw += 8 + p1;


			ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
			ctx.fillRect(w - sidebarw, yOff0 + (1 - maxwf) / 2 * lineh + 2 , sidebarw, lineh);
		
			
			

			// normal w/h
			nw = (w - sidebarw)  / 6;
			nh = Math.min(nw / 3, (h - bh) / 6);
			// center w/h
			cw = 2 * (w - sidebarw) / 3;
			ch = Math.min(2 * cw / 3, (h - bh) / 3);
			// left margin width
			var mw = (w - sidebarw - cw) / 2;
			
			var extentf = extentLenf * (w - sidebarw) / nw;
			
			
		
		
		
		

		var tlmarg = 8;
		var amarg = 12;
		var amarg2 = 16;
		
		var blmarg = 46;
		

		var cy =  bh + 7 * (h - bh) / 12;
		
		
//		var th = 100;
//		var th1 = 200;
		

		// TODO: set up LUT w/ cache interface. values should be treated as cached
		//var thfLut = thfLut0;
//		var fs = fs0;
		
//		ctx.fillStyle = "rgba(192, 192, 192, 0.6)";
//		dottedLine(ctx, mw, 0, mw, h, 12, 1);
//		dottedLine(ctx, w - mw, 0, w - mw, h, 12, 1);
		
		
//		var fOffi = 0;
		
		var minOwi = owif(cfOff - extentf);
		var maxOwi = owif(cfOff + 1 + extentf);
		
		for (var owi = minOwi; owi <= maxOwi; ++owi) {
			var fOffi = owfs[owi];
			
			
			var wi = yearOrder[yearIndex][orderIndex][owi];
			
//			var maxAmount = 1;
//			var maxAccounts = 1;
			
			
			var wf = yearDetails[yearIndex][wi][1] <= 0 ? 0
//					: yearDetails[yearIndex][wi][1] / yearSummaries[yearIndex][7];
			: Math.log(yearDetails[yearIndex][wi][1]) / Math.log(yearSummaries[yearIndex][7]);
			var hf = yearDetails[yearIndex][wi][0] <= 0 ? 0
					: Math.log(yearDetails[yearIndex][wi][0]) / Math.log(yearSummaries[yearIndex][5]);
			
			
//			for (var i = 0; i < functionSummaries.length; ++i) {
////				var accounts = yearDetails[yearIndex][wi][3][2 * i + 1];
////				fs[i] = accounts / maxAccounts;
//				var amount = yearDetails[yearIndex][wi][3][2 * i];
//				fs[i] = amount <= 0 ? 0
//						: Math.log(amount) / Math.log(yearSummaries[yearIndex][4]);
//			}
			
			

//			var wi = wordIndex;
			
			
//			var ww = outline[1] - outline[0];
//			var wh = outline[3] - outline[2];
			// fill fractions
			var wwf = (1 - wf) * minwf + wf * maxwf;
			var whf = (1 - hf) * minhf + hf * maxhf;
			var nww = nw * wwf;
			var nwh = nh * whf;
			var cww = cw * wwf;
			var cwh = ch * whf;
			
			var minAlphaUnder = 0.2;
			var maxAlphaUnder = 1.0;
			var maxAlphaOver = 0.6;
			var minAlphaOver = 0.2;
			var maxLabelAlpha = 1.0;
			var minLabelAlpha = 0.2;
			
//			var b = 0.45;
			var b = ch * minhf / cwh;
			var bwf = (1.0 - maxwf) / 2;
			
			// ch * minhf = b * whf
			
			
			var toph = cy-cwh-tlmarg - (bh + 40) /* 3 lines of 10px text */;
			var max45LenTop = Math.sqrt(2) * toph;
			var bottomh = h - cy - amarg2 - blmarg - 40;
			var max45LenBottom = Math.sqrt(2) * bottomh;
			
			
			
			// style cut off points on either side (transition back to normal)
			if (fOffi < cfOff + 1 && cfOff < fOffi + wwf) {
//				if (true) { continue; }
				
				if (speechActive && Math.abs(fOffi - (cfOff + (1 - maxwf) / 2)) < wordAudioThresh) {
					playWordAudio(wi, wf, hf);
				}
				var _hfLut = getHfLut(yearIndex, wi);
				var maxAmount = 0;
				var maxAccounts = 0;
				for (var i = 0; i < functionSummaries.length; ++i) {
					var amount = yearDetails[yearIndex][wi][3][2 * i];
					var accounts = yearDetails[yearIndex][wi][3][2 * i + 1];
					if (maxAmount < amount) { maxAmount = amount; }
					if (maxAccounts < accounts) { maxAccounts = accounts; }
//					fs[i] = amount <= 0 ? 0
//							: Math.log(amount) / Math.log(yearSummaries[yearIndex][4]);
				}
//				for (var i = 0; i < functionSummaries.length; ++i) {
//					var accounts = yearDetails[yearIndex][wi][3][2 * i + 1];
//					fs[i] = accounts <= 0 ? 0
//							: accounts / maxAccounts;
//				}
				
				
				var envelope = getEnvelope(wi);
				for (var lah = Math.min(wordSummaries.length - owi, envelopeLoadAhead); 1 <= lah; --lah) {
					getEnvelope(yearOrder[yearIndex][orderIndex][owi + lah]);
				}
				
				var cx0 = Math.max(0, Math.min(1, (cfOff - fOffi) / wwf));
				var cx1 = Math.min(1, Math.max(0, ((cfOff + 1) - fOffi) / wwf));
				var bcx0 = Math.max(0, Math.min(1, (cfOff - fOffi) / wwf + bwf));
				var bcx1 = Math.min(1, Math.max(0, ((cfOff + 1) - fOffi) / wwf - bwf));
//				var bcx1 = cx1 - bwf;
//				var cx0 = 0;
//				var cx1 = 1;
				// TODO: must define transition width
				var blend = function(x) {
//					return x < cx0 ? (1 - stepf(x / cx0))
//							: cx1 <= x ? (1 - stepf((1 - x) / (1 - cx1)))
//							: 1;
//					return 1;
//					return x < cx0 ? x / cx0 
//							: cx1 < x ? (1 - x) / (1 - cx1)
//									: 1;
							return x < cx0 ? 0 
									: cx1 < x ? 0
										: x < bcx0 ? stepf((bcx0 - x) / (bcx0 - cx0))
											: bcx1 < x ? stepf((x - bcx1) / (cx1 - bcx1))
											: 1;
				};
				// blend between center and normal w/h
				var t = function(x,y,pt) {
					// 1 = completely inside of center window, 0 = completely outside
					var bu = blend(x);
					var y0 = epfCorrection * (1 - y) * nwh;
					var y1 = epfCorrection * (1 - y) * cwh * (b  + (1 - b) * hfLut(_hfLut, hfln, x));
//					var y1 = epfCorrection * (1 - y) * cwh * (b  + (1 - b) * 1);
					
					if (x < cx0) {
						ellipticPt(mw, nww * (cx0 - x), tept)
						pt[0] = mw - tept[0];
						y0 *= ((1-tept[1]) + 0.05 * tept[1]);
						
					}
					else if (cx1 < x) {
						ellipticPt(mw, nww * (x - cx1), tept)
						pt[0] = mw + cw + tept[0];
						y0 *= ((1-tept[1]) + 0.05 * tept[1]);
					}
					else {
						pt[0] = mw + cww * x + cw * (fOffi - cfOff);
					}
					pt[1] = cy - ((1 - bu) * y0 + bu * y1);
				};
				
				
				

				// Foundation colors
				for (var i = 0; i < functionSummaries.length; ++i) {
					var amount = yearDetails[yearIndex][wi][3][2 * i];
//					if (0 < amount) {
						var fu = amount <= 0 ? 0 : Math.log(amount) / Math.log(maxAmount);
						fu = (1 - fu) * minAlphaUnder + fu * maxAlphaUnder;
						fu *= blend((i + 0.5) / functionSummaries.length);
						
//						if (0.01 < fu) {
							var si0 = 3 * i;
//							ctx.fillStyle = "rgba(" + Math.round(fu * fsStyles[si0]) + "," + Math.round(fu * fsStyles[si0 + 1]) + "," + 
							ctx.fillStyle = "rgba(" + Math.round(fu * 255) + ",0,0,1)";
							nltFill3_(ctx, fsRects[i], t, 0.05 / 2, tpt);
//						}
//					}
				}
				
				
				// Text mask
				ctx.fillStyle = "rgba(255, 255, 255, 1)";
				nltFill3(ctx, envelope[4], t, 0.05 / 2, tpt);
				
				
				// Overlay colors and axes
				
				var midspc = cww / functionSummaries.length;
				var midspn = nww / functionSummaries.length;
				
				
				for (var i = 0; i < functionSummaries.length; ++i) {
					var amount = yearDetails[yearIndex][wi][3][2 * i];
					var accounts = yearDetails[yearIndex][wi][3][2 * i + 1];
					if (0 < accounts) {
						var midx = (i + 0.5) / functionSummaries.length;
						var sp = (midx < cx0 || cx1 < midx ? midspn : midspc) - 6;
						var bu = blend(midx);
						var fu = accounts / maxAccounts;
						fu = (1 - fu) * minAlphaOver + fu * maxAlphaOver;
						fu *= bu;
						
						if (0.01 < fu) {
							var si0 = 3 * i;
	//						ctx.fillStyle = "rgba(" + fsStyles[si0] + "," + fsStyles[si0 + 1] + "," + fsStyles[si0 + 2] + "," + (u) + ")";
							ctx.fillStyle = "rgba(0, 0, 255," + (fu) + ")";
							nltFill3_(ctx, fsRects[i], t, 0.05 / 2, tpt);
						}
						
						// TODO: if zero, do not draw
						fu = ((amount <= 0 ? 0 : (Math.log(amount) / Math.log(maxAmount)))
							+ accounts / maxAccounts) / 2;
						fu = minLabelAlpha * (1 - fu) + maxLabelAlpha * fu;
						fu *= bu;
							
//						ctx.fillStyle = "rgba(0, 0, 255," + (u) + ")";
						
						ctx.fillStyle = "rgba(148,148,148," + (fu) + ")";
						// Axis
						ctx.font = Math.min(18, Math.max(9, Math.floor(sp - 9))) + "px sans-serif";
						t(midx, 0, tpt);
						dottedLine(ctx, tpt[0], tpt[1] - 4, tpt[0], cy-cwh-tlmarg, 4, 1);
						var tx = tpt[0];
						var ty = cy-cwh-tlmarg;
						ctx.textAlign = "left";
						ctx.textBaseline = "bottom";
						ctx.translate(tx, ty);
							ctx.rotate(-Math.PI / 4);
							var text1 = readableNumber(yearDetails[yearIndex][wi][3][2 * i + 1]) + 
								" accounts";  
								
							var text2 = readableDollar(yearDetails[yearIndex][wi][3][2 * i]) + " spending";
							var tw1 = ctx.measureText(text1).width;
							var tw2 = ctx.measureText(text2).width;
							if (max45LenTop < tw1 + tw2 + 8) {
								var sf = max45LenTop / (tw1 + tw2 + 8)
								ctx.font = Math.floor(Math.min(18, Math.max(9, Math.floor(sp - 9))) * sf) + "px sans-serif";
								tw1 = ctx.measureText(text1).width;
								tw2 = ctx.measureText(text2).width;
							}
							
							dottedLine(ctx, 0, 0, tw1 + tw2 + 8 + 12, 0, 4, 1);
							ctx.fillStyle = "rgba(0,0,255," + (fu) + ")";
							ctx.fillText(text1, 6, -2);
							ctx.fillStyle = "rgba(255,0,0," + (fu) + ")";
							ctx.fillText(text2, 6 + tw1 + 8, -2);
							ctx.rotate(Math.PI / 4);
						ctx.translate(-tx, -ty);
						ctx.fillStyle = "rgba(148,148,148," + (fu) + ")";
						dottedLine(ctx, tpt[0], cy , tpt[0], cy + amarg2 + blmarg, 4, 1);
						var tx = tpt[0];
						var ty = cy + amarg2 + blmarg;
						ctx.font = Math.min(18, Math.max(9, Math.floor(sp - 9)) / 1) + "px sans-serif";
						ctx.textAlign = "right";
						ctx.textBaseline = "bottom";
						ctx.translate(tx, ty);
							ctx.rotate(-Math.PI / 4);
							var text = functionSummaries[i][0];
							var tw = ctx.measureText(text).width;
							if (max45LenBottom < tw) {
								var sf = max45LenBottom / tw;
								ctx.font = Math.floor(Math.min(18, Math.max(9, Math.floor(sp - 9))) * sf)  + "px sans-serif";
								tw = ctx.measureText(text).width;
							}
							ctx.fillStyle = "rgba(148,148,148," + (fu) + ")";
							dottedLine(ctx, -(tw + 12), 0, 0, 0, 4, 1);
							ctx.fillStyle = "rgba(0,0,0," + (fu) + ")";
							ctx.fillText(text, -6, -2);
							ctx.rotate(Math.PI / 4);
						ctx.translate(-tx, -ty);
					}
				}
				
				
				// Axes
				
				t(0, 1, tpt);
				var originx = tpt[0];
				var originy = tpt[1];
				t(1, 0, tpt);
				var extentx = tpt[0];
				var extenty = tpt[1];
//				var minExtentx = originx + minwf * cw;
//				var minExtenty = tpt[1];
				
				var tickExtrudeIn = 4;
				var tickExtrude = 8;
				
				ctx.strokeStyle = "rgba(0, 0, 255, 1)";
				line(ctx, originx - amarg, pxRound(originy + amarg), extentx, pxRound(originy + amarg));
				ctx.strokeStyle = "rgba(255, 0, 0, 1)";
				line(ctx, pxRound(originx - amarg), originy + amarg, pxRound(originx - amarg), originy - cwh);
				
				ctx.strokeStyle = "rgba(0, 0, 255, 1)";
				line(ctx, originx - amarg2, pxRound(originy + amarg2), originx + maxwf * (extentx - originx) / wwf, pxRound(originy + amarg2));
				ctx.strokeStyle = "rgba(255, 0, 0, 1)";
				line(ctx, pxRound(originx - amarg2), originy + amarg2, pxRound(originx - amarg2), originy - maxhf * ch);
								
				
				var xAxist0x = pxRound(originx + minwf * cw);
				var xAxist1x = pxRound(extentx);
				var xAxist2x = pxRound(originx + maxwf * (extentx - originx) / wwf);
				var yAxist0y = pxRound(originy - epfCorrection * ch * minhf);
				var yAxist1y = pxRound(originy - cwh);
				var yAxist2y = pxRound(originy - maxhf * ch);
				
				
				// Render axis ticks

				ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
				line(ctx, xAxist0x, originy + amarg - tickExtrudeIn, xAxist0x, originy + amarg2 + tickExtrude);
				line(ctx, xAxist2x, originy + amarg2 - tickExtrudeIn, xAxist2x, originy + amarg2 + tickExtrude);
				
				line(ctx, originx - amarg2 - tickExtrude, yAxist0y, originx - amarg + tickExtrudeIn, yAxist0y);
				line(ctx, originx - amarg2 - tickExtrude, yAxist2y, originx - amarg + tickExtrudeIn, yAxist2y);
				
				ctx.strokeStyle = "rgba(0, 0, 0, 1.0)";
				line(ctx, xAxist1x, originy + amarg2 - tickExtrudeIn, xAxist1x, originy + amarg2 + tickExtrude);
				line(ctx, originx - amarg2 - tickExtrude, yAxist1y, originx - amarg + tickExtrudeIn, yAxist1y);
				
				
				// Render axis text
				
				ctx.font = "10px sans-serif";
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				
				var xOff = xAxist2x;
				var text = "max " + yearSummaries[yearIndex][7] + " accounts";
				var tw = ctx.measureText(text).width;
				ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
				ctx.fillRect(xOff, originy + amarg2 + tickExtrude + 2, tw + 4, 24);
				ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
				ctx.fillText(text, xOff + 2, originy + amarg2 + tickExtrude + 2);
				ctx.fillText("5x slower", xOff + 2, originy + amarg2 + tickExtrude + 2 + 10);
				
				text = yearDetails[yearIndex][wi][1] + " accounts for word";
				tw = ctx.measureText(text).width;
				xOff = Math.min(xAxist1x, xOff - (tw + 4));
				ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
				ctx.fillRect(xOff, originy + amarg2 + tickExtrude + 2, tw + 4, 24);
				ctx.fillStyle = "rgba(0, 0, 255, 1.0)";
				ctx.fillText(text, xOff + 2, originy + amarg2 + tickExtrude + 2);
				ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
				ctx.fillText(Math.round((1 - wf) + 5 * wf) + "x slower", xOff + 2, originy + amarg2 + tickExtrude + 2 + 10);
				
				text = "min 1 account";
				tw = ctx.measureText(text).width;
				xOff = Math.min(xAxist0x, xOff - (tw + 4));
				ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
				ctx.fillRect(xOff, originy + amarg2 + tickExtrude + 2, tw + 4, 24);
				ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
				ctx.fillText(text, xOff + 2, originy + amarg2 + tickExtrude + 2);
				ctx.fillText("1x speed", xOff + 2, originy + amarg2 + tickExtrude + 2 + 10);
				
				ctx.textAlign = "right";
				ctx.textBaseline = "top";
				var yOff = yAxist2y;
				text = "max " + readableDollar(yearSummaries[yearIndex][5]) + " spending";
				tw = ctx.measureText(text).width;
				ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
				ctx.fillRect(originx - amarg2 - tickExtrude - 2 - tw - 4, yOff, tw + 4, 24);
				ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
				ctx.fillText(text, originx - amarg2 - tickExtrude - 4, yOff);
				ctx.fillText(Math.round(wordAudioMaxVolume / wordAudioMinVolume) + "x louder", originx - amarg2 - tickExtrude - 4, yOff + 10);
				
				yOff = Math.max(yAxist1y, yOff + 24);
				text = readableDollar(yearDetails[yearIndex][wi][0]) + " spending for word";
				tw = ctx.measureText(text).width;
				ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
				ctx.fillRect(originx - amarg2 - tickExtrude - 2 - tw - 4, yOff, tw + 4, 24);
				ctx.fillStyle = "rgba(255, 0, 0, 1.0)";
				ctx.fillText(text, originx - amarg2 - tickExtrude - 4, yOff);
				ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
				ctx.fillText(Math.round((1 - hf) + (wordAudioMaxVolume / wordAudioMinVolume) * hf) + "x louder", originx - amarg2 - tickExtrude - 4, yOff + 10);
				
				yOff = Math.max(yAxist0y, yOff + 24);
				text = "min $0 spending";
				tw = ctx.measureText(text).width;
				ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
				ctx.fillRect(originx - amarg2 - tickExtrude - 2 - tw - 4, yOff, tw + 4, 24);
				ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
				ctx.fillText(text, originx - amarg2 - tickExtrude - 4, yOff);
				ctx.fillText("1x volume", originx - amarg2 - tickExtrude - 4, yOff + 10);
				
				
				ctx.fillStyle = "rgba(0, 0, 0, 1)";
				ctx.textAlign = "center";
				ctx.textBaseline = "bottom";
				ctx.font = "14px sans-serif";
				ctx.fillText("word #" + (owi + 1) + " of the " + yearSummaries[yearIndex][0] + " budget (of " + yearSummaries[yearIndex][3] + ")", 
						(originx + extentx) / 2, h - 5);
				
			}
			else if (fOffi < cfOff) {
				var outline = getOutline(wi);
				var t = function(x,y,pt) {
					ellipticPt(mw, nw * (cfOff - fOffi) - x * nww, tept);
					pt[0] = mw - tept[0];
//					pt[1] = cy + (y - 0.5) * nwh * ((1-tept[1]) + 0.05 * tept[1]);
					pt[1] = cy - (1 - y) * nwh * ((1-tept[1]) + 0.05 * tept[1]);
				};
				
				ctx.fillStyle = "rgba(0, 0, 0, 1)";
				nltFill1(ctx, outline[4], t, 0.05 / 2, tpt);
				ctx.fillStyle = "rgba(255, 255, 255, 255)";
				nltFill1(ctx, outline[5], t, 0.05 / 2, tpt);
			}
			else {
				var outline = getOutline(wi);
				var t = function(x,y,pt) {
					ellipticPt(mw, nw * (fOffi - (cfOff + 1)) + x * nww, tept);
					pt[0] = mw + cw + tept[0];
//					pt[1] = cy + (y - 0.5) * nwh * ((1-tept[1]) + 0.05 * tept[1]);
					pt[1] = cy - (1 - y) * nwh * ((1-tept[1]) + 0.05 * tept[1]);
				};
				
				ctx.fillStyle = "rgba(0, 0, 0, 1)";
				nltFill1(ctx, outline[4], t, 0.05 / 2, tpt);
				ctx.fillStyle = "rgba(255, 255, 255, 255)";
				nltFill1(ctx, outline[5], t, 0.05 / 2, tpt);
			}
			
			/*
			 * var t = function(x,y,pt) {
				var l = netWlenOff + x * wlen;
				var s = l < 0 ? -1 : 1;
				ellipticPt(w/2, l * s, tept);
				pt[0] = w/2 + s * tept[0];
				pt[1] = cy + (y - 0.5) * th * ((1-tept[1]) + 0.05 * tept[1]);
			};
			 */
			
//			var t = function(x,y,pt) {
//				pt[0] = w/2 + x * ww;
//				var y0 = (1 - y) * th;
//				var y1 =  ((1 - y) * b * th1 + (1 - y) * (1- b) * th1 * hfLut(thfLut, thfLutn, x));
//				var bu = blend(x);
//				pt[1] = cy - ((1 - bu) * y0 + bu * y1);
//			};
			
			
			
			

//			fOffi += Math.max(wwf + 0.1, 1.0);	
		}
		
		
		
		
//		ctx.globalAlpha = 1.0;
		
		// TODO: fill behind text per block
		// TODO: alpha block over text
		
		/*
		ctx.font = 10 + "px sans-serif";
		ctx.fillStyle = "rgba(0, 0, 0, 255)";
		ctx.textAlign = "left";
		ctx.textBaseline = "bottom";
		ctx.fillText("" + meanFps, 20, h - 40);
		ctx.fillText("" + cfOff, 20, h - 28);
		ctx.fillText("[" + minOwi + ", " + maxOwi + "]", 20, h - 16);
		*/
		
	ctx.restore();
}



/*
function textInto(ctx,x0,y0,x1,y1) {
	var p = 1;
	var t = function(x,y,pt) {

		// very cool effect ...
//		pt[0] = w/4 + w/2 * Math.pow(x, p) + w/6 * Math.cos(Math.PI * 2 * x + stepCount * (Math.PI * 2) / 250);
		pt[0] = x0 + (x1 - x0) * Math.pow(x, p);
		pt[1] = y0 + (y1 - y0) * Math.pow(y, p);
	};
	
	ctx.fillStyle = "rgba(0, 0, 0, 255)";
	nltFill2(ctx, outlines[wordIndex][4], t, 0.05, 1);
	ctx.fillStyle = "rgba(255, 255, 255, 255)";
	nltFill2(ctx, outlines[wordIndex][5], t, 0.05, 1);
	
}
*/

//function pinch(fpts, minx, maxx, miny, maxy) {
//	var n = fpts.length;
//	for (var i = 0; i < n; i += 2) {
//		
//	}
//}


//var wordIndex = 0;



var down = false;
var downPt = [0, 0];
var pPt = [0, 0];
var pTime = new Date().getTime();
var pScrollStepPerFrame = 0;
var scrollStepDegrade = 0.99;

var dragMode = 0;

var dsidebar0y;
var dsidebar0wi;
var dsidebarLineh;


var mousePt = [0, 0];

function mclick(e) {
	
}
function mdown(e) {
	mousePt[0] = e.pageX;
	mousePt[1] = e.pageY;
	downPt[0] = e.pageX;
	downPt[1] = e.pageY;
	ifOff = 0;
	pScrollStepPerFrame = 0;
	if (e.pageY < bh) {
		yearIndex = Math.floor(e.pageX / bw);
		loadState = 0;
	}
	else if (speechBox[0] < e.pageX && e.pageX < speechBox[2]
		&& speechBox[1] < e.pageY && e.pageY < speechBox[3]) {
		toggleSpeech();
	}
	else {
		down = true;
		stopSpeech();
		
		if (w - sidebarw < e.pageX) {
			dragMode = 0;
			dsidebar0y = sidebar0y;
			dsidebar0wi = sidebar0wi;
			dsidebarLineh = sidebarLineh;
		}
		else {
			dragMode = 1;
		}
	}
}
function mup(e) {
	mousePt[0] = e.pageX;
	mousePt[1] = e.pageY;
	down = false;
	fOff += ifOff;
	ifOff = 0;
}
function mmove(e) {
	mousePt[0] = e.pageX;
	mousePt[1] = e.pageY;
	if (down) {
		if (0 == dragMode) {
			var deltaOwi = (downPt[1] - e.pageY) / dsidebarLineh;
			var towi = Math.max(0, Math.min(wordSummaries.length - 1, Math.round(dsidebar0wi + deltaOwi)));
			ifOff = owfs[towi] - owfs[dsidebar0wi];
		}
		else if (1 == dragMode) {
			var pxToModel = -1.0 / nw;
			ifOff = pxToModel * (e.pageX - downPt[0]);
			var time = new Date().getTime();
			pScrollStepPerFrame = pxToModel * (e.pageX - pPt[0]) * 1000 / ((time - pTime) * fps);
			pPt[0] = e.pageX;
			pPt[1] = e.pageY;
			pTime = time;
		}
	}
}


$(window).bind("load", init);
$(window).bind("resize", resize);
$(window).bind("click", mclick);
$(window).bind("mousedown", mdown);
$(window).bind("mouseup", mup);
$(window).bind("mousemove", mmove);

var fps = 30;
var riv = setInterval(step, 1000.0 / fps);






var speechActive = false;
var speechWi = -1;
var speechTransitionStartf = 0;
var speechInterludeMs = 4 * 1000;
var speechTransitionMs = 1500;
var speechTransitionStartTime;
var speechTransitionIv;

function toggleSpeech() {
	if (speechActive) { stopSpeech(); }
	else { startSpeech(); }
}
function startSpeech() {
	if (!speechActive && !down) {
		speechWi = owif(fOff);
		if (0.1 < fOff - owfs[speechWi]) {
			speechWi = (speechWi + 1) % wordSummaries.length;
		}
		speechTransitionStartf = fOff;
		speechTransitionStartTime = new Date().getTime();
		speechTransitionIv = setInterval(speechStep, 1000.0 / fps);
		speechActive = true;
	}
}
function stopSpeech() {
	if (speechActive) {
		clearInterval(speechTransitionIv);
		speechActive = false;
	}
}
function speechStep() {
	var time = new Date().getTime();
	var u = (time - speechTransitionStartTime) / speechTransitionMs;
	if (0 <= u && u < 1) {
		u = Math.sin(u * Math.PI / 2); // fast out, slow in
		fOff = (1 - u) * speechTransitionStartf + u * (owfs[speechWi] - (1 - maxwf) / 2);
	}
	else if (1 <= u) {
		fOff = (owfs[speechWi] - (1 - maxwf) / 2);
		// Next word
		speechWi = (speechWi + 1) % wordSummaries.length;
		speechTransitionStartf = fOff;
		speechTransitionStartTime = time + speechInterludeMs;
	}
}





var wordAudioMinVolume = 0.1;
var wordAudioMaxVolume = 0.8;
var wordAudioSupported = true;
var wordAudioEnabledUser = true;
var wordAudio = new Audio();
wordAudio.autoplay = false;
wordAudio.loop = false;
wordAudio.controls = false;
wordAudio.preload = "auto";
var wordAudioExt = null;
if ("probably" == wordAudio.canPlayType("audio/mpeg")) {
	wordAudioExt = "mp3";
}
else if ("probably" == wordAudio.canPlayType("audio/ogg")) {
	wordAudioExt = "ogg";
}
if ("maybe" == wordAudio.canPlayType("audio/mpeg")) {
	wordAudioExt = "mp3";
}
else if ("maybe" == wordAudio.canPlayType("audio/ogg")) {
	wordAudioExt = "ogg";
}
else {
	wordAudioSupported = false;
}

function setWordAudioEnabled(en) {
	wordAudioEnabledUser = en;
}


var lastPlayedWi = -1;
// tempof on 0...1, where 0 is the fastest, 1 is the slowest
// volumef on 0 ...1, where 0 is the queistest, 1 is the loudest
function playWordAudio(wi, tempof, volumef) {
	if (wordAudioSupported && wordAudioEnabledUser && wi != lastPlayedWi) {
	//	alert("audio/words_" + wi + "_" + Math.round(tempof * 4.49) + "." + wordAudioExt);
	//	alert("audio/words_" + wi + "_" + Math.round(tempof * 4.49) + "." + wordAudioExt);
		wordAudio.src = "word_audio/word_" + wi + "_" + Math.round(tempof * 4.49) + "." + wordAudioExt;
		wordAudio.volume = wordAudioMinVolume * (1 - volumef) + wordAudioMaxVolume * volumef;
		wordAudio.load();
		wordAudio.play();
	//	alert("played");
		lastPlayedWi = wi;
	}
}



var EMPTY_GEOMETRY = [0.0, 1.0, 0.0, 1.0, [], []];

var outlinesCache = createCircularCache(outlines, 40, 1, EMPTY_GEOMETRY,
	function (blocki, onLoaded) {
		$.getScript("word_geometry/word_outlines_" + blocki + ".js", onLoaded);
	}
);
var envelopesCache = createCircularCache(envelopes, 4, 1, EMPTY_GEOMETRY,
	function (blocki, onLoaded) {
		$.getScript("word_geometry/word_envelopes_" + blocki + ".js", onLoaded);
	}
);

function getOutline(wi) {
	return probeCircularCache(outlinesCache, wi);
}
function getEnvelope(wi) {
	return probeCircularCache(envelopesCache, wi);
}

var hflcn = 8;
var hfli = 0;
var hfLutCache = new Array(3 * hflcn);
// (yi, wi, [fs])
var hfln = 256;
for (var i = 0; i < hflcn; ++i) {
	hfLutCache[3 * i + 2] = new Array(hfln + 1);
}

var fs = new Array(functionSummaries.length);

function getHfLut(yi, wi) {
	for (var i = 0; i < hflcn; ++i) {
		var li = 3 * i;
		if (yi == hfLutCache[li] && wi == hfLutCache[li + 1]) {
			return hfLutCache[li + 2];
		}
	}
	// Create new ...
	for (var i = 0; i < functionSummaries.length; ++i) {
		var amount = yearDetails[yi][wi][3][2 * i];
//		var accounts = yearDetails[yearIndex][wi][3][2 * i + 1];
//		if (maxAmount < amount) { maxAmount = amount; }
//		if (maxAccounts < accounts) { maxAccounts = accounts; }
		fs[i] = amount <= 0 ? 0
				: Math.log(amount) / Math.log(yearDetails[yi][wi][0]);
//		: Math.log(amount) / Math.log(yearSummaries[yi][4]);
	}
	var li = 3 * hfli;
	createHfLut(fs, hfLutCache[li + 2], hfln);
	hfLutCache[li] = yi;
	hfLutCache[li + 1] = wi;
	hfli = (hfli + 1) % hflcn;
	return hfLutCache[li + 2];
}




