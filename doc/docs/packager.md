## 合并优化

合并关键资源（js & css）能有效的优化网页呈现。

FIS3 中可以方便的对文件进行合并。

```
fis.match('*.js', {
  toPack: '/static/aio.js'
});

fis.match('*.{css,less}', {
  toPack: '/static/aio.css'
});
```