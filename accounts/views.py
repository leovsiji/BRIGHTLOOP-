from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .permissions import IsAdmin
from .serializers import (
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    StaffCreateSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class StaffCreateView(generics.CreateAPIView):
    """Only the admin can add a new staff member."""
    serializer_class = StaffCreateSerializer
    permission_classes = [IsAdmin]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = PasswordResetRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        user = User.objects.filter(email__iexact=s.validated_data["email"]).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
            send_mail(
                "Reset your Brightloop password",
                f"Click the link to reset your password:\n{link}",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
            )
        # Same response either way, so emails can't be probed
        return Response({"detail": "If that email is registered, a reset link has been sent."})


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = PasswordResetConfirmSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        try:
            user = User.objects.get(pk=force_str(urlsafe_base64_decode(s.validated_data["uid"])))
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"detail": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, s.validated_data["token"]):
            return Response({"detail": "Invalid or expired link."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(s.validated_data["new_password"], user)
        except DjangoValidationError as e:
            return Response({"new_password": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(s.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password updated."})