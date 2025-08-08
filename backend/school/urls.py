from django.urls import path
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import SchoolViewSet, MembershipAPIView

router = DefaultRouter()
router.register(r"schools", SchoolViewSet, basename="school")

# schools_router = NestedDefaultRouter(router, r'schools', lookup='school')
# schools_router.register(r'memberships', MembershipViewSet.as_view(), basename='school-membership')

urlpatterns = [
    path('schools/<str:school_slug>/membership/',
         MembershipAPIView.as_view(),
         name='school-membership'),
] + router.urls 
