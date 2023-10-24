/* eslint-disable require-jsdoc,no-unused-vars */

function escapeSlash(pat) {
    return pat.replaceAll("/", "[/]").replaceAll("+", "[+]");
}

// https://github.com/odpi/egeria
// https://github.com/milvus-io/milvus
// https://github.com/onnx/onnx
// https://github.com/elasticdeeplearning/edl
// https://github.com/uber/horovod
// https://github.com/pyro-ppl/pyro
// https://gerrit.acumos.org/r/admin/repos
// https://github.com/Angel-ML/angel

const repoUrlPatterns = [
    escapeSlash("^https://github.com/(.*)$")
];
const goodRepoUrlPrefix = "https://github.com/";

const projectReleases = {};
const projectHistoricalReleaseData = {};
const openssfSearchQuery = null;

const projectCurrentRelease = "1.0";
const projectAllSubProjects = {
    "1.0": {},
};
const projectCheckProjects = false;

const projectParms = new Query();
const openssfProjectIds = projectParms.get("ID", "").concat(",", projectParms.get("IDs", "")).replace(/^,*/, "").replace(/,*$/, "").replace(/^$/, "1").split(/, */);
// console.log("openssfProjectIds=" + openssfProjectIds);

const projectName = "Your";
const openssfEditors = [
];
