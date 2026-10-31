from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and u.role == "admin"


class IsAdminOrStaff(BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and u.role in ("admin", "staff")


class IsOwnerOrInternal(BasePermission):
    """Customers can only touch objects that belong to them.
    Expects the object to have a `customer` field (a User)."""

    def has_object_permission(self, request, view, obj):
        if request.user.role in ("admin", "staff"):
            return True
        return obj.customer_id == request.user.id