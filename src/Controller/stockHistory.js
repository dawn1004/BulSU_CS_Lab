
let pageNumber_stockHistory = document.querySelector(".pageNumber_stockHistory");

const stockHisPrev = ()=>{
  if( parseInt(pageNumber_stockHistory.innerHTML) > 1){
      pageNumber_stockHistory.innerHTML = parseInt(pageNumber_stockHistory.innerHTML)-1
      getStockHistory(pageNumber_stockHistory.innerHTML)
  }
}

const stockHisNext = ()=>{
  pageNumber_stockHistory.innerHTML = parseInt(pageNumber_stockHistory.innerHTML)+1
  getStockHistory(pageNumber_stockHistory.innerHTML)
}




function getStockHistory(page){
    axios.get(`http://localhost:3000/stockHistory?_sort=id&_order=desc&_page=${page}&_limit=7`)
    .then(function (response) {
        console.log(response)
        let tr="";
        let tbody = document.querySelector(".tbody-addingStock-item");

        response.data.forEach(item=>{
            tr+=`<tr>
                  <td> ${item.date} </td>
                  <td >${item.itemCode}</td>
                  <td >${item.itemName}</td>
                  <td>
                    <span>${item.stockAdded}</span><span class="measurement">${item.measurement}</span>
                  </td>
              </tr>`;
        })
  
        tbody.innerHTML = tr;
  
      })
      .catch(function (error) {
        console.log(error);
      })
}

getStockHistory()