const electron = require('electron');
const { ipcRenderer }  = electron;


const loginBtn = document.querySelector('button')

loginBtn.addEventListener('click', (e)=>{

    e.preventDefault();
    const username = document.querySelector('.username').value 
    const password = document.querySelector('.password').value

    ipcRenderer.send("auth:login", {username: username, password: password});
    // ipcRenderer.send("popup:alert", {message: message});
})

