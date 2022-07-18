"""
Rules constants.
"""
from .base_enum import StrEnum


class RuleAttribute(StrEnum):
    """
    Variables available for comparison.
    """
    cloud_provider = 'cloud_provider'
    cluster_region = 'cluster_region'
    context_name = 'context_name'
    namespace = 'namespace'
    release_name = 'release_name'


class RuleComparisonStatements(StrEnum):
    """
    Available comparison statements in rule conditions.
    """
    contains = 'contains'
    equal = 'equal'
    not_equal = 'not_equal'
    regex = 'regex'


class RuleActions(StrEnum):
    """
    Types of rule actions.
    """
    audit = 'audit'
    apply = 'apply'


class RuleAuditResult(StrEnum):
    """
    Result of audit action of rule.
    """
    violating = 'violating'
    compliant = 'compliant'
