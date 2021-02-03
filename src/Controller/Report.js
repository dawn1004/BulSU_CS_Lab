const today1 = new Date().toISOString().slice(0, 10);

let monthAndYear = today1.split("-")
monthAndYear = monthAndYear[0] + "-" + monthAndYear[1]


const createDayStock = ()=>{
     axios.get(`http://localhost:3000/MonthlyReports?date_like=${monthAndYear}`)
    .then(async({data})=>{

        let apparatus;
        let chemicals;
        let history;

        //fetching apparatus
        await axios.get(`http://localhost:3000/Apparatus`)
        .then(({data})=>{
            apparatus = data
        })
        .catch((ee)=> console.log(ee))

        //feting chemicals
        await axios.get(`http://localhost:3000/Chemicals`)
        .then(({data})=>{
            chemicals = data
        })
        .catch((ee)=> console.log(ee))



        //feting history
        await axios.get(`http://localhost:3000/History?date_borrowed_like=${monthAndYear}`)
        .then(({data})=>{
            history = data
        })
        .catch((ee)=> console.log(ee))

        
        //updating or creating report for that day

        if(data.length > 0){
            axios.put(`http://localhost:3000/MonthlyReports/${data[0].id}`,{
                report: "wewewewew",
                date: today1,
                apparatus,
                chemicals,
                history
            })
            .then(({data})=>{
                
            })
            .catch(function (error) {
                console.log(error);
            }) 
        }else{
            axios.post(`http://localhost:3000/MonthlyReports`,{
                report: "wewewewew",
                date: today1,
                apparatus,
                chemicals,
                history
            })
            .then(({data})=>{
                
            })
            .catch(function (error) {
                console.log(error);
            }) 
        }


        
        listDropDownMenu()

    })
    .catch(function (error) {
        console.log(error);
    })    
}


createDayStock()




const dropbtn =  document.querySelector(".dropbtn")
dropbtn.innerHTML ='Select date  ↓'


const listDropDownMenu = ()=>{

    const dropDown = document.querySelector(".dropdown-content")
    let dropDownContent= ""

    axios.get(`http://localhost:3000/MonthlyReports`)
    .then(({data})=>{
        
        data.forEach(report=>{
            dropDownContent+=`<a href="#" onClick="selecDate(${report.id}, '${report.date}')"> ${report.date} </a>`
        })

        dropDown.innerHTML = dropDownContent;
    })
    .catch(function (error) {
        console.log(error);
    }) 
}

// listDropDownMenu()

let targetPrint = {chemicals:[], apparatus: [], history: []};
let targetReportDate = ""

const selecDate = (id, date)=>{
    
   document.querySelector(".print-button").style.display = "inline"

    const reportTables = document.querySelector(".report-tables")
    const searchReport = document.querySelector(".search-report")


    reportTables.style.display ="block"
    searchReport.style.display ="none"

    targetPrint.chemicals= []
    targetPrint.apparatus= []
    targetPrint.history= []
    
    targetReportDate = date

    dropbtn.innerHTML =date
    const dateOfReport = document.querySelectorAll(".dateOfReport")
    dateOfReport[0].innerHTML = date;
    dateOfReport[1].innerHTML = date;
    let MD = date.split("-");
    MD = MD[0]+'-'+MD[1];
    dateOfReport[2].innerHTML = MD;


    axios.get(`http://localhost:3000/MonthlyReports/${id}`)
    .then(({data})=>{
        const chemicals = data.chemicals;
        const apparatus = data.apparatus;
        const history = data.history;
        let chemicalRows ="";
        let apparatusRows ="";
        let historyRows ="";
        const chemicalBody = document.querySelector(".tbody-chemicals-reports")
        const apparatusBody = document.querySelector(".tbody-appartus-reports")
        const historyBody = document.querySelector(".tbody-history-reports")

        chemicalBody.innerHTML = ""
        chemicals.forEach((chemical, index)=>{
            chemicalRows+=`<tr>
            <td> ${chemical.itemCode} </td>
            <td> ${chemical.itemName} </td>
            <td> ${chemical.Qty} </td>
            <td> ${chemical.borrowed} </td>
            <td> ${parseInt(chemical.Qty) + parseInt(chemical.borrowed)} </td>
            </tr>
            `
            targetPrint.chemicals.push([chemical.itemCode, chemical.itemName, chemical.Qty, chemical.borrowed,  parseInt(chemical.Qty) + parseInt(chemical.borrowed) ])
        })
        chemicalBody.innerHTML = chemicalRows

        apparatusBody.innerHTML=""
        apparatus.forEach((appa, index)=>{
            apparatusRows+=`<tr>
            <td> ${appa.itemCode} </td>
            <td> ${appa.itemName} </td>
            <td> ${appa.Qty} </td>
            <td> ${appa.borrowed} </td>
            <td> ${parseInt(appa.Qty) + parseInt(appa.borrowed)} </td>
            </tr>
            `
            targetPrint.apparatus.push([appa.itemCode, appa.itemName, appa.Qty, appa.borrowed, parseInt(appa.Qty) + parseInt(appa.borrowed) ])
        })
        apparatusBody.innerHTML = apparatusRows

        historyBody.innerHTML = ""
        history.forEach((his, index)=>{
            let hisChem = ""
            let hisAppa = ""

            axios.get("http://localhost:3000/Chemicals")
            .then(res=>{
                res.data.forEach(chem=>{
                    his.chemicals.forEach(hiss=>{
                        if(hiss.id == chem.id)
                        hisChem = hisChem + hiss.borrowed+chem.measurement +" of "+ chem.itemName +", "
                    })
                })

                axios.get("http://localhost:3000/Apparatus")
                .then(res=>{
                    res.data.forEach(appa=>{
                        his.apparatus.forEach(hiss=>{
                            if(hiss.id == appa.id)
                            hisAppa = hisAppa + hiss.borrowed+appa.measurement +" of "+ appa.itemName +", "
                        })
                    })

                    targetPrint.history.push([his.student_num, his.student_name, his.section, his.date_borrowed, his.return_date, hisAppa, hisChem ])


                    historyRows+=`<tr>
                    <td> ${his.student_num} </td>
                    <td> ${his.student_name} </td>
                    <td> ${his.section} </td>
                    <td> ${his.date_borrowed} </td>
                    <td> ${his.return_date} </td>
                    <td> ${hisAppa} </td>
                    <td> ${hisChem} </td>
                    </tr>
                    `
                    historyBody.innerHTML = historyRows

                })



            })

        })
        // historyBody.innerHTML = historyRows

    })
    .catch(function (error) {
        console.log(error);
    })
}




const printTable = ()=>{
    ipcRenderer.send("print:table", {data: targetPrint, date: targetReportDate});
    console.log(targetPrint.history)

    console.log("New")
    console.log(targetPrint.history)
}