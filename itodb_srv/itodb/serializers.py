from rest_framework import serializers
from .models import Stuff, Student, Object, SubObject, Type, Status

class itodbSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = ('pk', 'name', 'email', 'document', 'phone', 'registrationDate')

class objectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Object
        fields = ('pk', 'code', 'name', 'note', 'state', 'referal')

class subobjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubObject
        fields = ('pk','name','connect')

class stuffSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stuff
        fields = ('pk', 'type', 'model', 'serial', 'manufacturer', 'seller', 'date_purchase', 'object_target',
                  'object_fact', 'date_transfer', 'comment', 'state')

class modalNSDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = Type
        fields = ('pk', 'type_name')

class statusDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = Status
        fields = ('pk', 'type', 'model', 'count', 'connect')