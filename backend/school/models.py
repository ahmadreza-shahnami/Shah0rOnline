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
        return super().clean()

    def __str__(self):
        role_name = self.role.name if self.role else "No Role"
        return f"{self.user} as {role_name} at {self.school}"
    
class News(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="news")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True, editable=False, db_index=True)
    body = models.TextField()
    cover = models.ImageField(upload_to="school/news/", null=True, blank=True)
    author = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="authored_news",
    )
    published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["published", "published_at"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.school})"
    
    def clean(self):
        # اطمینان از یکتا بودن slug فقط وقتی name تغییر کرده
        generated_slug = slugify(self.title, allow_unicode=True)
        if School.objects.exclude(pk=self.pk).filter(slug=generated_slug).exists():

            raise ValidationError("مدرسه‌ای با این نام یا اسلاگ از قبل وجود دارد.")

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title, allow_unicode=True) or "news"
            slug = base
            counter = 1
            # avoid slug collision within same school
            while News.objects.filter(school=self.school, slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug

        if self.published and not self.published_at:
            self.published_at = timezone.now()

        super().save(*args, **kwargs)