from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, views
from rest_framework.exceptions import NotFound
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from .models import School, Membership
from .serializers import SchoolSerializer, MembershipSerializer
from .filters import SchoolFilter

class SchoolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = School.objects.filter(approved=True)
    serializer_class = SchoolSerializer
    permission_classes = [permissions.AllowAny]  # همه حتی مهمان می‌تونن ببینن
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    lookup_field = 'slug'
    filterset_class = SchoolFilter
    search_fields = ["name", "city__name"]
    ordering_fields = ["name", "city__name"]
    ordering = ["name"]  # پیش‌فرض مرتب‌سازی بر اساس اسم

class MembershipAPIView(views.APIView):
    # permission_classes= [permissions.AllowAny]

    def get_object(self, school_slug):
        try:
            return Membership.objects.get(school__slug=school_slug, user=self.request.user.id, is_approved=True)
        except Membership.DoesNotExist:
            raise NotFound("Membership for the given school does not exist.")

    def get(self, request, school_slug):
        config = self.get_object(school_slug)
        serializer = MembershipSerializer(config)
        return Response(serializer.data)
    
