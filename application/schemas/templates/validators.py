"""
Template validators.
"""
from collections import Counter


def unique_names(items: list) -> dict:
    """
    Ensures that all items have unique names.
    """
    chart_names = [item.name for item in items]
    duplicate_names = [name for name, count in Counter(chart_names).items() if count > 1]
    if duplicate_names:
        raise ValueError(f'Dublicating name(s) found: {", ".join(duplicate_names)}')

    return items
