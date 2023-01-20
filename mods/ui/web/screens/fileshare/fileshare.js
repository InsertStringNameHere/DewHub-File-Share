var mapName = "mainmenu";
var tabIndex = 0;
var activePage;
var subPages = ['#page5','#page6','#page7','#page8'];
var downloadType = "";
var downloadName = "";
var downloadFileName = "";
var entryType = "";
var dependencyType = "";
var dependencyName = "";
var dependencyFileName = "";
dew.command('bind F10 game.showscreen fileshare');
loadMaps();
loadVariants();
loadPrefabs();
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
        clearData();
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
    if (window.location.hash == '#page5')
    {
        $('#cancelButton').html('Close');
        switchPage(1);
        clearData();
    }
    else if (window.location.hash == '#page6')
    {
        $('#cancelButton').html('Close');
        switchPage(2);
        clearData();
    } 
    else if (window.location.hash == '#page7')
    {
        $('#cancelButton').html('Close');
        switchPage(3);
        clearData();
    }
    else if (window.location.hash == '#page8')
    {
        $('#cancelButton').html('Close');
        switchPage(4);
        clearData();
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

function equalizeEntries(count)
{
    newHTML = '';
    if (count % 3 === 2)
    {
        newHTML += '<div id="invisItemBackground">';
        newHTML += '</div>';
    }
    if (count % 3 === 1)
    {
        newHTML += '<div id="invisItemBackground">';
        newHTML += '</div>';
        newHTML += '<div id="invisItemBackground">';
        newHTML += '</div>';
    }

    return newHTML;
}

function clearData()
{
    newHTML = '';
    document.getElementById("mapInfo").innerHTML = newHTML;
    document.getElementById("variantInfo").innerHTML = newHTML;
    document.getElementById("prefabInfo").innerHTML = newHTML;
    document.getElementById("modInfo").innerHTML = newHTML;
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
            var entries = 0;
            var newHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let [i, object] of objects["items"].entries()) 
            {
                newHTML += '<div id="itemBackground" onclick="switchPage(5);loadMapInfo('+object['id']+');">';
                newHTML += '<div id="imageContainer">';
                newHTML += '<img src="https://api.zgaf.io/static/maps/'+object['id']+'/0" alt="memes">';
                newHTML += '</div>';
                newHTML += '<h2>'+object['mapName']+'</h2>';
                newHTML += '<h3>Author: '+object['mapAuthor']+'</h3>';
                newHTML += '<h3>Type: '+object['mapTags']+'</h3>';
                newHTML += '<h3>Downloads: '+object['map_downloads']+'</h3>';
                newHTML += '</div>';
                entries++;
            }
            newHTML += equalizeEntries(entries);

            if (objects == null)
            {
                newHTML = '';
                newHTML += '<div id="emptyBackground">';
                newHTML += '<div id="emptyContainer">';
                newHTML += '<h2>No Maps Found</h2>';
                newHTML += '</div>';
                newHTML += '</div>';
            }
        }
        else
        {
            newHTML = '';
            newHTML += '<div id="emptyBackground">';
            newHTML += '<div id="emptyContainer">';
            newHTML += '<h2>Unable to Connect to Server</h2>';
            newHTML += '</div>';
            newHTML += '</div>';
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
            var entries = 0;
            var newHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let [i, object] of objects["items"].entries()) 
            {
                newHTML += '<div id="itemBackground" onclick="switchPage(6);loadVariantInfo('+object['id']+');">';
                newHTML += '<div id="imageContainer">';
                newHTML += '<img src="'+getVariantImage(object['variantFileName'])+'" alt="memes">';
                newHTML += '</div>';
                newHTML += '<h2>'+object['variantName']+'</h2>';
                newHTML += '<h3>Author: '+object['variantAuthor']+'</h3>';
                newHTML += '<h3>Type: '+getVariantData(object['variantFileName'])+'</h3>';
                newHTML += '<h3>Downloads: '+object['downloads']+'</h3>';
                newHTML += '</div>';
                entries++;  
            }
            newHTML += equalizeEntries(entries);

            if (objects == null)
            {
                newHTML = '';
                newHTML += '<div id="emptyBackground">';
                newHTML += '<div id="emptyContainer">';
                newHTML += '<h2>No Variants Found</h2>';
                newHTML += '</div>';
                newHTML += '</div>';
            }
        }
        else
        {
            newHTML = '';
            newHTML += '<div id="emptyBackground">';
            newHTML += '<div id="emptyContainer">';
            newHTML += '<h2>Unable to Connect to Server</h2>';
            newHTML += '</div>';
            newHTML += '</div>';
        }
        document.getElementById("variantCards").innerHTML = newHTML;
    }
}

