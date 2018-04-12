var myChart = echarts.init(document.getElementById('main'));
var option = {
  tooltip: {
                    show: false //不显示提示标签
//    formatter: '{b}', //提示标签格式
//    backgroundColor:"#ff7f50",//提示标签背景颜色
//    textStyle:{color:"#fff"} //提示标签字体颜色
  },
  series: [{
    type: 'map',
    mapType: 'china',
    label: {
      normal: {
        show: true,//显示省份标签
        textStyle:{color:"#4C77B5", fontSize: "12px" }//省份标签字体颜色
      },
      emphasis: {//对应的鼠标悬浮效果
        show: true,
        textStyle:{color:"#800080"}
      }
    },
    itemStyle: {
      normal: {
        borderWidth: .5,//区域边框宽度
        borderColor: '#46719A',//区域边框颜色
        areaColor:"#fff",//区域颜色
      },
//      emphasis: {
//        borderWidth: .5,
//        borderColor: '#4b0082',
//        areaColor:"#ffdead",
//      }
      emphasis:{
        areaColor: null,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 20,
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    data:[
      {name:'福建', selected:true},//福建为选中状态
      {name:'重庆', selected:true},//福建为选中状态
      {name:'北京', selected:true},//福建为选中状态
      {name:'日本', selected:true}//福建为选中状态
    ]
  }]
};

myChart.setOption(option);
//myChart.on('mouseover', function (params) {
//  var dataIndex = params.dataIndex;
//  console.log(params);
//});