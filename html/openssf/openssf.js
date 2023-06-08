/* eslint-disable require-jsdoc */

"use strict";
console.clear();
const BETABASESITE = "https://master.bestpractices.coreinfrastructure.org/";
const BASESITE = "https://bestpractices.coreinfrastructure.org/";
// const BASESITE = BETABASESITE;
const BASEURL = BASESITE + "projects.json";
const globalTables = { };
const columnNames = {"bronze": [], "silver": [], "gold": []};
const requiredNames = {"bronze": [], "silver": [], "gold": []};
const optionalNames = {"bronze": [], "silver": [], "gold": []};
const blank2 = "&nbsp;&nbsp;";
const blank4 = blank2 + blank2;
const knownEditors = {};

const badgingLevels = ["Passing", "Silver", "Gold"];
const badgingColors = ["bronze", "silver", "gold"];
const bucketStr = ["0-20%", "20-40%", "40-60%", "60-80%", "80-100%", "100%"];

const currentReleaseName = currentRelease ? (currentRelease + " (current)") : "current";

const green = "#4bc51d";
const silver = "#bbbbbb";
const gold = "#f2ce0d";
const black = "#000000";
const white = "#ffffff";
const colors = [
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
    /* 100    */ green,
];

function getColor(passingPercentage, silverPercentage, goldPercentage) {
    let color = colors[parseInt(passingPercentage / 10, 10)];
    if (passingPercentage == 100 && silverPercentage == 100) {
        if (goldPercentage == 100) {
            color = gold;
        } else {
            color = silver;
        }
    }
    return color;
}

function getTieredColor(tieredPercentage) {
    let color = colors[0];
    if (tieredPercentage < 100) color = colors[parseInt(tieredPercentage / 10, 10)];
    else if (tieredPercentage < 200) color = green;
    else if (tieredPercentage < 300) color = silver;
    else color = gold;
    return color;
}


const parms = new Query();
// const debug = 'y'; // parms.get("debug", "n");
// function debuglog(msg, parm) {
//  if (debug == 'y') {
//    if (typeof parm != 'undefined') console.log(msg, parm);
//    else console.log(msg);
//  } else if (debug == 'alert') {
//    if (typeof parm != 'undefined') alert(msg, parm);
//    else alert(msg);
//  }
// }

const help = parms.get("help", "n");
if (help == "y") {
    // TODO this is woefully out of date
    debug.write("sortby=by_name/by_section_name/by_section_type_name/by_type_section_name/by_ordinal_name/");
    debug.write("by_ordinal_type_name/by_projectwide_name/by_projectwide_section_name/by_projectwide_type_name<br/>");
    debug.write("pagelength=30<br/>");
    debug.write("skipnotstarted=false<br/>");
    debug.write("turnoff=passing,silver,gold,etc<br/>");
    document.write("debug=y<br/>");
    document.write("page=1-2,5-6 (only valid for project=all)<br/>");
    throw new Error("help");
}

let sortBy = "";
const initSortBy = parms.get("sortby", "by_name").toLowerCase();
if (!(initSortBy == "by_name" ||
      initSortBy == "by_section_name" ||
      initSortBy == "by_section_type_name" ||
      initSortBy == "by_type_section_name" ||
      initSortBy == "by_type_name" ||
      initSortBy == "by_ordinal_name" ||
      initSortBy == "by_ordinal_type_name" ||
      initSortBy == "by_projectwide_name" ||
      initSortBy == "by_projectwide_section_name" ||
      initSortBy == "by_projectwide_type_name")
) {
    initSortBy = "by_name";
}

let showUnmaintained = !parms.get("show-unmaintained", "no").toLowerCase().startsWith("n")
console.log("showUnmaintained=", showUnmaintained);

function watermark(msg) {
    if (msg != "") {
        $("#watermarkPage").html(msg);
    } else {
        $("#watermarkPage").html("<br/>");
    }
}

function flipVisibility(where, how) {
    // console.log("flipping display, where=" + where);
    // console.log(where);
    if (!how) how = "inline";
    if ( $(where).css("display") == "none" ) {
        $(where).css("display", "inline");
    } else {
        $(where).css("display", "none");
    }
}

function flipThisVisibility(index) {
    flipVisibility(this);
}

function makeVisible(where) {
    // console.log("changing display to inline, where=" + where);
    // console.dir(where);
    $(where).css("display", "inline");
}

// function makeThisVisible(index) {
//  makeVisible(this);
// }

function makeInvisible(where) {
    // console.log("changing display to none, where=" + where);
    // console.dir(where);
    $(where).css("display", "none");
}

// function makeThisInvisible(index) {
//  makeInvisible(this);
// }

// function sanitizeRelease(r, def) {
//  if (r == 'current') {
//    return r;
//  }
//  for (let k = 0; k < releases.length; k++) {
//    const release = releases[k];
//    if (r == release) {
//      return r;
//    }
//  }
//  return def;
// }

// function titleCase(str) {
//  if (str.length == 0) return str;
//  return str.charAt(0).toUpperCase() + str.substring(1);
// }

function addReleasesAndBadgingLevelsToTable() {
    // let headers = intermingleReleasesAndBadgingLevels();
    const headers = "<tr>" +
                    "<th>Ranked&nbsp;Index</th>" +
                    "<th>Project&nbsp;Prefix</th>" +
                    "<th>Name</th>" +
                    "<th>Badge</th>" +
                    "<th>Passing&nbsp;%</th>" +
                    "<th>Silver&nbsp;%</th>" +
                    "<th>Gold&nbsp;%</th>" +
                    "</tr>";
    $("#trprojects").append("<thead>" + headers + "</thead>" +
                    "<tfoot>" + headers + "</tfoot>");
}

// store the current data into data[]
function pushData(whereTo, whereFrom, filterOut) {
    $(whereFrom).each(function(index, element) {
	if (filterOut) {
	    if (!filterOut(element)) {
		whereTo.push(element);
	    }
	} else {
	    whereTo.push(element);
	}
    });
}

function genPageList(page) {
    const pagelist = [];
    const pageRanges = page.split(",");
    for (let i = 0; i < pageRanges.length; i++) {
        const pos = pageRanges[i].indexOf("-");
        let start = pageRanges[i];
        let end = start;
        if (pos > 0) {
            start = pageRanges[i].substring(0, pos);
            end = pageRanges[i].substring(pos+1);
        }
        for (let j = Number(start); j < Number(end)+1; j++) {
            pagelist.push(j);
        }
    }
    return pagelist;
}

function generateRank(bp0, bp1, bp2) {
    return bp0 * 1000000 + bp1 * 1000 + bp2;
}

const historicalProjectCount = { };

const historicalStats = { };
// historicalStats[release][level 0/1/2][bucket 0-5]
// { #-projects, cumulative-#, %-projects, cumulative-% }

function createHistoricalStatsRelease(release) {
    historicalStats[release] = [];
    for (let level = 0; level < 3; level++) {
        historicalStats[release].push([]);
        for (let bucket = 0; bucket < 6; bucket++) {
            historicalStats[release][level].push({"#projects": 0, "cumulative#": 0, "%projects": 0.0, "cumulative%": 0.0});
        }
    }
}

function createHistoricalStats() {
    releases[currentReleaseName] = { };
    for (const release in releases) {
        if (releases.hasOwnProperty(release)) {
            createHistoricalStatsRelease(release);
        }
    }
}

function fillHistoricalStatsForRelease(release, releaseData, dolog) {
    if (dolog) console.log("fillHistoricalStatsForRelease(" + release + ",", releaseData, ")");
    if (dolog) console.log("before loop");
    for (const j in releaseData) {
        if (releaseData.hasOwnProperty(j)) {
            if (dolog) console.log("j=", j);
            const releaseDataj = releaseData[j];
            if (dolog) console.log("releaseDataj=", releaseDataj);
            const badgePercentage0 = releaseDataj["badge_percentage_0"];
            if (dolog) console.log("badge_percentage_0=" + badgePercentage0);
            const bucket0 = parseInt(badgePercentage0 / 20.);
            if (dolog) console.log("bucket0=", bucket0);
            historicalStats[release][0][bucket0]["#projects"] += 1;
            const badgePercentage1 = releaseDataj["badge_percentage_1"];
            const bucket1 = parseInt(badgePercentage1 / 20.);
            if (dolog) console.log("bucket1=", bucket1);
            historicalStats[release][1][bucket1]["#projects"] += 1;
            const badgePercentage2 = releaseDataj["badge_percentage_2"];
            const bucket2 = parseInt(badgePercentage2 / 20.);
            if (dolog) console.log("bucket2=", bucket2);
            historicalStats[release][2][bucket2]["#projects"] += 1;
            if (dolog) console.log("all buckets filled for this project");
        }
    }
    if (dolog) console.log("after fillHistoricalStatsForRelease(" + release + ", ...)");
}

