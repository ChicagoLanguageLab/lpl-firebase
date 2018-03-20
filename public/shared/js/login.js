(function($) {
    "use strict";

  var config = {
      apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
      authDomain: "language-processing-lab.firebaseapp.com",
      databaseURL: "https://language-processing-lab.firebaseio.com/",
  };
  firebase.initializeApp(config);

	// Options for Message
	//----------------------------------------------
  var options = {
	  'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
	  'btn-success': '<i class="fa fa-check"></i>',
	  'btn-error': '<i class="fa fa-remove"></i>',
	  'msg-success': 'All Good! Redirecting...',
	  'msg-error': 'Wrong login credentials!'
  };

	// Login Form
	//----------------------------------------------
	// Validation
  $("#login-form").validate({
  	rules: {
      lg_username: "required",
  	  lg_password: "required",
    },
  	errorClass: "form-invalid"
  });

	// Form Submission
  $(document).ready(function() {
    $("#login-form").on('submit', function(e) {

      e.preventDefault();
    	remove_loading($(this));

      firebase.auth().signInWithEmailAndPassword($('#lg_username').val(), $('#lg_password').val()).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        form_loading($(this));
        setTimeout(function() {
          form_failed($(this), error.message);
        }, 2000);
      });

      var user = firebase.auth().currentUser;
      if (user) {
        form_loading($(this));
        setTimeout(function() {
          form_success();
          setTimeout(function() {
            window.location.replace('demos.html');
          }, 2000);
        }, 2000);
      }
    });
  });

	// Loading
	//----------------------------------------------
  function remove_loading(form)
  {
  	$("#login-form").find('[type=submit]').removeClass('error success');
  	$("#login-form").find('.login-form-main-message').removeClass('show error success').html('');
  }

  function form_loading(form)
  {
    $("#login-form").find('[type=submit]').addClass('clicked').html(options['btn-loading']);
  }

  function form_success(form)
  {
	  $("#login-form").find('[type=submit]').addClass('success').html(options['btn-success']);
	  $("#login-form").find('.login-form-main-message').addClass('show success').html(options['msg-success']);
  }

  function form_failed(form, message)
  {
  	$("#login-form").find('[type=submit]').addClass('error').html(options['btn-error']);
  	$("#login-form").find('.login-form-main-message').addClass('show error').html(message);
  }

})(jQuery);
