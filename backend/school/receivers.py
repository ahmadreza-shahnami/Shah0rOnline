from django.dispatch import receiver
from django.db.models import signals as modelSignals
from role.models import Role, Scope

@receiver(modelSignals.post_migrate)
def create_school_roles(**kwargs):
    # Scope 
    scope, created = Scope.objects.get_or_create(name="school") 

    # Principal
    Role.objects.get_or_create(name="principal",
                                defaults={
                                    "description":"School Principal",
                                    "scope":scope,
                                    "level":10
                                    })
    
    # Teacher
    Role.objects.get_or_create(name="teacher",
                               defaults={
                                "description":"School Teacher",
                                "scope":scope,
                                "level":5
                                })
    
    # Parent
    Role.objects.get_or_create(name="parent",
                               defaults={
                                "description":"Student Parent",
                                "scope":scope,
                                "level":2
                                })
    
    # Student
    Role.objects.get_or_create(name="student",
                               defaults={
                                "description":"Student",
                                "scope":scope,
                                "level":1
                                })