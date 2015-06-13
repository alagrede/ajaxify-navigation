<#macro navbar>
		<nav class="navbar navbar-inverse">
			<a class="navbar-brand" href="<@spring.url '/index' />">Mon application</a>
			<ul class="nav navbar-nav">
				<li>
					<a class="tab" href="<@spring.url '/index' />">Accueil</a>
				</li>
				<li>
					<a class="tab" href="<@spring.url '/add' />">Add</a>
				</li>
				<li>
					<a class="tab" href="<@spring.url '/list' />">List</a>
				</li>
			</ul>
			<ul class="nav navbar-nav navbar-right">
				<li>
					<a class="forceQuit logoutApp" href="<@spring.url '/index' />">Logout</a>
				</li>
			</ul>
		</nav>
		
</#macro>