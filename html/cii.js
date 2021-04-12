parms = new Query();
debug = parms.get("debug", "");
function debuglog(msg, parm) {
    if (debug == "y") 
        if (typeof parm != 'undefined') console.log(msg, parm);
        else console.log(msg);
}

var onapGerritPrefix = "https://gerrit.onap.org/r/#/admin/projects/";

function sanitizeRelease(r, def) {
    debuglog("sanitizeRelease(" + r + ")");
    if (r == "current") {
        debuglog("found current");
        return r;
    }
    for (k = 0; k < releases.length; k++) {
        var release = releases[k];
        if (r == release) {
            debuglog("found the release");
            return r;
        }
    }
    debuglog("release not found, returning default: '" + def + "'");
    return def;
}

var help = parms.get("help", "n");
if (help == 'y') {
  document.write("project=onap or all<br/>");
  document.write("page=1-2,5-6 (only valid for project=all)<br/>");
  document.write("addMissingOnapProjects=y or n<br/>");
  document.write("jsonformat=pretty<br/>");
  document.write("debug=y<br/>");
  throw 'help';
}

useproxy = parms.get("useproxy", "n");
if (useproxy == 'y') {
    proxy = "http://one.proxy.att.com:8888";
} else {
    proxy = "";
}

project = parms.get("project", "onap");
debuglog("project='" + project + "'");

BASEURL="https://bestpractices.coreinfrastructure.org/projects.json";
BASEURL="cii-statuses.cgi";

if (project == "onap") {
  OFFSET=43;  // length(onapGerritPrefix)
  URLSUFFIX = "";
  IGNOREPAGE = true;
  // IGNOREPAGE = false;
  PROJECTTITLE = "ONAP";
  Q = "onap";
} else if (project == "all") {
  OFFSET = 0;
  URLSUFFIX = "?page=";
  IGNOREPAGE = false;
  PROJECTTITLE = "All";
  Q = "";
} else {
  document.write("project not onap or all");
  throw ("project not onap or all");
}

var optlist = "";
var opts = ["debug","useproxy","jsonformat"];
debuglog("opts=" + opts);
var sep = "";
for (i = 0; i < opts.length; i++) {
    var opt = opts[i];
    debuglog("looking at opt=" + opt);
    var p = parms.get(opt, null);
    if (p != null) {
        debuglog("found opt=" + opt);
        optlist += sep + opt + "=" + p;
        sep = "&";
    }
}
debuglog("optlist='" + optlist + "'");
var addOptlistTo = [ 'onapurl', 'onapallurl', 'allurl', 'allallurl' ];
for (i = 0; i < addOptlistTo.length; i++) {
    $("#" + addOptlistTo[i]).href += optlist;
}
$('.projecttitle').append(PROJECTTITLE);
$('#retrieving_data').innerHTML = "Retrieving Data";

function titleCase(str) {
    if (str.length == 0) return str;
    return str.charAt(0).toUpperCase() + str.substring(1);
}

var headers = "";
var badgingLevels = ["Passing", "Silver", "Gold"];
for (var bl in badgingLevels) {
    for (var k in releases) {
        headers += "<th>" + titleCase(releases[k]) + "<br/>%&nbsp;" + badgingLevels[bl] + "</th>";
    }
}

$('#tr').append("<thead><tr>" +
                "<th>RankOrder</th>" +
                "<th>Project Name<br/>(from URL)</th>" +
                "<th>Project Name</th>" +
                "<th>Badge</th>" +
                headers +
                "</tr></thead>" +
                "<tfoot><tr>" +
                "<th>RankOrder</th>" +
                "<th>Project Name<br/>(from URL)</th>" +
                "<th>Project Name</th>" +
                "<th>Badge</th>" +
                headers +
                "</tr></tfoot>");

