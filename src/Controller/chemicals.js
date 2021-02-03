let chemPage =1;
let targetSearch =""
const pageNumber = document.querySelector(".pageNumber")
pageNumber.innerHTML = chemPage

function chemPrev(){
  if(chemPage != 1){
    chemPage = chemPage-1;
    pageNumber.innerHTML = chemPage
    getAllChemicalitem(targetSearch)
  }
}
function chemNext(){
  chemPage = chemPage+1;
  pageNumber.innerHTML = chemPage
  getAllChemicalitem(targetSearch)
}

function getAllChemicalitem(search){
  console.log(search)
    axios.get(`http://localhost:3000/Chemicals?itemName_like=${search}&_sort=id&_order=desc&_page=${chemPage}&_limit=7`)
    .then(function (response) {
      
      
      let tr="";
      let tbody = document.querySelector(".tbody-chemicals-item");
      
      response.data.forEach(item=>{
          tr+=`<tr>
                <td >${item.itemCode}</td>
                <td >${item.itemName}</td>
                <td>
                  <span>${item.Qty}</span><span class="measurement">${item.measurement}</span>
                </td>
                <td>${item.borrowed}</td>
                
                <td>
                  <svg 
                  class="btn_pen"
                  onclick="showEditChemicalModal(${item.Qty}, ${item.id}, '${item.itemName}')"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>

                </td>
            </tr>`;
      })

      tbody.innerHTML = tr;

    })
    .catch(function (error) {
      console.log(error);
    })
}
getAllChemicalitem("")


const chemSearchInput = document.querySelector(".chem-input-search")
chemSearchInput.addEventListener("keyup",({target})=>{
  chemPage=1
  pageNumber.innerHTML = chemPage;
  getAllChemicalitem(target.value)
  targetSearch = target.value
})

////////////////
function openAddChemicalModal(){
    const modal = document.querySelector(".modal-add-chemical-bg");
    modal.style.display ="block";
}

function closeAddModalChemical(){
    const modal = document.querySelector(".modal-add-chemical-bg");
    modal.style.display ="none";
}

function addChemical(){
    let itemCode = document.querySelector("#formChemicalItemCode").value;
    let itemname = document.querySelector("#formChemicalItemName").value;
    let Qty = document.querySelector("#formChemicalQty").value;
    let measurement = document.querySelector("#formChemicalMeasurement").value;

    if(itemCode == "" || itemname =="" || Qty =="" || measurement ==""){
        ipcRenderer.send("popup:alert", {message: "Please complete the form"});
        return;
    }else if(itemname.length > 26){
        ipcRenderer.send("popup:alert", {message: "Item name must not exceed 26 characters"});
        return;
    }

    axios.post('http://localhost:3000/Chemicals',{
        itemCode: itemCode,
        itemName: itemname,
        Qty: Qty,
        measurement: measurement,
        borrowed: 0,
        damage: 0
    })
    .then(function (response) {
        // asd
        // const chem = response.data;
        // const today = new Date().toISOString().slice(0, 10);
        // axios.get(`http://localhost:3000/DailyReports?date=${today}`)
        //   .then((res)=> {
        //     res = res.data[0];
            
        //     res.chemicals.push({
        //       itemName: chem.itemName,
        //       id: chem.id,
        //       measurement: chem.measurement,
        //       borrowed: 0,
        //       Qty: chem.Qty
        //     })
  
        //     axios.put(`http://localhost:3000/DailyReports/${res.id}`, res)
        //     .then((res)=> {
        //       location.reload(); 
        //     })
        //     .catch(function (error) {
        //       console.log(error);
        //     })
            
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   })
        location.reload(); 
        // asd
    })
    .catch(function (error) {
      console.log(error);
    })
}

let onChemicalEdit;

function showEditChemicalModal(Qty, id, name){
    let input = document.querySelector("#formEditChemicalNewQty");
    let title = document.querySelector(".edit-chemical-itemName");
    
    input.value = Qty
    title.innerHTML =name.toUpperCase();
    onChemicalEdit=id
  
    const modal = document.querySelector(".modal-edit-chemicals-bg");
    modal.style.display ="block"
}

function closeEditChemicalModal(){
    const modal = document.querySelector(".modal-edit-chemicals-bg");
    modal.style.display ="none"
}

function saveEditChemical(){
    let targetId = onChemicalEdit
    let newQty = document.querySelector("#formEditChemicalNewQty").value
  
    axios.get(`http://localhost:3000/Chemicals/${targetId}`)
    .then(function (response) {
        let added = newQty-response.data.Qty
        item=response.data;
        item.Qty=newQty
        console.log(added)

        const today = new Date().toISOString().slice(0, 10);
        let stockHistory = {
          date: today,
          itemCode: response.data.itemCode,
          itemName: response.data.itemName,
          stockAdded: added,
          measurement: response.data.measurement
        }


        axios.put(`http://localhost:3000/Chemicals/${targetId}`,item)
        .then(function (response) {
          console.log(response.data);
          // location.reload(); 

            axios.post(`http://localhost:3000/stockHistory`,stockHistory)
            .then(function (response) {
              console.log(response.data);
              location.reload(); 
            })
            .catch(function (error) {
              console.log(error);
            })
            
        })
        .catch(function (error) {
          console.log(error);
        })
    })
    .catch(function (error) {
      console.log(error);
    })
}

function showDeleteChemicalConfirmation(){
    const confirmation = document.querySelector(".delete-chemical-confirmation")
    confirmation.style.display ="block"
}
function hideDeleteChemicalConfirmation(){
    const confirmation = document.querySelector(".delete-chemical-confirmation")
    confirmation.style.display ="none"
}

function deleteChemical(){
    let targetId = onChemicalEdit
  
    axios.delete(`http://localhost:3000/Chemicals/${targetId}`)
    .then(function (response) {
      console.log(response.data);
      location.reload(); 
    })
    .catch(function (error) {
      console.log(error);
    })
  
}