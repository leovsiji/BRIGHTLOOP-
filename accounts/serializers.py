from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import CustomerProfile, User


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ["company_name", "phone", "address"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "role", "profile"]
        read_only_fields = ["id", "email", "role"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name", "company_name"]

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        company = validated_data.pop("company_name", "")
        user = User.objects.create_user(role=User.Role.CUSTOMER, **validated_data)
        CustomerProfile.objects.create(user=user, company_name=company)
        return user


class StaffCreateSerializer(RegisterSerializer):
    class Meta(RegisterSerializer.Meta):
        fields = ["email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        return User.objects.create_user(role=User.Role.STAFF, **validated_data)


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)