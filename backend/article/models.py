from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from django.utils import timezone

CustomUser = get_user_model()

class Category(models.Model):
    """
    Hierarchical category for news items.
    Example: "School News" -> "Sports"
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, blank=True)
    parent = models.ForeignKey(
        "self", null=True, blank=True, related_name="children", on_delete=models.CASCADE
    )

    # Generic link to owner (School, Shop, or None for global)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    related_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ("slug", "content_type", "object_id", "parent")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_full_path(self):
        """Return full category path like 'Sports / Football / Local League'."""
        parts = [self.name]
        parent = self.parent
        while parent:
            parts.insert(0, parent.name)
            parent = parent.parent
        return " / ".join(parts)


class NewsArticle(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True, editable=False, db_index=True)
    body = models.TextField()
    summary = models.CharField(max_length=500, blank=True)  # Optional teaser/summary
    cover = models.ImageField(upload_to="news/", null=True, blank=True)

    # Generic relation (for contextual news)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    object_id = models.PositiveIntegerField(blank=True, null=True)
    related_object = GenericForeignKey("content_type", "object_id")

    # Author & category
    author = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="authored_news",
    )
    categories = models.ManyToManyField(Category, blank=True, related_name="news_items")

    # Publication status
    published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    # Meta
    view_count = models.PositiveIntegerField(default=0)
    pinned = models.BooleanField(default=False, help_text="Pin to top of list")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-pinned", "-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["published", "published_at"]),
            models.Index(fields=["pinned"]),
        ]

    def __str__(self):
        if self.related_object:
            return f"{self.title} ({self.related_object})"
        return f"{self.title} (General)"

    def clean(self):
        generated_slug = slugify(self.title, allow_unicode=True) or "news"

        # Filter news in same context
        if self.content_type and self.object_id:
            qs = NewsArticle.objects.filter(
                content_type=self.content_type,
                object_id=self.object_id
            )
        else:
            qs = NewsArticle.objects.filter(content_type__isnull=True, object_id__isnull=True)

        if qs.exclude(pk=self.pk).filter(slug=generated_slug).exists():
            raise ValidationError({"title": "A news item with this title already exists in this context."})

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title, allow_unicode=True) or "news"
            slug_candidate = base
            counter = 1

            if self.content_type and self.object_id:
                qs = NewsArticle.objects.filter(
                    content_type=self.content_type,
                    object_id=self.object_id
                )
            else:
                qs = NewsArticle.objects.filter(content_type__isnull=True, object_id__isnull=True)

            while qs.exclude(pk=self.pk).filter(slug=slug_candidate).exists():
                slug_candidate = f"{base}-{counter}"
                counter += 1

            self.slug = slug_candidate

        if self.published and not self.published_at:
            self.published_at = timezone.now()

        super().save(*args, **kwargs)
