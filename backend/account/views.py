from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import CustomUser
from django.db.models import Q


class UserCreateView(APIView):
    permission_classes = [AllowAny]
    
    @extend_schema(
        summary="Register New User",
        description="register new user",
        request=UserSerializer,
        responses={201: UserSerializer}
    )
    def post(self, request: Request):
        register_serializer: UserSerializer = UserSerializer(data=request.data)
        if register_serializer.is_valid():
            user = register_serializer.save()
            tokens = user.get_tokens()
            info_serializer = UserSerializer(instance=user)
            return Response({"message": "user created successfully", "data": info_serializer.data, "tokens": tokens},
                            status.HTTP_201_CREATED)
        else:
            return Response(register_serializer.errors, status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Get User Data",
        description="retrive user data based on given id",
        responses={200: UserSerializer,
                   404: OpenApiResponse(description="user not found", response={"error": "user not found"})}
    )
    def get(self, request: Request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(instance=user)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Delete User",
        description="delete user based on given id",
        responses={200: OpenApiResponse(description="user deleted successfully", response={"message": "user deleted successfully"}),
                   404: OpenApiResponse(description="user not found", response={"error": "user not found"})}
    )
    def delete(self, request: Request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({"message": "user deleted successfully"}, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Update User Info",
        description="update user info based on given id",
        responses={200: OpenApiResponse(description="user updated", response={"message": "user updated"}),
                    404: OpenApiResponse(description="user not found", response={"error": "user not found"})}
    )
    def put(self, request: Request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        try:
            user = CustomUser.objects.get(id=user_id, is_active=True)
        except CustomUser.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            serializer = UserSerializer(instance=user)
            return Response({"message": "user updated successfully", "data": serializer.data},
                            status.HTTP_200_OK)
        else:
            return Response({"error": serializer.errors}, status.HTTP_400_BAD_REQUEST)


class UserUpdatePasswordView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Change User Password",
        responses={200: OpenApiResponse(description="password updated successfully", response={"message": "password updated successfully"}),
                   404: OpenApiResponse(description="user not found", response={"error": "user not found"})}
    )
    def post(self, request: Request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        try:
            user = CustomUser.objects.get(id=user_id, is_active=True)
        except CustomUser.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(instance=user, data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = user.get_tokens()
            return Response({"message": "password updated successfully", "tokens": tokens}, status.HTTP_200_OK)

        else:
            return Response({"error": serializer.errors}, status.HTTP_400_BAD_REQUEST)


class UserDeactiveView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Deactive User",
        responses={200: OpenApiResponse(description="user not found", response={"messgae": "user deactived"}),
                   404: OpenApiResponse(description="user not found", response={"error": "user not found"})}
    )
    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            user.deactive()
            return Response({"messgae": "user deactived"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserActiveView(APIView):

    permission_classes = [AllowAny]

    @extend_schema(
        summary="active User",
        responses={200: OpenApiResponse(description="user not found", response={"messgae": "user actived"}),
                   404: OpenApiResponse(description="user not found", response={"error": "user not found"})}
    )
    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            user.active()
            return Response({"messgae": "user actived"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Login User",
        description="login user",
        responses={200: OpenApiResponse(description="user logged in successfully", response={"message": "user logged in successfully"}),
                   404: OpenApiResponse(description="user not found", response={"error": "user not found"})}
    )
    def post(self, request: Request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.check_password(password):
            tokens = user.get_tokens()
            serializer = UserSerializer(instance=user)
            return Response({"message": "user logged in successfully", "data": serializer.data, "tokens": tokens},
                            status.HTTP_200_OK)
        else:
            return Response({"error": "invalid credentials"}, status.HTTP_400_BAD_REQUEST)