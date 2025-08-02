from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from role.models import Role, Scope
from location.models import City
import string
import random

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        scope, created = Scope.objects.get_or_create(name="global")
        role, created = Role.objects.get_or_create(name="superuser",
                                                   defaults={
                                                    "description":"Is Global App Admin.",
                                                    "scope":scope,
                                                    "level":10
                                                    })
        extra_fields.setdefault('role', role)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)



class CustomUser(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    first_name = models.CharField(max_length=150, verbose_name="First Name")
    last_name = models.CharField(max_length=150, verbose_name="Last Name")
    father = models.ForeignKey('self', null=True, blank=True, related_name='children_from_father', on_delete=models.SET_NULL, verbose_name="Father")
    mother = models.ForeignKey('self', null=True, blank=True, related_name='children_from_mother', on_delete=models.SET_NULL, verbose_name="Mother")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name="Gender")
    national_code = models.CharField(max_length=20, unique=True, verbose_name="Notional Code")
    phone = models.CharField(max_length=15, unique=True, verbose_name="Phone")
    email = models.EmailField(unique=True, null=True, blank=True, verbose_name="Email")
    username = models.CharField(max_length=150, unique=True, verbose_name="username")
    referral_code = models.CharField(max_length=20, unique=True, null=True, blank=True, verbose_name="Refferal Code")
    referrer_code = models.CharField(max_length=20, null=True, blank=True, verbose_name="Invited By Code")
    date_joined = models.DateTimeField(verbose_name="Date Joined", auto_now_add=True)
    date_updated = models.DateTimeField(verbose_name="Date Updated", auto_now=True)
    date_of_birth = models.DateField(verbose_name="Date of Birth", null=True, blank=True)
    address = models.TextField(blank=True, verbose_name="Address")
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Role")
    bank_card = models.CharField(max_length=16, blank=True, verbose_name="Bank Card")
    city = models.ForeignKey(City, on_delete=models.SET_NULL, verbose_name="City", null=True, blank=True)
    is_active = models.BooleanField(verbose_name="is active" , default=True)
    is_staff = models.BooleanField(verbose_name="is staff" , default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone', 'national_code', 'email', 'gender']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.national_code}"

    def generate_referral_code(self, length=8, prefix='pam'):
        chars = string.ascii_letters + string.digits
        if not self.referral_code:
            while True:
                random_part = ''.join(random.choices(chars, k=length))
                code = f"{prefix}-{random_part}"
                if not CustomUser.objects.filter(referral_code=code).exists():
                    self.referral_code = code
                    break  
    
    def get_tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }   

    def save(self, *args, **kwargs):
        self.date_updated = timezone.now()
        self.generate_referral_code()
        super().save(*args, **kwargs)

    def deactivate(self):
        self.is_active = False
        self.save() 

    def activate(self):
        self.is_active = True
        self.save()     