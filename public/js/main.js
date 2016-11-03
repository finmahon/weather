var url = window.location.hostname === 'localhost' ?
    'http://localhost:8001/eidw' :
    'http://nodeappfm-fintanm.rhcloud.com/eidw';



function getWeather() {
    var body = {
        "code":"EIDW",
        "numReadings":"20"
    };

    $.post(url, body, function(data){
    	console.log('res', data);
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

$( document ).ready(function() {
    getWeather();
});

