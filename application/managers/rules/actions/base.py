"""
Rule base action class.
"""
from application.constants.rules import RuleActions
from application.managers.rules.schemas import RuleActionSettingsSchema


class Action:
    """
    Rule action base class.

    Can be used as factory to get action class based on action type.
    Don't forget to add new inherired classes to __init__.py file to make Python
    interpreter aquntited about them.
    """
    @property
    def type(self) -> RuleActions:
        """
        Rule action type.
        """
        raise NotImplementedError()

    def __new__(cls, action_settings: RuleActionSettingsSchema):
        settings = RuleActionSettingsSchema.parse_obj(action_settings)
        if settings.type not in RuleActions:
            raise ValueError(f'Unknown rule action: {settings.type}')

        class_mapping = {}
        for subclass in cls.__subclasses__():
            # Selfcheck that there no dublicating brands in classes.
            if subclass.type in class_mapping:
                raise ValueError(
                    f'Duplicating implementation of action "{settings.type}". Duplacating classes: {subclass.__name__} '
                    f'and {class_mapping[subclass.type].__name__}'
                )
            class_mapping[subclass.type] = subclass

        return object.__new__(class_mapping[settings.type])
