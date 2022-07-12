"""
Rules constants.
"""
from enum import Enum


class RuleAttribute(str, Enum):
    """
    Variables available for comparison.
    """
    cloud_provider = 'cloud_provider'
    cluster_region = 'cluster_region'
    context_name = 'context_name'
    namespace = 'namespace'
    release_name = 'release_name'


class RuleComparisonStatements(str, Enum):
    """
    Available comparison statements in rule conditions.
    """
    contains = 'contains'
    equal = 'equal'
    not_equal = 'not_equal'
    regex = 'regex'
