function stringify(f) {
    return JSON.stringify(f);
}
function getElement(f) {
    return document.getElementById(f);
}
let ws;
function submit() {
    if (window.location.pathname == '/') {
        ws.send(JSON.stringify(['edit', getElement('edit').value, '/main']))
        //document.getElementById('title').innerHTML = "Main Page";
    } else {
        ws.send(JSON.stringify(['edit', getElement('edit').value, window.location.pathname]))
    }
    window.location.href = '/'
}
window.onload = function () {
    if (window.location.protocol == 'http:') {
        ws = new WebSocket('ws://' + window.location.host);
    } else {
        ws = new WebSocket('wss://' + window.location.host);
    }
    params = new URLSearchParams(window.location.search);
    edit = params.get('edit')
    if (params.get('edit') == null) {
        edit = false
    } else {
        edit = true;
    }
    if (window.location.pathname == '/') {
        ws.onopen = function () {
            ws.send(stringify(['page', '/main']));
        }
        document.getElementById('title').innerHTML = "Main Page";
    } else {
        ws.onopen = function () {
            ws.send(stringify(['page', window.location.pathname]));
        }
        document.getElementById('title').innerHTML = window.location.pathname
    }
    ws.onmessage = function (f) {
        message = JSON.parse(f.data);
        console.log(message);
        if (message[0] == 'page') {
            //getElement('content').innerHTML = message[1];
            clean = message[1];
            clean = clean.split('<iframe')[0]
            clean = clean.split('<script')[0];
            if (edit) {
                getElement('edit').value = clean;
            } else {
                getElement('content').innerHTML = clean;
            }
        }
    }
}