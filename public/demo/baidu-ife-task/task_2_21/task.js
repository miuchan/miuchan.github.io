var queue = [];

function addListener(target, type, handler) {
	if (target.addEventListener) {
		target.addEventListener(type, handler, false);
	} else if (target.attachEvent) {
		target.attachEvent("on" + type, handler);
	} else {
		target["on" + type] = handler;
	}
}

function split(input) {
	var re = /[\s, \，, \,, \;, \、, ]/;
	return input.split(re);
}

function validate(inputValue) {
	var partern = /^[\w, \u4e00-\u9fa5]+$/g;
	return partern.test(inputValue);
}

function search(value) {
	var re = new RegExp(value),
		item,
		i;

	for (i = 0; i < queue.length; i++) {
		item = document.getElementById("item-" + i);
		item.classList.remove("search-result");

		if (queue[i].search(re) !== -1) {

			console.log(item);
			item.classList.add("search-result");
		}
	}
}

function rander(queueWrap, queue, callb) {
	var i,
		len;

	queueWrap.innerHTML = "";

	for (i = 0, len = queue.length; i < len; i++) {
		queueWrap.innerHTML += "<div class='queue-items' id='item-" + i + "'>" + queue[i] + "</div>";
	}
}

function handle(e) {
	var target = e.target,
		addInput = document.getElementById("add-input").value.trim(),
		searchInput = document.getElementById("search-input").value.trim(),
		queueWrap = document.getElementById("queue-wrap"),
		valueList,
		i;

	if (target.classList.contains("opt")) {

		if (target.classList.contains("in")) {
			valueList = split(addInput);

			for (i = 0; i < valueList.length; i++) {
				if (!validate(valueList[i])) {
					alert("输入不合法！");
					return;
				}
			}

		}

		switch (target.id) {
			case "left-in":
				queue = valueList.concat(queue);
				break;

			case "right-in":
				queue = queue.concat(valueList);
				break;

			case "left-out":
				queue.shift();
				break;

			case "right-out":
				queue.pop();
				break;

			case "search-btn":
				search(searchInput);
				return;
				break;

			default:
				return;
		}

		rander(queueWrap, queue);

	}

	console.log(target.className);

	if (target.className === "queue-items") {
		var index = target.dataset.index;

		queue.splice(index, 1);
		rander(queueWrap, queue);
	}

	console.log(queue);


}

function init() {
	var wrap = document.getElementById("wrap");
	addListener(wrap, "click", handle);
}

init();