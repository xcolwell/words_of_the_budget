

function init() {

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
//		else if ("3" == val) {
//			orderIndex = 3;
//			loadState = 0;
//		}
//		else if ("4" == val) {
//			orderIndex = 4;
//			loadState = 0;
//		}
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
	
	paint();
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

var ctx;

var hw;

var tw;
var tTop;
var tRight;
var th;

var tex = 10;


var loadState = 0;


function initView() {
	updateUserWis();
}


function getUnloadedYears() {
	var unloadedYears = [];
	for (var yi = 0; yi < yearSummaries.length; ++yi) {
		if (null == getYearDetails(yi) || null == getYearOrder(yi)) {
			unloadedYears.push(yi);
		}
	}
	return unloadedYears;
}


var hoverWi = -1;

var histow = 100;
var leftw;
var toph;

var selectedWiMode = 0;
var selectedWi = 0;
var selectedYi = 0;
var userWis = [];
var userYearRanges = new Array(yearSummaries.length);
for (var yi = 0; yi < yearSummaries.length; ++yi) {
	userYearRanges[yi] = new Array(4);
	for (var i = 0; i < userYearRanges[yi].length; ++i) {
		userYearRanges[yi][i] = false;
	}
}
userYearRanges[Math.floor(yearSummaries.length / 2)][1] = true;
userYearRanges[Math.floor(yearSummaries.length / 2)][2] = true;
var pwiAdvanceTime;
var wiAdvanceMs = 100;

function updateUserWis() {
	var pselectedWi = userWis.length < 0 || selectedWi < 0 ? -1 : userWis[selectedWi];
	userWis = filterWordIndexes(userYearRanges, selectedYi);
	pwiAdvanceTime = new Date().getTime();
	selectedWi = $.inArray(pselectedWi, userWis);
	if (selectedWi < 0) {
		selectedWi = 0;
		selectedWiMode = 0;
	}
	histoYOff = 0;
}

function paint() {
	var thesurface = document.getElementById("thesurface");
	ctx = thesurface.getContext("2d");
	w = thesurface.width;
	h = thesurface.height;

	hw = 300;
	tTop = 40;
	tRight = 500;
	tw = (w - hw - tRight);
	th = h / 3;

	ctx.save();
		
		ctx.clearRect(0, 0, w, h);
	
		var unloadedYears = getUnloadedYears();
		if (0 < unloadedYears.length) {
			ctx.fillStyle = "rgba(0, 0, 0, 1)";
			ctx.font = "14px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "bottom";
			var yearText = "";
			for (var i = 0; i < unloadedYears.length; ++i) {
				if (0 < i) { yearText += " "; }
				yearText += yearSummaries[unloadedYears[i]][0];
			}
			ctx.fillText("Loading years " + yearText, 24 * Math.cos(stepCount * Math.PI / fps) + w / 2, h / 2);
			loadState = 0;
		}
		else if (0 == loadState) {
			initView();
			loadState = 1;
		}
		

		// FIXME: org this function into sub-funcs
		if (1 == loadState) {
			
			paintHistos();
			paintWordTrends();
			paintAccounts();
			

			if (0 == selectedWiMode) {
				var time = new Date().getTime();
				var advu = (time - pwiAdvanceTime) / wiAdvanceMs;
				if (1 <= advu ) {
					pwiAdvanceTime = time;
					selectedWi = (selectedWi + 1) % userWis.length;
				}
			}
		}
		
		/*
		ctx.font = "10px sans-serif";
		ctx.fillStyle = "rgba(0, 0, 0, 255)";
		ctx.textAlign = "right";
		ctx.textBaseline = "bottom";
		ctx.fillText("" + meanFps, w - 20, h - 40);
		*/
	ctx.restore();
}

var histoYOff = 0;
var ihistoYOff = 0;

function paintHistos() {
	
	var tx = 32;
	var ty = 8 + histoYOff + ihistoYOff;
	var aw = hw - tx - 32;
	var hh = 50;
	
	for (var i = 0; i < userWis.length; ++i) {
		var wi = userWis[i];
		
		var hty = ty + i * (18 + 2 * (8 + hh));
		
		if (1 == selectedWiMode && i == selectedWi && -2 * hh <= hty && hty < h) {
			ctx.fillStyle = "rgba(230, 230, 230, 1)";
			ctx.fillRect(tx - 4, hty - 4, aw + 8, 18 + 2 * (8 + hh) + 8);
		}
		
		
		if (-hh <= hty && hty < h) {
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.font = "12px serif";
			ctx.fillStyle = "rgba(0, 0, 0, 1)";
			ctx.fillText(wordSummaries[wi][0], tx, hty);
		}
			
		hty += 18;
		if (-hh <= hty && hty < h) {
		
			// Amount
			var maxAmount = yearDetails[0][wi][0];
			var minAmount = yearDetails[0][wi][0];
			for (var yi = 0; yi < yearSummaries.length; ++yi) {
				var amount = yearDetails[yi][wi][0];
				if (amount < minAmount) { minAmount = amount; }
				else if (maxAmount < amount) { maxAmount = amount; }
			}
			
//			ctx.fillStyle = "rgba(240, 240, 240, 1)";
//			ctx.fillRect(tx, hty, aw, hh);
			
			
			ctx.beginPath();
			ctx.moveTo(tx, hty + hh);
			for (var yi = 0; yi < yearSummaries.length; ++yi) {
				var amount = yearDetails[yi][wi][0];
				var u = amount <= 0 ? 0
						: Math.log(amount) / Math.log(maxAmount);
//				: amount / maxAmount;
				ctx.lineTo(tx + aw * yi / yearSummaries.length, hty + (1 - u) * hh);
				ctx.lineTo(tx + aw * (yi + 1) / yearSummaries.length, hty + (1 - u) * hh);
			}
			ctx.lineTo(tx + aw, hty + hh);
			ctx.closePath();
			ctx.fillStyle = "rgba(255, 220,220, 1)";
			ctx.fill();
			

			ctx.beginPath();
			ctx.moveTo(pxRound(tx), pxRound(hty + hh));
			for (var yi = 0; yi < yearSummaries.length; ++yi) {
				var amount = yearDetails[yi][wi][0];
				var u = amount <= 0 ? 0
						: Math.log(amount) / Math.log(maxAmount);
//				: amount / maxAmount;
				ctx.lineTo(pxRound(tx + aw * yi / yearSummaries.length), pxRound(hty + (1 - u) * hh));
				ctx.lineTo(pxRound(tx + aw * (yi + 1) / yearSummaries.length), pxRound(hty + (1 - u) * hh));
			}
			ctx.lineTo(pxRound(tx + aw), pxRound(hty + hh));
			ctx.strokeStyle = "rgba(255, 120,120, 1)";
			ctx.stroke();
			
			ctx.fillStyle = "rgba(0,0,0,1)";
			ctx.font = "10px sans-serif";
			ctx.textAlign = "right";
			ctx.textBaseline = "top";
			ctx.fillText(readableNumber(maxAmount), tx - 2, hty);
		}
		
		hty += 8 + hh;
		if (-hh <= hty && hty < h) {
			
			// Accounts
			var maxAccounts = yearDetails[0][wi][1];
			var minAccounts = yearDetails[0][wi][1];
			for (var yi = 0; yi < yearSummaries.length; ++yi) {
				var accounts = yearDetails[yi][wi][1];
				if (accounts < minAccounts) { minAccounts = accounts; }
				else if (maxAccounts < accounts) { maxAccounts = accounts; }
			}
//			
//			ctx.fillStyle = "rgba(240, 240, 240, 1)";
//			ctx.fillRect(tx, hty, aw, hh);
			
			ctx.beginPath();
			ctx.moveTo(tx, hty + hh);
			for (var yi = 0; yi < yearSummaries.length; ++yi) {
				var accounts = yearDetails[yi][wi][1];
				var u = accounts <= 0 ? 0
						: Math.log(accounts + 1) / Math.log(maxAccounts + 1);
//				: accounts / maxAccounts;
				ctx.lineTo(tx + aw * yi / yearSummaries.length, hty + (1 - u) * hh);
				ctx.lineTo(tx + aw * (yi + 1) / yearSummaries.length, hty + (1 - u) * hh);
			}
			ctx.lineTo(tx + aw, hty + hh);
			ctx.closePath();
			ctx.fillStyle = "rgba(220, 220,255, 1)";
			ctx.fill();
			

			ctx.beginPath();
			ctx.moveTo(pxRound(tx), pxRound(hty + hh));
			for (var yi = 0; yi < yearSummaries.length; ++yi) {
				var accounts = yearDetails[yi][wi][1];
				var u = accounts <= 0 ? 0
						: Math.log(accounts + 1) / Math.log(maxAccounts + 1);
//						: accounts / maxAccounts;
				ctx.lineTo(pxRound(tx + aw * yi / yearSummaries.length), pxRound(hty + (1 - u) * hh));
				ctx.lineTo(pxRound(tx + aw * (yi + 1) / yearSummaries.length), pxRound(hty + (1 - u) * hh));
			}
			ctx.lineTo(pxRound(tx + aw), pxRound(hty + hh));
			ctx.strokeStyle = "rgba(120, 120,255, 1)";
			ctx.stroke();
			
			ctx.fillStyle = "rgba(0,0,0,1)";
			ctx.font = "10px sans-serif";
			ctx.textAlign = "right";
			ctx.textBaseline = "top";
			ctx.fillText("" + maxAccounts, tx - 2, hty);
		}
		
	}
	
	
}
function paintWordTrends() {
	// toph total space
	// each word has a height
	// scroll offset
	// paint words on left and right
	// always paint hovered word
	
	
	// year spacing based on # years
	// focus on the first word
	
//	var labelw = 100;
	var yw = tw / (yearSummaries.length - 1);
	
	
	
	ctx.fillStyle = "rgba(192,255,192,1)";
	for (var yi = 0; yi < yearSummaries.length; ++yi) {
		var yearRange = userYearRanges[yi];
		var x = pxRound(hw + yi * yw);
		var dy = th / yearRange.length;
		for (var i = 0; i < yearRange.length; ++i) {
			if (yearRange[i]) {
				ctx.fillRect(x - tex, tTop + i * dy, 2 * tex, dy);
			}
		}
	}
	ctx.fillStyle = "rgba(192,192,192,1)";
	var red, green, blue;
	if (0 == orderIndex) {
		red = 255; green = 0; blue = 0;
	}
	else if (1 == orderIndex) {
		red = 0; green = 0; blue = 255;
	}
	else {
		red = 0; green = 0; blue = 0;
	}
	var minAlpha = 0.3;
	var maxAlpha = 0.8;
	for (var yi = 0; yi < yearSummaries.length; ++yi) {
		var x = pxRound(hw + yi * yw);
//		line(ctx, x, tTop, x, tTop + th);
		dottedLine2(ctx, x, tTop, x, tTop + th, 8, 1, red, green, blue, maxAlpha, minAlpha);
	}
	
	/*
	ctx.fillStyle = "rgba(192,192,192,1)";
	var sx = pxRound(hw + selectedYi * yw);
	ctx.beginPath();
	ctx.moveTo(sx, th + tTop);
	ctx.lineTo(sx + 4, th + tTop + 8);
	ctx.lineTo(sx - 4, th + tTop + 8);
	ctx.closePath();
	ctx.fill();
	*/
	ctx.font = Math.min(14, Math.floor(yw / 4)) + "px sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	for (var yi = 0; yi < yearSummaries.length; ++yi) {
		var x = pxRound(hw + yi * yw);
		ctx.fillStyle = yi == selectedYi ? "rgba(0, 0, 0,1)" : "rgba(192,192,192,1)";
		ctx.fillText("" + yearSummaries[yi][0], x, tTop - 8);
	}
	
	
//	var maxd = 0;
//	for (var wi = 0; wi < wordSummaries.length; ++wi) {
//		for (var yi = 0; yi < yearSummaries.length - 1; ++yi) {
//			var owi = yearOrderInverse[yi][orderIndex][wi];
//			var nowi = yearOrderInverse[yi + 1][orderIndex][wi];
//			var d = Math.abs(owi - nowi);
//			if (maxd < d) { maxd = d; }
//		}
//	}
//	for (var wi = 0; wi < wordSummaries.length; ++wi) {
	var cyclen = 8;
//	if (0 == cyclen % userWis.length) { ++cyclen; }
	var lookn = Math.floor(Math.min(userWis.length - 1, cyclen) / 2);
	var looknp = Math.floor(Math.min(userWis.length, cyclen) / 2);
	
	var p = 2;
	var maxLw = 3;
	var minLw = 0.5;
	var maxAlpha = 1.0;
	var minAlpha = 0.3;
	var fsizeMin = 10;
	var fsizeMax = 24;
	
//	var advu = (time - pwiAdvanceTime) / wiAdvanceMs;
	
	for (var i = -lookn; i <= looknp; ++i) {
		var uwi = (selectedWi + i);
		if (uwi < 0) { uwi += userWis.length; }
		else if (userWis.length <= uwi) { uwi -= userWis.length; }
		var wi = userWis[uwi];
		
		var u = 0 == i ? 1 : Math.pow(Math.max(0, 1 - Math.abs(i / looknp)), p);
		
		ctx.lineWidth = minLw * (1 - u) + maxLw * u;
		ctx.strokeStyle = "rgba(0,0,0," + (minAlpha * (1 - u) + maxAlpha * u) + ")";
		for (var yi = 0; yi < yearSummaries.length - 1; ++yi) {
			var owi = yearOrderInverse[yi][orderIndex][wi];
			var nowi = yearOrderInverse[yi + 1][orderIndex][wi];
			
			var x0 = pxRound(hw + yi * yw);
			var x1 = pxRound(hw + (yi + 1) * yw);
			var y0 = tTop + th * (owi / wordSummaries.length); 
			var y1 = tTop + th * (nowi / wordSummaries.length);
	//			line(ctx, x0, y0, x1, y1);
			
			connector(ctx, 0.5, 0.5,
				x0, y0,
				x1 - x0, y1 - y0,
				0, 0
			);
		}
		var lx = hw + tw + 8 + 8;
		var ly = tTop + th * yearOrderInverse[yi][orderIndex][wi] / wordSummaries.length;
		ctx.fillStyle = "rgba(0,0,0," + (minAlpha * (1 - u) + maxAlpha * u) + ")";
		ctx.font = Math.round(fsizeMin * (1 - u) + fsizeMax * u) + "px serif";
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillText(wordSummaries[wi][0], lx, ly);
	}
	
	
	
	
}
function paintAccounts() {
	var wi = userWis[selectedWi];
	var drawAccounts = 1 == selectedWiMode || 1 == userWis.length;
	
	
	var tx = hw;
	var ty = tTop + th + 8;
//	ctx.translate(-tx, -ty);
	
	var ah = h - (tTop + th + 16);
	
	
	var yw = tw / (yearSummaries.length - 1);
	
	
	var accountLen = 0;
	var maxAmount= 0;
	var minAmount= 0;
	var accountIndexes = {};
	for (var yi = 0; yi < yearSummaries.length; ++yi) {
		for (var account in yearDetails[yi][wi][2]) {
			if (null == accountIndexes[account]) {
				accountIndexes[account] = accountLen++;
			}
			var amount = yearDetails[yi][wi][2][account];
			if (maxAmount < amount) { maxAmount = amount; }
			if (amount < minAmount) { minAmount = amount; }
		}
	}
	minAmount = Math.max(0, minAmount);
	

	var lineh = Math.min(tw / 2, Math.min(38, ah / accountLen));
	

	var minr = Math.min(lineh / 2, 6);
	var maxr = lineh / 2;
	var minAlpha = 0.3;
	var maxAlpha = 0.8;
	
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(192,192,192,1)";
	
	for (var yi = 0; yi < yearSummaries.length; ++yi) {
		var x = pxRound(tx + yi * yw);
		line(ctx, x, ty, x, ty + accountLen * lineh);
	}
	ctx.strokeStyle = "rgba(220,220,220,1)";
	for (var accountIndex = 0; accountIndex < accountLen; ++accountIndex) {
		var y = pxRound(ty + accountIndex * lineh + lineh / 2);
		line(ctx, tx, y, tx + tw + maxr, y);
	}
	
	
	
	for (var yi = 0; yi < yearSummaries.length; ++yi) {
		for (var account in yearDetails[yi][wi][2]) {
			var accountIndex = accountIndexes[account];
			var amount = yearDetails[yi][wi][2][account];
			var u = amount <= 0 ? 0
					: (Math.log(amount) / Math.log(maxAmount));
			var r = minr * (1 - u) + maxr * u;
			ctx.fillStyle = "rgba(" + Math.round(u * 255) + ",0,0," + (minAlpha * (1 - u) + maxAlpha * u) + ")";
			ellipse(ctx, tx + yi * yw, ty + accountIndex * lineh + lineh / 2, r, r);
		}
	}
	if (drawAccounts) {
		ctx.fillStyle = "rgba(0,0,255,1)";
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		for (var account in accountIndexes) {
			var accountIndex = accountIndexes[account];
			var text = accountSummaries[parseInt(account)][0];
			var fs = 2 * lineh / 3;
			ctx.font = Math.floor(fs) + "px sans-serif";
			var textw = ctx.measureText(text).width;
			var wu = textw / (tRight - (maxr + 8));
			if (1 < wu) {
				ctx.font = Math.floor(fs / (1.2 * wu)) + "px sans-serif";
			}
			ctx.fillText(text, hw + tw + 8 + maxr, ty + accountIndex * lineh + lineh / 2);
		}
	}
	
	// Legend
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";
	ctx.font = "12px sans-serif";
	var u = 1;
	var r = minr * (1 - u) + maxr * u;
	ctx.fillStyle = "rgba(" + Math.round(u * 255) + ",0,0," + (minAlpha * (1 - u) + maxAlpha * u) + ")";
	ellipse(ctx, w - 8 - maxr, ty - 8 - maxr, r, r);
	u = 0;
	ctx.fillText(readableDollar(maxAmount), w - 8 - maxr - maxr - 8, ty - 8 - maxr);
	var r = minr * (1 - u) + maxr * u;
	ctx.fillStyle = "rgba(" + Math.round(u * 255) + ",0,0," + (minAlpha * (1 - u) + maxAlpha * u) + ")";
	ellipse(ctx, w - 8 - maxr, ty - (8 + maxr) - 12 - maxr, r, r);
	ctx.fillText(readableDollar(minAmount), w - 8 - maxr - 8 - maxr, ty - (8 + maxr) - 12 - maxr);
	
	ctx.textBaseline = "bottom";
	ctx.font = "32px serif";
	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.fillText(wordSummaries[wi][0], w - 8 - maxr, ty - (8 + maxr) - 12 - maxr - 12 - maxr);
	
	
	
	
//	ctx.translate(tx, ty);
	
}



