<nav id="nav" class="navigation" role="navigation">
    <ul>
        {%foreach $data as $doc%}
        <li class="active">
            <a href="#section-{%$doc@index%}">
                <i class="icon-{%$doc.icon%} icon-white"></i> <span>{%$doc.title%}</span>
            </a>
        </li>
        {%/foreach%}
    </ul>
</nav>