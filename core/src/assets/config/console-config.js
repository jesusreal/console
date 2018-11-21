let k8sDomain = 'kyma.local';
var clusterConfig = window['clusterConfig'];
if (clusterConfig && clusterConfig['domain']) {
  k8sDomain = clusterConfig['domain'];
}
var k8sServerUrl = `https://apiserver.${k8sDomain}`;
var token;
if (localStorage.getItem('luigi.auth')) {
  token = 'Bearer ' + JSON.parse(localStorage.getItem('luigi.auth')).idToken;
}

function getNodes(environment) {
  var nodes = [
    {
      pathSegment: 'details',
      label: 'Overview',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/details'
    },
    {
      category: 'Service Catalog',
      pathSegment: 'service-catalog',
      label: 'Catalog',
      viewUrl:
        '/consoleapp.html#/home/environments/' +
        environment +
        '/service-catalog'
    },
    {
      category: 'Service Catalog',
      pathSegment: 'instances',
      label: 'Instances',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/instances'
    },
    {
      category: 'Service Catalog',
      pathSegment: 'brokers',
      label: 'Brokers',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/brokers'
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
      label: 'Lambdas',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/lambdas'
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
        '/consoleapp.html#/home/environments/' + environment + '/services'
    },
    {
      category: 'Operation',
      pathSegment: 'secrets',
      navigationContext: 'secrets',
      label: 'Secrets',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/secrets'
    }
  ];

  return nodes;
}

function getEnvs() {
  reloginIfTokenExpired();

  return new Promise(function(resolve, reject) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var envs = [];
        envs.push({
          pathSegment: 'workspace',
          label: 'Workspace',
          viewUrl: '/consoleapp.html#/home/environments/workspace',
          hideFromNav: true
        });
        JSON.parse(xmlHttp.response).items.forEach(env => {
          envName = env.metadata.name;
          envs.push({
            // has to be visible for all views exept 'settings'
            category: 'Environments',
            label: envName,
            pathSegment: envName,
            navigationContext: 'environments',
            context: {
              environmentId: envName
            },
            children: getNodes(envName)
          });
        });
        resolve(envs);
      } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
        if (xmlHttp.status === 401) {
          relogin();
        }
        reject(xmlHttp.response);
      }
    };

    xmlHttp.open(
      'GET',
      k8sServerUrl + '/api/v1/namespaces?labelSelector=env=true',
      true
    );
    xmlHttp.setRequestHeader('Authorization', token);
    xmlHttp.send(null);
  });
}

function relogin() {
  localStorage.removeItem('luigi.auth');
  location.reload();
}

function reloginIfTokenExpired() {
  var accessTokenExpirationDate = JSON.parse(localStorage.getItem('luigi.auth'))
    .accessTokenExpirationDate;
  var currentDate = new Date();
  if (accessTokenExpirationDate < currentDate) {
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
      redirect_uri: 'http://console-dev.kyma.local:4200',
      logoutUrl: 'http://console-dev.kyma.local:4200',
      automaticSilentRenew: true,
      loadUserInfo: false
    },

    events: {
      onLogout: () => {
        console.log('onLogout');
      },
      onAuthSuccessful: data => {
        console.log('onAuthSuccessful', data);
      },
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
        label: 'Overview',
        defaultPathSegment: 'workspace',
        context: {
          idToken: token
        },
        children: getEnvs
      },
      {
        pathSegment: 'home',
        label: 'Settings',
        context: {
          idToken: token
        },
        children: [
          {
            // has to be visible for all views exept 'settings'
            pathSegment: 'settings',
            navigationContext: 'settings',
            label: 'Administration',
            children: [
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
                viewUrl: '/consoleapp.html#/home/settings/remoteEnvs'
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
                viewUrl: '/consoleapp.html#/home/settings/globalPermissions',
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
              }
            ]
          }
        ]
      }
    ]
  },
  routing: {
    nodeParamPrefix: '~',
    useHashRouting: true
  },
  settings: {
    header: () => ({
      logo: '/assets/logo.svg'
    })
  }
});
