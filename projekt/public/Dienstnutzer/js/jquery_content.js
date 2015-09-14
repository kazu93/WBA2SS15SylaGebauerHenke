$(function() {
    $("#ort li a").click(function(){
        $("#nationalpark").html($(this).html());
        $("#nationalpark").append(" <span class='caret'></span>");
        $("nationalpark").val($(this).text());
    });

    $("#aktivitat-menu li a").click(function(){
        $("#aktivitat").html($(this).html());
        $("#aktivitat").append(" <span class='caret'></span>");
        $("#aktivitat").val($(this).text());
    });

    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy',
        todayBtn: 'linked',
        language: 'de'
    });

    $(".search").click(function () {

        var park = $("#nationalpark").text();
        park = park.split("(");
        park[0] = park[0].trim();

        var activity = $("#aktivitat").text();
        activity = activity.trim();
        var date = $("[name=date]").val();

        $.ajax({
            method: "POST",
            url: "/search",
            data: {ort: park[0], activity: activity, datum: date},
            dataType: "json",
            success: function (data) {
                data = JSON.stringify(data);
                $(location).attr('href', '/redirect/' + data);
            }
            , error: function (jqXHR, textStatus, err) {
                alert('text status ' + textStatus + ', err ' + err)
            }
        });
    });

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
                alert("Gruppe erfolgreich angelegt!");
                location.reload();
            }
            , error: function (jqXHR, textStatus, err) {
                alert('text status ' + textStatus + ', err ' + err)
            }
        });

    });

    $(".inline").colorbox({inline:true, width: "400px", opacity: "0.5"});


    $("#login-submit").click(function(){
        var redirect = window.location.href;
        redirect = redirect.split('/');
       $("#login-form").attr("action", '/login/filterergebnis.ejs/'+redirect[4]);
    });


    $(".filter").change(function(){

        var filter = $(".filter option:selected").val();
        $("td:not(:contains("+ filter +"))").parent().fadeOut();
        $("td:contains("+filter+")").parent().fadeIn();

    });

    $(".sfilter").change(function(){

        var filter = $(".sfilter option:selected").val();
        $("td:not(:contains("+ filter +"))").parent().fadeOut();
        $("td:contains("+filter+")").parent().fadeIn();

    });
});