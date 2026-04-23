from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
from django.contrib import admin


urlpatterns = [
    path('register/', RegisterViewset.as_view({'post': 'create'}), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]

