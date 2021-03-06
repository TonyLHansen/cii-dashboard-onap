"use strict";
console.clear();
var BETABASESITE = "https://master.bestpractices.coreinfrastructure.org/";
var BASESITE = "https://bestpractices.coreinfrastructure.org/";
// var BASESITE = BETABASESITE;
var BASEURL = BASESITE + "projects.json";
var Q = "onap";
var globalTables = { };
var columnNames = { "bronze": [ ], "silver": [ ], "gold": [ ] };
var requiredNames = { "bronze": [ ], "silver": [ ], "gold": [ ] };
var optionalNames = { "bronze": [ ], "silver": [ ], "gold": [ ] };
var blank2 = "&nbsp;&nbsp;";
var blank4 = blank2 + blank2;

//// var repoUrlPrefixes = [
//// 		       "https://gerrit.onap.org/r/admin/repos/q/filter:",
//// 		       "https://gerrit.onap.org/r/#/admin/projects/",
//// 		       // "https://gerrit.onap.org/r/admin/repos:",
//// 		       "https://gerrit.onap.org/r/p/",
//// 		       "https://gerrit.onap.org/r/",
//// 		       "https://git.onap.org/"
//// 		       ];

function escapeSlash(pat) {
    return pat.replaceAll("/", "[/]").replaceAll("+", "[+]");
}
var repoUrlPatterns = [
    escapeSlash("^https://gerrit.onap.org/r/admin/repos/q/filter:(.*)$"),
    escapeSlash("^https://gerrit.onap.org/r/#/admin/projects/(.*)$"),
    escapeSlash("^https://gerrit.onap.org/r/admin/repos/(.*)/parent$"),
    escapeSlash("^https://gerrit.onap.org/r/p/(.*)([.]git)$"),
    escapeSlash("^https://gerrit.onap.org/r/(.*)$"),
    escapeSlash("^https://git.onap.org/(.*)$"),
    escapeSlash("^https://wiki.onap.org/display/DW/(.*)+Project$"),
    escapeSlash("^https://gerrit.onap.org/r/admin/repos/q/filter:(.*)$")
];
//// var badRepoUrlPrefix = "https://gerrit.onap.org/r/".toUpperCase();
//// var gitRepoUrlPrefix = "https://gerrit.onap.org/r/p/".toUpperCase();
var goodRepoUrlPrefix = "https://gerrit.onap.org/r/#/admin/projects/";

var badgingLevels = ["Passing", "Silver", "Gold"];
var badgingColors = ["bronze", "silver", "gold"];
var bucketStr = [ "0-20%", "20-40%", "40-60%", "60-80%", "80-100%", "100%" ];

var green  = "#4bc51d";
var silver = "#bbbbbb";
var gold   = "#f2ce0d";
var black  = "#000000";
var white  = "#ffffff";
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
	      /* 90-99  */ "#c4b11d",
	      /* 100    */ green
	      ];

function getColor(passingPercentage, silverPercentage, goldPercentage) {
    var color = colors[parseInt(passingPercentage / 10, 10)];
    if (passingPercentage == 100 && silverPercentage == 100) {
	if (goldPercentage == 100) { color = gold; }
	else { color = silver; }
    }
    return color;
}

function getTieredColor(tieredPercentage) {
    var color = colors[0];
    if (tieredPercentage < 100) color = colors[parseInt(tieredPercentage / 10, 10)];
    else if (tieredPercentage < 200) color = green;
    else if (tieredPercentage < 300) color = silver;
    else color = gold;
    return color;
}


var parms = new Query();
var debug = "y"; // parms.get("debug", "n");
function debuglog(msg, parm) {
    if (debug == "y") {
        if (typeof parm != 'undefined') console.log(msg, parm);
        else console.log(msg);
    } else if (debug == "alert") {
        if (typeof parm != 'undefined') alert(msg, parm);
        else alert(msg);
    }
}

var help = parms.get("help", "n");
if (help == 'y') {
    // TODO this is woefully out of date
  document.write("project=onap or all<br/>");
  document.write("page=1-2,5-6 (only valid for project=all)<br/>");
  document.write("addMissingOnapProjects=y or n<br/>");
  document.write("jsonformat=pretty<br/>");
  document.write("debug=y<br/>");
  throw 'help';
}

var sortBy = "";
var initSortBy = parms.get("sortby", "by_name").toLowerCase();
if (!(initSortBy == "by_name" ||
      initSortBy == "by_section_name" ||
      initSortBy == "by_section_type_name" ||
      initSortBy == "by_type_section_name" ||
      initSortBy == "by_type_name" ||
      initSortBy == "by_ordinal_name" ||
      initSortBy == "by_ordinal_type_name" ||
      initSortBy == "by_onapwide_name" ||
      initSortBy == "by_onapwide_section_name" ||
      initSortBy == "by_onapwide_type_name")
    )
    initSortBy = "by_name";

function watermark(msg) {
    // console.log("setting watermark to " + msg);
    if (msg != "") {
	$('#watermarkPage').html(msg);
	//	$('#watermark').addClass('watermark');
	//	$('#watermark').removeClass('hiddenWatermark');
	// $('#watermark').fadeIn('fast');
	// $('#watermarkPage').css('opacity', '0.9');
    } else {
	$('#watermarkPage').html("<br/>");
	//	$('#watermark').addClass('hiddenWatermark');
	//	$('#watermark').removeClass('watermark');
	// $('#watermark').fadeOut('fast');
	// $('#watermarkPage').css('opacity', '0.0');
    }
}

function flipVisibility(where, how) {
    // console.log("flipping display, where=" + where);
    // console.dir(where);
    if (!how) how = 'inline';
    if ( $(where).css('display') == 'none' ) {
	$(where).css('display','inline');
    } else {
	$(where).css('display','none');
    }
}

function flipThisVisibility(index) {
    flipVisibility(this);
}

function makeVisible(where) {
    // console.log("changing display to inline, where=" + where);
    // console.dir(where);
    $(where).css('display','inline');
}

function makeThisVisible(index) {
    makeVisible(this);
}

function makeInvisible(where) {
    // console.log("changing display to none, where=" + where);
    // console.dir(where);
    $(where).css('display','none');
}

function makeThisInvisible(index) {
    makeInvisible(this);
}

function sanitizeRelease(r, def) {
    // debuglog("sanitizeRelease(" + r + ")");
    if (r == "current") {
        // debuglog("found current");
        return r;
    }
    for (var k = 0; k < releases.length; k++) {
        var release = releases[k];
        if (r == release) {
            // debuglog("found the release");
            return r;
        }
    }
    debuglog("release not found, returning default: '" + def + "'");
    return def;
}

function titleCase(str) {
    if (str.length == 0) return str;
    return str.charAt(0).toUpperCase() + str.substring(1);
}

function addReleasesAndBadgingLevelsToTable() {
    // var headers = intermingleReleasesAndBadgingLevels();
    var headers = "<tr>" +
		    "<th>Ranked&nbsp;Index</th>" +
		    "<th>Project&nbsp;Prefix</th>" +
		    "<th>Name</th>" +
		    "<th>Badge</th>" +
		    "<th>Passing&nbsp;%</th>" +
		    "<th>Silver&nbsp;%</th>" +
		    "<th>Gold&nbsp;%</th>" +
		    "</tr>";
    $('#trprojects').append("<thead>" + headers + "</thead>" +
		    "<tfoot>" + headers + "</tfoot>");
}

// store the current data into data[]
function pushData(whereTo, whereFrom) {
    $(whereFrom).each(function(index, element) {
        whereTo.push(element);
    });
}

function genPageList(page) {
    var pagelist = [];
    var pageRanges = page.split(",");
    for (var i = 0; i < pageRanges.length; i++) {
	var pos = pageRanges[i].indexOf('-');
	var start = pageRanges[i];
	var end = start;
	if (pos > 0) {
	    start = pageRanges[i].substring(0, pos);
	    end = pageRanges[i].substring(pos+1);
	}
	for (var j = Number(start); j < Number(end)+1; j++) {
	    pagelist.push(j);
	}
    }
    return pagelist;
}

function generateRank(bp0, bp1, bp2) {
    return bp0 * 1000000 + bp1 * 1000 + bp2;
}

var historicalProjectCount = { };

var historicalStats = { }; // historicalStats[release][level 0/1/2][bucket 0-5]{ #-projects, cumulative-#, %-projects, cumulative-% }

function createHistoricalStatsRelease(release) {
    historicalStats[release] = [];
    for (var level = 0; level < 3; level++) {
	historicalStats[release].push([]);
	for (var bucket = 0; bucket < 6; bucket++) {
	    historicalStats[release][level].push({ "#projects": 0, "cumulative#": 0, "%projects": 0.0, "cumulative%": 0.0 });
	}
    }
}

function createHistoricalStats() {
    releases["current"] = { };
    for (var release in releases) {
	createHistoricalStatsRelease(release);
    }
}

function fillHistoricalStatsForRelease(release, releaseData, dolog) {
    if (dolog) console.log("fillHistoricalStatsForRelease(" + release + ",", releaseData, ")");
    if (dolog) console.log("before loop")
    for (var j in releaseData) {
	if (dolog) console.log("j=", j);
	var releaseDataj = releaseData[j];
	if (dolog) console.log("releaseDataj=", releaseDataj);
	var badge_percentage_0 = releaseDataj["badge_percentage_0"];
	if (dolog) console.log("badge_percentage_0=" + badge_percentage_0);
	var bucket0 = parseInt(badge_percentage_0 / 20.);
	if (dolog) console.log("bucket0=", bucket0);
	historicalStats[release][0][bucket0]["#projects"] += 1;
	var badge_percentage_1 = releaseDataj["badge_percentage_1"];
	var bucket1 = parseInt(badge_percentage_1 / 20.);
	if (dolog) console.log("bucket1=", bucket1);
	historicalStats[release][1][bucket1]["#projects"] += 1;
	var badge_percentage_2 = releaseDataj["badge_percentage_2"];
	var bucket2 = parseInt(badge_percentage_2 / 20.);
	if (dolog) console.log("bucket2=", bucket2);
	historicalStats[release][2][bucket2]["#projects"] += 1;
	if (dolog) console.log("all buckets filled for this project");
    }
    if (dolog) console.log("after fillHistoricalStatsForRelease(" + release + ", ...)");
}

function fillHistoricalStatsForHistoricalReleases() {
    for (var release in historicalReleaseData) {
	var hrdi = historicalReleaseData[release];
	fillHistoricalStatsForRelease(release, hrdi);
    }
}

