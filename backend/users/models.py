from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email es obligatorio")

        email = self.normalize_email(email)
        cif_nif = models.CharField(max_length=20, unique=True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("cif_nif"):
            extra_fields["cif_nif"] = "admin1234"

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    username = models.CharField(max_length=200, null=True, blank=True)

    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellidos = models.CharField(max_length=150, blank=True, null=True)
    sexo = models.CharField(max_length=10, blank=True, null=True)

    fecha_nacimiento = models.DateField(null=True, blank=True)

    telefono = models.CharField(max_length=20, blank=True, null=True)

    direccion = models.CharField(max_length=200, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    piso = models.CharField(max_length=10, blank=True, null=True)
    letra = models.CharField(max_length=5, blank=True, null=True)

    municipio = models.CharField(max_length=100, blank=True, null=True)
    provincia = models.CharField(max_length=100, blank=True, null=True)
    cp = models.CharField(max_length=10, blank=True, null=True)

    latitud = models.DecimalField(
        max_digits=12, decimal_places=9, blank=True, null=True
    )
    longitud = models.DecimalField(
        max_digits=12, decimal_places=9, blank=True, null=True
    )

    voluntariado = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "auth_user"
