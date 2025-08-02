from django.db import models
from django.core.exceptions import ValidationError

class Scope(models.Model):
    SCOPE_CHOICES = [
        ("global", "Global"),
        ("school", "School"),
        ('shop', 'Shop'),
    ]
    name = models.CharField(max_length=50, choices=SCOPE_CHOICES, unique=True)

    def __str__(self):
        return self.name


class Role(models.Model):

    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField('Permission', blank=True)
    scope = models.ForeignKey(Scope, on_delete=models.CASCADE)
    level = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True)  
    description = models.TextField(blank=True)
    scope = models.ForeignKey(Scope, on_delete=models.CASCADE)

    def __str__(self):
        return self.code
