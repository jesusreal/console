var clusterConfig = window['clusterConfig'];
var k8sDomain = (clusterConfig && clusterConfig['domain']) || 'kyma.local';
var k8sServerUrl = 'https://apiserver.' + k8sDomain;

var config = {
  serviceCatalogModuleUrl: 'https://catalog.' + k8sDomain,
  serviceInstancesModuleUrl: 'https://instances.' + k8sDomain,
  lambdasModuleUrl: 'https://lambdas-ui.' + k8sDomain,
  serviceBrokersModuleUrl: 'https://brokers.' + k8sDomain,
  docsModuleUrl: 'https://docs.' + k8sDomain
};

if (clusterConfig) {
  for (var propertyName in config) {
    if (clusterConfig.hasOwnProperty(propertyName)) {
      config[propertyName] = clusterConfig[propertyName];
    }
  }
}

var token;
if (localStorage.getItem('luigi.auth')) {
  token = JSON.parse(localStorage.getItem('luigi.auth')).idToken;
}

function getNodes(context) {
  var environment = context.environmentId;
  var staticNodes = [
    {
      pathSegment: 'details',
      label: 'Overview',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/details'
    },
    {
      category: 'Service Catalog',
      navigationContext: 'service-catalog',
      pathSegment: 'service-catalog',
      label: 'Catalog',
      viewGroup: 'catalog',
      viewUrl: config.serviceCatalogModuleUrl,
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':serviceId',
              viewUrl: config.serviceCatalogModuleUrl + '/details/:serviceId'
            }
          ]
        }
      ]
    },
    {
      category: 'Service Catalog',
      keepSelectedForChildren: true,
      pathSegment: 'instances',
      label: 'Instances',
      viewUrl: config.serviceInstancesModuleUrl,
      viewGroup: 'instances',
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl: config.serviceInstancesModuleUrl + '/details/:name'
            }
          ]
        }
      ]
    },
    {
      category: 'Service Catalog',
      pathSegment: 'brokers',
      label: 'Brokers',
      viewUrl: config.serviceBrokersModuleUrl
    },
    {
      category: 'Configuration',
      pathSegment: 'apis',
      navigationContext: 'apis',
      label: 'APIs',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/apis',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'create',
          viewUrl:
            '/consoleapp.html#/home/environments/' +
            environment +
            '/apis/create'
        },
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/environments/' +
                environment +
                '/apis/details/:name'
            }
          ]
        }
      ]
    },
    {
      category: 'Configuration',
      pathSegment: 'permissions',
      navigationContext: 'permissions',
      label: 'Permissions',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/permissions',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/environments/' +
                environment +
                '/permissions/roles/:name'
            }
          ]
        }
      ]
    },
    {
      category: 'Configuration',
      pathSegment: 'resources',
      navigationContext: 'resources',
      label: 'Resources',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/resources'
    },
    {
      category: 'Configuration',
      pathSegment: 'config-maps',
      navigationContext: 'config-maps',
      label: 'Config maps',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/configmaps'
    },
    {
      category: 'Development',
      pathSegment: 'lambdas',
      navigationContext: 'lambdas',
      label: 'Lambdas',
      viewGroup: 'lambdas',
      viewUrl: config.lambdasModuleUrl + '#/lambdas',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'create',
          viewUrl: config.lambdasModuleUrl + '#/create'
        },
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':lambda',
              viewUrl: config.lambdasModuleUrl + '#/lambdas/:lambda'
            }
          ]
        }
      ]
    },
    {
      category: 'Operation',
      pathSegment: 'deployments',
      navigationContext: 'deployments',
      label: 'Deployments',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/deployments'
    },
    {
      category: 'Operation',
      pathSegment: 'replica-sets',
      navigationContext: 'replica-sets',
      label: 'Replica Sets',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/replicaSets'
    },
    {
      category: 'Operation',
      pathSegment: 'pods',
      navigationContext: 'pods',
      label: 'Pods',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/pods'
    },
    {
      category: 'Operation',
      pathSegment: 'services',
      navigationContext: 'services',
      label: 'Services',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/services',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/environments/' +
                environment +
                '/services/:name',
              children: [
                {
                  pathSegment: 'apis',
                  children: [
                    {
                      pathSegment: 'create',
                      viewUrl:
                        '/consoleapp.html#/home/environments/' +
                        environment +
                        '/services/:name/apis/create'
                    },
                    {
                      pathSegment: 'details',
                      children: [
                        {
                          pathSegment: ':apiName',
                          viewUrl:
                            '/consoleapp.html#/home/environments/' +
                            environment +
                            '/services/:name/apis/details/:apiName'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      category: 'Operation',
      pathSegment: 'secrets',
      navigationContext: 'secrets',
      label: 'Secrets',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/secrets',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/environments/' +
                environment +
                '/secrets/:name'
            }
          ]
        }
      ]
    }
  ];
  return Promise.all([
    getUiEntities('microfrontends', environment),
    getUiEntities('clustermicrofrontends', undefined, 'environment')
  ]).then(function(values) {
    var nodeTree = staticNodes;
    values.forEach(function(val) {
      nodeTree = [].concat.apply(nodeTree, val);
    });
    return nodeTree;
  });
}

