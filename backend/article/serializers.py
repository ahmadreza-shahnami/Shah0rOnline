from rest_framework import serializers
from .models import Category
from django.contrib.contenttypes.models import ContentType

class CategorySerializer(serializers.ModelSerializer):
    full_path = serializers.CharField(source="get_full_path", read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "full_path", "parent"]
        read_only_fields = ["slug", "full_path"]