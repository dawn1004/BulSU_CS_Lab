let transPage =1;
let trans_targetSearch =""
const trans_pageNumber = document.querySelector(".trans_pageNumber")
trans_pageNumber.innerHTML = transPage

function transPrev(){
  if(transPage != 1){
    transPage = transPage-1;
    trans_pageNumber.innerHTML = transPage
    getAllTransactions()
  }
}
function transNext(){
  transPage = transPage+1;
  trans_pageNumber.innerHTML = transPage
  getAllTransactions()
}


function getAllTransactions(){
    axios.get(`http://localhost:3000/Transactions?_page=${transPage}&_limit=7&_sort=id&_order=desc`)
    .then(function (response) {
      let tr="";
      let tbody = document.querySelector(".tbody-transactions");

      response.data.forEach((item,index)=>{
          tr+=`<tr>
                <td >${index+1}</td>
                <td>${item.student_num}</td>
                <td>${item.student_name}</td>
                <td>${item.date_borrowed}</td>
                <td>${item.return_date}</td>
                <td >
                <svg 
                class="view-icon"
                onclick="showReturnDialog(${item.id})" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="25px" height="25px"><g><rect fill="none" height="24" width="24"/><path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.11,3,19,3z M19,19H5V7h14V19z M13.5,13 c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5S13.5,12.17,13.5,13z M12,9c-2.73,0-5.06,1.66-6,4 c0.94,2.34,3.27,4,6,4s5.06-1.66,6-4C17.06,10.66,14.73,9,12,9z M12,15.5c-1.38,0-2.5-1.12-2.5-2.5c0-1.38,1.12-2.5,2.5-2.5 c1.38,0,2.5,1.12,2.5,2.5C14.5,14.38,13.38,15.5,12,15.5z"/></g></svg>

              </tr>`;
      })

      tbody.innerHTML = tr;

    })
    .catch(function (error) {
      console.log(error);
    })
}
getAllTransactions()

function openBarrowModal(){
    let modal = document.querySelector(".add-trans-modal-bg")
    modal.style.display="block"

    //adding of checkbox elements
    axios.get('http://localhost:3000/Apparatus')
    .then(function (response) {
      let textBoxes = "";
      const textboxContainer = document.querySelector(".apparatus-textfield-container");

      response.data.forEach(item=>{
        textBoxes+=`
            <div class="form-group row px-4">
                <label  class="col-sm-4 col-form-label">${item.itemName}</label>
                <div class="col-sm-4">
                <input type="number" 
                id="appa^${item.id}"
                class="form-control apparatus-textfield"
                value="0"
                >
                </div>
            </div>`
      })
      textboxContainer.innerHTML =textBoxes;
    })
    .catch(function (error) {
      console.log(error);
    })

    axios.get('http://localhost:3000/Chemicals')
    .then(function (response) {
      let textBoxes = "";
      const textboxContainer = document.querySelector(".chemicals-textfield-container");

      response.data.forEach(item=>{
        textBoxes+=`
            <div class="list-chemss form-group row px-4">
                <label  class=" col-form-label">${item.itemName}</label>
                <div class="">
                <input type="number" 
                id="chems^${item.id}"
                class="form-control chems-textfield"
                value="0"
                >
                </div>
            </div>`
      })
      textboxContainer.innerHTML =textBoxes;
    })
    .catch(function (error) {
      console.log(error);
    })

}

function closeBorrowModal(){
    let modal = document.querySelector(".add-trans-modal-bg")
    modal.style.display="none"
}

function saveTransaction(){
    const formstudentNo = document.querySelector("#formstudentNo").value
    const formstudentName = document.querySelector("#formstudentName").value
    const formProfName = document.querySelector("#formProfName").value
    const formReturnDate = document.querySelector("#formReturnDate").value
    const formSubject = document.querySelector("#formSubject").value
    const formSection = document.querySelector("#formSection").value
    var reg = new RegExp('^[0-9]+$');
    if(
      formSubject=="" || formSection == "" || formstudentNo == "" || 
      formstudentName =="" || formProfName=="" || formReturnDate==""){
        ipcRenderer.send("popup:alert", {message: "Please complete the form"});
        return
    }else if(formstudentName.length > 26){
        ipcRenderer.send("popup:alert", {message: "Name must not exceed 26 characters"});
        return
    }else if(isNaN(formstudentNo)){
      ipcRenderer.send("popup:alert", {message: "Student number must be valid number"});
      // document.querySelector("#formstudentNo").classList.add("is-invalid")
      return
    }

    checkTextFieldApparatus()
}

