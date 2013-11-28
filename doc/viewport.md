手机屏幕的宽度到底多大？
---

对于准备做无线web开发的同学来说，这会是困扰我们的第一个问题。
比如，我们看到iphone5s的参数介绍里写着 **主屏分辨率: 1136x640像素** ，
这个分辨率能赶上很多PC机19寸显示器的分辨率了，但是按照这个分辨率来布局显然不行

有些同学看过资料，知道加上下面这句，手机上看网页内容会变得正常

```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
```

那么这个设置到底做了哪些事情？
其实相关的介绍非常多，你只要搜索viewport这个关键字，能找出一堆文章。
不过因为涉及到的概念很多，需要很有耐心才能彻底理解。

下面，我按照我的理解，看看能不能快速让大家消除这个疑问。

-----------------------------------------

需要了解个几个概念：


### 设备分辨率 （Device Resolution）

我们通常说的显示器的分辨率就是指设备分辨率，这个分辨率是指每英寸的面积上可产生的像素点，分辨率越高代表可以将画面显示得更精细。

*度量单位 PPI（pixels per inch）*
假设显示器的屏幕大小为14英寸，即对角线长度为14英寸，且纵横比为3:4，则水平方向长度为14*(4/5)=11.2英寸，从而显示分辨率1024/11.2 = 91.4 PPI。

*关于设备分辨率*
-  可以通过screen.width/screen.height来查看设备的分辨率。
-  设备的分辨率是固定的，与你是否缩放浏览器无关。
-  手机的设备分辨率，与我们写页面布局，几乎没有什么关系。
-  某些场景下设备分辨率又被称为“设备像素”，下面还有一个关于“CSS像素”的概念


### 屏幕尺寸
屏幕尺寸其实就是指设备的分辨率，它们的尺寸是以设备像素来进行度量的，因为它们永远不会变：它们是显示器的属性，而不是浏览器的。


###  visual viewport  & layout viewport

**visual viewport (可视窗口)**
-  不进行页面缩放的情况下, visual viewport ==  layout viewport 。 这时候内容几乎看不清楚的，试想一下13寸笔记本的屏幕1024*768的分辨率下的内容缩小到5寸手机屏幕1024*768的下的感觉。
-  页面放大后，visual viewport会成倍减下。比如我们设置《meta name="viewport" content="initial-scale=2"》后，原来 visual viewport/2

**layout viewport (布局窗口)**

-  layout viewport取决于不同的设备、不同的浏览器的设置。
-  放大缩小浏览器， layout viewport 不会改变
-  layout viewport可设置，《meta name="viewport" content="width=555"》





http://www.wheattime.com/mobile-project-summary.html
http://www.web-tinker.com/article/20136.html
http://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/
http://weizhifeng.net/a-pixel-is-not.html
http://www.cnblogs.com/iliveido/archive/2013/03/11/2954176.html


http://blog.jobbole.com/44319/#jtss-tsina
http://zhaoyuhao.com/notes/show/199