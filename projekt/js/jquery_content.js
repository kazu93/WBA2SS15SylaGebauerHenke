

$(function() {
    $("#ort li a").click(function(){
        $("#nationalpark").html($(this).html());
        $("#nationalpark").append(" <span class='caret'></span>");
        $("nationalpark").val($(this).text());
    });
});

$(function() {
    $("#aktivitat-menu li a").click(function(){
        $("#aktivitat").html($(this).html());
        $("#aktivitat").append(" <span class='caret'></span>");
        $("#aktivitat").val($(this).text());
    });
});
$(function() {
    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy',
        todayBtn: 'linked',
        language: 'de'
    });
});

$(function() {
    $(".search").click(function () {

        var park = $("#nationalpark").text();
        park = park.split("(");
        park[0] = park[0].trim();

        var activity = $("#aktivitat").text();
        activity = activity.trim();
        var datum = $(".container").attr("name", "date").text();

        $.ajax({
            method: "POST",
            url: "/search",
            data: {ort: park[0], activity: activity, datum: "01.09.2015"},
            dataType: "json",
            success: function (data) {
                data = JSON.stringify(data);
                alert(data);
                $(location).attr('href', '/redirect/' + data);
            }
            , error: function (jqXHR, textStatus, err) {
                alert('text status ' + textStatus + ', err ' + err)
            }
        });
    });
});

$(function() {
    $("#bestaetigen").click(function () {

        var ort = $("[name=ort]").val();
        var activity = $("[name=activity]").val();
        var teilnehmerzahl = $("[name=teilnehmerzahl]").val();
        var schwierigkeit = $("[name=schwierigkeit]").val();
        var dauer = $("[name=dauer]").val();
        var date = $("[name=dateform]").val();
        var time = $("[name=time]").val();
        var treffpunkt = $("[name=treffpunkt]").val();

        var park = ort;
        park = park.split("(");
        park[0] = park[0].trim();

        $.ajax({
            method: "POST",
            url: "/new",
            data: {ort: park[0], activity: activity, datum: date, teilnehmerzahl: teilnehmerzahl, schwierigkeit : schwierigkeit, dauer : dauer, time : time, treffpunkt : treffpunkt},
            dataType: "json",
            success: function (data) {
                alert(data);
            }
            , error: function (jqXHR, textStatus, err) {
                alert('text status ' + textStatus + ', err ' + err)
            }
        });

    });
});