function filterWordIndexes(yearRanges, selectedYi) {
	var critYis = [];
	for (var yi = 0; yi < yearSummaries.length; ++yi) {
		var yearRange = yearRanges[yi];
		for (var i = 0; i < yearRange.length; ++i) {
			if (yearRange[i]) { 
				critYis.push(yi);
				break; 
			}
		}
	}
	
	var wis = [];
	if (critYis.length <= 0) {
		for (var owi = 0; owi < wordSummaries.length; ++owi) {
			var wi = yearOrder[selectedYi][orderIndex][owi];
			wis.push(wi);
		}
	}
	else {
		for (var owi = 0; owi < wordSummaries.length; ++owi) {
			var wi = yearOrder[selectedYi][orderIndex][owi];
			
			
			
			var pass = true;
			for (var i = 0; i < critYis.length; ++i) {
				var yi = critYis[i];
				var yearRange = yearRanges[yi];
				
				var u = yearOrderInverse[yi][orderIndex][wi] / wordSummaries.length;
				var ri = Math.min(yearRange.length - 1, Math.floor(u * yearRange.length));
				pass &= yearRange[ri];
			}
			if (pass) {
				wis.push(wi);
			}
		}
	}
	return wis;
}




function connector(ctx, alpha, beta, x0,y0, dx,dy, edx0,edx1) {
	/*
	MyCubic[startPt_, endPt_, alpha_] := BezierCurve[{
	    startPt,
	    {startPt[[1]] + alpha*(endPt[[1]] - startPt[[1]]), startPt[[2]]},
	    {endPt[[1]] - alpha*(endPt[[1]] - startPt[[1]]), endPt[[2]]},
	    endPt
	    }];
	MyConnector[startPt_, endPt_, alpha_, beta_] := {
	   Line[{startPt, startPt
	      + Max[0, (beta - 0.5)/0.5] {endPt[[1]] - startPt[[1]], 0}
	     }],
	   MyCubic[startPt
	     + Max[0, (beta - 0.5)/0.5] {endPt[[1]] - startPt[[1]], 0},
	    endPt
	     - Max[0, (0.5 - beta)/0.5] {endPt[[1]] - startPt[[1]], 0},
	    alpha],
	   Line[{endPt
	      - Max[0, (0.5 - beta)/0.5] {endPt[[1]] - startPt[[1]], 0},
	     endPt}]
	   };
	*/
	var u0 = Math.max(0, (beta - 0.5)/0.5);
	var u1 = Math.max(0, (beta - 0.5)/0.5);
	
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x0 + edx0 + u0 * dx, y0);
	ctx.bezierCurveTo(x0 + edx0 + alpha * dx, y0, 
			x0 + edx0 + dx - alpha * dx, y0 + dy,
			x0 + edx0 + dx, y0 + dy);
	ctx.lineTo(x0 + edx0 + dx + edx1, 
			y0 + dy);
	ctx.stroke();
}

