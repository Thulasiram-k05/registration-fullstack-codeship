from django.urls import path
from . import views

urlpatterns = [
    path(
        'registration/',
        views.registration_list,
        name='registration'
    ),
]