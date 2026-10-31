from rest_framework import serializers
from .models import Invoice


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ["id", "subscription", "amount", "status", "issued_at", "paid_at"]
        read_only_fields = fields