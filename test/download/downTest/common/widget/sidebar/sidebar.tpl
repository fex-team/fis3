<a id="btn-navbar" class="btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
</a>
{%widget name="common:widget/nav/nav.tpl"%}
{%script%}
    $('.btn-navbar').click(function() {
        require.async('./sidebar.async.js', function(sidebar){
            sidebar.run();
        });
    });
{%/script%}