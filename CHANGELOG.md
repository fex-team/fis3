
## 3.2.0 / Fri Aug 28 2015
- 升级 fis3-packager-map 支持从配置项中配置复杂的打包规则。
- domain 文件属性支持数组
- media 上下继承逻辑优化
- 解决 lint 重复报错的 bug
- 更新 fis3-command-release 修改 deploy 配置行为，让 deploy 遵循后面的覆盖前面的原则。关联 issues: #186
- 添加 hash 中间码，便于插件单纯获取 hash 值。
- 修复从内存中缓存的文件文件缓存数据丢失的 bug.
- 修复 sass 插件启用 sourcemap， map.json 包含无用字段的 bug.
- 修复match rules 里面有 function 类型的导致程序出错的 bug.
- 修复原始 match rules 被修改的 bug.
- 升级 fis3，去掉 useDomain 属性，给设置 domain 的资源自动启用domain

## 3.1.1 / Wed Aug 12 2015

- 升级 server 插件
  - 解决 root 不能修改的问题。
- 优化插件配置，去掉内部属性。详情：https://github.com/fex-team/fis3/issues/142

## 3.1 / Fri Aug 07 2015

- 升级 server 插件
  - 默认改成开启 node 插件
  - 输出远程访问 ip 地址
  - 内置 node server 而不是通过 npm install 获取，因为经常用人安装不下来。
- 解决内嵌导致的异步丢失 bug

## 3.0.20 / Thu Aug 06 2015

- 解决内嵌导致异步依赖丢失的 bug
- 升级 release 插件，解决 livereload 多个项目同时开启的问题。

## 3.0.18 / Tue Aug 04 2015

- 更新 map 插件，支持 packOrder
- 去掉诡异的打包排序功能，换成插件配置项中处理。
- 优化 `fis.match('!xxx')` 取反用法，去掉命中特殊选择器的功能。
- 保存 map.json 信息到对应的文件属性上。

## 3.0.16 / Thu Jul 30 2015

- deploy 阶段，默认加上编码转换
- 添加 moduleId 中间码，表示获取目标文件的 moduleId
- bugfix [#88](https://github.com/fex-team/fis3/issues/88)

## 3.0.13 / Wed Jul 22 2015

- 通过镜像下载 fis-components 和 脚手架。

## 3.0.10 / Wed Jul 15 2015

- 解决 watch 时，同时多个文件修改导致多次 release 的问题。
- 解决 standard 流程不能关闭的 bug
- 升级 fis3-command-release

## 3.0.8 / Mon Jul 13 2015

- 更新 fis3-command-release 参数验证漏掉 f, file, r, root.
- 默认去掉 useHash: true


## 3.0.7 / Mon Jul 08 2015

- 修复同名依赖时，可能自己依赖自己的问题。

## 3.0.5 / Mon Jul 08 2015

- 更新 fis3-command-inspect
- 去掉修改 node env 代码

## 3.0.4 / Mon Jul 07 2015

- 更新 fis.uri，让其支持 fis id 查找。

## 3.0.2 / Mon Jul 06 2015

- 更新 fis3-command-release 到 1.2.0
    - 解决 watch 时，在缓存依赖中的文件，没有响应的问题。

## 3.0.1 / Mon Jul 06 2015

- 修改 ::pacakger => ::package

## 3.0.0 / Mon Jul 03 2015
