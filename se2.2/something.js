function ElevationPoint(pointNumber, distance, bedrockElevation, iceSurfaceElevation, iceThickeness, tau, interp){
	this.pointNumber = pointNumber;
	this.distance = distance;
	this.bedrockElevation = bedrockElevation;
	this.iceSurfaceElevation = iceSurfaceElevation;
	this.iceThickeness = iceThickeness;
	this.tau = tau;
	this.interp = interp;
	var originalBedrockElevation = 0;
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

	function calculateIS(){
		//Do the Calculations to generate next iteration
		var ni = new Array();
		for(var t = 0; t < e.length; t++){
			ni[t] = ElevationPoint(e[t].pointNumber, e[t].distance, e[t].bedrockElevation, e[t].iceSurfaceElevation, e[t].iceThickness,e[t].tau);
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
function create(){
	var numberOfPoints = document.getElementById("numPoints").value;
	document.write(numberOfPoints);
}

function generate_table() {
	var numberOfPoints = parseInt(document.getElementById("numPoints").value);
	var numberOfIterations = parseInt(document.getElementById("numIter").value);
  	// get the reference for the body
  	var body = document.getElementsByTagName("body")[0];
 
  	// creates a <table> element and a <tbody> element
 	var tbl     = document.createElement("table");
  	var tblBody = document.createElement("tbody");
 
	// creating all cells
	for (var i = 0; i < (numberOfPoints+1); i++) {
	    // creates a table row
		var row = document.createElement("tr");
	 
	    for (var j = 0; j < 5; j++) {
		    // Create a <td> element and a text node, make the text
		    // node the contents of the <td>, and put the <td> at
		    // the end of the table row
		    var cell = document.createElement("td");
		    if(i == 0 && j == 0)
		    	var cellText = document.createTextNode("Point Number");
		    else if(i == 0 && j == 1)
		    	var cellText = document.createTextNode("Bedrock Elevation");
		    else if(i == 0 && j == 2)
		    	var cellText = document.createTextNode("Distance");
		    else if(i == 0 && j == 3)
		    	var cellText = document.createTextNode("Tau");
		    else if(i == 0 && j == 4)
		    	var cellText = document.createTextNode("Interpolated Elevation");
		    else if(i != 0 && j == 0)
		    	var cellText = document.createTextNode("Point " + (i));
		    else{
		    	var cellText = document.createElement("INPUT")
		    	var tf = document.createTextNode(0.0);
		    	cellText.appendChild(tf);
		    	cellText.setAttribute("id","["+i+"]["+j+"]");
		    }
		    //var att = document.createAttribute("class");
			//att.value = "editableText";
			//cell.setAttribute("class","editableText");
		    cell.appendChild(cellText);
		    row.appendChild(cell);
	    }
	 
	    // add the row to the end of the table body
	    tblBody.appendChild(row);
	  }
	 
	// put the <tbody> in the <table>
	tbl.appendChild(tblBody);
	// appends <table> into <body>
	body.appendChild(tbl);
	// sets the border attribute of tbl to 2;
	tbl.setAttribute("border", "2");

	var calcBtn = document.createElement("BUTTON");
	var calcTxt = document.createTextNode("Calculate");
	calcBtn.appendChild(calcTxt);
	body.appendChild(calcBtn);
	calcBtn.setAttribute("onclick","grabData()");
}

function grabData(){
	var numPoints = parseInt(document.getElementById("numPoints").value);
	var numIter = parseInt(document.getElementById("numIter").value)+1;
	var iterations = new Array(numIter);
	var firstPoints = new Array(numPoints);
	for(var t = 0; t < numPoints; t++){
		firstPoints[t] = 
			new ElevationPoint(t, //pointNumber
			parseInt(document.getElementById("["+ (t+1) + "][2]").value), //distance
			parseInt(document.getElementById("["+ (t+1) + "][1]").value), //bedrockElevation
			0, //iceSurfaceElevation
			0, //iceThickness
			parseInt(document.getElementById("["+ (t+1) + "][3]").value), //tau
			parseInt(document.getElementById("["+ (t+1) + "][4]").value) //interp
			 );
	}
	iterations[0] = new Iteration(firstPoints,0);
	//for(var i = 1; i < numIter; i++){
	//	iterations[i] = new Iteration(iterations[i-1].calculateIS(), i);
	//}
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(document.createElement("br"));
	for(var j = 0; j < firstPoints.length; j++){
		body.appendChild(document.createTextNode((firstPoints[j].pointNumber+1) + " "));
		body.appendChild(document.createTextNode(firstPoints[j].bedrockElevation + " "));
		body.appendChild(document.createTextNode(firstPoints[j].distance + " "));
		body.appendChild(document.createTextNode(firstPoints[j].tau + " "));
		body.appendChild(document.createTextNode(firstPoints[j].interp));
		body.appendChild(document.createElement("br"));
	}
}