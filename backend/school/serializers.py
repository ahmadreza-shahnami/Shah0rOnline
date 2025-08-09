from rest_framework import serializers
from .models import School, Membership, News

class SchoolSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source="city.name", read_only=True)
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = School
        fields = [
            "id",
            "name",
            "slug",
            "city_name",
            "type_display",
            "approved",
        ]
        extra_kwargs = {
            'type': {'write_only': True},
        }


class MembershipSerializer(serializers.ModelSerializer):
    role = serializers.StringRelatedField()

    class Meta:
        model = Membership
        fields = [
            "id",
            "user",
            "school",
            "role",
            "is_approved"
        ]

class NewsSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    school_slug = serializers.CharField(source="school.slug", read_only=True)

    class Meta:
        model = News
        fields = [
            "id",
            "school_slug",
            "title",
            "slug",
            "body",
            "cover",
            "author",
            "author_name",
            "published",
            "published_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "author", "author_name", "published_at", "created_at", "updated_at"]

    def get_author_name(self, obj):
        if obj.author:
            return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username
        return None

    def create(self, validated_data):
        # author will be set in the view's perform_create
        return super().create(validated_data)