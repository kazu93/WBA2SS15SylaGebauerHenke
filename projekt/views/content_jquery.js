/**
 * Created by havan on 29.08.2015.
 */

/*$(document).ready(function () {
    $(".dropdown-menu li").mouseover(function () {
        var text = $(this).text();
        $('#activity').text(text);
    });
});
*/
$(function(){
    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy',
        todayBtn: 'linked',
        language: 'de'
    });
});