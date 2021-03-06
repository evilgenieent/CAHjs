var socket = io();
var self;

var gameSocket;

socket.on("userinfo",function(userinfo)
{
    sessionStorage.setItem("id",userinfo.id);
    var self = userinfo;

    console.log("Connected!");
});

socket.on("join",JoinGame);

socket.on("reconnected",function(userinfo)
{
    self = userinfo;
    console.log("Reconnected!");
});

socket.on("avatar",function(avatar)
{
    sessionStorage.setItem("avatar",avatar);
    $(".usercontent img.circle").attr("src","../images/profiles/" + sessionStorage.getItem("avatar"));

    if(gameSocket != null)
        gameSocket.emit("avatar",avatar);
})

if(sessionStorage.getItem("id") != null)
{
    socket.emit("reconnectme",sessionStorage.getItem("id"));
}
else
{
    console.log("Connecting...");
    socket.emit("connectme");
}

function JoinGame(gameid)
{
    window.location.href = "/game/" + gameid;
}

if(window.location.href.Contains("menu"))
{
    if(sessionStorage.getItem("name") == null)
    {
        sessionStorage.setItem("redirect",window.location.href);
        window.location.href = "../..";
    }
}
else if(!window.location.href.Contains("game"))
{
    if(sessionStorage.getItem("name") != null)
    {
        window.location.href = "menu";
    }
}
else
{
    var gameid = window.location.href.split('/game/')[1];
    //remove ending '/' if it is added to the url
    gameid.replace('/','');

    socket.emit("joinedGame",gameid);
}

function Login()
{
    var name = $("input#name").val();
    name = name.SafeForWeb();
    sessionStorage.setItem("name",name);

    socket.emit("name",name);

    if(sessionStorage.getItem("redirect") != null)
    {
        var href = sessionStorage.getItem("redirect");
        sessionStorage.setItem("redirect",null);

        window.location.href = href;
    }
    else
    {
        window.location.href = "/menu";
    }
}

function CreateGame()
{
    socket.emit("createGame");
}

function ChangeAvatar()
{
    socket.emit("changeavatar");
}

function ChangeName()
{
    var name = $("input#newname").val();
    name = name.SafeForWeb();
    sessionStorage.setItem("name",name);
    $(".usercontent span.name").html(sessionStorage.getItem("name"));

    socket.emit("name",name);

    if(gameSocket != null)
        gameSocket.emit("changedname",name);
}

$(window).ready(function()
{
    $("body").append(sidebar);
    $('input#name').focus();
    $('input#name').keyup(function(e)
    {
        if(e.keyCode == 13)
        {
            Login();
        }
    });

    $(".button-collapse").sideNav({
        onClose: function(el) { $("div.header a.button-collapse i").toggleClass("rotated")}
    });
    $(".button-collapse").click(function() { $("div.header a.button-collapse i").toggleClass("rotated")});

    $('.modal').modal();

    $(".usercontent img.circle").attr("src","../images/profiles/" + sessionStorage.getItem("avatar"));
    $(".usercontent span.name").html(sessionStorage.getItem("name"));
    $(".usercontent span.email").html("not logged in.");

    $("input#newname").val(sessionStorage.getItem("name"));

    Materialize.updateTextFields();
});