# @ue/postmessage

基于 PostMessage 功能进行扩展


## 安装

```
npm install @ue/message
```


```
import PostMessage, { type Result } from "@ue/messpostmessageage";

const postMessage = new PostMessage();

// 准备完毕
postMessage.ready();

// 监听 hello 事件
postMessage.on("hello", function(res: Result) {
  console.log(res.value); // world
});
```


```
import PostMessage, { type Result } from "@ue/postmessage";

const postMessage = new PostMessage();
postMessage.ready();

postMessage.send("hello", "world");
```