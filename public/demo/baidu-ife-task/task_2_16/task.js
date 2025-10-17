/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById('aqi-city-input').value.trim(),
		aqi = document.getElementById('aqi-value-input').value.trim();

	if (city && aqi) {
		var parseCity = /^[\u4e00-\u9fa5,A-Za-z]+$/i,
			parseAqi = /^[1-9]\d*$/g;

		if(!parseCity.test(city)) {
			alert('城市名称必须为中文或英文！');
		} else if(!parseAqi.test(aqi)) {
			alert('空气质量指数必须为整数！');
		} else {
			aqiData[city] = aqi;
			console.log(aqiData);
		}


	} else {
		alert('城市名称和空气质量指数不能为空！');
	}

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var aqiTable = document.getElementById('aqi-table'),
		trNode = document.createElement('tr'),
		cityNode = document.createElement('td'),
		aqiNode = document.createElement('td'),
		optNode = document.createElement('td');

	aqiTable.innerHTML = '';

	var aqiDataLength = function () {

	}
	var aqiDataKeys = Object.keys(aqiData);
	if (aqiDataKeys.length !== 0) {
		cityNode.innerText = '城市';
		aqiNode.innerText = '空气质量';
		optNode.innerText = '操作';
		trNode.appendChild(cityNode);
		trNode.appendChild(aqiNode);
		trNode.appendChild(optNode);
		aqiTable.appendChild(trNode);
	}



	for (var city in aqiData) {
		var trNode = document.createElement('tr'),
			cityNode = document.createElement('td'),
			aqiNode = document.createElement('td'),
			buttonNode = document.createElement('button');

		trNode.setAttribute('data-city', city);
		cityNode.innerText = city;
		aqiNode.innerText = aqiData[city];
		buttonNode.innerText = '删除';
		trNode.appendChild(cityNode);
		trNode.appendChild(aqiNode);
		trNode.appendChild(buttonNode);
		aqiTable.appendChild(trNode);

	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
    // do sth.
    var tr = e.target.parentNode;
    delete aqiData[tr.dataset.city];
    renderAqiList();
}

function init() {
	var addBtn = document.getElementById('add-btn'),
		aqiTable = document.getElementById('aqi-table');

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    addBtn.addEventListener('click', addBtnHandle, false);

    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    aqiTable.addEventListener('click', delBtnHandle, false);

}

init();