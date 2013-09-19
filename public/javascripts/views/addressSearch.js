(function () {
	var addressSearch = Backbone.View.extend({		
		initialize: function(options){		
			this.$('#search').val('');	
			this.geocoder = new google.maps.Geocoder();
		},
		events: {
			'submit': function(){				
				var view = this,
					addressField = this.$('#search'),
					address = addressField.val();

				ga('send', 'event', 'address-search', 'submit', '', address);

				addressField.val('');	

				if ($.trim(address).length == 0){
					return false;
				}	

				this.geocoder.geocode( { 
			        'address': address
			    }, function(results, status) {		
			        if (status == google.maps.GeocoderStatus.OK) {
			        	ga('send', 'event', 'address-search', 'success', '', App.elapsedTime());
			        	App.vent.trigger('map:changeLocation', results[0].geometry.location);
			        } else {
			        	ga('send', 'event', 'address-search', 'error', '', App.elapsedTime());
						/*$('#map-loading').fadeOut();
						$().toastmessage('showToast', {
							text     : "Couldn't find this address, please try again",
							position : 'top-center',
							type     : 'error'           
						});*/
			        // All possible codes are given in http://code.google.com/apis/maps/documentation/javascript/reference.html
			        // under google.maps.GeocoderStatus class
			        }
			    });

			    return false;
			}
		}
	});

	App.Views.AddressSearch = addressSearch;
}());