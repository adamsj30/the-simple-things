function ElevationPoint(pointNumber, distance, bedrockElevation, iceSurfaceElevation, iceThickeness, tau, interp){
	this.pointNumber = pointNumber;
	this.distance = distance;
	this.bedrockElevation = bedrockElevation;
	this.iceSurfaceElevation = iceSurfaceElevation;
	this.iceThickeness = iceThickeness;
	this.tau = tau;
	this.interp = interp;
	this.originalBedrockElevation = 0.0;
}

function Iteration(e, iterationNumber){
	this.e = e;
	this.iterationNumber = iterationNumber;
	if(iterationNumber == 0){
		for(var i = 0; i < this.e.length; i++){
			this.e[i].iceSurfaceElevation = this.e[i].bedrockElevation;
			this.e[i].originalBedrockElevation = this.e[i].bedrockElevation;
		}
	}
	var nextIteration = calculateIS();
	function calculateIS(){
		//Do the Calculations to generate next iteration
		var ni = new Array();
		for(var t = 0; t < e.length; t++){
			ni[t] = new ElevationPoint(e[t].pointNumber, e[t].distance, e[t].bedrockElevation, e[t].iceSurfaceElevation, e[t].iceThickness,e[t].tau, e[t].interp);
            ni[t].originalBedrockElevation = e[t].originalBedrockElevation;
            ni[t].pointName = e[t].pointName;
		}

		//Change the bedrock elevation based ont he ice thickness for all points
		if(iterationNumber != 0){
			for(var j = 0; j < ni.length; j++){
				ni[j].bedrockElevation = ni[j].originalBedrockElevation - (ni[j].iceThickness*.27273);
			}
		}

		//do nothing with point 1
		//do points 2
		ni[1].iceThickness = ((Math.sqrt(2*ni[1].tau/(.91*981)))*100)*(Math.sqrt(ni[1].distance*1000));
        ni[1].iceSurfaceElevation = ni[1].iceThickness + ni[1].bedrockElevation;
        //point 3-n
        for(var i = 2; i < ni.length; i++){
        	ni[i].iceSurfaceElevation = ni[i-1].iceSurfaceElevation + (ni[i].tau*1120.2*(ni[i].distance-ni[i-1].distance)*1000/ni[i-1].iceThickness)/100;
        	ni[i].iceThickness = ni[i].iceSurfaceElevation - ni[i].bedrockElevation;
        }
        return ni;
	}
}

function grabData(){
	var numPoints = 5;
	var numIter = 6;
	var iterations = new Array(numIter);
	var firstPoints = new Array(numPoints);
	for(var t = 0; t < numPoints; t++){
		firstPoints[t] = 
			new ElevationPoint(t, //pointNumber
			800, //distance
			(t*100), //bedrockElevation
			0, //iceSurfaceElevation
			0, //iceThickness
			.1, //tau
			800 //interp
			 );
	}
	iterations[0] = new Iteration(firstPoints,0);
	for(var i = 1; i < numIter; i++){
		iterations[i] = new Iteration(iterations[i-1].nextIteration, i);
	}
}