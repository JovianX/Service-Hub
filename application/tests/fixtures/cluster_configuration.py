cluster_configuration = {
    'apiVersion': 'v1',
    'kind': 'Config',
    'preferences': {},
    'current-context': 'some-context',
    'clusters': [
        {
            'cluster': {
                'certificate-authority-data': 'dG9rZW4=',
                'server': 'https://42.42.42.42',
            },
            'name': 'some-cluster',
        }
    ],
    'contexts': [
        {
            'context': {
                'cluster': 'some-cluster',
                'namespace': 'some-namespace',
                'user': 'some-user',
            },
            'name': 'some-context',
        }
    ],
    'users': [
        {
            'name': 'some-user',
            'user': {
                'token': 'token'
            },
        }
    ],
}

cluster_configuration_2 = {
    'apiVersion': 'v1',
    'kind': 'Config',
    'preferences': {},
    'current-context': 'other-context',
    'clusters': [
        {
            'cluster': {
                'certificate-authority-data': 'b3RoZXItdG9rZW4=',
                'server': 'https://24.24.24.24',
            },
            'name': 'other-cluster',
        }
    ],
    'contexts': [
        {
            'context': {
                'cluster': 'other-cluster',
                'namespace': 'other-namespace',
                'user': 'other-user',
            },
            'name': 'other-context',
        }
    ],
    'users': [
        {
            'name': 'other-user',
            'user': {
                'token': 'other-token'
            },
        }
    ],
}