function fillHistoricalStatsForHistoricalReleases() {
    for (const release in historicalReleaseData) {
        if (historicalReleaseData.hasOwnProperty(release)) {
            const hrdi = historicalReleaseData[release];
            fillHistoricalStatsForRelease(release, hrdi);
        }
    }
}

function fillRemainingHistoricalStats() {
    // do at end
    for (const release in releases) {
        if (releases.hasOwnProperty(release)) {
            // const release = releases[releasei];
            historicalProjectCount[release] = 0;
            const level = 0;
            for (let bucket = 0; bucket < 6; bucket++) {
                historicalProjectCount[release] += historicalStats[release][level][bucket]["#projects"];
            }
            const releaseProjectCount = historicalProjectCount[release];
            for (let level = 0; level < 3; level++) {
                let cumulative = 0;
                let minBucket = 0; let maxBucket = 0;
                for (let bucket = 5; bucket >= 0; bucket--) {
                    const nprojects = historicalStats[release][level][bucket]["#projects"];
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
}

// function interpolate(a, b, r) {
//  return parseInt(a) + Math.floor((b - a) * r / 100.);
// }

// function interpolateToHex(a, b, r) {
//  let ret = interpolate(a, b, r);
//  ret = ('000000' + ret.toString(16));
//  ret = ret.substring(ret.length - 6);
//  return ret;
// }


function showHistoricalInfo() {
    let html = "<table><tr><th colspan='2' rowspan='2'>Level</th>";
    for (const release in releases) {
        if (historicalProjectCount[release] > 0) {
            html += "<td rowspan='99'>&nbsp;</td>" + "<th colspan='4'>" + release + "<br/>" +
            historicalProjectCount[release] + "</th>";
        }
    }
    html += "</tr>\n";
    html += "<tr>";
    for (const release in releases) {
        if (historicalProjectCount[release] > 0) {
            html += "<td align='center'>#</td>" + "<td align='center'>%</td>" + "<td align='center'>+ #</td>" +
            "<td align='center'>+ %</td>";
        }
    }
    html += "</tr>\n";

    const levelBgColors = ["bgbronze", "bgsilver", "bggold"];
    //                     red         green           green       silver          silver      gold
    // const colorBounds = [['0xff0000', '0x00ff00'], ['0x00ff00', '0xc0c0c0'], ['0xc0c0c0', '0xffd700']];
    // const levelBounds = [[0, 20], [20, 40], [40, 60], [60, 80], [80, 100], [100, 100]];

    const gradients = [
        // redToGreen
        ["ff0000", "fb0000", "df0000", "c20700", "a62900", "883b00",
            "6d4a00", "4a5a00", "1a6800", "007500", "008300", "008300", "008300"],
        // greenToSilver
        ["008300", "008900", "008f00", "009526", "229c41", "44a256",
            "63a86e", "7bae82", "92b497", "a9baab", "c0c0c0", "c0c0c0", "c0c0c0"],
        // silverToGold
        ["c0c0c0", "c7c2a8", "cec492", "d5c77b", "dcc962", "e3cb46",
            "ebcd1e", "f1d000", "f8d200", "ffd400", "ffd700", "ffd700", "ffd700"],
    ];

    const opacities = {
        100: [0.00, 0.16, 0.33, 0.50, 0.66, 0.83, 1.00],
        80: [0.26, 0.43, 0.60, 0.76, 0.93, 1.00, 1.00],
        50: [0.43, 0.60, 0.76, 0.93, 1.00, 1.00, 1.00],
        20: [0.60, 0.76, 0.93, 1.00, 1.00, 1.00, 1.00],
        0: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
    };

    let levelSep = "";
    // for (let level = 0; level < 3; level++) {
    for (let level = 2; level >= 0; level--) {
        html += levelSep;
        levelSep = "<tr><td colspan='99'><br/></td></tr>";
        let shownLevel = false;
        const gray = "background-color: white; color: #cdcdcd; ";
        // for (let bucket = 0; bucket < 6; bucket++) {
        for (let bucket = 5; bucket >= 0; bucket--) {
            html += "<tr>";
            if (!shownLevel) {
                html += "<th class='" + levelBgColors[level] + "' rowspan='6'>" + badgingLevels[level] + "</th>";
                shownLevel = true;
            }
            // background: linear-gradient(to top, $bcolor $bpct%, $tcolor $tpct%)
            const botColor = gradients[level][bucket*2];
            const topColor = gradients[level][bucket*2 + 2];
            const grad = "background: linear-gradient(to top, #" + botColor + ", #" + topColor + ")";
            let opacity = opacities[0][bucket];
            // console.log("bucket=",bucket);
            // console.log("base opacity=",opacity);
            // console.log("grad=", grad);

            html += "<td style='" + grad + "' align='right'>" + bucketStr[bucket] + "</td>";
            for (const release in releases) {
                if (historicalProjectCount[release] > 0) {
                    const showlog = false; // (release == currentReleaseName);
                    if (showlog) {
                        console.log("================================================================");
                        console.log("level=", level, " / ", levelBgColors[level]);
                        console.log("release=", release);
                    }
                    const nprojects = historicalStats[release][level][bucket]["#projects"];
                    const pprojects = historicalStats[release][level][bucket]["%projects"];
                    const ncumulative = historicalStats[release][level][bucket]["cumulative#"];
                    const pcumulative = historicalStats[release][level][bucket]["cumulative%"];
                    if (showlog) {
                        console.log("nprojects=", nprojects);
                        console.log("pprojects=", pprojects);
                        console.log("ncumulative=", ncumulative);
                        console.log("pcumulative=", pcumulative);
                    }

                    const bg = (ncumulative <= 0) ? gray : grad;
                    const minBucket = historicalStats[release][level]["minBucket"];
                    const maxBucket = historicalStats[release][level]["maxBucket"];
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
                            const showlog2 = false;
                            if (showlog2) {
                                console.log("release=", release, "level=", level, " / ", levelBgColors[level],
                                    "[4][%projects]", historicalStats[release][level][4]["%projects"],
                                    "[5][%projects]", historicalStats[release][level][5]["%projects"]);
                            }
                            // code here goes whiter on the bottom if %projects[4+5] > 75%
                            const hist4plus5 = +(historicalStats[release][level][4]["%projects"]) + +(historicalStats[release][level][5]["%projects"]);
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
                        console.log("opacity=", opacity);
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
    $("#releasestats_div").append(html);
    // console.log("end of showHistoricalInfo()");
}

/*
  From a list of Repo URLs, generate an array with the project name as the first element
  and the Repo names as the remaining elements.
*/
let badUrlCount = 0;
function determineProjectAndRepoNamesPats(urlList) {
    const urls = urlList.split(/[\s,]+/);
    const repos = ["UNKNOWN"];

    // // console.log("determineProjectAndRepoNamesPats(", urlList, ")");
    for (const u in urls) {
        if (urls.hasOwnProperty(u)) {
            const url = urls[u];
            // const urlUpper = url.toUpperCase();
            let repo = "UNKNOWN-BADURL";
            for (const up in repoUrlPatterns) {
                if (repoUrlPatterns.hasOwnProperty(up)) {
                    const urlPattern = repoUrlPatterns[up];
                    // console.log("urlPattern=", urlPattern)
                    const ret = url.match(urlPattern);
                    // console.log("ret=", ret);
                    if (ret) {
                        repo = ret[1];
                        break;
                    }
                }
            }
            repos.push(repo);
        }
    }

    // Figure out the project name from the first repo in the list.
    // "abc/def" => "abc". "wxy" => "wxy".
    const n = repos[1].indexOf("/");
    if (n == -1) {
        repos[0] = repos[1];
    } else {
        repos[0] = repos[1].substring(0, n);
    }
    if (repos[0] == "#") repos[0] = "UNKNOWN-BADURL";
    if (repos[0].endsWith("-BADURL")) {
        repos[0] = repos[0] + badUrlCount;
        badUrlCount++;
    }

    return repos;
}

async function fillInEditorNames(datad, editorNames, editorList, j) {
    if (editorList.length == 0) {
        whenDone(datad, editorNames);
        return;
    }

    const URL = BASESITE + "en/users/";
    const editor = editorList[j];
    const dots = [".", "..", "...", "...."];
    const dotcolon = [":", ".:", "..:", "...:"];
    watermark("Loading<br/>editors " + (dots[j % 4]));
    const lastOne = j >= (editorList.length-1);

    $.ajax({
        type: "GET",
        url: URL + editor + ".json",
        data: {"format": "json"},
        success: function(json) {
            // console.log("ret=", json);
            if (typeof json == "string") pushData(editorNames, JSON.parse(json));
            else pushData(editorNames, json);
            if (json == "") whenDone(datad, editorNames);
            else if (lastOne) whenDone(datad, editorNames);
            else {
                /* https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep */
                new Promise((r) => {
                    setTimeout(r, 250);
                });
                fillInEditorNames(datad, editorNames, editorList, j+1);
            }
        },
        error: function(request, error, thrownError) {
            console.log("Request:", request);
            console.log("Request(s): "+JSON.stringify(request) + "\n" + "error=" + error + "\n" + "thrownError=" + thrownError);
            if (request.status == 429) {/* retry later -- rate limiting occurred */
                /* https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep */
                watermark("Loading<br/>editors. " + (dotcolon[j % 4]));
                new Promise((r) => {
                    setTimeout(r, 1000);
                });
                fillInEditorNames(datad, editorNames, editorList, j);
            } else {
                whenDone(datad, editorNames);
            }
        },
    });
}

function getEditorList(datad, editorNames) {
    const editorDict = {};
    for (const k in datad) {
        if (datad.hasOwnProperty(k)) {
            editorDict[datad[k].user_id] = 1;
            for (const ar in datad[k].additional_rights) {
                if (datad[k].additional_rights.hasOwnProperty(ar)) {
                    editorDict[datad[k].additional_rights[ar]] = 1;
                }
            }
        }
    }
    const keys = [];
    for (const k in editorDict) {
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

async function getNextUrl(datad, editorNames, pagelist, j) {
    const lastOne = j == pagelist.length-1;
    const p = pagelist[j];
    const URL = BASEURL;
    watermark("Loading<br/>projects " + p);

    function filterOut(element) {
	// console.log("element=", element);
	// console.log("maintained_status=", element.maintained_status);
	if ((element.maintained_status != "Met") && !showUnmaintained) {
	    console.log("Filtering out " + element.name + " because it is not maintained");
	    return true;
	}
	// console.log("Keeping " + element.name + " because it is maintained or showUnmaintained is set");
	return false;
    }

    $.ajax({
        type: "GET",
        url: URL,
        data: {"q": openssfSearchQuery, "page": p},
        success: function(json) {
            // alert("json=",json);
            // console.log("json=", json);
            // if (typeof json == "string") pushData(historicalReleaseData[currentRelease], JSON.parse(json));
            // else pushData(historicalReleaseData[currentRelease], json);
            if (!(currentReleaseName in historicalReleaseData)) {
                // console.log("creating historicalReleaseData[" + currentReleaseName + "]");
                historicalReleaseData[currentReleaseName] = [];
            }
            let js;
            if (typeof json == "string") {
                js = JSON.parse(json);
            } else {
                js = json;
            }

	    // console.log("pushing json to historicalReleaseData[" + currentReleaseName + "]<=", json);
	    pushData(datad, js, filterOut);
	    for (const jo in js) {
                if (js.hasOwnProperty(jo)) {
		    if (!filterOut(js[jo])) {
			historicalReleaseData[currentReleaseName].push(js[jo]);
		    }
                }
	    }
	    if (lastOne || (json == "")) {
                fillInEditorNames(datad, editorNames, getEditorList(datad, editorNames), 0);
            } else {
                /* https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep */
                new Promise((r) => {
                    setTimeout(r, 250);
                });
                getNextUrl(datad, editorNames, pagelist, j+1);
            }
        },
        error: function(request, error, thrownError) {
            // alert("Request: "+JSON.stringify(request) + "\n" + "error=" + error + "\n" + "thrownError=" + thrownError);
            console.log("Request: "+JSON.stringify(request) + "\n" + "error=" + error + "\n" + "thrownError=" + thrownError);
            if (request.status == 429) {/* retry later -- rate limiting occurred */
                /* https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep */
                new Promise((r) => {
                    setTimeout(r, 1000);
                });
                getNextUrl(datad, editorNames, pagelist, j+1);
	    } else {
                fillInEditorNames(datad, editorNames, getEditorList(datad, editorNames), 0);
	    }
        },
    });
}

function addRankOrder(d) {
    d.sort(function(a, b) {
        return b.project_rank - a.project_rank;
    });
    let prev = -1;
    let iprev = -1;
    for (let i = 0; i < d.length; i++) {
        if (d[i].project_rank == prev) {
            d[i].project_rank_order = iprev + 1;
        } else {
            d[i].project_rank_order = i + 1;
            prev = d[i].project_rank;
            iprev = i;
        }
    }
}

function getProject(data, type, row) {
    if (type !== "display") return data;
    let ret = "<a target='_blank' rel='noopener noreferrer' href='" + row.repo_url + "'>" +
        row.sub_project_short + "</a>";
    if (row.sub_project_short == "UNKNOWN") {
        ret += (row.project_badurl ?
            " <span class='badURL' title='There is no project prefix word in the repo URL that will identify which project this entry belongs to.'>PROJECT NOT IN URL</span>" :
            "");
    } else {
        ret += (row.project_badurl ?
            " <span class='badURL' title='The given repo URL is invalid and returns a 404 NOT FOUND when visited.'>404 NOT FOUND</span>" :
            "");
    }
    ret += (row.project_badurlsuffix ?
        " <span class='badURL' title='If a git URL is specified for the repo URL, it must have a suffix of .git'>MISSING .git SUFFIX</span>" :
        "");
    if (row.sub_project_short != "UNKNOWN") {
        ret += (row.project_invalid_sub_project ?
            (" <span class='badProject' title='The project prefix word (" + row.sub_project_short + ")" +
             " in the repo URL is not a valid project name.'>UNKNOWN PROJECT PREFIX '" + row.sub_project_short + "' FOUND IN REPO URL</span>") :
            "");
    }
    return ret;
}

function getAllNames(data, type, row) {
    if (type !== "display") return data;
    if (row.id == -1) return data;
    const urlPrefix = "<a target='_blank' rel='noopener noreferrer' href='https://bestpractices.coreinfrastructure.org/projects/";
    const urlSuffix = "'>";
    const anchorEnd = "</a>";
    let ret = "<table class='noborder'>";
    ret += "<tr><td class='stats noborder'>" + urlPrefix + row.id + urlSuffix + row.name + anchorEnd + "</td></tr>";
    if (row.hasOwnProperty("otherRepos") && row.otherRepos.length > 0) {
        for (const k in row.otherRepos) {
            if (row.otherRepos.hasOwnProperty(k)) {
                const otherRepo = row.otherRepos[k];
                ret += "<tr><td class='stats noborder right'>" + blank4 + urlPrefix + otherRepo.id + urlSuffix + otherRepo.name + anchorEnd + "</td></tr>";
            }
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

// function resize(id) {
//  if ($('.size__' + id).css('font-size') == '24px') {
//    $('.size__' + id).css('font-size', '8px');
//  } else if ($('.size__' + id).css('font-size') == '8px') {
//    $('.size__' + id).css('font-size', '');
//  } else {
//    $('.size__' + id).css('font-size', '24px');
//  }
// }

function getAllBadges(data, type, row) {
    if (type !== "display") return data;
    const urlPrefix = "<img src=\"https://bestpractices.coreinfrastructure.org/projects/";
    const urlSuffix = "/badge\"/>";
    let ret = "<table class='noborder'>";
    if (row.id == 0) {
        ret += "<tr><td class='stats noborder'>";
        if (row.project_rank == 0) {
            ret += getBadge("cii best practices", "Not started 0%", "red"); // '<img src="images/openssf-not-started.png"/>';
        } else {
	    let color = getColor(row.badge_percentage_0, row.badge_percentage_1, row.badge_percentage_2);
            ret += getBadge("Lowest", row.badge_percentage_0 + "%", color);
        }
        ret += "</td></tr>";
    } else {
        ret += "<tr><td class='stats noborder'>" + (urlPrefix + row.id + urlSuffix) + "</td></tr>";
    }
    if (row.hasOwnProperty("otherRepos") && row.otherRepos.length > 0) {
        for (const k in row.otherRepos) {
            if (row.otherRepos.hasOwnProperty(k)) {
                const otherRepo = row.otherRepos[k];
                ret += "<tr><td class='stats noborder right'>" + blank4 + urlPrefix + otherRepo.id + urlSuffix + "</td></tr>";
            }
        }
    }
    ret += "</table>";
    return ret;
}

function getAllPercentages(data, type, row, num) {
    if (type !== "display") return data;
    let ret = "<table class='noborder'>";
    ret += "<tr><td class='stats noborder'>" + row["badge_percentage_"+num] + "</td></tr>";
    if (row.hasOwnProperty("otherRepos") && row.otherRepos.length > 0) {
        for (const k in row.otherRepos) {
            if (row.otherRepos.hasOwnProperty(k)) {
                const otherRepo = row.otherRepos[k];
                ret += "<tr><td class='stats noborder right'>" + otherRepo["badge_percentage_"+num] + "</td></tr>";
            }
        }
    }
    return ret;
}


function genData(project, name, bp0, bp1, bp2) {
    return {
        "repo_url": goodRepoUrlPrefix + project,
        "sub_project": project,
        "sub_project_short": project,
        "name": name,
        "id": 0,
        "sub_project_badge": -1,
        "project_rank": 0,
        "badge_percentage_0": bp0,
        "badge_percentage_1": bp1,
        "badge_percentage_2": bp2,
        "otherRepos": [],
    };
}

function prEditor(data, editorDict) {
    // console.log("data=" + data);
    // console.log("typeof data=" + typeof data);
    const editors = data.toString().split(",");
    const JimBaker = "3607";
    const DavidMcBride = "4469";
    const hasJimBaker = editors.indexOf(JimBaker) > -1;
    const hasDavidMcBride = editors.indexOf(DavidMcBride) > -1;
    const len = editors.length;
    const cl = (hasDavidMcBride && len > 2) ? "met" : (hasJimBaker || len > 1) ? "partial" : "buzz";
    let editorsOut = "";
    let sep = "";
    for (const e in editors) {
        if (editors.hasOwnProperty(e)) {
            const editor = editors[e];
            const nm = editorDict[editor] ? editorDict[editor] : "Unk";
            editorsOut += sep + "<a target='_blank' rel='noopener noreferrer' href='" + BASESITE + "en/users/" + editor + "' title='" + nm.replace(/['']/g, "&quot;") + "'>" + nm + "</a>";
            sep = "<br/>";
        }
    }
    const ret = "<span class='xxsmall " + cl + "'>" + editorsOut + "</button>";
    return ret;
}

function datacheck() {
    let ret = "";
    const matchedprops = ["projectwide", "section", "type"];
    const allprops = ["projectwide", "section", "required", "type", "description", "details"];
    for (let l = 0; l < badgingColors.length-1; l++) {
        const level = badgingColors[l];
        for (const ciiName in badgeDescriptions[level]) {
            if (badgeDescriptions[level].hasOwnProperty(ciiName)) {
                for (const p in allprops) {
                    if (allprops.hasOwnProperty(p)) {
                        const prop = allprops[p];
                        if (!(prop in badgeDescriptions[level][ciiName])) {
                            ret += ciiName + ": " + prop + " is missing<br/>\n";
                        }
                    }
                }

                if (!("projectwide" in badgeDescriptions[level][ciiName])) {
                    if (("Infrastructure" == badgeDescriptions[level][ciiName]["type"]) &&
                !badgeDescriptions[level][ciiName]["projectwide"]) {
                        ret += ciiName + ": has the type Infrastructure, but projectwide is not set.<br/>\n";
                    }
                }
                for (let l2 = l+1; l2 < badgingColors.length; l2++) {
                    const level2 = badgingColors[l2];
                    if (ciiName in badgeDescriptions[level2]) {
                        for (const p in matchedprops) {
                            if (matchedprops.hasOwnProperty(p)) {
                                const prop = matchedprops[p];
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
        }
    }

    return ret ? ("<h4 class='datacheck'>Datacheck</h4>\n<div class='datacheck'>" + ret + "</div>\n") : ret;
}

function sortColumns(level, newSortBy, anm, bnm) {
    const a = anm["name"];
    const b = bnm["name"];
    const rf = badgeDescriptions[level];
    const atype = rf[a]["type"];
    const btype = rf[b]["type"];
    const asection = rf[a]["section"];
    const bsection = rf[b]["section"];
    const aordinal = rf[a]["ord"];
    const bordinal = rf[b]["ord"];
    const aprojectwide = !rf[a]["projectwide"];
    const bprojectwide = !rf[b]["projectwide"];
    let acmpnm = newSortBy.startsWith("by_section") ? asection :
        newSortBy.startsWith("by_type") ? atype :
            newSortBy.startsWith("by_projectwide") ? aprojectwide :
                newSortBy.startsWith("by_ordinal") ? aordinal :
                    "";
    let bcmpnm = newSortBy.startsWith("by_section") ? bsection :
        newSortBy.startsWith("by_type") ? btype :
            newSortBy.startsWith("by_projectwide") ? bprojectwide :
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
    return function(a, b) {
        return sortColumns(level, newSortBy, a, b);
    };
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

    const projectwideTitle = {false: "", true: ("<br/><br/><sub class='alternateColor_by_projectwide_name'>" + projectName + "-wide response</sub><br/>")};

    for (const l in badgingColors) {
        if (badgingColors.hasOwnProperty(l)) {
            const level = badgingColors[l];

            // save or figure out where the original names lived
            if (!(("orig_" + level) in requiredNames)) {
                const olevel = "orig_" + level;
                requiredNames[olevel] = [];
                for (const i in requiredNames[level]) {
                    if (requiredNames[level].hasOwnProperty(i)) {
                        requiredNames[olevel].push({name: requiredNames[level][i]["name"], orig: requiredNames[level][i]["orig"]});
                    }
                }
                optionalNames[olevel] = [];
                for (const i in optionalNames[level]) {
                    if (optionalNames[level].hasOwnProperty(i)) {
                        optionalNames[olevel].push({name: optionalNames[level][i]["name"], orig: optionalNames[level][i]["orig"]});
                    }
                }
            } else {
                requiredNames[level].length = 0;
                const olevel = "orig_" + level;
                for (const i in requiredNames[olevel]) {
                    if (requiredNames[olevel].haOwnProperty(i)) {
                        requiredNames[level].push({name: requiredNames[olevel][i]["name"], orig: requiredNames[olevel][i]["orig"]});
                    }
                }
                optionalNames[level].length = 0;
                for (const i in optionalNames[olevel]) {
                    if (optionalNames[olevel].hasOwnProperty(i)) {
                        optionalNames[level].push({name: optionalNames[olevel][i]["name"], orig: optionalNames[olevel][i]["orig"]});
                    }
                }
            }

            const requiredSlots = [];
            for (const i in requiredNames[level]) {
                if (requiredNames[level].hasOwnProperty(i)) {
                    requiredSlots.push(requiredNames[level][i]["orig"]);
                }
            }
            const optionalSlots = [];
            for (const i in optionalNames[level]) {
                if (optionalNames[level].hasOwnProperty(i)) {
                    optionalSlots.push(optionalNames[level][i]["orig"]);
                }
            }

            // re-sort the columns to the new order
            requiredNames[level].sort(sortColoredColumns(level, newSortBy));
            optionalNames[level].sort(sortColoredColumns(level, newSortBy));

            // get the column order from the table
            const columnOrder = globalTables[level].colReorder.order();

            // update the column order
            for (const i in requiredNames[level]) {
                if (requiredNames[level].hasOwnProperty(i)) {
                    columnOrder[requiredSlots[i]] = requiredNames[level][i]["orig"];
                    requiredNames[level][i]["orig"] = columnOrder[requiredSlots[i]];
                }
            }
            for (const i in optionalNames[level]) {
                if (optionalNames[level].hasOwnProperty(i)) {
                    columnOrder[optionalSlots[i]] = optionalNames[level][i]["orig"];
                    optionalNames[level][i]["orig"] = columnOrder[optionalSlots[i]];
                }
            }

            // set the new ordering
            globalTables[level].colReorder.order(columnOrder, true);

            // assign appropriate colors to the columns
            let lastSortedType = "";
            const columnColors = ["primaryColor", "alternateColor"];
            let onPrimaryColor = 0;
            for (const i in columnOrder) {
                if (columnOrder.hasOwnProperty(i)) {
                    const ciiName = columnNames[level][columnOrder[i]];
                    if ("fixed" == ciiName) continue;
                    const sortedType =
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
                						(sortBy == "by_projectwide_section_name") ?
                							(badgeDescriptions[level][ciiName]["projectwide"] + "_" + badgeDescriptions[level][ciiName]["section"]) :
                							(sortBy == "by_projectwide_type_name") ?
                								(badgeDescriptions[level][ciiName]["projectwide"] + "_" + badgeDescriptions[level][ciiName]["type"]) :
                								(sortBy == "by_projectwide_name") ?
                									badgeDescriptions[level][ciiName]["projectwide"] :
                								/* sortBy == by_type_name */
                									(badgeDescriptions[level][ciiName]["type"]);
                    if (sortedType != lastSortedType) {
                        onPrimaryColor = 1 - onPrimaryColor;
                        lastSortedType = sortedType;
                    }
                    $("." + ciiName + "_header_required").removeClass().addClass("required " + ciiName + "_header_required " + columnColors[onPrimaryColor] + "_" + sortBy);
                    $("." + ciiName + "_header_optional").removeClass().addClass("optional " + ciiName + "_header_optional " + columnColors[onPrimaryColor] + "_" + sortBy);

                    if (sortBy.startsWith("by_type")) {
                        const sectionItalic = sortBy.startsWith("by_type_section");
                        $("." + ciiName + "_subtitle").html("<br/><sub><i>(" + badgeDescriptions[level][ciiName]["type"] + ")</i></sub>" +
                                                    "<br/><sub>" + (sectionItalic ? "<i>" : "") + "(" +
                                                    badgeDescriptions[level][ciiName]["section"] + ")" +
                                                    (sectionItalic ? "</i>" : "") +
                                                    "</sub>");
                    } else if (sortBy.startsWith("by_section")) {
                        const typeItalic = sortBy.startsWith("by_section_type");
                        $("." + ciiName + "_subtitle").html("<br/><sub><i>(" + badgeDescriptions[level][ciiName]["section"] + ")</i></sub>" +
                                                    "<br/><sub>" + (typeItalic ? "<i>" : "") + "(" +
                                                    badgeDescriptions[level][ciiName]["type"] + ")" +
                                                    (typeItalic ? "</i>" : "") +
                                                    "</sub>");
                    } else if (sortBy.startsWith("by_projectwide_section")) {
                        $("." + ciiName + "_subtitle").html(projectwideTitle[badgeDescriptions[level][ciiName]["projectwide"]] +
                                                    "<br/><sub><i>(" + badgeDescriptions[level][ciiName]["section"] + ")</i></sub>" +
                                                    "<br/><sub>(" + badgeDescriptions[level][ciiName]["type"] + ")" +
                                                    "</sub>");
                    } else if (sortBy.startsWith("by_projectwide_type")) {
                        $("." + ciiName + "_subtitle").html(projectwideTitle[badgeDescriptions[level][ciiName]["projectwide"]] +
                                                    "<br/><sub><i>(" + badgeDescriptions[level][ciiName]["type"] + ")</i></sub>" +
                                                    "<br/><sub>(" + badgeDescriptions[level][ciiName]["section"] + ")" +
                                                    "</sub>");
                    } else if (sortBy.startsWith("by_projectwide")) {
                        $("." + ciiName + "_subtitle").html(projectwideTitle[badgeDescriptions[level][ciiName]["projectwide"]] +
                                                    "<br/><sub>(" + badgeDescriptions[level][ciiName]["section"] + ")" +
                                                    "<br/><sub>(" + badgeDescriptions[level][ciiName]["type"] + ")</sub>" +
                                                    "</sub>");
                    } else {
                        $("." + ciiName + "_subtitle").html("<br/><sub>(" + badgeDescriptions[level][ciiName]["section"] + ")</sub>" +
                                                    "<br/><sub>(" + badgeDescriptions[level][ciiName]["type"] + ")</sub>");
                    }
                }
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

function cmp(a, b) {
    return (a == b) ? 0 : (a < b) ? -1 : 1;
}

function addToQuestionsTable(datad, tablename, level, levelcapname, percent, editorDict) {
    let trdataHeaders = "<tr>";
    const nameHeader = "<th class='name'>Name</th>";
    trdataHeaders += nameHeader;
    columnNames[level].push("fixed");
    let columnCount = 1;
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

    let addNameColumn = 3;
    const rf = badgeDescriptions[level];

    const sortedNames = Object.keys(rf);
    sortedNames.sort();

    const allFields = [];
    const optionalFields = {};
    if (percent !== null) {
        // gather all of the required fields together
        let requiredCount = 0; let optionalCount = 0; ;
        const requiredLocations = { }; const optionalLocations = { };
        for (const k in sortedNames) {
            if (sortedNames.hasOwnProperty(k)) {
                const ciiName = sortedNames[k];
                if (rf[ciiName]["required"]) {
                    allFields.push(ciiName);
                    requiredNames[level].push({"name": ciiName});
                    requiredLocations[ciiName] = requiredCount++;
                }
            }
        }

        // now gather all of the optional fields together
        for (const k in sortedNames) {
            if (sortedNames.hasOwnProperty(k)) {
                const ciiName = sortedNames[k];
                if (!rf[ciiName]["required"]) {
                    allFields.push(ciiName);
                    optionalNames[level].push({"name": ciiName});
                    optionalFields[ciiName] = 1;
                    optionalLocations[ciiName] = optionalCount++;
                }
            }
        }

        // create each of the header/footer elements
        // const lastSortedType = '';
        // const columnColors = ['primaryColor', 'alternateColor'];
        // const onPrimaryColor = 0;
        for (const k in allFields) {
            if (allFields.hasOwnProperty(k)) {
                const ciiName = allFields[k];
                const cl = optionalFields[ciiName] ? "optional" : "required";
                if (optionalFields[ciiName]) {
                    optionalNames[level][optionalLocations[ciiName]]["orig"] = columnCount;
                } else {
                    requiredNames[level][requiredLocations[ciiName]]["orig"] = columnCount;
                }

                const projectLevelClass = badgeDescriptions[level][ciiName]["projectwide"] ? "projectLevel" : "";

                trdataHeaders += "<th class='" + cl + " " +
                ciiName + "_header_" + cl + "'>" +
                "<span class='" + cl + "' title='" +
                "[" + ciiName + "] " +
                badgeDescriptions[level][ciiName]["description"].replace(/['']/g, "&quot;") +
                "'>" +
                ciiName.replace(/_/g, " ").
                	replace(/(\W+|^)(.)/ig,
                		function(match, chr) {
                			return match.toUpperCase();
                		}) +
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
                (badgeDescriptions[level][ciiName]["projectwide"] ? "<br/><br/><sup class='alternateColor_by_projectwide_name'>" + projectName + "-wide response</sup>" : "") +
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
    }

    const addLastNameColumn = !trdataHeaders.endsWith(nameHeader);
    if (addLastNameColumn) {
        trdataHeaders += nameHeader;
        columnNames[level].push("fixed");
        columnCount++;
    }
    trdataHeaders += "</tr>";
    $("#" + tablename).append("<thead>" + trdataHeaders + "</thead>" +
                              "<tfoot>" + trdataHeaders + "</tfoot>");

    const columns = [];
    addNameColumn = 3;

    columns.push({"data": "name", "render": function( data, type, row, meta ) {
        return "<span style='float: right'><img src='images/updown-7x7.png' class='clickable_image' " +
                    "onclick='resize(" + row["id"] + ")'" +
                    "/></span><span class='size__" + row["id"] +
                    "'><a target='_blank' rel='noopener noreferrer' href='https://bestpractices.coreinfrastructure.org/projects/" +
                    row["id"] + "'>" + data + "</a></span>";
    },
    });

    columns.push({"data": "tiered_percentage", "render": function( data, type, row, meta ) {
        const color = getTieredColor(data);
        const textcolor = (color == gold) ? black : (color == silver) ? black : white;
        return "<span class='size__" + row["id"] + "' style='color: " + textcolor + "; background-color: " + color + "'>" + data + "</span>";
    },
    });

    if (percent !== null) {
        columns.push({"data": "badge_percentage_" + percent, "render": function( data, type, row, meta ) {
            return "<span class='size__" + row["id"] + "'>" + data + "</span>";
        },
        });
    }

    columns.push({"data": "editors", "render": function( data, type, row, meta ) {
        return "<span class='size__" + row["id"] + "'>" + prEditor(data, editorDict) + "</span>";
    },
    });

    if (percent !== null) {
        for (const k in allFields) {
            if (allFields.hasOwnProperty(k)) {
                const ciiName = allFields[k];
                columns.push({"data": ciiName + "_status",
                    "name": ciiName,
                    "render":
                        function( data, type, row, meta ) {
                        	const statusName = meta.settings.aoColumns[meta.col].data;
                        	const fieldName = meta.settings.aoColumns[meta.col].name;
                        	const optionalClass = optionalFields[fieldName] ? "optional" : "";
                        	let classVal = /* optionalClass + */"na";
                        	const projectLevelClass = badgeDescriptions[level][fieldName]["projectwide"] ? "projectLevel" : "";
                        	const justificationName = fieldName + "_justification";
                        	const urlRequired = badgeDescriptions[level][fieldName]["description"].indexOf("(URL required)") >= 0;
                        	const hasUrl = (justificationName in row) && containsURL(row[justificationName]);
                        	if (data.toLowerCase() == "met") {
                        		if (urlRequired && hasUrl) classVal = "met";
                        		else if (!urlRequired) classVal = "met";
                        		else classVal = "needsUrl";
                        	} else if (data.toLowerCase() == "unmet") classVal = "unmet";
                        	else if (data.toLowerCase() == "?") classVal = "question";
                        	// const justification = row[justificationName];
                        	const detailIdButton = "button__" + statusName + "__" + row["id"];
                        	const detailClass = "detail__" + statusName + "__" + row["id"];
                        	const detailIdSpan = "detail__" + statusName + "__" + row["id"];
                        	let ret = "<div style='height: 100%; width: 100%; ' class='" + optionalClass + " size__" + row["id"] + "'>" +
                            "<button id='" + detailIdButton + "' class='" + classVal + " " + projectLevelClass + " xclickable_text size__" + row["id"] + "' title=\"";
                        	ret += (fieldName in badgeDescriptions[level]) ? ("[" + fieldName + "]\n" + badgeDescriptions[level][fieldName]["description"].replace(/['']/g, "&quot;") + "\n") : "--\n";
                        	let status = "";
                        	status += (fieldName in row) ? (row[fieldName] + "\n") : "\n"; // ".(fieldname).\n";
                        	status += (statusName in row) ? (row[statusName] + "\n") : "\n"; // ".(statusname).\n";
                        	status += (justificationName in row) ? ((row[justificationName]) ? (row[justificationName] + "\n") : "\n") : "\n"; // ".(justifictionname).\n";
                        	ret += status;
                        	let statusbr = "";
                        	statusbr += (fieldName in row) ? (row[fieldName] + "<br/>") : "<br/>"; // ".(fieldname).<br/>";
                        	statusbr += (justificationName in row) ? ((row[justificationName]) ? (row[justificationName] + "<br/>") : "<br/>") : "<br/>"; // ".(justifictionname).<br/>";
                        	ret += "\" onclick='flipVisibility(\"#" + detailIdSpan + "\")'>";
                        	if (classVal == "needsUrl") {
                        		ret += "Needs URL";
                        	} else {
                        		ret += data;
                        	}
                        	ret += "</button>";
                        	// ret += "detailIdButton=" + detailIdButton + ", detailClass=" + detailClass;
                        	ret += "<span id='" + detailIdSpan + "' class='" + level + "_detail_span" + " " + detailClass + "'><br/><br/>" + statusbr + "</span>" + "</div>";
                        	return ret;
                        },
                });

                if (++addNameColumn % 10 == 0) {
                    columns.push({"data": "name", "render": function( data, type, row, meta ) {
                        return "<span style='float: right'><img src='images/updown-7x7.png' class='clickable_image' " +
                                "onclick='resize(" + row["id"] + ")'" +
                                "/></span><span class='size__" + row["id"] +
                                "'><a target='_blank' rel='noopener noreferrer' href='https://bestpractices.coreinfrastructure.org/projects/" +
                                row["id"] + "'>" + data + "</a></span>";
                    },
                    });
                }
            }
        }

        if (addLastNameColumn) {
            columns.push({"data": "name", "render": function( data, type, row, meta ) {
                return "<span style='float: right'><img src='images/updown-7x7.png' class='clickable_image' " +
                            "onclick='resize(" + row["id"] + ")'" +
                            "/></span><span class='size__" + row["id"] +
                            "'><a target='_blank' rel='noopener noreferrer' href='https://bestpractices.coreinfrastructure.org/projects/" +
                            row["id"] + "'>" + data + "</a></span>";
            },
            });
        }
    }

    const datatableButtons = ["pageLength"];

    // Experiment with sorting the data before building the table to see if we can get the headers to immediately scroll.
    // console.log("datad=", datad);
    // datad.sort(function(a,b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });
    // console.log("sorted datad=", datad);

    globalTables[level] =
        $("#" + tablename).DataTable({
        	"colReorder": true,
        	// "fixedHeader": { "footer": false, "header": true },
        	"fixedHeader": true,
        	"data": datad,
        	"aaSorting": [[0, "asc"]],
        	// fixedHeader: true,
        	"paging": true,
        	"pagingType": "full_numbers",
        	"pageLength": parseInt(parms.get("pagelength", "50")),
        	"info": false,
        	"dom": "Bfrtip",
        	"lengthMenu": [
        		[10, 20, 25, 50, 100, -1],
        		["10 rows", "20 rows", "25 rows", "50 rows", "100 rows", "Show all"],
        	],
        	"searching": true,
        	"autoWidth": false,
        	"buttons": datatableButtons,
        	"columns": columns,
        	"initComplete": function(settings, json) {
        		// console.log("table for " + level + " done");
        		//                for (let k in allFields) {
        		//                    let statusName = allFields[k];
        		//                    for (let r in datad) {
        		//                        let detailIdButton = "#button__" + statusName + "__" + datad[r].id;
        		//                        let detailIdClass = ".detail__" + statusName + "__" + datad[r].id;
        		//                        console.log("detailIdButton=" + detailIdButton + ", detailIdClass=" + detailIdClass);
        		//                        $(detailIdButton).click(function(){ console.log("clicking " + detailIdButton + " for " + detailIdClass);
        		//                                $(detailIdClass).each(flipThisVisibility); });
        		//                        console.dir($(detailIdButton));
        		//                    }
        		//                }
        	},
        });

    // add in the per-requirement statistics
    for (const k in allFields) {
        if (allFields.hasOwnProperty(k)) {
            const ciiName = allFields[k];
            const urlRequired = badgeDescriptions[level][ciiName]["description"].indexOf("(URL required)") >= 0;
            // console.log("ciiName=", ciiName);
            let met = 0; let needsUrl = 0; let unmet = 0; let question = 0; let na = 0; let unknown = 0;
            for (const i in datad) {
                if (datad.hasOwnProperty(i)) {
                    const row = datad[i];
                    const status = row[ciiName+"_status"].toLowerCase();
                    const justificationName = ciiName + "_justification";
                    const hasUrl = (justificationName in row) && containsURL(row[justificationName]);
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
            }
            $(".metstats_" + level + "_" + ciiName).append((met ? "<div class='left'><button class='met'>Met</button>&nbsp;" + met : "</div>") +
                                                       (na ? "<div class='left'><button class='na'>NA</button>&nbsp;" + na : "</div>") +
                                                       (unmet ? "<div class='left'><button class='unmet'>Unmet</button>&nbsp;" + unmet : "</div>") +
                                                       (needsUrl ? "<div class='left'><button class='needsUrl'>NeedsUrl</button>&nbsp;" + needsUrl : "</div>") +
                                                       (question ? "<div class='left'><button class='question'>?</button>&nbsp;" + question : "</div>") +
                                                       (unknown ? "<div class='left'><button class='badProject'>?</button>" : "</div>"));
        }
    }
}

function whenDone(datad, editorNames) {
    watermark("Processing");
    const editorDict = { };
    for (const k in editorNames) {
        if (editorNames[k].name && editorNames[k].name != "") {
            editorDict[editorNames[k].id] = editorNames[k].name;
        } else if (editorNames[k].nickname && editorNames[k].nickname != "") {
            editorDict[editorNames[k].id] = editorNames[k].nickname;
        } else {
            editorDict[editorNames[k].id] = "unknown";
        }
    }

    addReleasesAndBadgingLevelsToTable();
    for (const k in datad) {
        if (datad.hasOwnProperty(k)) {
            // // let projectAndRepos = determineProjectAndRepoNames(datad[k].repo_url);
            // // let projectAndReposPats = determineProjectAndRepoNamesPats(datad[k].repo_url);
            // // console.log("projectAndRepos=", projectAndRepos);
            // // console.log("projectAndReposPats=", projectAndReposPats);
            const projectAndRepos = determineProjectAndRepoNamesPats(datad[k].repo_url);
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
            let project = projectAndRepos[0];
            datad[k].sub_project = project;
            const n = datad[k].sub_project.indexOf("-BADURL");
            if (n != -1) project = project.substring(0, n);
            datad[k].sub_project_short = project;
            datad[k].project_badurl = (n != -1);
            datad[k].project_badurlsuffix = (datad[k].sub_project.indexOf("-BADURLSUFFIX") != -1);
            datad[k].sub_project_repos = projectAndRepos.shift();
            datad[k].project_invalid_sub_project = !allSubProjects[currentRelease].hasOwnProperty(project);
            datad[k].editors = datad[k].user_id;
            for (const ar in datad[k].additional_rights) {
                if (datad[k].additional_rights[ar] != datad[k].user_id) {
                    datad[k].editors = datad[k].editors + "," + datad[k].additional_rights[ar];
                }
            }
        }
    }
    datad.sort(function(a, b) {
        const ap = a.sub_project.toUpperCase();
        const bp = b.sub_project.toUpperCase();
        return ap > bp ? 1 : bp > ap ? -1 : 0;
    });

    const dataTable = [];

    function updateData(d) {
        let leastBP0 = 101;
        let leastBP1 = 101;
        let leastBP2 = 101;
        let leastRank = generateRank(leastBP0, leastBP1, leastBP2);
        for (const o in d.otherRepos) {
            if (d.otherRepos[o].project_rank < leastRank) {
                leastRank = d.otherRepos[o].project_rank;
                leastBP0 = d.otherRepos[o].badge_percentage_0;
                leastBP1 = d.otherRepos[o].badge_percentage_1;
                leastBP2 = d.otherRepos[o].badge_percentage_2;
            }
        }
        d.project_rank = leastRank;
        d.badge_percentage_0 = leastBP0;
        d.badge_percentage_1 = leastBP1;
        d.badge_percentage_2 = leastBP2;
    }

    // Move the additional repo information for a project into an element called otherRepos.
    // At the end of this, all data is in dataTable instead of datad.
    let prevProject = "";
    for (const k in datad) {
        if (datad.hasOwnProperty(k)) {
	    // console.log("datad[" + k + "]=", datad[k]);
            datad[k].project_rank = generateRank(datad[k].badge_percentage_0, datad[k].badge_percentage_1, datad[k].badge_percentage_2);
            if (datad[k].sub_project == prevProject) {
                // We have a project the same as the previous one.
                // Rearrange the previous one
                const dl1 = dataTable.length-1;
                if (dataTable[dl1].otherRepos.length == 0) {
                    const sv = dataTable[dl1];
                    dataTable[dl1] = genData(sv.sub_project, "Lowest Score", 0, 0, 0);
                    dataTable[dl1].otherRepos.push(sv);
                }
                dataTable[dl1].otherRepos.push(datad[k]);
                updateData(dataTable[dl1]);
            } else {
                datad[k].otherRepos = [];
                dataTable.push(datad[k]);
            }
            prevProject = datad[k].sub_project;
        }
    }

    // For each element in dataTable:
    //   1) add the sub_project_badge element
    //   2) add the project_rank, based on the badge percentages
    //   3) TODO: if there is more than one repo involved, set a composite score to the lowest of the repos.
    $(dataTable).each(function(index, element) {
        element.sub_project_badge = element.id;
        if (allSubProjects[currentRelease].hasOwnProperty(element.sub_project_short)) {
            allSubProjects[currentRelease][element.sub_project_short].seen = "y";
        }
    });

    for (const project in allSubProjects[currentRelease]) {
        if (allSubProjects[currentRelease].hasOwnProperty(project)) {
            const element = allSubProjects[currentRelease][project];
            if ((element.seen == "n") && (!element.skip && !parms.get("skipnotstarted", false))) {
                dataTable.push(genData(project, project, 0, 0, 0));
            }
        }
    }

    // now that we have a ranking, add the rank order
    addRankOrder(dataTable);

    const datatableButtons = ["pageLength"];

    $("#trprojects").DataTable({
        "data": dataTable,
        // "fixedHeader": true,
        // "aaSorting": [[ 0, "asc" ]],
        "paging": true,
        "pagingType": "full_numbers",
        "pageLength": parseInt(parms.get("pagelength", "30")),
        "info": false,
        "dom": "Bfrtip",
        "lengthMenu": [
            [10, 20, 25, 50, 100, -1],
            ["10 rows", "20 rows", "25 rows", "50 rows", "100 rows", "Show all"],
        ],
        "searching": true,
        "autoWidth": false,
        "buttons": datatableButtons,
        "columns": [
            {"data": "project_rank_order", "className": "textright",
                "render": function(data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
            },
            {"data": "sub_project", "render": function( data, type, row, meta ) {
                return getProject(data, type, row);
            }},
            {"data": "name", "render": function( data, type, row, meta ) {
                return getAllNames(data, type, row);
            }},
            {"data": "sub_project_badge", "render": function( data, type, row, meta ) {
                return getAllBadges(data, type, row);
            }},
            {"data": "badge_percentage_0", "render": function( data, type, row, meta ) {
                return getAllPercentages(data, type, row, "0");
            }},
            {"data": "badge_percentage_1", "render": function( data, type, row, meta ) {
                return getAllPercentages(data, type, row, "1");
            }},
            {"data": "badge_percentage_2", "render": function( data, type, row, meta ) {
                return getAllPercentages(data, type, row, "2");
            }},
        ],
    });


    addToQuestionsTable(datad, "trbronze", "bronze", "Passing", "0", editorDict);
    addToQuestionsTable(datad, "trsilver", "silver", "Silver", "1", editorDict);
    addToQuestionsTable(datad, "trgold", "gold", "Gold", "2", editorDict);

    $(".requirements_toggle").click(function() {
        $(".requirements_span").each(flipThisVisibility);
    });
    $(".summary_toggle").click(function() {
        $(".summary_span").each(flipThisVisibility);
    });
    $(".projects_toggle").click(function() {
        $(".projects_span").each(flipThisVisibility);
    });
    $(".bronze_toggle").click(function() {
        $(".bronze_span").each(flipThisVisibility);
    });
    $(".silver_toggle").click(function() {
        $(".silver_span").each(flipThisVisibility);
    });
    $(".gold_toggle").click(function() {
        $(".gold_span").each(flipThisVisibility);
    });
    $(".releasestats_toggle").click(function() {
        $(".releasestats_span").each(flipThisVisibility);
    });

    $(".bronze_detail_toggle").click(function() {
        $(".bronze_detail_span").each(flipThisVisibility);
    });
    $(".silver_detail_toggle").click(function() {
        $(".silver_detail_span").each(flipThisVisibility);
    });
    $(".gold_detail_toggle").click(function() {
        $(".gold_detail_span").each(flipThisVisibility);
    });

    $(".bronze_detail_display_all").click(function() {
        $(".bronze_detail_span").each(makeVisible);
    });
    $(".bronze_detail_display_none").click(function() {
        $(".bronze_detail_span").each(makeInvisible);
    });

    $(".bronze_show_metstats_toggle").click(function() {
        $(".bronze_show_metstats_detail_span").each(flipThisVisibility);
    });
    $(".silver_show_metstats_toggle").click(function() {
        $(".silver_show_metstats_detail_span").each(flipThisVisibility);
    });
    $(".gold_show_metstats_toggle").click(function() {
        $(".gold_show_metstats_detail_span").each(flipThisVisibility);
    });
    $(".sortby_detail_toggle").click(function() {
        $(".sortby_detail_span").each(flipThisVisibility);
    });

    $("#sort_by_name").click(function() {
        resort("by_name");
    });
    $("#sort_by_section_name").click(function() {
        resort("by_section_name");
    });
    $("#sort_by_section_type_name").click(function() {
        resort("by_section_type_name");
    });
    $("#sort_by_type_name").click(function() {
        resort("by_type_name");
    });
    $("#sort_by_type_section_name").click(function() {
        resort("by_type_section_name");
    });
    $("#sort_by_ordinal_name").click(function() {
        resort("by_ordinal_name");
    });
    $("#sort_by_ordinal_type_name").click(function() {
        resort("by_ordinal_type_name");
    });
    $("#sort_by_projectwide_name").click(function() {
        resort("by_projectwide_name");
    });
    $("#sort_by_projectwide_section_name").click(function() {
        resort("by_projectwide_section_name");
    });
    $("#sort_by_projectwide_type_name").click(function() {
        resort("by_projectwide_type_name");
    });
    $("#sort_by_name").mousedown(function() {
        startSortChange("by_name");
    });
    $("#sort_by_section_name").mousedown(function() {
        startSortChange("by_section_name");
    });
    $("#sort_by_section_type_name").mousedown(function() {
        startSortChange("by_section_type_name");
    });
    $("#sort_by_type_name").mousedown(function() {
        startSortChange("by_type_name");
    });
    $("#sort_by_type_section_name").mousedown(function() {
        startSortChange("by_type_section_name");
    });
    $("#sort_by_ordinal_name").mousedown(function() {
        startSortChange("by_ordinal_name");
    });
    $("#sort_by_ordinal_type_name").mousedown(function() {
        startSortChange("by_ordinal_type_name");
    });
    $("#sort_by_projectwide_name").mousedown(function() {
        startSortChange("by_projectwide_name");
    });
    $("#sort_by_projectwide_section_name").mousedown(function() {
        startSortChange("by_projectwide_section_name");
    });
    $("#sort_by_projectwide_type_name").mousedown(function() {
        startSortChange("by_projectwide_type_name");
    });
    $("#survey_descriptions").mousedown(function() {
        surveyDescriptions();
    });

    // TODO -- this does not work
    // $('remove-not-started-button').click(function(){
    //            window.location.search = parms.getParmListWith("skipnotstarted=1");
    //        });
    // $('add-not-started-button').href = parms.getParmListWithout("skipnotstarted");
    // if (parms.get("skipnotstarted", false)) $('#keepnotstarted').show();
    // else $('#skipnotstarted').show();

    let passingCount = 0; let silverCount = 0; let goldCount = 0;
    let nonPassingCount = 0; let nonSilverCount = 0; let nonGoldCount = 0;
    let passing80Count = 0; let silver80Count = 0; let gold80Count = 0;

    let passingMinusCount = 0; let silverMinusCount = 0; let goldMinusCount = 0;
    let nonPassingMinusCount = 0; let nonSilverMinusCount = 0; let nonGoldMinusCount = 0;
    let passing80MinusCount = 0; let silver80MinusCount = 0; let gold80MinusCount = 0;
    const totalCount = dataTable.length;

    $(dataTable).each(function(index, element) {
        if (element.badge_percentage_0 == 100) passingCount++;
        else {
            nonPassingCount++; if (element.badge_percentage_0 >= 80) {
                passing80Count++;
            }
        }
        if (element.badge_percentage_1 == 100) silverCount++;
        else {
            nonSilverCount++; if ((element.badge_percentage_0 == 100) && (element.badge_percentage_1 >= 80)) {
                silver80Count++;
            }
        }
        if (element.badge_percentage_2 == 100) goldCount++;
        else {
            nonGoldCount++; if ((element.badge_percentage_1 == 100) && (element.badge_percentage_2 >= 80)) {
                gold80Count++;
            }
        }
        // level 1-, 2-, 3-
        if (element.badge_percentage_0 >= 95) passingMinusCount++;
        else {
            nonPassingMinusCount++; if (element.badge_percentage_0 >= 80) {
                passing80MinusCount++;
            }
        }
        if (element.badge_percentage_1 >= 95) silverMinusCount++;
        else {
            nonSilverMinusCount++; if ((element.badge_percentage_0 == 100) && (element.badge_percentage_1 >= 80)) {
                silver80MinusCount++;
            }
        }
        if (element.badge_percentage_2 >= 95) goldMinusCount++;
        else {
            nonGoldMinusCount++; if ((element.badge_percentage_1 == 100) && (element.badge_percentage_2 >= 80)) {
                gold80MinusCount++;
            }
        }
    });

    const passing80Percentage = (nonPassingCount > 0) ? (100 * passing80Count / nonPassingCount) : 0;
    const passing80Needed = (nonPassingCount > 0) ? Math.ceil(0.80 * nonPassingCount) : 0;
    const silver80Percentage = (nonSilverCount > 0) ? (100 * silver80Count / nonSilverCount) : 0;
    const gold80Percentage = (nonGoldCount > 0) ? (100 * gold80Count / nonGoldCount) : 0;

    const passing80MinusPercentage = (nonPassingMinusCount > 0) ? (100 * passing80MinusCount / nonPassingMinusCount) : 0;
    const passing80MinusNeeded = (nonPassingMinusCount > 0) ? Math.ceil(0.80 * nonPassingMinusCount) : 0;
    const silver80MinusPercentage = (nonSilverMinusCount > 0) ? (100 * silver80MinusCount / nonSilverMinusCount) : 0;
    const gold80MinusPercentage = (nonGoldMinusCount > 0) ? (100 * gold80MinusCount / nonGoldMinusCount) : 0;

    $("#non-passing-level-1").html(passing80Percentage.toFixed(2));
    $("#non-passing-level-2").html(silver80Percentage.toFixed(2));
    $("#non-passing-level-3").html(gold80Percentage.toFixed(2));

    $("#non-passing-level-minus-1").html(passing80MinusPercentage.toFixed(2));
    $("#non-passing-level-minus-2").html(silver80MinusPercentage.toFixed(2));
    $("#non-passing-level-minus-3").html(gold80MinusPercentage.toFixed(2));

    const passingPercentage = (100 * passingCount / totalCount);
    const passingNeeded = Math.ceil(0.70 * totalCount);
    const silverPercentage = (100 * silverCount / totalCount);
    const goldPercentage = (100 * goldCount / totalCount);

    const passingMinusPercentage = (100 * passingMinusCount / totalCount);
    const passingMinusNeeded = Math.ceil(0.70 * totalCount);
    const silverMinusPercentage = (100 * silverMinusCount / totalCount);
    const goldMinusPercentage = (100 * goldMinusCount / totalCount);

    const color = getColor(passingPercentage, silverPercentage, goldPercentage);

    $("#passing-level-1").html(passingPercentage.toFixed(2));
    $("#passing-level-2").html(silverPercentage.toFixed(2));
    $("#passing-level-3").html(goldPercentage.toFixed(2));

    $("#passing-level-minus-1").html(passingMinusPercentage.toFixed(2));
    $("#passing-level-minus-2").html(silverMinusPercentage.toFixed(2));
    $("#passing-level-minus-3").html(goldMinusPercentage.toFixed(2));

    const showOneMinus = 1; // parms.get("showminus", false);

    let level = "0";
    if (showOneMinus) {
        if ((passingMinusPercentage >= 70) && ((nonPassingMinusCount == 0) || (passing80MinusPercentage >= 80))) {
            level = "1-minus";
        }
    }
    if ((passingPercentage >= 70) && ((nonPassingCount == 0) || (passing80Percentage >= 80))) {
        level = "1";
    }
    if (showOneMinus) {
        if ((silverMinusPercentage >= 70) && ((nonSilverMinusCount == 0) || (silver80MinusPercentage >= 80))) {
            level = "2-minus";
        }
    }
    if ((silverPercentage >= 70) && ((nonSilverCount == 0) || (silver80Percentage >= 80))) {
        level = "2";
    }
    if (showOneMinus) {
        if ((goldMinusPercentage >= 70) && ((nonGoldMinusCount == 0) || (gold80MinusPercentage >= 80))) {
            level = "3-minus";
        }
    }
    if ((goldPercentage >= 70) && ((nonGoldCount == 0) || (gold80Percentage >= 80))) {
        level = "3";
    }
    if (goldPercentage == 100) {
        level = 4;
    }

    $("#trsummary").append(
        "<thead><tr>" +
                     "<th>&nbsp;</th>" +
                     "<th>Passing</th>" +
                     "<th>Silver</th>" +
                     "<th>Gold</th>" +
                     "</tr></thead>",
    );

    if (showOneMinus) {
        $("#level1minus").show();
    }

    if (showOneMinus) {
        $("#trsummary").append(
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
                     "</td>" + "</tr>",
        );
    }

    if (showOneMinus) {
        $("#trsummary").append(
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
                     "</tr>",
        );
    }

    $("#trsummary").append(
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
                     "</td>" + "</tr>",
    );

    $("#trsummary").append(
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
                     "</tr>",
    );

    const textcolor = (color == gold) ? black : (color == silver) ? black : white;

    $("#trsummary").append(
        "<tr>" +
                     "<th>Current&nbsp;Level</th>" +
                     "<td class='center' colspan='3' style='color: " + textcolor + "; background-color: " + color + "'><br/>Level&nbsp;" + level + "<br/><br/></td>" +
                     "</tr>",
    );


    const turnoff = parms.get("turnoff", "");
    if (turnoff != "") {
        const turnoffs = turnoff.split(",");
        for (let i = 0; i < turnoffs.length; i++) {
            $("." + turnoffs[i] + "_span").each(flipThisVisibility);
        }
    }

    createHistoricalStats();
    fillHistoricalStatsForHistoricalReleases();
    // fillHistoricalStatsForRelease(currentRelease, datad, true);
    fillRemainingHistoricalStats();
    showHistoricalInfo();

    $(".sortby_" + sortBy).prop("checked", true);
    // $('#sortby_form').prop('action',window.location);
    const pd = parms.getParmsAsDict();
    for (const p in pd) {
        if (p != "sortby") {
            $("#sortby_form").append("<input type='hidden' name='" + p + "' value='" + pd[p] + "'/>");
        }
    }
    // $('.sortby_submit').prop('class', 'alternateColor_' + sortBy);

    startSortChange(initSortBy);
    resort(initSortBy);
    $("#datacheck").html(datacheck());
}

{
    const pagelist = genPageList(parms.get("page", "1-9"));
    const datad = [];
    const editorNames = [];
    getNextUrl(datad, editorNames, pagelist, 0);
    // if any thing needs to be done, add it to whenDone()
}
