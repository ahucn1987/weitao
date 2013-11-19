客户端提供的API
---



淘宝客户端通过向webview中注入一些对象，以实现通过页面的javascript与客户端通讯，原理与phonegap一样。


首先，我们需要引用bridge.js,与主客户端通讯都是通过这个脚本的接口实现的。

```html
<script src="http://g.tbcdn.cn/mtb/lib-windvane/1.1.12/??bridge.js,api.js"></script>
```






## api.js

提供给业务方使用，封装了客户端的特性功能。依赖`bridge.js`。
```html
<script src="http://g.tbcdn.cn/mtb/lib-windvane/1.1.12/api.js"></script>
```
以下API均在`window.WindVane.api`的命名空间下。展示的API列表第一行是JS调用的名称，第二行是访问的客户端对象方法。



### 基础 api.base


#### base.isWindVaneSDK(success, failure)
用于获取当前WindVane SDK的版本。

* [function] success 判断正确的回调
* [function] failure 判断失败的回调



#### base.showShareMenu(success,failure,option)
淘宝主客户端API：分享

* [object] option 入参对象包括如下字段
    * [string] image 图片地址
    * [string] url 分享URL
    * [string] title 分享标题
    * [string] text 分享内容


#### base.getDeviceInfo(success,failure)
淘宝主客户端API：获取设备信息
* [function] success 判断正确的回调
* [function] failure 判断失败的回调




### 摇一摇 api.shake

#### shake.startWatch(handler,failure,option) 
开启摇动的监听。

* [function] handler 摇动后的回调
* [function] failure 监听失败的回调
* [object] option 控制参数
	* timeout 启动监听超时参数，单位 毫秒

#### shake.stopWatch(success, failure, handler)
关闭摇动的监听。

* [function] success 关闭成功回调
* [function] failure 关闭失败回调
* [function] handler 制定要关闭的某个监听摇动时间的回调，如果不传递，则清空所有监听者


### 地理位置 api.geolocation

地理位置API你可以选择直接使用如下API，也可以选择使用原生H5 API，我们将原生API进行了重写，这样你无须担心webview中原生API的支持性。我们建议你使用原生API，但是原生API最终执行的同样为以下方法：

#### geolocation.get(callback, failure, option)

获取当前的地理位置。

* [function] 获得地理位置后的成功回调
* [function] 获取地理位置后的失败回调
* [object] option 包括：
	* [string]enableHighAcuracy 是否使用高清准度，true/faluse
	* [string]address 是否获取地址描述，如中国杭州市，true/false

#### geolocation.search(callback, failure, option)

搜索给定地址的地理位置经纬度。

* [function] callback获得地理位置后的成功回调
* [function] failure 获取地理位置的失败回调
* [object] option 包括：
	* [sting] addrs 地址

#### geolocation.watch(callback, failure, option)

需求客户端版本：1212版本，需求WindVane版本：2.6.0

监听地理位置变化，只有地理位置发生变化才会回调通知

* [function] callback获得地理位置后的成功回调
* [function] failure 获取地理位置的失败回调
* [object] option 包括：
	* [string]enableHighAcuracy 是否使用高清准度，true/faluse
	* [string]address 是否获取地址描述，如中国杭州市，true/false
	* [sting] failure 检测时间片长度，单位 毫秒

返回值：

* [int] id 任务ID
	
#### geolocatoin.clear(i)

需求客户端版本：1212版本，需求WindVane版本：2.6.0

清理监听地理位置变化任务

* [id] id 任务ID













## share

调用分享组件

```html
<script src="http://g.tbcdn.cn/mtb/lib-share/0.1.0/share.js"></script>
```

/**
* 指定打开淘宝APP
*
* @param {string} title 分享标题
* @param {string} text  分享主体内容
* @param {string} url   分享出去的url
* @param {string} image 分享出去的图片地址
* @param {Function} success 调起分享的回调
* @param {Function} fail   不能调起分享的回调
* @no returns
*/

调用方法
###openTaobaoAPPNativeShare : function(title, text, url, image, success, fail)


```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width">
        <meta content="telephone=no" name="format-detection" />
        <script src="http://a.tbcdn.cn/mw/app/lottery/20131111/sb/zepto.min.js"></script>
        <script src="http://a.tbcdn.cn/mw/app/lottery/20131111/sb/bridge.min.js"></script> 
		<script src="http://g.tbcdn.cn/mtb/lib-share/0.1.0/share.js"></script>
        <style>
            *{margin: 0;padding: 0;font-size: 16px;color: #4c576d;}
            .none{display: none}
            div{text-align: center;}
            #J_Tips_1{width: 270px;height: 162px;background-color: #e8e8e8;position: relative;top: 80px;padding-top: 22px;margin: 0 auto;}
            p{padding-top: 5px}
            span{color: #ff5500}
            #J_Tips_2{width: 270px;height:100px;position: absolute;bottom: 80px;left: 50%;margin-left: -135px;}
            #J_Tips_2 a{display: block;line-height: 45px;width: 135px;height: 45px;color: #fff;background-color: #8ebd10;text-decoration: none;margin-top: 18px;margin-left: 68px;}
        </style>
    </head>
    <body>
        <div id="J_Tips_1">
            <p>本页面测试客户端内分享<p>
            <p>请<span>打开手机淘宝客户端webview测试</span></p>
            <p>分享标题：<input type="text" value="" id="J_Title" /> </p>
            <p>分享内容：<input type="text" value="" id="J_Text" /> </p>
            <p>分享链接：<input type="text" value="" id="J_Url" /> </p>
            <p>分享图片：<input type="text" value="" id="J_Image" /> </p>              
        </div>
        <div id="J_Tips_2">
            <p>测试分享请点击测试按钮</p>
            <p>ps:不填写内容为默认分享内容，都为超长或者超大情况</p>
            <a href="#" id="J_ShareBtn">测试分享</a>
            <script type="text/javascript">
                var share = window.lib.share;
                $('#J_ShareBtn').on('click',function(e){
                    e.preventDefault();
                    $('#J_Tips_2').text(navigator.userAgent);
                    var param = {
                        "title" : $('#J_Title').val() || '发现一个好玩的',
                        "text" : $('#J_Text').val() || '淘宝网—手机购物唯一选择',
                        "url" : $('#J_Url').val() || 'http://m.taobao.com?ttid=1',
                        "image" : $('#J_Image').val() || 'http://10.73.108.175/github/loadstatus/ma.jpg'
                    }
                    share.openTaobaoAPPNativeShare(param.title,param.text,param.url,param.image,function(data){
                         $('#J_Tips_2').html('success: data:'+data);

                    },function(data,params){
                        $('#J_Tips_2').html('fail: data:'+data);
                    });
                })
            </script>
        </div>

    </body>
</html>
```



## 调试方法

现在[test.apk](https://github.com/satans17/weitao)，目前只有android版
输入你要测试的网址，即可以进行测试








