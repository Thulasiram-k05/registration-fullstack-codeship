from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Registration
from .serializers import RegistrationSerializer


@api_view(['GET', 'POST'])
def registration_list(request):

    if request.method == 'GET':

        registrations = Registration.objects.all()

        serializer = RegistrationSerializer(
            registrations,
            many=True
        )

        return Response(serializer.data)

    if request.method == 'POST':

        serializer = RegistrationSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    'message': 'Registration saved successfully',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )