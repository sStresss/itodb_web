# Generated by Django 3.2.10 on 2022-02-19 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0011_alter_stuff_manufacturer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='substuff',
            name='date_transfer',
            field=models.CharField(blank=True, max_length=40, verbose_name=''),
        ),
    ]
