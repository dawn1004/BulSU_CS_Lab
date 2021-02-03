let week = new Date();
week.setDate(week.getDate() + 7);
week = week.toISOString().slice(0, 10)

const today = new Date().toISOString().slice(0, 10);

const getDueDate =()=>{
    axios.get(`http://localhost:3000/Transactions?`)
    .then(function (response) {
      let tr="";
      let tbody = document.querySelector(".tbody-due-date");

      response.data.forEach(item=>{
        if(item.return_date <= today){
            tr+=`<tr>
                    <td >${item.id}</td>
                    <td>${item.student_num}</td>
                    <td>${item.student_name}</td>
                    <td>${item.date_borrowed}</td>
                    <td>${item.return_date}</td>
                </tr>`;
        }

      })

      tbody.innerHTML = tr;

    })
    .catch(function (error) {
      console.log(error);
    })
}

getDueDate();