# @ue/postmessage

基于 PostMessage 功能进行扩展


## 安装

```
npm install @ue/postmessage
```

##### 主页面
```
import PostMessage, { type Result } from "@ue/postmessage";

const postMessage = new PostMessage();
// 监听 hello 事件
postMessage.on("hello", function(res: Result) {
  console.log(res.value); // world
});

// 准备完毕 ready 尽可能的保证在 on 事件以后
postMessage.ready();
```


##### iframe
```
import PostMessage, { type Result } from "@ue/postmessage";

const postMessage = new PostMessage();

postMessage.ready();

postMessage.send("hello", "world");
```