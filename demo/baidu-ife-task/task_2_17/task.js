/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
}

// 柱子宽度
var widths = {
        thin: "10px",
        middle: "50px",
        thick: "150px"
    }
    // 渲染用顏色
var colors = {
    extraLow: "#80DEEA",
    low: "#66BB6A",
    middle: "#C0CA33",
    high: "#F9A825",
    extraHigh: "#EF5350"
}

/**
 * 获取颜色
 */
function getColor(aqi) {
    var color;
    persent = aqi / 500;

    if (persent <= 0.2) {
        color = colors.extraLow;
    } else if (persent > 0.2 && persent <= 0.4) {
        color = colors.low;
    } else if (persent > 0.4 && persent <= 0.6) {
        color = colors.middle;
    } else if (persent > 0.6 && persent <= 0.8) {
        color = colors.high;
    } else {
        color = colors.extraHigh;
    }

    return color;
}

/**
 * 渲染图表
 */
function renderChart() {
    var aqiChartWrap = document.getElementsByClassName("aqi-chart-wrap")[0],
        fieldset = document.createElement("fieldset"),
        legend = document.createElement("legend"),
        aqiChart = document.createElement("div"),
        color,
        column,
        persent,
        width;

    aqiChartWrap.innerHTML = "";

    aqiChart.setAttribute("style",
        "position:relative;width:1200px;height:500px;display:flex;justify-content:space-around;" +
        "align-items:flex-end;margin:0 auto;bottom:0;");
    switch (pageState.nowGraTime) {
        case "week":
            legend.innerText = pageState.nowSelectCity + "市周平均空气质量";
            width = widths.middle;
            break;
        case "month":
            legend.innerText = pageState.nowSelectCity + "市月平均空气质量";
            width = widths.thick;
            break;
        default:
            legend.innerText = pageState.nowSelectCity + "市日平均空气质量";
            width = widths.thin;
    }

    fieldset.appendChild(legend);

    for (aqiData in chartData) {
        var height = chartData[aqiData];
        color = getColor(chartData[aqiData]);
        column = document.createElement("div");
        column.setAttribute("style", "width:" + width + ";height:" +
            height + "px;background-color:" + color + ";border:1px solid #fff");
        aqiChart.appendChild(column);

    }

    fieldset.appendChild(aqiChart);
    fieldset.setAttribute("style", "height:530px");
    aqiChartWrap.appendChild(fieldset);

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {

    // 确定是否选项发生了变化
    var time = e.target.value,
        radio = document.getElementsByName("gra-time");
    console.log(e.target);
    if (time !== pageState.nowGraTime) {

        // 设置对应数据
        pageState.nowGraTime = time;
        initAqiChartData()

        // 调用图表渲染函数
        renderChart();
        console.log(pageState.nowGraTime);
    }


}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {

    // 确定是否选项发生了变化
    var city = this.value;

    if (city !== pageState.nowSelectCity) {

        // 设置对应数据
        pageState.nowSelectCity = city;
        initAqiChartData()

        // 调用图表渲染函数
        renderChart();
        console.log(pageState.nowSelectCity);

    }


}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var formGraTime = document.getElementById("form-gra-time");
    formGraTime.addEventListener("change", graTimeChange, false);

}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect = document.getElementById("city-select");
    for (key in aqiSourceData) {
        if (aqiSourceData.hasOwnProperty(key)) {
            var option = document.createElement("option");
            option.value = key;
            option.innerText = key;
            citySelect.appendChild(option);
        }

    }

    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    citySelect.addEventListener("change", citySelectChange, false);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中

    var nowCityData = aqiSourceData[pageState.nowSelectCity],
        dateObj = new Date("2016-01-01"),
        sum = 0,
        count = 0,
        nowMonth;

    chartData = {};
    nowMonth = dateObj.getMonth();

    if (pageState.nowGraTime === "day") {
        chartData = nowCityData;
    }

    if (pageState.nowGraTime === "week") {

        for (aqiData in nowCityData) {
            if (dateObj.getDay() === 6 || dateObj.getMonth() !== nowMonth) {
                console.log(count);
                chartData[getDateStr(dateObj)] = Math.round(sum / count);
                nowMonth = dateObj.getMonth();
                sum = 0;
                count = 0;

            }
            sum += nowCityData[aqiData];
            dateObj.setDate(dateObj.getDate() + 1);
            count++;

        }

    }

    if (pageState.nowGraTime === "month") {
        var keys = Object.keys(nowCityData);
        for (var i = 0; i < keys.length; i++) {
            if (dateObj.getMonth() !== nowMonth || i === keys.length - 1) {
                console.log(count);
                chartData[getDateStr(dateObj)] = Math.round(sum / count);
                nowMonth = dateObj.getMonth();
            }
            sum += nowCityData[keys[i]];
            dateObj.setDate(dateObj.getDate() + 1);
            count++;
        }
    }

    console.log(chartData);


}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
    renderChart();
    console.log(aqiSourceData);
}

init();
