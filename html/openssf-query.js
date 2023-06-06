/* eslint-disable require-jsdoc,no-unused-vars */

class Query {
    constructor() {
        // console.log("window.location=", window.location);
        let query = window.location.search.substring(1);
        this.parms = query.split('&');
        const hashquery = window.location.hash.match(/&.*/);
        if (hashquery != '') {
            //        window.location.hash += ",foo";
            // console.log("query=", query, "hashquery=", hashquery);
            query += hashquery;
            // console.log("query=>", query);
            // console.log("window.location.hash was " + window.location.hash)
            window.location.hash = window.location.hash.replace(/&.*/, '');
            // console.log("window.location.hash=>" + window.location.hash)
        }

        // console.log("window.location=", window.location);
    };

    // Return the value of a parameter. Only return the first such parameter's value that is found.
    // If that parameter does not exist, return the value of "def".
    get(nm, def) {
        if (def == null) def = '';
        for (let i = 0; i < this.parms.length; i++) {
            const pos = this.parms[i].indexOf('=');
            if ((pos > 0) && (nm == this.parms[i].substring(0, pos))) {
                const val = decodeURIComponent(this.parms[i].substring(pos + 1).replace('+', ' '));
                return val;
            }
        }
        return def;
    }

    // Return the last value of a parameter.
    // If that parameter does not exist, return the value of "def".
    get(nm, def) {
        if (def == null) def = '';
        for (let i = 0; i < this.parms.length; i++) {
            const pos = this.parms[i].indexOf('=');
            if ((pos > 0) && (nm == this.parms[i].substring(0, pos))) {
                def = decodeURIComponent(this.parms[i].substring(pos + 1).replace('+', ' '));
            }
        }
        return def;
    }

    // Get all occurrences of a paramter as a list of values.
    // If that parameter does not exist, return the value of "def".
    getAll(nm, def) {
        const retA = [];
        for (let i = 0; i < this.parms.length; i++) {
            const pos = this.parms[i].indexOf('=');
            if ((pos > 0) && (nm == this.parms[i].substring(0, pos))) {
                const val = decodeURIComponent(this.parms[i].substring(pos + 1).replace('+', ' '));
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
        this.parms.push(nm + '=' + def);
    }

    // Return a copy of the parameter list, with a possible addition.
    getParmListWith(addParm) {
        let ret = this.parms.join('&');
        if (addParm != null) {
            if (this.parms.length > 0) {
                ret += '&' + addParm;
            } else {
                ret += addParm;
            }
        }
        return '?' + ret;
    }

    // Return a copy of the parameter list, after removing a possible deletion.
    getParmListWithout(delParm) {
        let sep = '?';
        let ret = '';
        for (const i in this.parms) {
            if (this.parms.hasOwnProperty(i)) {
                const pos = this.parms[i].indexOf('=');
                if ((pos <= 0) || (delParm != this.parms[i].substring(0, pos))) {
                    ret += sep;
                    ret += this.parms[i];
                }
                sep = '&';
            }
        }
        return ret;
    }

    getParmsAsDict() {
        const ret = { };
        for (const i in this.parms) {
            if (this.parms.hasOwnProperty(i)) {
                const pos = this.parms[i].indexOf('=');
                if (pos > 0) {
                    const parm = this.parms[i].substring(0, pos);
                    const str = this.parms[i].substring(pos+1);
                    const dstr = decodeURIComponent((str+'').replace(/\+/g, '%20'));
                    ret[parm] = dstr;
                }
            }
        }
        return ret;
    }
}
