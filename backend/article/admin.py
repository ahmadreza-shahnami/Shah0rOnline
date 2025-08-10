from django.contrib import admin
from .models import NewsArticle, Category


admin.site.register(NewsArticle)
admin.site.register(Category)