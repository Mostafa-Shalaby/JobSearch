from .models import AppUserToken
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist

def check_authentication(request):
  token = request.headers.get('Authorization')
  if token:
    try:
      token = token [6:]
      AppUserToken.objects.get(key=token)
    except (ObjectDoesNotExist):
      return False
  else:
    return False
  return True