#!/usr/bin/env python
# -*- encoding:utf-8 -*-
"""
upload外壳脚本
Created on 2014-1-27
@author: wangtaize@baidu.com
@copyright: www.baidu.com
"""
import logging
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import urllib
import urllib2
import zipfile


# 用户目录
USER_FOLDER = os.path.expanduser('~')

# 更新接口
UPDATE_HTTP_HOST = "http://fatcat.baidu.com/ota/update"
# 更新接口
VERSION_HTTP_HOST = "http://fatcat.baidu.com/ota/version"
# module save path
MODULE_ROOT_PATH = os.sep.join([USER_FOLDER, ".cooder"])
if not os.path.exists(MODULE_ROOT_PATH):
    os.mkdir(MODULE_ROOT_PATH)
VERSION_FILE = os.sep.join([MODULE_ROOT_PATH, "version.txt"])
USE_SHELL = sys.platform.startswith("win")


def run_shell_with_returncode(command, universal_newlines=True,
                              useshell=None, env=None):
    """执行本地系统命令函数

    args:
        command: 执行命令list
        universal_newlines,
        useshell
        env: 环境变量
    return:
        returncode: 进程退出状态码
        output: 标准输出
        errout: 错误输出
    """
    useshell = USE_SHELL
    env = env or os.environ
    try:
        p = subprocess.Popen(command,
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE,
                             shell=useshell,
                             universal_newlines=universal_newlines,
                             env=env)
        output, errout = p.communicate()
        return p.returncode, output, errout
    except Exception as e:
        return -1, None, str(e)


class HttpService(object):
    """http工具类，支持get post 以及上传文件
    """
    def __init__(self, logger=None):
        self.logger = logger or logging.getLogger(__name__)

    def post(self, url, params):
        """post method 函数

        args:
            url: 请求的url
            parame: 请求参数，支持dict以及tuple
        return:
            content: 返回的文本内容
            status: 请求成功与否
        """
        return self.__service(url, params)

    def get(self, url):
        """get method 函数

        args:
            url: 请求的url
        return:
            content: 返回的文本内容
            status: 请求成功与否
        """
        return self.__service(url)

    def __service(self, url, params=None, timeout=50):
        old_timeout = socket.getdefaulttimeout()
        socket.setdefaulttimeout(timeout)
        try:
            # POST
            if params:
                self.logger.debug('post %s params[%s]' % (url, params))
                request = urllib2.Request(url, urllib.urlencode(params))
            # GET
            else:
                self.logger.debug('get %s params[%s]' % (url, params))
                request = urllib2.Request(url)
            request.add_header('Accept-Language', 'zh-cn')
            response = urllib2.urlopen(request)
            content = response.read()
            response.close()
            self.logger.debug('content->%s, code->%d'
                              % (content, response.code))
            if response.code == 200:
                return content, True
            return content, False
        except Exception as ex:
            return str(ex), False
        finally:
            socket.setdefaulttimeout(old_timeout)


class ImportModuleException(Exception):
    """导入模块异常
    """
    pass


class CheckVersionException(Exception):
    """检查模块版本异常
    """
    pass


class PythonVersionException(Exception):
    """检查python版本不符合运行要求异常
    """
    pass


class DownloadModuleException(Exception):
    """下载模块失败异常
    """
    pass


class UploadManager(object):
    """upload 模块更新管家
    """
    def __init__(self, http_service):
        self.http_service = http_service

    def need_update(self, version_file_path, version_url):
        """检查是否需要更新模块

        args:
            version_file_path: 本地存放version.txt位置
            version_url
        return:
            need_update: False|True, 是否需要更新
            change_list: 更新列表
        exception:
            CheckVersionException: 获取更新状态失败时抛出
        """
        if not os.path.exists(version_file_path):
            raise CheckVersionException("version file(%s) does not exist"
                                        % VERSION_FILE)
        fd = open(version_file_path, "rb")
        content_str = fd.readline()
        fd.close()
        content_old = eval(content_str)
        response_content_str, status = self.http_service.get(version_url)
        if not status:
            raise CheckVersionException("fail to fetch the lastest version")
        response_content = eval(response_content_str)
        if response_content['status'] != 1:
            raise CheckVersionException("fail to fetch the lastest version")
        content_new = response_content['data']
        if content_old["function_version"] == content_new["function_version"]\
                and content_old["bug_version"] == content_new["bug_version"]:
            return False, None
        return True, content_new['change_list']

    def update(self, module_path, update_url):
        """更新模块操作，先删除本地缓存的模块代码，再从服务端获取最新模块代码

        args:
            module_path: 本地模块代码存储路径
            update_url: 下载模块代码url
        """
        tmp_path = tempfile.mkdtemp()
        tmp_module_path = ".cooder"
        sb_tmp_module_path = os.sep.join([tmp_path, tmp_module_path])
        os.mkdir(sb_tmp_module_path)
        update_zip_path = self._download_module(update_url, sb_tmp_module_path)
        update_zip = zipfile.ZipFile(update_zip_path, 'r')
        update_zip.extractall(path=sb_tmp_module_path)
        update_zip.close()
        os.remove(update_zip_path)
        if os.path.exists(module_path):
            shutil.rmtree(module_path)
        shutil.copytree(sb_tmp_module_path, module_path)

    def _download_module(self, update_url,
                         save_path, file_name="update.zip"):
        """实际下载代码逻辑
        """
        response_content, status = self.http_service.get(update_url)
        if not status:
            raise DownloadModuleException("fail to download module,"
                                          " please try again :(")
        if save_path.endswith(os.sep):
            save_path = save_path[:-1]
        try:
            full_path = os.sep.join([save_path, file_name])
            fd = open(full_path, "wb")
            fd.write(response_content)
            fd.close()
            return full_path
        except:
            raise DownloadModuleException("fail to download module,"
                                          " please try again :(")

    def import_module(self, module_path):
        """导入模块，就模块路径加入到系统path, 注意添加方式
        args:
            module_path,模块代码路径
        exceptions:
            ImportModuleException,当出入路径不存在时抛出
        """
        if not os.path.exists(module_path):
            raise ImportModuleException("module(%s) does not exit"
                                        % module_path)
        sys.path = [module_path] + sys.path

    def has_cached_module(self, version_file_path):
        """检查本地是否有缓存的模块代码
        """
        if os.path.exists(version_file_path):
            return True
        return False

    def check_py_version(self):
        """检查本地python版本
        """
        version = sys.version
        if version and version.startswith("2.7"):
            return
        raise PythonVersionException("upload needs python with version 2.7"
                                     " as it's runtime :(")


if __name__ == "__main__":
    http_service = HttpService()
    upload_manager = UploadManager(http_service)
    try:
        upload_manager.check_py_version()
        if not upload_manager.has_cached_module(VERSION_FILE):
            print "initializing ... :~"
            upload_manager.update(MODULE_ROOT_PATH, UPDATE_HTTP_HOST)
        else:
            change_list = []
            try:
                need_update, change_list = upload_manager.need_update(
                    VERSION_FILE, VERSION_HTTP_HOST)
            except CheckVersionException as _:
                need_update = False
            if need_update:
                print "updating ... :~"
                upload_manager.update(MODULE_ROOT_PATH, UPDATE_HTTP_HOST)
                print "upload has following updates:"
                for index, change in enumerate(change_list):
                    print "%d.%s" % (index + 1, change)
        upload_manager.import_module(MODULE_ROOT_PATH)
        from client import main as MAIN
        MAIN.main()
    except KeyboardInterrupt:
        sys.exit(-1)
    except Exception as ex:
        print str(ex)
