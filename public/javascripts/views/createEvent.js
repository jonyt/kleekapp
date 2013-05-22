(function () {
	var createEvent = Backbone.View.extend({		
		initialize: function(options){		
			this.$('#select2').yaselect2();
			this.$('#datepicker').datepicker({minDate: 0});

			var view = this;

			jQuery.validator.addMethod("timeAfterNow", function(value, element) {				
				var $element = $(element),
					$timeSelector = $element.parent('li').next('li').find('select'),
					selectedDate = new Date(value),
					hourAndMinutes = $timeSelector.val().split(':');
				selectedDate.setHours(hourAndMinutes[0]);
				selectedDate.setMinutes(hourAndMinutes[1]);
				return (selectedDate > new Date());
			}, "Event must start in the future");
			
			this.$el.validate({
		        rules: {
		            title: {required : true, maxlength : 32},
		            startdate: {required : true, date : true, timeAfterNow : true},
		            desc: {maxlength : 200}
		        },
		        messages: {
		            title: {required: 'Please enter a title for the event', maxlength: 'Title is too long'},
		            startdate: {required: 'Please enter a date', date: 'Please enter a valid date'},
		            desc: {maxlength: 'Description is too long'}
		        },
		        errorPlacement: function(error, element) {
		            error.insertAfter(element);
		        },
				submitHandler : function() {					
					view.model.set('eventName', view.$('#event_title').val());
					view.model.set('description', view.$('#event_description').val());
					view.model.set('privacy_type', view.$('input[name="privacy"]:checked').val());
					
					var dateString = view.$('#datepicker').val(),
						timeString = view.$('#select2').val(),
						eventDate  = new Date(Date.parse(dateString + " " + timeString));
					view.model.set('start_time', eventDate.toISOString());
					
					view.model.save();
					App.vent.trigger('page:transition', 3);

					return false;
				}
		    });
		}
	});

	App.Views.CreateEvent = createEvent;
}());	    