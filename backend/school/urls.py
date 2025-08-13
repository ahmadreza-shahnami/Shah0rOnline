from django.urls import path
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import SchoolViewSet, MembershipAPIView, NewsViewSet, ClassroomViewSet, GradeViewSet

router = DefaultRouter()
router.register(r"schools", SchoolViewSet, basename="school")

schools_router = NestedDefaultRouter(router, r'schools', lookup='school')
schools_router.register(r'grades', GradeViewSet, basename='school-grades')
schools_router.register(r'classrooms', ClassroomViewSet, basename='school-classes')
schools_router.register(r'news', NewsViewSet, basename='school-news')

urlpatterns = [
    path('schools/<str:school_slug>/membership/',
         MembershipAPIView.as_view(),
         name='school-membership'),
] + router.urls + schools_router.urls
