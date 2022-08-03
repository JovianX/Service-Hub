"""
Rule action manager.
"""
from deepdiff import DeepDiff
from mergedeep import merge

from application.constants.rules import RuleActions
from application.constants.rules import RuleAuditResult
from application.managers.rules.schemas import RuleActionSettingsSchema


class ActionManager:
    """
    Class responsible for executing rule actions.
    """
    action_settings: list[RuleActionSettingsSchema]

    def __init__(self, action_settings: list[RuleActionSettingsSchema | dict]) -> None:
        self.action_settings = []
        for settings in action_settings:
            validated_settings = RuleActionSettingsSchema.parse_obj(settings)
            self.action_settings.append(validated_settings)

    def audit_values(self, values: dict) -> dict:
        """
        Execute audit rule action.
        """
        merged_values = merge({}, *[settings.values for settings in self.action_settings])
        patched_computed_values = merge({}, values, merged_values)
        difference = DeepDiff(values, patched_computed_values)

        return difference.to_dict()

    def execute_audit(self, computed_values: dict) -> dict:
        """
        Execute audit rule action.
        """
        result = {
            'status': RuleAuditResult.compliant,
            'difference': {
                'absent_values': [],
                'different_values': {}
            }
        }
        merged_values = merge({}, *[settings.values for settings in self.action_settings])
        patched_computed_values = merge({}, computed_values, merged_values)
        difference = DeepDiff(computed_values, patched_computed_values)
        if difference:
            result['status'] = RuleAuditResult.violating
            result['difference']['absent_values'] = list(difference.get('dictionary_item_added', []))
            result['difference']['different_values'] = {
                path: {
                    'expected': changes['old_value'],
                    'actual': changes['new_value']
                }
                for path, changes in difference.get('values_changed', {}).items()
            }

        return result

    def values_to_apply(self, computed_values: dict) -> dict:
        """
        Form ups details of values of apply rules.
        """
        merged_values = merge({}, *[settings.values for settings in self.action_settings])
        result = {
            'values': merged_values,
            'difference': {
                'absent_values': [],
                'different_values': {}
            }
        }
        patched_computed_values = merge({}, computed_values, merged_values)
        difference = DeepDiff(computed_values, patched_computed_values)
        if difference:
            result['difference']['absent_values'] = list(difference.get('dictionary_item_added', []))
            result['difference']['different_values'] = {
                path: {
                    'expected': changes['old_value'],
                    'actual': changes['new_value']
                }
                for path, changes in difference.get('values_changed', {}).items()
            }

        return result