/**
 * getUiEntities
 * @param {string} entityname microfrontends | clustermicrofrontends
 * @param {string} placement environment | cluster
 */
function getUiEntities(entityname, environment, placement) {
  var fetchUrl =
    k8sServerUrl +
    '/apis/ui.kyma-project.io/v1alpha1/' +
    (environment ? 'namespaces/' + environment + '/' : '') +
    entityname;
  // console.log("​%cgetUiEntities -> entityname, environment, placement, fetchUrl", "color: orange; font-weight: bold;", entityname, environment, placement, fetchUrl)
  return fetchFromKyma(fetchUrl)
    .then(result => {
      if (!result.items.length) {
        return [];
      }
      return result.items
        .filter(function(item) {
          // placement only exists in clustermicrofrontends
          return !placement || item.spec.placement === placement;
        })
        .map(function(item) {
          function buildToplevelNode(node, spec) {
            var segmentPrefix =
              entityname === 'clustermicrofrontends' ? 'cmf-' : 'mf-';
            console.log('​buildToplevelNode -> segmentPrefix', segmentPrefix);
            var node = {
              label: node.label,
              pathSegment: segmentPrefix + node.navigationPath,
              navigationContext: name,
              viewUrl: spec.viewBaseUrl
                ? spec.viewBaseUrl + node.viewUrl
                : node.viewUrl,
              keepSelectedForChildren: true,
              hideFromNav: node.showInNavigation || undefined
            };
            return node;
          }

          function buildNodeWithChildren(specNode, spec) {
            var node = buildToplevelNode(specNode, spec);
            var pathSegments = specNode.navigationPath.split('/');
            var children = getDirectChildren(pathSegments, spec);
            if (children.length) {
              node.children = children;
            }
            return node;
          }

          function getDirectChildren(pathSegments, spec) {
            // filter direct childs
            return spec.navigationNodes
              .filter(function(node) {
                var cPathSegments = node.navigationPath.split('/');
                var isDirectChild =
                  pathSegments.length === cPathSegments.length - 1 &&
                  pathSegments.filter(function(segment) {
                    return cPathSegments.includes(segment);
                  }).length > 0;
                return isDirectChild;
              })
              .map(function(node) {
                return buildNodeWithChildren(node, spec);
              });
          }

          function buildTree(spec) {
            return spec.navigationNodes
              .filter(function getTopLevelNodes(node) {
                var segments = node.navigationPath.split('/');
                return segments.length === 1;
              })
              .map(function(node) {
                return buildNodeWithChildren(node, spec);
              })
              .map(function addSettingsForTopLevelNodes(node) {
                if (spec.category) {
                  node.category = spec.category;
                }
                node.navigationContext = spec.appName;
                node.keepSelectedForChildren = true;
                return node;
              });
          }
          if (item.spec.navigationNodes) {
            return buildTree(item.spec);
          }
          return [];
        });
    })
    .catch(err => {
      console.error('Error fetching UiEntity ' + name, err);
      return [];
    });
}

function fetchFromKyma(url) {
  reloginIfTokenExpired();
  return new Promise(function(resolve, reject) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        resolve(JSON.parse(xmlHttp.response));
      } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
        if (xmlHttp.status === 401) {
          relogin();
        }
        reject(xmlHttp.response);
      }
    };

    xmlHttp.open('GET', url, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlHttp.send(null);
  });
}

function getEnvs() {
  return fetchFromKyma(
    k8sServerUrl + '/api/v1/namespaces?labelSelector=env=true'
  ).then(function(response) {
    var envs = [];
    response.items.forEach(env => {
      envName = env.metadata.name;
      envs.push({
        // has to be visible for all views exept 'settings'
        category: 'Environments',
        label: envName,
        pathValue: envName
      });
    });
    return envs;
  });
}

function relogin() {
  localStorage.removeItem('luigi.auth');
  location.reload();
}

function reloginIfTokenExpired() {
  var authData = JSON.parse(localStorage.getItem('luigi.auth'));
  var accessTokenExpirationDate =
    authData && authData.accessTokenExpirationDate;
  var currentDate = new Date();
  if (!authData || accessTokenExpirationDate < currentDate) {
    relogin();
  }
}

