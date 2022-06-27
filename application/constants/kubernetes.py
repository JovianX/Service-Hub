"""
Constants related to Kubernetes.
"""
from enum import Enum


class K8sKinds(str, Enum):
    """
    Kubernetes entities kinds.
    """
    cluster_role = 'ClusterRole'
    cluster_role_binding = 'ClusterRoleBinding'
    config_map = 'ConfigMap'
    daemon_set = 'DaemonSet'
    deployment = 'Deployment'
    persistent_volume_claim = 'PersistentVolumeClaim'
    pod = 'Pod'
    pod_security_policy = 'PodSecurityPolicy'
    replica_set = 'ReplicaSet'
    replication_controller = 'ReplicationController'
    role = 'Role'
    role_binding = 'RoleBinding'
    secret = 'Secret'
    service = 'Service'
    service_account = 'ServiceAccount'
    stateful_set = 'StatefulSet'