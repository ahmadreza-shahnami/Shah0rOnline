from rest_framework import serializers
from . import models
from account.serializers import UserSerializer
from account.models import CustomUser
import os

class StoreSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    owner_id = serializers.PrimaryKeyRelatedField(
        source='owner', 
        queryset=CustomUser.objects.all(),
        write_only=True
    )
    class Meta:
        model = models.Store
        fields = "__all__"
        read_only_fields = ['updated_at', 'created_at', "is_verified"]

    def create(self, validated_data):
        validated_data['is_active'] = True  # یا مقدار مورد نظر شما
        return super().create(validated_data)    

    def validate_image(self, image):
        valid_mime_types = ['image/jpeg', 'image/png']
        valid_extensions = ['.jpg', '.jpeg', '.png']
        

        if image.content_type not in valid_mime_types:
            raise serializers.ValidationError("Only JPEG and PNG files are allowed.")
        
        ext = os.path.splitext(image.name)[1]
        if ext.lower() not in valid_extensions:
            raise serializers.ValidationError("Invalid image file extension.")
        
        return image      


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        excluded = ['product']

    def validate_image(self, image):
        valid_mime_types = ['image/jpeg', 'image/png']
        valid_extensions = ['.jpg', '.jpeg', '.png']
        

        if image.content_type not in valid_mime_types:
            raise serializers.ValidationError("Only JPEG and PNG files are allowed.")
        
        ext = os.path.splitext(image.name)[1]
        if ext.lower() not in valid_extensions:
            raise serializers.ValidationError("Invalid image file extension.")
        
        return image      


class ServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ServiceImage
        excluded = ['service']

    def validate_image(self, image):
        valid_mime_types = ['image/jpeg', 'image/png']
        valid_extensions = ['.jpg', '.jpeg', '.png']
        

        if image.content_type not in valid_mime_types:
            raise serializers.ValidationError("Only JPEG and PNG files are allowed.")
        
        ext = os.path.splitext(image.name)[1]
        if ext.lower() not in valid_extensions:
            raise serializers.ValidationError("Invalid image file extension.")
        
        return image    


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = models.Product
        fields = "__all__"
        read_only_fields = ['updated_at', 'created_at']


class ServiceSerializer(serializers.ModelSerializer):
    images = ServiceImageSerializer(many=True, read_only=True)
    class Meta:
        model = models.Service
        fields = "__all__"
        read_only_fields = ['updated_at', 'created_at']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'
        read_only_fields = ['is_active', 'created_at']