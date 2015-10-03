## 安装

> 本文档展示命令，如果是 Windows 请打开 cmd 输入命令执行，如果是类 Unix 系统，请打开任意终端输入命令执行。

### 安装 Node 和 NPM

详细过程参考官网 https://nodejs.org

> Node **版本要求** 0.8.x，0.10.x, 0.12.x，不在此列表中的版本不予支持。最新版本 node 支持会第一时间跟进，支持后更新支持列表。

- Ubuntu 用户使用 `apt-get` 安装 node 后，安装的程序名叫 `nodejs`，需要软链成 `node`
- Windows 用户安装完成后需要在 CMD 下确认是否能执行 node 和 npm

### 安装 FIS3

```bash
npm install -g fis3
```

- `-g` 安装到全局目录，必须使用全局安装，当全局安装后才能在命令行（cmd或者终端）找到 `fis3` 命令
- 安装过程中遇到问题具体请参考 [fis#565](https://github.com/fex-team/fis/issues/565) 解决
- 如果已经安装了 [FIS](https://github.com/fex-team/fis)，也执行上面的命令进行安装，FIS3 和 FIS 是不同的构建工具，向下无法完全兼容。如果要从 FIS 迁移到 FIS3，请参考文档 [FIS 升级 FIS3](../fis2-to-fis3.md) 

安装完成后执行 `fis3 -v` 判断是否安装成功，如果安装；

```
$ fis3 -v

 [INFO] Currently running fis3 (/Users/Your/Dev/fis3/dev/fis3)

  v3.0.0

   /\\\\\\\\\\\\\\\  /\\\\\\\\\\\     /\\\\\\\\\\\
   \/\\\///////////  \/////\\\///    /\\\/////////\\\
    \/\\\                 \/\\\      \//\\\      \///
     \/\\\\\\\\\\\         \/\\\       \////\\\
      \/\\\///////          \/\\\          \////\\\
       \/\\\                 \/\\\             \////\\\
        \/\\\                 \/\\\      /\\\      \//\\\
         \/\\\              /\\\\\\\\\\\ \///\\\\\\\\\\\/
          \///              \///////////    \///////////
```

如果提示找不到 `fis3` 命令并且 **npm** 安装成功推出，请参考文档 [fis#565](https://github.com/fex-team/fis/issues/565) 解决

### 升级 FIS3

```bash
npm update -g fis3
```
或重装

```bash
npm install -g fis3
```
