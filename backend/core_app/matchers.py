from .models import JobPost, AppUser 
import time

class ScoredData:
  def __init__(self, data):
    self.data = data
    self.score = 0

def get_similarity_score(target_doc, tested_doc):
  import spacy
  nlp = spacy.load('en_use_md')
  tested_doc=nlp(tested_doc)
  target_doc=nlp(target_doc)
  similarity_score = tested_doc.similarity(target_doc)
  if (similarity_score < 0):
    similarity_score = 0
  return similarity_score

def get_matched_employees(jobpost_id, cut_off_score=1.5):
  jobpost = JobPost.objects.get(id=jobpost_id)
  jobpost_langs = jobpost.programming_languages.all()
  users = AppUser.objects.filter(user_type=0)
  scored_data_arr = []
  for user in users:
    tested_obj = ScoredData(user)
    scored_data_arr.append(tested_obj)
    # Experience Level Scoring
    if user.experience_level == jobpost.experience_level:
      tested_obj.score += 1 
    # Geographical City Scoring
    if user.city == jobpost.city:
      tested_obj.score += 1 
    # Program Languages Scoring
    user_langs = user.programming_languages.all()
    for target in jobpost_langs:
      for tested in user_langs:
        if tested == target:
          tested_obj.score += (1/len(jobpost_langs))
          break
    # Description matching using natural language processing
    target_doc = jobpost.post_description
    tested_doc = user.bio_description
    #tested_obj.score += get_similarity_score(target_doc,tested_doc)
  scored_data_arr.sort(key=lambda x: x.score, reverse=True)
  users_arr = []
  for instance in scored_data_arr:
    if instance.score < cut_off_score:
      break
    #print(instance.score)
    users_arr.append(instance.data)
  return users_arr

def get_matched_jobs(user_id, cut_off_score=1.5):
  user = AppUser.objects.get(id=user_id)
  user_langs = user.programming_languages.all()
  jobposts = JobPost.objects.all()
  scored_data_arr = []
  for jobpost in jobposts:
    tested_obj = ScoredData(jobpost)
    scored_data_arr.append(tested_obj)
    # Experience Level Scoring
    if user.experience_level == jobpost.experience_level:
      tested_obj.score += 1 
    # Geographical City Scoring
    if user.city == jobpost.city:
      tested_obj.score += 1 
    # Program Languages Scoring
    jobpost_langs = jobpost.programming_languages.all()
    for target in jobpost_langs:
      for tested in user_langs:
        if tested == target:
          tested_obj.score += (1/len(jobpost_langs))
          break
    # Description matching using natural language processing
    #target_doc = jobpost.post_description
    #tested_doc = user.bio_description
    #tested_obj.score += get_similarity_score(target_doc,tested_doc)
  scored_data_arr.sort(key=lambda x: x.score, reverse=True)
  posts_arr = []
  for instance in scored_data_arr:
    if instance.score < cut_off_score:
      break
    #print(instance.score)
    posts_arr.append(instance.data)
  return posts_arr