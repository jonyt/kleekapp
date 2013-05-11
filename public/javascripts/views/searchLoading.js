(function () {
	var searchLoading = Backbone.View.extend({		
		initialize: function(){			
			this.listenTo(App.vent, 'search:started', this.show);			
			this.listenTo(App.vent, 'map:rendered', this.hide);		
		},
		hide: function(){
			this.$el.hide();
		},
		show: function(){
			this.$el.show();
		}
	});

	App.Views.SearchLoading = searchLoading;
}());