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
    persent = aqi / 600;

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
        nowData = chartData[pageState.nowSelectCity][pageState.nowGraTime],
        fieldset = document.createElement("fieldset"),
        legend = document.createElement("legend"),
        aqiChart = document.createElement("div"),
        color,
        column,
        persent,
        width;

    aqiChartWrap.innerHTML = "";

    aqiChart.setAttribute("style",
        "width:1200px;height:500px;display:flex;justify-content:space-around;" +
        "align-items:flex-end;margin:0 auto;");
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

    for (data in nowData) {

            if (pageState.nowGraTime === "week") {

                for (week in nowData[data]) {
                    color = getColor(nowData[data][week]);

                    if (nowData[data].hasOwnProperty(week)) {
                        var height = 500 * nowData[data][week] / 1200;
                        column = document.createElement("div");
                        column.setAttribute("style", "width:" + width + ";height:" +
                            height + "px;background-color:" + color);
                        aqiChart.appendChild(column);
                    }
                }
            } else {
                var height = 600 * nowData[data] / 1200;
                color = getColor(nowData[data]);
                column = document.createElement("div");
                column.setAttribute("style", "width:" + width + ";height:" +
                    height + "px;background-color:" + color);
                aqiChart.appendChild(column);
            }
    }

    fieldset.appendChild(aqiChart);
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
    var startWeek = 0,	     // 开始计数时的星期
        currentMonth = 1,    // 目前计数时的月份
        weekCount = 0,       // 按周统计时已相加的天数
        weekSum = 0,         // 按周统计的和
        weekNum = 0,         // 目前统计的周到序数
        monthSum = 0,        // 按周统计的和
        monthCount = 0;      // 按月统计时已相加的天数

    for (city in aqiSourceData) {
        var days = Object.keys(aqiSourceData[city]),
            dateObj = new Date(days[0]);
        startWeek = dateObj.getDay();
        currentMonth = parseInt(days[0].substr(5, 2));

        chartData[city] = {};
        chartData[city].day = aqiSourceData[city];
        chartData[city].week = {};
        chartData[city].week[currentMonth] = {};
        chartData[city].month = {};

        for (var i = 0; i < days.length; i++) {

            if (currentMonth !== parseInt(days[i].substr(5, 2))) {
                var dateObj = new Date(days[0]);
                startWeek = dateObj.getDay();
                chartData[city].month[currentMonth] = (monthSum / monthCount).toFixed();
                currentMonth = parseInt(days[i].substr(5, 2));
                chartData[city].week[currentMonth] = {};

                weekCount = 0;
                weekNum = 0;
                monthSum = 0;
                monthCount = 0;
            }
            if (i === days.length - 1) {
                chartData[city].month[currentMonth] = (monthSum / monthCount).toFixed();
            }

            if (weekCount + startWeek === 7 || i === days.length - 1) {
                chartData[city].week[currentMonth][weekNum] = (weekSum / weekCount).toFixed();
                weekCount = 0;
                startWeek = 0;
                weekSum = 0;
                weekNum++;
            }

            weekSum += aqiSourceData[city][days[i]];
            monthSum += aqiSourceData[city][days[i]];
            weekCount++;
            monthCount++;

        }
        weekNum = 0;
    }

    console.log(chartData);


}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
    renderChart()
}

init();
