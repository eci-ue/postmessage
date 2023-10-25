/**
 * @file PostMessage
 * @author svon.me@gmail.com
 */

type Source = string | string[] | Function | RegExp | Array<string | RegExp | Function>;

/**
 * 判断消息来源是否安全
 * @param source 
 * @param origin 
 * @returns 
 */
const cors = function(source: Source, origin: string) {
  let status = false;
  if (source && source === "*") {
    status = true;
  } else if (source && Array.isArray(source)) {
    for (const item of source) {
      const value = cors(item, origin);
      if (value) {
        status = true;
        break;
      }
    }
  } else if (source && typeof source === "string") {
    if (origin && origin.includes(source)) {
      status = true;
    }
  } else if (source && source instanceof RegExp) {
    if (source.test(origin)) {
      status = true;
    }
  } else if (source && typeof source === "function") {
    status = source(origin);
  }
  return status;
}


const Ready = "__ready__";

interface Client {
  target?: MessageEventSource;
  origin?: string;
  href?: string;
}

export interface Result extends Client {
  event: string | Symbol;
  value: string | object | undefined;
}

export default class PostMessage {
  private clients: Client[] = [];
  private targetOrigin: string;
  private dom: HTMLInputElement = document.createElement("input");
  /**
   * 限制消息来源，默认为 *
   * @param source 
   * @param targetOrigin
   */
  constructor(source?: Source, targetOrigin: string = "*") {
    this.clients.push({
      target: window.parent,
      href: window.location.href,
      origin: window.location.origin,
    });
    this.targetOrigin = targetOrigin;

    this.init(source || "*");
    
    this.on(Ready, (data: Result) => {
      if (data && data.href && data.href !== window.location.href) {
        const client: Client = {
          target: data.target,
          href: data.href,
          origin: data.origin,
        };
        this.clients.push(client);
      }
    });
  }
  private init (source: Source) {
    const message = (e: MessageEvent) => {
      const origin = e.origin; // 对发送消息的窗口对象的引用
      const data = typeof e.data === "string" ? { value: e.data, href: origin } : e.data;    // 传递的数据
      const status = cors(source, origin);
      if (status) {
        const event: string | Symbol = data.event || "*";
        const value = data.value;
        const temp: Result = {
          event,
          value, 
          origin,
          href: data.href,
          target: e.source || void 0, 
        };
        this.receive(event, temp);
      }
    }
    window.addEventListener("message", message);
  }
  on(event: string | Symbol, callback: (value: Result) => void) {
    this.dom.addEventListener(event.toString(), function(e: Event) {
      // @ts-ignore
      const data: Result = e.detail;
      callback(data);
    });
  }
  private receive(event: string | Symbol = "*", value?: Result) {
    const e = new CustomEvent(event.toString(), {
      bubbles: true,
      cancelable: true,
      detail: value || {},
    });
    this.dom.dispatchEvent(e);
  }
  push (event: string | Symbol, value = "", origin: MessageEventSource | Client): boolean {
    // @ts-ignore
    if (origin && origin.postMessage) {
      const data = { 
        event: event, 
        value: value,
        href: window.location.href,
      };
      // @ts-ignore
      origin.postMessage(data, this.targetOrigin);
      return true;
    } 
    // @ts-ignore
    if (origin && origin.target) {
      // @ts-ignore
      return this.push(event, value, origin.target);
    }
    return false;
  }
  send (event: string | Symbol, value?: any, origin?: MessageEventSource | Client | Array<MessageEventSource | Client>) {
    if (origin && Array.isArray(origin)) {
      for (const item of origin) {
        this.push(event, value, item);
      }
    } else if (origin) {
      // @ts-ignore
      this.push(event, value, origin);
    }else {
      // 默认向所有对象发送消息
      for (const client of this.clients) {
        if (client.target) {
          this.push(event, value, client.target);
        }
      }
    }
  }
  ready() {
    this.send(Ready, void 0, window.parent);
  }
}
