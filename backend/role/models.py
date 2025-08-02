from django.db import models

class Role(models.Model):
    name = models.CharField(verbose_name="name", max_length=50, unique=True)
    description = models.TextField(verbose_name="description", blank=True)
    created_at = models.DateTimeField(verbose_name="created_at", auto_now_add=True)

    def __str__(self):
        return self.name

