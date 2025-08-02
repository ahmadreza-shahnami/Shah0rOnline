from django.urls import path 
from . import views

urlpatterns = [
    path('register/', views.UserCreateView.as_view(), name='register'),
    path('<int:id>/', views.UserView.as_view(), name='user'),
    path('<int:id>/deactive/', views.UserDeactiveView.as_view(), name='user_deactive'),
    path('<int:id>/active/', views.UserActiveView.as_view(), name='user_active'),
    path('<int:id>/password/', views.UserUpdatePasswordView.as_view(), name='update_password'),
    path('login/', views.UserLoginView.as_view(), name='login'),
]
