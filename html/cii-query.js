class Query {
    constructor() {
	console.log("window.location=", window.location);
        var query = window.location.search.substring(1);
        this.parms = query.split('&');
	var hashquery = window.location.hash.match(/&.*/);
	if (hashquery != "") {
	//	window.location.hash += ",foo";
	    console.log("query=", query, "hashquery=", hashquery);
	    query += hashquery;
	    console.log("query=>", query);
	    console.log("window.location.hash was " + window.location.hash)
	    window.location.hash = window.location.hash.replace(/&.*/, "");
	    console.log("window.location.hash=>" + window.location.hash)
	}

	console.log("window.location=", window.location);
    };

    // Return the value of a parameter. Only return the first such parameter's value that is found.
    // If that parameter does not exist, return the value of "def".
    get(nm, def) {
        if (def == null) def = "";
        for (var i = 0; i < this.parms.length; i++) { 
            var pos = this.parms[i].indexOf('=');
            if ((pos > 0) && (nm == this.parms[i].substring(0, pos))) {
                var val = decodeURIComponent(this.parms[i].substring(pos + 1).replace("+"," "));
                return val;
            }
        }
        return def;
    } 

    // Return the last value of a parameter.
    // If that parameter does not exist, return the value of "def".
    get(nm, def) {
        if (def == null) def = "";
        for (var i = 0; i < this.parms.length; i++) { 
            var pos = this.parms[i].indexOf('=');
            if ((pos > 0) && (nm == this.parms[i].substring(0, pos))) {
                def = decodeURIComponent(this.parms[i].substring(pos + 1).replace("+"," "));
            }
        }
        return def;
    } 

    // Get all occurrences of a paramter as a list of values.
    // If that parameter does not exist, return the value of "def".
    getAll(nm, def) {
        var retA = [];
        for (var i = 0; i < this.parms.length; i++) { 
            var pos = this.parms[i].indexOf('=');
            if ((pos > 0) && (nm == this.parms[i].substring(0, pos))) {
                var val = decodeURIComponent(this.parms[i].substring(pos + 1).replace("+"," "));
                retA.append(val);
            }
        }
	if (retA.length > 0) {
            return retA;
        } else {
            return def;
        }
    } 

    // Pretend that a given parameter was passed.
    setParm(nm, def) {
        this.parms.push(nm + "=" + def);
    }

    // Return a copy of the parameter list, with a possible addition.
    getParmListWith(addParm) {
	var ret = this.parms.join("&");
	if (addParm != null)
	    if (this.parms.length > 0)
		ret += "&" + addParm;
	    else
		ret += addParm;
	return "?" + ret;
    }

    // Return a copy of the parameter list, after removing a possible deletion.
    getParmListWithout(delParm) {
	var sep = "?";
	var ret = "";
	for (var i in this.parms) {
            var pos = this.parms[i].indexOf('=');
            if ((pos <= 0) || (delParm != this.parms[i].substring(0, pos))) {
		ret += sep;
		ret += this.parms[i];
	    }
	    sep = "&";
	}
	return ret;
    }

    getParmsAsDict() {
	var ret = { };
	for (var i in this.parms) {
	    var pos = this.parms[i].indexOf('=');
	    if (pos > 0) {
		var parm = this.parms[i].substring(0,pos);
		var str = this.parms[i].substring(pos+1);
		var dstr = decodeURIComponent((str+'').replace(/\+/g, '%20'));
		ret[parm] = dstr;
	    }
	}
	return ret;
    }
}
