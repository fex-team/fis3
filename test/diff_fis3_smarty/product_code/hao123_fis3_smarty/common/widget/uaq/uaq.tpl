
	<script>
		<%if isset($uaq)%>
		conf.uaq = {
			uaqTaskID: "<%$uaq.taskId%>",
			sendProbability: "<%$uaq.probility%>"
		};
		<%/if%>
	</script>
	<script type="text/javascript" src="/static/common/js/js_speed.min.js"></script>
