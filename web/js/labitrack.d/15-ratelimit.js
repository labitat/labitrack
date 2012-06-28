(function(){
	function ratelimiter(args) {
		this.in_progress = null;
		this.needs_triggering = null;
		this.callback = args[1];
		this.ctx = args[2];
		this.wait = args[0];
	}

	var rlpt = ratelimiter.prototype;

	function trigger()
	{
		var t = this;
		setTimeout(function(){
			var args = t.in_progress;
			t.in_progress = null;
			if (t.needs_triggering !== null) {
				t.in_progress = t.needs_triggering;
				t.needs_triggering = null;
				setTimeout(function(){
					trigger.call(t);
				}, 0);
			}
			t.callback.apply(t.ctx, args);
		}, t.wait);
	}

	rlpt.kick = function(args){
		if (this.in_progress !== null) {
			this.needs_triggering = args;
		} else {
			this.in_progress = args;
			trigger.apply(this);
		}
	};

	λ.ratelimiter = function(){
		var rl = new ratelimiter(arguments);
		return function(){
			rl.kick(arguments);
		};
	};
}());
