from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Membership

class HasSchoolPermission(BasePermission):
    def has_permission(self, request, view):
        # safe methods are allowed for any user
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        if not user or not user.is_authenticated:
            return False

        school_slug = view.kwargs.get('school_slug')
        if not school_slug:
            return False
        
        try:
            membership = Membership.objects.get(user=request.user, school__slug=school_slug, is_approved=True)
        except Membership.DoesNotExist:
            return False

        role = membership.role
        if not role:
            return False
        try:
            if role.permissions.filter(code=view.permission_code).exists():
                return True
        except Exception:
            pass 
        
        # Fallback: level threshold (tweak threshold as you like)
        try:
            if role.level and role.level >= view.permission_level:
                return True
        except Exception:
            pass
        

        return False

    

class IsSchoolNewsEditor(BasePermission):
    """
    Allow safe methods to everyone.
    For unsafe methods allow only users who:
      - are authenticated
      - have an approved membership for the school
      - AND (membership.role.permissions contains 'can_manage_news' OR membership.role.level >= 5)
    """

    def has_permission(self, request, view):
        # safe methods are allowed for any user
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        if not user or not user.is_authenticated:
            return False

        school_slug = view.kwargs.get("school_slug")
        if not school_slug:
            return False

        # Try to find membership
        try:
            membership = Membership.objects.get(user=user, school__slug=school_slug, is_approved=True)
        except Membership.DoesNotExist:
            return False

        role = membership.role
        if not role:
            return False

        # Preferred check: permission assigned to role
        if role.permissions.filter(code="can_manage_news").exists():
            return True

        # Fallback: level threshold (tweak threshold as you like)
        try:
            if role.level and role.level >= 5:
                return True
        except Exception:
            pass

        return False
    
