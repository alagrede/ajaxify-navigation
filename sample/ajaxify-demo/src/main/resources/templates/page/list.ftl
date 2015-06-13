<@layout.extends name="layout/base.ftl">

	<#-- Title -->
   	<@layout.put block="title" type="replace">
       <title>List</title>
    </@layout.put>

	<#-- Head -->
    <@layout.put block="head" type="append">
	</@layout.put>

	<#-- Content -->
	<@layout.put block="contents">
		<h1 class="text-center">List</h1>
		
		<div class="alert alert-info">Use the browser <b>Back</b> button</div>
		
		<ul class="contactsList">
			<#list contacts as contact>
			<li>${contact}</li>
			</#list>
		</ul>
		
	</@layout.put>
	
	
</@layout.extends>