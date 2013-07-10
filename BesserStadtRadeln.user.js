// ==UserScript==
// @name        BesserStadtRadeln
// @namespace   http://userscripts.org/users/spuelrich
// @include     https://stadtradeln.de/index.php?id=167*
// @include     https://www.stadtradeln.de/index.php?id=167*
// @require     https://stadtradeln.de/typo3conf/ext/sexybookmarks/res/jquery/js/jquery-1.8.2.min.js
// @version     14
// ==/UserScript==

/*
var comments = {};
$("#content tr")
    .find("td:eq(3)")
    .each(function(){comments[$(this).text()] = 1;});

var comments_arr = [];
for(var i in comments) {
    comments_arr.push(i);
}


var $veryfirstrow = $("#content form table tr:first");

var $originalinput = $("#content form table tr:last");

$originalinput
    .insertBefore($veryfirstrow)
    .hide();

var input_row_counter = 0;
function moreinput() {
    var $clone = $originalinput.clone();
    $clone
        .insertBefore($originalinput)
        .show();

    $clone.find("input[type=submit]").remove();
    $clone.find("td:last").attr("id", "poststate" + input_row_counter);

    $clone.find("input")
        .each(function(){this.name = this.name + input_row_counter;
                         this.id = this.name;
                        });
    $clone.find("input:eq(3)")
        .autocomplete({source: comments_arr});
    input_row_counter++;
}

for (var i=0;i<5;i++) {
    moreinput();
}
$("#content form table tr:last").insertBefore("#content form table tr:first");

var theurl = document.location.hostname.match("www") ? "http://www.stadtradeln.de/index.php?id=167" : "http://stadtradeln.de/index.php?id=167";


var $sendrow = $('<tr><td id="bettersend"/></tr>')
    .insertAfter($originalinput);

function sendstadtradeln (ev) {
    ev.preventDefault();
    var data_fields = ["sr_new_entry_date", "sr_new_route_time", "sr_new_route_comment", "sr_new_route_distance"];

    var running_posts = [];
    for (var i=0;i<input_row_counter;i++) {
        var pdata =
            {sr_action: "add_data",
             sr_new_route_persons: 1
            };

        for (var idx in data_fields) {
            pdata[data_fields[idx]] = $("#" + data_fields[idx] + i).val();
        }

        if (pdata["sr_new_route_distance"]) {
            running_posts[i] = 1;
            $("#poststate"+i).html("running");
            $.ajax({type: 'POST',
                    url: theurl,
                    data: pdata,
                    dataType: 'text',
                    context: {index: i},
                    success: function() {
                        running_posts[this.index] = 0;
                        $("#poststate"+this.index).html("done");
                        if ($.inArray(1, running_posts) < 0 ) {
                            document.location = theurl;
                        }
                    },
                   });
        }
    }
}

$('<a href="#">mehr</a>')
    .appendTo("#bettersend")
    .click(moreinput);

$('<a href="#">absenden</a>')
    .css({border: "solid black 1px",
          padding: "2px",
          background: "yellow"})
    .appendTo("#bettersend")
    .click(sendstadtradeln);
*/

function input_changed () {
    $(this)
        .siblings(':last')
        .text('geändert')
        .css('background-color', '#eecccc')
        .parent().addClass('besser_changed');
}

function do_besser_save () {
}

$(function() {
    var $originalinput = $('#radelkalender_form table tr:last');
    $('ul.socials').remove();
    $('iframe').remove();

    var $table = $('<table></table>');
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
            $zeile.append('<td><input type="text"/></td><td class="status">OK</td>');

            var $cells = $('td', this);
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
                }
                else {
                    val = $cells.eq(i).text();
                }
                $input.val(val);
            }

            $zeile.addClass('besser_update').appendTo($table);

        });
    for (var i=0;i<=5;i++) {
        var $zeile = $originalinput.clone();
        $('input[type=submit]', $zeile).remove();
        $('td input', $zeile)
            .prop('name', '')
            .prop('id', '');
        $zeile.append('<td/><td class="status">NEU</td>');
        $zeile.addClass('besser_new').appendTo($table);
    }

    $('tr.besser_update td').change(input_changed);
    $('tr.besser_new td').change(input_changed);

    $table.append('<tr><td><a id="besser_save" href="#">speichern</a></td></tr>');
    $('#besser_save').click(do_besser_save);

});
