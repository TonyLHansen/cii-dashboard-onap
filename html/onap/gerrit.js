
function getNextUrl(URL) {
    console.log("Getting URL=" + URL);

    $.ajax({
	    type: "GET",
		url: URL,
		data: { },
		success: function(json, statusText, request) {
		console.log("typeof json=",typeof json);
		console.log("success for '" + URL + "': json=",json);
		if (typeof json == "string") 
		    try {
			console.log("JSONified:", JSON.parse(json));
		    } catch (e) {
			console.log("ERROR PARSING JSON: ", e);
		    }
		console.log("statusText=",statusText);
		console.log("request=",request);
	    },
		error: function(request, error, thrownError) {
		console.log("Error for '" + URL + "': "+JSON.stringify(request) + "\n" + "error=" + error + "\n" + "thrownError=" + thrownError);
	    }
	});
}

console.clear();
//getNextUrl("gerrit-data.js");
getNextUrl("gerrit-data.cgi");
//getNextUrl("https://gerrit.onap.org/r/projects/?d");
