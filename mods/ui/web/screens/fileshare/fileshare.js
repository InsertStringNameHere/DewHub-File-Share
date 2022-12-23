var mapName = "mainmenu";
var tabIndex = 0;
var activePage;
dew.command('bind F10 game.showscreen fileshare');

dew.on("show", function(e) {
    if(!jQuery.isEmptyObject(e.data)){
        switch(e.data){
            case "maps":
                tabIndex = 0;
            break;
            case "gametypes":
                tabIndex = 1;
            break;
            case "mods":
                tabIndex = 2;
            break;
            default:
        }
    }else {
        tabIndex = 0;
    }
    $('#fileShareWindow').hide();
    $('#blackLayer').hide();
    dew.getSessionInfo().then(function(i){
        mapName = i.mapName;
        if(i.mapName == "mainmenu"){
            $('#blackLayer').fadeIn(200, function() {
                dew.command('Game.HideH3UI 1');
                $('#fileShareWindow').show();
                $('#blackLayer').show();
                initActive();
            }).fadeOut(200);
        } else {
            alertBox('File Share cannot be accessed while in-game');
        }
    });
});

dew.on('hide', function(e){
    dew.command('Game.HideH3UI 0');
});

$(document).ready(function(){
    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            if(!activePage.endsWith('alertBox')){
                effectReset();
            }
            else{
                hideAlert();
            }
        }
        if (e.keyCode == 44) {
            dew.command('Game.TakeScreenshot');  
        }
    });
    $(document).keydown(function(e){
        if(e.keyCode == 192 || e.keyCode == 223){
            dew.show('console');
        }
    });

    $('.tabs li a').off('click').on('click',function(e){
        $('.tabs li').removeClass('selected');
        $(this).parent().addClass('selected');
        activePage = e.target.hash;
    });

    $('#cancelButton').off('click').on('click', function(e){
        effectReset();
    });

    $('#okButton').off('click').on('click', function(){
        hideAlert(true);
    });
});

exiting = false;
function effectReset(){
    if(exiting)
        return;
    exiting = true;

    dew.command('Game.PlaySound 0x0B04');
    dew.getSessionInfo().then(function(i){
        if(i.mapName == "mainmenu"){
            $('#blackLayer').fadeIn(200, function(){
                dew.command('Game.HideH3UI 0');
                $('#fileShareWindow').hide();
                $('#blackLayer').fadeOut(200, function(){
                    dew.hide();
                    $('#fileShareWindow').show();
                    exiting = false;
                });
            });
        }else{
            dew.hide();
            exiting = false;
        }
    })
}

function initActive()
{
    $('.selected').removeClass('selected');
    $('.tabs li:visible').eq(tabIndex).addClass('selected');
    location.hash = $('.selected a')[0].hash;
    activePage = window.location.hash;
}

function alertBox(alertText)
{
    $('#wDescription').text(alertText);
    $('#alertBox').fadeIn(100);
    activePage = activePage+'alertBox';
    dew.command('Game.PlaySound 0x0B02');
}

function hideAlert(sound){
    $('#alertBox').hide();
    effectReset();
    if(sound)
    {
        dew.command('Game.PlaySound 0x0B04');
    }
}