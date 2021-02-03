// let critPage =1;
// let targetCritSearch =""
// const pageCritNumber = document.querySelector(".Crit_pageNumber")
// pageCritNumber.innerHTML = critPage

// function critPrev(){
//   if(critPage != 1){
//     critPage = critPage-1;
//     pageCritNumber.innerHTML = critPage
//     // getAllChemicalitem(targetSearch)
//     getCritical()
//   }
// }
// function critNext(){
//   critPage = critPage+1;
//   pageCritNumber.innerHTML = critPage
//   getCritical()
// //   getAllChemicalitem(targetSearch)
// }


const getCritical = async()=>{
    
    const tbody = document.querySelector(".tbody-critical-item");
    let criticalChems = ""
    let criticalAppa = ""

    await axios.get('http://localhost:3000/Chemicals')
    .then(function (response) {
        const chemicals = response.data;
        
        console.log("taesss")
        chemicals.forEach(chem=>{
            if(chem.Qty <=10){
                console.log(chem)
                criticalChems= criticalChems+` 
                <tr>
                <td>${chem.itemCode}</td>
                <td>${chem.itemName}</td>
                <td>${chem.Qty}</td>
                </tr>
                `
            }
        })
        
        
    })
    .catch(function (error) {
      console.log(error);
    })

    //appa

    await axios.get('http://localhost:3000/Apparatus')
    .then(function (response) {
        const apparatus = response.data;
        
        apparatus.forEach(appa=>{
            if(appa.Qty <=10){
                criticalAppa= criticalAppa+` 
                <tr>
                <td>${appa.itemCode}</td>
                <td>${appa.itemName}</td>
                <td>${appa.Qty}</td>
                </tr>
                `
            }
        })

    })
    .catch(function (error) {
      console.log(error);
    })


    tbody.innerHTML = criticalAppa+criticalChems


}
getCritical();