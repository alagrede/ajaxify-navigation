/*
	
	Documentation:
	Cette librairie transforme une navigation classique à la page, par une navigation ajax avec des onglets en javascript.
	Tous les chagements de pages se font dans des onglets (sauf : voir plus bas -> Configuration).
	Le mécanisme intercepte tous les liens et submit de la page (sauf exclusion, voir plus bas -> Configuration).


	Fonctionnement:
	On ne peut ouvrir qu'une seule fois une page (comparaison du <title> de la page HTML).
	Pour ouvrir plusieurs fois la même page, il faut un <title> différent.


	Configuration:
	- Pour afficher un lien dans un nouvel onglet, il faut lui rajouter la classe CSS 'tab'
	- Pour ne pas ajaxifier un lien, rajouter la classe CSS 'noAjax'
	- Pour charger une page en modal (exemple: login), rajouter dans le head de la page cible une balise <modal/>


	Ressoures HTML:
	Exemple de popup bootstrap nécessaire au fonctionnement de ajaxify

	<!-- Modal de warning pour avertir qu'il y a des modifs dans un onglet avant de le fermer -->
	<div class="modal fade" id="tabModifsModal" tabindex="-1" role="dialog" aria-labelledby="modifsDetected" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content panel panel-warning">
	      <div class="modal-header panel panel-heading">
	        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Fermer</span></button>
	        <h4 class="modal-title" id="myModalLabel">Modification en cours dans l'onglet</h4>
	      </div>
	      <div class="modal-body">
	        Vous allez perdre toutes vos modifications.
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">Laisser ouvert</button>
	        <button id="tabCloseConfirm" type="button" class="btn btn-warning">Je ferme quand même</button>
	      </div>
	    </div>
	  </div>
	</div>

	<!-- Modal de warning pour avertir trop d'onglets ouverts -->
	<div class="modal fade" id="maxTabsOpen" tabindex="-1" role="dialog" aria-labelledby="maximumTabExceeded" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content panel panel-warning">
	      <div class="modal-header panel panel-heading">
	        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Fermer</span></button>
	        <h4 class="modal-title" id="myModalLabel">Avertissement</h4>
	      </div>
	      <div class="modal-body">
	        Vous avez dépassé le nombre maximum autorisé d'onglets ouverts. Veuillez en fermer pour continuer votre navigation.
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">D'accord</button>
	      </div>
	    </div>
	  </div>
	</div>

	<!-- Modal générique pour intégrer une page dans une modal -->
	<div class="modal fade" id="pageModal" tabindex="-1" role="dialog" aria-labelledby="modifsDetected" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content panel panel-primary">
	      <div class="modal-header panel panel-heading">
	        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Fermer</span></button>
	        <h4 class="modal-title" id="myModalLabel"><!-- Titre de la modal --></h4>
	      </div>
	      <div class="modal-body">
	        <!-- Contenu de la modal -->
	      </div>
	    </div>
	  </div>
	</div>


	<!-- Topologie de page HTML attendue -->
		<div id="v-tabs"></div>
		
		<div id="maincontent" role="main">
		    
		    <div id="breadcrumbMenu" class="col-md-12 col-md-offset-0">
			    [@layout.block name="breadcrumb"]
				<ol class="breadcrumb"></ol>
		        [/@layout.block]
	    	</div>
			
	        <div id="pagecontent" class="col-md-6 col-md-offset-3">
	        [@layout.block name="contents"]
				<!-- Le contenu de la page -->
	        [/@layout.block]
	        </div>
		</div>



*/