Luigi.setConfig({
  auth: {
    use: 'openIdConnect',
    openIdConnect: {
      authority: 'https://dex.' + k8sDomain,
      client_id: 'console',
      scope:
        'audience:server:client_id:kyma-client audience:server:client_id:console openid profile email groups',
      automaticSilentRenew: true,
      loadUserInfo: false
    },

    events: {
      onLogout: () => {
        console.log('onLogout');
      },
      onAuthSuccessful: data => {},
      onAuthExpired: () => {
        console.log('onAuthExpired');
      },
      // TODO: define luigi-client api for getting errors
      onAuthError: err => {
        console.log('authErrorHandler 1', err);
      }
    }
  },
  navigation: {
    nodes: () => [
      {
        pathSegment: 'environments',
        label: 'Workspace',
        viewUrl: '/consoleapp.html#/home/environments/workspace',
        hideSideNav: true,
        context: {
          idToken: token
        },
        children: [
          {
            // has to be visible for all views exept 'settings'
            pathSegment: ':environmentId',
            context: {
              environmentId: ':environmentId'
            },
            children: getNodes,
            navigationContext: 'environments'
          }
        ]
      },
      {
        viewUrl: '/consoleapp.html#/home/environments/create',
        hideFromNav: true,
        pathSegment: 'create-env'
      },
      {
        pathSegment: 'home',
        label: 'General Settings',
        context: {
          idToken: token
        },
        children: [
          {
            // has to be visible for all views exept 'settings'
            pathSegment: 'settings',
            navigationContext: 'settings',
            label: 'Administration',
            children: function() {
              return getUiEntities(
                'clustermicrofrontends',
                undefined,
                'cluster'
              ).then(function(cmf) {
                var staticNodes = [
                  {
                    pathSegment: 'organisation',
                    navigationContext: 'organisation',
                    label: 'General Settings',
                    viewUrl: '/consoleapp.html#/home/settings/organisation'
                  },
                  {
                    pathSegment: 'remote-envs',
                    navigationContext: 'remote-envs',
                    label: 'Remote Environments',
                    category: 'Integration',
                    viewUrl: '/consoleapp.html#/home/settings/remoteEnvs',
                    keepSelectedForChildren: true,
                    children: [
                      {
                        pathSegment: 'details',
                        children: [
                          {
                            pathSegment: ':name',
                            viewUrl:
                              '/consoleapp.html#/home/settings/remoteEnvs/:name'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    pathSegment: 'service-brokers',
                    navigationContext: 'service-brokers',
                    label: 'Service Brokers',
                    category: 'Integration',
                    viewUrl: '/consoleapp.html#/home/settings/serviceBrokers'
                  },
                  {
                    pathSegment: 'idp-presets',
                    navigationContext: 'idp-presets',
                    label: 'IDP Presets',
                    category: 'Integration',
                    viewUrl: '/consoleapp.html#/home/settings/idpPresets'
                  },
                  {
                    pathSegment: 'global-permissions',
                    navigationContext: 'global-permissions',
                    label: 'Global Permissions',
                    category: 'Administration',
                    viewUrl:
                      '/consoleapp.html#/home/settings/globalPermissions',
                    keepSelectedForChildren: true,
                    children: [
                      {
                        pathSegment: 'roles',
                        children: [
                          {
                            pathSegment: ':name',
                            viewUrl:
                              '/consoleapp.html#/home/settings/globalPermissions/roles/:name'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    label: 'Stats & Metrics',
                    category: 'Diagnostics',
                    externalLink: {
                      url: 'https://grafana.' + k8sDomain,
                      sameWindow: false
                    }
                  },
                  {
                    label: 'Tracing',
                    category: 'Diagnostics',
                    externalLink: {
                      url: 'https://jaeger.' + k8sDomain,
                      sameWindow: false
                    }
                  },
                  {
                    category: 'Documentation',
                    link: '/home/docs',
                    label: 'Docs'
                  }
                ];
                var fetchedNodes = [].concat.apply([], cmf);
                return [].concat.apply(staticNodes, fetchedNodes);
              });
            }
          },
          {
            pathSegment: 'docs',
            viewUrl: config.docsModuleUrl,
            hideSideNav: true
          }
        ]
      }
    ],
    contextSwitcher: {
      defaultLabel: 'Select Environment ...',
      parentNodePath: '/environments', // absolute path
      lazyloadOptions: true, // load options on click instead on page load
      options: getEnvs,
      actions: [
        {
          label: '+ New Environment',
          link: '/create-env'
        }
      ]
    }
  },
  routing: {
    nodeParamPrefix: '~',
    skipRoutingForUrlPatterns: [/access_token=/, /id_token=/]
  },
  settings: {
    header: () => ({
      logo: '/assets/logo.svg'
    })
  }
});
