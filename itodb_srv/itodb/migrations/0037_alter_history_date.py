# Generated by Django 3.2.4 on 2022-06-16 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0036_alter_history_serial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='history',
            name='date',
            field=models.DateTimeField(verbose_name='date'),
        ),
    ]
