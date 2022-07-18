from .base_enum import StrEnum


class ServiceTypes(StrEnum):
    """
    Types of services in Service catalog.
    """
    http_endpoint = 'http_endpoint'
    kubernetes_ingress = 'kubernetes_ingress'
    kubernetes_service = 'kubernetes_service'


class ServiceHealthStatuses(StrEnum):
    """
    Operability status of service from service catalog.
    """
    healthy = 'healthy'
    unhealthy = 'unhealthy'
