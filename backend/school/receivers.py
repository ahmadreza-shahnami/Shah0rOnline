from django.dispatch import receiver
from django.db.models import signals as modelSignals
from role.models import Role

@receiver(modelSignals.post_migrate)
def create_school_roles(**kwargs):
    # Principal
    Role.objects.get_or_create(name="principal",
                                defaults={
                                    "description":"School Principal",
                                    "app":"school",
                                    "level":10
                                    })
    
    # Teacher
    Role.objects.get_or_create(name="teacher",
                               defaults={
                                "description":"School Teacher",
                                "app":"school",
                                "level":5
                                })
    
    # Parent
    Role.objects.get_or_create(name="parent",
                               defaults={
                                "description":"Student Parent",
                                "app":"school",
                                "level":2
                                })
    
    # Student
    Role.objects.get_or_create(name="student",
                               defaults={
                                "description":"Student",
                                "app":"school",
                                "level":1
                                })