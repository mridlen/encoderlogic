//Displays text slowly, like in the good old days
//copied this code verbatim from http://terminal.jcubic.pl/examples.php#user-typing

var anim = false;
function typed(finish_typing) {
	return function(term, message, delay, finish) {
		anim = true;
		var prompt = term.get_prompt();
		var c = 0;
		if (message.length > 0) {
			term.set_prompt('');
			var interval = setInterval(function() {
				term.insert(message[c++]);
				if (c == message.length) {
					clearInterval(interval);
					// execute in next interval
					setTimeout(function() {
						// swap command with prompt
						finish_typing(term, message, prompt);
						anim = false
						finish && finish();
					}, delay);
				}
			}, delay);
		}
	};
}
var typed_prompt = typed(function(term, message, prompt) {
	// swap command with prompt
	term.set_command('');
	term.set_prompt(message + ' ');
});
var typed_message = typed(function(term, message, prompt) {
	term.set_command('');
	term.echo(message)
	term.set_prompt(prompt);
});