(function () {
	var helpButton = Backbone.View.extend({		
		initialize: function(options){
			this.contents = [
				'Use the search box in the upper right corner to center the map to your address. You can search for bars, clubs etc. and then click "Go".',
				'Fill in the required fields and press the "Create Event" button.',
				'Invite some friends! Just click on some friends and then hit the "Invite Friends" button.',
				'You can now choose a flyer for your event. Click the thumbnails to get a preview. Click the "Choose this flyer" button to select one.'
			];
			this.$helpContent = $('#helpcontent');
			this.$helpContent.text(this.contents[0]);
			this.$helpContent.dialog({
		        autoOpen: false,
		        modal: true,
				position : [this.$el.position.left,  200],
		        title : 'Instructions'
		    });

			this.listenTo(App.vent, 'page:transition', function(numPage){
				this.$helpContent.dialog('close');
				this.$helpContent.text(this.contents[numPage - 1]);
			});
		},				
        events: {			
			'click': function(e){
				ga('send', 'event', 'interaction', 'help', '', App.elapsedTime());					

				this.$helpContent.dialog('open');
			}
		}
	});

	App.Views.HelpButton = helpButton;
}());