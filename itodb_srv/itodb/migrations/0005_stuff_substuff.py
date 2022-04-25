# Generated by Django 3.2.10 on 2022-02-09 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0004_subobject'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stuff',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=40, verbose_name='')),
                ('model', models.CharField(max_length=40, verbose_name='')),
                ('serial', models.CharField(max_length=40, verbose_name='')),
                ('manufacturer', models.CharField(max_length=40, verbose_name='')),
                ('seller', models.CharField(max_length=40, verbose_name='')),
                ('date_purchase', models.CharField(max_length=40, verbose_name='')),
                ('object_target', models.CharField(max_length=40, verbose_name='')),
                ('object_fact', models.CharField(max_length=40, verbose_name='')),
                ('date_transfer', models.CharField(max_length=40, verbose_name='')),
                ('comment', models.CharField(max_length=40, verbose_name='')),
            ],
        ),
        migrations.CreateModel(
            name='SubStuff',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=40, verbose_name='')),
                ('model', models.CharField(max_length=40, verbose_name='')),
                ('serial', models.CharField(max_length=40, verbose_name='')),
                ('manufacturer', models.CharField(max_length=40, verbose_name='')),
                ('seller', models.CharField(max_length=40, verbose_name='')),
                ('date_purchase', models.CharField(max_length=40, verbose_name='')),
                ('object_target', models.CharField(max_length=40, verbose_name='')),
                ('object_fact', models.CharField(max_length=40, verbose_name='')),
                ('date_transfer', models.CharField(max_length=40, verbose_name='')),
                ('comment', models.CharField(max_length=40, verbose_name='')),
            ],
        ),
    ]