function fillRemainingHistoricalStats() {
    // do at end
    for (var release in releases) {
        // var release = releases[releasei];
        historicalProjectCount[release] = 0;
        var level = 0;
        for (var bucket = 0; bucket < 6; bucket++) {
	    historicalProjectCount[release] += historicalStats[release][level][bucket]["#projects"];
        }
	var releaseProjectCount = historicalProjectCount[release];
        for (var level = 0; level < 3; level++) {
	    var cumulative = 0;
	    var minBucket = 0, maxBucket = 0;
	    for (var bucket = 5; bucket >= 0; bucket--) {
		var nprojects = historicalStats[release][level][bucket]["#projects"];
		cumulative += nprojects;
		if (cumulative > 0) if (bucket > maxBucket) maxBucket = bucket;
		if (cumulative == releaseProjectCount) if (bucket > minBucket) minBucket = bucket;
		historicalStats[release][level][bucket]["%projects"] = (100.0 * nprojects / releaseProjectCount).toFixed(1);
		historicalStats[release][level][bucket]["cumulative#"] = cumulative;
		historicalStats[release][level][bucket]["cumulative%"] = (100.0 * cumulative / releaseProjectCount).toFixed(1);
	    }
	    historicalStats[release][level]["minBucket"] = minBucket;
	    historicalStats[release][level]["maxBucket"] = maxBucket;
        }
    }
}

function interpolate(a, b, r) {
    return parseInt(a) + Math.floor((b - a) * r / 100.);
}

function interpolateToHex(a, b, r) {
    var ret = interpolate(a,b,r);
    ret = ("000000" + ret.toString(16));
    ret = ret.substring(ret.length - 6);
    // console.log("interpolateToHex(" + a + "," + b + "," + r + ")=>" + ret);
    return ret;
}


function showHistoricalInfo() {
    var html = "<table><tr><th colspan='2' rowspan='2'>Level</th>";
    for (var release in releases) {
	if (historicalProjectCount[release] > 0) {
	    html += "<td rowspan='99'>&nbsp;</td>" + "<th colspan='4'>" + release + "<br/>" + historicalProjectCount[release] + "</th>";
	}
    }
    html += "</tr>\n";
    html += "<tr>";
    for (var release in releases) {
	if (historicalProjectCount[release] > 0) {
	    html += "<td align='center'>#</td>" + "<td align='center'>%</td>" + "<td align='center'>+ #</td>" + "<td align='center'>+ %</td>";
	}
    }
    html += "</tr>\n";

    var levelBgColors = [ "bgbronze", "bgsilver", "bggold" ];
    //                     red         green           green       silver          silver      gold
    var colorBounds = [ [ "0xff0000", "0x00ff00" ], [ "0x00ff00", "0xc0c0c0" ], [ "0xc0c0c0", "0xffd700" ] ];
    var levelBounds = [ [ 0, 20 ], [ 20, 40 ], [ 40, 60 ], [ 60, 80 ], [ 80, 100 ], [ 100, 100 ] ];

    var gradients = [
		     // redToGreen
		     [ "ff0000", "fb0000", "df0000", "c20700", "a62900", "883b00",
		       "6d4a00", "4a5a00", "1a6800", "007500", "008300", "008300", "008300" ],
		     // greenToSilver
		     [ "008300", "008900", "008f00", "009526", "229c41", "44a256",
		       "63a86e", "7bae82", "92b497", "a9baab", "c0c0c0", "c0c0c0", "c0c0c0" ],
		     // silverToGold
		     [ "c0c0c0", "c7c2a8", "cec492", "d5c77b", "dcc962", "e3cb46",
		       "ebcd1e", "f1d000", "f8d200", "ffd400", "ffd700", "ffd700", "ffd700" ]
		     ];

    var opacities = {
	100: [ 0.00, 0.16, 0.33, 0.50, 0.66, 0.83, 1.00 ],
	80: [ 0.26, 0.43, 0.60, 0.76, 0.93, 1.00, 1.00 ],
	50: [ 0.43, 0.60, 0.76, 0.93, 1.00, 1.00, 1.00 ],
	20: [ 0.60, 0.76, 0.93, 1.00, 1.00, 1.00, 1.00 ],
	0: [ 1.00, 1.00, 1.00, 1.00, 1.00, 1.00 ]
    };

    var levelSep = "";
    var dolog = false;
    // for (var level = 0; level < 3; level++) {
    for (var level = 2; level >= 0; level--) {
	html += levelSep;
	levelSep = "<tr><td colspan='99'><br/></td></tr>";
	var shownLevel = false;
	var gray = "background-color: white; color: #cdcdcd; ";
	// for (var bucket = 0; bucket < 6; bucket++) {
	for (var bucket = 5; bucket >= 0; bucket--) {
	    html += "<tr>";
	    if (!shownLevel) {
		html += "<th class='" + levelBgColors[level] + "' rowspan='6'>" + badgingLevels[level] + "</th>";
		shownLevel = true;
	    }
	    // background: linear-gradient(to top, $bcolor $bpct%, $tcolor $tpct%)
	    var botColor = gradients[level][bucket*2];
	    var topColor = gradients[level][bucket*2 + 2];
	    var grad = "background: linear-gradient(to top, #" + botColor + ", #" + topColor + ")";
	    var opacity = opacities[0][bucket];
	    // console.log("bucket=",bucket);
	    // console.log("base opacity=",opacity);
	    // console.log("grad=", grad);

	    html += "<td style='" + grad + "' align='right'>" + bucketStr[bucket] + "</td>";
	    for (var release in releases) {
		if (historicalProjectCount[release] > 0) {
		    var showlog = false; // (release == "current");
		    if (showlog) {
			console.log("================================================================");
			console.log("level=", level, " / ", levelBgColors[level]);
			console.log("release=", release);
		    }
		    var nprojects = historicalStats[release][level][bucket]["#projects"];
		    var pprojects = historicalStats[release][level][bucket]["%projects"];
		    var ncumulative = historicalStats[release][level][bucket]["cumulative#"];
		    var pcumulative = historicalStats[release][level][bucket]["cumulative%"];
		    if (showlog) {
			console.log("nprojects=", nprojects);
			console.log("pprojects=", pprojects);
			console.log("ncumulative=", ncumulative);
			console.log("pcumulative=", pcumulative);
		    }

		    var bg = (ncumulative <= 0) ? gray : grad;
		    var minBucket = historicalStats[release][level]["minBucket"];
		    var maxBucket = historicalStats[release][level]["maxBucket"];
		    if (showlog) {
			console.log("minBucket=", minBucket);
			console.log("maxBucket=", maxBucket);
		    }
		    if (maxBucket > 4) {
			if (minBucket == 5) {
			    opacity = opacities[100][bucket];
			    if (showlog) console.log("using opacity for 100");
			} else if (minBucket == 4) {
			    if (historicalStats[release][level][4]["#projects"] < historicalStats[release][level][5]["#projects"]) {
				opacity = opacities[80][bucket];
			        if (showlog) console.log("using opacity for 80");
			    } else if (historicalStats[release][level][5]["%projects"] > 40) {
				opacity = opacities[50][bucket];
			        if (showlog) console.log("using opacity for 50");
			    } else if (historicalStats[release][level][5]["%projects"] > 20) {
				opacity = opacities[20][bucket];
			        if (showlog) console.log("using opacity for 20");
			    }
			} else {
			    var showlog2 = false;
			    if (showlog2) console.log("release=", release, "level=", level, " / ", levelBgColors[level], "[4][%projects]", historicalStats[release][level][4]["%projects"], "[5][%projects]", historicalStats[release][level][5]["%projects"]);
			    // code here goes whiter on the bottom if %projects[4+5] > 75%
			    var hist4plus5 = +(historicalStats[release][level][4]["%projects"]) + +(historicalStats[release][level][5]["%projects"]);
			    if (showlog2) console.log("hist 4+5=", hist4plus5);

			    if (hist4plus5 > 75) {
				if (showlog2) console.log("hist4plus5 > 75");
				if (historicalStats[release][level][5]["%projects"] > 50) {
				    opacity = opacities[50][bucket];
			            if (showlog2) console.log("using opacity for 50");
				} else if (historicalStats[release][level][5]["%projects"] > 20) {
				    opacity = opacities[20][bucket];
			            if (showlog2) console.log("using opacity for 20");
				}
			    }
			}
		    }
		    if (showlog) {
			console.log("opacity=",opacity);
			console.log("bg=", bg);
		    }
		    html +=
			"<td style=' opacity: " + opacity + "; " + bg + "' align='right'>" + nprojects + "</td>" +
			"<td style=' opacity: " + opacity + "; " + bg + "' align='right'>" + pprojects + "</td>" +
			"<td style=' opacity: " + opacity + "; " + bg + "' align='right'>" + ncumulative + "</td>" +
			"<td style=' opacity: " + opacity + "; " + bg + "' align='right'>" + pcumulative + "</td>";
		}
	    }
	    html += "</tr>\n";
	}
    }

    // html += "</tr>\n";
    html += "</table>\n";
    // console.log("historical html=", html);
    $('#releasestats_div').append(html);
    // console.log("end of showHistoricalInfo()");
}


// A sample of repo_urls captured during a run:
//
// Bad URLs:
// "repo_url": "https://gerrit.onap.org",    <- bad, not specific
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects", <- bad, not specific
//
// Semi-bad URLs:
// "repo_url": "https://gerrit.onap.org/r/msb",	<- bad, 404, but recognizable
// "repo_url": "https://gerrit.onap.org/r/sdc",	<- bad, 404, but recognizable
// "repo_url": "https://gerrit.onap.org/r/so",	<- bad, 404, but recognizable
// "repo_url": "https://gerrit.onap.org/r/vfc",	<- bad, 404, but recognizable
// "repo_url": "https://gerrit.onap.org/r/vid",	<- bad, 404, but recognizable
//
// Good URLs:
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/aai/esr-server",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/aai/sparky-fe",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/appc",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/ccsdk",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/clamp",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/cli",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/policy",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/portal",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/sdnc",
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects/vnfsdk",
// "repo_url": "https://git.onap.org/holmes",
// "repo_url": "https://gerrit.onap.org/r/admin/repos/q/filter:cps"

/*
  From a list of Repo URLs, generate an array with the project name as the first element
  and the Repo names as the remaining elements.
*/
var badUrlCount = 0;
function determineProjectAndRepoNamesPats(urlList) {
    var urls = urlList.split(/[\s,]+/);
    var repos = ["UNKNOWN"];

    //// console.log("determineProjectAndRepoNamesPats(", urlList, ")");
    for (var u in urls) {
	var url = urls[u];
	var urlUpper = url.toUpperCase();
	var repo = "UNKNOWN-BADURL";
	for (var up in repoUrlPatterns) {
	    var urlPattern = repoUrlPatterns[up];
	    // console.log("urlPattern=", urlPattern)
	    var ret = url.match(urlPattern);
	    // console.log("ret=", ret);
	    if (ret) {
		repo = ret[1];
		break;
	    }
	}
	repos.push(repo);
    }

    // Figure out the project name from the first repo in the list.
    // "abc/def" => "abc". "wxy" => "wxy".
    var n = repos[1].indexOf("/");
    if (n == -1) {
	repos[0] = repos[1];
    } else {
	repos[0] = repos[1].substring(0, n);
    }
    if (repos[0] == '#') repos[0] = "UNKNOWN-BADURL";
    if (repos[0].endsWith("-BADURL")) {
	repos[0] = repos[0] + badUrlCount;
	badUrlCount++;
    }

    return repos;
}

