<!DOCTYPE html>
<html>
<head>
<meta content='text/html;charset=utf-8' http-equiv='Content-Type'>
<meta content='utf-8' http-equiv='encoding'>
<title>ONAP Project Core Infrastructure Initiative (CII) Badging Status Dashboard</title>
<script src='http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>
<script src='https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js'></script>
<script src='cii-historical-info.js'></script>
<link type='text/css' rel='stylesheet' href='https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css'/>
</head>
<body>
<script>
var onapGerritPrefix = "https://gerrit.onap.org/r/#/admin/projects/";

function sanitizeRelease(r) {
    console.log("looking for release '" + r + "'");
    for (k = 0; k < releases.length; k++) {
        var release = releases[k];
        if (r == release) {
            console.log("found the release");
            return r;
        }
    }
    console.log("release not found, returning 'current'");
    return "current";
}

</script>
<?php

$phpname = basename(__FILE__);

$help = $_GET["help"];
if ($help != '') {
  echo("project=onap or all<br/>\n");
  echo("page=1-2,5-6 (only valid for project=all)<br/>\n");
  echo("addMissingOnapProjects=y<br/>\n");
  echo("jsonformat=pretty<br/>\n");
  echo("debug=y<br/>\n");
  exit();
}

$debug = $_GET["debug"];
$script = "script";
if ($debug == 'y') $script = "pre";

$useproxy = $_GET["useproxy"];
if ($useproxy == 'y') {
    $proxy = "http://one.proxy.att.com:8888";
} else {
    $proxy = "";
}

$project = $_GET["project"];
echo "<!-- project=$project -->";

if ($project == '') {
  $project = "onap";
 }

if ($project == "onap") {
  echo "<!-- project=$project -->";
  $OFFSET=43;  // length(onapGerritPrefix)
  $BASEURL="https://bestpractices.coreinfrastructure.org/projects?q=ONAP";
  $BASEURL="get-onap-cii-statuses.cgi?q=ONAP";
  $URLSUFFIX = "";
  $IGNOREPAGE = true;
  // $IGNOREPAGE = false;
  $PROJECTTITLE = "ONAP";
 } else if ($project == "all") {
  $OFFSET = 0;
  $BASEURL="https://bestpractices.coreinfrastructure.org/projects";
  $BASEURL="get-onap-cii-statuses.cgi";
  $URLSUFFIX = "?page=";
  $IGNOREPAGE = false;
  $PROJECTTITLE = "All";
 } else {
  echo "project not onap or all";
  exit();
 }
?>
<style type='text/css'>
table, th, td {
    border-collapse: collapse;
    border: solid black 1px;
}
.right {
    float: right;
}
.textright {
    text-align: right;
}
.textleft {
    text-align: textleft;
}
.center {
    text-align: center;
}

</style>
<div class='right'><img src='https://wiki.onap.org/download/thumbnails/1015829/onap_704x271%20copy.png'/><br/>
<?php
$optlist = "";
$opts = array("debug","useproxy","jsonformat");
foreach ($opts as $opt) {
    if ($_GET[$opt] != '') $optlist .= "&" . $opt . "=" . $_GET[$opt];
}
?>
ONAP Projects:&nbsp;&nbsp;&nbsp;<a href="?project=onap<?php echo($optlist); ?>">Registered</a>&nbsp;&nbsp;&nbsp;<a href="?project=onap&addMissingOnapProjects=y<?php echo($optlist); ?>">All</a><br/>
All Projects:&nbsp;&nbsp;&nbsp;<a href="?project=all&page=1-2<?php echo($optlist); ?>">Sample</a>&nbsp;&nbsp;&nbsp;<a href="?project=all&page=1-99<?php echo($optlist); ?>">All</a>
</div>
<h1><?php echo($PROJECTTITLE); ?> Project Core Infrastructure Initiative (<a href='https://bestpractices.coreinfrastructure.org/'>CII</a>) Badging Status Dashboard</h1>

<span id='working'></span>
<h3><a href='https://wiki.onap.org'>ONAP</a> Platform-level <a href='https://wiki.onap.org/pages/viewpage.action?pageId=15998867'>Requirements</a></h3>
<ul>
<li> Level 1: 70 % of the projects passing the level 1 <br/>
        with the non-passing projects reaching 80% passing level <br/>
        Non-passing projects MUST pass specific cryptography criteria outlined by the Security Subcommittee*
