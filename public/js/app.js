/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {

    /*var data = {
        ParentID: '',
        pageindex: 0,
        pagesize: -1
    };*/

    $.ajax({
        method: "GET",
        url:      'http://ceshi2.chinacloudapp.cn:8080/rest/rest/contents/homecategorys',
        dataType: 'json',
        success:  function (data) {
            console.log(data);
        }
    })

});