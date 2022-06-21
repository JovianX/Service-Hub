from typing import Optional

from pydantic import BaseModel
from pydantic import Field

from application.constants.kubernetes import K8sKinds


class K8sEntitySchema(BaseModel):
    """
    Kubernetes entity.
    """
    api_version: str = Field(alias='apiVersion', description='API version')
    kind: str = Field(description='Type if entity')
    metadata: dict = Field(description='Entity metadata')
    specification: Optional[dict] = Field(alias='spec', default={}, description='Entity technical specification')
    status: Optional[dict] = Field(default={}, description='Entity status')

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
        elif self.kind in (K8sKinds.stateful_set, K8sKinds.replica_set, K8sKinds.deployment):
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
        return False
