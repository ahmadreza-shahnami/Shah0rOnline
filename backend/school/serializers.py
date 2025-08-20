from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from article.models import NewsArticle, Category
from article.serializers import CategorySerializer
from .models import School, Membership, Grade, Classroom, WeeklySchedule, VirtualTour, Role


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
    ROLE_CHOICES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("hoosen", "Hoosen"),
    ]

    # For input only
    role_choice = serializers.ChoiceField(
        choices=ROLE_CHOICES,
        write_only=True
    )

    # Read-only fields
    user = serializers.StringRelatedField(read_only=True)
    school = serializers.StringRelatedField(read_only=True)
    role = serializers.StringRelatedField(read_only=True)
    classroom = serializers.StringRelatedField(read_only=True)
    is_approved = serializers.BooleanField(read_only=True)

    class Meta:
        model = Membership
        fields = [
            "id",
            "user",
            "school",
            "role",
            "role_choice",   # only appears in requests, not responses
            "classroom",
            "is_approved"
        ]

    def validate(self, attrs):
        role_choice = attrs.get("role_choice")
        classroom = attrs.get("classroom")

        if role_choice != "student" and classroom is not None:
            raise serializers.ValidationError(
                f"Role '{role_choice}' can't be assigned to a classroom."
            )
        return attrs

    def create(self, validated_data):
        user = self.context.get("user")
        school = self.context.get("school")
        role_choice = validated_data.pop("role_choice")

        if user is None:
            raise serializers.ValidationError("User must be provided via context.")
        if school is None:
            raise serializers.ValidationError("School must be provided via context.")

        try:
            role = Role.objects.get(name=role_choice)
        except Role.DoesNotExist:
            raise serializers.ValidationError({"role_choice": f"Invalid role: {role_choice}"})

        membership = Membership.objects.create(
            user=user,
            school=school,
            role=role,
            **validated_data
        )
        return membership



class GradeSerializer(serializers.ModelSerializer):
    school = serializers.StringRelatedField()

    class Meta:
        model = Grade
        fields = [
            "id",
            "school",
            "name",
            "description"
        ]

    def create(self, validated_data):
        school = self.context.get("school")
        validated_data['school'] = school
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        school = self.context.get("school")
        if school:
            validated_data['school'] = school
        return super().update(instance, validated_data)


class ClassroomSerializer(serializers.ModelSerializer):
    grade = serializers.StringRelatedField()
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = Classroom
        fields = [
            "id",
            "grade",
            "name",
            "teacher",
            "teacher_name"
        ]
        extra_kwargs = {
            "teacher": {"write_only":True}
        }
    def get_teacher_name(self, obj):
        return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}"
    
    def create(self, validated_data):
        grade = self.context.get("grade")
        validated_data['grade'] = grade
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        grade = self.context.get("grade")
        if grade:
            validated_data['grade'] = grade
        return super().update(instance, validated_data)

class WeeklyScheduleSerializer(serializers.ModelSerializer):
    classroom = serializers.StringRelatedField()
    day_of_week_display = serializers.CharField(source="get_type_display", read_only=True)
    
    class Meta:
        model = WeeklySchedule
        fields = [
            "id",
            "classroom",
            "day_of_week_display",
            "subject",
            "start_time",
            "end_time",
        ]
        extra_kwargs ={
            'day_of_week': {'write_only': True},
        }

    def create(self, validated_data):
        classroom = self.context.get("classroom")
        validated_data['classroom'] = classroom
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        classroom = self.context.get("classroom")
        if classroom:
            validated_data['classroom'] = classroom
        return super().update(instance, validated_data)
    

class VirtualTourSerializer(serializers.ModelSerializer):
    index_url = serializers.SerializerMethodField()

    class Meta:
        model = VirtualTour
        fields = ['id', 'school', 'title', 'zip_file', 'uploaded_at', 'index_url']
        read_only_fields = ['uploaded_at', 'index_url']

    def get_index_url(self, obj):
        return obj.get_index_url()
    
    
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
    
