cluster_configuration = {
    "apiVersion": "v1",
    "kind": "Config",
    "preferences": {},
    "current-context": "some-context",
    "clusters": [
        {
            "cluster": {
                "certificate-authority-data": "dG9rZW4=",
                "server": "https://42.42.42.42",
            },
            "name": "some-cluster",
        }
    ],
    "contexts": [
        {
            "context": {
                "cluster": "some-cluster",
                "namespace": "some-namespace",
                "user": "some-user",
            },
            "name": "some-context",
        }
    ],
    "users": [
        {
            "name": "some-user",
            "user": {
                "token": "token"
            },
        }
    ],
}