jQuery.ajaxifier = {
	isHistoryAvailable: true,

	ajaxLinks: 'a:not(.noAjax)',
	tabLink: 'tab',
	modalPage: 'modal',
	errorTag: 'error',
	noAjaxLinks: '.noAjax',
	forceQuitClass: 'forceQuit',
	logoutClass: 'logoutApp',
	errorTitlePage: 'Error',
	errorContentMsg: '#msg',
	refreshContent: '#maincontent',
	refreshModalContent: "#pagecontent",
	// Exclusion des pages 302 après une modal (ex: page de login)
	excludeModalLinks: ["/j_spring_security_check",],
    refreshMenu: function() {},
    reopenHistoryTabs: 'true',
    maxTabs: 100,
    homeUrl: '',
    needFocus: 'focus',

	openTabs: 0,
	// Tableau général JS contenant les onglets
	tabs : [
		titles = [],
		contents = [],
		urls = [],
		modifs = [],
		init = [] 
	],

	
	
	init:function(options) {
		options = $.extend(
		{
			ajaxLinks : this.ajaxLinks, 
			tabLink : this.tabLink,
			modalPage : this.modalPage,
			errorTag : this.errorTag,
			noAjaxLinks: this.noAjaxLinks,
			forceQuitClass: this.forceQuitClass,
			logoutClass: this.logoutClass,
			errorTitlePage: this.errorTitlePage,
			errorContentMsg: this.errorContentMsg,
			refreshContent : this.refreshContent,
			refreshModalContent: this.refreshModalContent,
			excludeModalLinks: this.excludeModalLinks,
            refreshMenu: this.refreshMenu,
            reopenHistoryTabs: this.reopenHistoryTabs,
            maxTabs: this.maxTabs,
            homeUrl: this.homeUrl,
            needFocus: this.needFocus,
		}, options);

		this.ajaxLinks = options.ajaxLinks;
		this.tabLink = options.tabLink;
		this.modalPage = options.modalPage;
		this.errorTag = options.errorTag;
		this.noAjaxLinks = options.noAjaxLinks;
		this.forceQuitClass = options.forceQuitClass;
		this.logoutClass = options.logoutClass;
		this.errorTitlePage = options.errorTitlePage;
		this.errorContentMsg = options.errorContentMsg;
		this.refreshContent = options.refreshContent;
		this.refreshModalContent = options.refreshModalContent;
		this.excludeModalLinks = options.excludeModalLinks;
        this.refreshMenu = options.refreshMenu;
        this.reopenHistoryTabs = options.reopenHistoryTabs;
        this.maxTabs = options.maxTabs;
        this.homeUrl = options.homeUrl;
        this.needFocus = options.needFocus;

		// Récupération dans le localStorage les onglets ouverts
		if(typeof localStorage != 'undefined') {
			if('urls' in localStorage && this.reopenHistoryTabs == "true") {
				urls = localStorage.getItem("urls");

				jQuery.ajaxSetup({async:false}); // on charge les urls une par une

				var links = urls.split(",");

				// on place l'url ouverte en dernière position du tableau pour qu'elle soit l'onglet actif
				var query = document.location.pathname + document.location.search;
		  		// Création du premier onglet
				var newTab = $.ajaxifier.createTab($(document).prop('title'), $("html").html(), query, true);


				// On rouvre les onglets en commençant par le premier
				if (links.length > 0) {
					setTimeout(function(){
						$.ajaxifier.reopenTabs(links, 0, false);
					}, 500);
				} else {
					$.ajaxifier.endInitialize();
				}
				

			} else { // Rien dans le localStorage
				$.ajaxifier.initHistory();
		  		// Création du premier onglet
		  		var query = document.location.pathname + document.location.search;
				var newTab = $.ajaxifier.createTab($(document).prop('title'), $("html").html(), query, true);

				// Sauvegarde dans le localStorage des onglets ouverts
				if(typeof localStorage != 'undefined') {
					localStorage.setItem("urls", $.ajaxifier.tabs[2]); // Tableau des urls
				}

			}
		} else { // pas de localStorage
			$.ajaxifier.initHistory();
		}



 		/*
  		================================================================================================
  			Déclaration des handlers de la page
  		================================================================================================
  		*/

  		// Gestion de la page modal pour le post
		//$("#pageModal").delegate("form", "submit", function(e) {
		//$("#pageModal").delegate("input[type='submit']", "click", function(e) {
		var processFormPopup = function processFormPopup(form, formData, extra) {
		

  			//var $this = $(this); // L'objet jQuery du formulaire
  			//var  $this = $(this).closest('form');


		    //var formData = $this.serialize();
		    //var formData = $this.serializeArray();
            //formData.push({ name: $(this).attr('name'), value: $(this).val() });
		    var processData = true;
		    var contentType = "application/x-www-form-urlencoded; charset=UTF-8";

	    	if (extra != null) {
				formData.push(extra);
	    	}

			// Quand la popup est cachée
		    //$('#loginModal').on('hidden.bs.modal', function (e) {
			//});

		    // On cache la popup
			$('#pageModal').modal('hide');


			// On essaye d'envoyer un formulaire avec une pièce jointe
		    var encType = form.attr('enctype');
		    if (encType === "multipart/form-data") {
		    	formData = new FormData(form[0]);
		    	if (extra != null) {
					formData.append(extra.name, extra.value);
		    	}
		    	processData = false;
		    	contentType = false;
		    }


			// Timeout de 1 sec le temps que la popup soit cachée
			setTimeout(function(){
				// On fait l'appel en ajax
			    $.ajax({
	                url: form.attr('action'), // Le nom du fichier indiqué dans le formulaire
	                type: form.attr('method'), // La méthode indiquée dans le formulaire (get ou post)
	                data: formData, // Je sérialise les données (j'envoie toutes les valeurs présentes dans le formulaire)
	                processData: processData,
      			    contentType: contentType,
	                success: function(html, status, xhr) { // Je récupère la réponse

	  					var addToHistory = true;
	                	if (xhr.status == 278){
	                		console.log("redirection detected: " + xhr.getResponseHeader("Location"));	
	                		if (window.location.pathname == xhr.getResponseHeader("Location")) {
	                			addToHistory = false;
	                		}
	                		link = xhr.getResponseHeader("Location");
	                	} 


						$.ajaxifier.ajaxify(html, form.attr('action'), false, addToHistory);
						$.ajaxifier.refreshTabIfNeeded(form, html);
						return false;
	                }
				});

			}, 800);
		
			return false;						    
		};


		// Permet de capter les submit des formulaires
  		//$("body").delegate("form", "submit", function(e) {
		//$('form').submit(function(e){
		$("#pageModal").delegate("form:not("+ $.ajaxifier.noAjaxLinks +")", "submit", function(e) {
			e.stopPropagation();
			e.preventDefault(); //Prevent the normal submission action

			var form = $(this); // L'objet jQuery du formulaire
			var formData = form.serialize();
			return processFormPopup(form, formData, null);
		});

		$("#pageModal").delegate("input[type='submit']:not("+ $.ajaxifier.noAjaxLinks +")", "click", function(e) {
			e.stopPropagation();
			e.preventDefault(); //Prevent the normal submission action

			var form = $(this).closest('form');
			var formData = form.serializeArray();
            return processFormPopup(form, formData, { name: $(this).attr('name'), value: $(this).val() });
		});
  		

		// Gestion des liens de la modal
		$("#pageModal").delegate($.ajaxifier.ajaxLinks, "click", function(e) {
			e.preventDefault();			
			e.stopPropagation();

			var link = $(this).attr('href');
			var $this = $(this); // L'objet jQuery du formulaire
			
            if (typeof link == typeof undefined || link == false) {
                   return;
            }
            


		    // On cache la popup
			$('#pageModal').modal('hide');


			// Timeout de 1 sec le temps que la popup soit cachée
			setTimeout(function(){
				// On fait l'appel en ajax
				//$.get( link, function( html ) {	
				$.ajax({
	                url: link, // Le nom du fichier indiqué dans le formulaire
	                type: "GET", // La méthode indiquée dans le formulaire (get ou post)
	                success: function(html, status, xhr) { // Je récupère la réponse
				
						var addToHistory = true;
	                	if (xhr.status == 278){
	                		console.log("redirection detected: " + xhr.getResponseHeader("Location"));	
	                		if (window.location.pathname == xhr.getResponseHeader("Location")) {
	                			addToHistory = false;
	                		}
	                		//link = xhr.getResponseHeader("Location");
	                	} 

						$.ajaxifier.ajaxify(html, link, true, addToHistory);
						$.ajaxifier.refreshTabIfNeeded($this, html);
						return false;
					}
				});	

			}, 1000);
								    

		});


		// Alert avant de quitter l'application
		$(window).bind('beforeunload', function(){
			return "Fermeture de l'application";
		});

		// Pour quitter la page sans confirmation pour les liens
		$("body").delegate("a."+$.ajaxifier.forceQuitClass, "click", function(e) {
			$(window).unbind('beforeunload');
			return true;
		});
		// Pour quitter la page sans confirmation pour les form
		$("body").delegate("form."+$.ajaxifier.forceQuitClass, "submit", function(e) {
			e.stopPropagation();
			$(window).unbind('beforeunload');
			return true;
		});
		

		// Pour marquer le contenu actif comme modifié (permet d'afficher une popup de warning lors de la fermeture)
		$("body").delegate($.ajaxifier.refreshContent, "change", function(e) {
			
			var activeTitle = $("ul#v-tabs li.active").text();
			var index = $.inArray(activeTitle, $.ajaxifier.tabs[0]); // On essaye de récupérer l'onglet actif depuis le tabeau JS
			if (index >= 0) {
				var tabsModifs = $.ajaxifier.tabs[3];
				tabsModifs[index] = true; // il y a eu des modifs sur l'onglet
			}

		});


		var processFormBody = function processFormBody(form, formData, extra, e) {
			  			//var $this = $(this); // L'objet jQuery du formulaire
  			//var  $this = $(this).closest('form');

  			if (form.hasClass($.ajaxifier.logoutClass)) {
  				localStorage.removeItem("urls"); // On supprime les onglets de la session
  				return;
  			}

  			if (form.hasClass($.ajaxifier.forceQuitClass)) {
  				return;
  			}
  			
  			e.preventDefault(); //Prevent the normal submission action
		

		    var link = form.attr('action');
		    //var formData = $this.serialize();
		    
		    var finalLink = "";
		    if(form.attr("method").toLowerCase() == "get") {
		    	finalLink = link + "?"+ form.serialize();
		    } else {
		    	finalLink = link;
		    }
		    
		    var processData = true;
		    var contentType = "application/x-www-form-urlencoded; charset=UTF-8";

	    	if (extra != null) {
				formData.push(extra);
	    	}

			// On essaye d'envoyer un formulaire avec une pièce jointe. Dans ce cas on utilise FormData
		    var encType = form.attr('enctype');
		    if (encType === "multipart/form-data") {
		    	formData = new FormData(form[0]);
		    	if (extra != null) {
					formData.append(extra.name, extra.value);
		    	}
		    	processData = false;
		    	contentType = false;
		    }

		    // Est-ce qu'il faut fermer l'onglet après validation
		    var originalTitle = $(document).prop('title');
		    var closeable = form.attr('closeable-tab');

		    $.ajax({
                url: link, // Le nom du fichier indiqué dans le formulaire
                type: form.attr('method'), // La méthode indiquée dans le formulaire (get ou post)
                data: form.serialize(), // Je sérialise les données (j'envoie toutes les valeurs présentes dans le formulaire)
                data: formData,
      			processData: processData,
      			contentType: contentType,
                success: function(html, status, xhr) { // Je récupère la réponse
                	
                	var addToHistory = true;
                	if (xhr.status == 278){
                		console.log("redirection detected: " + xhr.getResponseHeader("Location"));	
                		if (window.location.pathname == xhr.getResponseHeader("Location")) {
                			addToHistory = false;
                		}
                		finalLink = xhr.getResponseHeader("Location");
                	} 


                	if (form.hasClass($.ajaxifier.tabLink)) {
					
						$( $.ajaxifier.refreshContent ).fadeOut('fast', function(){
							$.ajaxifier.ajaxify(html, finalLink, form.hasClass($.ajaxifier.tabLink), addToHistory); // J'affiche la réponse
							$($.ajaxifier.refreshContent).fadeIn('fast');
							$.ajaxifier.refreshTabIfNeeded(form, html);
							$.ajaxifier.closeTabIfNeeded(originalTitle, closeable);
						});
					
					} else {
						$.ajaxifier.ajaxify(html, finalLink, form.hasClass($.ajaxifier.tabLink), addToHistory);
						$.ajaxifier.refreshTabIfNeeded(form, html);
						$.ajaxifier.closeTabIfNeeded(originalTitle, closeable);
					}


					// permet de donner le focus à l'élément appelant si demandé
	  				if (typeof form.attr("data-focus") !== typeof undefined && form.attr("data-focus") !== false) {
	  					$($.ajaxifier.refreshContent).find("#"+form.attr("data-focus")).focus();
	  				}

					return false;
                    
                }
            });

		};

		// Permet de capter les submit des formulaires
  		//$("body").delegate("form", "submit", function(e) {
		//$('form').submit(function(e){
		$("body").delegate("form:not("+ $.ajaxifier.noAjaxLinks +")", "submit", function(e) {
			var form = $(this); // L'objet jQuery du formulaire
			var formData = form.serialize();
			return processFormBody(form, formData, null, e);
		});

		$("body").delegate("input[type='submit']:not("+ $.ajaxifier.noAjaxLinks +")", "click", function(e) {
			var form = $(this).closest('form');
			var formData = form.serializeArray();
			return processFormBody(form, formData, { name: $(this).attr('name'), value: $(this).val() }, e);
		});


  		// Interception des click sur les liens de toute la page
  		$("body").delegate($.ajaxifier.ajaxLinks, "click", function(e) {


			var link = $(this).attr('href');
			var $this = $(this); // L'objet jQuery du formulaire

	        if (typeof link == typeof undefined || link == false) {
	               return;
	        }

  			if ($this.hasClass($.ajaxifier.logoutClass)) {
  				localStorage.removeItem("urls"); // On supprime les onglets de la session
  				return;
  			}
  			
  			if ($this.hasClass($.ajaxifier.forceQuitClass)) {
  				return;
  			}


			if (link.indexOf("#") != -1) { // c'est un lien interne. On ne le gère pas
				return;
			}


			e.preventDefault();			

		    $.ajax({
                url: link, // Le nom du fichier indiqué dans le formulaire
                type: "GET", // La méthode indiquée dans le formulaire (get ou post)
                // Je sérialise les données (j'envoie toutes les valeurs présentes dans le formulaire)
                success: function(html, status, xhr) { // Je récupère la réponse

                	var addToHistory = true;
                	if (xhr.status == 278){
                		console.log("redirection detected: " + xhr.getResponseHeader("Location"));	
                		if (window.location.pathname == xhr.getResponseHeader("Location")) {
                			addToHistory = false;
                		}
                		link = xhr.getResponseHeader("Location");
                	} 
                	 

			//$.get( link, function( html ) {

				if ($this.hasClass($.ajaxifier.tabLink)) {
					// Avec effet de transition
					$( $.ajaxifier.refreshContent ).fadeOut('fast', function(){
						$.ajaxifier.ajaxify(html, link, $this.hasClass($.ajaxifier.tabLink), addToHistory);
						$($.ajaxifier.refreshContent).fadeIn('fast');
						$.ajaxifier.refreshTabIfNeeded($this, html);
					});

				} else {
					// Sans effet de transition
					$.ajaxifier.ajaxify(html, link, $this.hasClass($.ajaxifier.tabLink), addToHistory);
					$.ajaxifier.refreshTabIfNeeded($this, html);								
				}


				// permet de donner le focus à l'élément appelant si demandé
	  			if ($this.hasClass($.ajaxifier.needFocus)) {
	  				if (typeof $this.attr("id") !== typeof undefined && $this.attr("id") !== false) {
	  					$($.ajaxifier.refreshContent).find("#"+$this.attr("id")).focus();
	  				}	  				
	  			}



				//return false;
				},

			});	
		
	  	});


  		// Evenement back navigateur pour restaurer l'état précédent de l'historique
  		window.onpopstate = function(event) {
  			console.log("Back history");
  			console.log(event.state);
  			var query = document.location.pathname + document.location.search;
  			console.log(query);
  			if (event.state != null) {
				//if (event.state.reload == false) {
					var index = $.inArray(query , $.ajaxifier.tabs[2]); // On essaye de récupérer l'onglet
					if (index == -1) {
						// pas trouvé, probablement fermé. Il faut le recharger depuis le serveur
						$.ajaxifier.loadFromServer(query, event.state.tab);
					} else {
						// On recharge depuis le cache
						$.ajaxifier.switchTab($.ajaxifier.tabs[0][index]);
					}

				//} else {
					// On recharge la page depuis le serveur
				//	$.ajaxifier.loadFromServer(document.location.pathname, event.state.tab);
				//}
  			}
  		}

  		// Controle clavier pour changer de tab
		//var down = [];
		//$(document).keydown(function(e) {
		//    down[e.keyCode] = true;
		//}).keyup(function(e) {
		//    if (down[17] && down[16] && down[39]) { // Ctrl + Shift + fleche droite
        //
		//    	$.ajaxifier.showNextTab();
        //
		//    } else if (down[17] && down[16] && down[37]) {  // Ctrl + Shift + fleche gauche
        //
		//    	$.ajaxifier.showPreviousTab();
        //
		//    }
        //
		//    down[e.keyCode] = false;
		//});
		
  		//ctrl 17, shift 16, right arrow 39, left arrow 37  
	    

  		

	},



	/*
	================================================================================================
		Déclaration des méthodes
	================================================================================================
	*/

	showNextTab : function showNextTab() {

    	var tabsTitles = $.ajaxifier.tabs[0]
    	var activeTitle = $("ul#v-tabs  li.active").text();
		var index = $.inArray(activeTitle, tabsTitles); // On essaye de récupérer l'onglet actif
		if (index < tabsTitles.length -1) {
			index += 1;
		}
		$.ajaxifier.switchTab(tabsTitles[index]);

		if ($.ajaxifier.isHistoryAvailable) {
			if (index != -1) {
				console.log("Push State:{reload: false, tab: false}, " + tabsTitles[index] + ", " + $.ajaxifier.tabs[2][index]);
				history.pushState({reload: false, tab: false}, tabsTitles[index], $.ajaxifier.tabs[2][index]); //url	
			}
		}

	},

	showPreviousTab : function showPreviousTab() {

		var tabsTitles = $.ajaxifier.tabs[0]
    	var activeTitle = $("ul#v-tabs  li.active").text();
		index = $.inArray(activeTitle, tabsTitles); // On essaye de récupérer l'onglet actif
		if (index > 0) {
			index -= 1;
		}
		$.ajaxifier.switchTab(tabsTitles[index]);

		if ($.ajaxifier.isHistoryAvailable) {
			if (index != -1) {
				console.log("Push State:{reload: false, tab: false}, " + tabsTitles[index] + ", " + $.ajaxifier.tabs[2][index]);
				history.pushState({reload: false, tab: false}, tabsTitles[index], $.ajaxifier.tabs[2][index]); //url	
			}
		}


	},

	partLoadFromServer: function loadFromServer(url, htmlSelector) {
			$.get( url, function( html ) {
				console.log("reload from server:" + url);
				$.ajaxifier.partAjaxify(html, url, htmlSelector); // on n'ajoute pas de nouveau à l'historique
				return false;
			}).error(function(jqXHR, textStatus, errorThrown) {
                if (textStatus == 'timeout')
                    console.log('The server is not responding');

                if (textStatus == 'error')
                    console.log(errorThrown);

                // Etc
            });

	},


	loadFromServer: function loadFromServer(url, newTab) {
			$.get( url, function( html ) {
				console.log("reload from server:" + url);
				$.ajaxifier.ajaxify(html, url, newTab, false); // on n'ajoute pas de nouveau à l'historique
				return false;
			}).error(function(jqXHR, textStatus, errorThrown) {
                if (textStatus == 'timeout')
                    console.log('The server is not responding');

                if (textStatus == 'error')
                    console.log(errorThrown);

                // Etc
            });

	},

  	endInitialize: function endInitialize() {

		// on place l'url ouverte en dernière position du tableau pour qu'elle soit l'onglet actif
		var query = document.location.pathname + document.location.search;

		// Execution du JS inline de la page, si pas encore exécuté
		var tabsTitles = $.ajaxifier.tabs[0]
		var tabsUrls = $.ajaxifier.tabs[2]
		var newIndex = $.inArray(query, tabsUrls);

		if (newIndex != -1) { // on marque le dernier onglet comme initialisé
			$.ajaxifier.tabs[4][newIndex] = true;			
		}

	    jQuery.ajaxSetup({async:true}); // on réactive le mode par défaut jquery

	    $.ajaxifier.initHistory();
	    
		$("input[autofocus]").focus();
	},

	// Marque l'onglet courant comme contenant des modifications ou non
	setActiveTabModified: function setActiveTabModified(modify) {
        var activeTitle = $("ul#v-tabs  li.active").text();
        var index = $.inArray(activeTitle, $.ajaxifier.tabs[0]); // On essaye de récupérer l'onglet actif depuis le tabeau JS
        if(index >= 0){
            $.ajaxifier.tabs[3][index]=modify;
        }
	},
	
	// Ferme l'onglet courant (affiche la popup de modif en cours si besoin)
	closeActiveTab: function closeActiveTab(){
		
		if ($.ajaxifier.tabs[0].length == 1) { // lorsqu'on ferme le dernier onglet on redirige sur l'accueil
			if ($.ajaxifier.homeUrl != '') {
				$.ajaxifier.loadFromServer($.ajaxifier.homeUrl, false);
				return;
			}
		}
		
        var activeTitle = $("ul#v-tabs li.active").text();
        var index = $.inArray(activeTitle, $.ajaxifier.tabs[0]); // On essaye de récupérer l'onglet actif depuis le tabeau JS
        if (index >= 0) {
            if ($.ajaxifier.tabs[3][index] == true){
               // Ajout event sur le click ok pour fermer
               $('#tabModifsModal #tabCloseConfirm').click(function(e) {
                              $.ajaxifier.closeActiveTab();
                              $('#tabModifsModal').modal('hide');
               });
               // AJout event sur la fermeture de la modal: on retire l'event click (pour ne pas les cumuler)
               $('#tabModifsModal').on('hidden.bs.modal', function (e) {
                              $("#tabModifsModal #tabCloseConfirm").unbind();
                              $(this).unbind();
               });

               $('#tabModifsModal .modal-title').text("Modification en cours dans l'onglet '" + activeTitle + "'");
               $('#tabModifsModal').modal('show');

               return false;
            }
        }
        return true;
    },

	

	reopenTabs: function reopenTabs(links, ii, firstTabOpen) {
		/*
			Fonction récursive pour ouvrir les onglets historisés 
			@param links: liste des liens à ouvrir
			@param ii: index de l'onglet
		*/

		var query = document.location.pathname + document.location.search

		if (links[ii] != query) {
			$.ajaxifier.loadFromServer(links[ii], true);
		}

		// On passe à l'onglet suivant 
		// (on attend que son DOM soit chargé pour que le JS in-line de la page s'exécute correctement)
		ii += 1;
		if (ii < links.length) {
			setTimeout(function(){
				$.ajaxifier.reopenTabs(links, ii, firstTabOpen);
			}, 500);

		} else { // Affichage de l'onglet initial demandé
	    	//$.ajaxifier.loadFromServer(query, firstTabOpen); 
	    	// on recharge à nouveau l'url courante pour définir l'onglet actif
			setTimeout(function(){
		    	var newIndex = $.inArray(query, $.ajaxifier.tabs[2]);
				if (newIndex != -1) {
					$.ajaxifier.switchTab($.ajaxifier.tabs[0][newIndex]);
				}
			    $.ajaxifier.endInitialize();
		
			}, 500);
		}



	},

	closeActiveTab: function closeActiveTab(){
    var activeTitle = $("ul#v-tabs li.active").text();
    var index = $.inArray(activeTitle, $.ajaxifier.tabs[0]); // On essaye de récupérer l'onglet actif depuis le tabeau JS
       if (index >= 0) {
          $.ajaxifier.closeTab(index);    
        }
    },

	initHistory: function initHistory() {
  		// Gestion de l'historique
  		$.ajaxifier.isHistoryAvailable = true;
  		if (typeof history.pushState === "undefined") {
  			$.ajaxifier.isHistoryAvailable = false;
  		} else {
  			var query = document.location.pathname + document.location.search;
  			console.log("Push initial state: {reload: true, tab: false}," + $(document).prop('title') + ", " + query);
  			history.pushState({reload: true, tab: false}, $(document).prop('title'), query); //url	
  		}			
	},
  		

	switchTab: function switchTab(title) {
			
    	var tabsTitles = $.ajaxifier.tabs[0];
    	var tabsContents = $.ajaxifier.tabs[1];

		console.log(title);

		// On permute la page avec le cache
    	console.log("reload page from cache");
    	var index = $.inArray(title, tabsTitles);
		$(document).prop('title', tabsTitles[index]);

		// Méthode Jquery qui détache tous le JS du refreshContent 
		// et réexecute tout le JS inline de la page à charger 
		//$( $.ajaxifier.refreshContent ).html( tabsContents[index] );
	
		// Le déchargement/rechargement à la main ne coupera pas les events en cours
		var node = $( $.ajaxifier.refreshContent )[0];
		$.ajaxifier.clearNode(node);

		// Ajout du DOM depuis le cache
		for (i = 0; i < tabsContents[index].size(); i++) { 
		   node.appendChild(tabsContents[index][i]);
		}

		// Execution du JS inline de la page, si pas encore exécuté
		if ($.ajaxifier.tabs[4][index] == false) {
			$.ajaxifier.reloadScripts($( $.ajaxifier.refreshContent )[0]);
			console.log("init inline JS: " + tabsTitles[index]);
			$.ajaxifier.tabs[4][index] = true;
		}		


		console.log("change content switchTab");

		$( $.ajaxifier.refreshContent ).attr("aria-labelledby", "tab-" + index);
		$( $.ajaxifier.refreshContent ).attr("role", "tabpanel");

		// Reload du head
		//var currentHead = $("head").children();
		//$(currentHead).each(function() {
		//    $.ajaxifier.mergeHeadElement(currentHead, $(this)[0]);						  
	    //});	


		// Recréer le menu
		var tabsNode = document.getElementById('v-tabs');
		$.ajaxifier.clearNode(tabsNode);
		//tabsNode.appendChild($.ajaxifier.makeUL(tabsTitles[index]));
		$(tabsNode).replaceWith($.ajaxifier.makeUL(tabsTitles[index]));
		$("#v-tabs li.active a").focus();

		// scroll top (fix pour recalculer la hauteur de la scrollbar)
		$(window).scrollTop(1);
		$(window).scrollTop(0);
		
		$("input[autofocus]").focus();
	},

		
	    
	reloadScripts: function reloadScripts(html) {
		// Reload scripts
    	var scripts = $(html).find("script");
    	
		$(scripts).each(function(index) {
			try {
				$("head").append(scripts[index].outerHTML);	
			} catch(e) {
				console.log("inline JS error");
				console.log(e);
				$("head").children().last().remove();
			}			
		});

	},




	closeTab: function closeTab(index) {

		/*
			Fermer l'onglet pour l'index donné dans le tableau.
			L'onglet voisin de gauche devient l'onglet actif
		*/

		var removedTitle = $.ajaxifier.tabs[0].splice(index, 1); // on supprime du tableau des titres
		$.ajaxifier.tabs[1].splice(index, 1); // on supprime du tableau des contenus
		var removedUrl = $.ajaxifier.tabs[2].splice(index, 1); // on supprime du tableau des urls
		$.ajaxifier.tabs[3].splice(index, 1); // on supprime du tableau des modifs en cours
		$.ajaxifier.tabs[4].splice(index, 1); // on supprime du tableau des init JS en cours

		console.log("Tab supprimé: " + removedTitle);

		$.ajaxifier.openTabs = $.ajaxifier.openTabs -1;

		// Le prochain onglet actif sera le voisin de gauche
		if (index > 0) {
			index -= 1;
		}

		// on enregitre la fermeture du tab
		if ($.ajaxifier.isHistoryAvailable) {
			console.log("Push state: {reload: true, tab: true}," + removedTitle + ", " + removedUrl);
			history.pushState({reload: true, tab: true}, removedTitle, removedUrl); //url	
		}


		// Changement d'onglet
		$.ajaxifier.switchTab($.ajaxifier.tabs[0][index]);

		if ($.ajaxifier.isHistoryAvailable) {
			// On enregistre le changement d'onglet actif
			console.log("Push state: {reload: false, tab: false}" + ", " + $.ajaxifier.tabs[0][index] + ", " + $.ajaxifier.tabs[2][index]);
			history.pushState({reload: false, tab: false}, $.ajaxifier.tabs[0][index], $.ajaxifier.tabs[2][index]); //url	
		}


		// Sauvegarde dans le localStorage des onglets ouverts
		if(typeof localStorage != 'undefined') {
			localStorage.setItem("urls",$.ajaxifier.tabs[2]); // Tableau des urls
		}

	},


	makeUL: function makeUL(activeTitle) {
			  
		    var array = $.ajaxifier.tabs[0]; // tabsTitles
		    var tabsUrls = $.ajaxifier.tabs[2];
		    
		    // Create ul
		    var list = document.createElement('ul');
		    list.setAttribute("id", "v-tabs");
		    list.setAttribute("role", "tablist");

		    // bootstrap style tabs
		    $(list).addClass("nav nav-tabs"); 
		    //$(list).css("margin-bottom", "10px");

		    
		    //Création du bouton Home
//		    if ($.ajaxifier.homeUrl !== "") {
//			    var home = document.createElement("li");
//			    //$(home).addClass("active");
//			    var a = document.createElement('a');
//		        var htmlNode = document.createElement('span');
//				htmlNode.innerHTML = "<i class='glyphicons glyphicons-home' style='padding-left: 7px;padding-right:7px;'></i>";
//			    
//				a.appendChild(htmlNode);
//		        a.title = "home";
//		    	
//		        a.addEventListener("click", function(e){
//					e.preventDefault();
//					e.stopPropagation();
//					$.ajaxifier.loadFromServer($.ajaxifier.homeUrl, true);				
//		        });
//		        
//		        home.appendChild(a);
//			    list.appendChild(home);
//		    }
		    
		    
		    for(var i = 0; i < array.length; i++) {
		    	// Create li
		        var item = document.createElement('li');
		        item.setAttribute("id", "tab-" + i);
		        item.setAttribute("role", "tab");
		        item.setAttribute("aria-controls", String($.ajaxifier.refreshContent).replace("#", "").replace(".", ""));
		        

		        // Create link a
		        var a = document.createElement('a');
		        var pageTitle = document.createTextNode(array[i]);

		        a.appendChild(pageTitle);
		        		        
		        //span.title = array[i];
		        a.title = array[i];
		    	$(a).attr("href", tabsUrls[i]);
		        
		        // add click event
		        a.addEventListener("click", function(e){
		        	e.preventDefault();
		        	
					// On sauvegarde l'état de la page pour la gestion du back
					if ($.ajaxifier.isHistoryAvailable) {
						var index = $.inArray(e.currentTarget.href, $.ajaxifier.tabs[0]);
						if (index != -1) {
							console.log("Push State:{reload: false, tab: false}, " + e.currentTarget.title + ", " + $.ajaxifier.tabs[2][index]);
							history.pushState({reload: false, tab: false}, e.currentTarget.title, $.ajaxifier.tabs[2][index]); //url	
						}
					}

					$.ajaxifier.switchTab(e.currentTarget.textContent);

		        }, false);

		        // pilotage de la navigation entre les onglets par clavier
		        a.addEventListener("keydown", function(e){
					if(e.keyCode == 39 || e.keyCode == 40) { // fleche droite ou bas
						e.preventDefault();
					    $.ajaxifier.showNextTab();
					    return false;
					}

					if(e.keyCode == 37 || e.keyCode == 38) { // fleche gauche ou haut
						e.preventDefault();
						$.ajaxifier.showPreviousTab();
						return false;
					}

		        }, false);




                if (array[i]== activeTitle) {
			        	$(item).addClass("active");
			            $(item).attr('aria-selected', 'true');
			            $(a).attr("tabindex", 0); // on peut naviguer au clavier uniquement l'onglet actif

                    // mise à jour du menu de la page
					$.ajaxifier.refreshMenu(tabsUrls[i]);

		        } else {
		        	$(a).attr("tabindex", -1);
		        	$(item).attr('aria-selected', 'false');
		        }
		        
		        $(item).addClass($.ajaxifier.noAjaxLinks);
		       


		        // Set its contents:
		        item.appendChild(a);


				//var htmlNode = document.createElement('span');
				//htmlNode.innerHTML = "<i class='glyphicon glyphicon-remove' style='margin-left:10px;'></i>";
				
		        // On a le droit de fermer le dernier onglet uniquement s'il ne s'agit pas de l'accueil
		        if (!(array.length == 1 && String(tabsUrls[i]).indexOf($.ajaxifier.homeUrl) != -1)) {

		        	var closeable = document.createElement('button');
					$(closeable).attr("tab-title", array[i]);
					$(closeable).addClass("glyphicon glyphicon-remove-circle");
					$(closeable).css("margin-left", "10px");
					//$(closeable).attr("role", "button");
					$(closeable).attr("aria-label", "Fermeture de l'onglet: " + array[i] /*"tab-" + i*/);
					
					if ($(item).hasClass("active")) {
						$(closeable).attr("tabindex", 0);
					} else {
						$(closeable).attr("tabindex", -1);
					}
					
	
					// On ferme l'onglet sur le click de l'icone croix
					closeable.addEventListener("click", function(e){
						e.preventDefault();
						e.stopPropagation();
	
						
						if ($.ajaxifier.tabs[0].length == 1) { // lorsqu'on ferme le dernier onglet on redirige sur l'accueil
							if ($.ajaxifier.homeUrl != '') {
								$.ajaxifier.loadFromServer($.ajaxifier.homeUrl, false);
								return;
							}
						}
	
						var index = $.inArray($(e.currentTarget).attr("tab-title"), $.ajaxifier.tabs[0]);
						
						if ($.ajaxifier.tabs[3][index] == true) {
							// Des modifs en cours => avertir l'utilisateur avant destruction de l'onglet
							if ($('#tabModifsModal').length) {
	
								// Ajout event sur le click ok pour fermer
								$('#tabModifsModal #tabCloseConfirm').click(function(e) {
									$.ajaxifier.closeTab(index);
									$('#tabModifsModal').modal('hide');
								});
								// AJout event sur la fermeture de la modal: on retire l'event click (pour ne pas les cumuler)
								$('#tabModifsModal').on('hidden.bs.modal', function (e) {
								  $("#tabModifsModal #tabCloseConfirm").unbind();
								  $(this).unbind();
								})
	
								$('#tabModifsModal .modal-title').text("Modification en cours dans l'onglet '" + $(e.currentTarget).attr("tab-title") + "'");
								$('#tabModifsModal').modal('show');
	
							}
							
	
						} else {
	
							$.ajaxifier.closeTab(index);
						}
	
					});

					a.appendChild(closeable);
		        }



		        // Add it to the list:
		        list.appendChild(item);
		    }
		    // Finally, return the constructed list:
		    return list;
	},
		  
	clearNode:function clearNode(node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	},

		
	isExludedLink: function isExludedLink(link) {
		// On exclut les liens spécifiés
		if ($.ajaxifier.excludeModalLinks.length > 0) {
			for(var i = 0; i < $.ajaxifier.excludeModalLinks.length; i++) {
				if (String(link).indexOf($.ajaxifier.excludeModalLinks[i]) != -1) {
				    return true;
				}
			}
		}
		return false;
	},


	  

	createTab: function createTab(title, html, link, addTab) {
    	var newTabCreated = false;

		var tabsTitles = $.ajaxifier.tabs[0];
		var tabsContents = $.ajaxifier.tabs[1];
		var tabsUrls = $.ajaxifier.tabs[2];
		var tabsModifs = $.ajaxifier.tabs[3];

		var tabsNode = document.getElementById('v-tabs');

		if (addTab) {
			// Cas des liens pouvant ouvrir des tabs
			//if ($.inArray(title, tabsTitles) == -1) {
				var index = $.inArray(title, tabsTitles);
				if (index == -1) {
		  			//Il faut une variable intermédiaire pour tabsTitle.length et permettre ainsi de garder le binding....
		  			index = tabsContents.length; 							
		  			newTabCreated = true;
				}

				if ($.ajaxifier.openTabs >= $.ajaxifier.maxTabs && newTabCreated == true) {
					// Show message max tabs open
					if ($('#maxTabsOpen').length) {

						// Ajout event sur la fermeture de la modal: on retire l'event click (pour ne pas les cumuler)
						$('#maxTabsOpen').on('hidden.bs.modal', function (e) {
						  $("#maxTabsOpen #tabCloseConfirm").unbind();
						  $(this).unbind();
						})

						$('#maxTabsOpen').modal('show');

					}
					
					return false;
				} else {
					if (newTabCreated == true) {
						$.ajaxifier.openTabs = $.ajaxifier.openTabs + 1;
					}
				}


			    // Ajout du titre au gestionnaire d'onglets
			    tabsTitles[index] = title;
			    console.log("new tab create:" + title);
			    // Ajout du content au tableau gestionnaire d'onglets
			    var data  = $(html).find($.ajaxifier.refreshContent).children();
			    tabsContents[index] = data;
			    
			    // Ajout de l'url au gestionnaire d'onglets
			    if ($.ajaxifier.isExludedLink(link)) { // c'est un lien 302 qu'il faut exclure
			    	var query = document.location.pathname + document.location.search;
					tabsUrls[index] = query;	
			    } else {
			    	tabsUrls[index] = link;	
			    }
			    
			    // Ajout du sémaphore de modifs de l'onglet
			    tabsModifs[index] = false; // on vient de créer l'onglet: pas de modifs en cours
			  			
				var node = $( $.ajaxifier.refreshContent )[0];
				// Clean children nodes
				while (node.hasChildNodes()) {
	 			   node.removeChild(node.lastChild);
				}
				// Ajout du DOM depuis le cache
				for (i = 0; i < tabsContents[index].size(); i++) { 
				   node.appendChild(tabsContents[index][i]);
				}

				// Pour le binding des modifs il faut lier le contenu du tableau au dom
				//$( $.ajaxifier.refreshContent ).html( tabsContents[index] );
				
				$( $.ajaxifier.refreshContent ).attr("aria-labelledby", "tab-" + index);
				$( $.ajaxifier.refreshContent ).attr("role", "tabpanel");


			    $.ajaxifier.clearNode(tabsNode);
			    //tabsNode.appendChild($.ajaxifier.makeUL(title));
			    $(tabsNode).replaceWith($.ajaxifier.makeUL(title));
			    $("#v-tabs li.active a").focus();
		

		} else { // On remplace l'onglet actif par le nouveau
				// Si pas encore d'onglet on le crée.
				// Si l'onglet existe déjà, on l'utilise

			// On vérifie qu'il n'y a pas déjà l'onglet ouvert ailleurs
			var index = $.inArray(title, tabsTitles);
			
			// l'onglet n'existe pas
			if (index == -1) {
				var activeTitle = $("#v-tabs li.active").text();
				index = $.inArray(activeTitle, tabsTitles); // On essaye de récupérer l'onglet actif
				if (index == -1) {
					index = 0;// pas trouvé d'onglet actif. On crée un premier onglet
					newTabCreated = false;
				}
			} 

			tabsTitles[index] = title;
			var data  = $(html).find($.ajaxifier.refreshContent).children();
			tabsContents[index] = data;

		    if ($.ajaxifier.isExludedLink(link)) { // c'est un lien qu'il faut exclure > on recharge
		    	// On recharge la page entière
		    	var query = document.location.pathname + document.location.search;
		    	$(window).unbind('beforeunload'); // retrait du handler avant redirection
		    	// sauvegarde le l'url dans le storage
		    	var newIndex = $.inArray(query, $.ajaxifier.tabs[2]);
				if (newIndex == -1) {
					$.ajaxifier.tabs[2][$.ajaxifier.tabs[2].length] = query;
				}
				localStorage.setItem("urls",$.ajaxifier.tabs[2]);
		    	window.location = query; // redirection
				//tabsUrls[index] = query;	
		    } else {
		    	tabsUrls[index] = link;	//FIXME
		    }
			
			tabsModifs[index] = false; // on vient de rafraichir l'onglet: pas de modifs en cours

			var node = $( $.ajaxifier.refreshContent )[0];
			// Clean children nodes
			while (node.hasChildNodes()) {
 			   node.removeChild(node.lastChild);
			}
			// Ajout du DOM depuis le cache
			for (i = 0; i < tabsContents[index].size(); i++) { 
			   node.appendChild(tabsContents[index][i]);
			}

			// Pour le binding des modifs il faut lier le contenu du tableau au dom
			//$( $.ajaxifier.refreshContent ).html( tabsContents[index] ); // FIXME

			$( $.ajaxifier.refreshContent ).attr("aria-labelledby", "tab-" + index);
			$( $.ajaxifier.refreshContent ).attr("role", "tabpanel");

		    $.ajaxifier.clearNode(tabsNode);
		    //tabsNode.appendChild($.ajaxifier.makeUL(title));
		    $(tabsNode).replaceWith($.ajaxifier.makeUL(title));
			$("#v-tabs li.active a").focus();

		}
		return newTabCreated;

    },


	mergeHeadElement:function mergeHeadElement(currentHead, attr) {
    	var isAttrExist = true;
    	if (typeof attr.outerHTML === "undefined") {
    		isAttrExist = false;
    	}

    	// on évite le title
    	if (isAttrExist && attr.outerHTML.indexOf("title") != -1) {
    		return;
    	}

		// on évite le tag d'erreur (pour rafraichir une page)
    	if (isAttrExist && attr.outerHTML.indexOf($.ajaxifier.errorTag) != -1) {
    		return;
    	}


    	// Reload scripts
    	/*
    	if (isAttrExist && attr.outerHTML.indexOf("script") != -1) {

		  $(currentHead).each(function(item) {
			  if (attr.outerHTML === currentHead[item].outerHTML) {
			    $(currentHead[item]).remove();
			    $("head").append(attr.outerHTML);
			    console.log("reload:" + attr.outerHTML);
			  }
		  });

    	}
		*/

    	// Add new head element if not exist
		  var exist = false;
		  $(currentHead).each(function(item) {
			  if (attr.outerHTML === currentHead[item].outerHTML) {
				  exist = true;
				  return;
			  }
		  });
		  
		  if (exist == false) {
			  if (attr.outerHTML) {
				    console.log("add:" + attr.outerHTML);
				    // On charge dynamiquement une CSS
				    if (attr.outerHTML.indexOf("link") != -1) {
				    	$("head").append(attr.outerHTML);	
				    } else {
				    	$("head").append(attr.outerHTML);	
				    	// On charge dynamiquement un JS
					    //var node=document.createElement('script');
					    //node.type='text/javascript'; 
					    //node.async=false; 
					    //node.src=attr.src; 
					    //document.getElementsByTagName('head')[0].appendChild(node); 
				    }

			  }
		  }

    },


	extractHead: function extractHead(html) {
    	/*	    function changeBodyContent(data) {
		  var data  = $(data).find($.ajaxifier.refreshContent);
		  console.log("change page");
		  $( $.ajaxifier.refreshContent ).html( data.children() );
    		}
		*/		    
		  var regExp = /<head>([\s\S]*?)<\/head>/gm;
		  var matches = regExp.exec(html);
		  var newHead = $(matches[1]);
		  return newHead;
    },
		    
	replaceTitle: function replaceTitle(title) {
		$(document).prop('title', title);
		console.log("change title:" + title);
    },




	partAjaxify: function ajaxify(html, link, htmlSelector) {
		/*
			Fonction permettant de refraichir uniquement une partie d'une page correspondant au HTML ciblé par le 
			sélecteur CSS
		*/

		if (html == "") {
			return;
		}

		var tabsContents = $.ajaxifier.tabs[1];	
		var tabsUrls = $.ajaxifier.tabs[2]
		
		var index = $.inArray(link, tabsUrls);
		if (index == -1) {
  			return;
		}

	    // Modification du content
	    var data = tabsContents[index];
	    var partsToUpdate = $(data).find(htmlSelector);
		var newData  = $(html).find(htmlSelector);

	    partsToUpdate.each(function(i) {
			$(this).replaceWith(newData[i]);

			var query = document.location.pathname + document.location.search;
			if (query.indexOf(link) == -1) { // le tab contenant les divs à rafraichir n'est pas affiché.
				$.ajaxifier.tabs[4][i] = false; // on a modifié le html du DOM. Il faut réinitialiser le JS au prochain affichage
			}

	    });

	},
   	
	ajaxify: function ajaxify(html, link, addTab, addToHistory) {

		if (html == "") {
			return;
		}

    	// S'il s'agit d'une modal on affiche son contenu dans un popup js modal
    	var modal = $(html).filter($.ajaxifier.modalPage).length;
    	if (modal) {
			if ($('#pageModal').length) {
				$('#pageModal .modal-title').html($(html).filter("title").text());  
				//$('#pageModal .modal-body').html($(html).filter($.ajaxifier.refreshContent).children());
				//$('#pageModal .modal-body').html($($(html).filter($.ajaxifier.refreshContent).children()).filter($.ajaxifier.refreshModalContent).children());
				$('#pageModal .modal-body').html($(html).find($.ajaxifier.refreshModalContent).children());
				$('#pageModal').modal('show');
				// TODO add JS inline script

				return;
			}
		}


		// Extract head infos
		var newHead = $.ajaxifier.extractHead(html);
		var currentHead = $("head").children();
		var title = $(html).filter('title').text();

		// Merge head elements (only title)
		$(newHead).each(function() {
			$.ajaxifier.mergeHeadElement(currentHead, $(this)[0]);						  
		});					  



		// Remplacement du corps de la page
		//FIXME (normalement inutile car fait plus tard)
		//changeBodyContent(html);

		// Gestion de la page d'erreur
    	if (title === $.ajaxifier.errorTitlePage) {
    		window.alert($(html).filter($.ajaxifier.errorContentMsg).text());
    		return;
    	}

		// On remplace le titre de la page
		$.ajaxifier.replaceTitle(title);

		// Create js tab
		var newTab = $.ajaxifier.createTab(title, html, link, addTab);

		// Pour marquer le nouvel onglet comme non initialisé au niveau du JS
		//if (newTab) {
		var tabsTitles = $.ajaxifier.tabs[0]
		var newIndex = $.inArray(title, tabsTitles);
		if (newIndex != -1) {
			$.ajaxifier.tabs[4][newIndex] = false; // onglet crée mais pas de JS initialisé
		}

		//if (addToHistory) {// Non il faut comparer l'url du navigateur
		// Execution du JS inline de la page, si pas encore exécuté
		if ($.ajaxifier.tabs[4][newIndex] == false) {
			$.ajaxifier.reloadScripts($( $.ajaxifier.refreshContent )[0]);
			console.log("init inline JS: " + tabsTitles[newIndex]);
			$.ajaxifier.tabs[4][newIndex] = true;
		}		


		if ($.ajaxifier.isHistoryAvailable && addToHistory && $.ajaxifier.openTabs < $.ajaxifier.maxTabs) {
			console.log("Push State:{reload:" + true + ", tab: " + newTab + "}, " + title + ", " + link);
			history.pushState({reload: true, tab: newTab}, title, link); //url	
		}


		// Sauvegarde dans le localStorage des onglets ouverts
		if(typeof localStorage != 'undefined') {
			localStorage.setItem("urls",$.ajaxifier.tabs[2]); // Tableau des urls
		}

		// scroll top (fix pour recalculer la hauteur de la scrollbar)
		 $(window).scrollTop(1);
		 $(window).scrollTop(0);
		 
		 
		 $("input[autofocus]").focus();
    },


	closeTabIfNeeded: function closeTabIfNeeded(title, closeable) {
		// On ferme l'onglet s'il n'est pas l'onglet actif
	    if(typeof closeable != 'undefined' && closeable === "true") {

			var activeTitle = $("ul#v-tabs li.active").text();
			var index = $.inArray(activeTitle, $.ajaxifier.tabs[0]); // On essaye de récupérer l'onglet actif depuis le tabeau JS
			if (index >= 0) {
				if ($.ajaxifier.tabs[0][index] != title) { // si l'onglet actif a changé on ferme l'ancien
					index = $.inArray(title, $.ajaxifier.tabs[0]); // On essaye de récupérer l'onglet actif depuis le tabeau JS
					if (index >= 0) {
						$.ajaxifier.closeTab(index);	
					}
				}
			}
	    
	    }
	},

    refreshTabIfNeeded: function refreshTabIfNeeded(domElement, htmlResult) {
    	/*
			Recherche si l'element contient un attribut 'parent-refresh' pour rafraichir un onglet.
			Uniquement s'il n'y a pas de tag <error/> dans le head de la page reçu.
			
			@param domElement: Element dom jquery déclencheur
			@param  htmlResult: Résultat html de la requête ajax
    	*/

		var containsError = $(htmlResult).filter($.ajaxifier.errorTag).length;
		if (containsError == 0) { // pas d'erreur signalée

		    // si on doit rafraichir un autre onglet après validation
		    refreshTabQuery = domElement.attr('parent-refresh');
			if(typeof refreshTabQuery != 'undefined') {

// ========================================================================
//	LIGHT				
// ========================================================================
				// url de l'onglet actif
				var query = document.location.pathname + document.location.search;
				
				var tabsUrls = $.ajaxifier.tabs[2]
				var index = $.inArray(query, tabsUrls);

				$.ajaxifier.partLoadFromServer(tabsUrls[index], refreshTabQuery); // on recharge l'onglet pour y remplacer une partie

// ========================================================================
								
// ========================================================================				
//	FULL
//  Nous ne proposons pas de rafraichissement  entre les onglets
// =======================================================================				
//				tabs = refreshTabQuery.split(";")
//				for(var i = 0; i < tabs.length; i++) {
//
//					if (tabs[i].indexOf("#") != -1) { // rafraichissement d'une partie de la page seulement
//						console.log("Refresh div class: '" + tabs[i].split("#")[1] + "' in tab: " + tabs[i].split("#")[0]);	
//
//						var tabsUrls = $.ajaxifier.tabs[2]
//
//						// Cherche si l'url de la page à recharger est retrouvé partiellement dans le tableau des onglets
//						tabsUrls.forEach(function(element, index, array) {
//							if (element.indexOf(tabs[i].split("#")[0]) != -1) {
//								$.ajaxifier.partLoadFromServer($.ajaxifier.tabs[2][index], tabs[i].split("#")[1]); // on recharge l'onglet
//							}
//						});
//
//
//					} else { // rafraichissement de la page complète
//						console.log("Refresh tab: " + tabs[i]);	
//
//						var tabsUrls = $.ajaxifier.tabs[2]
//
//						// Cherche si l'url de la page à recharger est retrouvé partiellement dans le tableau des onglets
//						tabsUrls.forEach(function(element, index, array) {
//							if (element.indexOf(tabs[i]) != -1) {
//								$.ajaxifier.loadFromServer($.ajaxifier.tabs[2][index], true); // on recharge l'onglet
//							}
//						});
//						// Recherche exacte
//						//var indexTab = $.inArray(tabs[i], tabsUrls);
//
//					}
//			     }
// ========================================================================				

			}

		}
    }




};




	
