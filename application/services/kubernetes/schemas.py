from typing import Annotated
from typing import Literal
from typing import Any

from pydantic import BaseModel
from pydantic import Field

from constants.kubernetes import K8sKinds


class BaseK8sEntity(BaseModel):
    """
    Kubernetes entity.
    """
    api_version: str = Field(alias='apiVersion', description='API version')
    kind: K8sKinds = Field(description='Type if entity')
    metadata: dict = Field(description='Entity metadata')
    specification: dict | None = Field(alias='spec', default={}, description='Entity technical specification')
    status: dict | None = Field(default={}, description='Entity status')

    class Config:
        allow_population_by_field_name = True
        orm_mode = True

    @property
    def is_healthy(self) -> bool:
        """
        Returns entity running status.
        """
        if self.kind == K8sKinds.service:
            if self.specification['type'] == 'LoadBalancer':
                ingress = self.status.get('load_balancer', {}).get('ingress')
                return ingress is not None
        elif self.kind == K8sKinds.deployment:
            condition_statuses = {
                'Progressing': False,
                'Available': False
            }
            for condition in self.status.get('conditions', []):
                type = condition.get('type')
                if type in condition_statuses:
                    status = condition.get('status') or 'False'
                    condition_statuses[type] = status == 'True'
            return all(condition_statuses.values())
        elif self.kind in (K8sKinds.stateful_set, K8sKinds.replica_set):
            if self.kind == K8sKinds.deployment:
                replicas = self.status.get('available_replicas', 0)
            else:
                replicas = self.status.get('ready_replicas', 0)
            total_replicas = self.status.get('replicas', 0)
            if total_replicas > 0 and replicas == 0:
                return False
            return True
        elif self.kind == K8sKinds.daemon_set:
            ready_number = self.status.get('numberReady', 0)
            desired_number = self.status.get('desiredNumberScheduled', 0)
            return desired_number == ready_number
        else:
            ready_replicas = self.status.get('ready_replicas')
            total_replicas = self.status.get('replicas')
            if not (ready_replicas and total_replicas):
                return False
            return ready_replicas == total_replicas


class ClusterRoleEntity(BaseK8sEntity):
    """
    Kubernetes ClusterRole entity.
    """
    kind: Literal[K8sKinds.cluster_role] = Field(description='Type of entity.', example=K8sKinds.cluster_role)


class ClusterRoleBindingEntity(BaseK8sEntity):
    """
    Kubernetes ClusterRoleBinding entity.
    """
    kind: Literal[K8sKinds.cluster_role_binding] = Field(
        description='Type of entity.',
        example=K8sKinds.cluster_role_binding
    )


class ConfigMapEntity(BaseK8sEntity):
    """
    Kubernetes ConfigMap entity.
    """
    kind: Literal[K8sKinds.config_map] = Field(description='Type of entity.', example=K8sKinds.config_map)


class CronJobEntity(BaseK8sEntity):
    """
    Kubernetes CronJob entity.
    """
    kind: Literal[K8sKinds.cron_job] = Field(description='Type of entity.', example=K8sKinds.cron_job)


class DaemonSetEntity(BaseK8sEntity):
    """
    Kubernetes DaemonSet entity.
    """
    kind: Literal[K8sKinds.daemon_set] = Field(description='Type of entity.', example=K8sKinds.daemon_set)


class DeploymentEntity(BaseK8sEntity):
    """
    Kubernetes Deployment entity.
    """
    kind: Literal[K8sKinds.deployment] = Field(description='Type of entity.', example=K8sKinds.deployment)


class IngressEntity(BaseK8sEntity):
    """
    Kubernetes Ingress entity.
    """
    kind: Literal[K8sKinds.ingress] = Field(description='Type of entity.', example=K8sKinds.ingress)


class JobEntity(BaseK8sEntity):
    """
    Kubernetes Job entity.
    """
    kind: Literal[K8sKinds.job] = Field(description='Type of entity.', example=K8sKinds.job)

    @property
    def is_failed(self) -> bool:
        """
        Returns True if job execution failed.
        """
        is_failed = False
        conditions = self.status.get('conditions') or []
        if not conditions:
            # No any conditions yet.
            return is_failed
        failed_condition = next(
            (condition for condition in conditions if condition.type == 'Failed' and condition.status),
            None
        )
        if failed_condition is not None:
            is_failed = True

        return is_failed

    @property
    def is_completed(self) -> bool:
        """
        Returns True if job execution successfully completed.
        """
        is_completed = False
        conditions = self.status.get('conditions') or []
        if not conditions:
            # No any conditions yet.
            return is_completed
        complete_condition = next(
            (condition for condition in conditions if condition.get('type') == 'Complete' and condition.get('status')),
            None
        )
        if complete_condition is not None:
            is_completed = True

        return is_completed


