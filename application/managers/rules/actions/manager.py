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
    action_settings: dict[RuleActions, list[RuleActionSettingsSchema]]

    def __init__(self, action_settings: list[RuleActionSettingsSchema | dict]) -> None:
        self.action_settings = {}
        for settings in action_settings:
            validated_settings = RuleActionSettingsSchema.parse_obj(settings)
            self.action_settings.setdefault(validated_settings.type, []).append(validated_settings)

    def execute_audit(self, computed_values: dict) -> dict:
        """
        Execute audit rule action.
        """
        audit_settings = self.action_settings.get(RuleActions.audit, [])
        merged_values = merge({}, *[settings.values for settings in audit_settings])
        patched_computed_values = merge({}, computed_values, merged_values)
        difference = DeepDiff(computed_values, patched_computed_values)
        if not difference:
            return {
                'status': RuleAuditResult.compliant,
                'difference': {
                    'absent_values': [],
                    'different_values': {}
                }
            }
        else:
            difference_data = difference.to_dict()
            return {
                'status': RuleAuditResult.violating,
                'difference': {
                    'absent_values': difference_data.get('dictionary_item_added', []),
                    'different_values': {
                        path: {'expected': changes['old_value'], 'actual': changes['new_value']}
                        for path, changes in difference_data.get('values_changed', {}).items()
                    }
                }
            }
