from django.db import models

class Student(models.Model):
    name = models.CharField("Name", max_length=240)
    email = models.EmailField()
    document = models.CharField("Document", max_length=20)
    phone = models.CharField(max_length=20)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def __str__(self):
        return self.name

class Object(models.Model):
    code = models.CharField("Code", max_length=5)
    name = models.CharField("Name", max_length=40)
    note = models.CharField("Notes", max_length=500, blank=True)
    state = models.CharField("State", max_length=15, blank=True)

    def __str__(self):
        return f'{self.id}'

class SubObject(models.Model):
    name = models.CharField("Name", max_length=40)
    connect = models.ForeignKey(Object, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Stuff(models.Model):
    type = models.CharField("type", max_length=40)
    model = models.CharField("model", max_length=40)
    serial = models.CharField("serial", max_length=40)
    manufacturer = models.CharField("manufacturer", max_length=40)
    seller = models.CharField("seller", max_length=40)
    date_purchase = models.CharField("date_purchase", max_length=40)
    object_target = models.CharField("object_target", max_length=40)
    object_fact = models.CharField("object_fact", max_length=40)
    subobject_fact = models.CharField("object_fact", max_length=20, blank=True)
    date_transfer = models.CharField("date_transfer", max_length=40, blank=True)
    comment = models.CharField("comment", max_length=40, blank=True)
    state = models.CharField('state', max_length=20, blank=True)

    def __str__(self):
        return f'{self.id}'

class Type(models.Model):
    type_name = models.CharField("", max_length=40)

    def __str__(self):
        return self.type_name

class Model(models.Model):
    model_name = models.CharField("", max_length=40)

    def __str__(self):
        return self.model_name

class Manufacturer(models.Model):
    manufacturer_name = models.CharField("", max_length=40)

    def __str__(self):
        return self.manufacturer_name

class Warehouse(models.Model):
    warehouse_name = models.CharField("", max_length=40)

    def __str__(self):
        return self.warehouse_name

class Seller(models.Model):
    seller_name = models.CharField("", max_length=40)

    def __str__(self):
        return self.seller_name

class SubType(models.Model):
    subtype_name = models.CharField("name", max_length=40)

    def __str__(self):
        return self.subtype_name

class SubModel(models.Model):
    submodel_name = models.CharField("name", max_length=40)

    def __str__(self):
        return self.submodel_name

class Status(models.Model):
    type = models.CharField("mdoel", max_length=40)
    model = models.CharField("type", max_length=40)
    count = models.CharField("count", max_length=5)
    connect = models.ForeignKey(Object, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.id}'