//// function determineProjectAndRepoNames(urlList) {
////     /* HACK BEGIN */
////     if (urlList == "https://wiki.onap.org/display/DW/Modeling+Project")
//// 	urlList = "https://gerrit.onap.org/r/#/admin/projects/modeling";
////     else if (urlList == "https://gerrit.onap.org/r/admin/repos/policy/parent")
//// 	urlList = "https://gerrit.onap.org/r/#/admin/projects/policy";
////     /* END HACK */
////     var urls = urlList.split(/[\s,]+/);
////     var repos = ["UNKNOWN"];
//// 
////     for (var u in urls) {
//// 	var url = urls[u];
//// 	var urlUpper = url.toUpperCase();
//// 	var repo = "UNKNOWN-BADURL";
//// 	for (var up in repoUrlPrefixes) {
//// 	    var urlPrefix = repoUrlPrefixes[up];
//// 	    var lenPrefix = urlPrefix.length;
//// 	    var urlPrefixUpper = urlPrefix.toUpperCase();
//// 	    var urlUpperStart = urlUpper.substring(0, lenPrefix);
//// 	    if (urlPrefixUpper == urlUpperStart) {
//// 		repo = url.substring(lenPrefix).toLowerCase();
//// 		if (urlPrefixUpper == badRepoUrlPrefix) {
//// 		    repo += "-BADURL";
//// 		} else if (urlPrefixUpper == gitRepoUrlPrefix) {
//// 		    if (repo.endsWith(".git")) {
//// 			repo = repo.substring(0, repo.length-4);
//// 		    } else {
//// 			repo += "-BADURLSUFFIX";
//// 		    }
//// 		}
//// 		break;
//// 	    }
//// 	}
//// 	repos.push(repo);
////     }
//// 
////     // Figure out the project name from the first repo in the list.
////     // "abc/def" => "abc". "wxy" => "wxy".
////     var n = repos[1].indexOf("/");
////     if (n == -1) {
//// 	repos[0] = repos[1];
////     } else {
//// 	repos[0] = repos[1].substring(0, n);
////     }
////     if (repos[0] == '#') repos[0] = "UNKNOWN-BADURL";
////     if (repos[0].endsWith("-BADURL")) {
//// 	repos[0] = repos[0] + badUrlCount;
//// 	badUrlCount++;
////     }
//// 
////     return repos;
//// }

// store the current data into data[]
function pushData(whereTo, whereFrom) {
    $(whereFrom).each(function(index, element) {
        whereTo.push(element);
    });
}

function fillInEditorNames(datad, editorNames, editorList, j) {
    if (editorList.length == 0) {
	whenDone(datad, editorNames);
	return;
    }

    var URL = BASESITE + "en/users/";
    // var URL = "http://tlhansen.us/cgi/cii.cgi/en/users/";
    // var URL = BETABASESITE + "en/users/";
    var URLsuffix = "";
    var editor = editorList[j];
    var dots = [ ".", "..", "...", "...." ];
    watermark("Loading<br/>editors " + (dots[j % 4]));
    // console.log("j=", j);
    // console.log("url=", URL);
    // console.log("editor=", editor);
    // console.log("editorList=", editorList);
    var lastOne = j >= (editorList.length-1);
    // console.log("lastOne=", lastOne);

    $.ajax({
	type: "GET",
	url: URL + editor + ".json",
	data: { "format": "json" },
	success: function(json) {
	    // console.log("ret=", json);
	    if (typeof json == "string") pushData(editorNames, JSON.parse(json));
	    else pushData(editorNames, json);
	    if (json == '') whenDone(datad, editorNames);
	    else if (lastOne) whenDone(datad, editorNames);
	    else fillInEditorNames(datad, editorNames, editorList, j+1);
	},
	error: function(request,error, thrownError) {
	    // alert("Request: "+JSON.stringify(request) + "\n" + "error=" + error + "\n" + "thrownError=" + thrownError);
	    console.log("Request: "+JSON.stringify(request) + "\n" + "error=" + error + "\n" + "thrownError=" + thrownError);
	    whenDone(datad, editorNames);
	}
    });
}

function getEditorList(datad, editorNames) {
    var editorDict = {};
    for (var k in datad) {
	editorDict[datad[k].user_id] = 1;
	for (var ar in datad[k].additional_rights) {
	    editorDict[datad[k].additional_rights[ar]] = 1;
	}
    }
    var keys = [];
    for (var k in editorDict) {
	if (k in knownEditors) {
	    knownEditors[k]["id"] = k;
	    pushData(editorNames, knownEditors[k]);
	} else {
	    keys.push(k);
	}
    }
    // console.log("editor keys that need to be loaded=", keys);
    return keys;
}

function getNextUrl(datad, editorNames, pagelist, j) {
    var lastOne = j == pagelist.length-1;
    var p = pagelist[j];
    var URL = BASEURL;
    // URL = "https://gerrit.onap.org/projects/";
    // alert("URL=" + URL);
    watermark("Loading<br/>projects " + p);

    $.ajax({
	    type: "GET",
	    url: URL,
	    data: { "q": Q, "page": p },
	    success: function(json) {
		// alert("json=",json);
		// console.log("json=", json);
		// if (typeof json == "string") pushData(historicalReleaseData[currentRelease], JSON.parse(json));
		// else pushData(historicalReleaseData[currentRelease], json);
		if (!("current" in historicalReleaseData)) {
		    // console.log("creating historicalReleaseData[" + "current" + "]");
		    historicalReleaseData["current"] = [ ];
		}
		var js;
		if (typeof json == "string") {
		    pushData(datad, JSON.parse(json));
		    // console.log("pushing str to historicalReleaseData[" + "current" + "]<=", JSON.parse(json));
		    js = JSON.parse(json);
		} else {
		    pushData(datad, json);
		    // console.log("pushing json to historicalReleaseData[" + "current" + "]<=", json);
		    js = json;
		}
		for (var jo in js) {
		    historicalReleaseData["current"].push(js[jo]);
		}
		if (lastOne || (json == '')) {
		    fillInEditorNames(datad, editorNames, getEditorList(datad, editorNames), 0);
		} else {
		    getNextUrl(datad, editorNames, pagelist, j+1);
		}
	    },
	    error: function(request,error, thrownError) {
		// alert("Request: "+JSON.stringify(request) + "\n" + "error=" + error + "\n" + "thrownError=" + thrownError);
		console.log("Request: "+JSON.stringify(request) + "\n" + "error=" + error + "\n" + "thrownError=" + thrownError);
		fillInEditorNames(datad, editorNames, getEditorList(datad, editorNames), 0);
	    }
	});
}

function addRankOrder(d) {
    d.sort(function(a,b) { return b.onap_rank - a.onap_rank; });
    var prev = -1;
    var iprev = -1;
    for (var i = 0; i < d.length; i++) {
	if (d[i].onap_rank == prev) {
	    d[i].onap_rank_order = iprev + 1;
	} else {
	    d[i].onap_rank_order = i + 1;
	    prev = d[i].onap_rank;
	    iprev = i;
	}
    }
}

function getProject(data, type, row) {
    if (type !== 'display') return data;
    var ret = "<a target='_blank' rel='noopener noreferrer' href='" + row.repo_url + "'>" + row.onap_project_short + "</a>";
    if (row.onap_project_short == "UNKNOWN")
	ret += (row.onap_badurl ? " <span class='badURL' title='There is no project prefix word in the repo URL that will identify which project this entry belongs to.'>PROJECT NOT IN URL</span>" : "");
    else
	ret += (row.onap_badurl ? " <span class='badURL' title='The given repo URL is invalid and returns a 404 NOT FOUND when visited.'>404 NOT FOUND</span>" : "");
    ret += (row.onap_badurlsuffix ? " <span class='badURL' title='If a git URL is specified for the repo URL, it must have a suffix of .git'>MISSING .git SUFFIX</span>" : "");
    if (row.onap_project_short != "UNKNOWN")
	ret += (row.onap_invalid_project ? (" <span class='badProject' title='The project prefix word (" + row.onap_project_short + ") in the repo URL is not a valid project name.'>UNKNOWN PROJECT PREFIX '" + row.onap_project_short + "' FOUND IN REPO URL</span>") : "");
    return ret;
}

function getAllNames(data, type, row) {
    if (type !== 'display') return data;
    if (row.id == -1) return data;
    var urlPrefix = "<a target='_blank' rel='noopener noreferrer' href='https://bestpractices.coreinfrastructure.org/projects/";
    var urlSuffix = "'>";
    var anchorEnd = '</a>';
    var ret = "<table class='noborder'>";
    ret += "<tr><td class='stats noborder'>" + urlPrefix + row.id + urlSuffix + row.name + anchorEnd + "</td></tr>";
    if (row.hasOwnProperty('otherRepos') && row.otherRepos.length > 0) {
	for (var k in row.otherRepos) {
	    var otherRepo = row.otherRepos[k];
	    ret += "<tr><td class='stats noborder right'>" + blank4 + urlPrefix + otherRepo.id + urlSuffix + otherRepo.name + anchorEnd + "</td></tr>";
	}
    }
    ret += "</table>";
    return ret;
}

function getBadge(txtLeft, txtRight, colorRight) {
    // console.log("txtLeft=" + txtLeft);
    // console.log("txtRight=" + txtRight);
    // console.log("colorRight=" + colorRight);
    return "<svg xmlns='http://www.w3.org/2000/svg' width='204' height='20'>" +
	"  <linearGradient id='b' x2='0' y2='100%'>" +
	"    <stop offset='0' stop-color='#bbb' stop-opacity='.1'/>" +
	"    <stop offset='1' stop-opacity='.1'/>" +
	"  </linearGradient>" +
	"  <mask id='a'>" +
	"    <rect width='204' height='20' rx='3' fill='#fff'/>" +
	"  </mask>" +
	"  <g mask='url(#a)'>" +
	"    <path fill='#555' d='M0 0h103v20H0z'/>" +
	"    <path fill='" + colorRight + "' d='M103 0h101v20H103z'/>" +
	"    <path fill='url(#b)' d='M0 0h204v20H0z'/>" +
	"  </g>" +
	"  <g fill='#fff' text-anchor='middle' font-family='DejaVu Sans,Verdana,Geneva,sans-serif' font-size='11'>" +
	"    <text x='51.5' y='15' fill='#010101' fill-opacity='.3'>" + txtLeft + "</text>" +
	"    <text x='51.5' y='14'>" + txtLeft + "</text>" +
	"    <text x='152.5' y='15' fill='" + colorRight + "' xfill='#010101' fill-opacity='.3'>" + txtRight + "</text>" +
	"    <text x='152.5' y='14'>" + txtRight + "</text>" +
	"  </g>" +
	"</svg>";
}

