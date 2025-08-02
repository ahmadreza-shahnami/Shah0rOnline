from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import ArchivedObject
from datetime import datetime, date
from decimal import Decimal
from django.db.models.fields.files import ImageFieldFile, FileField

WATCHED_MODELS = ['CustomUser', 'Store', 'Category', 'Product', 'Service', 'ProductImage', 'ServiceImage']

def serialize_value(value):
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    elif isinstance(value, Decimal):
        return float(value)
    elif hasattr(value, 'pk'):
        return value.pk
    elif isinstance(value, (ImageFieldFile, FileField)):
        return value.name if value else None
    return value

@receiver(pre_delete)
def archive_before_delete(sender, instance, **kwargs):
    model_name = sender.__name__
    
    if model_name not in WATCHED_MODELS:
        return

    data = {}
    for field in instance._meta.fields:
        name = field.name
        value = getattr(instance, name)
        data[name] = serialize_value(value)

    ArchivedObject.objects.create(
        model_name=model_name,
        object_id=instance.id,
        data=data
    )