"""
Constants related to Kubernetes.
"""
from .base_enum import StrEnum


class K8sKinds(StrEnum):
    """
    Kubernetes entities kinds.
    """
    cluster_role = 'ClusterRole'
    cluster_role_binding = 'ClusterRoleBinding'
    config_map = 'ConfigMap'
    cron_job = 'CronJob'
    daemon_set = 'DaemonSet'
    deployment = 'Deployment'
    ingress = 'Ingress'
    job = 'Job'
    namespace = 'Namespace'
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
