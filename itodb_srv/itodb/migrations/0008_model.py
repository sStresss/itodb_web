# Generated by Django 3.2.10 on 2022-02-17 07:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0007_rename_types_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Model',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('model_name', models.CharField(max_length=40, verbose_name='')),
            ],
        ),
    ]
