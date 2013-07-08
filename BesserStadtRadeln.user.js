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

$(function() {
    console.log("jijij");
    $('ul.socials').remove();

    var $table = $('<table></table>');
    $table.insertBefore('form#radelkalender_form');
    $table.append('<tr><td>ahhuuuuha</td></tr>');

    $('tr')
        .filter(function(){
            var $td = $(this).children('td').first();
            if ($td.prop('colspan')>1)
                return false;
            if (!$td.hasClass('nobreaks'))
                return false;
            return true;
        })
        .clone()
    .each(function() {
        var $lastcell = $('td:nth-child(6)', this);

        var link = $('a:eq(1)', $lastcell).prop('href');
        //$lastcell.remove();
        link.match(/entry_id=([0-9]+)/);
        $lastcell.html(RegExp.$1);
    })
        .appendTo($table);
    //.css('background-color', 'red');
});
