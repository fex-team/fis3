<%require name="lv2:widget/prayer/rtl/rtl.css"%>
<div class="mod-muslim-prayer" id="muslimPrayer" log-mod="muslim-prayer">
    <div class="title-wrap">
        <i class="title-i"></i>
        <div class="title title-h"><%$body.prayer.bigTitle%></div>
        <div class="title title-s"><%$body.prayer.subTitle%></div>
    </div>
    <div class="download-wrap">
        <div class="scroll-wrap"></div>
        <div class="download-btn">
            <a class="download-link" href="<%$body.prayer.downloadUrl%>" data-sort="download"><%$body.prayer.downloadText%></a>
        </div>
    </div>
    <div class="interaction">
        <div class="vote">
            <div class="ina-title-wrap">
                <i class="ina-icon ina-i-vote"></i>
                <span class="ina-title"><%$body.prayer.voteTitle%><s class="ina-border ina-b-vote"></s></span>
            </div>
            <div class="ina-content">
                <ul class="vote-list">
                    <%foreach $body.prayer.voteList as $list%>
                    <li class="vote-item">
                        <i class="vote-radio"></i>
                        <span class="vote-des"><%$list.text%></span>
                    </li>
                    <%/foreach%>
                </ul>
                <div class="sub-btn vote-submit"><%$body.prayer.voteSubmit%></div>
            </div>
        </div>
        <div class="feedback">
            <div class="ina-title-wrap">
                <i class="ina-icon ina-i-feedback"></i>
                <span class="ina-title"><%$body.prayer.feedbackTitle%><s class="ina-border ina-b-feedback"></s></span>
            </div>
            <div class="ina-content">
                <form class="f-form" action="http://usertest.baidu.com/listen/api/addfeedback" method="post" accept-charset="" enctype="" target="_self">
                    <textarea class="textarea" name="description" maxlength="1000"></textarea>
                    <input class="email" name="extend_contact_email"  />
                    <input type="hidden" name="product_line" value="126" />
                    <input type="hidden" name="fr" value="http://<%$sysInfo.country%>.hao123.com/prayer/" />
                    <div class="tip tip-feed"><%$body.prayer.feedTip%></div>
                    <div class="tip tip-email"><%$body.prayer.emailTip%></div>
                </form>
                <div class="sub-btn feedback-submit"><%$body.prayer.feedbackSubmit%></div>
            </div>
        </div>
    </div>
</div>

<%script%>
conf.prayer = {
    bkimgs: <%json_encode( $body.prayer.bkImg )%>,
    autoScroll: "<%$body.prayer.autoScroll%>",
    autoDuration: "<%$body.prayer.autoDuration%>"
};

require.async('lv2:widget/prayer/prayer-async.js');
<%/script%>
