from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, views
from rest_framework.exceptions import NotFound
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from .models import School, Membership, News
from .serializers import SchoolSerializer, MembershipSerializer, NewsSerializer
from .filters import SchoolFilter
from .permissions import IsSchoolNewsEditor

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


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]  
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    lookup_field = "slug"
    filterset_fields = ["published"]
    search_fields = ["title", "body", "author__first_name", "author__last_name"]
    ordering_fields = ["published_at", "created_at"]

    def get_queryset(self):
        school_slug = self.kwargs.get('school_slug')
        # if school_slug:
        return self.queryset.filter(school__slug=school_slug)
        # return self.queryset
    
    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [IsSchoolNewsEditor()]
    
    def perform_create(self, serializer):
        school_slug = self.kwargs.get('school_slug')
        serializer.save(author=self.request.user, school__slug=school_slug)

    def get_object(self):
        slug = self.kwargs.get('slug')
        school_slug = self.kwargs.get('school_slug')
        try:
            return self.queryset.get(school__slug=school_slug, slug=slug)
        except News.objects.DoesNotExist:
            raise NotFound("news for the given school and title does not exist.")
        

