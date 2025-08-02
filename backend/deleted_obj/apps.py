from django.apps import AppConfig


class DeletedObjConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'deleted_obj'

    def ready(self):
        import deleted_obj.signals
