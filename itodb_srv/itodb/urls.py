from django.urls import re_path
from .views import *
from django.conf.urls import url

urlpatterns = [
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
    re_path('^api/transferstuff/([0-9]{3})$', stuff_transfer),
    re_path('^api/stuffbytree/$', stuff_by_tree),
    re_path('^api/objectnode/([0-9]{2})$', object_node),
    re_path('^api/objectnode/([0-9]{3})$', object_node),
    re_path('^api/objectstatus/([0-9]{2})$', object_status),
    re_path('^api/objectstatus/([0-9]{3})$', object_status),
    re_path(r'^api/statdatalst/$', modal_stat_data_list),
    re_path(r'^api/statnewrec/$', modal_stat_new_rec),
    re_path(r'^api/stateditrec/([0-9]{1})$', modal_stat_edit_rec),
    re_path(r'^api/stateditrec/([0-9]{2})$', modal_stat_edit_rec),
    re_path(r'^api/stateditrec/([0-9]{3})$', modal_stat_edit_rec),
    re_path(r'^api/logincheck/$', login),
    re_path(r'^api/stuffsingleedit/([0-9]{1})$', stuff_edit_single),
    re_path(r'^api/stuffsingleedit/([0-9]{2})$', stuff_edit_single),
    re_path(r'^api/stuffsingleedit/([0-9]{3})$', stuff_edit_single),
    re_path(r'^api/stuffgroupedit/$', stuff_edit_group),

]