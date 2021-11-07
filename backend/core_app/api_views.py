from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .auth import check_authentication
from .matchers import get_matched_employees, get_matched_jobs
from .models import AppUser, AppUserToken, PostApplicant, ProgrammingLanguage, JobPost
from .serializers import AppUserSerializer, AppUserTokenSerializer, PostApplicantSerializer, ProgrammingLanguageSerializer, JobPostSerializer
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import check_password, make_password

# Custom API Views
class LoginAPI(APIView):
  # POST to the login auth API will be for login validation.
  def post(self, request, *args, **kwargs):
    email = request.data.get('email')
    password = request.data.get('password')
    if email and password:
      try:
        user = AppUser.objects.get(email__exact=email)
      except ObjectDoesNotExist:
        return Response({"message" : "Unable to log in with provided credentials."}, status=status.HTTP_400_BAD_REQUEST)
      if not check_password(password, user.password):
        return Response({"message" : "Unable to log in with provided credentials."}, status=status.HTTP_400_BAD_REQUEST)
    else:
      return Response('Missing "email" or "password" parameters.', status=status.HTTP_400_BAD_REQUEST)
    # Removes older login tokens (This means single device log in)
    try:
      AppUserToken.objects.get(user=user).delete()
    except (AttributeError, ObjectDoesNotExist):
      pass
    token = AppUserToken.objects.create(user=user)
    serializer = AppUserTokenSerializer(token)
    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

  # DELETE to the login branch of auth API will be for logout confirmation and token removal.
  def delete(self, request, *args, **kwargs):
    token = request.headers.get('Authorization')
    if token:
      try:
        token = token [6:]
        AppUserToken.objects.get(key=token).delete()
      except (AttributeError, ObjectDoesNotExist):
          pass
      return Response({"message" : "Logout Successful"}, status=status.HTTP_200_OK)
    else:
      return Response({"message" : "No Authorization Token found!"}, status=status.HTTP_400_BAD_REQUEST)
  
  # GET to the login auth API will return user data given a token.
  def get(self, request, *args, **kwargs):
    token = request.headers.get('Authorization')
    if token:
      try:
        token = token [6:]
        user = AppUserToken.objects.get(key=token).user
      except (ObjectDoesNotExist):
        return Response({"message" : "Invalid Authorization Token!"}, status=status.HTTP_400_BAD_REQUEST)
        pass
      serializer = AppUserSerializer(user)
      return Response(serializer.data, status=status.HTTP_200_OK)
    else:
      return Response({"message" : "No Authorization Token found!"}, status=status.HTTP_400_BAD_REQUEST)

class AuthAPI(APIView):
  # POST to the auth API will create a new user.
  def post(self, request, *args, **kwargs):
    email = request.data.get('email')
    if email:
      try:
        AppUser.objects.get(email__exact=email)
        email_unused = False
        return Response({"message" : "This email address already has an account."}, status=status.HTTP_409_CONFLICT)
      except ObjectDoesNotExist:
        email_unused = True
    if email_unused:
      serializer = AppUserSerializer(data=request.data)
      if serializer.is_valid():
        serializer.save()
        token = AppUserToken.objects.create(user=serializer.instance)
        serializer = AppUserTokenSerializer(token)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  # PUT to the auth API will update all the user data. (Except Password)
  def put(self, request, *args, **kwargs):
    token = request.headers.get('Authorization')
    if token:
      try:
        token = token [6:]
        user = AppUserToken.objects.get(key=token).user
      except (ObjectDoesNotExist):
        return Response({"message" : "Invalid Authorization Token!"}, status=status.HTTP_400_BAD_REQUEST)
        pass
      serializer = AppUserSerializer(user, data=request.data, partial=True)
      if serializer.is_valid():
        serializer.save()
        programming_languages = request.data.get('programming_languages')
        if programming_languages:
          user.programming_languages.set(programming_languages)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
      return Response({"message" : "No Authorization Token found!"}, status=status.HTTP_400_BAD_REQUEST)    

  # PATCH to the auth API will be for user password updates only. (Not ideal, but keep things organized)
  def patch(self, request, *args, **kwargs):
    token = request.headers.get('Authorization')
    if token:
      try:
        token = token [6:]
        user = AppUserToken.objects.get(key=token).user
      except (ObjectDoesNotExist):
        return Response({"message" : "Invalid Authorization Token!"}, status=status.HTTP_400_BAD_REQUEST)
        pass
      password = request.data.get('password')
      new_password = request.data.get('new_password')
      if password and new_password:
        if not check_password(password, user.password):
          return Response({"message" : "Unable to log in with provided credentials."}, status=status.HTTP_401_UNAUTHORIZED)
      else:
        return Response({"message" : 'Missing "password" or "new_password" parameters.'}, status=status.HTTP_400_BAD_REQUEST)
      user.password = make_password(new_password)
      user.save()
      serializer = AppUserSerializer(user)
      return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    else:
      return Response({"message" : "No Authorization Token found!"}, status=status.HTTP_400_BAD_REQUEST)    

