from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
from django.contrib import admin

router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')
router.register('login', LoginViewset, basename='login')

urlpatterns = router.urls
