# Generated by Django 3.2.10 on 2022-03-04 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0020_delete_substuff'),
    ]

    operations = [
        migrations.AddField(
            model_name='stuff',
            name='subobject_fact',
            field=models.CharField(blank=True, max_length=20, verbose_name='object_fact'),
        ),
    ]