function resize(id) {
    if ($(".size__" + id).css('font-size') == '24px') {
	$(".size__" + id).css('font-size','8px');
    } else if ($(".size__" + id).css('font-size') == '8px') {
	$(".size__" + id).css('font-size','');
    } else {
	$(".size__" + id).css('font-size','24px');
    }
}

function getAllBadges(data, type, row) {
    if (type !== 'display') return data;
    var urlPrefix = '<img src="https://bestpractices.coreinfrastructure.org/projects/';
    var urlSuffix = '/badge"/>';
    var ret = "<table class='noborder'>";
    if (row.id == 0) {
	ret += "<tr><td class='stats noborder'>";
	if (row.onap_rank == 0) {
	    ret += getBadge("cii best practices", "Not started 0%", "red"); // '<img src="images/cii-not-started.png"/>';
	} else {
	    ret += getBadge("Lowest", row.badge_percentage_0 + "%", getColor(row.badge_percentage_0, row.badge_percentage_1, row.badge_percentage_2));
	}
	ret += "</td></tr>";
    } else {
	ret += "<tr><td class='stats noborder'>" + (urlPrefix + row.id + urlSuffix) + "</td></tr>";
    }
    if (row.hasOwnProperty('otherRepos') && row.otherRepos.length > 0) {
	for (var k in row.otherRepos) {
	    var otherRepo = row.otherRepos[k];
	    ret += "<tr><td class='stats noborder right'>" + blank4 + urlPrefix + otherRepo.id + urlSuffix + "</td></tr>";
	}
    }
    ret += "</table>";
    return ret;
}

function getAllPercentages(data, type, row, num) {
    if (type !== 'display') return data;
    var ret = "<table class='noborder'>";
    ret += "<tr><td class='stats noborder'>" + row["badge_percentage_"+num] + "</td></tr>";
    if (row.hasOwnProperty('otherRepos') && row.otherRepos.length > 0) {
	for (var k in row.otherRepos) {
	    var otherRepo = row.otherRepos[k];
	    ret += "<tr><td class='stats noborder right'>" + otherRepo["badge_percentage_"+num] + "</td></tr>";
	}
    }
    return ret;
}


function genData(project, name, bp0, bp1, bp2) {
    return {
	"repo_url": goodRepoUrlPrefix + project,
	    "onap_project": project,
	    "onap_project_short": project,
	    "name": name,
	    "id": 0,
	    "onap_badge": -1,
	    "onap_rank": 0,
	    "badge_percentage_0": bp0,
	    "badge_percentage_1": bp1,
	    "badge_percentage_2": bp2,
	    "otherRepos": []
	    };
}

function prEditor(data, editorDict) {
    // console.log("data=" + data);
    // console.log("typeof data=" + typeof data);
    var editors = data.toString().split(",");
    var JimBaker = "3607";
    var DavidMcBride = "4469";
    var hasJimBaker = editors.indexOf(JimBaker) > -1;
    var hasDavidMcBride = editors.indexOf(DavidMcBride) > -1;
    var len = editors.length;
    var cl = (hasDavidMcBride && len > 2) ? "met" : (hasJimBaker || len > 1) ? "partial" : "buzz";
    var editorsOut = "";
    var sep = "";
    for (var e in editors) {
	var editor = editors[e];
	var nm = editorDict[editor] ? editorDict[editor] : "Unk";
	editorsOut += sep + "<a target='_blank' rel='noopener noreferrer' href='" + BASESITE + "en/users/" + editor + "' title='" + nm.replace(/['']/g, "&quot;") + "'>" + nm + "</a>";
	sep = "<br/>";
    }
    var ret = "<span class='xxsmall " + cl + "'>" + editorsOut + "</button>";
    return ret;
}

function datacheck() {
    var ret = "";
    var matchedprops = ["onapwide", "section", "type"];
    var allprops = ["onapwide", "section", "required", "type", "description", "details"];
    for (var l = 0; l < badgingColors.length-1; l++) {
        var level = badgingColors[l];
	for (var ciiName in badgeDescriptions[level]) {
	    for (var p in allprops) {
		var prop = allprops[p];
		if (!(prop in badgeDescriptions[level][ciiName])) {
		    ret += ciiName + ": " + prop + " is missing<br/>\n";
		}
	    }

	    if (!("onapwide" in badgeDescriptions[level][ciiName]))
	    if (("Infrastructure" == badgeDescriptions[level][ciiName]["type"]) &&
		!badgeDescriptions[level][ciiName]["onapwide"]) {
		ret += ciiName + ": has the type Infrastructure, but onapwide is not set.<br/>\n";
	    }
	    for (var l2 = l+1; l2 < badgingColors.length; l2++) {
		var level2 = badgingColors[l2];
		if (ciiName in badgeDescriptions[level2]) {
		    for (var p in matchedprops) {
			var prop = matchedprops[p];
			if (badgeDescriptions[level][ciiName][prop] !=
			    badgeDescriptions[level2][ciiName][prop]) {
			    ret += ciiName + ": " + prop + " differs " +
				"- " + level + " " + badgeDescriptions[level][ciiName][prop] +
				"- " + level2 + " " + badgeDescriptions[level2][ciiName][prop] +
				"<br/>\n";
			}
		    }
		}
	    }
	}
    }

    return ret ? ("<h4 class='datacheck'>Datacheck</h4>\n<div class='datacheck'>" + ret + "</div>\n") : ret;
}

function sortColumns(level, newSortBy, anm, bnm) {
    var a = anm["name"];
    var b = bnm["name"];
    var rf = badgeDescriptions[level];
    var atype = rf[a]["type"];
    var btype = rf[b]["type"];
    var asection = rf[a]["section"];
    var bsection = rf[b]["section"];
    var aordinal = rf[a]["ord"];
    var bordinal = rf[b]["ord"];
    var aonapwide = !rf[a]["onapwide"];
    var bonapwide = !rf[b]["onapwide"];
    var acmpnm = newSortBy.startsWith("by_section") ? asection :
	newSortBy.startsWith("by_type") ? atype :
	newSortBy.startsWith("by_onapwide") ? aonapwide :
	newSortBy.startsWith("by_ordinal") ? aordinal :
	"";
    var bcmpnm = newSortBy.startsWith("by_section") ? bsection :
	newSortBy.startsWith("by_type") ? btype :
	newSortBy.startsWith("by_onapwide") ? bonapwide :
	newSortBy.startsWith("by_ordinal") ? bordinal :
	"";
    acmpnm += "_";
    bcmpnm += "_";
    acmpnm += newSortBy.endsWith("section_name") ? asection :
	newSortBy.endsWith("type_name") ? atype : "";
    bcmpnm += newSortBy.endsWith("section_name") ? bsection :
	newSortBy.endsWith("type_name") ? btype : "";
    acmpnm += "_";
    bcmpnm += "_";
    acmpnm += a;
    bcmpnm += b;
    
    // console.log("newSortBy=" + newSortBy, acmpnm + " <=> " + bcmpnm);
    return cmp(acmpnm, bcmpnm);
}

// mixin method to add (level,newSortBy) values to the sort functions on the columns
function sortColoredColumns(level, newSortBy) {
    return function(a,b) {
	return sortColumns(level, newSortBy, a, b);
    }
}

function startSortChange(nm) {

    watermark("Sorting<br/>" + nm.replace(/^by_name$/, "BBBB").replace(/_name$/, "").
	      replace(/[_]/g, " ").replace(/BBBB/, "by name").replace(/^by /, ""));
}

