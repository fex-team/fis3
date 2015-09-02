<div class="s-mbs rate-f0">
	<label for="rateFrom"><%$body.rate.calculator.from.label%>:</label>
	<select id="rateFrom"<%if !empty($body.rate.calculator.from.width)%> style="width:<%$body.rate.calculator.from.width%>px"<%/if%>>
		<%foreach $body.rate.type as $value%>
			<option value="<%$value.id%>"><%$value.name%></option>
		<%/foreach%>
	</select>
</div>
<div class="s-mbs rate-f0">
	<label for="rateTo"><%$body.rate.calculator.to.label%>:</label>
	<select id="rateTo"<%if !empty($body.rate.calculator.to.width)%> style="width:<%$body.rate.calculator.to.width%>px"<%/if%>>
		<%foreach $body.rate.type as $value%>
		<option value="<%$value.id%>"><%$value.name%></option>
		<%/foreach%>
	</select>
</div>
<div class="rate-input">
	<label><%$body.rate.calculator.amount.label%>:</label>
	<span class="rate-amount-wrapper"<%if !empty($body.rate.calculator.amount.width)%> style="width:<%$body.rate.calculator.amount.width%>px"<%/if%>>
		<input type="text" class="rate-amount" autocomplete="off"/>
	</span>
	<span class="rate-placeholder"><span class="rate-placeholder-1">0</span><span class="rate-placeholder-2">.00</span></span>
</div>
<button class="rate-search gradient-bg-green round-corner-s" type="button"><%$body.rate.calculator.button%></button>
<div class="rate-result">
	<%*if $head.dir == "ltr"%>
	<span class="rate-result-from">1EGP</span> = <strong class="rate-result-to">0.2376USD</strong>
	<%else%>
	<strong class="rate-result-to">0.2376USD</strong> = <span class="rate-result-from">1EGP</span>
	<%/if*%>
</div>
