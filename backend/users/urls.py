from django.urls import path
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    UserProfileView,
    UserListView,
    update_user_role,
    request_farmer_account,
    approve_farmer_account,
    reject_farmer_account,
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:user_id>/role/', update_user_role, name='update_user_role'),
    path('users/<int:user_id>/approve-farmer/', approve_farmer_account, name='approve_farmer_account'),
    path('users/<int:user_id>/reject-farmer/', reject_farmer_account, name='reject_farmer_account'),
    path('request-farmer/', request_farmer_account, name='request_farmer_account'),
]