function resort(newSortBy) {
    if (newSortBy == sortBy) {
	watermark("");
	return;
    }

    sortBy = newSortBy;

    var onapwideTitle = { false: "", true: "<br/><br/><sub class='alternateColor_by_onapwide_name'>ONAP-wide response</sub><br/>" };

    for (var l in badgingColors) {
        var level = badgingColors[l];

	// save or figure out where the original names lived
	if (!(("orig_" + level) in requiredNames)) {
	    var olevel = "orig_" + level;
	    requiredNames[olevel] = [];
	    for (var i in requiredNames[level]) {
		requiredNames[olevel].push({ name: requiredNames[level][i]["name"], orig: requiredNames[level][i]["orig"] });
	    }
	    optionalNames[olevel] = [];
	    for (var i in optionalNames[level]) {
		optionalNames[olevel].push({ name: optionalNames[level][i]["name"], orig: optionalNames[level][i]["orig"] });
	    }
	} else {
	    requiredNames[level].length = 0;
	    var olevel = "orig_" + level;
	    for (var i in requiredNames[olevel]) {
		requiredNames[level].push({ name: requiredNames[olevel][i]["name"], orig: requiredNames[olevel][i]["orig"] });
	    }
	    optionalNames[level].length = 0;
	    for (var i in optionalNames[olevel]) {
		optionalNames[level].push({ name: optionalNames[olevel][i]["name"], orig: optionalNames[olevel][i]["orig"] });
	    }
	}

	var requiredSlots = [ ];
	for (var i in requiredNames[level]) {
	    requiredSlots.push(requiredNames[level][i]["orig"]);
	}
	var optionalSlots = [ ];
	for (var i in optionalNames[level]) {
	    optionalSlots.push(optionalNames[level][i]["orig"]);
	}

	// re-sort the columns to the new order
	requiredNames[level].sort(sortColoredColumns(level, newSortBy));
	optionalNames[level].sort(sortColoredColumns(level, newSortBy));

	// get the column order from the table
	var columnOrder = globalTables[level].colReorder.order();

	// update the column order
	for (var i in requiredNames[level]) {
	    columnOrder[requiredSlots[i]] = requiredNames[level][i]["orig"];
	    requiredNames[level][i]["orig"] = columnOrder[requiredSlots[i]];
	}
	for (var i in optionalNames[level]) {
	    columnOrder[optionalSlots[i]] = optionalNames[level][i]["orig"];
	    optionalNames[level][i]["orig"] = columnOrder[optionalSlots[i]];
	}

	// set the new ordering
	globalTables[level].colReorder.order(columnOrder, true);

	// assign appropriate colors to the columns
	var lastSortedType = "";
	var columnColors = [ "primaryColor", "alternateColor" ];
	var onPrimaryColor = 0;
	for (var i in columnOrder) {
	    var ciiName = columnNames[level][columnOrder[i]];
	    if ("fixed" == ciiName) continue;
	    var sortedType =
		(sortBy == "by_name") ? "" :
		(sortBy == "by_section_name") ?
		(badgeDescriptions[level][ciiName]["section"]) :
		(sortBy == "by_type_section_name") ?
		(badgeDescriptions[level][ciiName]["type"] + "_" + badgeDescriptions[level][ciiName]["section"]) :
		(sortBy == "by_section_type_name") ?
		(badgeDescriptions[level][ciiName]["section"] + "_" + badgeDescriptions[level][ciiName]["type"]) :
		(sortBy == "by_ordinal_name") ?
		(badgeDescriptions[level][ciiName]["ord"]) :
		(sortBy == "by_ordinal_type_name") ?
		(badgeDescriptions[level][ciiName]["ord"] + "_" + badgeDescriptions[level][ciiName]["type"]) :
		(sortBy == "by_onapwide_section_name") ?
		(badgeDescriptions[level][ciiName]["onapwide"] + "_" + badgeDescriptions[level][ciiName]["section"]) :
		(sortBy == "by_onapwide_type_name") ?
		(badgeDescriptions[level][ciiName]["onapwide"] + "_" + badgeDescriptions[level][ciiName]["type"]) :
		(sortBy == "by_onapwide_name") ?
		badgeDescriptions[level][ciiName]["onapwide"] :
		/* sortBy == by_type_name */
		(badgeDescriptions[level][ciiName]["type"]);
	    if (sortedType != lastSortedType) {
		onPrimaryColor = 1 - onPrimaryColor;
		lastSortedType = sortedType;
	    }
	    $("." + ciiName + "_header_required").removeClass().addClass("required " + ciiName + "_header_required " + columnColors[onPrimaryColor] + "_" + sortBy);
	    $("." + ciiName + "_header_optional").removeClass().addClass("optional " + ciiName + "_header_optional " + columnColors[onPrimaryColor] + "_" + sortBy);

	    if (sortBy.startsWith("by_type")) {
		var sectionItalic = sortBy.startsWith("by_type_section");
		$("." + ciiName + "_subtitle").html("<br/><sub><i>(" + badgeDescriptions[level][ciiName]["type"] + ")</i></sub>" +
						    "<br/><sub>" + (sectionItalic ? "<i>" : "") + "(" +
						    badgeDescriptions[level][ciiName]["section"] + ")" +
						    (sectionItalic ? "</i>" : "") +
						    "</sub>");
	    } else if (sortBy.startsWith("by_section")) {
		var typeItalic = sortBy.startsWith("by_section_type");
		$("." + ciiName + "_subtitle").html("<br/><sub><i>(" + badgeDescriptions[level][ciiName]["section"] + ")</i></sub>" +
						    "<br/><sub>" + (typeItalic ? "<i>" : "") + "(" +
						    badgeDescriptions[level][ciiName]["type"] + ")" +
						    (typeItalic ? "</i>" : "") +
						    "</sub>");
	    } else if (sortBy.startsWith("by_onapwide_section")) {
		$("." + ciiName + "_subtitle").html(onapwideTitle[badgeDescriptions[level][ciiName]["onapwide"]] +
						    "<br/><sub><i>(" + badgeDescriptions[level][ciiName]["section"] + ")</i></sub>" +
						    "<br/><sub>(" + badgeDescriptions[level][ciiName]["type"] + ")" +
						    "</sub>");
	    } else if (sortBy.startsWith("by_onapwide_type")) {
		$("." + ciiName + "_subtitle").html(onapwideTitle[badgeDescriptions[level][ciiName]["onapwide"]] +
						    "<br/><sub><i>(" + badgeDescriptions[level][ciiName]["type"] + ")</i></sub>" +
						    "<br/><sub>(" + badgeDescriptions[level][ciiName]["section"] + ")" +
						    "</sub>");
	    } else if (sortBy.startsWith("by_onapwide")) {
		$("." + ciiName + "_subtitle").html(onapwideTitle[badgeDescriptions[level][ciiName]["onapwide"]] +
						    "<br/><sub>(" + badgeDescriptions[level][ciiName]["section"] + ")" +
						    "<br/><sub>(" + badgeDescriptions[level][ciiName]["type"] + ")</sub>" +
						    "</sub>");
	    } else {
		$("." + ciiName + "_subtitle").html("<br/><sub>(" + badgeDescriptions[level][ciiName]["section"] + ")</sub>" +
						    "<br/><sub>(" + badgeDescriptions[level][ciiName]["type"] + ")</sub>");
	    }
	}
    }

    watermark("");
}

function containsURL(text) {
    if (!text) return false;
    text = text.toLowerCase();
    return ((text.indexOf("https://") > -1) || (text.indexOf("http://") > -1));
}

function cmp(a,b) {
    return (a == b) ? 0 : (a < b) ? -1 : 1;
}

