$(function(){
	var alerts = $('#alerts');

	λ.alert = function (tmpl, ctx) {
		var alert = $(λ.template('alert_'+tmpl, ctx));
		alerts.append(alert);
		setTimeout(function(){
			alert.alert('close');
		}, 15000);

	};
});
