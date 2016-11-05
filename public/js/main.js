var urlWeather = window.location.hostname === 'localhost' ?
    'http://localhost:8001/eidw' :
    'http://nodeappfm-fintanm.rhcloud.com/eidw';

var urlBuoy = window.location.hostname === 'localhost' ?
    'http://localhost:8001/dublinBuoy' :
    'http://nodeappfm-fintanm.rhcloud.com/dublinBuoy';

var urlDlData = window.location.hostname === 'localhost' ?
    'http://localhost:8001/dlData' :
    'http://nodeappfm-fintanm.rhcloud.com/dlData';

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
        var header = "<tr><th>time</th><th>wind (knts)</th><th>Height</th><th>Period</th><th>Water Temp</th></tr>"
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            rows=rows.concat('<tr>'+
                '<td>'+data[i].Time+'</td>'+
                '<td>'+ (data[i].Wind+' G'+ data[i].Gust+' '+ data[i].Dirn).replace(/\s+/g, '').replace(/kts+/g, ' ') + '</td>'+
                '<td>'+data[i].Height+'</td>'+
                '<td>'+data[i].Period+'</td>'+
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
        for (var i = 0; i < data.length; i++) {
            rows=rows.concat('<tr>'+
                '<td>'+data[i].time+'</td>'+
                '<td>'+data[i].temp+'</td>'+
                '<td>'+data[i].wind+'</td>'+
                '<td>'+data[i].dirn+'</td>'+
                '</tr>')
        };
        $("#dldata").append("<table class='table'>"+header+rows+"</table>")
        $("#dlspinner").hide();
    })
}



$( document ).ready(function() {
    getWeather();
    getBuoy();
    getdlData();
});

