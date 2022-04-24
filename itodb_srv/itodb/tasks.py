from celery import shared_task, Celery
from time import sleep
from celery_progress.backend import ProgressRecorder
import json
from collections import Counter
from .models import *
from django.db.models import Q
import time

print('in mon')

import socket


@shared_task()
def check():
    try:
        getFullStat()
    except:
        getFullStat()
    return print('celery response: ')

def getFullStat():
    objectsIds = Object.objects.all()
    for elem in objectsIds:
      stat = getObjStat(elem.id)



def getObjStat(pk):
    object = Object.objects.get(id=int(pk))
    stuffRows = Stuff.objects.filter(Q(object_fact=str(object.name)) | Q(object_target=str(object.name)))
    p_data = Status.objects.filter(connect=int(pk))

    i = 0
    check = 'circle_red'
    if (len(p_data)==0 and len(stuffRows)==0):
        check = 'circle_red'
    else:
        if (len(stuffRows)!=0 and len(p_data)==0):
            check='circle_yellow'
        else:
            check = 'circle_green'
            for elem in p_data:
              cur_count = getElemStat(curRows=stuffRows, objName=object.name,curType=elem.type, curModel=elem.model)
              if int(elem.count) != int(cur_count):
                # print('check 1!!!')
                check = 'circle_yellow'
    object.state = str(check)
    object.save(update_fields=['state'])

    return check

def getElemStat(curRows, objName, curType, curModel):
  pFactNum = 0
  for row in curRows:
      if str(row.type) == curType:
          if str(row.model) == curModel:
              if (row.object_fact == 'Склад Офис') or (row.object_fact == objName):
                  pFactNum += 1
  pFactNum = str(pFactNum)
  return pFactNum