function addToQuestionsTable(datad, tablename, level, levelcapname, percent, editorDict) {
    var trdataHeaders = "<tr>";
    var nameHeader = "<th class='name'>Name</th>";
    trdataHeaders += nameHeader;
    columnNames[level].push("fixed");
    var columnCount = 1;
    // trdataHeaders += "<th>Project<br/>Prefix</th>";
    trdataHeaders += "<th>Tiered<br/>Percentage</th>";
    columnNames[level].push("fixed");
    columnCount++;
    if (percent !== null) {
	trdataHeaders += "<th>" + levelcapname + " Badge Percentage</th>";
	columnNames[level].push("fixed");
	columnCount++;
    }

    trdataHeaders += "<th>Editors</th>";
    columnNames[level].push("fixed");
    columnCount++;

    var addNameColumn = 3;
    var rf = badgeDescriptions[level];

    var sortedNames = Object.keys(rf);
    sortedNames.sort();

    var allFields = [];
    var optionalFields = {};
    if (percent !== null) {
	// gather all of the required fields together
	var requiredCount = 0, optionalCount = 0;;
	var requiredLocations = { }, optionalLocations = { };
	for (var k in sortedNames) {
	    var ciiName = sortedNames[k];
	    if (rf[ciiName]["required"]) {
		allFields.push(ciiName);
		requiredNames[level].push({ "name": ciiName });
		requiredLocations[ciiName] = requiredCount++;
	    }
	}

	// now gather all of the optional fields together
	for (var k in sortedNames) {
	    var ciiName = sortedNames[k];
	    if (!rf[ciiName]["required"]) {
		allFields.push(ciiName);
		optionalNames[level].push({ "name": ciiName });
		optionalFields[ciiName] = 1;
		optionalLocations[ciiName] = optionalCount++;
	    }
	}

	// create each of the header/footer elements
	var lastSortedType = "";
	var columnColors = [ "primaryColor", "alternateColor" ];
	var onPrimaryColor = 0;
	for (var k in allFields) {
	    var ciiName = allFields[k];
	    var cl = optionalFields[ciiName] ? "optional" : "required";
	    if (optionalFields[ciiName]) {
		optionalNames[level][optionalLocations[ciiName]]["orig"] = columnCount;
	    } else {
		requiredNames[level][requiredLocations[ciiName]]["orig"] = columnCount;
	    }

	    var projectLevelClass = badgeDescriptions[level][ciiName]["onapwide"] ? "projectLevel" : "";

	    trdataHeaders += "<th class='" + cl + " " +
		ciiName + "_header_" + cl + "'>" +
		"<span class='" + cl + "' title='" +
		"[" + ciiName + "] " +
		badgeDescriptions[level][ciiName]["description"].replace(/['']/g, "&quot;") +
		"'>" +
		ciiName.replace(/_/g," ").
		replace(/(\W+|^)(.)/ig,
			function(match, chr) { return match.toUpperCase(); }) +
		"</span>" +
		"<span class='" + ciiName + "_subtitle'></span>";

	    columnNames[level].push(ciiName);
	    columnCount++;

	    trdataHeaders +=
		"</span>" +
		"<span class='" + cl + " " + level + "_detail_span " + projectLevelClass + "'><br/><br/>" +
		"[" + ciiName + "]<br/>" +
		badgeDescriptions[level][ciiName]["description"].replace(/['']/g, "&quot;") +
		"<sub>" +
		(badgeDescriptions[level][ciiName]["details"] ? "<br/><br/>&laquo;details&raquo;<br/>" : "") +
		 badgeDescriptions[level][ciiName]["details"].replace(/['']/g, "&quot;") +
		"</sub>" +
		(badgeDescriptions[level][ciiName]["onapwide"] ? "<br/><br/><sup class='alternateColor_by_onapwide_name'>ONAP-wide response</sup>" : "") +
		"</span>" +
		"<span class='" + level + "_show_metstats_detail_span'><span class='metstats_" + level + "_" + ciiName + "'></span></span>" +
		"</th>";
	    if (++addNameColumn % 10 == 0) {
		trdataHeaders += nameHeader;
		columnNames[level].push("fixed");
		columnCount++;
	    }
	}
    }

    var addLastNameColumn = !trdataHeaders.endsWith(nameHeader);
    if (addLastNameColumn) {
	trdataHeaders += nameHeader;
	columnNames[level].push("fixed");
	columnCount++;
    }
    trdataHeaders += "</tr>";
    $('#' + tablename).append("<thead>" + trdataHeaders + "</thead>" +
			      "<tfoot>" + trdataHeaders + "</tfoot>");

    var columns = [ ];
    addNameColumn = 3;

    columns.push({ "data": "name", "render": function ( data, type, row, meta ) {
		return "<span style='float: right'><img src='images/updown-7x7.png' class='clickable_image' " +
		    "onclick='resize(" + row['id'] + ")'" +
		    "/></span><span class='size__" + row['id'] +
		    "'><a target='_blank' rel='noopener noreferrer' href='https://bestpractices.coreinfrastructure.org/projects/" +
		    row['id'] + "'>" + data + "</a></span>";
	    }
	});

    columns.push({ "data": "tiered_percentage", "render": function ( data, type, row, meta ) {
		var color = getTieredColor(data);
		var textcolor = (color == gold) ? black : (color == silver) ? black : white;
		return "<span class='size__" + row['id'] + "' style='color: " + textcolor + "; background-color: " + color + "'>" + data + "</span>";
	    }
	});

    if (percent !== null) {
	columns.push({ "data": "badge_percentage_" + percent, "render": function ( data, type, row, meta ) {
		    return "<span class='size__" + row['id'] + "'>" + data + "</span>";
		}
	    });
    }

    columns.push({ "data": "editors", "render": function ( data, type, row, meta ) {
		return "<span class='size__" + row['id'] + "'>" + prEditor(data, editorDict) + "</span>";
	    }
	});

    if (percent !== null) {
	for (var k in allFields) {
	    var ciiName = allFields[k];
	    columns.push({ "data": ciiName + "_status",
			"name": ciiName,
			"render":
			function ( data, type, row, meta ) {
		        var statusName = meta.settings.aoColumns[meta.col].data;
			var fieldName = meta.settings.aoColumns[meta.col].name;
			var optionalClass = optionalFields[fieldName] ? "optional" : "";
			var classVal = /* optionalClass + */'na';
			var projectLevelClass = badgeDescriptions[level][fieldName]["onapwide"] ? "projectLevel" : "";
			var justificationName = fieldName + "_justification";
			var urlRequired = badgeDescriptions[level][fieldName]["description"].indexOf("(URL required)") >= 0;
			var hasUrl = (justificationName in row) && containsURL(row[justificationName]);
			if (data.toLowerCase() == "met") {
			    if (urlRequired && hasUrl) classVal = 'met';
			    else if (!urlRequired) classVal = 'met';
			    else classVal = 'needsUrl';
			} else if (data.toLowerCase() == "unmet") classVal = 'unmet';
			else if (data.toLowerCase() == "?") classVal = 'question';
			var justification = row[justificationName];
			var detailIdButton = "button__" + statusName + "__" + row['id'];
			var detailClass = "detail__" + statusName + "__" + row['id'];
			var detailIdSpan = "detail__" + statusName + "__" + row['id'];
			var ret = "<div style='height: 100%; width: 100%; ' class='" + optionalClass + " size__" + row['id'] + "'>" +
			    "<button id='" + detailIdButton + "' class='" + classVal + " " + projectLevelClass + " xclickable_text size__" + row['id'] + "' title=\"";
			ret += (fieldName in badgeDescriptions[level]) ? ("[" + fieldName + "]\n" + badgeDescriptions[level][fieldName]["description"].replace(/['']/g, "&quot;") + "\n") : "--\n";
			var status = "";
			status += (fieldName in row) ? (row[fieldName] + "\n") : "\n"; // ".(fieldname).\n";
			status += (statusName in row) ? (row[statusName] + "\n") : "\n"; // ".(statusname).\n";
			status += (justificationName in row) ? ((row[justificationName]) ? (row[justificationName] + "\n") : "\n") : "\n"; // ".(justifictionname).\n";
			ret += status;
			var statusbr = "";
			statusbr += (fieldName in row) ? (row[fieldName] + "<br/>") : "<br/>"; // ".(fieldname).<br/>";
			statusbr += (justificationName in row) ? ((row[justificationName]) ? (row[justificationName] + "<br/>") : "<br/>") : "<br/>"; // ".(justifictionname).<br/>";
			ret += "\" onclick='flipVisibility(\"#" + detailIdSpan + "\")'>";
			if (classVal == "needsUrl")
			    ret += "Needs URL";
			else
			    ret += data;
			ret += "</button>";
			// ret += "detailIdButton=" + detailIdButton + ", detailClass=" + detailClass;
			ret += "<span id='" + detailIdSpan + "' class='" + level + "_detail_span" + " " + detailClass + "'><br/><br/>" + statusbr + "</span>" + "</div>";
			return ret;
		    }
		});

	    if (++addNameColumn % 10 == 0)
		columns.push({ "data": "name", "render": function ( data, type, row, meta ) {
			    return "<span style='float: right'><img src='images/updown-7x7.png' class='clickable_image' " +
				"onclick='resize(" + row['id'] + ")'" +
				"/></span><span class='size__" + row['id'] +
				"'><a target='_blank' rel='noopener noreferrer' href='https://bestpractices.coreinfrastructure.org/projects/" +
				row['id'] + "'>" + data + "</a></span>";
			}
		    });
	}

	if (addLastNameColumn)
	    columns.push({ "data": "name", "render": function ( data, type, row, meta ) {
			return "<span style='float: right'><img src='images/updown-7x7.png' class='clickable_image' " +
			    "onclick='resize(" + row['id'] + ")'" +
			    "/></span><span class='size__" + row['id'] +
			    "'><a target='_blank' rel='noopener noreferrer' href='https://bestpractices.coreinfrastructure.org/projects/" +
			    row['id'] + "'>" + data + "</a></span>";
		    }
		});
    }

    var datatableButtons = [ "pageLength" ];

    // Experiment with sorting the data before building the table to see if we can get the headers to immediately scroll.
    //console.log("datad=", datad);
    //datad.sort(function(a,b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });
    //console.log("sorted datad=", datad);

    globalTables[level] =
	$('#' + tablename).DataTable({
	    "colReorder": true,
	    // "fixedHeader": { "footer": false, "header": true },
	    "fixedHeader": true,
		"data": datad,
		"aaSorting": [[ 0, "asc" ]],
		// fixedHeader: true,
		"paging": true,
		"pagingType": "full_numbers",
		"pageLength": parseInt(parms.get("pagelength", "50")),
		"info": false,
		"dom": "Bfrtip",
		lengthMenu: [
			     [ 10, 20, 25, 50, 100, -1 ],
			     [ '10 rows', '20 rows', '25 rows', '50 rows', '100 rows', 'Show all' ]
			     ],
		"searching": true,
		"autoWidth": false,
		"buttons": datatableButtons,
		"columns": columns,
		"initComplete": function(settings, json) {
		// console.log("table for " + level + " done");
		//		for (var k in allFields) {
		//		    var statusName = allFields[k];
		//		    for (var r in datad) {
		//			var detailIdButton = "#button__" + statusName + "__" + datad[r].id;
		//			var detailIdClass = ".detail__" + statusName + "__" + datad[r].id;
		//			console.log("detailIdButton=" + detailIdButton + ", detailIdClass=" + detailIdClass);
		//			$(detailIdButton).click(function(){ console.log("clicking " + detailIdButton + " for " + detailIdClass);
		//				$(detailIdClass).each(flipThisVisibility); });
		//			console.dir($(detailIdButton));
		//		    }
		//		}
	    }
	});

    // add in the per-requirement statistics
    for (var k in allFields) {
	var ciiName = allFields[k];
	var urlRequired = badgeDescriptions[level][ciiName]["description"].indexOf("(URL required)") >= 0;
	// console.log("ciiName=", ciiName);
	var met = 0, needsUrl = 0, unmet = 0, question = 0, na = 0, unknown = 0;
	for (var i in datad) {
	    var row = datad[i];
	    var status = row[ciiName+"_status"].toLowerCase();
	    var justificationName = ciiName + "_justification";
	    var hasUrl = (justificationName in row) && containsURL(row[justificationName]);
	    if (status == "met") {
		if (urlRequired && hasUrl) met += 1;
		else if (!urlRequired) met += 1;
		else needsUrl += 1;
	    } else if (status == "unmet") unmet += 1;
	    else if (status == "?") question += 1;
	    else if (status == "n/a") na += 1;
	    else {
		unknown += 1;
		console.log("UNKNOWN: ciiName=", ciiName, "status=", status, "urlRequired=", urlRequired, "hasUrl=", hasUrl);
	    }
	}
	$('.metstats_' + level + "_" + ciiName).append((met ? "<div class='left'><button class='met'>Met</button>&nbsp;" + met : "</div>") +
						       (na ? "<div class='left'><button class='na'>NA</button>&nbsp;" + na : "</div>") +
						       (unmet ? "<div class='left'><button class='unmet'>Unmet</button>&nbsp;" + unmet : "</div>") +
						       (needsUrl ? "<div class='left'><button class='needsUrl'>NeedsUrl</button>&nbsp;" + needsUrl : "</div>") +
						       (question ? "<div class='left'><button class='question'>?</button>&nbsp;" + question : "</div>") +
						       (unknown ? "<div class='left'><button class='badProject'>?</button>" : "</div>"));
    }

}

