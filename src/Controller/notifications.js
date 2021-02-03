
let week = new Date();
week.setDate(week.getDate() + 7);
week = week.toISOString().slice(0, 10)

const today = new Date().toISOString().slice(0, 10);

function getToExpireAndCritical(){

    axios.get('http://localhost:3000/Chemicals')
    .then(function (response) {
        const chemicals = response.data;
        const notiContainer = document.querySelector(".noti-container")
        let container = "";

        chemicals.forEach(chem=>{
            if(chem.expiration <= week){
                let dateDiff = new Date(chem.expiration) - new Date(today)
                dateDiff = dateDiff / (1000 * 60 * 60 * 24);

                if(dateDiff <=0){
                    container+=`
                    <div class="noti">
                        <p class="date-noti">Date Today: <span >${today}</span></p>
                        <p class="body-noti">The ${chem.itemName} has been expired last ${chem.expiration}</p>
                    </div>`
                }else{
                    container+=`
                    <div class="noti">
                        <p class="date-noti">Date Today: <span >${today}</span></p>
                        <p class="body-noti">The ${chem.itemName} will be expire on ${chem.expiration}</p>
                    </div>`
                }


            }
            
            if(chem.Qty <=30){
                container+=`
                <div class="noti">
                    <p class="date-noti">Date Today: <span >${today}</span></p>
                    <p class="body-noti">The ${chem.itemName} is on a critical level. ${chem.Qty+ chem.measurement} left</p>
                </div>`
            }
        })

        notiContainer.innerHTML += container;
        
        
        
    })
    .catch(function (error) {
      console.log(error);
    })



    //appa

    axios.get('http://localhost:3000/Apparatus')
    .then(function (response) {
        const apparatus = response.data;
        const notiContainer = document.querySelector(".noti-container")
        let container = "";

        apparatus.forEach(appa=>{
            
            if(appa.Qty <=30){
                container+=`
                <div class="noti">
                    <p class="date-noti">Date Today: <span >${today}</span></p>
                    <p class="body-noti">The ${appa.itemName} is on a critical level. ${appa.Qty+ appa.measurement} left</p>
                </div>`
            }
        })

        notiContainer.innerHTML += container;
    })
    .catch(function (error) {
      console.log(error);
    })




}
getToExpireAndCritical()




function itemDueDate(){

    axios.get('http://localhost:3000/Transactions')
    .then(function (response) {
        const transactions = response.data;
        const notiContainer = document.querySelector(".noti-container")
        let container = "";

        transactions.forEach(trans=>{
            
            if(trans.return_date <= today){
                container+=`
                <div class="noti">
                    <p class="date-noti">Date Today: <span >${today}</span></p>
                    <p class="body-noti">NOTE: Borrowed item Needed To be Return</p>
                    <p class="body-noti">Transaction number: #${trans.id}</p>
                    <p class="body-noti">Student Name: ${trans.student_name}</p>
                    <p class="body-noti">Student No.: #${trans.student_num}</p>
                    <p class="body-noti">Promised To returned at: #${trans.return_date}</p>
                </div>`
            }
        })

        notiContainer.innerHTML += container;
    })
    .catch(function (error) {
      console.log(error);
    })
}
itemDueDate()




// const { Notification } = require('electron')

// function showNotification () {
//     const notification = {
//       title: 'Basic Notification',
//       body: 'Notification from the Main process'
//     }
//     new Notification(notification).show()
//   }
  
//   setTimeout(() => {
//     showNotification()
//   }, 2000);