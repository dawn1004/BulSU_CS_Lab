const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const axios = require('axios');
var tcpPortUsed = require('tcp-port-used');



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow
let authWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1230,
    height: 720,
    resizable: false,
    show: false,
    webPreferences:{
      devTools: false,
      nodeIntegration: true,
    }
  });
  authWindow = new BrowserWindow({
    width: 800,
    height: 620,
    resizable: false,
    webPreferences:{
      devTools: false,
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './Views/index.html'));
  authWindow.loadFile(path.join(__dirname, './Views/login.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  authWindow.webContents.openDevTools();
  authWindow.setMenuBarVisibility(false);
  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// hot reloader
// try {
//   require('electron-reloader')(module)
// } catch (_) {}

//IPC EVENTS

ipcMain.on('app:close', (event) => {

  console.log("triggered")
  app.quit()

})



ipcMain.on('auth:login', (event, data) => {

  axios.get('http://localhost:3000/Users')
  .then(function (response) {
    const user = response.data[0]

    if(data.username == user.username && data.password == user.password){
      mainWindow.show()
      authWindow.hide()
     }else{
      const Alert1 = require("electron-alert");
      let alert = new Alert1();
      let swalOptions2 = {
        text: "Incorrect username or password",
        type: "warning",
        showCancelButton: false
      };
      alert.fireWithFrame(swalOptions2, null, true, false);

      return
     }

  })
  .catch(function (error) {
    console.log(error);
  })


})

ipcMain.on('change:username', (event, data) => {
  axios.get('http://localhost:3000/Users')
  .then(function (response) {
    const user = response.data[0]
    const Alert1 = require("electron-alert");
    let alert = new Alert1();

    if(data.username == "" || data.password == ""){
      alert.fireWithFrame({
        text: "Please complete the form",
        type: "warning",
        showCancelButton: false
      }, null, true, false);
      return  
   }

    if(data.username != "" && data.password == user.password){
        axios.put('http://localhost:3000/Users/1',
        {
          username: data.username,
          password: user.password
        })
        .then(function(res){

          alert.fireWithFrame({
            text: "USERNAME SUCCESSFULLY CHANGED",
            type: "success",
            showCancelButton: false
          }, null, true, false);
          return  

        })

     }else{

      alert.fireWithFrame({
        text: "Incorrect Password",
        type: "warning",
        showCancelButton: false
      }, null, true, false);
      return

     }

  })
  .catch(function (error) {
    console.log(error);
  })


})



ipcMain.on('change:password', (event, data) => {
  axios.get('http://localhost:3000/Users')
  .then(function (response) {
    const user = response.data[0]
    const Alert1 = require("electron-alert");
    let alert = new Alert1();
    let alertObject

    if(data.oldPassword == "" || data.newPassword == "" || data.confirmPassword == ""){
      alert.fireWithFrame({
        text: "Please complete the form",
        type: "warning",
        showCancelButton: false
      }, null, true, false);
      return  
    }

    if(user.password != data.oldPassword){
        alert.fireWithFrame({
          text: "INCORRECT PASSWORD",
          type: "warning",
          showCancelButton: false
        }, null, true, false);
        return  
    }
    else if (data.newPassword != data.confirmPassword){
        alert.fireWithFrame({
          text: "CONFIRM PASSWORD NOT MATCHED",
          type: "warning",
          showCancelButton: false
        }, null, true, false);
        return  
    }
    else{
        axios.put('http://localhost:3000/Users/1',
        {
            username: user.username,
            password: data.newPassword
        })
        .then(function(res){
            alert.fireWithFrame({
              text: "PASSWORD SUCCESSFULLY CHANGED",
              type: "success",
              showCancelButton: false
            }, null, true, false);
            return 
        })
 
    }

  })
  .catch(function (error) {
    console.log(error);
  })


})





ipcMain.on('popup:alert', (event,data) => {

  const Alert = require("electron-alert");

  let alert = new Alert();
  
  let swalOptions = {
    text: data.message,
    type: "warning",
    showCancelButton: false
  };
  
  alert.fireWithFrame(swalOptions, null, true, false);
})


//start of pdf thingiie

const {jsPDF} = require('jspdf')
require('jspdf-autotable')
var pdfview = require('electron-pdf-viewer');

ipcMain.on('print:table', (event,{data, date}) => {
  console.log(data)
  const doc = new jsPDF()

  doc.autoTable({
    head: [["Date: "+date]],
    theme:"plain"
  })
  doc.autoTable({
    head: [['Chemicals:']],
    theme:"plain"
  })
  doc.autoTable({
    head: [['Item Code', 'Item Name', 'Current Stock', 'On Borrowed', 'Total Stock']],
    body: data.chemicals
  })
  doc.autoTable({
    head: [['Apparatus:']],
    theme:"plain"
  })
  doc.autoTable({
    head: [['Item Code', 'Item Name', 'Current Stock', 'On Borrowed', 'Total Stock']],
    body: data.apparatus
  })

  let MD = date.split("-");
  switch(MD[1]){
    case "01":
      MD = 'January '+MD[0]
      break
    case "02":
      MD = 'February '+MD[0]
      break
    case "03":
      MD = 'March '+MD[0]
      break
    case "04":
      MD = 'April '+MD[0]
      break
    case "05":
      MD = 'May '+MD[0]
      break
    case "06":
      MD = 'June '+MD[0]
      break
    case "07":
      MD = 'July '+MD[0]
      break
    case "08":
      MD = 'August '+MD[0]
      break
    case "09":
      MD = 'September '+MD[0]
      break
    case "10":
      MD = 'October '+MD[0]
      break
    case "11":
      MD = 'November '+MD[0]
      break
    case "12":
      MD = 'December '+MD[0]
      break
  }
  // MD = MD[0]+'-'+MD[1];;

  doc.autoTable({
    head: [['Student Transaction in month of '+ MD]],
    theme:"plain"
  })
  doc.autoTable({
    head: [['Student #', 'Student Name', 'Section', 'Date Borrowed', 'Date Returned', "Apparatus", "Chemicals"]],
    body: data.history
  })
   

  doc.save(path.resolve(__dirname, '../table.pdf'))

//set pdf path
  var pdfurl = path.resolve(__dirname, '../table.pdf');  
  console.log(pdfurl)
  const displayPdfUrl = pdfview.getPdfHtmlURL(pdfurl);
  const options = {
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
  }
  var win = pdfview.showpdf(pdfurl, options);
  
  win.show();

  console.log("triggered")

})


//connect DB

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)



tcpPortUsed.check(3000, '127.0.0.1')
.then(function(inUse) {
    if(inUse==false){
        server.listen(3000, () => {
          console.log('JSON Server is running')
        })
    }else{
      console.log('Port 3000 usage: '+inUse);
    }
}, function(err) {
    console.error('Error on check:', err.message);
});

