/* eslint-disable require-jsdoc,no-unused-vars */

// A sample of repo_urls captured during a run:
//
// Bad URLs:
// "repo_url": "https://gerrit.onap.org",    <- bad, not specific
// "repo_url": "https://gerrit.onap.org/r/#/admin/projects", <- bad, not specific
//
// Semi-bad URLs:
// "repo_url": "https://gerrit.onap.org/r/msb",        <- bad, 404, but recognizable
// "repo_url": "https://gerrit.onap.org/r/sdc",        <- bad, 404, but recognizable
// "repo_url": "https://gerrit.onap.org/r/so",        <- bad, 404, but recognizable
// "repo_url": "https://gerrit.onap.org/r/vfc",        <- bad, 404, but recognizable
// "repo_url": "https://gerrit.onap.org/r/vid",        <- bad, 404, but recognizable
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


function escapeSlash(pat) {
    return pat.replaceAll('/', '[/]').replaceAll('+', '[+]');
}

const repoUrlPatterns = [
    escapeSlash('^https://gerrit.onap.org/r/admin/repos/q/filter:(.*)$'),
    escapeSlash('^https://gerrit.onap.org/r/#/admin/projects/(.*)$'),
    escapeSlash('^https://gerrit.onap.org/r/admin/repos/(.*)/parent$'),
    escapeSlash('^https://gerrit.onap.org/r/p/(.*)([.]git)$'),
    escapeSlash('^https://gerrit.onap.org/r/(.*)$'),
    escapeSlash('^https://git.onap.org/(.*)$'),
    escapeSlash('^https://wiki.onap.org/display/DW/(.*)+Project$'),
    escapeSlash('^https://gerrit.onap.org/r/admin/repos/q/filter:(.*)$'),
];
const goodRepoUrlPrefix = 'https://gerrit.onap.org/r/#/admin/projects/';

const openssfSearchQuery = 'onap';
const projectName = 'ONAP';