<li>    Level 2: 70 % of the projects passing silver <br/>
        with non-silver projects completed passing level and 80% towards silver level
<li>    Level 3: 70% of the projects passing gold <br/>
        with non-gold projects achieving silver level and achieving 80% towards gold level
<li>    Level 4: 100 % passing gold.
</ul>

<h2>Summary</h2>
<table id='tr2' class='display compact'>
<thead><tr>
<th>&nbsp;</th>
<th>Passing</th>
<th>Silver</th>
<th>Gold</th>
</tr></thead>
</table>

<h2><?php echo($PROJECTTITLE); ?> Projects</h2>
<table id='tr' class="display compact" >
<thead><tr>
<th>RankOrder</th>
<th>Project Name<br/>(from URL)</th>
<th>Project Name</th>
<th>Badge</th>
<th>%&nbsp;Passing</th>
<th>%&nbsp;Silver</th>
<th>%&nbsp;Gold</th>
<!-- th>Rank</th -->
<!-- th>Loc</th -->
</tr></thead>
<tfoot><tr>
<th>RankOrder</th>
<th>Project Name<br/>(from URL)</th>
<th>Project Name</th>
<th>Badge</th>
<th>%&nbsp;Passing</th>
<th>%&nbsp;Silver</th>
<th>%&nbsp;Gold</th>
<!-- th>Rank</th -->
<!-- th>Loc</th -->
</tr></tfoot>
</table>

<?php echo("<$script>\n"); ?>
var datad = [];

<?php
$jsonformat = $_GET["jsonformat"];
if ($jsonformat == "pretty") {
  $prettyjson = JSON_PRETTY_PRINT;
 } else {
  $prettyjson = 0;
 }

$r0 = $_GET["r0"];
$r1 = $_GET["r1"];
if ($r1 == '') $r1 = 'current';
echo("var r0 = sanitizeRelease('" . $r0 . "');\n");
echo("var r1 = sanitizeRelease('" . $r1 . "');\n");

$page = $_GET["page"];

if ($page == '') {
  $page = "1-9";
 }
if ($IGNOREPAGE) {
  $URLSUFFIX = '';
  $page = "1";
 }

echo("// page='" . $page . "'\n");
$dataindex = 0;

foreach (explode(",", $page) as $pagelist) {
  list($start,$end) = explode("-", $pagelist);
  if ($end == '') $end = $start;

  for ($i = (int)$start; $i <= (int)$end; $i++) {
    $URL = $BASEURL;
    if ($URLSUFFIX != '') {
      $URL .= $URLSUFFIX;
      $URL .= strval($i);
    }

    // http://www.php.net/manual/en/function.curl-exec.php
    // http://php.net/manual/en/function.curl-setopt.php
    $ch = curl_init($URL);
    echo("// URL='$URL'\n");
    $headers = array( "Accept: application/json" );

    if ($proxy != '') curl_setopt($ch, CURLOPT_PROXY, $proxy);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $data = curl_exec($ch);
    curl_close($ch);

    if ($data == '[]') {
      echo("// no data for page $i\n");
      break;
    }

    echo("datad[$dataindex]=");
    echo(json_encode(json_decode($data, true), $prettyjson));
    echo(";\n");
    $dataindex++;
  }
}

echo("OFFSET=$OFFSET;\n");

?>

// store the current data into data[]
function pushData(whereTo, whereFrom) {
    console.log("pushData() called");
    $(whereFrom).each(function(index, element) {
        console.log("pushing element: " + element.id + "/" + element.name);
        whereTo.push(element);
    });
}

// var data = [];
releaseData["current"] = [];
$(datad).each(function(index, element) {
    console.log("pushing datad[" + index + "]");
    pushData(releaseData["current"], datad[index]);
});

// add rank information everywhere
function addRanks(d) {
    $(d).each(function(index, element) {
        element.rank = element.badge_percentage_0 * 1000000 + element.badge_percentage_1 * 1000 + element.badge_percentage_2;
        console.log("element.id=" + element.id + ", .rank=" + element.rank);
    });
}

