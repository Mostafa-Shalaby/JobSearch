from django.urls import path
from .api_views import *

urlpatterns = [
  path('auth/login/', LoginAPI.as_view()),  
  path('auth/register/', AuthAPI.as_view()),
  path('users/', UserAPI.as_view()),  
  path('languages/', ProgrammingLanguageAPI.as_view()),  
  path('jobposts/', JobPostAPI.as_view()),  
  path('applicants/', ApplicantsAPI.as_view()),  
  path('search/', SearchAPI.as_view()),  
]