var mapName = "mainmenu";
var tabIndex = 0;
var activePage;
var subPages = ['#page4','#page5','#page6'];
dew.command('bind F10 game.showscreen fileshare');
loadMaps();
loadVariants();
loadMods();

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
                cancelButton();
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
        cancelButton();
    });

    $('#okButton').off('click').on('click', function(e){
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
    cancelButton();
    if(sound)
    {
        dew.command('Game.PlaySound 0x0B04');
    }
}

function switchPage(pageNumber){
    pageHash='#page'+pageNumber
    location.href=pageHash;
    activePage=pageHash;
    if(subPages.indexOf(pageHash) != -1)
    {
        $('#cancelButton').html('Back');
    }
    else
    {
        $('#cancelButton').html('Close');
    }
}

function cancelButton()
{   
    if (window.location.hash == '#page4')
    {
        $('#cancelButton').html('Close');
        switchPage(1);
    }
    else if (window.location.hash == '#page5')
    {
        $('#cancelButton').html('Close');
        switchPage(2);
    } 
    else if (window.location.hash == '#page6')
    {
        $('#cancelButton').html('Close');
        switchPage(3);
    }
    else
    {
        effectReset();
    }
}

function getVariantData(variantFile)
{
    let variantName = null;
    if (variantFile.includes(".slayer"))
    {
        variantName = 'Slayer';
    }
    if (variantFile.includes(".ctf"))
    {
        variantName = 'Capture the Flag';
    }
    if (variantFile.includes(".koth"))
    {
        variantName = 'King of the Hill'; 
    }
    if (variantFile.includes(".zombiez"))
    {
        variantName = 'Infection';
    }
    if (variantFile.includes(".assault"))
    {
        variantName = 'Assault';
    }
    if (variantFile.includes(".vip"))
    {
        variantName = 'VIP';
    }
    if (variantFile.includes(".jugg"))
    {
        variantName = 'Juggernaut';
    }
    if (variantFile.includes(".terries"))
    {
        variantName = 'Territories';
    }
    if (variantFile.includes(".oddball"))
    {
        variantName = 'Oddball';
    }

    return variantName;
}

function getVariantImage(variantFile)
{
    let variantImage = null;
    if (variantFile.includes(".slayer"))
    {
        variantImage = 'images\\variants\\slayer.png';
    }
    if (variantFile.includes(".ctf"))
    {
        variantImage = 'images\\variants\\ctf.png';
    }
    if (variantFile.includes(".koth"))
    {
        variantImage = 'images\\variants\\koth.png';   
    }
    if (variantFile.includes(".zombiez"))
    {
        variantImage = 'images\\variants\\infection.png';
    }
    if (variantFile.includes(".assault"))
    {
        variantImage = 'images\\variants\\assault.png';
    }
    if (variantFile.includes(".vip"))
    {
        variantImage = 'images\\variants\\vip.png';
    }
    if (variantFile.includes(".jugg"))
    {
        variantImage = 'images\\variants\\juggernaut.png';
    }
    if (variantFile.includes(".terries"))
    {
        variantImage = 'images\\variants\\territories.png';
    }
    if (variantFile.includes(".oddball"))
    {
        variantImage = 'images\\variants\\oddball.png';
    }

    return variantImage;
}

function loadMaps()
{
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/maps/");
    xhttp.send();
    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            var newHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let [i, object] of objects.entries()) 
            {
                newHTML += '<div id="itemBackground" onclick="switchPage(4);loadMapInfo('+object['id']+');">';
                newHTML += '<div id="imageContainer">';
                newHTML += '<img src="https://api.zgaf.io/static/maps/'+object['id']+'/0" alt="memes">';
                newHTML += '</div>';
                newHTML += '<h2>'+object['mapName']+'</h2>';
                newHTML += '<h3>Author: '+object['mapAuthor']+'</h3>';
                newHTML += '<h3>Type: '+object['mapTags']+'</h3>';
                newHTML += '<h3>Downloads: '+object['map_downloads']+'</h3>';
                newHTML += '</div>';  
            } 
        }
        document.getElementById("mapCards").innerHTML = newHTML;
    }
}

