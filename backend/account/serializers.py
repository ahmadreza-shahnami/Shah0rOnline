from rest_framework.serializers import ModelSerializer, ValidationError, CharField
from .models import CustomUser, Role, Scope


class UserSerializer(ModelSerializer):
    confirm_password = CharField(write_only=True)
    class Meta:
        model = CustomUser
        exclude = ['date_updated', 'is_active', 'user_permissions', 'groups']
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password or confirm_password:
            if password != confirm_password:
                raise ValidationError(
                    {'error': 'password has no match with its confirmation'})

        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        if not validated_data["role"]: 
            scope = Scope.objects.get_or_create(name="global")
            validated_data["role"] = Role.objects.get_or_create(name='base',defaults={
                scope:scope,
                })
        return CustomUser.objects.create_user(**validated_data)