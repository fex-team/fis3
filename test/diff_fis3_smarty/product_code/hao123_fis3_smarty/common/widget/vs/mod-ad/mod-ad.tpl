<%*
author : Wang,Wei(Int'l PM)<wangwei33@baidu.com>

logmod:广告模块id
classname:广告模块自定义class
modtype:广告切换类型intervalOrder  顺序 intervalRandom 随机 默认intervalOrder
time:广告切换时间 默认3000

list:广告数组
    type:必须！img,flash,text 暂时只有img flash
    href:必须！
    src:图片链接必须有
    title:文字链接必须有
*%>
<%if isset($list)%>
    <div <%if isset($list.logmod)%>log-mod="<%$list.logmod%>"<%/if%>
         class="adlist-mod <%$list.classname|default:''%>"
            <%if !empty($list.time)%>data-time="<%$list.time%>"<%/if%>
            <%if !empty($list.modtype)%>data-type="<%$list.modtype%>"<%/if%>>
        <%foreach $list.list as $value%>
            <%assign var='addtype' value=$value.type|default:'img'%>
            <a log-oid="<%$value.offerId%>"
               <%if !empty($value.id)%>id="<%$value.id%>"<%/if%>
               href="<%$value.href%>"
               style="display:<%if $value@first%>block<%else%>none<%/if%>">
                <%if $addtype === "img"%>
                    <img src="<%$value.src%>"
                         <%if !empty($list.width)%>width="<%$list.width%>"<%/if%>
                            <%if !empty($list.height)%>height="<%$list.height%>"<%/if%>>
                <%elseif $addtype === "flash"%>
                    <object data-action-type="game-play" width="<%$list.width%>" height="<%$list.height%>"
                            classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                            codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#4,0,0,0">
                        <param name="src" value="<%$value.src%>"/>
                        <param name="wmode" value="transparent">
                        <param name="quality" value="high"/>
                        <embed src="<%$value.src%>"
                               type="application/x-shockwave-flash" width="<%$list.width%>" height="<%$list.height%>"
                               quality="high"
                               wmode="transparent"
                               pluginspage="http://www.macromedia.com/go/getflashplayer"></embed>
                    </object>
                <%else%>
                    <%$value.title%>
                <%/if%>
            </a>
        <%/foreach%>
    </div>
    <%require name="common:widget/vs/mod-ad/mod-ad.js"%>
<%/if%>