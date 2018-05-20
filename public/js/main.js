var urlWeather = window.location.hostname === 'localhost' ?
    'http://localhost:8001/eidw' :
    'http://wind-dublin-weather.1d35.starter-us-east-1.openshiftapps.com/eidw';

var urlBuoy = window.location.hostname === 'localhost' ?
    'http://localhost:8001/dublinBuoy' :
    'http://wind-dublin-weather.1d35.starter-us-east-1.openshiftapps.com/dublinBuoy';

var urlDlData = window.location.hostname === 'localhost' ?
    'http://localhost:8001/dlData/current' :
    'http://wind-dublin-weather.1d35.starter-us-east-1.openshiftapps.com/dlData/current';

var urlDlWindData = window.location.hostname === 'localhost' ?
    'http://localhost:8001/dlData/wind' :
    'http://wind-dublin-weather.1d35.starter-us-east-1.openshiftapps.com/dlData/wind';

function getWeather() {
    var body = {
        "code":"EIDW",
        "numReadings":"20"
    };

    $.post(urlWeather, body, function(data){
    	// console.log('res', data);
    	// $('#eidw').text(JSON.stringify(data.res));
        // $('<table><tr><td>.....</td></tr></table>').appendTo( '#eidw' );
        var data = data.res;
        var header = "<tr><th>time</th><th>temp</th><th>wind</th><th>p</th><th>weather</th></tr>"
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            rows=rows.concat('<tr>'+
                '<td>'+data[i].time+'</td>'+
                '<td>'+data[i].temp+'</td>'+
                '<td>'+data[i].spd+'</td>'+
                '<td>'+data[i].pressure+'</td>'+
                '<td>'+data[i].weather+'</td>'+
                '</tr>')
        };
        $("#eidw").append("<table class='table'>"+header+rows+"</table>");
        $("#eidwspinner").hide();
    })
}

function getBuoy() {
    $.get(urlBuoy, function(data){
        // console.log('res', data);
        // $('#eidw').text(JSON.stringify(data.res));
        // $('<table><tr><td>.....</td></tr></table>').appendTo( '#eidw' );
        var data = data.res;
        var header = "<tr><th>time</th><th>wind (knts)</th><th>Height</th><th>Water Temp</th></tr>"
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            rows=rows.concat('<tr>'+
                '<td>'+data[i].Time+'</td>'+
                '<td>'+ ( data[i].Wind ?   (data[i].Wind+' G'+ data[i].Gust+' '+ data[i].Dirn).replace(/\s+/g, '').replace(/kts+/g, ' ') : '-') + '</td>'+
                '<td>'+( data[i].Height ?  data[i].Height : '-')+'</td>'+
                '<td>'+data[i].WaterTemp.replace(/\s+/g, '')+'</td>'+
                '</tr>')
        };
        $("#buoy").append("<table class='table'>"+header+rows+"</table>")
        $("#buoyspinner").hide();
    })
}

function getdlData() {
    $.get(urlDlData, function(data){
        // console.log('res', data);
        // $('#eidw').text(JSON.stringify(data.res));
        // $('<table><tr><td>.....</td></tr></table>').appendTo( '#eidw' );
        var data = data.res;
        var header = "<tr><th>Time</th><th>Temp</th><th>Wind</th><th>Dirn</th></tr>"
        var rows = '';

        rows=rows.concat('<tr>'+
            '<td>'+data[0].substr(18,100)+'</td>'+
            '<td>' + data[6].substr(17,100).replace(/\s/g, '')   +'</td>'+
            '<td>'+parseFloat(data[2].split(":")[1].split('kts')[0])
                +'G' + parseFloat(data[3].split(":")[1].split('kts')[0])
                +'</td>'+
            '<td>'+ data[1].split(":")[1].substr(1,200).replace(/\s/g, '') + '</td>'+
            '</tr>')

        $("#dldata").append("<table class='table'>"+header+rows+"</table>");

        $("#dldata").append("<p>"+data[15].replace(/\s\s/g, '')+ '<br>' +
            data[16].replace(/\s\s/g, '')+ '<br>' +
            data[17].replace(/\s\s/g, '')+ '<br>' +
            data[18].replace(/\s\s/g, '')+ '<br>' +
            "</p>");


        $("#dlspinner").hide();
    })
}

function getdlWindData() {
    $.get(urlDlWindData, function(data){

        var data = data.res;
        var header = "<tr><th>Time</th><th>Temp</th><th>Wind</th><th>Dirn</th></tr>"
        var rows = '';

        for (var i = 0; i < data.length; i++) {
            rows=rows.concat('<tr>'+
                '<td>'+data[i].time+'</td>'+
                '<td>'+data[i].temp+'</td>'+
                '<td>'+data[i].wind+'</td>'+
                '<td>'+data[i].dirn+'</td>'+
                '</tr>');
        }
        $("#dlwinddata").append("<table class='table'>"+header+rows+"</table>")
        $("#dlwindspinner").hide();
    })
}




$( document ).ready(function() {
    getWeather();
    getBuoy();
    getdlData();
    getdlWindData();
});

