from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from django.utils import timezone
from location.models import City
from role.models import Role

CustomUser = get_user_model()


class School(models.Model):
    TYPE_CHOICES = [
        ("elementary", "دبستان"),
        ("middle_school", "راهنمایی"),
        ("high_school", "دبیرستان"),
    ]

    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True, blank=True, editable=False, allow_unicode=True)
    city = models.ForeignKey(
        City, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name="schools"
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "School"
        verbose_name_plural = "Schools"
        ordering = ["name"]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["city"]),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        # اطمینان از یکتا بودن slug فقط وقتی name تغییر کرده
        generated_slug = slugify(self.name, allow_unicode=True)
        if School.objects.exclude(pk=self.pk).filter(slug=generated_slug).exists():

            raise ValidationError("مدرسه‌ای با این نام یا اسلاگ از قبل وجود دارد.")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)



class Membership(models.Model):
    user = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE,
        related_name="memberships"
    )
    school = models.ForeignKey(
        School, 
        on_delete=models.CASCADE,
        related_name="memberships"
    )
    role = models.ForeignKey(
        Role, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name="school_memberships"
    )
    is_approved = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    classroom = models.ForeignKey(
        'Classroom',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="students"
        )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "school"], 
                name="unique_user_school_membership"
            )
        ]
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["school"]),
        ]
        ordering = ["-date_joined"]

    def clean(self):
        if self.role and self.role.scope.name != "school":
            raise ValidationError(
                f"Role '{self.role.name}' must have a 'school' scope for school memberships."
            )
        if self.role and self.role.name != "student" and self.classroom != None:
            raise ValidationError (
                f"Role '{self.role.name}' can't be assigned to a classroom."
            )
        return super().clean()

    def __str__(self):
        role_name = self.role.name if self.role else "No Role"
        return f"{self.user} as {role_name} at {self.school}"
    


class Grade(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="grades")
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.school.name} - {self.name}"


class Classroom(models.Model):
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name="classes")
    name = models.CharField(max_length=50)
    teacher = models.ForeignKey(Membership, on_delete=models.SET_NULL, null=True, blank=True, related_name="teaching_classes")

    def clean(self):
        if self.teacher and self.teacher.school != self.grade.school:
            raise ValidationError("Teacher must belong to the same school.")
        if self.teacher and self.teacher.role.name != "teacher":
            raise ValidationError("Assigned membership must have role 'teacher'.")
        
    def __str__(self):
        return f"{self.grade.name} - {self.name}"


class WeeklySchedule(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name="weekly_schedules")
    day_of_week = models.PositiveSmallIntegerField()  # 0=شنبه, 6=جمعه
    subject = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        ordering = ["day_of_week", "start_time"]
    
    def __str__(self):
        return f"{self.day_of_week}-from-{self.start_time}-to-{self.end_time}-{self.subject}-{self.classroom.name}"


class ClassMedia(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name="media")
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to="class_media/")
    uploaded_at = models.DateTimeField(auto_now_add=True)