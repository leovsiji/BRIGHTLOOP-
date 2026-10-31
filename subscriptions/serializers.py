from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Subscription
        fields = ["id", "product", "product_name", "status", "start_date", "end_date", "created_at"]
        read_only_fields = ["id", "status", "start_date", "end_date", "created_at"]