from django.contrib import admin
from .models import AppUser, AppUserToken, ProgrammingLanguage, JobPost, PostApplicant

@admin.register(AppUser)
class AppUserModel(admin.ModelAdmin):
  list_display = ('name', 'email', 'user_type', 'city', 'experience_level')
  list_filter = ('user_type','experience_level')

@admin.register(AppUserToken)
class AppUserTokenModel(admin.ModelAdmin):
  list_display = ('key', 'user', 'created')

@admin.register(ProgrammingLanguage)
class ProgrammingLanguageModel(admin.ModelAdmin):
  list_display = ('language_name','id')

@admin.register(JobPost)
class JobPostModel(admin.ModelAdmin):
    list_display = ('title', 'city', 'experience_level', 'owner')
    list_filter = ('city','experience_level')

@admin.register(PostApplicant)
class PostApplicantModel(admin.ModelAdmin):
    list_display = ('applicant', 'jobpost', 'status')
    list_filter = ('status',)
