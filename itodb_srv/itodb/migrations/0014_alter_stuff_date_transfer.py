# Generated by Django 3.2.10 on 2022-02-19 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0013_alter_substuff_date_transfer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stuff',
            name='date_transfer',
            field=models.CharField(blank=True, max_length=40, verbose_name='date_transfer'),
        ),
    ]
