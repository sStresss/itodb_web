from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from itertools import chain
from django.forms.models import model_to_dict
import json
import django
from django.http import JsonResponse
# from .scripts.states import getObjStat
from .models import Student, Object, SubObject, Stuff, Type, Model, Manufacturer, Warehouse, Seller, SubType, SubModel, Status, History
from django.contrib.auth.models import User
from django.db.models import CharField, Value
from .serializers import *
import time
from . import tasks
from django.db.models import Q
from .tasks import check
import os

import pymysql

@api_view(['GET', 'POST'])
def object_list(request):
    # database_migrate()
    # databaseHistoryMigrate()
    if request.method == 'GET':
        # print('GET OBJ LIST!!!!!!!')
        data = Object.objects.all().order_by('code')
        # test = check()
        serializer = objectSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = objectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            curObject = Object.objects.filter(code=str(request.data['code']))
            path = '//SINAPS-WORKSPACE/itoDB/web/'+str(curObject[0].pk)
            checkpath = os.path.exists(path)
            if checkpath==False:
                os.makedirs(path)
                os.makedirs(path + '/documentation')
                os.makedirs(path + '/photo')
                os.makedirs(path + '/network')
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def objects_detail(request, pk):
    # print('pk:', pk)
    object = Object.objects.get(id=int(pk))
    # print('object:', object)

    if request.method == 'PUT':
        serializer = itodbSerializer(object, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        data = {"resp": ""}
        stuff = Stuff.objects.filter(Q(object_fact=object.name) | Q(object_target=object.name))
        if len(stuff) != 0:
            data['resp'] = 'denied'
        else:
            object.delete()
            data['resp'] = 'success'
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')

@api_view(['GET', 'POST'])
def subobject_list(request):
    if request.method == 'GET':
        data = SubObject.objects.all()
        serializer = subobjectSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = subobjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def subobjects_detail(request, pk):
    object = SubObject.objects.get(id=int(pk))
    if request.method == 'PUT':
        serializer = itodbSerializer(object, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        data = {"resp": ""}
        print('DEL CHILD NODE')
        parentObject = Object.objects.get(pk=int(object.connect_id))
        stuff = Stuff.objects.filter(object_target=parentObject.name, subobject_fact=object.name)
        if len(stuff) !=0:
            data["resp"] = "denied"
        else:
            object.delete()
            data["resp"] = "success"
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')

@api_view(['GET', 'POST'])
def stuff_list(request):
    if request.method == 'GET':
        data = Stuff.objects.all()
        serializer = stuffSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = itodbSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def modal_ns_stuff_data_list(request):
    if request.method == 'GET':
        data = {"types": [], "models":[], "manufacturer":[], "warehouse":[], "seller":[], "object":[]}
        for p_type in Type.objects.all():
            data["types"].append(p_type.type_name)
        for p_model in Model.objects.all():
            data["models"].append(p_model.model_name)
        for p_manufacturer in Manufacturer.objects.all():
            data["manufacturer"].append(p_manufacturer.manufacturer_name)
        for p_warehouse in Warehouse.objects.all():
            data["warehouse"].append(p_warehouse.warehouse_name)
        for p_seller in Seller.objects.all():
            data["seller"].append(p_seller.seller_name)
        for p_object in Object.objects.all():
            data["object"].append(p_object.name)
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')

    elif request.method == 'POST':
        print('NEW STUFF REC DATA: ', request.data)

        serializer = stuffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            newHystoryRecord(request.data['user'], request.data['serial'], request.data['event'])
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def modal_ns_substuff_data_list(request):
    if request.method == 'GET':
        data = {"types": [], "models":[]}
        for p_type in SubType.objects.all():
            data["types"].append(p_type.subtype_name)
        for p_model in SubModel.objects.all():
            data["models"].append(p_model.submodel_name)
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')

    elif request.method == 'POST':
        print('NEW SUBSTUFF REC: ', request.data)
        serializer = stuffSerializer(data=request.data)
        print('serializer return', serializer)
        if serializer.is_valid():
            print('serializer is valid')
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def stuff_detail(request, pk):
    print('STUFF DETAIL!')
    print('pk:', pk)
    object = Stuff.objects.get(id=int(pk))
    print('object:', object)

    if request.method == 'PUT':
        serializer = itodbSerializer(object, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        print('STUFF DELETE!!!')
        object.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def stuff_transfer(request, pk):
    object = Stuff.objects.get(id=int(pk))
    if request.method == 'PUT':
        print(request.data)
        data = request.data
        object.object_fact = data['object']
        if str(data['subObject']) != '\u200b':
            object.subobject_fact = data['subObject']
        else:
            object.subobject_fact = ''
        object.date_transfer = str((data['date'])).replace('/', '-')
        object.save(update_fields=['object_fact', 'subobject_fact', 'date_transfer'])
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def stuff_by_tree(request):
    if request.method == 'POST':
        print(request.data)
        data = request.data
        if data['type'] == 'parent':
            print('GET PARENT STUFF LIST')
            pObject = Object.objects.get(id=int(data['pid']))
            print(pObject.name)
            data = Stuff.objects.filter(object_fact=str(pObject.name))
            print(data)
        else:
            print('GET CHILD STUFF LIST')
            pObject = Object.objects.get(id=int(data['pid']))
            cObject = SubObject.objects.get(id=int(data['cid']))
            data = Stuff.objects.filter(object_fact=str(pObject.name), subobject_fact=str(cObject.name))

        serializer = stuffSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

@api_view(['GET', 'PUT'])
def object_node(request, pk):
    object = Object.objects.get(id=int(pk))
    if request.method == 'GET':
        data = {'note':str(object.note), 'code': object.code, 'name':object.name}
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')
    if request.method == 'PUT':
        print('NOTE PUT: ', str(request.data))
        serializer = objectSerializer(object, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def object_status(request, pk):
    print('GET STATUS: ', pk)
    if request.method == 'GET':
        objName = Object.objects.get(id=int(pk))
        stuffRows = Stuff.objects.filter(Q(object_fact=str(objName.name)) |  Q(object_target=str(objName.name)))
        data = {'type':[], 'model':[], 'count_spec':[], 'count_fact': [], 'pk': []}
        p_data = Status.objects.filter(connect=int(pk))
        i = 0
        for elem in p_data:
            data['type'].append(elem.type)
            data['model'].append(elem.model)
            data['count_spec'].append(elem.count)
            data['count_fact'].append(str(getElemStat(curRows=stuffRows, objName=objName.name, curType=elem.type, curModel=elem.model)))
            data['pk'].append(elem.pk)
        print('RES DATA: ', data)
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        print(json_res)
        return JsonResponse(json_res, content_type='application/json')

@api_view(['GET', 'POST'])
def modal_stat_data_list(request):
    if request.method == 'GET':
        data = {"types": [], "models":[]}
        for p_type in Type.objects.all():
            data["types"].append(p_type.type_name)
        for p_model in Model.objects.all():
            data["models"].append(p_model.model_name)
        for p_type in SubType.objects.all():
            data["types"].append(p_type.subtype_name)
        for p_model in SubModel.objects.all():
            data["models"].append(p_model.submodel_name)
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        print(json_res)
        return JsonResponse(json_res, content_type='application/json')

@api_view(['POST'])
def modal_stat_new_rec(request):
    if request.method == 'POST':
        pk = request.data['connect']
        print('STAT NEW REC: ', request.data['connect'])
        serializer = statusDataSerializer(data=request.data)
        print('serializer return', serializer)
        if serializer.is_valid():
            print('serializer is valid')
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def modal_stat_edit_rec(request, pk):
    object = Status.objects.get(id=int(pk))
    if request.method == 'PUT':
        print('STATUS REC EDIT: ',request.data)
        data = request.data
        object.type = data['type']
        object.model = data['model']
        object.count = data['count']
        object.connect = Object.objects.get(id=int(data['connect']))
        object.save(update_fields=['type', 'model', 'count', 'connect'])
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'DELETE':
        object = Status.objects.get(id=int(pk))
        print('STUFF DELETE!!!')
        object.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def getElemStat(curRows, objName, curType, curModel):
    pFactNum = 0
    for row in curRows:
        if str(row.type) == curType:
            if str(row.model) == curModel:
                if (row.object_fact == 'Склад Офис') or (row.object_fact == objName):
                    pFactNum +=1
    pFactNum = str(pFactNum)
    print('FACTNUM: ', pFactNum)
    return pFactNum

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        check_name = False
        check_pwd = False
        userLst = User.objects.all().order_by('id')
        for user in userLst:
            if (user.username == request.data['username']):
              check_name = True
              if (User.check_password(user, request.data['password']) == True):
                check_pwd = True
        print(check_name)
        print(check_pwd)
        if check_name and check_pwd == True:
            data = {"res": 'success', 'mes': 'none'}
        else:
          if check_name == False:
            data = {"res": 'denied', 'mes': 'wr_name'}
          else:
            data = {"res": 'denied', 'mes': 'wr_pwd'}
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')

@api_view(['PUT'])
def stuff_edit_single(request, pk):
    print('EDIT SINGLE STUFF')
    print(pk)
    object = Stuff.objects.get(id=int(pk))

    if request.method == 'PUT':
        data = request.data
        object.type = data['type']
        object.model = data['model']
        object.serial = data['serial']
        object.manufacturer = data['manufacturer']
        object.seller = data['seller']
        object.date_purchase = data['date_purchase']
        object.object_target = data['object_target']
        object.comment = data['comment']
        object.save(update_fields=['type', 'model', 'serial', 'manufacturer', 'seller', 'date_purchase', 'object_target', 'comment'])
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def stuff_edit_group(request):
    if request.method == 'POST':
        data = request.data
        print(data)
        for pk in data['ids']:
            object = Stuff.objects.get(id=int(pk))
            object.comment = data['comment']
            object.save(update_fields=['comment'])
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT'])
def object_referal_edit(request, pk):
    data = request.data
    object = Object.objects.get(id=int(pk))
    if request.method == 'PUT':
        object.referal = data['referal']
        object.save(update_fields=['referal'])
        return Response(status=status.HTTP_204_NO_CONTENT)
    if request.method == 'GET':
        data = {"referal": ''}
        data['referal'] = object.referal
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')

@api_view(['GET'])
def export_to_exel(request, pk):
    print('EXPORT TO EXEL REQ RECIEVE: ', request.data)
    object = Object.objects.get(id=int(pk))
    print(object.name)
    if request.method == 'GET':
        stuff = Stuff.objects.filter(Q(object_fact=object.name) | Q(object_target=object.name, object_fact='Склад Офис'))
        data = {"type": [], "model": [], "unittype": [], "count": [], "serial": [], "location": []}
        for elem in stuff:
            data['type'].append(elem.type)
            data['model'].append(elem.model)
            data['unittype'].append('шт.')
            data['count'].append('1')
            data['serial'].append(elem.serial)
            if elem.object_fact == 'Склад Офис':
                data['location'].append('Склад Офис')
            else:
                data['location'].append('Установлен ' + str(elem.object_fact) + ' || ' + str(elem.subobject_fact))
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')

@api_view(['POST'])
def history(request):
    print('GET HISTPRY:  ', request.data)
    if request.method == 'POST':
        stuff = History.objects.filter(serial=request.data['serial'])
        data = {"date": [], "user": [], "serial": [], "event": []}
        for elem in stuff:
            data['date'].append(str(elem.date).split('.')[0])
            data['user'].append(elem.user)
            data['serial'].append(elem.serial)
            data['event'].append(elem.event)
        json_data = json.dumps(data)
        json_res = json.loads(json_data)
        return JsonResponse(json_res, content_type='application/json')


# ======================================================================================================================

def database_migrate():
    objLst = Object.objects.all().order_by('id')
    i = 0
    for elem in objLst:
        if i>=0:
            obj_migrate(str(elem.name))
        i+=1

def obj_migrate(objName):
    object_pg = Object.objects.filter(name=objName)
    passlog = open('C:\itoDB\sqlpasslog.txt', "r")
    l = [line.strip() for line in passlog]

    SqlHostname = str(l[0])
    SqlPort = int(l[1])
    SqlUserName = str(l[2])
    SqlPwd = str(l[3])
    SqlDBName = 'itodb'

    con = pymysql.connect(host=str(SqlHostname),
        port=int(SqlPort),
        user=str(SqlUserName),
        passwd=str(SqlPwd),
        db=str(SqlDBName))

    ores = []
    kres = []

    with con:
        cur = con.cursor()
        if objName != 'Фестивальная':
            if objName != 'Рублевка 2.3':
                cur.execute("SELECT * FROM treeobjtbl WHERE ParentObjName LIKE '%"+objName+"%'")
                object_sql = cur.fetchall()
            else:
                cur.execute("SELECT * FROM treeobjtbl WHERE ParentObjName LIKE '" + '681 ' + objName + "'")
                object_sql = cur.fetchall()
        else:
            cur.execute("SELECT * FROM treeobjtbl WHERE ParentObjName LIKE '" + '658 ' + objName + "'")
            object_sql = cur.fetchall()
        print('CUR OBJECT: ', object_sql)
        print(object_sql)
        child_lst = checkChild(con, object_sql[0][0])

        cur_obj_name = str(object_sql[0][1])

        cur.execute("SELECT * FROM ostuff")
        orows = cur.fetchall()

        for row in orows:
            if (row[8] == cur_obj_name):
                ores.append(row)

        cur.execute("SELECT * FROM kstuff")
        krows = cur.fetchall()

        for row in krows:
            if (row[8] == cur_obj_name):
                kres.append(row)

        if len(child_lst) == 0:
            for elem in ores:
                if elem[13]== None:
                    elem[13] = ''
                target = ''
                if elem[7] == 'Резерв':
                    target = 'Резерв'
                else:
                    target = str(elem[7])[4:]
                fact = ''
                if elem[8] == 'Склад Офис':
                    fact = 'Склад Офис'
                else:
                    fact = str(elem[8])[4:]
                d_trans = ''
                if elem[9] == None:
                    d_trans = ''
                else:
                    d_trans = elem[9]
                Stuff.objects.create(
                    type=elem[1],
                    model=elem[2],
                    serial=elem[3],
                    manufacturer=elem[4],
                    seller=elem[5],
                    date_purchase=elem[6],
                    object_target=target,
                    object_fact=fact,
                    date_transfer=d_trans,
                    comment=elem[13],
                    state='Оборудование'
                )

            for elem in kres:
                if elem[13]== None:
                    elem[13] = ''
                target = ''
                if elem[7] == 'Резерв':
                    target = 'Резерв'
                else:
                    target = str(elem[7])[4:]
                fact = ''
                if elem[8] == 'Склад Офис':
                    fact = 'Склад Офис'
                else:
                    fact = str(elem[8])[4:]
                d_trans = ''
                if elem[9] == None:
                    d_trans = ''
                else:
                    d_trans = elem[9]
                Stuff.objects.create(
                    type=elem[1],
                    model=elem[2],
                    serial=elem[3],
                    manufacturer=elem[4],
                    seller=elem[5],
                    date_purchase=elem[6],
                    object_target=target,
                    object_fact=fact,
                    date_transfer=d_trans,
                    comment=elem[13],
                    state='Комплектующее'
                )
        else:
            print('childs was found: ', child_lst)
            print(ores)
            p_ores = []
            p_kres = []
            for elem in ores:
                elem = list(elem)
                for p_elem in child_lst:

                    if (str(elem[12])==str(p_elem[0])):
                        elem[12]=p_elem[1]
                        print('------------------------')
                        print('STR: ',elem)
                        print(elem[12])
                        print(p_elem[1])
                p_ores.append(elem)
            for elem in kres:
                elem = list(elem)
                for p_elem in child_lst:

                    if (str(elem[12])==str(p_elem[0])):
                        elem[12]=p_elem[1]
                        print('------------------------')
                        print('STR: ', elem)
                        print(elem[12])
                        print(p_elem[1])
                p_kres.append(elem)

            for elem in p_ores:
                if elem[13]== None:
                    elem[13] = ''
                target = ''
                if elem[7] == 'Резерв':
                    target = 'Резерв'
                else:
                    target = str(elem[7])[4:]
                Stuff.objects.create(
                    type=elem[1],
                    model=elem[2],
                    serial=elem[3],
                    manufacturer=elem[4],
                    seller=elem[5],
                    date_purchase=elem[6],
                    object_target=target,
                    object_fact=str(elem[8])[4:],
                    date_transfer=elem[9],
                    comment=elem[13],
                    state='Оборудование',
                    subobject_fact=elem[12]
                )

            for elem in p_kres:
                if elem[13]== None:
                    elem[13] = ''
                target = ''
                if elem[7] == 'Резерв':
                  target = 'Резерв'
                else:
                    target = str(elem[7])[4:]
                Stuff.objects.create(
                    type=elem[1],
                    model=elem[2],
                    serial=elem[3],
                    manufacturer=elem[4],
                    seller=elem[5],
                    date_purchase=elem[6],
                    object_target=target,
                    object_fact=str(elem[8])[4:],
                    date_transfer=elem[9],
                    comment=elem[13],
                    state='Комплектующее',
                    subobject_fact=elem[12]
                )

def checkChild(con, pNameId):
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM treechildobjtbl WHERE ConnectionID LIKE '" + str(pNameId) + "'")
        child_id_sql = cur.fetchall()
        return child_id_sql

def databaseHistoryMigrate():

    passlog = open('C:\itoDB\sqlpasslog.txt', "r")
    l = [line.strip() for line in passlog]

    SqlHostname = str(l[0])
    SqlPort = int(l[1])
    SqlUserName = str(l[2])
    SqlPwd = str(l[3])
    SqlDBName = 'itodb'

    con = pymysql.connect(host=str(SqlHostname),
        port=int(SqlPort),
        user=str(SqlUserName),
        passwd=str(SqlPwd),
        db=str(SqlDBName))

    ores = []
    kres = []

    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM hystory")
        history_sql = cur.fetchall()


        for elem in history_sql:
          print(elem[1])
          date_str = str(str(elem[1]).split(' ')[0]).split('/')
          cur_date = date_str[2]+'-'+date_str[1]+'-'+date_str[0]
          cur_time = str(str(elem[1]).split(' ')[1])+'.01'+'+03'
          cur_datetime = cur_date+' '+cur_time
          print(cur_datetime)
          if elem[2] == None:
              cur_user = ''
          else:
              cur_user = elem[2]
          History.objects.create(
              date=cur_datetime,
              user=cur_user,
              serial=elem[4],
              event=elem[5]
          )

def newHystoryRecord(user, serial, event):
    p_data = {"user":user, "serial":serial, "event":event}
    serializer = hystorySerializer(data=p_data)
    if serializer.is_valid():
        serializer.save()


