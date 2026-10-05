from rest_framework import serializers
from .models import Registration


class RegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Registration

        fields = [
            'id',
            'name',
            'phone_number',
            'gmail',
            'date',
            'company_name'
        ]
