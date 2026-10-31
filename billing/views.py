from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Invoice
from .serializers import InvoiceSerializer


class InvoiceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Invoice.objects.select_related("subscription")
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        invoice = self.get_object()
        if invoice.status == Invoice.Status.PAID:
            return Response(
                {"detail": "Invoice already paid."}, status=status.HTTP_400_BAD_REQUEST
            )
        # Placeholder: call your payment gateway (Stripe/Razorpay) here
        invoice.status = Invoice.Status.PAID
        invoice.paid_at = timezone.now()
        invoice.save()
        return Response(self.get_serializer(invoice).data)