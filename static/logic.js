// Name of the chatbot
var name = "BotBertil";
// Loading-icon
var loading = false;

function init() {
	s = "<span class='reply'><b>" + name + ":</b> Vad kan jag hjälpa till med?</span><br>";
	document.getElementById("history").innerHTML = s;
	fetch("clear", {method:'GET'})
}

// Makes a POST request to the service
function make_post_request(url, func, id) {
	let q = document.getElementById(id).value.trim();
	console.log("'" + q + "'");
	if (q == "") {
		return;
	}
	// Check if we are allowed to make a request
	if (loading == true) {
		return;
	}

	s = "<span class='question'><b>Du:</b> " + q + "</span><br>";
	document.getElementById("history").innerHTML += s;
	document.getElementById(id).value = "";
	
	// Block new requests
	loading = true;
	document.body.style.cursor  = "wait";

	// Make request
  fetch(url, {method:'POST',body:q}).then(result=>result.json()).then(result=>func(result));
}

// Shows result from a get recommendations request
function ask(result) {
	loading = false;
	document.body.style.cursor = "default";

	s = "<span class='reply'><b>" + name + ":</b> " + result["reply"] + "</span><br>";
	document.getElementById("history").innerHTML += s;
}

function change_bg(id) {
	document.body.style.backgroundImage = "url('../static/" + id + ".png')";
}

document.onkeyup = function(e) {
	if (e.ctrlKey) {
		change_bg(e.key);
	}
	if (e.shiftKey) {
		if (e.key == "Enter") {
			make_post_request('ask', ask, 'q');
		}
		if (e.key == "C") {
			init();
		}
	}
}
