# fis-plus-server-framework

server-framework of fis-plus

## install

- from fisp 

    ```bash
    fisp server install server-env
    ```

- from GitHub

    ```bash
    git clone git@github.com:fis-dev/fis-plus-server-framework.git
    cd fis-plus-server-framework
    git submodule init
    git submodule update

    cp * ~/.fis-plus-tmp/www/

    ```
    @TODO fis server --prefix

## config

- config file: smarty.conf

```ini
left_delimiter="{%"
right_delimiter="%}"

encoding="gbk"
```