function loadVariants()
{
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/variants/");
    xhttp.send();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var newHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let [i, object] of objects.entries()) 
            {
                newHTML += '<div id="itemBackground" onclick="switchPage(5);loadGametypeInfo('+object['id']+');">';
                newHTML += '<div id="imageContainer">';
                newHTML += '<img src="'+getVariantImage(object['variantFileName'])+'" alt="memes">';
                newHTML += '</div>';
                newHTML += '<h2>'+object['variantName']+'</h2>';
                newHTML += '<h3>Author: '+object['variantAuthor']+'</h3>';
                newHTML += '<h3>Type: '+getVariantData(object['variantFileName'])+'</h3>';
                newHTML += '<h3>Downloads: '/*+object['variant_downloads']+*/+0+'</h3>';
                newHTML += '</div>';  
            }
        }
        document.getElementById("variantCards").innerHTML = newHTML;
    }
}

//when buckyUwU adds mods to the API 
function loadMods()
{
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/mods/");
    xhttp.send();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var newHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let [i, object] of objects.entries()) 
            {
                newHTML += '<div id="itemBackground" onclick="switchPage(6)">';
                newHTML += '<div id="imageContainer">';
                newHTML += '<img src="https://api.zgaf.io/static/mods/'+object['id']+'/0" alt="memes">';
                newHTML += '</div>';
                newHTML += '<h2>'+object['modName']+'</h2>';
                newHTML += '<h3>Author: '+object['modAuthor']+'</h3>';
                newHTML += '<h3>Type: '+object['modTags']+'</h3>';
                newHTML += '<h3>Downloads: '+object['mod_downloads']+'</h3>';
                newHTML += '</div>';
            }
        }
        document.getElementById("modCards").innerHTML = newHTML;
    }
}

function getUser(userId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.zgaf.io/api_v1/users/" + userId, false);
    xmlHttp.send();
    const user = JSON.parse(xmlHttp.response);
  
    return user
}

function loadMapInfo(mapId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.zgaf.io/api_v1/maps/" + mapId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var newHTML = '';
            const mapData = JSON.parse(xmlHttp.responseText);
            user = getUser(mapData["owner_id"]);

            newHTML += '<div id="mapImageBackground">'; 
            newHTML += '<div id="mapImageContainer">';
            newHTML += '<img src="https://api.zgaf.io/static/maps/'+mapId+'/0" alt="memes">';
            newHTML += '</div>';
            newHTML += '</div>';
            newHTML += '<div id="mapInfoContainer">';
            newHTML += '<h2>'+mapData["mapName"]+'</h2>';
            newHTML += '<h3>'+mapData["mapDescription"]+'</h3>';
            newHTML += '<h3>Author: '+mapData["mapAuthor"]+'</h3>';
            newHTML += '<h3>Uploaded By: '+user["name"]+'</h3>';
            newHTML += '<h3>Uploaded: '+mapData["time_created"]+'</h3>';
            newHTML += '<h3>Last Updated: '+mapData["time_updated"]+'</h3>';
            newHTML += '<h3>Total Objects: '+mapData["mapTotalObject"]+'</h3>';
            newHTML += '<h3>Scenario Objects: '+mapData["mapScnrObjectCount"]+'</h3>';
            newHTML += '<h3>Downloads: '+mapData["map_downloads"]+'</h3>';
            newHTML += '<h3>ID: '+mapData["id"]+'</h3>';
            newHTML += '<h3>Tags: '+mapData["mapTags"]+'</h3>';
            newHTML += '</div>';
            newHTML += '<div id="mapDownloadContainer">';
            newHTML += '<button id="mapDownloadButton">Download Map</button>';
            newHTML += '<button id="variantDownloadButton">Download Gametype</button>';
            newHTML += '<h3>(Insert Progress Bar Here)</h3>';
            newHTML += '<h3>Done! (Completion or Error Message?)</h3>';
            newHTML += '</div>';
        }
        document.getElementById("mapInfo").innerHTML = newHTML;
    }
}

