"""
Constants related to Kubernetes.
"""
from enum import Enum


class K8sKinds(str, Enum):
    """
    Kubernetes entities kinds.
    """
    daemon_set = 'DaemonSet'
    deployment = 'Deployment'
    replica_set = 'ReplicaSet'
    replication_controller = 'ReplicationController'
    service = 'Service'
    stateful_set = 'StatefulSet'