function checkTextFieldApparatus(){
    const textFields = document.querySelectorAll(".apparatus-textfield");

    let barrowedIdArray = [];

    textFields.forEach(tf=>{
        if(tf.value != 0){
            let id =tf.id.split("^")[1];
            let borrowed = parseInt(tf.value);
            barrowedIdArray.push({id: id, borrowed: borrowed});
        }
    })
    addTransaction(barrowedIdArray);

    textFields.forEach(tf=>{
        if(tf.value != 0){
            let id =tf.id.split("^")[1];
            let addvalue = parseInt(tf.value);

            axios.get(`http://localhost:3000/Apparatus/${id}`)
            .then(function (response) {
                item=response.data;
                item.Qty= item.Qty-addvalue
                item.borrowed = item.borrowed+addvalue

                axios.put(`http://localhost:3000/Apparatus/${id}`,item)
                .then(function (response) {
                  console.log(response.data);
                //   addTransaction();

                })
                .catch(function (error) {
                  console.log(error);
                })
            })
            .catch(function (error) {
              console.log(error);
            })
        }
        
    })
}

function checkAddChems(){
    const textFields = document.querySelectorAll(".chems-textfield");
    let barrowedIdArray = [];

    textFields.forEach(tf=>{
        if(tf.value != 0){
            let id =tf.id.split("^")[1];
            let borrowed = parseInt(tf.value);
            barrowedIdArray.push({id: id, borrowed: borrowed});
        }
    })
    return(barrowedIdArray);
}

