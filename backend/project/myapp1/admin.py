from django.contrib import admin
from .models import Registration


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'phone_number',
        'gmail',
        'date',
        'company_name',
    )