function dottedLine2(ctx,x0,y0,x1,y1,sp,r, red, green, blue, minAlpha, maxAlpha) {
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
		var u = i / n;
		ctx.fillStyle = "rgba(" + red + "," + green + "," + blue + "," + (minAlpha * (1-u) + maxAlpha * u) + ")";
		ctx.fillRect(x-r,y-r,d,d);
	}
}




var down = false;
var pPt = [0, 0];
var pTime = new Date().getTime();
var pScrollStepPerFrame = 0;
var scrollStepDegrade = 0.99;

var dragMode = 0;


var downPt = [0, 0];
var mousePt = [0, 0];


function mclick(e) {
	
}
function mdown(e) {
	mousePt[0] = e.pageX;
	mousePt[1] = e.pageY;
	downPt[0] = e.pageX;
	downPt[1] = e.pageY;
	
	ihistoYOff = 0;
	
	var yw = tw / (yearSummaries.length - 1);
	// Check for click on year arrow
	if (mousePt[1] < tTop && - yw/2 <= (mousePt[0] - hw)  && (mousePt[0] - hw) < tw + yw/2) {
		selectedYi = Math.floor((mousePt[0] - hw + yw/2) / yw);
		updateUserWis();
	}
	else if (mousePt[0] < hw && mousePt[1] < h - 100) {
		if (32 <= mousePt[0]) {
			var owi = Math.floor((mousePt[1] - (8 + histoYOff)) / (18 + 2 * (8 + 50)));
			if (0 <= owi && owi < userWis.length) {
				if (selectedWiMode == 1 && selectedWi == owi) {
					selectedWiMode = 0;
				}
				else {
					selectedWi = owi;
					selectedWiMode = 1;
				}
			}
		}
		else {
			down = true;
			dragMode = 1;
		}
	}
	else {
		down = true;
		ptoggle = [-1, -1]
		toggleFilter();
		dragMode = 0;
	}
	
//	if (e.pageY < bh) {
//		yearIndex = Math.floor(e.pageX / bw);
//		loadState = 0;
//	}
//	else if (speechBox[0] < e.pageX && e.pageX < speechBox[2]
//		&& speechBox[1] < e.pageY && e.pageY < speechBox[3]) {
//		toggleSpeech();
//	}
//	else {
//		down = true;
//		stopSpeech();
//		
//		if (w - sidebarw < e.pageX) {
//			dragMode = 0;
//			dsidebar0y = sidebar0y;
//			dsidebar0wi = sidebar0wi;
//			dsidebarLineh = sidebarLineh;
//		}
//		else {
//			dragMode = 1;
//		}
//	}
}
function mup(e) {
	mousePt[0] = e.pageX;
	mousePt[1] = e.pageY;
	down = false;
	histoYOff += ihistoYOff;
	ihistoYOff = 0;
}
function mmove(e) {
	mousePt[0] = e.pageX;
	mousePt[1] = e.pageY;
	if (down) {
		if (0 == dragMode) {
		toggleFilter();
		}
		else if (1 == dragMode) {
			ihistoYOff = (mousePt[1] - downPt[1]);
		}
		
		
//		if (0 == dragMode) {
//			var deltaOwi = (downPt[1] - e.pageY) / dsidebarLineh;
//			var towi = Math.max(0, Math.min(wordSummaries.length - 1, Math.round(dsidebar0wi + deltaOwi)));
//			ifOff = owfs[towi] - owfs[dsidebar0wi];
//		}
//		else if (1 == dragMode) {
//			var pxToModel = -1.0 / nw;
//			ifOff = pxToModel * (e.pageX - downPt[0]);
//			var time = new Date().getTime();
//			pScrollStepPerFrame = pxToModel * (e.pageX - pPt[0]) * 1000 / ((time - pTime) * fps);
//			pPt[0] = e.pageX;
//			pPt[1] = e.pageY;
//			pTime = time;
//		}
	}
}

var ptoggle = [-1, -1];
function toggleFilter() {
	var yw = tw / (yearSummaries.length - 1);
	var tyi = Math.floor((mousePt[0] - hw + tex) / yw);
	if (Math.abs(yw * tyi - (mousePt[0] - hw)) <= tex && 0 <= tyi && tyi < yearSummaries.length) {
		var yearRanges = userYearRanges[tyi];
		var u = (mousePt[1] - tTop) / th;
		
		var tri = Math.min(Math.floor(u * yearRanges.length), yearRanges.length - 1);
		if (ptoggle[0] != tyi || ptoggle[1] != tri) {
			ptoggle = [tyi, tri];
			yearRanges[tri] = !yearRanges[tri];
			updateUserWis();
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










