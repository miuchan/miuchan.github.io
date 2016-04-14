

(function (win) {
	var doc = win.document,
		queue = [];

	function addListener(target, type, handler) {
		if (target.addEventListener) {
			target.addEventListener(type, handler, false);
		} else if (target.attachEvent) {
			target.attachEvent("on" + type , handler);
		} else {
			target["on" + type] = handler;
		}
	}

	function validate(inputValue) {
		var partern = /^\d+$/g;
		return partern.test(inputValue);
	}
	//
	function rander(queueWrap, queue) {
		queueWrap.innerHTML = "";
		queue.forEach(function (ele) {
			queueWrap.innerHTML += "<div>" + ele + "</div>";
		});
	}

	function handle(e) {
	    var target = e.target,
	    	value = doc.getElementById("input").value,
	        queueWrap = doc.getElementById("queue-wrap");

	    if (target.className === "opt") {

	    	if (!validate(value)) {
	    		alert("输入必须为整数！");
	    		return;
	    	}

	    	switch(target.id) {
	    		case "left-in":
	    			queue.unshift(value);
	    			break;

	    		case "right-in":
	    			queue.push(value);
	    			break;

	    		case "left-out":
	    			queue.shift();
	    			break;

	    		case "right-out":
	    			queue.pop();
	    			break;

	    		default:
	    			return;
	    	}

	    	console.log(queue);
	    	rander(queueWrap, queue);
	    }


	}

	function init() {
		var wrap = doc.getElementById("wrap");
		addListener(wrap, "click", handle);
	}

	init();
}(window));