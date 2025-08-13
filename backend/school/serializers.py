from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from article.models import NewsArticle, Category
from article.serializers import CategorySerializer
from .models import School, Membership, Grade, Classroom, WeeklySchedule


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


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = [
            "id",
            "school",
            "name",
            "description"
        ]


class ClassroomSerializer(serializers.ModelSerializer):
    grade = serializers.StringRelatedField()
    teacher = MembershipSerializer()
    
    class Meta:
        model = Classroom
        fields = [
            "id",
            "grade",
            "name",
            "teacher"
        ]

# Dependent Serializers
class NewsSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.none(),  # will override in __init__
        write_only=True
    )

    class Meta:
        model = NewsArticle
        fields = [
            "id",
            "title",
            "slug",
            "summary",
            "body",
            "cover",
            "author",
            "author_name",
            "categories",
            "category_ids",
            "published",
            "published_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "author",
            "author_name",
            "published_at",
            "created_at",
            "updated_at",
        ]

    def __init__(self, *args, **kwargs):
        """Filter category_ids queryset to match the related_object context."""
        super().__init__(*args, **kwargs)

        # If creating/updating within a related_object context
        related_object = self.context.get("related_object")
        if related_object:
            self.fields["category_ids"].child_relation.queryset = Category.objects.filter(
                content_type=ContentType.objects.get_for_model(related_object),
                object_id=related_object.pk
            )
        else:
            # If global news, allow only global categories
            self.fields["category_ids"].queryset = Category.objects.filter(
                content_type__isnull=True,
                object_id__isnull=True
            )

    def get_author_name(self, obj):
        if obj.author:
            return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username
        return None

    def create(self, validated_data):
        category_ids = validated_data.pop("category_ids", [])
        news_item = super().create(validated_data)
        news_item.categories.set(category_ids)
        return news_item

    def update(self, instance, validated_data):
        category_ids = validated_data.pop("category_ids", None)
        news_item = super().update(instance, validated_data)
        if category_ids is not None:
            news_item.categories.set(category_ids)
        return news_item