$(document).ready(function() {

var datad = [];

var jsonformat = parms.get("jsonformat", "");
if (jsonformat == "pretty") {
  prettyjson = JSON_PRETTY_PRINT;
} else {
  prettyjson = 0;
}

var r0 = sanitizeRelease(parms.get("r0", ""), "");
var r1 = sanitizeRelease(parms.get("r1", "current"), "current");

var page = parms.get("page");
if (page == '') {
  page = "1-9";
}

if (IGNOREPAGE) {
  URLSUFFIX = '';
  page = "1";
}

// store the current data into data[]
function pushData(whereTo, whereFrom) {
    $(whereFrom).each(function(index, element) {
        whereTo.push(element);
    });
}

var pageRanges = page.split(",");
for (i = 0; i < pageRanges.length; i++) {
    var pos = pageRanges[i].indexOf('-');
    var start = end = pageRanges[i];
    if (pos > 0) {
        start = pageRanges[i].substring(0, pos);
        end = pageRanges[i].substring(pos+1);
    }
    debuglog("start=" + start + ", end=" + end);
    for (j = Number(start); j < Number(end)+1; j++) {
        debuglog("j=" + j);
        URL = BASEURL;
        debuglog("URL=" + URL);

        $.ajax({
		type: "GET",
		url: URL,
		data: { "q": Q, "page": j },
	        async: false,
                success: function(json) {
		    pushData(releaseData["current"], JSON.parse(json));
                }
        });
    }
}

debuglog("OFFSET=" + OFFSET + ";\n");

// add rank information everywhere
function addRanks(d) {
    debuglog("adding ranks to %o", d);
    $(d).each(function(index, element) {
        element.rank = element.badge_percentage_0 * 1000000 + element.badge_percentage_1 * 1000 + element.badge_percentage_2;
        debuglog("element.id=" + element.id + ", .rank=" + element.rank);
    });
}

for (i = 0; i < releases.length; i++) {
    addRanks(releaseData[releases[i]]);
};

// remember which ONAP projects have already been seen

var allOnapProjects = {
    "aaf/authz": "n", "aaf/cadi": "n", "aaf/inno": "n", "aaf/luaplugin": "n", "aai/aai-common": "n",
    "aai/aai-config": "n", "aai/aai-data": "n", "aai/aai-service": "n", "aai/babel": "n", "aai/champ": "n",
    "aai/data-router": "n", "aai/esr-gui": "n", "aai/esr-server": "n", "aai/gizmo": "n", "aai/logging-service": "n",
    "aai/model-loader": "n", "aai/resources": "n", "aai/rest-client": "n", "aai/router-core": "n", "aai/search-data-service": "n",
    "aai/sparky-be": "n", "aai/sparky-fe": "n", "aai/test-config": "n", "aai/traversal": "n", "appc": "n",
    "appc/deployment": "n", "ccsdk/dashboard": "n", "ccsdk/distribution": "n", "ccsdk/parent": "n", "ccsdk/platform/blueprints": "n",
    "ccsdk/platform/nbapi": "n", "ccsdk/platform/plugins": "n", "ccsdk/sli/adaptors": "n", "ccsdk/sli/core": "n", "ccsdk/sli/northbound": "n",
    "ccsdk/sli/plugins": "n", "ccsdk/storage/esaas": "n", "ccsdk/storage/pgaas": "n", "ccsdk/utils": "n", "ci-management": "n",
    "clamp": "n", "cli": "n", "dcaegen2": "n", "dcaegen2/analytics": "n", "dcaegen2/analytics/tca": "n",
    "dcaegen2/collectors": "n", "dcaegen2/collectors/snmptrap": "n", "dcaegen2/collectors/ves": "n", "dcaegen2/deployments": "n", "dcaegen2/platform": "n",
    "dcaegen2/platform/blueprints": "n", "dcaegen2/platform/cdapbroker": "n", "dcaegen2/platform/cli": "n", "dcaegen2/platform/configbinding": "n", "dcaegen2/platform/deployment-handler": "n",
    "dcaegen2/platform/inventory-api": "n", "dcaegen2/platform/plugins": "n", "dcaegen2/platform/policy-handler": "n", "dcaegen2/platform/registrator": "n", "dcaegen2/platform/servicechange-handler": "n",
    "dcaegen2/utils": "n", "demo": "n", "dmaap/buscontroller": "n", "dmaap/datarouter": "n", "dmaap/dbcapi": "n",
    "dmaap/messagerouter/dmaapclient": "n", "dmaap/messagerouter/messageservice": "n", "dmaap/messagerouter/mirroragent": "n", "dmaap/messagerouter/msgrtr": "n", "doc": "n",
    "doc/tools": "n", "ecompsdkos": "n", "externalapi/nbi": "n", "holmes/common": "n", "holmes/dsa": "n",
    "holmes/engine-management": "n", "holmes/rule-management": "n", "integration": "n", "logging-analytics": "n", "modeling/modelspec": "n",
    "modeling/toscaparsers": "n", "msb/apigateway": "n", "msb/discovery": "n", "msb/java-sdk": "n", "msb/swagger-sdk": "n",
    "mso": "n", "mso/chef-repo": "n", "mso/docker-config": "n", "mso/libs": "n", "mso/mso-config": "n",
    "multicloud/azure": "n", "multicloud/framework": "n", "multicloud/openstack": "n", "multicloud/openstack/vmware": "n", "multicloud/openstack/windriver": "n",
    "ncomp": "n", "ncomp/cdap": "n", "ncomp/core": "n", "ncomp/docker": "n", "ncomp/maven": "n",
    "ncomp/openstack": "n", "ncomp/sirius": "n", "ncomp/sirius/manager": "n", "ncomp/utils": "n", "oom": "n",
    "oom/registrator": "n", "oparent": "n", "optf/cmso": "n", "optf/has": "n", "optf/osdf": "n",
    "policy/api": "n", "policy/common": "n", "policy/docker": "n", "policy/drools-applications": "n", "policy/drools-pdp": "n",
    "policy/engine": "n", "policy/gui": "n", "policy/pap": "n", "policy/pdp": "n", "portal": "n",
    "portal/sdk": "n", "sdc": "n", "sdc/jtosca": "n", "sdc/sdc-distribution-client": "n", "sdc/sdc-docker-base": "n",
    "sdc/sdc-titan-cassandra": "n", "sdc/sdc-tosca": "n", "sdc/sdc-workflow-designer": "n", "sdnc/adaptors": "n", "sdnc/architecture": "n",
    "sdnc/core": "n", "sdnc/features": "n", "sdnc/northbound": "n", "sdnc/oam": "n", "sdnc/parent": "n",
    "sdnc/plugins": "n", "so": "n", "so/chef-repo": "n", "so/docker-config": "n", "so/libs": "n",
    "so/so-config": "n", "testsuite": "n", "testsuite/heatbridge": "n", "testsuite/properties": "n", "testsuite/python-testing-utils": "n",
    "ui": "n", "ui/dmaapbc": "n", "university": "n", "usecase-ui": "n", "usecase-ui/server": "n",
    "vfc/gvnfm/vnflcm": "n", "vfc/gvnfm/vnfmgr": "n", "vfc/gvnfm/vnfres": "n", "vfc/nfvo/catalog": "n", "vfc/nfvo/driver/ems": "n",
    "vfc/nfvo/driver/sfc": "n", "vfc/nfvo/driver/vnfm/gvnfm": "n", "vfc/nfvo/driver/vnfm/svnfm": "n", "vfc/nfvo/lcm": "n", "vfc/nfvo/resmanagement": "n",
    "vfc/nfvo/wfengine": "n", "vid": "n", "vid/asdcclient": "n", "vnfrqts/epics": "n", "vnfrqts/guidelines": "n",
    "vnfrqts/requirements": "n", "vnfrqts/testcases": "n", "vnfrqts/usecases": "n", "vnfsdk/compliance": "n", "vnfsdk/functest": "n",
    "vnfsdk/lctest": "n", "vnfsdk/model": "n", "vnfsdk/pkgtools": "n", "vnfsdk/refrepo": "n", "vnfsdk/validation": "n",
    "vvp/ansible-ice-bootstrap": "n", "vvp/cms": "n", "vvp/devkit": "n", "vvp/documentation": "n", "vvp/engagementmgr": "n",
    "vvp/gitlab": "n", "vvp/image-scanner": "n", "vvp/jenkins": "n", "vvp/portal": "n", "vvp/postgresql": "n",
    "vvp/test-engine": "n", "vvp/validation-scripts": "n"
};

$(releaseData[r1]).each(function(index, element) {
    if (element.repo_url.substring(0,43) == onapGerritPrefix) {
        allOnapProjects[element.repo_url.substring(43)] = "y";
    }
});

var addMissingOnapProjects = parms.get("addMissingOnapProjects", "y");

if (addMissingOnapProjects == "y") {
    for (var k in allOnapProjects) {
        releaseData[r1].push({ "repo_url": onapGerritPrefix + k, "name": k, "_badge": "cii-not-started.png", "rank": 0, "badge_percentage_0": 0,  "badge_percentage_1": 0,  "badge_percentage_2": 0 });
    }
}

function addRankOrder(d) {
    d.sort(function(a,b) {
        return b.rank - a.rank;
    });
    // debuglog("addRankOrder(%o)", d);
    var prev = -1;
    var iprev = -1;
    for (i = 0; i < d.length; i++) {
        // debuglog("looking at d[" + i + "/" + d[i].name + "].rank = " + d[i].rank);
        if (d[i].rank == prev) {
            d[i].rank_order = iprev + 1;
        } else {
            d[i].rank_order = i + 1;
            prev = d[i].rank;
            iprev = i;
        }
	// debuglog("setting d[" + i + "].rank_order to " + d[i].rank_order);
    }
    // debuglog("addRankOrder() done: %o", d);
}

// for (i = 0; i < releases.length; i++) {
//    addRankOrder(releaseData[releases[i]]);
//};
if (r0 != '') addRankOrder(releaseData[r0]);
addRankOrder(releaseData[r1]);

$(releaseData[r1]).each(function(index, element) {
    // debuglog("add url/badge to element=%o", element);
    element.short_url = stripurl(element.repo_url, false);
    element.badge = element._badge ? element._badge : ("https://bestpractices.coreinfrastructure.org/projects/" + element.id + "/badge");
});



// sort on the URL name
function stripurl(url, doupper) {
    var str = doupper ? url.toUpperCase().substring(OFFSET) : url.substring(OFFSET);
    str = str.replace(/\/$/, "").replace(/^.*\//, "");
    if (str == '') return "unknown";
    return str;
}

releaseData[r1].sort(function(a,b) {
  var nameA = stripurl(a.repo_url); // ignore upper and lowercase
  var nameB = stripurl(b.repo_url); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  } else {
    // names must be equal
    return 0;
  }
});

var passingCount = silverCount = goldCount = 0;
var nonPassingCount = nonSilverCount = nonGoldCount = 0;
var passing80Count = silver80Count = gold80Count = 0;
var totalCount = releaseData[r1].length;

$(releaseData[r1]).each(function(index, element) {
    if (element.badge_percentage_0 == 100) passingCount++;
    else { nonPassingCount++; if (element.badge_percentage_0 >= 80) { passing80Count++; } }
    if (element.badge_percentage_1 == 100) silverCount++;
    else { nonSilverCount++; if ((element.badge_percentage_0 == 100) && (element.badge_percentage_1 >= 80)) { silver80Count++; } }
    if (element.badge_percentage_2 == 100) goldCount++;
    else { nonGoldCount++; if ((element.badge_percentage_1 == 100) && (element.badge_percentage_2 >= 80)) { gold80Count++; } }

});

// invert the data to generate info indexed by the short_urls
var releaseIndices = {};
// debuglog("hd=" + releaseData);
for (k = 0; k < releases.length; k++) {
    var release = releases[k];
    releaseIndices[release] = {};
    var hdk = releaseData[release];
    // debuglog("r[" + k + "]=" + releases[k] + ", h[" + k + "]=" + hdk);
    for (l = 0; l < hdk.length; l++) {
        var u = stripurl(hdk[l].repo_url, false);
        // debuglog("hdk[" + l + "]=" + hdk[l] + ", release=" + release + ", u=" + u);
        releaseIndices[release][u] = l;
    }
}

function getPreviousData(m, fieldName, prevRelease) {
    if (prevRelease == "") return "";
    var index = m.short_url;
    var prevReleaseIndex = releaseIndices[prevRelease][index];
    var curValue = m[fieldName];
    if (typeof prevReleaseIndex == "undefined") {
        return 0;
    }
    var prevReleaseEntry = releaseData[prevRelease][prevReleaseIndex];
    var prevValue = prevReleaseEntry[fieldName];
    return prevValue;
}

function badgeFieldName(release, fieldname) {
    if (release == "current") return fieldname;
    return release + "_" + fieldname;
}

// add data from previous releases to each row
for (k = 0; k < releases.length; k++) {
    var release = releases[k];
    if (release == "current") break;
    $(releaseData["current"]).each(function(index, element) {
        element[badgeFieldName(release, "badge_percentage_0")] = getPreviousData(element, "badge_percentage_0", release);
        element[badgeFieldName(release, "badge_percentage_1")] = getPreviousData(element, "badge_percentage_1", release);
        element[badgeFieldName(release, "badge_percentage_2")] = getPreviousData(element, "badge_percentage_2", release);
    });
}

var datatableColumns = [
            { "data": "rank_order", className: "textright" },
            { "data": "short_url" },
            { "data": "name" },
            { "data": "badge", "render": function ( data, type, row, meta ) { return type === 'display' ?  '<img src="'+data+'"/>' : data; } },
];

var badgingFieldNames = [ "badge_percentage_0", "badge_percentage_1", "badge_percentage_2" ];
for (var bl in badgingLevels) {
    for (var k in releases) {
        var release = releases[k];
        var color = (release == "current") ? "" : "historic";
        datatableColumns.push(
            { "data": badgeFieldName(release, badgingFieldNames[bl]),
              "render": function ( data, type, row, meta ) {
                if (type != "display") return data;
		return ("<span width='100%' class=''>" + data + "</span>");
              },
              className: "textright " + color });
    }
}

$('#tr').DataTable({
        "data": releaseData[r1],
        "paging":   false,
        "info":     false,
        "dom": "B",
        "searching": false,
        "autoWidth": false,
        "buttons": [ "colvis" ],
        "columns": datatableColumns,
    });

var passing80Percentage = (nonPassingCount > 0) ? (100 * passing80Count / nonPassingCount) : 0;
var silver80Percentage = (nonSilverCount > 0) ? (100 * silver80Count / nonSilverCount) : 0;
var gold80Percentage = (nonGoldCount > 0) ? (100 * gold80Count / nonGoldCount) : 0;

$('#tr2').append(
    "<tr>" +
    "<th>Projects &ge;80%/&lt;100%</th>" +
    "<td class='textright'>" + passing80Count.toFixed(2) + "&nbsp;/&nbsp;" + nonPassingCount.toFixed(2) + "&nbsp;=&nbsp;" + passing80Percentage.toFixed(2) + "%</td>" +
    "<td class='textright'>" + silver80Count.toFixed(2) + "&nbsp;/&nbsp;" + nonSilverCount.toFixed(2) + "&nbsp;=&nbsp;" + silver80Percentage.toFixed(2) + "%</td>" +
    "<td class='textright'>" + gold80Count.toFixed(2) + "&nbsp;/&nbsp;" + nonGoldCount.toFixed(2) + "&nbsp;=&nbsp;" + gold80Percentage.toFixed(2) + "%</td>" +
    "</tr>"
);

var passingPercentage = (100 * passingCount / totalCount);
var silverPercentage = (100 * silverCount / totalCount);
var goldPercentage = (100 * goldCount / totalCount);

$('#tr2').append(
    "<tr>" +
    "<th>Projects at 100%</th>" +
    "<td class='textright'>" + passingCount.toFixed(2) + "&nbsp;/&nbsp;" + totalCount.toFixed(2) + "&nbsp;=&nbsp;" + passingPercentage.toFixed(2) + "%</td>" +
    "<td class='textright'>" + silverCount.toFixed(2) + "&nbsp;/&nbsp;" + totalCount.toFixed(2) + "&nbsp;=&nbsp;" + silverPercentage.toFixed(2) + "%</td>" +
    "<td class='textright'>" + goldCount.toFixed(2) + "&nbsp;/&nbsp;" + totalCount.toFixed(2) + "&nbsp;=&nbsp;" + goldPercentage.toFixed(2) + "%</td>" +
    "</tr>"
);

var colors = [
/* 0-9    */ "#c4551d",
/* 10-19  */ "#ba4b13",
/* 20-29  */ "#c4611d",
/* 30-39  */ "#c46c1d",
/* 40-49  */ "#c47a1d",
/* 50-59  */ "#c4881d",
/* 60-69  */ "#b5890e",
/* 70-79  */ "#c4a41d",
/* 80-89  */ "#b7a910",
/* 90-99  */ "#c4011d",
/* 100    */ "#4bc51d"
];
var silver = "#bbbbbb";
var gold   = "#f2ce0d";
var black  = "#000000";
var white  = "#ffffff";

var color = colors[parseInt(passingPercentage / 10, 10)];
var textcolor = white;
if (passingPercentage == 100 && silverPercentage == 100) {
    if (goldPercentage == 100) { color = gold; textcolor = black; }
    else { color = silver; textcolor = black; }
}

var level = "Level 0";
if ((passingPercentage >= 70) && ((nonPassingCount == 0) || (passing80Percentage >= 80))) { level = "Level 1"; }
if ((silverPercentage >= 70) && ((nonSilverCount == 0) || (silver80Percentage >= 80))) { level = "Level 2"; }
if ((goldPercentage >= 70) && ((nonGoldCount == 0) || (gold80Percentage >= 80))) { level = "Level 3"; }
if (goldPercentage == 100) { level = "Level 4"; }

$('#tr2').append(
    "<tr>" +
    "<td class='center' colspan='4' style='color: " + textcolor + "; background-color: " + color + "'><br/>" + totalCount + " Projects: " + level + "<br/><br/></td>" +
    "</tr>"
);

$('#retrieving_data').innerHTML = "";

}); // end of document.ready()
