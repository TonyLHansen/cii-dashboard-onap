var requiredFields =
{
    "bronze": [
	       "build",
	       "contribution",
	       "crypto_floss",
	       "crypto_keylength",
	       "crypto_password_storage",
	       "crypto_published",
	       "crypto_random",
	       "crypto_working",
	       "delivery_mitm",
	       "delivery_unsigned",
	       "description_good",
	       "discussion",
	       "documentation_basics",
	       "documentation_interface",
	       "dynamic_analysis_fixed",
	       "floss_license",
	       "interact",
	       "know_common_errors",
	       "know_secure_design",
	       "license_location",
	       "no_leaked_credentials",
	       "release_notes",
	       "release_notes_vulns",
	       "repo_interim",
	       "repo_public",
	       "repo_track",
	       "report_archive",
	       "report_process",
	       "report_responses",
	       "sites_https",
	       "static_analysis",
	       "static_analysis_fixed",
	       "test",
	       "test_policy",
	       "tests_are_added",
	       "version_unique",
	       "vulnerabilities_fixed_60_days",
	       "vulnerability_report_private",
	       "vulnerability_report_process",
	       "vulnerability_report_response",
	       "warnings",
	       "warnings_fixed",
	       ],
    "bronzeOptional": [
		       "build_common_tools",
		       "build_floss_tools",
		       "contribution_requirements",
		       "crypto_call",
		       "crypto_pfs",
		       "crypto_weaknesses",
		       "dynamic_analysis",
		       "dynamic_analysis_enable_assertions",
		       "dynamic_analysis_unsafe",
		       "english",
		       "enhancement_responses",
		       "floss_license_osi",
		       "repo_distributed",
		       "report_tracker",
		       "static_analysis_common_vulnerabilities",
		       "static_analysis_often",
		       "test_continuous_integration",
		       "test_invocation",
		       "test_most",
		       "tests_documented_added",
		       "version_semver",
		       "version_tags",
		       "vulnerabilities_critical_fixed",
		       "warnings_strict",
		       ],
    "silver": [
	       "access_continuity",
	       "achieve_passing",
	       "assurance_case",
	       "automated_integration_testing",
	       "build_non_recursive",
	       "build_repeatable",
	       "build_standard_variables",
	       "code_of_conduct",
	       "coding_standards",
	       "coding_standards_enforced",
	       "contribution_requirements",
	       "crypto_certificate_verification",
	       "crypto_credential_agility",
	       "crypto_verification_private",
	       "crypto_weaknesses",
	       "dependency_monitoring",
	       "documentation_achievements",
	       "documentation_architecture",
	       "documentation_current",
	       "documentation_quick_start",
	       "documentation_roadmap",
	       "documentation_security",
	       "dynamic_analysis_unsafe",
	       "external_dependencies",
	       "governance",
	       "implement_secure_design",
	       "input_validation",
	       "installation_common",
	       "installation_development_quick",
	       "installation_standard_variables",
	       "maintenance_or_update",
	       "regression_tests_added50",
	       "report_tracker",
	       "roles_responsibilities",
	       "signed_releases",
	       "sites_password_security",
	       "static_analysis_common_vulnerabilities",
	       "test_policy_mandated",
	       "test_statement_coverage80",
	       "tests_documented_added",
	       "updateable_reused_components",
	       "vulnerability_report_credit",
	       "vulnerability_response_process",
	       "warnings_strict",
	       ],

    "silverOptional": [
		       "dco",
		       "bus_factor",
		       "accessibility_best_practices",
		       "internationalization",
		       "build_preserve_debug",
		       "interfaces_current",
		       "crypto_algorithm_agility",
		       "crypto_used_network",
		       "crypto_tls12",
		       "version_tags_signed",
		       "hardening",
    ],

    "gold": [
	     "achieve_silver",
	     "build_reproducible",
	     "bus_factor",
	     "code_review_standards",
	     "contributors_unassociated",
	     "copyright_per_file",
	     "crypto_tls12",
	     "crypto_used_network",
	     "hardened_site",
	     "hardening",
	     "license_per_file",
	     "repo_distributed",
	     "require_2FA",
	     "security_review",
	     "small_tasks",
	     "test_branch_coverage80",
	     "test_continuous_integration",
	     "test_invocation",
	     "test_statement_coverage90",
	     "two_person_review",
	     ],

    "goldOptional": [
		     "secure_2FA",
		     "dynamic_analysis_enable_assertions",
		     ],

    "all": [
	    "access_continuity",
	    "accessibility_best_practices",
	    "achieve_passing",
	    "assurance_case",
	    "automated_integration_testing",
	    "build_common_tools",
	    "build_floss_tools",
	    "build_non_recursive",
	    "build_preserve_debug",
	    "build_repeatable",
	    "build_reproducible",
	    "build_standard_variables",
	    "build",
	    "bus_factor",
	    "code_of_conduct",
	    "code_review_standards",
	    "coding_standards_enforced",
	    "coding_standards",
	    "contribution_requirements",
	    "contribution",
	    "contributors_unassociated",
	    "copyright_per_file",
	    "crypto_algorithm_agility",
	    "crypto_call",
	    "crypto_certificate_verification",
	    "crypto_credential_agility",
	    "crypto_floss",
	    "crypto_keylength",
	    "crypto_password_storage",
	    "crypto_pfs",
	    "crypto_published",
	    "crypto_random",
	    "crypto_tls12",
	    "crypto_used_network",
	    "crypto_verification_private",
	    "crypto_weaknesses",
	    "crypto_working",
	    "dco",
	    "delivery_mitm",
	    "delivery_unsigned",
	    "dependency_monitoring",
	    "description_good",
	    "discussion",
	    "documentation_achievements",
	    "documentation_architecture",
	    "documentation_basics",
	    "documentation_current",
	    "documentation_interface",
	    "documentation_quick_start",
	    "documentation_roadmap",
	    "documentation_security",
	    "dynamic_analysis_enable_assertions",
	    "dynamic_analysis_fixed",
	    "dynamic_analysis",
	    "dynamic_analysis_unsafe",
	    "english",
	    "enhancement_responses",
	    "external_dependencies",
	    "floss_license_osi",
	    "floss_license",
	    "governance",
	    "hardened_site",
	    "hardening",
	    "homepage_url",
	    "implement_secure_design",
	    "input_validation",
	    "installation_common",
	    "installation_development_quick",
	    "installation_standard_variables",
	    "interact",
	    "interfaces_current",
	    "internationalization",
	    "know_common_errors",
	    "know_secure_design",
	    "license_location",
	    "license_per_file",
	    "maintenance_or_update",
	    "no_leaked_credentials",
	    "regression_tests_added50",
	    "release_notes",
	    "release_notes_vulns",
	    "repo_distributed",
	    "repo_interim",
	    "repo_public",
	    "repo_track",
	    "report_archive",
	    "report_process",
	    "report_responses",
	    "report_tracker",
	    "report_url",
	    "require_2FA",
	    "roles_responsibilities",
	    "secure_2FA",
	    "security_review",
	    "signed_releases",
	    "sites_https",
	    "sites_password_security",
	    "small_tasks",
	    "static_analysis_common_vulnerabilities",
	    "static_analysis_fixed",
	    "static_analysis_often",
	    "static_analysis",
	    "test_branch_coverage80",
	    "test_continuous_integration",
	    "test_invocation",
	    "test_most",
	    "test_policy_mandated",
	    "test_policy",
	    "test_statement_coverage80",
	    "test_statement_coverage90",
	    "test",
	    "tests_are_added",
	    "tests_documented_added",
	    "two_person_review",
	    "updateable_reused_components",
	    "version_semver",
	    "version_tags_signed",
	    "version_tags",
	    "version_unique",
	    "vulnerabilities_critical_fixed",
	    "vulnerabilities_fixed_60_days",
	    "vulnerability_report_credit",
	    "vulnerability_report_private",
	    "vulnerability_report_process",
	    "vulnerability_report_response",
	    "vulnerability_response_process",
	    "warnings_fixed",
	    "warnings",
	    "warnings_strict",
	    ]
};
