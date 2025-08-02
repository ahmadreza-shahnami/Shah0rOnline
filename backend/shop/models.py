from django.db import models
from account.models import CustomUser
from location.models import City


class Store(models.Model):
    STATUS_CHOICES = (
        ('O', 'Open'),
        ('C', 'Closed'),
    )

    store_id = models.CharField(verbose_name="store id", max_length=50, unique=True)
    name = models.CharField(verbose_name="name", max_length=50)
    description = models.TextField(verbose_name="description", null=True, blank=True)
    address = models.TextField(verbose_name="address", null=True, blank=True)
    latitude = models.DecimalField(verbose_name="latitude", max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(verbose_name="longitude", max_digits=9, decimal_places=6, null=True, blank=True)
    phone = models.CharField(verbose_name="phone", max_length=50, null=True, blank=True)
    city = models.ForeignKey(City, verbose_name="city", on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(verbose_name="status", max_length=1, choices=STATUS_CHOICES, default='O')
    tour_page = models.URLField(verbose_name="virtual tour", max_length=200, null=True, blank=True)
    owner = models.ForeignKey(CustomUser, verbose_name="owner", on_delete=models.CASCADE)
    image = models.ImageField(verbose_name="image", upload_to="store/", null=True, blank=True)
    created_at = models.DateTimeField(verbose_name="created at", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="updated at", auto_now=True)
    is_active = models.BooleanField(verbose_name="is active", default=True)
    is_verified = models.BooleanField(verbose_name="is verified", default=False)

    def deactive(self):
        self.is_active = False
        self.save()  

    def active(self):
        self.is_active = True
        self.save()  

    def __str__(self):
        return f"{self.name} (@{self.store_id})"   

class Category(models.Model):
    store = models.ForeignKey(Store, verbose_name="store", on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    name = models.CharField(verbose_name="name", max_length=100)
    description = models.TextField(verbose_name="description", blank=True, null=True)
    parent = models.ForeignKey('self', verbose_name="parent", on_delete=models.CASCADE, related_name='children', null=True, blank=True)
    is_active = models.BooleanField(verbose_name="is_active", default=True)
    created_at = models.DateTimeField(verbose_name="created_at", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="updated_at", auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.store.name})'



class Product(models.Model):
    name = models.CharField(verbose_name="name", max_length=50)
    description = models.TextField(verbose_name="description", null=True, blank=True)
    price = models.IntegerField(verbose_name="price")
    stock = models.IntegerField(verbose_name="stock", default=0)
    category = models.ForeignKey(Category, verbose_name="category", on_delete=models.SET_NULL, null=True, blank=True)
    store = models.ForeignKey(Store, verbose_name="store", on_delete=models.CASCADE)
    is_active = models.BooleanField(verbose_name="is active", default=True)
    created_at = models.DateTimeField(verbose_name="created at", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="updated at", auto_now=True)


class Service(models.Model):
    name = models.CharField(verbose_name="name", max_length=50)
    description = models.TextField(verbose_name="description", null=True, blank=True)
    price = models.IntegerField(verbose_name="price")
    duration = models.DurationField(verbose_name="duration", null=True, blank=True) 
    category = models.ForeignKey(Category, verbose_name="category", on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(verbose_name="is active", default=True)
    store = models.ForeignKey(Store, verbose_name="store", on_delete=models.CASCADE)
    created_at = models.DateTimeField(verbose_name="created at", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="updated at", auto_now=True)


class ProductImage(models.Model):
    image = models.ImageField(verbose_name="image", upload_to="products/")
    product = models.ForeignKey(Product, verbose_name="product", on_delete=models.CASCADE, related_name='images')
    uploaded_at = models.DateTimeField(verbose_name="created at", auto_now_add=True)
    is_active = models.BooleanField(verbose_name="is active", default=True)


class ServiceImage(models.Model):
    image = models.ImageField(verbose_name="image", upload_to="services/")
    service = models.ForeignKey(Service, verbose_name="service", on_delete=models.CASCADE, related_name='images')
    uploaded_at = models.DateTimeField(verbose_name="created at", auto_now_add=True)
    is_active = models.BooleanField(verbose_name="is active", default=True)





