from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
from django.contrib import admin

app_name = 'users'

router = DefaultRouter()
router.register('register', RegisterView, basename='register')
router.register('login', LoginViewset, basename='login')

urlpatterns = router.urls
