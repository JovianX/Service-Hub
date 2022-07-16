from enum import Enum


class ServiceTypes(str, Enum):
    """
    Types of services in Service catalog.
    """
    http_endpoint = 'http_endpoint'
    kubernetes_ingress = 'kubernetes_ingress'
    kubernetes_service = 'kubernetes_service'


class ServiceHealthStatuses(str, Enum):
    """
    Operability status of service from service catalog.
    """
    healthy = 'healthy'
    unhealthy = 'unhealthy'