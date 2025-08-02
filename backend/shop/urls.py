from django.urls import path
from . import views

urlpatterns = [
    path('', views.StoreView.as_view(), name='store'),
    path('<int:store_id>/', views.StoreView.as_view(), name='store_detail'),
    path('<int:store_id>/deactive/', views.StoreDeactivateView.as_view(), name='store-deactivate'),
    path('<int:store_id>/active/', views.StoreActivateView.as_view(), name='store-activate'),
    path('all/', views.SearchStoreView.as_view(), name='store-search'),
    # --------------------------------------------------------------------
    path('product/', views.ProductView.as_view(), name='product'),
    path('product/<int:product_id>/', views.ProductView.as_view(), name='product_detail'),
    # --------------------------------------------------------------------
    path('service/', views.ServiceView.as_view(), name='service'),
    path('service/<int:service_id>/', views.ServiceView.as_view(), name='service_detail'),
]
