from django.contrib import admin
from .models import Product, Store, Category, Service, ProductImage, ServiceImage


admin.site.register(Store)
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Service)
admin.site.register(ProductImage)
admin.site.register(ServiceImage)
