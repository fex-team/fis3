# Mock 假数据模拟

当后端开发人员还没有准备好后端接口时，为了能让前端项目开发继续进行下去，往往需要提供`假数据`来协助前端开发。

fis 中默认的 node 服务就支持此功能。

## 步骤

1. 准备好假数据文件，如 sample.json 文件，放在服务器的 `/test/sample.json` 目录，确保通过 `http://127.0.0.1:8080/test/sample.json` 可访问到。

  ```json
  {
    "error": 0,
    "message": "ok",
    "data": {
      "uname": "foo",
      "uid": 1
    }
  }
  ```
2. 准备一个 `server.conf` 配置文件，放在服务器目录的 `/config/server.conf`，内容如下。

  ```
  rewrite ^\/api\/user$ /test/sample.json
  ```
3. 然后当你请求 `http://127.0.0.1:8080/api/user` 的时候，返回的就是 sample.json 中的内容。

## 说明

关于 server.conf 配置语法，格式如下：

```
指令名称 正则规则 目标文件
```

* `指令名称` 支持 `rewrite` 和 `redirect`。
* `正则规则` 用来命中需要作假的请求路径。
* `目标文件` 设置转发的目标地址，需要配置一个可请求的 url 地址。

刚说的是把文件放在服务器目录，操作起来其实并不是很方便，这类假数据文件建议放在项目源码中，然后通过 fis3 release 伴随源码一起发布到调试服务器。

推荐以下存放规范。

```
└── test
    ├── sample.json
    └── server.conf
```

然后配置 fis-conf.js, 保证产出到服务端的路径是正确的。

```js
fis.match('/test/**', {
  release: '$0'
});

fis.match('/test/server.conf', {
  release: '/config/server.conf'
});
```

## 动态假数据

静态的假数据可以通过 json 文件提供，那么动态数据怎么提供？node 服务器可以通过 js 的方式提供动态家数据。

/test/dynamic.js

```js
module.exports = function(req, res, next) {

  res.write('Hello world ');

  // set custom header.
  // res.setHeader('xxxx', 'xxx');

  res.end('The time is ' + Date.now());
};
```

然后结合 server.conf 就可以模拟各种动态请求了。

```
rewrite ^\/api\/dynamic\/time$ /test/dynamic.js
```

如上面的例子，当请求 `http://127.0.0.1:8080/api/dynamic/time` 时，返回：`Hello world The time is 1442556037130`
