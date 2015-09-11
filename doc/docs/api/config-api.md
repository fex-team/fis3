fis3 通过配置来决定代码、资源该如何处理，包括配置、压缩、CDN、合并等；

## 配置API

### fis.set()

设置一些配置，如系统内置属性 `project`、`namespace`、`modules`、`settings`。
`fis.set` 设置的值通过[fis.get()](#fisget)获取

**语法**

> fis.set(key, value)

**参数**

- key
        
    任意字符串，但系统占用了 `project`、`namespace`、`modules`、`settings` 它们在系统中有特殊含义，[详见](#全局属性)

    **当字符串以 `.` 分割的，`.`字符后的字符将会是字符前字符同名对象的健**

- value

    任意变量

```js
fis.set('namespace', 'home');
fis.set('my project namespace', 'common');
fis.set('a.b.c', 'some value'); // fis.get('a') => {b: {c: 'some value'}}
```

### fis.get()

获取已经配置的属性，和 [fis.set()](#fisset) 成对使用

**语法**
> fis.get(key)

**参数**

- key
    任意字符串

```js
// fis.set('namespace', 'common')
var ns = fis.get('namespace');

// fis.set('a.b.c', 'd')
fis.get('a'); // => {b:{c: 'd'}}
fis.get('a.b'); // => {c:'d'}
fis.get('a.b.c'); // => 'd'
```

### fis.match()
给匹配到的文件分配属性，[文件属性][]决定了这个文件进行怎么样的操作；

`fis.match` 模拟一个类似 css 的覆盖规则，负责给文件**分配**规则属性，这些规则属性决定了这个文件将会被如何处理；

就像 css 的规则一样，后面分配到的规则会覆盖前面的；如

```js
fis.match('{a,b}.js', {
    release: '/static/$0'
});

fis.match('b.js', {
    release: '/static/new/$0'
});
```
b.js 最终分配到的规则属性是

```js
{
    release: '/static/new/$0'
}
```
那么 b.js 将会产出到 `/static/new` 目录下；

**语法**
> fis.match(selector, props[, important])

**参数**
- selector

    [glob][] 或者是任意正则

- props
    
    [文件属性][]

- important
    
    bool 设置了这个属性为 true，即表示设置的规则无法被覆盖；具体行为可参考 [css !important](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

```js
fis.match('*.js', {
  useHash: true,
  release: '/static/$0'
});
```

### fis.media()

[fis.media](#fismedia) 是模仿自 css 的 `@media`，表示不同的状态。这是 fis3 中的一个重要概念，其意味着有多份配置，每一份配置都可以让 fis3 进行不同的编译；

比如开发时和上线时的配置不同，比如部署测试机时测试机器目录不同，比如测试环境和线上机器的静态资源 domain 不同，一切这些不同都可以设定特定的 `fis.media` 来搞定；

**语法**

> fis.media(mode)

**参数**

- mode

    `string` mode，设定不同状态，比如 `rd`、`qa`、`dev`、`production`

**返回值**

    `fis` 对象

```js
fis.media('dev').match('*.js', {
    optimizer: null
});

fis.media('rd').match('*.js', {
  domain: 'http://rd-host/static/cdn'
});
```

### fis.plugin() 

插件调用接口

**语法**

fis.plugin(name [, props [, position]])

**属性**
- name
    
    插件名，插件名需要特殊说明一下，fis3 固定了插件扩展点，每一个插件都有个类型，体现在插件发布的 npm 包名字上；比如
    `fis-parser-less` 插件，`parser`指的是在 `parser` 扩展点做了个解析 `.less` 的插件。

    那么设置插件的时候，插件名 `less`，比如设置一个 parser 类型的插件是这么设置的；

    ```js
    fis.match('*.less', {
        parser: fis.plugin('less', {}) //属性 parser 表示了插件的类型
    })
    ```

- props

    对象，给插件设置用户属性

  ```js
  fis.match('*.less', {
     parser: fis.plugin('less', {});
  });
  ```
- position
  
    设置插件位置，如果目标文件已经设置了某插件，默认再次设置会覆盖掉。如果希望在已设插件执行之前插入或者之后插入，请传入 `prepend` 或者 `append`
  
  ```js
  fis.match('*.less', {
     parser: fis.plugin('another', null, 'append');
  });
  ```

[文件属性]: ./config-props.md#文件属性
[glob]: ./config-glob.md
