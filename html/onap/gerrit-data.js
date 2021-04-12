)]}'
{
  "All-Users": {
    "id": "All-Users",
    "description": "Individual user settings and preferences.",
    "state": "ACTIVE"
  },
  "aaf/authz": {
    "id": "aaf%2Fauthz",
    "description": "This module is used to organize all of the common artifacts and capabilities that are inherited by all modules.  This prevents duplication of these common artifacts, plugins, and\nother settings and provides a single place to support this configuration.",
    "state": "ACTIVE"
  },
  "aaf/cadi": {
    "id": "aaf%2Fcadi",
    "description": "Collection of Authentication and Authorization Plugins, technology specific clients, configuration tooling and encryption tooling, designed to enable Services to quickly and securely integrate Security.",
    "state": "ACTIVE"
  },
  "aaf/inno": {
    "id": "aaf%2Finno",
    "description": "Collection of low level, dependency free classes to enable CADI and Authz. Example: Audit Trail technology, which, allows step by step timing for debugging purposes",
    "state": "ACTIVE"
  },
  "aaf/luaplugin": {
    "id": "aaf%2Fluaplugin",
    "description": "A lua plugin to integrate AAF with MSB, which provides centralized auth features at the API Gateway.",
    "state": "ACTIVE"
  },
  "aaf/sms": {
    "id": "aaf%2Fsms",
    "description": "Secret Management Service that will contain the webservice as well as client code for managing and accessing secrets.",
    "state": "ACTIVE"
  },
  "aaf/sshsm": {
    "id": "aaf%2Fsshsm",
    "description": "A repository for softhsm modifications and hardware security plugin.",
    "state": "ACTIVE"
  },
  "aai/aai-common": {
    "id": "aai%2Faai-common",
    "description": "This holds the model, annotations and common modules used across the Resources and Traversal micro services",
    "state": "ACTIVE"
  },
  "aai/aai-config": {
    "id": "aai%2Faai-config",
    "description": "AAI Chef cookbooks",
    "state": "ACTIVE"
  },
  "aai/aai-data": {
    "id": "aai%2Faai-data",
    "description": "AAI Chef environment files",
    "state": "ACTIVE"
  },
  "aai/aai-service": {
    "id": "aai%2Faai-service",
    "description": "AAI REST based services",
    "state": "READ_ONLY"
  },
  "aai/babel": {
    "id": "aai%2Fbabel",
    "description": "AAI Microservice to generate AAI model XML from SDC TOSCA CSAR artifacts",
    "state": "ACTIVE"
  },
  "aai/chameleon": {
    "id": "aai%2Fchameleon",
    "description": "Abstraction service for historical database",
    "state": "ACTIVE"
  },
  "aai/champ": {
    "id": "aai%2Fchamp",
    "description": "Abstraction from underlying graph storage systems that A\u0026AI would interface with.",
    "state": "ACTIVE"
  },
  "aai/data-router": {
    "id": "aai%2Fdata-router",
    "description": "AAI Micro Service used to route/persist AAI event data for consumption by the UI",
    "state": "ACTIVE"
  },
  "aai/eis": {
    "id": "aai%2Feis",
    "description": "Microservice used to manage entity identities across systems.",
    "state": "ACTIVE"
  },
  "aai/esr-gui": {
    "id": "aai%2Fesr-gui",
    "description": "External system management ui",
    "state": "ACTIVE"
  },
  "aai/esr-server": {
    "id": "aai%2Fesr-server",
    "description": "ESR backend, mainly include the function of external system reachable check and data pretreatment",
    "state": "ACTIVE"
  },
  "aai/event-client": {
    "id": "aai%2Fevent-client",
    "description": "Library to manage interactions with an event bus.",
    "state": "ACTIVE"
  },
  "aai/gallifrey": {
    "id": "aai%2Fgallifrey",
    "description": "Transformation service between AAI-modelled data, operations and gallifrey representation",
    "state": "ACTIVE"
  },
  "aai/gap": {
    "id": "aai%2Fgap",
    "description": "A get and publish microservice  which extracts entities from A\u0026AI and publishes them to an event topic.",
    "state": "ACTIVE"
  },
  "aai/gizmo": {
    "id": "aai%2Fgizmo",
    "description": "CRUD Rest API endpoint for resources and relationships, delivering atomic interactions with the graph for improved scalability.",
    "state": "ACTIVE"
  },
  "aai/graphadmin": {
    "id": "aai%2Fgraphadmin",
    "description": "Microservice with various functions for graph management.",
    "state": "ACTIVE"
  },
  "aai/graphgraph": {
    "id": "aai%2Fgraphgraph",
    "description": "Microservice used to provide view of AAI model, schema and edge rules.",
    "state": "ACTIVE"
  },
  "aai/logging-service": {
    "id": "aai%2Flogging-service",
    "description": "AAI common logging library",
    "state": "ACTIVE"
  },
  "aai/model-loader": {
    "id": "aai%2Fmodel-loader",
    "description": "Loads SDC Models into A\u0026AI",
    "state": "ACTIVE"
  },
  "aai/resources": {
    "id": "aai%2Fresources",
    "description": "AAI Resources Micro Service providing CRUD REST APIs for inventory resources",
    "state": "ACTIVE"
  },
  "aai/rest-client": {
    "id": "aai%2Frest-client",
    "description": "Library for making REST calls",
    "state": "ACTIVE"
  },
  "aai/router-core": {
    "id": "aai%2Frouter-core",
    "description": "Library containing the core camel components for the data router",
    "state": "ACTIVE"
  },
  "aai/search-data-service": {
    "id": "aai%2Fsearch-data-service",
    "description": "Service for persisting data to a search database",
    "state": "ACTIVE"
  },
  "aai/sparky-be": {
    "id": "aai%2Fsparky-be",
    "description": "AAI user interface back end",
    "state": "ACTIVE"
  },
  "aai/sparky-fe": {
    "id": "aai%2Fsparky-fe",
    "description": "AAI user interface front end",
    "state": "ACTIVE"
  },
  "aai/spike": {
    "id": "aai%2Fspike",
    "description": "Microservice used to generate events describing changes to the graph data.",
    "state": "ACTIVE"
  },
  "aai/tabular-data-service": {
    "id": "aai%2Ftabular-data-service",
    "description": "Microservice which serves as an abstraction layer to a tabular data store.",
    "state": "ACTIVE"
  },
  "aai/test-config": {
    "id": "aai%2Ftest-config",
    "description": "Repository containing test configuration for use in continuous integration",
    "state": "ACTIVE"
  },
  "aai/traversal": {
    "id": "aai%2Ftraversal",
    "description": "AAI Traversal Micro Service providing REST APIs for traversal/search of inventory resources",
    "state": "ACTIVE"
  },
  "appc": {
    "id": "appc",
    "description": "APPC Core",
    "state": "ACTIVE"
  },
  "appc/cdt": {
    "id": "appc%2Fcdt",
    "description": "APPC Configuration Design Tool.",
    "state": "ACTIVE"
  },
  "appc/deployment": {
    "id": "appc%2Fdeployment",
    "description": "APPC docker deployment",
    "state": "ACTIVE"
  },
  "ccsdk/dashboard": {
    "id": "ccsdk%2Fdashboard",
    "description": "Dashboard",
    "state": "ACTIVE"
  },
  "ccsdk/distribution": {
    "id": "ccsdk%2Fdistribution",
    "description": "CCSDK distribution packaging (e.g. docker containers)",
    "state": "ACTIVE"
  },
  "ccsdk/parent": {
    "id": "ccsdk%2Fparent",
    "description": "Parent POMs to be used by CCSDK clients",
    "state": "ACTIVE"
  },
  "ccsdk/platform/blueprints": {
    "id": "ccsdk%2Fplatform%2Fblueprints",
    "description": "Blueprints",
    "state": "ACTIVE"
  },
  "ccsdk/platform/nbapi": {
    "id": "ccsdk%2Fplatform%2Fnbapi",
    "description": "Northbound API",
    "state": "ACTIVE"
  },
  "ccsdk/platform/plugins": {
    "id": "ccsdk%2Fplatform%2Fplugins",
    "description": "Platform plugins",
    "state": "ACTIVE"
  },
  "ccsdk/sli/adaptors": {
    "id": "ccsdk%2Fsli%2Fadaptors",
    "description": "Common adaptors for use by directed graphs",
    "state": "ACTIVE"
  },
  "ccsdk/sli/core": {
    "id": "ccsdk%2Fsli%2Fcore",
    "description": "Core Service Logic Interpreter classes",
    "state": "ACTIVE"
  },
  "ccsdk/sli/northbound": {
    "id": "ccsdk%2Fsli%2Fnorthbound",
    "description": "Common northbound APIs related to service logic interpreter",
    "state": "ACTIVE"
  },
  "ccsdk/sli/plugins": {
    "id": "ccsdk%2Fsli%2Fplugins",
    "description": "Common plugins used by directed graphs",
    "state": "ACTIVE"
  },
  "ccsdk/storage/esaas": {
    "id": "ccsdk%2Fstorage%2Fesaas",
    "description": "Elastic Storage as a Service",
    "state": "ACTIVE"
  },
  "ccsdk/storage/pgaas": {
    "id": "ccsdk%2Fstorage%2Fpgaas",
    "description": "PGAAS",
    "state": "ACTIVE"
  },
  "ccsdk/utils": {
    "id": "ccsdk%2Futils",
    "description": "Utilities",
    "state": "ACTIVE"
  },
  "ci-management": {
    "id": "ci-management",
    "description": "Management repo for Jenkins Job Builder, builder scripts and management related to the CI configuration.",
    "state": "ACTIVE"
  },
  "cla": {
    "id": "cla",
    "state": "ACTIVE"
  },
  "clamp": {
    "id": "clamp",
    "description": "CLAMP is a platform for designing and managing control loops.",
    "state": "ACTIVE"
  },
  "cli": {
    "id": "cli",
    "description": "Provides required Command Line Interface for ONAP",
    "state": "ACTIVE"
  },
  "dcae": {
    "id": "dcae",
    "description": "Top level DCAE project - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/apod": {
    "id": "dcae%2Fapod",
    "description": "Top level APOD (Analytics Platform of DCAE) project - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/apod/analytics": {
    "id": "dcae%2Fapod%2Fanalytics",
    "description": "DCAE Analytics applications - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/apod/buildtools": {
    "id": "dcae%2Fapod%2Fbuildtools",
    "description": "Tools for building and packaging DCAE Analytics applications for deployment - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/apod/cdap": {
    "id": "dcae%2Fapod%2Fcdap",
    "description": "DCAE Analytics\u0027 CDAP cluster installation - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/collectors": {
    "id": "dcae%2Fcollectors",
    "description": "Top level for all DCAE collectors - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/collectors/ves": {
    "id": "dcae%2Fcollectors%2Fves",
    "description": "DCAE\u0027s VNF event Stream (VES) collector - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/controller": {
    "id": "dcae%2Fcontroller",
    "description": "DCAE Controller top level - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/controller/analytics": {
    "id": "dcae%2Fcontroller%2Fanalytics",
    "description": "DCAE Controller\u0027s service manager for Analytics - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/dcae-inventory": {
    "id": "dcae%2Fdcae-inventory",
    "description": "DCAE\u0027s internal inventory agent - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/demo": {
    "id": "dcae%2Fdemo",
    "description": "DCAE demo related scripts and configurations - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/demo/startup": {
    "id": "dcae%2Fdemo%2Fstartup",
    "description": "DCAE demo component start-up scripts - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/demo/startup/aaf": {
    "id": "dcae%2Fdemo%2Fstartup%2Faaf",
    "description": "Start-up scripts and configurations for AAF (authentication and authorization framework) - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/demo/startup/controller": {
    "id": "dcae%2Fdemo%2Fstartup%2Fcontroller",
    "description": "Start-up scripts and configurations for DCAE Controller - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/demo/startup/message-router": {
    "id": "dcae%2Fdemo%2Fstartup%2Fmessage-router",
    "description": "Start-up scripts and configurations for Message Router - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/dmaapbc": {
    "id": "dcae%2Fdmaapbc",
    "description": "DCAE\u0027s Databus Controller - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/operation": {
    "id": "dcae%2Foperation",
    "description": "DCAE Operational Tools - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/operation/utils": {
    "id": "dcae%2Foperation%2Futils",
    "description": "DCAE Logging Library - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/orch-dispatcher": {
    "id": "dcae%2Forch-dispatcher",
    "description": "DCAE\u0027s Orchestrator Dispatcher - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/pgaas": {
    "id": "dcae%2Fpgaas",
    "description": "DCAE\u0027s Postgres As A Service - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/utils": {
    "id": "dcae%2Futils",
    "description": "DCAE utilities - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcae/utils/buildtools": {
    "id": "dcae%2Futils%2Fbuildtools",
    "description": "DCAE utility: package building tool - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "dcaegen2": {
    "id": "dcaegen2",
    "state": "ACTIVE"
  },
  "dcaegen2/analytics": {
    "id": "dcaegen2%2Fanalytics",
    "description": "Top level repo for dcaegen2/analytics",
    "state": "ACTIVE"
  },
  "dcaegen2/analytics/flink": {
    "id": "dcaegen2%2Fanalytics%2Fflink",
    "description": "Flink analytics",
    "state": "ACTIVE"
  },
  "dcaegen2/analytics/pnda": {
    "id": "dcaegen2%2Fanalytics%2Fpnda",
    "description": "PNDA analytics",
    "state": "ACTIVE"
  },
  "dcaegen2/analytics/tca": {
    "id": "dcaegen2%2Fanalytics%2Ftca",
    "description": "Threshold crossing analytics",
    "state": "ACTIVE"
  },
  "dcaegen2/collectors": {
    "id": "dcaegen2%2Fcollectors",
    "description": "Top level repo for dcaegen2/collectors",
    "state": "ACTIVE"
  },
  "dcaegen2/collectors/snmptrap": {
    "id": "dcaegen2%2Fcollectors%2Fsnmptrap",
    "description": "SNMP Trap collector  (TBD)",
    "state": "ACTIVE"
  },
  "dcaegen2/collectors/ves": {
    "id": "dcaegen2%2Fcollectors%2Fves",
    "description": "VNF Event Streaming  collector",
    "state": "ACTIVE"
  },
  "dcaegen2/deployments": {
    "id": "dcaegen2%2Fdeployments",
    "description": "For hosting configurations and blueprints for different deployments",
    "state": "ACTIVE"
  },
  "dcaegen2/platform": {
    "id": "dcaegen2%2Fplatform",
    "description": "Top level repo for dcaegen2/platform",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/blueprints": {
    "id": "dcaegen2%2Fplatform%2Fblueprints",
    "description": "Blueprint for DCAE controller",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/cdapbroker": {
    "id": "dcaegen2%2Fplatform%2Fcdapbroker",
    "description": "CDAP Broker",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/cli": {
    "id": "dcaegen2%2Fplatform%2Fcli",
    "description": "Cli tool for onboarding through new dcae controller",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/configbinding": {
    "id": "dcaegen2%2Fplatform%2Fconfigbinding",
    "description": "Configbinding api service",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/deployment-handler": {
    "id": "dcaegen2%2Fplatform%2Fdeployment-handler",
    "description": "Deployment handler",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/inventory-api": {
    "id": "dcaegen2%2Fplatform%2Finventory-api",
    "description": "DCAE inventory API service",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/plugins": {
    "id": "dcaegen2%2Fplatform%2Fplugins",
    "description": "Plugin for DCAE  controller",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/policy-handler": {
    "id": "dcaegen2%2Fplatform%2Fpolicy-handler",
    "description": "Policy handler",
    "state": "ACTIVE"
  },
  "dcaegen2/platform/registrator": {
    "id": "dcaegen2%2Fplatform%2Fregistrator",
    "description": "Registrator",
    "state": "READ_ONLY"
  },
  "dcaegen2/platform/servicechange-handler": {
    "id": "dcaegen2%2Fplatform%2Fservicechange-handler",
    "description": "Service Change handler",
    "state": "ACTIVE"
  },
  "dcaegen2/services/heartbeat": {
    "id": "dcaegen2%2Fservices%2Fheartbeat",
    "description": "Missing Heartbeat Micro Services",
    "state": "ACTIVE"
  },
  "dcaegen2/services/mapper": {
    "id": "dcaegen2%2Fservices%2Fmapper",
    "description": "Mapper Micro Services",
    "state": "ACTIVE"
  },
  "dcaegen2/services/prh": {
    "id": "dcaegen2%2Fservices%2Fprh",
    "description": "PNF Registration Handler",
    "state": "ACTIVE"
  },
  "dcaegen2/utils": {
    "id": "dcaegen2%2Futils",
    "description": "For hosting  utility/tools code used cross components",
    "state": "ACTIVE"
  },
  "demo": {
    "id": "demo",
    "description": "Demo applications and templates for ONAP platform instantiation.",
    "state": "ACTIVE"
  },
  "dmaap/buscontroller": {
    "id": "dmaap%2Fbuscontroller",
    "description": "It is a docker container that implements the dbcapi. It optionally can be deployed in a persistent mode which relies on PGaaS, in which case multiple containers can also be deployed for scale/availablity.",
    "state": "ACTIVE"
  },
  "dmaap/datarouter": {
    "id": "dmaap%2Fdatarouter",
    "description": "The Data Routing System project is intended to provide a common framework by which data producers can make data available to data consumers and a way for potential consumers to find feeds with the data they require. The interface to DR is exposed as a RESTful web service known as the DR Publishing and Delivery API",
    "state": "ACTIVE"
  },
  "dmaap/dbcapi": {
    "id": "dmaap%2Fdbcapi",
    "description": "Provides a northbound REST API to ONAP clients to manage DMaaP resources. This includes DMaaP components such as MR and DR, as well as provisioning of topics and feeds. Southbound, it communicates with the respective component APIs.",
    "state": "ACTIVE"
  },
  "dmaap/messagerouter/dmaapclient": {
    "id": "dmaap%2Fmessagerouter%2Fdmaapclient",
    "description": "It\u0027s a message router client. uses DME2 ( Direct Messaging Engine ) library to locate the end point.",
    "state": "ACTIVE"
  },
  "dmaap/messagerouter/messageservice": {
    "id": "dmaap%2Fmessagerouter%2Fmessageservice",
    "description": "Creates a service for Message Router in a container",
    "state": "ACTIVE"
  },
  "dmaap/messagerouter/mirroragent": {
    "id": "dmaap%2Fmessagerouter%2Fmirroragent",
    "description": "Replicates Message Router clusters  (copies data from one cluster to another)",
    "state": "ACTIVE"
  },
  "dmaap/messagerouter/msgrtr": {
    "id": "dmaap%2Fmessagerouter%2Fmsgrtr",
    "description": "Provides REST API for messaging. It is built on top of Apache Kafka.",
    "state": "ACTIVE"
  },
  "doc": {
    "id": "doc",
    "description": "Create and maintain documentation targeted to ONAP user audiences",
    "state": "ACTIVE"
  },
  "doc/tools": {
    "id": "doc%2Ftools",
    "description": "Tools Documentation",
    "state": "ACTIVE"
  },
  "ecompsdkos": {
    "id": "ecompsdkos",
    "description": "Base SDK Framework for the ONAP GUI. The GUI applications built using this SDK can be easily on-boarded onto ONAP Portal. Locked / archived as the project transitioned to portal/sdk",
    "state": "READ_ONLY"
  },
  "externalapi/nbi": {
    "id": "externalapi%2Fnbi",
    "description": "UML Model for the external API Framework represented in Eclipse Papyrus",
    "state": "ACTIVE"
  },
  "holmes/common": {
    "id": "holmes%2Fcommon",
    "description": "It provides some common tools in support of other modules of Holmes.",
    "state": "ACTIVE"
  },
  "holmes/dsa": {
    "id": "holmes%2Fdsa",
    "description": "A repo which is used to deposit and organize data source adapters.",
    "state": "ACTIVE"
  },
  "holmes/engine-management": {
    "id": "holmes%2Fengine-management",
    "description": "This component is designed for the engine management in Holmes. It\u0027s mainly responsible for starting and stopping the rule engine. This component can be extended if the number of alarms exceeds the processing limit.",
    "state": "ACTIVE"
  },
  "holmes/rule-management": {
    "id": "holmes%2Frule-management",
    "description": "This component is designed for the rule management in Holmes. It implements the CRUD and verification logic on the server side.",
    "state": "ACTIVE"
  },
  "integration": {
    "id": "integration",
    "description": "Integration framework, automated tools, code and scripts, best practice guidance related to cross-project Continuous System Integration Testing (CSIT), and delivery of ONAP.",
    "state": "ACTIVE"
  },
  "integration/devtool": {
    "id": "integration%2Fdevtool",
    "description": "This project provides an automated tool for provisioning ONAP development environment. It covers some common development tasks such as cloning source code repositories, compiling java artifacts and building Docker images. This has been vehicle to standardize development process and dependencies associated with their components through an automated provisioning mechanism.",
    "state": "ACTIVE"
  },
  "integration/seccom": {
    "id": "integration%2Fseccom",
    "description": "This repo holds web pages and scripts useful to the ONAP Security Sub Committee for tracking and managing the progress of ONAP projects towards meeting their Security requirements each release.",
    "state": "ACTIVE"
  },
  "logging-analytics": {
    "id": "logging-analytics",
    "state": "ACTIVE"
  },
  "modeling/modelspec": {
    "id": "modeling%2Fmodelspec",
    "description": "The repository for modeling specification published by modeling subcommittee",
    "state": "ACTIVE"
  },
  "modeling/toscaparsers": {
    "id": "modeling%2Ftoscaparsers",
    "description": "The repository for all tosca parsers",
    "state": "ACTIVE"
  },
  "msb/apigateway": {
    "id": "msb%2Fapigateway",
    "description": "Service API gateway which provides client request routing, client request load balancing, transformation, such as https to http, authentication \u0026 authorization for service request with plugin of auth service provider,service request logging,service request rate-limiting,service monitoring,request result cache,solve cross-domain issue for web application and other functionalities with the pluggable architecture capability.",
    "state": "ACTIVE"
  },
  "msb/discovery": {
    "id": "msb%2Fdiscovery",
    "description": "Provides service registration and discovery for ONAP microservices, which leverage Consul and build an abstract layer on top of it to make it agnostic to the registration provider and add needed extension.",
    "state": "ACTIVE"
  },
  "msb/java-sdk": {
    "id": "msb%2Fjava-sdk",
    "description": "Provides a JAVA SDK for rapid microservices development, including service registration, service discovery, request routing, load balancing, retry, etc.",
    "state": "ACTIVE"
  },
  "msb/swagger-sdk": {
    "id": "msb%2Fswagger-sdk",
    "description": "Swagger sdk helps to generate swagger.json and java client sdk during the build time, it also helps to provide the swagger.json at the given URI in the run time.",
    "state": "ACTIVE"
  },
  "mso": {
    "id": "mso",
    "description": "Master Service Orchestrator\n\nRead Only locked repo.\nThis repo has now been moved to so.",
    "state": "READ_ONLY"
  },
  "mso/chef-repo": {
    "id": "mso%2Fchef-repo",
    "description": "Berkshelf environment repo for mso/mso-config\n\nRead Only locked repo.\nThis repo has now been moved to so/chef-repo.",
    "state": "READ_ONLY"
  },
  "mso/docker-config": {
    "id": "mso%2Fdocker-config",
    "description": "MSO Docker composition and lab config template\n\nRead Only locked repo.\nThis repo has now been moved to so/docker-config.",
    "state": "READ_ONLY"
  },
  "mso/libs": {
    "id": "mso%2Flibs",
    "description": "MSO OpenStack Java SDK\n\nRead Only locked repo.\nThis repo has now been moved to so/libs.",
    "state": "READ_ONLY"
  },
  "mso/mso-config": {
    "id": "mso%2Fmso-config",
    "description": "mso-config Chef cookbook\n\nRead Only locked repo.\nThis repo has now been moved to so/so-config.",
    "state": "READ_ONLY"
  },
  "multicloud/azure": {
    "id": "multicloud%2Fazure",
    "description": "Microsoft Azure",
    "state": "ACTIVE"
  },
  "multicloud/framework": {
    "id": "multicloud%2Fframework",
    "description": "Common components for multicloud framework",
    "state": "ACTIVE"
  },
  "multicloud/openstack": {
    "id": "multicloud%2Fopenstack",
    "description": "OpenStack VIM",
    "state": "ACTIVE"
  },
  "multicloud/openstack/vmware": {
    "id": "multicloud%2Fopenstack%2Fvmware",
    "description": "VMware Integrated OpenStack",
    "state": "ACTIVE"
  },
  "multicloud/openstack/windriver": {
    "id": "multicloud%2Fopenstack%2Fwindriver",
    "description": "WindRiver Titanium Cloud",
    "state": "ACTIVE"
  },
  "music": {
    "id": "music",
    "description": "This repo contains the code for a multi-site coordination service (MUSIC) and associated recipes that enables efficient, highly available state-management across geo-redundant sites.",
    "state": "ACTIVE"
  },
  "music/distributed-kv-store": {
    "id": "music%2Fdistributed-kv-store",
    "description": "Source code to read initial configuration date into KV Store.",
    "state": "ACTIVE"
  },
  "ncomp": {
    "id": "ncomp",
    "description": "Sirius Operational Management Framework (SOMF) using Eclipse Modeling Framework (EMF) - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "ncomp/cdap": {
    "id": "ncomp%2Fcdap",
    "description": "SOMF CDAP Adaptor - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "ncomp/core": {
    "id": "ncomp%2Fcore",
    "description": "SOMF Core EMF models - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "ncomp/docker": {
    "id": "ncomp%2Fdocker",
    "description": "SOMF Docker Adaptor - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "ncomp/maven": {
    "id": "ncomp%2Fmaven",
    "description": "SOMF maven projects - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "ncomp/openstack": {
    "id": "ncomp%2Fopenstack",
    "description": "SOMF OpenStack Adaptor - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "ncomp/sirius": {
    "id": "ncomp%2Fsirius",
    "description": "SOMF core controller implementation - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "ncomp/sirius/manager": {
    "id": "ncomp%2Fsirius%2Fmanager",
    "description": "SOMF core controller manager implementation - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "ncomp/utils": {
    "id": "ncomp%2Futils",
    "description": "SOMF utility projects - Locked as per request #45671",
    "state": "READ_ONLY"
  },
  "oom": {
    "id": "oom",
    "description": "Introduces the ONAP Platform OOM (ONAP Operations Manager) to efficiently Deploy, Manage, Operate the ONAP platform and its components (e.g. MSO, DCAE, SDC, etc.) and infrastructure (VMs, Containers).",
    "state": "ACTIVE"
  },
  "oom/registrator": {
    "id": "oom%2Fregistrator",
    "description": "Register the service endpoints to MSB so it can be used for service request routing and load balancing. Registrator puts service endpoints info to MSB discovery module(Consul as the backend) when an ONAP component is deployed by OOM, and update its state along with the life cycle, such as start, stop, scaling, etc.",
    "state": "ACTIVE"
  },
  "oparent": {
    "id": "oparent",
    "description": "OParent provides common default settings for all the projects participating in simultaneous release.",
    "state": "ACTIVE"
  },
  "optf/cmso": {
    "id": "optf%2Fcmso",
    "description": "Change management scheduling service",
    "state": "READ_ONLY"
  },
  "optf/has": {
    "id": "optf%2Fhas",
    "description": "Homing and allocation service",
    "state": "ACTIVE"
  },
  "optf/osdf": {
    "id": "optf%2Fosdf",
    "description": "Optimization service design framework",
    "state": "ACTIVE"
  },
  "policy/api": {
    "id": "policy%2Fapi",
    "description": "Policy CRUD and PEP enforcement client code",
    "state": "ACTIVE"
  },
  "policy/common": {
    "id": "policy%2Fcommon",
    "description": "Policy common shared modules",
    "state": "ACTIVE"
  },
  "policy/docker": {
    "id": "policy%2Fdocker",
    "description": "Policy docker image",
    "state": "ACTIVE"
  },
  "policy/drools-applications": {
    "id": "policy%2Fdrools-applications",
    "description": "Code for building policies/rules for the Drools PDP engine.",
    "state": "ACTIVE"
  },
  "policy/drools-pdp": {
    "id": "policy%2Fdrools-pdp",
    "description": "The Drools PDP engine.",
    "state": "ACTIVE"
  },
  "policy/engine": {
    "id": "policy%2Fengine",
    "description": "Contains the Policy GUI, client SDK, API\u0027s and XACML PDP Engine.",
    "state": "ACTIVE"
  },
  "policy/gui": {
    "id": "policy%2Fgui",
    "description": "Policy Administration GUI (Frontend)",
    "state": "ACTIVE"
  },
  "policy/pap": {
    "id": "policy%2Fpap",
    "description": "Policy Administration (Backend)",
    "state": "ACTIVE"
  },
  "policy/pdp": {
    "id": "policy%2Fpdp",
    "description": "Common code shared between PDP engines.",
    "state": "ACTIVE"
  },
  "portal": {
    "id": "portal",
    "description": "ONAP Portal",
    "state": "ACTIVE"
  },
  "portal/sdk": {
    "id": "portal%2Fsdk",
    "description": "Base SDK Framework for the ONAP GUI. The GUI applications built using this SDK can be easily on-boarded onto ONAP Portal.",
    "state": "ACTIVE"
  },
  "sdc": {
    "id": "sdc",
    "description": "SDC Parent Project Catalog FE and BE",
    "state": "ACTIVE"
  },
  "sdc/dcae-d/ci": {
    "id": "sdc%2Fdcae-d%2Fci",
    "description": "DCAE Designer End To End Testing suite",
    "state": "ACTIVE"
  },
  "sdc/dcae-d/dt-be-main": {
    "id": "sdc%2Fdcae-d%2Fdt-be-main",
    "description": "DCAE Designer Back End Logic",
    "state": "ACTIVE"
  },
  "sdc/dcae-d/dt-be-property": {
    "id": "sdc%2Fdcae-d%2Fdt-be-property",
    "description": "DCAE Designer common datatypes and properties",
    "state": "ACTIVE"
  },
  "sdc/dcae-d/fe": {
    "id": "sdc%2Fdcae-d%2Ffe",
    "description": "DCAE Designer Front End UI",
    "state": "ACTIVE"
  },
  "sdc/dcae-d/rule-engine": {
    "id": "sdc%2Fdcae-d%2Frule-engine",
    "description": "DCAE Designer Rule Engine Front End UI",
    "state": "ACTIVE"
  },
  "sdc/dcae-d/tosca-lab": {
    "id": "sdc%2Fdcae-d%2Ftosca-lab",
    "description": "DCAE Designer Tosca Lab tool to create Blueprint and Generate Tosca models",
    "state": "ACTIVE"
  },
  "sdc/jtosca": {
    "id": "sdc%2Fjtosca",
    "description": "A generic TOSCA parser based on the TOSCA 1.1 spec",
    "state": "ACTIVE"
  },
  "sdc/onap-ui": {
    "id": "sdc%2Fonap-ui",
    "description": "UI library containing different components, fonts and styles used by SDC and the different designers in order to create a single look and feel across SDC",
    "state": "ACTIVE"
  },
  "sdc/sdc-distribution-client": {
    "id": "sdc%2Fsdc-distribution-client",
    "description": "SDC Distribution Client",
    "state": "ACTIVE"
  },
  "sdc/sdc-docker-base": {
    "id": "sdc%2Fsdc-docker-base",
    "description": "SDC base docker creation project",
    "state": "ACTIVE"
  },
  "sdc/sdc-titan-cassandra": {
    "id": "sdc%2Fsdc-titan-cassandra",
    "description": "SDC Rebase Cassandra",
    "state": "ACTIVE"
  },
  "sdc/sdc-tosca": {
    "id": "sdc%2Fsdc-tosca",
    "description": "A TOSCA parser , based on JTOSCA generic parser and complying with the ONAP SDC TOSCA model.",
    "state": "ACTIVE"
  },
  "sdc/sdc-workflow-designer": {
    "id": "sdc%2Fsdc-workflow-designer",
    "description": "A graphic design tool for service life cycle management workflow design.",
    "state": "ACTIVE"
  },
  "sdnc/adaptors": {
    "id": "sdnc%2Fadaptors",
    "description": "SDNC adaptors",
    "state": "READ_ONLY"
  },
  "sdnc/apps": {
    "id": "sdnc%2Fapps",
    "description": "SDNC applications (e.g. SDN-R)",
    "state": "ACTIVE"
  },
  "sdnc/architecture": {
    "id": "sdnc%2Farchitecture",
    "description": "SDNC architectural artifacts (e.g. blueprints)",
    "state": "READ_ONLY"
  },
  "sdnc/core": {
    "id": "sdnc%2Fcore",
    "description": "SDNC core platform",
    "state": "READ_ONLY"
  },
  "sdnc/features": {
    "id": "sdnc%2Ffeatures",
    "description": "SDNC Karaf features",
    "state": "ACTIVE"
  },
  "sdnc/northbound": {
    "id": "sdnc%2Fnorthbound",
    "description": "SDNC northbound adaptors",
    "state": "ACTIVE"
  },
  "sdnc/oam": {
    "id": "sdnc%2Foam",
    "description": "SDNC OA\u0026M tools",
    "state": "ACTIVE"
  },
  "sdnc/parent": {
    "id": "sdnc%2Fparent",
    "description": "Parent POMs to be used by SDNC components",
    "state": "READ_ONLY"
  },
  "sdnc/plugins": {
    "id": "sdnc%2Fplugins",
    "description": "SDNC plugins",
    "state": "ACTIVE"
  },
  "so": {
    "id": "so",
    "description": "Service Orchestrator",
    "state": "ACTIVE"
  },
  "so/chef-repo": {
    "id": "so%2Fchef-repo",
    "description": "Berkshelf environment repo",
    "state": "ACTIVE"
  },
  "so/docker-config": {
    "id": "so%2Fdocker-config",
    "description": "SO Docker composition and lab config template",
    "state": "ACTIVE"
  },
  "so/libs": {
    "id": "so%2Flibs",
    "description": "SO OpenStack Java SDK",
    "state": "ACTIVE"
  },
  "so/so-config": {
    "id": "so%2Fso-config",
    "description": "SO config Chef cookbook",
    "state": "ACTIVE"
  },
  "testsuite": {
    "id": "testsuite",
    "description": "Test Suite Parent Project. Contains and holds all the robot tests.",
    "state": "ACTIVE"
  },
  "testsuite/heatbridge": {
    "id": "testsuite%2Fheatbridge",
    "description": "Temporary heatbridge used to stitch together some holes in the ecomp tests for release one.",
    "state": "ACTIVE"
  },
  "testsuite/properties": {
    "id": "testsuite%2Fproperties",
    "description": "Stores properties used by robot framework. These are non-test-specific ecomp properties.",
    "state": "ACTIVE"
  },
  "testsuite/python-testing-utils": {
    "id": "testsuite%2Fpython-testing-utils",
    "description": "Python testing utils used by the robot framework. Installable as a pip package but not intended to be generally usable.",
    "state": "ACTIVE"
  },
  "ui": {
    "id": "ui",
    "description": "User Interface Applications",
    "state": "ACTIVE"
  },
  "ui/dmaapbc": {
    "id": "ui%2Fdmaapbc",
    "description": "DCAE DMaaP Bus Controller GUI based on the ECOMP base framework GUI SDK",
    "state": "ACTIVE"
  },
  "university": {
    "id": "university",
    "description": "University training courses for users, developers and any other interested parties of member and non-member companies.",
    "state": "ACTIVE"
  },
  "usecase-ui": {
    "id": "usecase-ui",
    "description": "Graphical User Interface wifor operators and end-users from the point of view of use cases.",
    "state": "ACTIVE"
  },
  "usecase-ui/server": {
    "id": "usecase-ui%2Fserver",
    "description": "Data management for Usecase UI",
    "state": "ACTIVE"
  },
  "vfc/gvnfm/vnflcm": {
    "id": "vfc%2Fgvnfm%2Fvnflcm",
    "description": "Generic VNFM VNF LCM",
    "state": "ACTIVE"
  },
  "vfc/gvnfm/vnfmgr": {
    "id": "vfc%2Fgvnfm%2Fvnfmgr",
    "description": "Generic VNFM VNF Mgr",
    "state": "ACTIVE"
  },
  "vfc/gvnfm/vnfres": {
    "id": "vfc%2Fgvnfm%2Fvnfres",
    "description": "Generic VNFM VNF Resource Management",
    "state": "ACTIVE"
  },
  "vfc/nfvo/catalog": {
    "id": "vfc%2Fnfvo%2Fcatalog",
    "description": "NS and VNF catalog",
    "state": "ACTIVE"
  },
  "vfc/nfvo/driver/ems": {
    "id": "vfc%2Fnfvo%2Fdriver%2Fems",
    "description": "VNF fcaps collect",
    "state": "ACTIVE"
  },
  "vfc/nfvo/driver/sfc": {
    "id": "vfc%2Fnfvo%2Fdriver%2Fsfc",
    "description": "SFC Driver",
    "state": "ACTIVE"
  },
  "vfc/nfvo/driver/vnfm/gvnfm": {
    "id": "vfc%2Fnfvo%2Fdriver%2Fvnfm%2Fgvnfm",
    "description": "Generic VNFM driver",
    "state": "ACTIVE"
  },
  "vfc/nfvo/driver/vnfm/svnfm": {
    "id": "vfc%2Fnfvo%2Fdriver%2Fvnfm%2Fsvnfm",
    "description": "Specific VNFM drivers",
    "state": "ACTIVE"
  },
  "vfc/nfvo/lcm": {
    "id": "vfc%2Fnfvo%2Flcm",
    "description": "NS lifecycle management",
    "state": "ACTIVE"
  },
  "vfc/nfvo/multivimproxy": {
    "id": "vfc%2Fnfvo%2Fmultivimproxy",
    "description": "Multi-vim proxy, provide the multivim indirect mode proxy which can forward virtual resource requests to multivim and do some resource checking",
    "state": "ACTIVE"
  },
  "vfc/nfvo/resmanagement": {
    "id": "vfc%2Fnfvo%2Fresmanagement",
    "description": "NS Resource Management",
    "state": "ACTIVE"
  },
  "vfc/nfvo/wfengine": {
    "id": "vfc%2Fnfvo%2Fwfengine",
    "description": "Work flow engine",
    "state": "ACTIVE"
  },
  "vid": {
    "id": "vid",
    "description": "VID webapp core",
    "state": "ACTIVE"
  },
  "vid/asdcclient": {
    "id": "vid%2Fasdcclient",
    "description": "VID SDC Client library",
    "state": "READ_ONLY"
  },
  "vnfrqts/epics": {
    "id": "vnfrqts%2Fepics",
    "description": "This repository contains Epic Statements for  VNFs for use with the ONAP platform.",
    "state": "ACTIVE"
  },
  "vnfrqts/guidelines": {
    "id": "vnfrqts%2Fguidelines",
    "description": "This repository contains Guidelines for   VNFs for use with the ONAP platform",
    "state": "ACTIVE"
  },
  "vnfrqts/requirements": {
    "id": "vnfrqts%2Frequirements",
    "description": "This repository contains Requirements for  VNFs for use with the ONAP platform",
    "state": "ACTIVE"
  },
  "vnfrqts/testcases": {
    "id": "vnfrqts%2Ftestcases",
    "description": "This repository contains test case descriptions for  VNFs for use with the ONAP platform.",
    "state": "ACTIVE"
  },
  "vnfrqts/usecases": {
    "id": "vnfrqts%2Fusecases",
    "description": "This repository contains Use cases for  VNFs for use with the ONAP platform.",
    "state": "ACTIVE"
  },
  "vnfsdk/compliance": {
    "id": "vnfsdk%2Fcompliance",
    "description": "This repository is for the compliance test framework.",
    "state": "READ_ONLY"
  },
  "vnfsdk/dovetail-integration": {
    "id": "vnfsdk%2Fdovetail-integration",
    "description": "For artifacts related to the integration with the OPNFV Dovetail tool",
    "state": "ACTIVE"
  },
  "vnfsdk/functest": {
    "id": "vnfsdk%2Ffunctest",
    "description": "This repository is for the functional test framework",
    "state": "ACTIVE"
  },
  "vnfsdk/ice": {
    "id": "vnfsdk%2Fice",
    "description": "This repository is for ice tools",
    "state": "ACTIVE"
  },
  "vnfsdk/lctest": {
    "id": "vnfsdk%2Flctest",
    "description": "This repository is for VNF lifecycle tests",
    "state": "ACTIVE"
  },
  "vnfsdk/model": {
    "id": "vnfsdk%2Fmodel",
    "description": "This repository stores VNF data models",
    "state": "ACTIVE"
  },
  "vnfsdk/pkgtools": {
    "id": "vnfsdk%2Fpkgtools",
    "description": "This repository contains vendor CI/CD vnf packaging tools.",
    "state": "ACTIVE"
  },
  "vnfsdk/refrepo": {
    "id": "vnfsdk%2Frefrepo",
    "description": "This repository is for a reference vnf repository",
    "state": "ACTIVE"
  },
  "vnfsdk/validation": {
    "id": "vnfsdk%2Fvalidation",
    "description": "This repository is used for vnf validation tools",
    "state": "ACTIVE"
  },
  "vnfsdk/ves-agent": {
    "id": "vnfsdk%2Fves-agent",
    "description": "This repository is for the compliance test framework.",
    "state": "ACTIVE"
  },
  "vvp/ansible-ice-bootstrap": {
    "id": "vvp%2Fansible-ice-bootstrap",
    "description": "An Ansible role for the configuration of a bootstrap node for the vvp environment.",
    "state": "ACTIVE"
  },
  "vvp/cms": {
    "id": "vvp%2Fcms",
    "description": "A Django/Mezzanine CMS-based application, used by the vvp application.",
    "state": "ACTIVE"
  },
  "vvp/devkit": {
    "id": "vvp%2Fdevkit",
    "description": "This repo contains tooling and documentation around deploying ICE virtual, and bare metal environments using Vagrant, and Ansible. This results in a CoreOS based Kubernetes cluster, a Ceph cluster, and the ICE application stack being deployed. In bare metal, or virtual PXE booted environments it will also result in a bootstrap node providing DNS, Matchbox, and DHCP/PXE services.",
    "state": "ACTIVE"
  },
  "vvp/documentation": {
    "id": "vvp%2Fdocumentation",
    "description": "A full set of documentation of how to run the validation, the technology stack and also the validation process",
    "state": "ACTIVE"
  },
  "vvp/engagementmgr": {
    "id": "vvp%2Fengagementmgr",
    "description": "The backend for the vvp application, based on Django.",
    "state": "ACTIVE"
  },
  "vvp/gitlab": {
    "id": "vvp%2Fgitlab",
    "description": "A containerization of GitLab, used by the vvp application.",
    "state": "ACTIVE"
  },
  "vvp/image-scanner": {
    "id": "vvp%2Fimage-scanner",
    "description": "An image validation engine used by the vvp application. Scans disk images for security hazards.",
    "state": "ACTIVE"
  },
  "vvp/jenkins": {
    "id": "vvp%2Fjenkins",
    "description": "A containerization of Jenkins and associated resources used by the vvp application",
    "state": "ACTIVE"
  },
  "vvp/portal": {
    "id": "vvp%2Fportal",
    "description": "The frontend for the vvp application, based on Angular.",
    "state": "ACTIVE"
  },
  "vvp/postgresql": {
    "id": "vvp%2Fpostgresql",
    "description": "A containerization of the PostgreSQL database (will be retired soon in favor of a standard upstream container)",
    "state": "ACTIVE"
  },
  "vvp/test-engine": {
    "id": "vvp%2Ftest-engine",
    "state": "ACTIVE"
  },
  "vvp/validation-scripts": {
    "id": "vvp%2Fvalidation-scripts",
    "description": "A set of validation a scripts utilized by the vvp application.",
    "state": "ACTIVE"
  }
}
