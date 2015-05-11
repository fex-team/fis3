{%function name="section" index=0 data=null%}
<section class="section">
    <div class="container-fluid">
        <div class="row-fluid title" id="section-{%$index%}">
            <h2>{%$data.title%}</h2>
        </div>
        <div class="row-fluid content">
            {%widget name="home:widget/section/docs/`$data.doc`.tpl"%}
            <a href="{%$data.wiki%}" target="_blank" class="btn btn-primary pull-right">
                了解更多
                <i class="icon-circle-arrow-right icon-white"></i>
            </a>
        </div>
    </div>
</section>
{%/function%}