function loadPrefabs()
{
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.zgaf.io/api_v1/prefabs");
    xhttp.send();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var entries = 0;
            var newHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let [i, object] of objects["items"].entries()) 
            {
                newHTML += '<div id="itemBackground" onclick="switchPage(7);loadPrefabInfo('+object['id']+');">';
                newHTML += '<div id="imageContainer">';
                newHTML += '<img src="https://api.zgaf.io/static/prefabs/'+object['id']+'/0" alt="memes">';
                newHTML += '</div>';
                newHTML += '<h2>'+object['prefabName']+'</h2>';
                newHTML += '<h3>Author: '+object['prefabAuthor']+'</h3>';
                newHTML += '<h3>Type: '+object['prefabTags']+'</h3>';
                newHTML += '<h3>Downloads: '+object['downloads']+'</h3>';
                newHTML += '</div>';
                entries++;
            }
            newHTML += equalizeEntries(entries);

            if (objects == null)
            {
                newHTML = '';
                newHTML += '<div id="emptyBackground">';
                newHTML += '<div id="emptyContainer">';
                newHTML += '<h2>No Prefabs Found</h2>';
                newHTML += '</div>';
                newHTML += '</div>';
            }
        }
        else
        {
            newHTML = '';
            newHTML += '<div id="emptyBackground">';
            newHTML += '<div id="emptyContainer">';
            newHTML += '<h2>Unable to Connect to Server</h2>';
            newHTML += '</div>';
            newHTML += '</div>';
        }
        document.getElementById("prefabCards").innerHTML = newHTML;     
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
            var entries = 0;
            var newHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let [i, object] of objects["items"].entries()) 
            {
                newHTML += '<div id="itemBackground" onclick="switchPage(8);loadModInfo('+object['id']+');">';
                newHTML += '<div id="imageContainer">';
                newHTML += '<img src="https://api.zgaf.io/static/mods/'+object['id']+'/0" alt="memes">';
                newHTML += '</div>';
                newHTML += '<h2>'+object['modName']+'</h2>';
                newHTML += '<h3>Author: '+object['modAuthor']+'</h3>';
                newHTML += '<h3>Type: '+object['modTags']+'</h3>';
                newHTML += '<h3>Downloads: '+object['mod_downloads']+'</h3>';
                newHTML += '</div>';
                entries++;
            }
            newHTML += equalizeEntries(entries);

            if (objects == null)
            {
                newHTML = '';
                newHTML += '<div id="emptyBackground">';
                newHTML += '<div id="emptyContainer">';
                newHTML += '<h2>No Mods Found</h2>';
                newHTML += '</div>';
                newHTML += '</div>';
            }
        }
        else
        {
            newHTML = '';
            newHTML += '<div id="emptyBackground">';
            newHTML += '<div id="emptyContainer">';
            newHTML += '<h2>Unable to Connect to Server</h2>';
            newHTML += '</div>';
            newHTML += '</div>';
        }
        document.getElementById("modCards").innerHTML = newHTML;
    }
}

function generateLoadingScreen(info)
{
    newHTML = '';
    newHTML += '<div id="emptyBackground">';
    newHTML += '<div id="emptyContainer">';
    newHTML += '<h2>Loading</h2>';
    newHTML += '</div>';
    newHTML += '</div>';
    document.getElementById(info).innerHTML = newHTML;    
}

function getUser(userId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.zgaf.io/api_v1/users/" + userId, false);
    xmlHttp.send();
    const user = JSON.parse(xmlHttp.response);
  
    return user
}

function downloadFile(id)
{
    type = downloadType;
    entryName = downloadName;
    file = downloadFileName;

    switch (type)
    {
        case "map":
            entryType = "maps";
        break;
        case "variant":
            entryType = "variants";
        break;
        case "prefab":
            entryType = "prefabs";
        break;
        case "mod":
            entryType = "mods";
        break;
    }

    input = 'Fileshare.DownloadFile https://api.zgaf.io/api_v1/'+entryType+'/'+id+'/file '+type+' "'+entryName+'" "'+file+'"';

    dew.command(input);
}

function downloadDependency(id)
{
    type = dependencyType;
    entryName = dependencyName;
    file = dependencyFileName;
    entryType = "maps";

    input = 'Fileshare.DownloadFile https://api.zgaf.io/api_v1/'+entryType+'/'+id+'/variant/file '+type+' "'+entryName+'" "'+file+'"';

    dew.command(input);
}

