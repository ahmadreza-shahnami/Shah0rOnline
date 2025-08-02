from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import AllowAny
from . import serializers
from . import models
from django.db.models import Q
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from . import paginations


# ------------------------------Store-------------------------------

def get_store(store_id, is_active=True):
    store = get_object_or_404(models.Store, id=store_id, is_active=is_active)
    return store

class StoreView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request, *args, **kwargs):
        serializer = serializers.StoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Store created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request: Request, *args, **kwargs):
        store_id = kwargs.get('store_id')
        if store_id:
            store = get_store(store_id)
            serializer = serializers.StoreSerializer(store)
            return Response({"message":"store got successfully", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "store_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST)    
        

    def put(self, request: Request, *args, **kwargs):
        store_id = kwargs.get('store_id')
        if store_id:
            store = get_store(store_id)
            serializer = serializers.StoreSerializer(store, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Store updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "store_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST) 
        

    def delete(self, request: Request, *args, **kwargs):
        store_id = kwargs.get('store_id')
        if store_id:
            store = get_store(store_id)
            store.delete()
            return Response({"message": "Store deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "store_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST)
        
class StoreDeactivateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, *args, **kwargs):
        store_id = kwargs.get('store_id')
        if store_id:
            store = get_store(store_id)
            store.deactive()
            return Response({"message": "Store deactivated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "store_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST)
        
class StoreActivateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, *args, **kwargs):
        store_id = kwargs.get('store_id')
        if store_id:
            store = get_store(store_id)
            store.active()
            return Response({"message": "Store activated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "store_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST)        

class SearchStoreView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = serializers.StoreSerializer
    pagination_class = paginations.StorePagination

    def get_queryset(self):
        # city = self.request.query_params.get('city')
        name = self.request.query_params.get('name')
        store = self.request.query_params.get('store')
        queryset = models.Store.objects.filter(is_active=True)
        # if city:
        #     queryset = queryset.filter(city__icontains=city)
        if name:
            queryset = queryset.filter(name__icontains=name)
        if store:
            queryset = queryset.filter(store_id__icontains=store)
        return queryset
    
# ------------------------------Product-------------------------------

def get_product(product_id):
    try:
        product = models.Product.objects.prefetch_related('images').get(id=product_id)
        return product
    except models.Product.DoesNotExist:
        return None

class ProductView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request, *args, **kwargs):
        serializer = serializers.ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Product created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request: Request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        if product_id:
            product = get_product(product_id)
            serializer = serializers.ProductSerializer(product)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "product_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST)    
        

    def put(self, request: Request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        if product_id:
            product = get_product(product_id)
            serializer = serializers.ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Product updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "product_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST) 
        

    def delete(self, request: Request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        if product_id:
            product = get_product(product_id)
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "product_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST)

# ------------------------------Service-------------------------------    

def get_service(service_id):
    try:
        service = models.Service.objects.prefetch_related('images').get(id=service_id)
        return service
    except models.Product.DoesNotExist:
        return None

class ServiceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request, *args, **kwargs):
        serializer = serializers.ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Service created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request: Request, *args, **kwargs):
        service_id = kwargs.get('service_id')
        if service_id:
            service = get_service(service_id)
            serializer = serializers.ServiceSerializer(service)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "service_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST)    
        

    def put(self, request: Request, *args, **kwargs):
        service_id = kwargs.get('service_id')
        if service_id:
            service = get_service(service_id)
            serializer = serializers.ServiceSerializer(service, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "service updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "service_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST) 
        

    def delete(self, request: Request, *args, **kwargs):
        service_id = kwargs.get('service_id')
        if service_id:
            service = get_service(service_id)
            service.delete()
            return Response({"message": "service deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "service_id must be set in the url"}, status=status.HTTP_400_BAD_REQUEST)

# ------------------------------Category------------------------------- 

