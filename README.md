N-chat
======

    使用 Express +  Socket.IO 搭建的多人聊天室

简介
---------
        大家好，这是一个简单的多人即使聊天系统，它不会留存聊天记录，因为我没有连接数据库，一想到连接数据库，我还得设计表，设计注册页面，
        还得写个聊天记录功能，好多好多的事。我想我四天绝对不会完成。。。。。嘿嘿嘿，重要的是实现功能，这个系统主要的功能有文字通信，图片通信，私聊
        广播聊天，用户列表查看。当然我想到了好多好多功能，视频，语音，远程操控，公共文件夹（我不是再说某讯）；实力原因，仅供学习。


        废话不多说先上几个图！！！！
            
![github](https://github.com/pagnkelly/N-chat/blob/master/N-chat/public/images/1.png)
![github](https://github.com/pagnkelly/N-chat/blob/master/N-chat/public/images/2.png)
![github](https://github.com/pagnkelly/N-chat/blob/master/N-chat/public/images/3.png)
![github](https://github.com/pagnkelly/N-chat/blob/master/N-chat/public/images/4.png)
        期间图片拖拽上传遇到问题，在这里得以解决https://segmentfault.com/q/1010000002885157
######package.json

```javascript
 {
        "name": "application-name",
        "version": "0.0.1",
        "private": true,
        "scripts": {
        "start": "node app.js"
        },
        "dependencies": {
        "express": "3.3.1",
        "socket.io": "*"
        }
}
```
###求助

        浏览器桌面提醒怎么写，要那种支持多的。
        我这个新版谷歌火狐都不好使，求好使的桌面提醒。
```javascript
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
```