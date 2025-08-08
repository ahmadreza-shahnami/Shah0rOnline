from django_filters import rest_framework as filters
from .models import School

class SchoolFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    city = filters.CharFilter(field_name="city__name", lookup_expr="icontains")
    type = filters.CharFilter(field_name="type")

    class Meta:
        model = School
        fields = ["name", "city", "type"]
