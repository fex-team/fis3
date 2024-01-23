<?php

$github = 'https://github.com/fis-dev/fis/';
$github_wiki = $github . 'wiki/';
$fis_data = array(
    'title' => 'F.I.S - 前端集成解决方案',
    'description' => '适用于所有大中小企业的前端集成解决方案，为前端团体提供前端性能优化、静态资源管理、编译工具等技术基础，实现前端生产工业化。',
    'github' => $github,
    'docs' => array(
        array(
            'title' => '什么是F.I.S',
            'doc' => 'intro',
            'icon' => 'leaf',
            'wiki' => $github_wiki . '什么是F.I.S'
        ),
        array(
            'title' => '初识F.I.S',
            'doc' => 'quickstart',
            'icon' => 'eye-open',
            'wiki' => $github_wiki . '快速上手'
        ),
        array(
            'title' => '三条开发命令',
            'doc' => 'commands',
            'icon' => 'fire',
            'wiki' => $github_wiki . '快速上手#-1'
        ),
        array(
            'title' => '三种语言能力',
            'doc' => 'extlang',
            'icon' => 'gift',
            'wiki' => $github_wiki . '三种语言能力'
        ),
        array(
            'title' => '静态资源管理',
            'doc' => 'srms',
            'icon' => 'magnet',
            'wiki' => $github_wiki . '基于map.json的前后端架构设计指导'
        ),
        array(
            'title' => '前端资源聚合',
            'doc' => 'integrated',
            'icon' => 'inbox',
            'wiki' => $github_wiki . '基于map.json的前后端架构设计指导'
        ),
        array(
            'title' => '小示例',
            'doc' => 'demo',
            'icon' => 'tint',
            'wiki' => $github_wiki . 'fis官网项目'
        )
    )
);