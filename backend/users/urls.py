from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterViewset, LoginViewset  # <-- deben existir con EXACTO nombre

router = DefaultRouter()
router.register("register", RegisterViewset, basename="register")
router.register("login", LoginViewset, basename="login")

urlpatterns = router.urls