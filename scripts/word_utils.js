
// TODO: move in geometry and audio parts


//var yearDetailsLoaded = new Array(yearSummaries.length);
//
//function loadYearDetails(yi) {
//	if (yearDataLoaded[yi]) {
//		return yearD
//	}
//}

var yearDetailsCache = createCircularCache(yearDetails, yearSummaries.length, 1, null,
	function (blocki, onLoaded) {
		$.getScript("word_data/word_data_year_details_" + blocki + ".js", onLoaded);
	}
);

var yearOrderCache = createCircularCache(yearOrder, yearSummaries.length, 1, null,
	function (blocki, onLoaded) {
		$.getScript("word_data/word_data_year_order_" + blocki + ".js", onLoaded);
	}
);


function getYearDetails(yi) {
	return probeCircularCache(yearDetailsCache, yi);
}
function getYearOrder(yi) {
	return probeCircularCache(yearOrderCache, yi);
}





function binarySearch(a, low, hi, key) {
	var mid = 0;
	while (low <= hi)
	{
		mid = Math.floor((low + hi) / 2);
		var r = a[mid] - key;
		if (r == 0)
			return mid;
		else if (r > 0)
			hi = mid - 1;
		else
			low = ++mid;
	}
	return -mid - 1;
}


var readableSuffixes = ["k", "m", "b", "t"];
var kps = [1000, 1000000, 1000000000, 1000000000000];
function readableNumber(v) {
	if (v < 1000) { return "" + v; }
	var ui = Math.floor(Math.log(v) / Math.log(1000)) - 1;
	return "~" + Math.floor(v / kps[ui]) + readableSuffixes[ui];
}
function readableDollar(v) {
	if (v < 1000) { return "$" + v; }
	var ui = Math.floor(Math.log(v) / Math.log(1000)) - 1;
	return "~$" + Math.floor(v / kps[ui]) + readableSuffixes[ui];
}


function pxRound(px) {
	return Math.round(px - 0.5) + 0.5;
}



function dottedLine(ctx,x0,y0,x1,y1,sp,r) {
	var dx = x1 - x0;
	var dy = y1 - y0;
	var m = Math.sqrt(dx * dx + dy * dy);
	var n = Math.ceil(m / sp);
	// Adjustment to ensure start and end caps
	var f = m / (sp * n);
	dx *= f * sp / m;
	dy *= f * sp / m;
	var d = 2 * r;
	for (var i = 0; i <= n; ++i) {
		var x = x0 + i * dx;
		var y = y0 + i * dy;
		ctx.fillRect(x-r,y-r,d,d);
	}
}
function line(ctx,x0,y0,x1,y1) {
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}
function ellipse(ctx, xm, ym, w, h) {
	  var kappa = 0.5522848;
	  var ox = (w / 2) * kappa;
	  var oy = (h / 2) * kappa;
	  var x = xm - w / 2;     
	  var y = ym - h / 2;      
	  var xe = xm + w / 2;         
	  var ye = ym + h / 2;        
	     

	  ctx.beginPath();
	  ctx.moveTo(x, ym);
	  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	  ctx.closePath();
	  ctx.fill();
	}





function createCircularCache(store, size, resourceBlockSize, onLoadingReturnValue, resourceFetch) {
	return {
        "store": 				store,
        "index":	 			0,
        "size": 				size,
        "resourceBlockSize": 	resourceBlockSize,
        "loading": 				new Array(Math.ceil(store.length / resourceBlockSize)),
        "circularIndexes": 		new Array(size),
        "onLoadingReturnValue": onLoadingReturnValue,
        "resourceFetch": 		resourceFetch
	};
}

// cache is (store, gci, gcn, loading, circularBuffer)

function probeCircularCache(cache, resourceIndex) {
	var value = cache.store[resourceIndex];
	if (null != value) { return value; }
	var blocki = Math.floor(resourceIndex / cache.resourceBlockSize);
	if (! cache.loading[blocki]) {
		cache.loading[blocki] = true;
		var onLoaded = function() {
			var i0 = cache.resourceBlockSize * blocki;
			for (var i = 0; i < cache.resourceBlockSize; ++i) {
				// Clear out previous value from store
				if (i0 + i != cache.circularIndexes[cache.index]) {
					cache.store[cache.circularIndexes[cache.index]] = null;
					cache.circularIndexes[cache.index] = i0 + i;
				}
				cache.index = (cache.index + 1) % cache.size;
			}
			cache.loading[blocki] = false;
		};
//		$.getScript("word_geometry/word_outlines_" + blocki + ".js", onLoaded);
		cache.resourceFetch(blocki, onLoaded);
	}
	return cache.onLoadingReturnValue;
}