// addRanks(data);
$(releaseData).each(function(index, element) {
    console.log("adding ranks to releaseData[" + index + "]");
    addRanks(element);
});

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

$(releaseData["current"]).each(function(index, element) {
    if (element.repo_url.substring(0,43) == onapGerritPrefix) {
        allOnapProjects[element.repo_url.substring(43)] = "y";
    }
});

var addMissingOnapProjects = "<?php echo($_GET["addMissingOnapProjects"]); ?>";

if (addMissingOnapProjects == "y") {
    for (var k in allOnapProjects) {
        releaseData["current"].push({ "repo_url": onapGerritPrefix + k, "name": k, "_badge": "cii-not-started.png", "rank": 0, "badge_percentage_0": 0,  "badge_percentage_1": 0,  "badge_percentage_2": 0 });
    }
}

function addRankOrder(d) {
    d.sort(function(a,b) {
        return b.rank - a.rank;
    });
    var prev = -1;
    var iprev = -1;
    for (var i = 0; i < d.length; i++) {
        if (d[i].rank == prev) {
            d[i].rankorder = iprev + 1;
        } else {
            d[i].rankorder = i + 1;
            prev = d[i].rank;
            iprev = i;
        }
    }
}

addRankOrder(releaseData["current"]);

$(document).ready(function() {

function stripurl(url, doupper) {
    var str = doupper ? url.toUpperCase().substring(OFFSET) : url.substring(OFFSET);
    str = str.replace(/\/$/, "").replace(/^.*\//, "");
    return str;
}

releaseData["current"].sort(function(a,b) {
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
// var totalPassing80Count = totalSilver80Count = totalGold80Count = 0;
var totalCount = releaseData["current"].length;

var displayData = [];

$(releaseData["current"]).each(function(index, element) {
    displayData.push({
        "repo_url": stripurl(element.repo_url, false),
        "name": element.name,
        "badge": element._badge ? element._badge : ("https://bestpractices.coreinfrastructure.org/projects/" + element.id + "/badge"),
        "rank": element.rank,
        "badge_percentage_0": element.badge_percentage_0,
        "badge_percentage_1": element.badge_percentage_1,
        "badge_percentage_2": element.badge_percentage_2,
        "rankorder": element.rankorder
    });

    if (element.badge_percentage_0 == 100) passingCount++;
    else { nonPassingCount++; if (element.badge_percentage_0 >= 80) { passing80Count++; } }
    if (element.badge_percentage_1 == 100) silverCount++;
    else { nonSilverCount++; if ((element.badge_percentage_0 == 100) && (element.badge_percentage_1 >= 80)) { silver80Count++; } }
    if (element.badge_percentage_2 == 100) goldCount++;
    else { nonGoldCount++; if ((element.badge_percentage_1 == 100) && (element.badge_percentage_2 >= 80)) { gold80Count++; } }

});

var releaseIndices = {};
console.log("hd=" + releaseData);
for (k = 0; k < releases.length; k++) {
    var release = releases[k];
    releaseIndices[release] = {};
    var hdk = releaseData[release];
    console.log("r[" + k + "]=" + releases[k] + ", h[" + k + "]=" + hdk);
    for (l = 0; l < hdk.length; l++) {
        console.log("hdk[" + l + "]=" + hdk[l]);
        releaseIndices[release][stripurl(hdk[l].repo_url, false)] = l;
    }
}

$('#tr').DataTable({
        "paging":   false,
        "info":     false,
        "searching": false,
        "data": displayData,
        "autoWidth": false,
        "columns": [
            { "data": "rankorder", className: "textright" },
            { "data": "repo_url" },
            { "data": "name" },
            { "data": "badge",
              "render": function ( data, type, row, meta ) {
                      return type === 'display' ?  '<img src="'+data+'"/>' : data;
              }
            },
            { "data": "badge_percentage_0", 
              "render": function ( data, type, row, meta ) {
                return type === "display" ? ("ABC " + data) : data;
              },
              className: "textright" },
            { "data": "badge_percentage_1", className: "textright" },
            { "data": "badge_percentage_2", className: "textright" },
        ]
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


});
<?php echo("</$script>\n"); ?>
</body>
</html>
