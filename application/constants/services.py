from enum import Enum


class ServiceTypes(str, Enum):
    """
    Types of services in Service catalog.
    """
    http_endpoint = 'http_endpoint'
    kubernetes_ingress = 'kubernetes_ingress'
    kubernetes_service = 'kubernetes_service'
