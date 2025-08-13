from django.contrib import admin
from .models import School, Membership, Classroom, Grade, ClassMedia, WeeklySchedule


admin.site.register(School)
admin.site.register(Membership)
admin.site.register(Grade)
admin.site.register(Classroom)
admin.site.register(WeeklySchedule)
admin.site.register(ClassMedia)
