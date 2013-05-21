(function () {
	var createEvent = Backbone.View.extend({		
		initialize: function(options){		
			this.$('#select2').yaselect2();
			jQuery.validator.addMethod("timeAfterNow", function(value, element) {
				console.log(this);
				/*var selectedDate = new Date(value)
				var hourAndMinutes = eventTime.val().split(':');
				selectedDate.setHours(hourAndMinutes[0]);
				selectedDate.setMinutes(hourAndMinutes[1]);
				return (selectedDate > new Date());*/
				return false;
			}, "Event must start in the future");
			this.validate({
		        rules: {
		            title: {required : true, maxlength : 32},
		            startdate: {required : true, date : true, timeAfterNow : true},
		            desc: {maxlength : 200}
		        },
		        messages: {
		            title: {required  : 'Please enter a title for the event', maxlength : 'Title is too long'},
		            startdate: {required  : 'Please enter a date', date : 'Please enter a valid date'},
		            desc: {maxlength : 'Description is too long'}
		        },
		        errorPlacement: function(error, element) {
		            error.insertAfter(element);
		        },
				submitHandler : function() {
					App.vent.trigger('page:transition', 3);

					// Update model attributes with name,d esc etc.
					
					
					return false;
				}
		    });
		}
	});

	App.Views.CreateEvent = createEvent;
}());	    