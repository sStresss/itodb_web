# Generated by Django 3.2.10 on 2022-01-07 05:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itodb', '0002_object'),
    ]

    operations = [
        migrations.AddField(
            model_name='object',
            name='code',
            field=models.CharField(default=1, max_length=5, verbose_name='Code'),
            preserve_default=False,
        ),
    ]
