from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Subscription
from .serializers import SubscriptionSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]  # no PUT/PATCH/DELETE

    def get_queryset(self):
        qs = Subscription.objects.select_related("product")
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        subscription = self.get_object()
        if subscription.status != Subscription.Status.ACTIVE:
            return Response(
                {"detail": "Only active subscriptions can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        subscription.status = Subscription.Status.CANCELLED
        subscription.end_date = timezone.now().date()
        subscription.save()
        return Response(self.get_serializer(subscription).data)