function loadMapInfo(mapId)
{
    generateLoadingScreen("mapInfo");

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.zgaf.io/api_v1/maps/" + mapId);
    xmlHttp.send();

    var newXmlHttp = new XMLHttpRequest();
    newXmlHttp.open( "GET", "https://api.zgaf.io/api_v1/maps/" + mapId + "/variant");
    newXmlHttp.send();

    newXmlHttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            const variantData = JSON.parse(newXmlHttp.responseText);

            dependencyType = "variant";
            dependencyName = variantData["variantName"];
            dependencyFileName = variantData['variantFileName'];
        }
    } 

    xmlHttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var newHTML = '';
            const mapData = JSON.parse(xmlHttp.responseText);
            user = getUser(mapData["owner_id"]);

            downloadType = "map";
            downloadName = mapData["mapName"];
            downloadFileName = "sandbox.map";

            newHTML += '<div id="mapImageBackground">'; 
            newHTML += '<div id="mapImageContainer">';
            newHTML += '<img src="https://api.zgaf.io/static/maps/'+mapId+'/0" alt="memes">';
            newHTML += '</div>';
            newHTML += '</div>';
            newHTML += '<div id="mapInfoContainer">';
            newHTML += '<h2>'+mapData["mapName"]+'</h2>';
            newHTML += '<h3>'+mapData["mapDescription"]+'</h3>';
            newHTML += '<h3>Author: '+mapData["mapAuthor"]+'</h3>';
            if (mapData["mapUserDesc"] != mapData["mapDescription"] && mapData["mapUserDesc"] != mapData["mapName"] && mapData["mapUserDesc"] != null)
            {
                newHTML += '<h3>About: '+mapData['mapUserDesc']+'</h3>';
            }
            newHTML += '<h3>Uploaded By: '+user["name"]+'</h3>';
            newHTML += '<h3>Uploaded: '+mapData["time_created"]+'</h3>';
            if (mapData["time_updated"] != null)
            {
                newHTML += '<h3>Last Updated: '+mapData["time_updated"]+'</h3>';
            }
            newHTML += '<h3>Total Objects: '+mapData["mapTotalObject"]+'</h3>';
            newHTML += '<h3>Scenario Objects: '+mapData["mapScnrObjectCount"]+'</h3>';
            newHTML += '<h3>Downloads: '+mapData["map_downloads"]+'</h3>';
            newHTML += '<h3>ID: '+mapData["id"]+'</h3>';
            newHTML += '<h3>Tags: '+mapData["mapTags"]+'</h3>';
            newHTML += '</div>';
            newHTML += '<div id="mapDownloadContainer">';
            newHTML += '<button id="mapDownloadButton" onclick="downloadFile('+mapData["id"]+')">Download Map</button>';
            if (mapData["variant_id"] == null)
            {
                newHTML += '<button id="disabledVariantDownloadButton">Download Variant</button>';
            }
            else
            {
                newHTML += '<button id="variantDownloadButton" onclick="downloadDependency('+mapData["id"]+')">Download Variant</button>';
            }
            //newHTML += '<h3>(Insert Progress Bar Here)</h3>';
            //newHTML += '<h3>Done! (Completion or Error Message?)</h3>';
            newHTML += '</div>';
        }
        else
        {
            newHTML = '';
            newHTML += '<div id="emptyBackground">';
            newHTML += '<div id="emptyContainer">';
            newHTML += '<h2>An Error Occured While Attempting to Retrieve Map Data</h2>';
            newHTML += '</div>';
            newHTML += '</div>';
        }
        document.getElementById("mapInfo").innerHTML = newHTML;
    }
}

function loadVariantInfo(variantId)
{
    generateLoadingScreen("variantInfo");

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

            downloadType = "variant";
            downloadName = variantData["variantName"];
            downloadFileName = variantData['variantFileName'];

            newHTML += '<div id="variantImageBackground">';
            newHTML += '<div id="variantImageContainer">';
            newHTML += '<img src="'+getVariantImage(variantData['variantFileName'])+'" alt="memes">';
            newHTML += '</div>';
            newHTML += '</div>';
            newHTML += '<div id="variantInfoContainer">';
            newHTML += '<h2>'+variantData['variantName']+'</h2>';
            newHTML += '<h3>'+variantData['variantDescription']+'</h3>';
            newHTML += '<h3>Author: '+variantData['variantAuthor']+'</h3>';
            newHTML += '<h3>Uploaded By: '+user["name"]+'</h3>';
            newHTML += '<h3>Uploaded: '+variantData['time_created']+'</h3>';
            if (variantData["time_updated"] != null)
            {
                newHTML += '<h3>Last Updated: '+variantData["time_updated"]+'</h3>';
            }
            newHTML += '<h3>Downloads: '+variantData['downloads']+'</h3>';
            newHTML += '<h3>ID: '+variantData['id']+'</h3>';
            newHTML += '<h3>Tags: '+getVariantData(variantData['variantFileName'])+'</h3>';
            newHTML += '</div>';
            newHTML += '<div id="variantDownloadContainer">';
            newHTML += '<button id="variantDownloadButton" onclick="downloadFile('+variantData["id"]+')">Download Variant</button>';
            //newHTML += '<h3>(Insert Progress Bar Here)</h3>';
            //newHTML += '<h3>Done! (Completion or Error Message?)</h3>';
            newHTML += '</div>';
        }
        else
        {
            newHTML = '';
            newHTML += '<div id="emptyBackground">';
            newHTML += '<div id="emptyContainer">';
            newHTML += '<h2>An Error Occured While Attempting to Retrieve Variant Data</h2>';
            newHTML += '</div>';
            newHTML += '</div>';
        }
        document.getElementById("variantInfo").innerHTML = newHTML;
    }
}

