<#macro image path>${requestContext.getContextPath()}/images/${path}</#macro>
<#macro css path>${requestContext.getContextPath()}/css/${path}</#macro>
<#macro js path>${requestContext.getContextPath()}/js/${path}</#macro>

<#macro ajaxifyStatic>
      <!-- Modal -->
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

      <!-- Login Modal -->
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
</#macro>