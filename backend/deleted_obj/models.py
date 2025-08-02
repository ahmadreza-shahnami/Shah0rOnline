from django.db import models

class ArchivedObject(models.Model):
    model_name = models.CharField(verbose_name="Model", max_length=100)
    object_id = models.IntegerField(verbose_name="object_id")
    deleted_at = models.DateTimeField(verbose_name="deleted at", auto_now_add=True)
    data = models.JSONField(verbose_name="data")


    def __str__(self):
        return self.model_name + " - " + str(self.object_id)
