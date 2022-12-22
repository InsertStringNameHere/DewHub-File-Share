dew.command('bind F10 game.showscreen fileshare');

var mapName = "mainmenu";
dew.on("show", function() {
    $('#fileShareWindow').hide();
    $('#blackLayer').hide();
    dew.getSessionInfo().then(function(i){
        mapName = i.mapName;
        if(i.mapName == "mainmenu"){
            $('#blackLayer').fadeIn(200, function() {
                dew.command('Game.HideH3UI 1');
                $('#fileShareWindow').show();
                $('#blackLayer').show();
            }).fadeOut(200);
        } else {
            $('#fileShareWindow').show();
        }
    });
});

dew.on('hide', function(e){
    dew.command('Game.HideH3UI 0');
});

$(document).ready(function(){
    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            effectReset();
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

    $('#cancelButton').off('click').on('click', function(e){
        effectReset();
    });
});

exiting = false;
function effectReset(){
    // Prevent escape spamming
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