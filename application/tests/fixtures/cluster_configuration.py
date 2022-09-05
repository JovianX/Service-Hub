unknown_configuration = {
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

gcp_configuration = {
    'apiVersion': 'v1',
    'clusters': [
        {
            'cluster': {
                'certificate-authority-data': 'b3RoZXItdG9rZW4=',
                'server': 'https://24.24.24.24',
            },
            'name': 'gke_project-name_us-central1-a_cluster-name'
        }
    ],
    'contexts': [
        {
            'context': {
                'cluster': 'gke_project-name_us-central1-a_cluster-name',
                'namespace': 'some-namespace',
                'user': 'admin-some-namespace-gke_project-name_us-central1-a_cluster-name'
            },
            'name': 'admin-some-namespace-gke_project-name_us-central1-a_cluster-name'
        }
    ],
    'current-context': 'admin-some-namespace-gke_project-name_us-central1-a_cluster-name',
    'kind': 'Config',
    'preferences': {},
    'users': [
        {
            'name': 'admin-some-namespace-gke_project-name_us-central1-a_cluster-name',
            'user': {
                'token': 'token'
            }
        }
    ]
}


azure_configuration = {
    'apiVersion': 'v1',
    'clusters': [
        {
            'cluster': {
                'certificate-authority-data': 'DATA+OMITTED',
                'server': 'https://myaksclust-myresourcegroup-19da35-4839be06.hcp.eastus.azmk8s.io:443',
            },
            'name': 'myAKSCluster',
        }
    ],
    'contexts': [
        {
            'context': {
                'cluster': 'myAKSCluster',
                'user': 'clusterAdmin_myResourceGroup_myAKSCluster',
            },
            'name': 'myAKSCluster-admin',
        }
    ],
    'current-context': 'myAKSCluster-admin',
    'kind': 'Config',
    'preferences': {},
    'users': [
        {
            'name': 'clusterAdmin_myResourceGroup_myAKSCluster',
            'user': {
                'client-certificate-data': 'REDACTED',
                'client-key-data': 'REDACTED',
                'token': 'e9f2f819a4496538b02cefff94e61d35',
            },
        }
    ],
}

aws_configuration = {
    'apiVersion': 'v1',
    'clusters': [
        {
            'cluster': {
                'certificate-authority-data': 'dG9rZW4=',
                'server': 'https://42A424242A4A242424EC24F24FF242B4.gr7.us-east-2.eks.amazonaws.com'
            },
            'name': 'arn:aws:eks:us-east-2:424242424242:cluster/safe-t-sdp-master'
        }
    ],
    'current-context': 'gke_aws-app_europe-west1_aws-app-stage',
    'kind': 'Config',
    'preferences': {},
    'users': [
        {
            'name': 'arn:aws:eks:us-east-2:424242424242:cluster/safe-t-sdp-master',
            'user': {
                'exec': {
                    'apiVersion': 'client.authentication.k8s.io/v1alpha1',
                    'args': [
                        '--region',
                        'us-east-2',
                        'eks',
                        'get-token',
                        '--cluster-name',
                        'safe-t-sdp-master'
                    ],
                    'command': 'aws',
                    'env': [
                        {
                            'name': 'AWS_PROFILE',
                            'value': 'safet'
                        }
                    ],
                    'interactiveMode': 'IfAvailable',
                    'provideClusterInfo': False
                }
            }
        }
    ],
    'contexts': [
        {
            'context': {
                'cluster': 'arn:aws:eks:us-east-2:424242424242:cluster/safe-t-sdp-master',
                'user': 'arn:aws:eks:us-east-2:424242424242:cluster/safe-t-sdp-master'
            },
            'name': 'arn:aws:eks:us-east-2:424242424242:cluster/safe-t-sdp-master'
        }
    ]
}
