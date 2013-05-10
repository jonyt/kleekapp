(function () {
	var venue = Backbone.View.extend({
		tagName: 'div',
		className: 'result_light',
		template: _.template($('#venue-listitem-template').html()),		
		initialize: function(){
			this.listenTo(this.model, 'destroy', this.remove);
		},
		events: {
			'click li.event': function(e){
			}
		},
		render: function(){
			var html = this.template({venue: this.model});
			this.$el.append(html);
			this.$(".description_text").dotdotdot({ 
	            after : "a.result_readmore"
	        });
			return this;
		}
	});

	App.Views.VenueListItem = venue;
}());