from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from .models import Role, Permission

@receiver(m2m_changed, sender=Role.permissions.through)
def validate_permission_scope(sender, instance, action, pk_set, **kwargs):
    if action == 'pre_add':
        role_scope = instance.scope
        for perm_id in pk_set:
            perm = Permission.objects.get(pk=perm_id)
            if perm.scope != role_scope:
                raise ValidationError(
                    f"Permission '{perm.code}' must match the role's scope '{role_scope.name}'."
                )
