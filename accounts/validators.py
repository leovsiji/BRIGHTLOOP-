import re
from django.core.exceptions import ValidationError


class ComplexPasswordValidator:
    """Requires an uppercase letter, a lowercase letter and a special character."""

    def validate(self, password, user=None):
        errors = []
        if not re.search(r"[A-Z]", password):
            errors.append("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", password):
            errors.append("Password must contain at least one lowercase letter.")
        if not re.search(r"[^A-Za-z0-9]", password):
            errors.append("Password must contain at least one special character.")
        if errors:
            raise ValidationError(errors)

    def get_help_text(self):
        return "Use an uppercase letter, a lowercase letter and a special character."