function decrementChemicals(chems){
    console.log("chemsssssssssssss")
    chems.forEach(chem=>{
        axios.get(`http://localhost:3000/Chemicals/${chem.id}`)
        .then(function (response) {
            item=response.data;
            item.Qty= item.Qty-chem.borrowed
            item.borrowed = item.borrowed+chem.borrowed

            axios.put(`http://localhost:3000/Chemicals/${chem.id}`,item)
            .then(function (response) {
              console.log(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        })
        .catch(function (error) {
          console.log(error);
        })
    })
}

function addTransaction(apparatus){
    
    const formstudentNo = document.querySelector("#formstudentNo").value
    const formstudentName = document.querySelector("#formstudentName").value
    const formProfName = document.querySelector("#formProfName").value
    const formReturnDate = document.querySelector("#formReturnDate").value
    const formSubject = document.querySelector("#formSubject").value
    const formSection = document.querySelector("#formSection").value
    const date_borrowed = new Date().toISOString().slice(0, 10);
    const chemicals = checkAddChems()

    decrementChemicals(chemicals)


    // updateDailyReport(chemicals,apparatus)

    let endpoint=""; 

    if(apparatus.length > 0){
      endpoint="Transactions"
    }else{
      endpoint="History"
    }

    axios.post(`http://localhost:3000/${endpoint}`,{
        student_num: formstudentNo,
        student_name: formstudentName,
        subject: formSubject,
        section: formSection,
        prof_name: formProfName,
        date_borrowed: date_borrowed,
        return_date: formReturnDate,
        chemicals: chemicals,
        apparatus: apparatus
    })
    .then(function (response) {
      console.log(response.data);
      setTimeout(() => {
        location.reload(); 
      }, 500);
    })
    .catch(function (error) {
      console.log(error);
    })
}


//update the daily report
// function updateDailyReport(chemicals, apparatus){
//     const today = new Date().toISOString().slice(0, 10);

//     axios.get(`http://localhost:3000/DailyReports?date=${today}`)
//     .then(function (response) {
//       let reports = response.data[0];

//       chemicals.forEach(chem=>{
//         reports.chemicals.forEach(repchem=>{
//           if(chem.id == repchem.id){
//             repchem.borrowed+=chem.borrowed;
//           }
//         })
//       })

//       apparatus.forEach(appa=>{
//         reports.apparatus.forEach(repappa=>{
//           if(appa.id == repappa.id){
//             repappa.borrowed+= appa.borrowed;
//           }
//         })
//       })


//       axios.put(`http://localhost:3000/DailyReports/${reports.id}`,reports)
//       .then(function (response) {
//       })
//       .catch(function (error) {
//         console.log(error);
//       })


//     })
//     .catch(function (error) {
//       console.log(error);
//     })  
// }


function showReturnDialog(id){
  const dialog = document.querySelector(".return-barrowed-dialog")
  dialog.style.display= "block";
  listToReturn(id)

}

function hideReturnDialog(){
  const dialog = document.querySelector(".return-barrowed-dialog")
  dialog.style.display= "none";
}


let TargetTrans;
let returnState = []
function listToReturn(id){
  returnState=[]
  TargetTrans=""
  let tbody = document.querySelector(".table-return-item");
  const transNum = document.querySelector(".trans-num")
  let tr=""

        axios.get(`http://localhost:3000/Transactions/${id}`)
        .then(function (response) {
          let transaction = response.data;
          transNum.innerHTML = transaction.id;
          TargetTrans = transaction.id;

          const returnInfo = document.querySelector(".return-barrowed-info")

          let infos = `
          <div class="returnee-info">
            <p>Student #: <span> ${transaction.student_num} </span> </p>
            <p>Name: <span> ${transaction.student_name} </span> </p>
            <p>subject: <span> ${transaction.subject} </span> </p>
            <p>section: <span> ${transaction.section} </span> </p>
            <p>prof_name: <span> ${transaction.prof_name} </span> </p>
            <p>date_borrowed: <span> ${transaction.date_borrowed} </span> </p>
            <p>return_date: <span> ${transaction.return_date} </span> </p>
          </div>
          `



          returnInfo.innerHTML = infos
        
          const apparatus = transaction.apparatus;

          apparatus.forEach(item=>{
            axios.get(`http://localhost:3000/Apparatus/${item.id}`)
            .then(function (response) {
              
              returnState.push({aparatusID: response.data.id ,  damage: 0, borrowed: item.borrowed})

              console.log(TargetTrans)
                tr+= `<tr>
                        <td>${response.data.itemName}</td>
                        <td>${item.borrowed}</td>
                        <td>
                        <input 
                          type="number" 
                          value="0" 
                          min="0" 
                          max="${item.borrowed}"
                          onchange="updateCurrentReturnItem(${response.data.id}, this.value)"
                          class="form-control" 
                          style="width: 90px;"
                          onKeyDown="return false"
                        >
                        </td>
                      </tr>`;

                tbody.innerHTML = tr;
            })
            .catch(function (error) {
              console.log(error);
            })

          })
          


          
        })
        .catch(function (error) {
          console.log(error);
        })
}



function updateCurrentReturnItem(id, value){

  console.log(TargetTrans)
  returnState.forEach(item=>{
    if(item.aparatusID == id){
      item.damage = value;
    }
  })

  console.log(returnState)
}


// TargetTrans;
// returnState: aparatusID, damage, borrowed

//remove trasaction and move to history
//add (borrowed_apparatus-damage) to apparatus qty


function returnTransaction(){
  
  axios.get(`http://localhost:3000/Transactions/${TargetTrans}`)
  .then(function (response) {
    let history =response.data;
    history.returned_date = new Date().toISOString().slice(0, 10)
    // history.id = null
    delete history["id"]
    axios.post(`http://localhost:3000/History`,history)
    .then(function (response) {
      console.log(response.data);
      // setTimeout(() => {
      //   location.reload(); 
      // }, 500);
    })
    .catch(function (error) {
      console.log(error);
    })

    axios.delete(`http://localhost:3000/Transactions/${TargetTrans}`)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })


  })
  .catch(function (error) {
    console.log(error);
  })

  
  returnState.forEach(item=>{

    axios.get(`http://localhost:3000/Apparatus/${item.aparatusID}`)
    .then(function (response) {
          
          let appa = response.data;

          appa.borrowed= appa.borrowed - item.borrowed;
          appa.Qty = appa.Qty+(item.borrowed-item.damage)
          appa.damage+=parseInt(item.damage);

          axios.put(`http://localhost:3000/Apparatus/${item.aparatusID}`,appa)
          .then(function (response) {
            console.log(response.data);
            setTimeout(() => {
              location.reload(); 
            }, 500);
          })
          .catch(function (error) {
            console.log(error);
          })
    })
    .catch(function (error) {
      console.log(error);
    })

  })
  

}



