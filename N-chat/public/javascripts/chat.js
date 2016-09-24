$(document).ready(function() {
  $(window).keydown(function (e) {
    if (e.keyCode == 116) {
      if (!confirm("刷新将会清除所有聊天记录，确定要刷新么？")) {
        e.preventDefault();
      }
    }
  });
  var socket = io.connect();
  var from = $.cookie('user');//从 cookie 中读取用户名，存于变量 from
  var to = 'all';//设置默认接收对象为"所有人"
  //发送用户上线信号
  socket.emit('online', {user: from});
  socket.on('online', function (data) {
    //显示系统消息
    if (data.user != from) {
      var sys = '<li class="otherMsg">系统(' + now() + '):' + '用户 ' + data.user + ' 上线了！</li>';
    } else {
      var sys = '<li class="otherMsg">系统(' + now() + '):你进入了聊天室！</li>';
    }
    $(".chat-thread").append(sys);
    //刷新用户在线列表
    flushUsers(data.users);
    //显示正在对谁说话
    showSayTo();
    //滚动条保持底部
    keepBottom();
  });

  socket.on('say', function (data) {
    //对所有人说
    if (data.to == 'all') {
      $(".chat-thread").append('<li class="otherMsg">' + data.from + '(' + now() + ')对 所有人 说：<br/>' + data.msg + '</li>');
    }
    //对你密语
    if (data.to == from) {
      $(".chat-thread").append('<li class="otherMsg" >' + data.from + '(' + now() + ')对 你 说：<br/>' + data.msg + '</li>');

      //虽然我添加了这个功能，但是貌似浏览器支持度不高，都说chrome好使，是28以后的，但是最新版chrome因为使用的人太少去掉了。
      //从网上搜了那种引入js的我也试了，也不好使。只能针对特别用户
      if(window.webkitNotifications){
        if(window.webkitNotifications.checkPermission()==0){
          setInterval(function(){
            var popup = window.webkitNotifications.createNotification("",data.from,data.msg);
            popup.show();
          },1000 * 60 * 20); }else{
          window.webkitNotifications.requestPermission();
        }
      }else{
        alert('浏览器不支持桌面通知～！');
      }
    }
    //滚动条保持底部
    keepBottom();
  });

  socket.on('offline', function (data) {
    //显示系统消息
    var sys = '<li class="otherMsg">系统(' + now() + '):' + '用户 ' + data.user + ' 下线了！</li>';

    //刷新用户在线列表
    flushUsers(data.users);
    //如果正对某人聊天，该人却下线了
    if (data.user == to) {
      to = "all";
    }
    //显示正在对谁说话
    showSayTo();
    //滚动条保持底部
    keepBottom();
  });

  //服务器关闭
  socket.on('disconnect', function() {
    var sys = '<li class="otherMsg">系统:连接服务器失败！</li>';
    $(".chat-thread").append(sys + "<br/>");
    $("#list").empty();
    //滚动条保持底部
    keepBottom();
  });

  //重新启动服务器
  socket.on('reconnect', function() {
    var sys = '<li class="otherMsg">系统:重新连接服务器！</li>';
    $(".chat-thread").append(sys + "<br/>");
    socket.emit('online', {user: from});
    //滚动条保持底部
    keepBottom();
  });

  //刷新用户在线列表
  function flushUsers(users) {
    //清空之前用户列表，添加 "所有人" 选项并默认为灰色选中效果
    $("#list").empty().append('<li title="双击聊天" alt="all" class="sayingto" onselectstart="return false">所有人</li>');
    //遍历生成用户在线列表
    for (var i in users) {
      $("#list").append('<li alt="' + users[i] + '" title="双击聊天" onselectstart="return false">' + users[i] + '</li>');
    }
    //双击对某人聊天
    $("#list > li").dblclick(function() {
      //如果不是双击的自己的名字
      if ($(this).attr('alt') != from) {
        //设置被双击的用户为说话对象
        to = $(this).attr('alt');
        //清除之前的选中效果
        $("#list > li").removeClass('sayingto');
        //给被双击的用户添加选中效果
        $(this).addClass('sayingto');
        //刷新正在对谁说话
        showSayTo();
      }
    });
  }

  //显示正在对谁说话
  function showSayTo() {
    $("#from").html(from);
    $("#to").html(to == "all" ? "所有人" : to);
  }

  //获取当前时间
  function now() {
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return time;
  }
  //始终让滚动条保持底部
  function keepBottom(){
    $('#contents')[0].scrollTop=$('#contents')[0].scrollHeight;
  }
  //发话
  $("#say").click(function() {
    //获取要发送的信息

    var $msg = $("#text").val();

    if ($msg == "") return;
    //把发送的信息先添加到自己的浏览器 DOM 中,
    if (to == "all") {
      $(".chat-thread").append('<li class="yourMsg">你(' + now() + ')对 所有人 说：<br/>' + $msg + '</li>');
    } else {
      $(".chat-thread").append('<li class="yourMsg" >你(' + now() + ')对 ' + to + ' 说：<br/>' + $msg + '</li>');
    }
    //滚动条保持底部
    keepBottom();
    //发送发话信息，这块我写的不好，不知该怎么验证是否发送成功，回调？但是百度没发现好的解决方案。
    socket.emit('say', {from: from, to: to, msg: $msg});
    //清空输入框并获得焦点
    KindEditor.instances[0].html("");
  });
});
