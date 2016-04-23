(function(win) {
	var doc = win.document,
		queue = [],
		snapshots = [];

	function addListener(target, type, handler) {
		if (target.addEventListener) {
			target.addEventListener(type, handler, false);
		} else if (target.attachEvent) {
			target.attachEvent("on" + type, handler);
		} else {
			target["on" + type] = handler;
		}
	}

	function randomGenData(min, max, count) {
		var data = [],
			i;

		for (i = 0; i < count; i++) {
			data.push(Math.floor(Math.random() * (max - min) + min));
		}

		return data;
	}

	function quickSort(start, end) {
		var arrToSort = queue.slice(start, end),
			arrLeft = queue.slice(0, start),
			arrRight = queue.slice(end),
			left = [],
			right = [],
			mid = arrToSort.splice(0, 1),
			len = arrToSort.length,
			leftStart,
			leftEnd,
			rightStart,
			rightEnd,
			i;


		if (len < 1) {
			return mid;
		}

		for (i = 0; i < len; i++) {

			if (arrToSort[i] < mid[0]) {
				left.push(arrToSort[i]);
				// console.log(i + " left:" + left);
			} else {
				right.push(arrToSort[i]);
				// console.log(i + " right:" + right);
			}

		}

		arrSorted = left.concat(mid, right);
		queue = arrLeft.concat(arrSorted, arrRight);

		// console.log(arrLeft);
		// console.log(arrRight);
		// console.log(queue);

		snapshots.push(queue);
		console.log(snapshots);

		leftStart = arrLeft.length;
		leftEnd = arrLeft.length + left.length;
		rightStart = arrLeft.length + left.length + 1;
		rightEnd = arrLeft.length + left.length + 1 + right.length;

		quickSort(leftStart, leftEnd);
		quickSort(rightStart, rightEnd);


	}

	function validate(inputValue) {
		var partern = /^\d+$/g;
		return partern.test(inputValue);
	}

	function rander(container, snapshots) {
		var i = 0,
			len;

		function draw() {
			container.innerHTML = "";
			snapshots[i].forEach(function(value) {
				var height = value * 4,
					color = "hsl(" + (value * 255 / 90).toFixed(2) + ", " + value + "%, 60%)";

				container.innerHTML += "<div class='queue-items' style='height:" +
					height + "px;background-color:" + color + "'></div>";
			});
			i++;
			if (i < snapshots.length) {
				setTimeout(draw, 90);
			}
		}

		setTimeout(draw, 90);


	}

	function handle(e) {
		var target = e.target,
			value = doc.getElementById("input").value,
			container = doc.getElementById("chart");

		if (target.classList.contains("opt")) {

			if (target.classList.contains("in")) {
				if (!validate(value)) {
					alert("输入必须为整数！");
					return;
				}

				value = parseInt(value);

				if (queue.length === 1000) {
					alert("数量最多限制为60个！");
					return;
				}
				if (value < 10 || value > 100) {
					alert("输入的数字应在10-100之间！");
					return;
				}
			}

			switch (target.id) {
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

				case "gen-data":
					queue = randomGenData(10, 100, 60);
					snapshots = [];
					snapshots.push(queue);
					break;

				case "sort":
					snapshots = [];
					queue = quickSort(0, queue.length);
					rander(container, snapshots);
					break;

				default:
					return;
			}


		}

		// console.log(queue);
		rander(container, snapshots);
	}

	function init() {
		var wrap = doc.getElementById("wrap"),
			container = doc.getElementById("chart");
		addListener(wrap, "click", handle);
	}

	init();
}(window));