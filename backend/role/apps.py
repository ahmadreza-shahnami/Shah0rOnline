from django.apps import AppConfig


class RoleConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'role'

    def ready(self):
        from role import receivers