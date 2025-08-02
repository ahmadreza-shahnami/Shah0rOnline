from rest_framework.permissions import BasePermission
from .models import Membership

class HasSchoolPermission(BasePermission):
    def has_permission(self, request, view):
        school_id = view.kwargs.get('school_id')
        try:
            membership = Membership.objects.get(user=request.user, school_id=school_id, is_approved=True)
            return membership.role.permissions.filter(code=view.permission_code).exists()
        except Membership.DoesNotExist:
            return False
