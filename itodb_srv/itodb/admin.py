from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.Object)
admin.site.register(models.SubObject)
admin.site.register(models.Stuff)
admin.site.register(models.Type)
admin.site.register(models.Model)
admin.site.register(models.Manufacturer)
admin.site.register(models.Warehouse)
admin.site.register(models.Seller)
admin.site.register(models.SubType)
admin.site.register(models.SubModel)
admin.site.register(models.Status)
