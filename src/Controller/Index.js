const electron = require('electron')
const  axios = require('axios')
//Navigations



const links = document.querySelectorAll(".nav-links li")

links.forEach((link, index) => {
  link.addEventListener('click',()=>{
    const home = document.querySelector("#home");
    const transaction = document.querySelector("#transaction");
    const apparatus = document.querySelector("#apparatus");
    const chemical = document.querySelector("#chemical");
    const report = document.querySelector("#report");
    const ActivityLog = document.querySelector("#ActivityLog");
    const TransHistory = document.querySelector("#TransHistory");
    const theCritical = document.querySelector("#theCritical");
    const DueDate = document.querySelector("#DueDate");
    const Settings = document.querySelector("#Settings");
    home.style.display = "none"
    transaction.style.display = "none"
    apparatus.style.display = "none"
    chemical.style.display = "none"
    report.style.display = "none"
    ActivityLog.style.display = "none"
    TransHistory.style.display = "none"
    theCritical.style.display = "none"
    DueDate.style.display = "none"
    Settings.style.display = "none"

    where(index);

    links.forEach(link=>{
      
      link.style.background = "rgba(0, 0, 0, 0)";
    })
    link.style.background ="rgba(0, 0, 0, 0.144)";


  })
});

const where =(index)=>{
  localStorage.setItem('where', index)
  if(index == 0) {
    home.style.display = "block"
  }
  else if(index == 1) {
    transaction.style.display = "block"
  }
  else if(index == 2) {
    apparatus.style.display = "block"
  }
  else if(index == 3) {
    chemical.style.display = "block"
  }
  else if(index == 4) {
    ActivityLog.style.display = "block"
  }
  else if(index == 5) {
    TransHistory.style.display = "block"
  }
  else if(index == 6){
    theCritical.style.display = "block"
    getCritical();
  }
  else if(index == 7 ){
    //DueDate
    DueDate.style.display = "block"
  }
  else if(index == 8) {
    createDayStock();
    report.style.display = "block"

  }
  else if(index == 9){
    Settings.style.display = "block"
  }
  else if(index == 10){
    home.style.display = "block"
    ipcRenderer.send("app:close");
  }
}

console.log(localStorage.getItem('where'))
if(localStorage.getItem('where') != null){
  where(localStorage.getItem('where'))
}else{
  where(0)
}

// localStorage.setItem('where', 'home')
// alert(localStorage.getItem('myCat'))




// /home


const loopDisplay = ()=>{
  setTimeout(() => {
      const card1 = document.querySelector(".caro-1");
      const card2 = document.querySelector(".caro-2");
      const card3 = document.querySelector(".caro-3");


      if(card1.classList.contains("active")){
        card1.classList.remove("active")
        card2.classList.add("active")
      }else if(card2.classList.contains("active")){
        card2.classList.remove("active")
        card3.classList.add("active")
      }else if(card3.classList.contains("active")){
        card3.classList.remove("active")
        card1.classList.add("active")
      }

    loopDisplay()

  }, 5000);
}


  loopDisplay()
