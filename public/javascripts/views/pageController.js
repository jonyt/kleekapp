(function () {
	var pageController = Backbone.View.extend({		
		initialize: function(options){		
			this.pages = this.$('.item');
			this.listenTo(App.vent, 'page:transition', function(numPage){
				this.$el.scrollTo(this.pages.eq(numPage - 1), 800);
			});
		}
	});

	App.Views.PageController = pageController;
}());	    