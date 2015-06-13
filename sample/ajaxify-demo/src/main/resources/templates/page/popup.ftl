<#import "/spring.ftl" as spring>
<@layout.extends name="layout/base.ftl">

	<#-- Title -->
   	<@layout.put block="title" type="replace">
       <title>Popup</title>
    </@layout.put>

	<#-- Head -->
    <@layout.put block="head" type="append">
    	<modal />
	</@layout.put>

	<#-- Content -->
	<@layout.put block="contents">
		<h1 class="text-center">List popup</h1>
		
		<ul class="contactsList">
			<#list contacts as contact>
			<li>${contact}</li>
			</#list>
		</ul>
		
		<a class="btn btn-success" href="<@spring.url '/add' />">Add</a>
	</@layout.put>
	
	
</@layout.extends>