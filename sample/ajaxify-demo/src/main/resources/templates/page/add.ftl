<#import "/spring.ftl" as spring>
<#import "/macro/static_macro.ftl" as static>

<@layout.extends name="layout/base.ftl">

	<#-- Title -->
   	<@layout.put block="title" type="replace">
       <title>Add</title>
    </@layout.put>

	<#-- Head -->
    <@layout.put block="head" type="append">
    	<#-- dynamic inclusion -->
    	<link href="<@static.css 'datepicker/datepicker3.css' />" rel="stylesheet">
    	<script type="text/javascript" src="<@static.js 'datepicker/bootstrap-datepicker.js' />"></script>
	</@layout.put>

	<#-- Content -->
	<@layout.put block="contents">
		<h1 class="text-center">Add</h1>
		
			<#if notif??>
				<div class="alert alert-success">The page "List" was refreshed automatically if it is open</div>
			<#else>
				<div class="alert alert-info">Here datepicker (CSS and JS) has been dynamicaly loaded</div>
			</#if>
			
			<#-- Form example -->
			<form action="<@spring.url '/add' />" method="post" class="form-inline" tab-refresh="/list#.contactsList">
				<input id="date" name="date" type="text" class='form-control' data-date-format='dd/mm/yyyy' placeholder='dd/mm/yyyy'>
				<input id="name" name="name" type="text" class='form-control'>
				<input type="submit" class='btn btn-primary'>
			</form>

			<br/>
			
			<ul>
				<#list contacts as contact>
				<li>${contact}</li>
				</#list>
			</ul>


			<!-- Gestion correcte des redirections -->
			<a href="<@spring.url '/redirect' />">Redirection serveur à l'accueil</a>
			

			<#-- Inline script -->
			<script type="text/javascript">
				$(function(){
			         $.fn.datepicker.defaults.format = "dd/mm/yyyy";
			         $("#date").datepicker({
			             dateFormat: "dd/mm/yyyy",
			             autoclose: true,
			             todayBtn: true,
			             todayHighlight: true
			         });
				});
			</script>
		
	</@layout.put>
	
	
</@layout.extends>