class NamespaceEntity(BaseK8sEntity):
    """
    Kubernetes Namespace entity.
    """
    kind: Literal[K8sKinds.namespace] = Field(description='Type of entity.', example=K8sKinds.namespace)


class PersistentVolumeClaimEntity(BaseK8sEntity):
    """
    Kubernetes PersistentVolumeClaim entity.
    """
    kind: Literal[K8sKinds.persistent_volume_claim] = Field(
        description='Type of entity.',
        example=K8sKinds.persistent_volume_claim
    )


class PodEntity(BaseK8sEntity):
    """
    Kubernetes Pod entity.
    """
    kind: Literal[K8sKinds.pod] = Field(description='Type of entity.', example=K8sKinds.pod)


class PodSecurityPolicyEntity(BaseK8sEntity):
    """
    Kubernetes PodSecurityPolicy entity.
    """
    kind: Literal[K8sKinds.pod_security_policy] = Field(
        description='Type of entity.',
        example=K8sKinds.pod_security_policy
    )


class ReplicaSetEntity(BaseK8sEntity):
    """
    Kubernetes ReplicaSet entity.
    """
    kind: Literal[K8sKinds.replica_set] = Field(description='Type of entity.', example=K8sKinds.replica_set)


class ReplicationControllerEntity(BaseK8sEntity):
    """
    Kubernetes ClusterRole entity.
    """
    kind: Literal[K8sKinds.replication_controller] = Field(
        description='Type of entity.',
        example=K8sKinds.replication_controller
    )


class RoleEntity(BaseK8sEntity):
    """
    Kubernetes Role entity.
    """
    kind: Literal[K8sKinds.role] = Field(description='Type of entity.', example=K8sKinds.role)


class RoleBindingEntity(BaseK8sEntity):
    """
    Kubernetes RoleBinding entity.
    """
    kind: Literal[K8sKinds.role_binding] = Field(description='Type of entity.', example=K8sKinds.role_binding)


class SecretEntity(BaseK8sEntity):
    """
    Kubernetes Secret entity.
    """
    kind: Literal[K8sKinds.secret] = Field(description='Type of entity.', example=K8sKinds.secret)


class ServiceEntity(BaseK8sEntity):
    """
    Kubernetes Service entity.
    """
    kind: Literal[K8sKinds.service] = Field(description='Type of entity.', example=K8sKinds.service)


class ServiceAccountEntity(BaseK8sEntity):
    """
    Kubernetes ServiceAccount entity.
    """
    kind: Literal[K8sKinds.service_account] = Field(description='Type of entity.', example=K8sKinds.service_account)


class StatefulSetEntity(BaseK8sEntity):
    """
    Kubernetes StatefulSet entity.
    """
    kind: Literal[K8sKinds.stateful_set] = Field(description='Type of entity.', example=K8sKinds.stateful_set)


Entities = Annotated[ClusterRoleEntity |
                     ClusterRoleBindingEntity |
                     ConfigMapEntity |
                     CronJobEntity |
                     DaemonSetEntity |
                     DeploymentEntity |
                     IngressEntity |
                     JobEntity |
                     NamespaceEntity |
                     PersistentVolumeClaimEntity |
                     PodEntity |
                     PodSecurityPolicyEntity |
                     ReplicaSetEntity |
                     ReplicationControllerEntity |
                     RoleEntity |
                     RoleBindingEntity |
                     SecretEntity |
                     ServiceEntity |
                     ServiceAccountEntity |
                     StatefulSetEntity,
                     Field(discriminator='kind')]


class K8sEntitySchema(BaseModel):
    """
    Wrapper class for Kubernetes entities.
    """
    __root__: Entities

    def __iter__(self):
        return iter(self.__root__)

    def __getitem__(self, item):
        return self.__root__[item]

    def __getattribute__(self, name: str) -> Any:
        try:
            value = super().__getattribute__(name)
        except AttributeError:
            value = getattr(self.__root__, name)

        return value

    def dict(self, *args, **kwargs) -> dict:
        data = super().dict(*args, **kwargs)

        return data['__root__']