function loadGametypeInfo(variantId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.zgaf.io/api_v1/variants/" + variantId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var newHTML = '';
            const variantData = JSON.parse(xmlHttp.responseText);
            user = getUser(variantData["owner_id"]);

            newHTML += '<div id="gametypeImageBackground">';
            newHTML += '<div id="gametypeImageContainer">';
            newHTML += '<img src="'+getVariantImage(variantData['variantFileName'])+'" alt="memes">';
            newHTML += '</div>';
            newHTML += '</div>';
            newHTML += '<div id="gametypeInfoContainer">';
            newHTML += '<h2>'+variantData['variantName']+'</h2>';
            newHTML += '<h3>'+variantData['variantDescription']+'</h3>';
            newHTML += '<h3>Author: '+variantData['variantAuthor']+'</h3>';
            newHTML += '<h3>Uploaded By: '+user["name"]+'</h3>';
            newHTML += '<h3>Uploaded: '+variantData['time_created']+'</h3>';
            newHTML += '<h3>Last Updated: '+variantData['time_updated']+'</h3>';
            newHTML += '<h3>Downloads: '+variantData['variant_downloads']+'</h3>';
            newHTML += '<h3>ID: '+variantData['id']+'</h3>';
            newHTML += '<h3>Type: '+getVariantData(variantData['variantFileName'])+'</h3>';
            newHTML += '</div>';
            newHTML += '<div id="gametypeDownloadContainer">';
            newHTML += '<button id="variantDownloadButton">Download Gametype</button>';
            newHTML += '<h3>(Insert Progress Bar Here)</h3>';
            newHTML += '<h3>Done! (Completion or Error Message?)</h3>';
            newHTML += '</div>';
        }
        document.getElementById("gametypeInfo").innerHTML = newHTML;
    }
}

//again, when buckyUwU adds mods to the API 
function loadModInfo(modId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.zgaf.io/api_v1/mods/" + modId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var newHTML = '';
            const modData = JSON.parse(xmlHttp.responseText);
            user = getUser(modData["owner_id"]);

            newHTML += '<div id="modImageBackground">';
            newHTML += '<div id="modImageContainer">';
            newHTML += '<img src="https://api.zgaf.io/static/mods/'+modId+'/0" alt="memes">';
            newHTML += '</div>';
            newHTML += '</div>';
            newHTML += '<div id="modInfoContainer">';
            newHTML += '<h2>'+modData['modName']+'</h2>';
            newHTML += '<h3>'+modData['modDescription']+'</h3>';
            newHTML += '<h3>Author: '+modData['modAuthor']+'</h3>';
            newHTML += '<h3>Uploaded By: '+user["name"]+'</h3>';
            newHTML += '<h3>Uploaded: '+modData['time_created']+'</h3>';
            newHTML += '<h3>Last Updated: '+modData['time_updated']+'</h3>';
            newHTML += '<h3>Downloads: '+modData['mod_downloads']+'</h3>';
            newHTML += '<h3>ID: '+modData['id']+'</h3>';
            newHTML += '<h3>Tags: '+modData['modTags']+'</h3>';
            newHTML += '</div>';
            newHTML += '<div id="modDownloadContainer">';
            newHTML += '<button id="modDownloadButton">Download Mod</button>';
            newHTML += '<h3>(Insert Progress Bar Here)</h3>';
            newHTML += '<h3>Done! (Completion or Error Message?)</h3>';
            newHTML += '</div>';
        }
        document.getElementById("modInfo").innerHTML = newHTML;
    }
}