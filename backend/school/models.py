from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from location.models import City
from role.models import Role

CustomUser = get_user_model()

class School(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True) 
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    


class Membership(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    is_approved = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'school')

    def clean(self):
        if self.role.scope.name != "school":
            raise ValidationError("School Members roles must have school scoped roles")
        return super().clean()

    def __str__(self):
        return f"{self.user} - {self.role} at {self.school}"