console.log("boom")



function getWeather() {
    var body = {
        "code":"EIDW",
        "numReadings":"20"
    };

    $.post('http://localhost:8001/eidw', body, function(data){
    	console.log('res', data);
    	// $('#eidw').text(JSON.stringify(data.res));
        // $('<table><tr><td>.....</td></tr></table>').appendTo( '#eidw' );
        var data = data.res;
        var header = "<tr><th>time</th><th>temp</th><th>dew</th><th>wind</th><th>p</th><th>weather</th></tr>"
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            rows=rows.concat('<tr>'+
                '<td>'+data[i].time+'</td>'+
                '<td>'+data[i].temp+'</td>'+
                '<td>'+data[i].dew+'</td>'+
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

