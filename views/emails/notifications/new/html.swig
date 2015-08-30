<!DOCTYPE html>
<html>
<head>
	<title>Monx</title>
</head>
<body>
{{subject}}
<br>
There is a new event update for service service.name
<br>

{%if event_body %}
Current status:
{% for item in event_body.message.listed %}
	{{ item.server }} with status 
	{{ item.status }}<br>
{% endfor %}
<br>
Event details:
{% for item in event_body.message.diff %}
	{% if item.action == 'added' %}
	  {{item.action}} to {{ item.server }}<br>
	{% endif %}
	{% if item.action == 'removed' %}
	  {{item.action}} from {{ item.server }}<br>
	{% endif %}
{% endfor %}
{% else %}
	Service status OK
{% endif %}
<br>
<br>
<br>
To find more:
<br>
 http://monx.zero1.al/services/{{service_id}}/events/{{event_id}}/
</body>
</html>