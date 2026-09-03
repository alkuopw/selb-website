# 安卓开发-1
## 从配对到ADB连接

> 学kotlin我是一开始就打算实战的，虽然Android Studio可以创建虚拟设备，但我觉得有一个真机来调试更能让我放心，只是这样。<br>我后来又尝试了usb调试，但是没成功，最后在gpt帮助下成功实现无线调试。

### 手机操作
手机切换到开发者模式。一般是设置里版本号连续点击7次启用<br>再打开无线调试。点击用配对码配对，这时候手机会显示WLAN配对码和IP地址端口。不要让手机息屏，这些信息要用。

### 电脑操作
windows搜索power shell，打开窗口。输入：<br>
```
cd "$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```
再输入：<br>
```
.\adb.exe pair 192.168.x.xx:XXXX
```
（填写你手机上的IP地址和端口号，需要输入配对码）
如果看到配对成功再：
```
.\adb.exe connect 192.168.x.xx:xxxx
```
（还是换成你的， **注意这次地址端口号和上次会不一样，填写手机无线调试页面显示的，而不是之前配对码窗口显示的** ）<br>
接下来：
```
.\adb.exe devices
```
如果输出：<br>
List of devices attached<br>
192.168.3.xx.xxxx      device<br><br>
那么再看到你Android Studio 的Device manager页面，会出现你的真机了。<br><br>
如果提示目标计算机拒绝，那么手机关闭无线调试，再开启，从头连贯再操作一遍。