class UserAPI(APIView):
  # Get request to this api returns users data that is public depending on parameters given. (No password ofc)
  def get(self, request, *args, **kwargs):
    user_id = self.request.GET.get('id', None)
    if user_id:
      try:
        user = AppUser.objects.get(id=user_id)
        user.profile_view += 1 
        user.save()
        serializer = AppUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
      except ObjectDoesNotExist:
        return Response({"message" : 'No Instances were found!'}, status=status.HTTP_200_OK)
    user_type = self.request.GET.get('type', None)
    if user_type:
      user = AppUser.objects.filter(user_type=user_type)
      serializer = AppUserSerializer(user, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    users = AppUser.objects.all()
    serializer = AppUserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class ProgrammingLanguageAPI(APIView):
  # Get request to this api returns all programming languages tags
  def get(self, request, *args, **kwargs):
    langs = ProgrammingLanguage.objects.all()
    serializer = ProgrammingLanguageSerializer(langs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class JobPostAPI(APIView):
  # Get request to this api returns job posts data that is public depending on parameters given. (No password ofc)
  def get(self, request, *args, **kwargs):
    post_id = self.request.GET.get('id', None)
    if post_id:
      try:
        post = JobPost.objects.get(id=post_id)
        post_being_edited = self.request.GET.get('is_editor', None)
        if not post_being_edited:
          post.page_view += 1 
          post.save()
        serializer = JobPostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
      except ObjectDoesNotExist:
        return Response({"message" : 'No Instances were found!'}, status=status.HTTP_200_OK)
    post_owner = self.request.GET.get('owner', None)
    if post_owner:
      try:
        posts = JobPost.objects.filter(owner=post_owner)
        serializer = JobPostSerializer(posts, many= True)
        return Response(serializer.data, status=status.HTTP_200_OK)
      except ObjectDoesNotExist:
        return Response({"message" : 'Instance was not found!'}, status=status.HTTP_200_OK)
    posts = JobPost.objects.all().order_by('-id')
    serializer = JobPostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # Post request to this api returns adds a new job post, requires authentication/logged in user.
  def post(self, request, *args, **kwargs):
    is_authenticated = check_authentication(request)
    if not is_authenticated: 
      return Response({"message" : "Invalid Authentication!"}, status=status.HTTP_400_BAD_REQUEST)
    serializer = JobPostSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      instance = JobPost.objects.get(id=serializer.data.get('id'))
      instance.programming_languages.set(request.data.get('programming_languages'))
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  # Patch request to this api edits a job post, requires authentication/logged in user.
  # TODO: I should review a way to confirm owner first!
  def patch(self, request, *args, **kwargs):
    is_authenticated = check_authentication(request)
    if not is_authenticated: 
      return Response({"message" : "Invalid Authentication!"}, status=status.HTTP_400_BAD_REQUEST)
    try:
      instance = JobPost.objects.get(id=request.data.get('id'))
    except ObjectDoesNotExist:
      return Response({"message" : 'Missing Post ID'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = JobPostSerializer(instance, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
      instance.programming_languages.set(request.data.get('programming_languages'))
      return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  # Delete request to this api deletes a job post, requires authentication/logged in user.
  # TODO: I should review a way to confirm owner first!
  def delete(self, request, *args, **kwargs):
    is_authenticated = check_authentication(request)
    if not is_authenticated: 
      return Response({"message" : "Invalid Authentication!"}, status=status.HTTP_400_BAD_REQUEST)
    try:
      instance = JobPost.objects.get(id=request.data.get('id'))
      instance.delete()
    except ObjectDoesNotExist:
      return Response('Missing Post ID', status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)

class ApplicantsAPI(APIView):
  # Get request to this api returns a jobpost's applicants depending on the given ID.
  def get(self, request, *args, **kwargs):
    post_id = self.request.GET.get('post_id', None)
    if post_id:
      try:
        applicants = PostApplicant.objects.filter(jobpost=post_id)
        serializer = PostApplicantSerializer(applicants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
      except ObjectDoesNotExist:
        return Response({"message" : 'No Instances were found!'}, status=status.HTTP_200_OK)
    applicant_id = self.request.GET.get('applicant_id', None)
    if applicant_id:
      try:
        applicants = PostApplicant.objects.filter(applicant=applicant_id)
        serializer = PostApplicantSerializer(applicants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
      except ObjectDoesNotExist:
        return Response({"message" : 'No Instances were found!'}, status=status.HTTP_200_OK)
    return Response({"message" : 'No post or applicant id was given!'}, status=status.HTTP_400_BAD_REQUEST)

  # Post request to this api returns adds a job applicant, requires authentication/logged in user.
  def post(self, request, *args, **kwargs):
    is_authenticated = check_authentication(request)
    if not is_authenticated: 
      return Response({"message" : "Invalid Authentication!"}, status=status.HTTP_400_BAD_REQUEST)
    post_id = request.data.get('id')
    applicant_id = request.data.get('applicant_id')
    if post_id and applicant_id:
      try:
        post = JobPost.objects.get(id=post_id)
        user = AppUser.objects.get(id=applicant_id)
        PostApplicant.objects.create(applicant=user, jobpost=post)
        serializer = JobPostSerializer(post)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
      except ObjectDoesNotExist:
        return Response({"message" : 'Instance was not found!'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message" : 'Missing Post or User ID'}, status=status.HTTP_400_BAD_REQUEST)

  # Post request to this api returns adds a job applicant, requires authentication/logged in user.
  def patch(self, request, *args, **kwargs):
    is_authenticated = check_authentication(request)
    if not is_authenticated: 
      return Response({"message" : "Invalid Authentication!"}, status=status.HTTP_400_BAD_REQUEST)
    postApplicant_id = request.data.get('id')
    if postApplicant_id:
      try:
        postApplicant = PostApplicant.objects.get(id=postApplicant_id)
        postApplicant.status = request.data.get('status')
        postApplicant.save()
        serializer = PostApplicantSerializer(postApplicant)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
      except ObjectDoesNotExist:
        return Response({"message" : 'Instance was not found!'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message" : 'Missing Post or User ID'}, status=status.HTTP_400_BAD_REQUEST)

  # Delete request to this api returns removes a job applicant, requires authentication/logged in user.
  def delete(self, request, *args, **kwargs):
    is_authenticated = check_authentication(request)
    if not is_authenticated: 
      return Response({"message" : "Invalid Authentication!"}, status=status.HTTP_400_BAD_REQUEST)
    post_id = request.data.get('id')
    applicant_id = request.data.get('applicant_id')
    if post_id and applicant_id:
      try:
        PostApplicant.objects.get(applicant=applicant_id, jobpost=post_id).delete()
        post = JobPost.objects.get(id=post_id)
        serializer = JobPostSerializer(post)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
      except ObjectDoesNotExist:
        return Response({"message" : 'Instance was not found!'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message" : 'Missing Post or User ID'}, status=status.HTTP_400_BAD_REQUEST)
    
class SearchAPI(APIView):
  # Get request to this api returns a jobpost's applicants depending on the given ID.
  def get(self, request, *args, **kwargs):
    post_id = self.request.GET.get('post_id', None)
    if post_id:
      users = get_matched_employees(post_id)
      serializer = AppUserSerializer(users, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    user_id = self.request.GET.get('user_id', None)
    if user_id:
      jobposts = get_matched_jobs(user_id)
      serializer = JobPostSerializer(jobposts, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"message" : 'Missing Post or User ID'}, status=status.HTTP_400_BAD_REQUEST)
