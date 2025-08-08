from rest_framework import serializers
from .models import School, Membership

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

