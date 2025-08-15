from django.urls import path
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import SchoolViewSet, MembershipAPIView, NewsViewSet, ClassroomViewSet,\
      GradeViewSet, WeeklyScheduleViewSet, VirtualTourAPIView

router = DefaultRouter()
router.register(r"schools", SchoolViewSet, basename="school")

schools_router = NestedDefaultRouter(router, r'schools', lookup='school')
schools_router.register(r'grades', GradeViewSet, basename='school-grades')
schools_router.register(r'news', NewsViewSet, basename='school-news')

grade_router = NestedDefaultRouter(schools_router, r'grades', lookup='grade')
grade_router.register(r'classrooms', ClassroomViewSet, basename='grade-classes')

classroom_router = NestedDefaultRouter(grade_router, r'classrooms', lookup='classroom')
classroom_router.register(r'schedule', WeeklyScheduleViewSet, basename='classroom-schedule')

urlpatterns = [
    path('schools/<str:school_slug>/membership/',
         MembershipAPIView.as_view(),
         name='school-membership'),
    path('schools/<str:school_slug>/virtual-tour/',
         VirtualTourAPIView.as_view(),
         name='school-tour')
] + router.urls + schools_router.urls + grade_router.urls + classroom_router.urls
