from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="name")
    country_code = models.CharField(max_length=50, verbose_name="Country Code")
    created_at = models.DateTimeField(verbose_name="created at", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="updated at", auto_now=True)

    def __str__(self):
        return self.name
    
class City(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="name")   
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="country", verbose_name="country")
    created_at = models.DateTimeField(verbose_name="created at", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="updated at", auto_now=True)

    def __str__(self):
        return f"{self.name}, {self.country}"

