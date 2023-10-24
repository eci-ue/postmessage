# @js-lion/message

基于 PostMessage 功能进行扩展


## 安装

```
npm install @js-lion/message
```


```
import Message, { type Result } from "@js-lion/message";

const message = new Message();

// 准备完毕
message.ready();

// 监听 hello 事件
message.on("hello", function(res: Result) {
  console.log(res.value); // world
});
```


```
import Message, { type Result } from "@js-lion/message";

const message = new Message();
message.ready();

message.send("hello", "world");
```