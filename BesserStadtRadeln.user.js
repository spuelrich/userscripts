// ==UserScript==
// @name        BesserStadtRadeln
// @namespace   http://userscripts.org/users/spuelrich
// @include     https://stadtradeln.de/index.php?id=167*
// @include     https://www.stadtradeln.de/index.php?id=167*
// @require     https://stadtradeln.de/typo3conf/ext/sexybookmarks/res/jquery/js/jquery-1.8.2.min.js
// @version     16
// ==/UserScript==


var theurl = document.location.hostname.match("www") ? "https://www.stadtradeln.de/index.php?id=167" : "https://stadtradeln.de/index.php?id=167";
var data_fields = ["sr_new_entry_date", "sr_new_route_time", "sr_new_route_persons", "sr_new_route_comment", "sr_new_route_distance", "sr_new_entry_id"];

function input_changed () {
    $(this)
        .siblings(':last')
        .text('geändert')
        .css('background-color', '#ffff00')
        .parent().addClass('besser_changed');
}

var running_posts = 0;
function do_besser_save (ev) {
    ev.preventDefault();

    function ajax_update () {
        var pdata = {};

        var $cells = $('td', this);
        var statusID = $cells.eq(6).attr('id');
        for (var i=0; i<=5; i++) {
            pdata[data_fields[i]] = $cells.eq(i).children('input').val();
        }
        if (pdata.sr_new_route_persons==undefined || pdata.sr_new_route_persons == '') {
            pdata.sr_new_route_persons = 1;
        }
        if (parseInt(pdata.sr_new_entry_id) > 0) {
            pdata.sr_action = 'edit_data';
            }
        else {
            delete pdata.sr_new_entry_id;
            pdata.sr_action = 'add_data';
        }

        $('#'+statusID).css('background-color', '#ff8800').text('speichern...');

        running_posts++;
        $.ajax({type: 'POST',
                url: theurl,
                data: pdata,
                dataType: 'text',
                success: function() {
                    $('#'+statusID).css('background-color', '#00ff00').text('gespeichert');
                    if (--running_posts == 0) {
                        window.setTimeout(function(){document.location = theurl}, 1000);
                    }
                }
               });
    }
    $('.besser_changed').each(ajax_update);
}
var $originalinput;
var $table;
var moreInputCounter = 0;

function moreInput (ev) {
    if (ev) {
        ev.preventDefault();
    }
    var $zeile = $originalinput.clone();
    $('input[type=submit]', $zeile).remove();
    $('td input', $zeile)
        .prop('name', '')
        .prop('id', '');
    $zeile.append('<td/>', $('<td class="status">NEU</td>').attr('id', 'bessernew' + ++moreInputCounter));
    $zeile.addClass('besser_new').appendTo($table);
}

$(function() {
    $originalinput = $('#radelkalender_form table tr:last');
    $('ul.socials').remove();
    $('iframe').remove();

    $table = $('<table></table>');
    $table.insertBefore('form#radelkalender_form');

    $('tr')
        .filter(function(){
            var $td = $(this).children('td').first();
            if ($td.prop('colspan')>1)
                return false;
            if (!$td.hasClass('nobreaks'))
                return false;
            return true;
        })
        .each(function() {
            var $zeile = $originalinput.clone()
            $('input[type=submit]', $zeile).remove();
            $zeile.append('<td><input type="text"/></td>');
            var $cells = $('td', this);
            var ID;
            for (var i=0;i<=5;i++) {
                var $input = $('td input', $zeile).eq(i);
                $input
                    .prop('name', '')
                    .prop('id', '');
                var val;
                if (i == 4) {
                    // km als Zahl
                    var $km = $cells.eq(i);
                    $km.text().match(/^(\d+)/);
                    val = RegExp.$1;
                }
                else if (i == 5) {
                    // ID einfügen
                    $('a:eq(1)', $cells.eq(i)).prop('href').match(/entry_id=([0-9]+)/);
                    val = RegExp.$1;
                    ID = val;
                    $input.prop('disabled', true);
                }
                else {
                    val = $cells.eq(i).text();
                }
                $input.val(val);
            }
            $zeile.append($('<td class="status">OK</td>').attr('id', 'besserupdate'+ID));

            $zeile.addClass('besser_update').appendTo($table);

        });
    for (var i=0;i<=5;i++) {
        moreInput();
    }

    $('tr.besser_update td').change(input_changed);
    $('tr.besser_new td').change(input_changed);

    $('<div><a id="besser_save" href="#">speichern</a>&nbsp;<a id="besser_more" href="#">mehr Zeilen für Neueingabe</a></div>')
        .insertAfter($table);
    $('#besser_save').click(do_besser_save);
    $('#besser_more').click(moreInput);

});
