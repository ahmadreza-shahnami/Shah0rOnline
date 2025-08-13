from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from rest_framework import viewsets, permissions, views
from rest_framework.exceptions import NotFound
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from article.models import NewsArticle
from .models import School, Membership, Grade, Classroom
from .serializers import SchoolSerializer, MembershipSerializer, NewsSerializer,\
      GradeSerializer, ClassroomSerializer
from .filters import SchoolFilter
from .permissions import IsSchoolNewsEditor, HasSchoolPermission

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

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [HasSchoolPermission]
    permission_level = 5
    permission_safe_methodes = True
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["name"]
    ordering = ["name"]  


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [HasSchoolPermission]
    permission_level = 7
    permission_safe_methodes = True
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name"]
    ordering = ["name"]  


# Dependent Views
class NewsViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    pagination_class = PageNumberPagination
    lookup_field = "slug"
    filterset_fields = ["published"]
    search_fields = ["title", "body", "author__first_name", "author__last_name"]
    ordering_fields = ["published_at", "created_at"]

    def get_queryset(self):
        school_slug = self.kwargs.get('school_slug')
        school = School.objects.get(slug=school_slug)

        return self.queryset.filter(content_type=ContentType.objects.get_for_model(School),
            object_id=school.id)
    
    def get_permissions(self):
        # if self.request.method == "GET":
            # return [permissions.AllowAny()]
        return [IsSchoolNewsEditor()]

    def get_object(self):
        school_slug = self.kwargs.get('school_slug')
        school = School.objects.get(slug=school_slug)

        slug = self.kwargs.get('slug')
        try:
            return self.queryset.get(content_type=ContentType.objects.get_for_model(School),
                                    object_id=school.id, slug=slug)
        except NewsArticle.DoesNotExist:
            raise NotFound("news for the given school and title does not exist.")
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        related_object = None
        if "school_slug" in self.kwargs:
            related_object = get_object_or_404(School, slug=self.kwargs["school_slug"])
        context["related_object"] = related_object
        return context
        

