from django.db import models
from django.core.exceptions import ValidationError

class Role(models.Model):
    APP_CHOICES = [
    ('global', 'Global'),
    ('school', 'School'),
    ('shop', 'Shop'),
]
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField('Permission', blank=True)
    app = models.CharField(max_length=50, choices=APP_CHOICES, default='global')
    level = models.PositiveIntegerField(default=0)
    is_global = models.BooleanField(default=True)  

    def __str__(self):
        return self.name
    
    def clean(self):
        if self.is_global and self.app != 'global':
            raise ValidationError("Global roles must have app='global'")


class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True)  
    description = models.TextField(blank=True)

    def __str__(self):
        return self.code
