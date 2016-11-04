var urlWeather = window.location.hostname === 'localhost' ?
    'http://localhost:8001/eidw' :
    'http://nodeappfm-fintanm.rhcloud.com/eidw';

var urlBuoy = window.location.hostname === 'localhost' ?
    'http://localhost:8001/dublinBuoy' :
    'http://nodeappfm-fintanm.rhcloud.com/dublinBuoy';

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
        $("#eidw").append("<table class='table'>"+header+rows+"</table>")


    })
}

function getBuoy() {
    $.get(urlBuoy, function(data){
        // console.log('res', data);
        // $('#eidw').text(JSON.stringify(data.res));
        // $('<table><tr><td>.....</td></tr></table>').appendTo( '#eidw' );
        var data = data.res;
        var header = "<tr><th>time</th><th>wind</th><th>Height</th><th>Period</th><th>Water Temp</th></tr>"
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            rows=rows.concat('<tr>'+
                '<td>'+data[i].Time+'</td>'+
                '<td>'+data[i].Wind+' G'+ data[i].Gust+' '+ data[i].Dirn+ '</td>'+
                '<td>'+data[i].Height+'</td>'+
                '<td>'+data[i].Period+'</td>'+
                '<td>'+data[i].WaterTemp+'</td>'+
                '</tr>')
        };
        $("#buoy").append("<table class='table'>"+header+rows+"</table>")


    })
}



$( document ).ready(function() {
    getWeather();
    getBuoy();
});

