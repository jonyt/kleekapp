(function () {
	var venue = Backbone.View.extend({
		tagName: 'div',
		className: 'result_light',
		template: _.template($('#venue-listitem-template').html()),		
		initialize: function(){
			this.listenTo(this.model, 'destroy', this.remove);
		},
		events: {
			'click .result_button': function(e){
				ga('send', 'event', 'interaction', 'venue-select', '', App.elapsedTime());					

				App.vent.trigger('page:transition', 2);
				// Delete id key from attributes so that model isNew will be false
				var eventModel = new App.Models.Event(this.model.omit('id')); 
				new App.Views.CreateEvent({model: eventModel, el: $('#eventForm')})
			},
			'mouseover result_light': function(e){
				var $target = $(e.target);
				if (!$target.prop("tagName") == 'div' || !$target.hasClass('result_light')){
					$target = $target.parents('.result_light');
				}
				var index = $('.result_light').index($target);
				App.vent.trigger('listVenueItem:mouseover', index);
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