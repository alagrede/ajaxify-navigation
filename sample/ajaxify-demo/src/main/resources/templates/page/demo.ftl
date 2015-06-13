<#import "/spring.ftl" as spring>

<@layout.extends name="layout/base.ftl">

	<#-- Title -->
   	<@layout.put block="title" type="replace">
       <title>Demo page</title>
    </@layout.put>

	<#-- Head -->
    <@layout.put block="head" type="append">
	</@layout.put>

	<#-- Content -->
	<@layout.put block="contents">
		<h1 class="text-center">Ajaxify Demo</h1>
		
		<p> Use <span class="label label-success">Ctrl+Shift+Flèche</span> for navigate in tabs</p>		
		
		<ul>
			<li><a href="<@spring.url '/list' />">Open page</a></li>
			<li><a id="test" class="noAjax" href="#">Same opening with javascript</a></li>
			<li><a class="tab" href="<@spring.url '/list' />">Open page in tab</a></li>
			<li><a href="<@spring.url '/popup' />">Open page in popup</a></li>
		</ul>
		
	
		<#-- Inline script -->
		<script type="text/javascript">
			$(function(){
				// Redirection JS via ajaxify
	            $("#test").click(function(e){
	                $.ajaxifier.loadFromServer("<@spring.url '/list' />", false);
	            });
        	});
		</script>
		
		
	</@layout.put>
	
	
</@layout.extends>