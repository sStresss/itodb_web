from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'itodb_srv_app.settings')

app = Celery('itodb_srv_app')
# app.conf.enable_utc = False

app.conf.update(timezone='Europe/Moscow')

app.config_from_object(settings, namespace='CELERY')

app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'request: {self.request!r}')


