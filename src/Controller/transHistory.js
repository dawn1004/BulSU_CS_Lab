let transHistoryPage =1;
const transHis_pageNumber = document.querySelector(".transHis_pageNumber")
transHis_pageNumber.innerHTML = transHistoryPage


function getTransHistory(){
    axios.get(`http://localhost:3000/History?_sort=id&_order=desc&_page=${transHistoryPage}&_limit=5`)
    .then(function (response) {
        console.log(response)
        let tr="";
        let tbody = document.querySelector(".tbody-transHistory-item");

        response.data.forEach((item, index)=>{
            tr+=`<tr>
                <td >${index+1}</td>
                <td>${item.student_num}</td>
                <td>${item.student_name}</td>
                <td>${item.date_borrowed}</td>
                <td>${item.return_date}</td>
                <td >
                <svg 
                class="view-icon"
                onclick="ViewTransactionItemHistory(${item.id})" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="25px" height="25px"><g><rect fill="none" height="24" width="24"/><path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.11,3,19,3z M19,19H5V7h14V19z M13.5,13 c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5S13.5,12.17,13.5,13z M12,9c-2.73,0-5.06,1.66-6,4 c0.94,2.34,3.27,4,6,4s5.06-1.66,6-4C17.06,10.66,14.73,9,12,9z M12,15.5c-1.38,0-2.5-1.12-2.5-2.5c0-1.38,1.12-2.5,2.5-2.5 c1.38,0,2.5,1.12,2.5,2.5C14.5,14.38,13.38,15.5,12,15.5z"/></g></svg>
                </td>
            </tr>`;
        })
  
        tbody.innerHTML = tr;
  
      })
      .catch(function (error) {
        console.log(error);
      })
}

getTransHistory()


function transHisPrev(){
    if(transHistoryPage != 1){
        transHistoryPage = transHistoryPage-1;
        transHis_pageNumber.innerHTML = transHistoryPage
        getTransHistory()
      }
}

function transHisNext(){
    transHistoryPage = transHistoryPage+1;
    transHis_pageNumber.innerHTML = transHistoryPage
    getTransHistory()
}


function ViewTransactionItemHistory(target){
    const modal = document.querySelector(".modal-itemShow-bg")
    modal.style.display = "flex"


    axios.get(`http://localhost:3000/History/${target}`)
    .then(function (response) {
        let {data} = response

        let element = `
            <p>Student Name: <b> ${ data.student_name } </b> </p>
            <p>Student Number: <b> ${ data.student_num } </b> </p>
            <p>Subject: <b>${data.subject} </b></p>
            <p>Section: <b>${data.section}</b> </p>
            <p>Instructor: <b>${data.prof_name} </b></p>
            <p class="modaling-title"> Chemicals: </p>
            <ul class="history-chems-list"></ul>
            <p class="modaling-title"> Apparatus: </p>
            <ul class="history-appa-list"></ul>
        `
        document.querySelector(".itemShow-modal .items").innerHTML = element;

        const chemList = document.querySelector(".history-chems-list")
        data.chemicals.forEach(chems=>{
            axios.get(`http://localhost:3000/Chemicals/${chems.id}`)
            .then(function (response) { 
                // console.log(response.data.itemName)
                chemList.innerHTML+=`<li> ${chems.borrowed+response.data.measurement } of ${response.data.itemName} </li>`
            })
            .catch(function (error) {
                console.log(error);
            })
        })

        const appaList = document.querySelector(".history-appa-list")
        data.apparatus.forEach(appa=>{
            axios.get(`http://localhost:3000/Apparatus/${appa.id}`)
            .then(function (response) { 
                appaList.innerHTML+=`<li>${appa.borrowed+response.data.measurement } of ${response.data.itemName} </li>`
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



const transHistoryModalListing = ()=>{
    const modal = document.querySelector(".modal-itemShow-bg")
    modal.style.display = "none"
}