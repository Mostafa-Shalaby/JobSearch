import os
import binascii
from django.db import models

# Enums / IntegerChoices
class UserType(models.IntegerChoices):
  Employee = 0
  Employer = 1

class ExperienceLevel(models.IntegerChoices):
  Junior = 0
  Mid = 1
  Senior = 2 

class ApplicationStatus(models.IntegerChoices):
  Pending = 0
  Accepted = 1
  Rejected = 2 

# Database Models
class ProgrammingLanguage(models.Model):
  language_name = models.CharField(max_length=200)
  # Override to string function
  def __str__(self):
    return self.language_name

class AppUser(models.Model):
  name = models.CharField(max_length=200)
  password = models.CharField(max_length=128)
  email = models.EmailField()
  user_type = models.IntegerField(choices=UserType.choices, default=UserType.Employee)
  national_id = models.CharField(max_length=14, blank=True)
  city = models.CharField(max_length=200, blank=True)
  experience_level = models.IntegerField(choices=ExperienceLevel.choices, default=ExperienceLevel.Junior)
  programming_languages = models.ManyToManyField(ProgrammingLanguage)
  bio_description = models.TextField(blank=True)
  profile_view = models.IntegerField(default=0)
  # Override to string function
  def __str__(self):
    return self.name

class AppUserToken(models.Model):
  key = models.CharField("Key", max_length=40, primary_key=True)
  user = models.OneToOneField(AppUser, related_name='user', on_delete=models.CASCADE)
  created = models.DateTimeField("Created", auto_now_add=True)
  class Meta:
    verbose_name = "Token"
    verbose_name_plural = "Tokens"
  def save(self, *args, **kwargs):
    if not self.key:
      self.key = self.generate_key()
    return super(AppUserToken, self).save(*args, **kwargs)
  def generate_key(self):
    return binascii.hexlify(os.urandom(20)).decode()
  def __str__(self):
    return self.key

class JobPost(models.Model):
  title = models.CharField(max_length=200)
  city = models.CharField(max_length=200, blank=True)
  experience_level = models.IntegerField(choices=ExperienceLevel.choices, default=ExperienceLevel.Junior)
  programming_languages = models.ManyToManyField(ProgrammingLanguage)
  post_description = models.TextField(blank=True)
  page_view = models.IntegerField(default=0)
  owner = models.ForeignKey(related_name="owner", to=AppUser, on_delete=models.CASCADE)
  jobapplicants = models.ManyToManyField(AppUser, through='PostApplicant')
  # Override to string function
  def __str__(self):
    return self.title

class PostApplicant(models.Model):
  applicant = models.ForeignKey(AppUser, on_delete=models.CASCADE)
  jobpost = models.ForeignKey(JobPost, on_delete=models.CASCADE)
  status =  models.IntegerField(choices=ApplicationStatus.choices, default=ApplicationStatus.Pending)
    
