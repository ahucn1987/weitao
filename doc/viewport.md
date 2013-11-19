手机屏幕的宽度到底多大？
---

对于准备做无线web开发的同学来说，这会是困扰我们的第一个问题。
比如，我们看到iphone5s的参数介绍里写着 **主屏分辨率: 1136x640像素** ，
这个分辨率足以显示全淘宝网首页，但是直接访问，我们根本肯不清里面的内容。

有些同学看过资料，知道加上下面这句，手机上看网页内容会变得正常

```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
```

那么这个设置到底做了哪些事情？
其实相关的介绍非常多，你只要搜索viewport这个关键字，能找出一堆文章。
不过因为涉及到的概念很多，需要很有耐心才能彻底理解。

下面，我按照我的理解，看看能不能快速让大家消除这个疑问。


-----------------------------------------





http://www.wheattime.com/mobile-project-summary.html
http://www.web-tinker.com/article/20136.html
http://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/
http://weizhifeng.net/a-pixel-is-not.html
http://www.cnblogs.com/iliveido/archive/2013/03/11/2954176.html
