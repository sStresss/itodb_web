# Generated by Django 3.2.4 on 2022-05-16 09:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0027_object_referal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stuff',
            name='comment',
            field=models.CharField(blank=True, max_length=100, verbose_name='comment'),
        ),
    ]