function loadPrefabInfo(prefabId)
{
    generateLoadingScreen("prefabInfo");

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.zgaf.io/api_v1/prefabs/" + prefabId);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var newHTML = '';
            const prefabData = JSON.parse(xmlHttp.responseText);
            user = getUser(prefabData["owner_id"]);

            downloadType = "prefab";
            downloadName = prefabData["prefabName"];
            downloadFileName = prefabData['prefabFileName'];

            newHTML += '<div id="prefabImageBackground">';
            newHTML += '<div id="prefabImageContainer">';
            newHTML += '<img src="https://api.zgaf.io/static/prefabs/'+prefabId+'/0" alt="memes">';
            newHTML += '</div>';
            newHTML += '</div>';
            newHTML += '<div id="prefabInfoContainer">';
            newHTML += '<h2>'+prefabData['prefabName']+'</h2>';
            newHTML += '<h3>'+prefabData['prefabDescription']+'</h3>';
            newHTML += '<h3>Author: '+prefabData['prefabAuthor']+'</h3>';
            newHTML += '<h3>Uploaded By: '+user["name"]+'</h3>';
            newHTML += '<h3>Uploaded: '+prefabData['time_created']+'</h3>';
            if (prefabData["time_updated"] != null)
            {
                newHTML += '<h3>Last Updated: '+prefabData["time_updated"]+'</h3>';
            }
            newHTML += '<h3>Downloads: '+prefabData['downloads']+'</h3>';
            newHTML += '<h3>ID: '+prefabData['id']+'</h3>';
            newHTML += '<h3>Tags: '+prefabData['prefabTags']+'</h3>';
            newHTML += '</div>';
            newHTML += '<div id="prefabDownloadContainer">';
            newHTML += '<button id="prefabDownloadButton" onclick="downloadFile('+prefabData["id"]+')">Download Prefab</button>';
            //newHTML += '<h3>(Insert Progress Bar Here)</h3>';
            //newHTML += '<h3>Done! (Completion or Error Message?)</h3>';
            newHTML += '</div>';

        }
        else
        {
            newHTML = '';
            newHTML += '<div id="emptyBackground">';
            newHTML += '<div id="emptyContainer">';
            newHTML += '<h2>An Error Occured While Attempting to Retrieve Prefab Data</h2>';
            newHTML += '</div>';
            newHTML += '</div>';
        }
        document.getElementById("prefabInfo").innerHTML = newHTML;
    }
}

//again, when buckyUwU adds mods to the API 
function loadModInfo(modId)
{
    generateLoadingScreen("modInfo");

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

            downloadType = "mod";
            downloadName= modData["modName"];
            downloadFileName = modData['modFileName'];

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
            if (modData["time_updated"] != null)
            {
                newHTML += '<h3>Last Updated: '+modData["time_updated"]+'</h3>';
            }
            newHTML += '<h3>Downloads: '+modData['mod_downloads']+'</h3>';
            newHTML += '<h3>ID: '+modData['id']+'</h3>';
            newHTML += '<h3>Tags: '+modData['modTags']+'</h3>';
            newHTML += '</div>';
            newHTML += '<div id="modDownloadContainer">';
            newHTML += '<button id="modDownloadButton" onclick="download('+modData["id"]+')">Download Mod</button>';
            //newHTML += '<h3>(Insert Progress Bar Here)</h3>';
            //newHTML += '<h3>Done! (Completion or Error Message?)</h3>';
            newHTML += '</div>';
        }
        else
        {
            newHTML = '';
            newHTML += '<div id="emptyBackground">';
            newHTML += '<div id="emptyContainer">';
            newHTML += '<h2>An Error Occured While Attempting to Retrieve Mod Data</h2>';
            newHTML += '</div>';
            newHTML += '</div>';
        }
        document.getElementById("modInfo").innerHTML = newHTML;
    }
}