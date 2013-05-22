(function () {
	function _getAddress(address1, city){
		return ($.trim(address1).length == 0 ? city : address1 + ', ' + city);
	}

	var venue = Backbone.Model.extend({
		initialize: function(){
			var sortedReviews = _.sortBy(this.get('reviews'), function(review){
				return review.text_excerpt.length;
			}),
				longestReview = _.last(sortedReviews);
				address = _getAddress(this.get('address1'), this.get('city'));
			
			this.set('reviewText', longestReview.text_excerpt); 
			this.set('address', address);
			this.set('formattedPhoneNumber', this.formatPhone(this.get('phone')));
		},
		formatPhone: function(phonenum) {
		    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
		    if (regexObj.test(phonenum)) {
		        var parts = phonenum.match(regexObj);
		        var phone = "";
		        if (parts[1]) { phone += "(" + parts[1] + ") "; }
		        phone += parts[2] + "-" + parts[3];
		        return phone;
		    }
		    else {
		        //invalid phone number
		        return phonenum;
		    }
		}
	});
	
	App.Models.Venue = venue;	
}());