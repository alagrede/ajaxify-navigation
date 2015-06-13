<#import "/macro/static_macro.ftl" as static>
<#import "/macro/menu_macro.ftl" as menu>
<#import "/spring.ftl" as spring>
<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">

	    <@layout.block name="title">
    		<title>Ajaxify demo application</title>
    	</@layout.block>

		<@layout.block name="head">
	
			<!-- Bootstrap CSS -->
			<link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
	
			<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
			<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
			<!--[if lt IE 9]>
				<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
				<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
			<![endif]-->

			<!-- jQuery -->
			<script src="http://code.jquery.com/jquery.js"></script>
			<!-- Bootstrap JavaScript -->
			<script src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		
			<script type="text/javascript" src="<@static.js 'ajaxify-navigation.js' />"></script>
		
		</@layout.block>

		<script type="text/javascript">
			$(function(){
				$.ajaxifier.init({
 			  		refreshMenu : function(url) {
				  		$(".navbar.navbar-inverse ul li.active").removeClass("active");
				  		if (url.indexOf("?") != -1) {
					  		url = url.split("?")[0];
				  		}
				  		$(".navbar.navbar-inverse li a[href='" + url + "']").parents("li").addClass("active");
			  		}
				});
			});
		</script>

	</head>
	<body>
	
		<@static.ajaxifyStatic />

		<@menu.navbar />

		<section class="container-fluid">
			
			<!-- Div cible pour les onglets -->
			<div class="row">
				<div id="v-tabs"></div>
			</div>
	
			<!-- Contenu principal de la page qui sera remplacé par ajaxify -->
			<div id="maincontent" class="row">
	
				<div id="pagecontent">
					<@layout.block name="contents">
					<!-- Block de contenu de page -->
					</@layout.block>
				</div>
	
			</div>
			
		</section>
		
	</body>
</html>