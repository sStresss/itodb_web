# Generated by Django 3.2.4 on 2022-06-16 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0030_hystory'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hystory',
            name='type',
            field=models.CharField(max_length=50, verbose_name='type'),
        ),
    ]
