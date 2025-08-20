from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from rest_framework import viewsets, permissions, views, status
from rest_framework.decorators import action  
from rest_framework.exceptions import NotFound
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from article.models import NewsArticle
from .models import School, Membership, Grade, Classroom, WeeklySchedule, VirtualTour
from .serializers import SchoolSerializer, MembershipSerializer, NewsSerializer,\
      GradeSerializer, ClassroomSerializer, WeeklyScheduleSerializer,\
      VirtualTourSerializer, GradeClassroomSerializer
from .filters import SchoolFilter
from .permissions import IsSchoolNewsEditor, HasSchoolPermission, MembershipPermission

class CustomViewSet(viewsets.ModelViewSet):
    # Defaults for all child viewsets
    permission_level = 0
    permission_safe_methods = True
    permission_code = []

    def get_permission_level(self):
        return getattr(self, "permission_level", 0)

    def get_permission_safe_methods(self):
        return getattr(self, "permission_safe_methods", True)
    
    def get_permission_codes(self):
        return getattr(self, "permission_codes", [])
    
class CustomAPIView(views.APIView):
    # Defaults for all child viewsets
    permission_level = 0
    permission_safe_methods = True
    permission_code = []

    def get_permission_level(self):
        return getattr(self, "permission_level", 0)

    def get_permission_safe_methods(self):
        return getattr(self, "permission_safe_methods", True)
    
    def get_permission_codes(self):
        return getattr(self, "permission_codes", [])
    

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

class MembershipViewSet(CustomViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [MembershipPermission] 
    permission_level = 8 
    # permission_safe_methods = True
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["role__user__username", "role__user__first_name", "role__user__last_name","role__user__national_code"]
    filterset_fields = ["role__name"]


    def get_queryset(self):
        school_slug = self.kwargs.get('school_slug')
        school = get_object_or_404(School, slug=school_slug)
        user_memberships = self.queryset.filter(user=self.request.user.id, school=school, is_approved=True)
        if not user_memberships.exists():
            return self.queryset.none()
        if user_memberships.first().role.level >= self.permission_level:
            return self.queryset.filter(school=school)
        return user_memberships
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        school = None
        if "school_slug" in self.kwargs:
            school = get_object_or_404(School, slug=self.kwargs["school_slug"])
        context["school"] = school
        context['user'] = self.request.user
        return context
    
    @action(detail=False, methods=['get'])
    def me(self, request, school_slug):
        try:
            member = get_object_or_404(Membership, school__slug=school_slug, user=self.request.user.id)
            serializer = self.serializer_class(member)
            if member.is_approved == False:
                Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(serializer.data)
        except Membership.DoesNotExist:
            raise NotFound("Membership for the given school does not exist.")
    
    @action(detail=True, methods=["patch"], permission_level=8)
    def approve(self, request, school_slug, pk):
        member = get_object_or_404(Membership, id=pk, school__slug=school_slug)
        member.is_approved = True
        member.save()
        serializer = self.serializer_class(member)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_safe_methods=False)
    def pending(self, request, school_slug):
        not_approved_members = Membership.objects.filter(school__slug=school_slug ,is_approved=False)
        serializer = self.serializer_class(not_approved_members, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=["patch"], permission_level=8)
    def assign_to_class(self, request, school_slug, pk):
        member = get_object_or_404(Membership, id=pk, school__slug=school_slug)
        classroom = get_object_or_404(Classroom, id=request.data.get("classroom"))
        member.classroom = classroom
        member.save()
        serializer = self.serializer_class(member)
        return Response(serializer.data)
    
    def get_permission_level(self):
        if self.request.method == "POST":
            return 0
        return super().get_permission_level()


class GradeViewSet(CustomViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [HasSchoolPermission]
    permission_level = 8
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name"]
    ordering = ["name"] 


    def get_queryset(self):
        school_slug = self.kwargs.get('school_slug')
        school = School.objects.get(slug=school_slug)

        return self.queryset.filter(school=school)
    
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        school = None
        if "school_slug" in self.kwargs:
            school = get_object_or_404(School, slug=self.kwargs["school_slug"])
        context["school"] = school
        return context 
    
    @action(detail=False, methods=["get"])
    def all_classrooms(self, request, school_slug):
        school = get_object_or_404(School, slug=school_slug)
        grades = self.get_queryset().filter(school=school)
        classrooms = Classroom.objects.filter(grade__in=grades)
        serializer = GradeClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)



class ClassroomViewSet(CustomViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [HasSchoolPermission]
    permission_level = 8
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name"]
    ordering = ["name"] 

    def get_queryset(self):
        grade_pk = self.kwargs.get('grade_pk')
        grade = Grade.objects.get(pk=grade_pk)
        return self.queryset.filter(grade=grade)
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        grade = None
        if "grade_pk" in self.kwargs:
            grade = get_object_or_404(Grade, id=self.kwargs["grade_pk"])
        context["grade"] = grade
        return context


class WeeklyScheduleViewSet(CustomViewSet):
    queryset = WeeklySchedule.objects.all()
    serializer_class = WeeklyScheduleSerializer
    permission_classes = [HasSchoolPermission]
    permission_level = 8
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["subject", "day_of_week"]
    ordering = ["day_of_week", "start_time"] 

    def get_queryset(self):
        classroom_pk = self.kwargs.get('classroom_pk')
        classroom = Classroom.objects.get(pk=classroom_pk)

        return self.queryset.filter(classroom=classroom).order_by('day_of_week', 'start_time')
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        classroom = None
        if "classroom_pk" in self.kwargs:
            classroom = get_object_or_404(Classroom, id=self.kwargs["classroom_pk"])
        context["classroom"] = classroom
        return context


class VirtualTourAPIView(CustomAPIView):
    permission_classes = [HasSchoolPermission]
    permission_level = 10
    permission_safe_methods = True
    parser_classes = [MultiPartParser, FormParser]


    def get_object(self, school_slug):
        try:
            return VirtualTour.objects.get(school__slug=school_slug)
        except VirtualTour.DoesNotExist:
            raise NotFound("VirtualTour for the given school does not exist.")

    def get(self, request, school_slug):
        config = self.get_object(school_slug)
        serializer = VirtualTourSerializer(config)
        return Response(serializer.data)
   
    def post(self, request, school_slug):
        school = get_object_or_404(School, slug=school_slug)

        zip_file = request.data.get('zip_file')
        title = request.data.get('title')

        if not zip_file:
            return Response({"error": "zip_file is required"}, status=status.HTTP_400_BAD_REQUEST)

        virtual_tour, created = VirtualTour.objects.get_or_create(
            school=school,
            defaults={'title': title, 'zip_file': zip_file}
        )
        if not created:
            virtual_tour.title = title or virtual_tour.title
            virtual_tour.zip_file = zip_file
            virtual_tour.save()

        serializer = VirtualTourSerializer(virtual_tour)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

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
        

