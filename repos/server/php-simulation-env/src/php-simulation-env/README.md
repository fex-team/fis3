# php-simulation-env
Simulation env for fis-plus

## global constant

- `ROOT`

    ```php
    define('ROOT', dirname(__DIR__));
    ```

- `WWW_ROOT` web document root path

    ```php
    define('WWW_ROOT', dirname(__DIR__));
    ```

## Component

all component depends on `log`, except itself

so, use one before init `log`

```php
require(ROOT . '/log/Log.class.php');
Log::getLogger(array(
    'fd' => '<to log file>',
    'level' => Log::ALL
));
```

### `log`

```php
require(ROOT . '/log/Log.class.php');
Log::getLogger(array(
    'fd' => '<to log file>',
    'level' => Log::ALL
));
```

Options:

- `fd` given a log file path
- `level` it same the level of `error_reporting` in PHP
    - `Log::ALL`  all log
    - `Log::DEBUG` debug
    - `Log::INFO`  info
    - `Log::WARN`  warning
    - `Log::ERROR` error

    ```php
    array(
        'level' => Log::ALL & ~Log::DEBUG //not record debug log
    );
    ```

### `util`

- detail from source code

```php
require(ROOT . '/util/Util.class.php');

$string = "我爱我中华"

if (Util::isUtf8($string)) {
    echo 'utf8';
}
```

### `mock-data`

mock data

```php
require(ROOT . '/mock-data/Mock.class.php');
Mock::init('<data-dir>', '<encoding>');
$data = Mock::getData('<template-subpath>');
```

- `<data-dir>` the file of mock data root path
- `<encoding>` utf-8 or gbk or ...
- `<template-subpath>` the path of a template file relative to `template_dir`

Map:

|template file| data file|
|:-------------|:-------------|
|`<template_dir>`/home/page/index.tpl| `<data_dir>`/home/page/index.`{php|json}`|

### `mimetype`

some mimetype

```php
// read the code

$MIME = require(ROOT . '/mimetype/mimetype.php');

```

### `rewrite`

```php
require(ROOT . '/rewrite/Rewrite.class.php');
$rewrite = new Rewrite('<config-base-dir>', '<charset>');

// nice, all static mapping to a dir

$rewrite->addRule(new Rule(Rule::REWRITE, '@/static/.*@', 'public/$&'));

// match from top to bottom
$rewrite->addConfigFile('home-server.conf');
$rewrite->addConfigFile('common-server.conf');

// dispatch
$rewrite->dispatch($_SERVER['REQUEST_URI']);
```

Add special process handle:

```php

class TplRewirteHandle implements RewriteHandle {
    private $_smarty = null;

    public function __construct($smarty) {
        $this->_smarty = $smarty;
    }

    public function process($file) {
        $this->_smarty->assign(Mock::getData($file));
        $this->_smarty->display($file);
    }
}

$rewrite->addRewriteHandle('tpl', new TplRewirteHandle($smarty));

```

- `<config-base-dir>` config files are placed in the dir
- `<charset>` header charset
- config file format

    ```config
    # <type> <reg> <target>
    rewrite     \/ajax\/(.*)    test/ajax/$1.php
    redirect    \/?$            /home/page/index
    ```
    - rewrite target file relative to `WWW_ROOT`

---

## task roadmap

- [x] Update to `fis-plus`
- [ ] Add it to some framework, such as `thinkphp`, `yii`, `laveral`
