from django.urls import re_path
from . import consumers
from .views import *
from django.urls import path, include

websocket_urlpatterns = [
    re_path(r'ws/socket-server/', consumers.ChatConsumer.as_asgi()),
    re_path(r'^api/objects/$', object_list),
    re_path(r'^api/subobjects/$', subobject_list),
    re_path('^api/objects/([0-9]{2})$', objects_detail),
    re_path('^api/objects/([0-9]{3})$', objects_detail),
    re_path('^api/subobjects/([0-9]{2})$', subobjects_detail),
    re_path(r'^api/stuff/$', stuff_list),
    re_path(r'^api/newstuffdatalst/$', modal_ns_stuff_data_list),
    re_path(r'^api/newsubstuffdatalst/$', modal_ns_substuff_data_list),
    re_path('^api/stuff/([0-9]{2})$', stuff_detail),
    re_path('^api/stuff/([0-9]{3})$', stuff_detail),
    re_path('^api/editstuff/([0-9]{3})$', stuff_transfer),
    re_path('^api/stuffbytree/$', stuff_by_tree),
    re_path('^api/objectnode/([0-9]{2})$', object_node),
    re_path('^api/objectnode/([0-9]{3})$', object_node),
]