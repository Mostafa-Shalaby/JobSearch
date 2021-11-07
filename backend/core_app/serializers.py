from rest_framework import serializers
from django.contrib.auth.hashers import check_password, make_password
from django.core.exceptions import ObjectDoesNotExist
from .models import AppUser, AppUserToken, PostApplicant, ProgrammingLanguage, JobPost

class ProgrammingLanguageSerializer(serializers.ModelSerializer):
  class Meta:
    model = ProgrammingLanguage
    fields = '__all__'

class JobPostSerializer(serializers.ModelSerializer):
  programming_languages = ProgrammingLanguageSerializer(read_only=True, many= True)
  class Meta:
    model = JobPost
    fields = '__all__'

class AppUserNameSerializer(serializers.ModelSerializer):
  class Meta:
    model = AppUser
    fields = ('id', 'name')

class JobPostNameSerializer(serializers.ModelSerializer):
  class Meta:
    model = JobPost
    fields = ('id', 'title')

class PostApplicantSerializer(serializers.ModelSerializer):
  applicant = AppUserNameSerializer(read_only=True)
  jobpost = JobPostNameSerializer(read_only=True)
  class Meta:
    model = PostApplicant
    fields = '__all__'

class AppUserTokenSerializer(serializers.ModelSerializer):
  class Meta:
    model = AppUserToken
    fields = '__all__'

# User Authentication Serializer
class AppUserSerializer(serializers.ModelSerializer):
  programming_languages = ProgrammingLanguageSerializer(read_only=True, many= True)
  class Meta:
    model = AppUser
    fields = '__all__'
    extra_kwargs = {'password':{
        'write_only':True,
        'required':True
    }}

  def create(self, validated_data):
    user = AppUser.objects.create(
      name = validated_data['name'],
      email = validated_data['email'],
      password = make_password(validated_data['password']),
      user_type = validated_data.get('user_type', 0),
      national_id = validated_data.get('national_id', ""),
      city = validated_data.get('city', ""),
      experience_level = validated_data.get('experience_level', 0),
      bio_description = validated_data.get('bio_description', ""),
      profile_view = validated_data.get('profile_view', 0),
    )   
    return user

  def update(self, instance, validated_data):
    instance.name = validated_data.get('name', instance.name)
    instance.email = validated_data.get('email', instance.email)
    instance.user_type = validated_data.get('user_type', instance.user_type)
    instance.national_id = validated_data.get('national_id', instance.national_id)
    instance.city = validated_data.get('city', instance.city)
    instance.experience_level = validated_data.get('experience_level', instance.experience_level)
    instance.bio_description = validated_data.get('bio_description', instance.bio_description)
    instance.profile_view = validated_data.get('profile_view', instance.profile_view)
    instance.save()
    return instance

