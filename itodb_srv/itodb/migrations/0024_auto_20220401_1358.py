# Generated by Django 3.2.10 on 2022-04-01 10:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0023_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='status',
            name='model',
            field=models.CharField(max_length=40, verbose_name='type'),
        ),
        migrations.AlterField(
            model_name='status',
            name='type',
            field=models.CharField(max_length=40, verbose_name='mdoel'),
        ),
    ]