function whenDone(datad, editorNames) {
    watermark("Processing");
    var editorDict = { };
    for (var k in editorNames) {
	if (editorNames[k].name && editorNames[k].name != '')
	    editorDict[editorNames[k].id] = editorNames[k].name;
	else if (editorNames[k].nickname && editorNames[k].nickname != '')
	    editorDict[editorNames[k].id] = editorNames[k].nickname;
	else
	    editorDict[editorNames[k].id] = "unknown";
    }

    addReleasesAndBadgingLevelsToTable();
    for (var k in datad) {
	//// var projectAndRepos = determineProjectAndRepoNames(datad[k].repo_url);
	//// var projectAndReposPats = determineProjectAndRepoNamesPats(datad[k].repo_url);
	//// console.log("projectAndRepos=", projectAndRepos);
	//// console.log("projectAndReposPats=", projectAndReposPats);
	var projectAndRepos = determineProjectAndRepoNamesPats(datad[k].repo_url);
	// repo_url_status is not provided
	// https://github.com/coreinfrastructure/best-practices-badge/issues/1370
	if (!("repo_url_status" in datad[k])) {
	    datad[k]["repo_url_status"] = ("" == datad[k].repo_url) ? "?" :
		containsURL(datad[k].repo_url) ? "Met" : "Unmet";
	}
	// implementation_languages_status is not provided
	if (!("implementation_languages_status" in datad[k])) {
	    datad[k]["implementation_languages_status"] = ("" == datad[k].implementation_languages) ? "?" : "Met";
	}
	// homepage_url_status is always set to "?"
	// https://github.com/coreinfrastructure/best-practices-badge/issues/1369
	if ("?" == datad[k].homepage_url_status) {
	    datad[k]["homepage_url_status"] = ("" == datad[k].homepage_url) ? "?" :
		containsURL(datad[k].homepage_url) ? "Met" : "Unmet";
	}
	var project = projectAndRepos[0];
	datad[k].onap_project = project;
	var n = datad[k].onap_project.indexOf("-BADURL");
	if (n != -1) project = project.substring(0, n);
	datad[k].onap_project_short = project;
	datad[k].onap_badurl = (n != -1);
	datad[k].onap_badurlsuffix = (datad[k].onap_project.indexOf("-BADURLSUFFIX") != -1);
	datad[k].onap_repos = projectAndRepos.shift();
	datad[k].onap_invalid_project = !allOnapProjects[currentRelease].hasOwnProperty(project);
	datad[k].editors = datad[k].user_id;
        for (var ar in datad[k].additional_rights) {
	    if (datad[k].additional_rights[ar] != datad[k].user_id)
		datad[k].editors = datad[k].editors + "," + datad[k].additional_rights[ar];
	}
    }
    datad.sort(function(a, b) {
	    var ap = a.onap_project.toUpperCase();
	    var bp = b.onap_project.toUpperCase();
	    return ap > bp ? 1 : bp > ap ? -1 : 0;
	});

    var dataTable = [ ];

    function updateData(d) {
	var leastBP0 = 101;
	var leastBP1 = 101;
	var leastBP2 = 101;
	var leastRank = generateRank(leastBP0,leastBP1,leastBP2);
	for (var o in d.otherRepos) {
	    if (d.otherRepos[o].onap_rank < leastRank) {
		leastRank = d.otherRepos[o].onap_rank;
		leastBP0 = d.otherRepos[o].badge_percentage_0;
		leastBP1 = d.otherRepos[o].badge_percentage_1;
		leastBP2 = d.otherRepos[o].badge_percentage_2;
	    }
	}
	d.onap_rank = leastRank;
	d.badge_percentage_0 = leastBP0;
	d.badge_percentage_1 = leastBP1;
	d.badge_percentage_2 = leastBP2;
    }

    // Move the additional repo information for a project into an element called otherRepos.
    // At the end of this, all data is in dataTable instead of datad.
    var prevProject = "";
    for (var k in datad) {
	datad[k].onap_rank = generateRank(datad[k].badge_percentage_0, datad[k].badge_percentage_1, datad[k].badge_percentage_2);
	if (datad[k].onap_project == prevProject) {
	    // We have a project the same as the previous one.
	    // Rearrange the previous one
	    var dl1 = dataTable.length-1;
	    if (dataTable[dl1].otherRepos.length == 0) {
		var sv = dataTable[dl1];
		dataTable[dl1] = genData(sv.onap_project, "Lowest Score", 0, 0, 0);
		dataTable[dl1].otherRepos.push(sv);
	    }
	    dataTable[dl1].otherRepos.push(datad[k]);
	    updateData(dataTable[dl1]);
	} else {
	    datad[k].otherRepos = [];
	    dataTable.push(datad[k]);
	}
	prevProject = datad[k].onap_project;
    }

    // For each element in dataTable:
    //   1) add the onap_badge element
    //   2) add the onap_rank, based on the badge percentages
    //   3) TODO: if there is more than one repo involved, set a composite score to the lowest of the repos.
    $(dataTable).each(function(index, element) {
	    element.onap_badge = element.id;
	    if (allOnapProjects[currentRelease].hasOwnProperty(element.onap_project_short))
		allOnapProjects[currentRelease][element.onap_project_short].seen = "y";
	});

    for (var project in allOnapProjects[currentRelease]) {
	var element = allOnapProjects[currentRelease][project];
	if ((element.seen == "n") && (!element.skip && !parms.get("skipnotstarted", false))) {
	    dataTable.push(genData(project, project, 0, 0, 0));
	}
    }

    // now that we have a ranking, add the rank order
    addRankOrder(dataTable);

    var datatableButtons = [ "pageLength" ];

    $('#trprojects').DataTable({
	"data": dataTable,
	// "fixedHeader": true,
		// "aaSorting": [[ 0, "asc" ]],
		"paging": true,
		"pagingType": "full_numbers",
		"pageLength": parseInt(parms.get("pagelength", "30")),
		"info": false,
		"dom": "Bfrtip",
		lengthMenu: [
			     [ 10, 20, 25, 50, 100, -1 ],
			     [ '10 rows', '20 rows', '25 rows', '50 rows', '100 rows', 'Show all' ]
			     ],
		"searching": true,
		"autoWidth": false,
		"buttons": datatableButtons,
		"columns": [
			    { "data": "onap_rank_order", className: "textright",
				    "render": function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; }
			    },
			    { "data": "onap_project", "render": function ( data, type, row, meta ) { return getProject(data, type, row); } },
			    { "data": "name", "render": function ( data, type, row, meta ) { return getAllNames(data, type, row); } },
			    { "data": "onap_badge", "render": function ( data, type, row, meta ) { return getAllBadges(data, type, row); } },
			    { "data": "badge_percentage_0", "render": function ( data, type, row, meta ) { return getAllPercentages(data, type, row,"0"); } },
			    { "data": "badge_percentage_1", "render": function ( data, type, row, meta ) { return getAllPercentages(data, type, row,"1"); } },
			    { "data": "badge_percentage_2", "render": function ( data, type, row, meta ) { return getAllPercentages(data, type, row,"2"); } },
			    ]
		});


    addToQuestionsTable(datad, 'trbronze', 'bronze', 'Passing', '0', editorDict);
    addToQuestionsTable(datad, 'trsilver', 'silver', 'Silver', '1', editorDict);
    addToQuestionsTable(datad, 'trgold', 'gold', 'Gold', '2', editorDict);

    $(".requirements_toggle").click(function(){ $(".requirements_span").each(flipThisVisibility); });
    $(".summary_toggle").click(function(){ $(".summary_span").each(flipThisVisibility); });
    $(".projects_toggle").click(function(){ $(".projects_span").each(flipThisVisibility); });
    $(".bronze_toggle").click(function(){ $(".bronze_span").each(flipThisVisibility); });
    $(".silver_toggle").click(function(){ $(".silver_span").each(flipThisVisibility); });
    $(".gold_toggle").click(function(){ $(".gold_span").each(flipThisVisibility); });
    $(".releasestats_toggle").click(function(){ $(".releasestats_span").each(flipThisVisibility); });

    $(".bronze_detail_toggle").click(function(){ $(".bronze_detail_span").each(flipThisVisibility); });
    $(".silver_detail_toggle").click(function(){ $(".silver_detail_span").each(flipThisVisibility); });
    $(".gold_detail_toggle").click(function(){ $(".gold_detail_span").each(flipThisVisibility); });

    $(".bronze_detail_display_all").click(function(){ $(".bronze_detail_span").each(makeVisible); });
    $(".bronze_detail_display_none").click(function(){ $(".bronze_detail_span").each(makeInvisible); });

    $(".bronze_show_metstats_toggle").click(function(){ $(".bronze_show_metstats_detail_span").each(flipThisVisibility); });
    $(".silver_show_metstats_toggle").click(function(){ $(".silver_show_metstats_detail_span").each(flipThisVisibility); });
    $(".gold_show_metstats_toggle").click(function(){ $(".gold_show_metstats_detail_span").each(flipThisVisibility); });
    $(".sortby_detail_toggle").click(function(){ $(".sortby_detail_span").each(flipThisVisibility); });

    $("#sort_by_name").click(function(){ resort("by_name"); });
    $("#sort_by_section_name").click(function(){ resort("by_section_name"); });
    $("#sort_by_section_type_name").click(function(){ resort("by_section_type_name"); });
    $("#sort_by_type_name").click(function(){ resort("by_type_name"); });
    $("#sort_by_type_section_name").click(function(){ resort("by_type_section_name"); });
    $("#sort_by_ordinal_name").click(function(){ resort("by_ordinal_name"); });
    $("#sort_by_ordinal_type_name").click(function(){ resort("by_ordinal_type_name"); });
    $("#sort_by_onapwide_name").click(function(){ resort("by_onapwide_name"); });
    $("#sort_by_onapwide_section_name").click(function(){ resort("by_onapwide_section_name"); });
    $("#sort_by_onapwide_type_name").click(function(){ resort("by_onapwide_type_name"); });
    $("#sort_by_name").mousedown(function(){ startSortChange("by_name"); });
    $("#sort_by_section_name").mousedown(function(){ startSortChange("by_section_name"); });
    $("#sort_by_section_type_name").mousedown(function(){ startSortChange("by_section_type_name"); });
    $("#sort_by_type_name").mousedown(function(){ startSortChange("by_type_name"); });
    $("#sort_by_type_section_name").mousedown(function(){ startSortChange("by_type_section_name"); });
    $("#sort_by_ordinal_name").mousedown(function(){ startSortChange("by_ordinal_name"); });
    $("#sort_by_ordinal_type_name").mousedown(function(){ startSortChange("by_ordinal_type_name"); });
    $("#sort_by_onapwide_name").mousedown(function(){ startSortChange("by_onapwide_name"); });
    $("#sort_by_onapwide_section_name").mousedown(function(){ startSortChange("by_onapwide_section_name"); });
    $("#sort_by_onapwide_type_name").mousedown(function(){ startSortChange("by_onapwide_type_name"); });
    $("#survey_descriptions").mousedown(function(){ surveyDescriptions(); });

    // TODO -- this does not work
    // $('remove-not-started-button').click(function(){
    //	    window.location.search = parms.getParmListWith("skipnotstarted=1");
    //	});
    // $('add-not-started-button').href = parms.getParmListWithout("skipnotstarted");
    // if (parms.get("skipnotstarted", false)) $('#keepnotstarted').show();
    // else $('#skipnotstarted').show();

    var passingCount = 0; var silverCount = 0; var goldCount = 0;
    var nonPassingCount = 0; var nonSilverCount = 0; var nonGoldCount = 0;
    var passing80Count = 0; var silver80Count = 0; var gold80Count = 0;
    var totalCount = dataTable.length;

    var passingMinusCount = 0; var silverMinusCount = 0; var goldMinusCount = 0;
    var nonPassingMinusCount = 0; var nonSilverMinusCount = 0; var nonGoldMinusCount = 0;
    var passing80MinusCount = 0; var silver80MinusCount = 0; var gold80MinusCount = 0;
    var totalCount = dataTable.length;

    $(dataTable).each(function(index, element) {
	    if (element.badge_percentage_0 == 100) passingCount++;
	    else { nonPassingCount++; if (element.badge_percentage_0 >= 80) { passing80Count++; } }
	    if (element.badge_percentage_1 == 100) silverCount++;
	    else { nonSilverCount++; if ((element.badge_percentage_0 == 100) && (element.badge_percentage_1 >= 80)) { silver80Count++; } }
	    if (element.badge_percentage_2 == 100) goldCount++;
	    else { nonGoldCount++; if ((element.badge_percentage_1 == 100) && (element.badge_percentage_2 >= 80)) { gold80Count++; } }
	    // level 1-, 2-, 3-
	    if (element.badge_percentage_0 >= 95) passingMinusCount++;
	    else { nonPassingMinusCount++; if (element.badge_percentage_0 >= 80) { passing80MinusCount++; } }
	    if (element.badge_percentage_1 >= 95) silverMinusCount++;
	    else { nonSilverMinusCount++; if ((element.badge_percentage_0 == 100) && (element.badge_percentage_1 >= 80)) { silver80MinusCount++; } }
	    if (element.badge_percentage_2 >= 95) goldMinusCount++;
	    else { nonGoldMinusCount++; if ((element.badge_percentage_1 == 100) && (element.badge_percentage_2 >= 80)) { gold80MinusCount++; } }
	});

    var passing80Percentage = (nonPassingCount > 0) ? (100 * passing80Count / nonPassingCount) : 0;
    var passing80Needed = (nonPassingCount > 0) ? Math.ceil(0.80 * nonPassingCount) : 0;
    var silver80Percentage = (nonSilverCount > 0) ? (100 * silver80Count / nonSilverCount) : 0;
    var gold80Percentage = (nonGoldCount > 0) ? (100 * gold80Count / nonGoldCount) : 0;

    var passing80MinusPercentage = (nonPassingMinusCount > 0) ? (100 * passing80MinusCount / nonPassingMinusCount) : 0;
    var passing80MinusNeeded = (nonPassingMinusCount > 0) ? Math.ceil(0.80 * nonPassingMinusCount) : 0;
    var silver80MinusPercentage = (nonSilverMinusCount > 0) ? (100 * silver80MinusCount / nonSilverMinusCount) : 0;
    var gold80MinusPercentage = (nonGoldMinusCount > 0) ? (100 * gold80MinusCount / nonGoldMinusCount) : 0;

    $('#non-passing-level-1').html(passing80Percentage.toFixed(2));
    $('#non-passing-level-2').html(silver80Percentage.toFixed(2));
    $('#non-passing-level-3').html(gold80Percentage.toFixed(2));

    $('#non-passing-level-minus-1').html(passing80MinusPercentage.toFixed(2));
    $('#non-passing-level-minus-2').html(silver80MinusPercentage.toFixed(2));
    $('#non-passing-level-minus-3').html(gold80MinusPercentage.toFixed(2));

    var passingPercentage = (100 * passingCount / totalCount);
    var passingNeeded = Math.ceil(0.70 * totalCount);
    var silverPercentage = (100 * silverCount / totalCount);
    var goldPercentage = (100 * goldCount / totalCount);

    var passingMinusPercentage = (100 * passingMinusCount / totalCount);
    var passingMinusNeeded = Math.ceil(0.70 * totalCount);
    var silverMinusPercentage = (100 * silverMinusCount / totalCount);
    var goldMinusPercentage = (100 * goldMinusCount / totalCount);

    var color = getColor(passingPercentage, silverPercentage, goldPercentage);

    $('#passing-level-1').html(passingPercentage.toFixed(2));
    $('#passing-level-2').html(silverPercentage.toFixed(2));
    $('#passing-level-3').html(goldPercentage.toFixed(2));

    $('#passing-level-minus-1').html(passingMinusPercentage.toFixed(2));
    $('#passing-level-minus-2').html(silverMinusPercentage.toFixed(2));
    $('#passing-level-minus-3').html(goldMinusPercentage.toFixed(2));

    var showOneMinus = 1; // parms.get("showminus", false);

    var level = "0";
    if (showOneMinus) if ((passingMinusPercentage >= 70) && ((nonPassingMinusCount == 0) || (passing80MinusPercentage >= 80))) { level = "1-minus"; }
    if ((passingPercentage >= 70) && ((nonPassingCount == 0) || (passing80Percentage >= 80))) { level = "1"; }
    if (showOneMinus) if ((silverMinusPercentage >= 70) && ((nonSilverMinusCount == 0) || (silver80MinusPercentage >= 80))) { level = "2-minus"; }
    if ((silverPercentage >= 70) && ((nonSilverCount == 0) || (silver80Percentage >= 80))) { level = "2"; }
    if (showOneMinus) if ((goldMinusPercentage >= 70) && ((nonGoldMinusCount == 0) || (gold80MinusPercentage >= 80))) { level = "3-minus"; }
    if ((goldPercentage >= 70) && ((nonGoldCount == 0) || (gold80Percentage >= 80))) { level = "3"; }
    if (goldPercentage == 100) { level = 4; }

    $('#trsummary').append(
		     "<thead><tr>" +
		     "<th>&nbsp;</th>" +
		     "<th>Passing</th>" +
		     "<th>Silver</th>" +
		     "<th>Gold</th>" +
		     "</tr></thead>"
		     );

    if (showOneMinus)
	$('#level1minus').show();

    if (showOneMinus)
	$('#trsummary').append(
		     "<tr>" +
		     "<th class='minus'>Projects &ge; 95%</th>" +
		     "<td class='minus textright'>" +
		     "<table class='noborder right'><tr><td class='noborder'>" +
		     passingMinusCount +
		     "&nbsp;/&nbsp;" + totalCount +
		     "&nbsp;=&nbsp;" + passingMinusPercentage.toFixed(2) + "% " +
 		     "<br/>" +
		     "(" + passingMinusNeeded + " needed for 70%)" +
		     "</td><td class='noborder'>" +
		     (((color == silver) || (color == gold)) ? "<img src='images/checkmark.png'/>" :
		      ((passingMinusPercentage >= 70) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>")) +
		     "</td></tr></table>" +
		     "</td>" +
		     "<td class='minus textright'>" + silverMinusCount +
		     "&nbsp;/&nbsp;" + totalCount +
		     "&nbsp;=&nbsp;" + silverMinusPercentage.toFixed(2) + "% " +
		     ((color == silver) ? "<img src='images/checkmark.png'/>" :
		      (color == green) ? ((silverMinusPercentage >= 80) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>") : "") +
		     "</td>" +
		     "<td class='minus textright'>" + goldMinusCount +
		     "&nbsp;/&nbsp;" + totalCount +
		     "&nbsp;=&nbsp;" + goldMinusPercentage.toFixed(2) + "% " +
		     ((color == gold) ? "<img src='images/checkmark.png'/>" :
		      (color == silver) ? ((goldMinusPercentage >= 80) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>") :
		      "") +
		     "</td>" + "</tr>"
		     );

    if (showOneMinus)
        $('#trsummary').append(
		     "<tr>" +
		     "<th class='minus'>Projects &ge;80%/&lt;95%</th>" +
		     "<td class='minus textright'>" +
		     "<table class='noborder right'><tr><td class='noborder'>" +
		     passing80MinusCount +
		     "&nbsp;/&nbsp;(&nbsp;" + totalCount +
		     "&nbsp;&ndash;&nbsp;" + passingMinusCount +
		     "&nbsp;)&nbsp;=&nbsp;" + passing80MinusPercentage.toFixed(2) + "% " +
 		     "<br/>" +
		     "(" + passing80MinusNeeded + " of " + (totalCount - passingMinusCount) + " needed for 80%)" +
		     "</td><td class='noborder'>" +
		     (((color == silver) || (color == gold)) ? "<img src='images/checkmark.png'/>" :
		      ((passing80MinusPercentage >= 80) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>")) +
		     "</td></tr></table>" +
		     "</td>" +
		     "<td class='minus textright'>" + silver80MinusCount + "&nbsp;/&nbsp;" + nonSilverMinusCount +
		     "&nbsp;=&nbsp;" + silver80MinusPercentage.toFixed(2) + "%" +
		     ((color == silver) ? "<img src='images/checkmark.png'/>" :
		      (color == green) ? ((silver80MinusPercentage >= 80) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>") : "") +
		     "</td>" +
		     "<td class='minus textright'>" + gold80MinusCount + "&nbsp;/&nbsp;" + nonGoldMinusCount +
		     "&nbsp;=&nbsp;" + gold80MinusPercentage.toFixed(2) + "%" +
		     ((color == gold) ? "<img src='images/checkmark.png'/>" :
		      (color == silver) ? ((gold80MinusPercentage >= 80) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>") :
		      "") +
		     "</td>" +
		     "</tr>"
		     );

    $('#trsummary').append(
		     "<tr>" +
		     "<th>Projects at 100%</th>" +
		     "<td class='textright'>" +
		     "<table class='noborder right'><tr><td class='noborder'>" +
		     passingCount +
		     "&nbsp;/&nbsp;" + totalCount +
		     "&nbsp;=&nbsp;" + passingPercentage.toFixed(2) + "% " +
 		     "<br/>" +
		     "(" + passingNeeded + " needed for 70%)" +
		     "</td><td class='noborder'>" +
		     (((color == silver) || (color == gold)) ? "<img src='images/checkmark.png'/>" :
		      ((passingPercentage >= 80) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>")) +
		     "</td></tr></table>" +
		     "</td>" +
		     "<td class='textright'>" + silverCount +
		     "&nbsp;/&nbsp;" + totalCount +
		     "&nbsp;=&nbsp;" + silverPercentage.toFixed(2) + "% " +
		     ((color == silver) ? "<img src='images/checkmark.png'/>" :
		      (color == green) ? ((silverPercentage >= 80) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>") : "") +
		     "</td>" +
		     "<td class='textright'>" + goldCount +
		     "&nbsp;/&nbsp;" + totalCount +
		     "&nbsp;=&nbsp;" + goldPercentage.toFixed(2) + "% " +
		     ((color == gold) ? "<img src='images/checkmark.png'/>" :
		      (color == silver) ? ((goldPercentage >= 80) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>") :
		      "") +
		     "</td>" + "</tr>"
		     );

    $('#trsummary').append(
		     "<tr>" +
		     "<th>Projects &ge;80%/&lt;100%</th>" +
		     "<td class='textright'>" +
		     "<table class='noborder right'><tr><td class='noborder'>" +
		     passing80Count +
		     "&nbsp;/&nbsp;(&nbsp;" + totalCount +
		     "&nbsp;&ndash;&nbsp;" + passingCount +
		     "&nbsp;)&nbsp;=&nbsp;" + passing80Percentage.toFixed(2) + "% " +
 		     "<br/>" +
		     "(" + passing80Needed + " of " + (totalCount - passingCount) + " needed for 80%)" +
		     "</td><td class='noborder'>" +
		     (((color == silver) || (color == gold)) ? "<img src='images/checkmark.png'/>" :
		      ((passing80Percentage >= 70) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>")) +
		     "</td></tr></table>" +
		     "</td>" +
		     "<td class='textright'>" + silver80Count + "&nbsp;/&nbsp;" + nonSilverCount +
		     "&nbsp;=&nbsp;" + silver80Percentage.toFixed(2) + "%" +
		     ((color == silver) ? "<img src='images/checkmark.png'/>" :
		      (color == green) ? ((silver80Percentage >= 70) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>") : "") +
		     "</td>" +
		     "<td class='textright'>" + gold80Count + "&nbsp;/&nbsp;" + nonGoldCount +
		     "&nbsp;=&nbsp;" + gold80Percentage.toFixed(2) + "%" +
		     ((color == gold) ? "<img src='images/checkmark.png'/>" :
		      (color == silver) ? ((gold80Percentage >= 70) ? "<img src='images/checkmark.png'/>" : "<img src='images/xout.png'/>") :
		      "") +
		     "</td>" +
		     "</tr>"
		     );

    var textcolor = (color == gold) ? black : (color == silver) ? black : white;

    $('#trsummary').append(
		     "<tr>" +
		     "<th>Current&nbsp;Level</th>" +
		     "<td class='center' colspan='3' style='color: " + textcolor + "; background-color: " + color + "'><br/>Level&nbsp;" + level + "<br/><br/></td>" +
		     "</tr>"
		     );


    var turnoff = parms.get("turnoff", "");
    if (turnoff != "") {
	var turnoffs = turnoff.split(",");
	for (var i = 0; i < turnoffs.length; i++) {
	    $("." + turnoffs[i] + "_span").each(flipThisVisibility);
	}
    }

    createHistoricalStats();
    fillHistoricalStatsForHistoricalReleases();
    // fillHistoricalStatsForRelease(currentRelease, datad, true);
    fillRemainingHistoricalStats();
    showHistoricalInfo();

    $('.sortby_' + sortBy).prop('checked', true);
    // $('#sortby_form').prop('action',window.location);
    var pd = parms.getParmsAsDict();
    for (var p in pd) {
	if (p != "sortby")
	    $('#sortby_form').append("<input type='hidden' name='" + p + "' value='" + pd[p] + "'/>");
    }
    // $('.sortby_submit').prop('class', 'alternateColor_' + sortBy);

    startSortChange(initSortBy);
    resort(initSortBy);
    $('#datacheck').html(datacheck());
}

{
    var pagelist = genPageList(parms.get("page", '1-9'));
    var datad = [];
    var editorNames = [];
    getNextUrl(datad, editorNames, pagelist, 0);
    // if any thing needs to be done, add it to whenDone()
}
