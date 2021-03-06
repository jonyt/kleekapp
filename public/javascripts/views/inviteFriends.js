(function () {
	var inviteFriends = Backbone.View.extend({		
		initialize: function(options){	
			try {
				this.$("#jfmfs-container").jfmfs();		
				this.friendSelector = this.$("#jfmfs-container").data('jfmfs');
				this.listenTo(App.vent, 'event:created', function(eventModel){
					this.model = eventModel;
				});
			} catch(e) {
				ga('send', 'event', 'invite-friends', 'init', 'error', e);
				//TODO: no access token, throw error and report to ga
			}						
		},
		events: {
			'click #invite_friends_button': function(){
				ga('send', 'event', 'invite-friends', 'click', '', App.elapsedTime());					

				var friendIds = this.friendSelector.getSelectedIds();
				if (friendIds === undefined || friendIds.length === 0){
					//TODO: error message
				} else {					
					this.model.inviteFriends(friendIds, {
						success: function(){
							App.vent.trigger('page:transition', 4);
						}
					});
				}
			},
			'click #skip_invite_friends_button': function(){
				ga('send', 'event', 'invite-friends', 'skip', '', App.elapsedTime());					

				App.vent.trigger('page:transition', 4);
			}
		}
	});

	App.Views.InviteFriends = inviteFriends;
}());