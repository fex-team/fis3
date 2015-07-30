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
