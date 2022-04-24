from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from itertools import chain
from django.forms.models import model_to_dict
import json
import django
from django.http import JsonResponse
# from .scripts.states import getObjStat

from .models import Student, Object, SubObject, Stuff, Type, Model, Manufacturer, Warehouse, Seller, SubType, SubModel, Status
from django.db.models import CharField, Value
from .serializers import *
import time
from . import tasks
from django.db.models import Q
from .tasks import check
import os



@api_view(['GET', 'POST'])
def object_list(request):
    if request.method == 'GET':
        print('GET OBJ LIST!!!!!!!')
        data = Object.objects.all().order_by('code')
        # test = check()
        serializer = objectSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = objectSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            curObject = Object.objects.filter(code=str(request.data['code']))
            path = '//SINAPS-INZH-01/itoDB/web/'+str(curObject[0].pk)
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
    print('pk:', pk)
    object = Object.objects.get(id=int(pk))
    print('object:', object)

    if request.method == 'PUT':
        serializer = itodbSerializer(object, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        object.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
        object.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
        serializer = stuffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
def stuff_edit(request, pk):
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