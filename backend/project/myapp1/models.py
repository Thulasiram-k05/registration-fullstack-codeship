from django.db import models


class Registration(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    gmail = models.EmailField(max_length=254)
    date = models.DateField()
    company_name = models.CharField(max_length=150)

    def __str__(self):
        return self.name