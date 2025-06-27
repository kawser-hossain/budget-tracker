// @ts-nocheck







    const addList = document.getElementById('add-list');
    const listInput = document.querySelector('.list-inputs');
    const listDetails = document.querySelector('.list-details');
    const queryButton = document.querySelector('.query-area');
    const queryresult = document.querySelector('.query-result-wrap');
    const sum = document.getElementById('sum');
    const monthTotalIncome = document.getElementById('month-total-income');
    const leftMoney = document.getElementById('left-money');
    const monthIncome = document.getElementById('month-total-income');
    const monts = document.getElementById('monts');
    const queryConformArea =  document.querySelector('.query-conform-area');
    const queryBoxes = document.querySelector('.query-boxes')

    let editItem = false;
    let isEditingQuery = false;
    let myChart = null;


    addList.addEventListener('click', showInputs);

    function showInputs(){
      

      
      if(monthIncome.value < 0 || monthIncome.value == 0 ){
        alert('Please provide a valid monthly income');
        monthIncome.value = ''
        monthIncome.focus()
      }else if(monts.value == ''){
        alert('please select a month')
        monts.focus()
      }else{
        listInput.innerHTML = `
        <input type="text" class="input" placeholder="Rent, Maintenance, groceries etc" id="spend-title"> 
        <input type="number" class="input" placeholder="amount" id="spend-amount">
        <button class="button" onclick="tackData()" >save</button>
        `
        addList.style.display = "none"
      }
    }
    
function tackData(){
      
      let spendTitle = document.getElementById('spend-title');
      let spendAmount = document.getElementById('spend-amount');
      
      
 

      if(spendTitle.value == ''){
        alert('please enter the case of spending')
        spendTitle.focus()
        editItem = false;

      }else if(spendAmount.value < 0 || spendAmount.value == 0 ){
        alert('Please provide amount');
        spendAmount.focus()
        spendAmount.value = ''
        editItem = false;
      }else{

        editItem = false;

        const listDetail = document.createElement('div')
        listDetail.classList.add('list-detail')
        
        listDetail.innerHTML= `
              <div class="spend-title">
                <h3>${spendTitle.value}</h3>
              </div>
              <div class="spend-amount">
                <h3>${spendAmount.value}</h3>
                <button id="delete-list" onclick="deleteList(event)"><i class="fa-solid fa-x"></i></button>
                <button id="edit-list" onclick="editList(event)"><i class="fa-solid fa-pen"></i></button>
              </div> 

        `
        listDetails.appendChild(listDetail)

          spendTitle.value = "";
          spendAmount.value = "";

          queryButton.style.display = 'block';
          
      }

    if(isEditingQuery){
      sumAmount()
    }
                
}

function deleteList(event){
  const parent = event.target.closest('.list-detail');
  parent.remove()



}



function sumAmount(){
  let totalAmount = 0;
  const amounts = document.querySelectorAll('.spend-amount h3')
  const titles = document.querySelectorAll('.spend-title h3')

  const data = [];
  const labels = [];

  amounts.forEach((element, index) => {
    const amount = Number(element.innerText);
    totalAmount += amount

    data.push(amount);
    labels.push(titles[index].innerText)

  });

  queryresult.style.display = 'block';

  sum.innerText = totalAmount;
  leftMoney.innerText = monthTotalIncome.value - totalAmount

  renderChart(labels, data)

  queryConformArea.innerHTML = `
  <button class="conform-btn" onclick="saveData()">Save query</button>
  <button class="conform-btn" onclick="clearData()">Clear query</button>
  `
}

function renderChart(labels, data) {
  const ctx = document.getElementById('spendingChart').getContext('2d');
  
  if (myChart !== null) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'pie', // or 'bar'
    data: {
      labels: labels,
      datasets: [{
        label: 'Spending Breakdown',
        data: data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#A8E6CF', '#FFD3B6',
          '#FFAAA5', '#D1C4E9', '#B39DDB', '#81D4FA', '#4DB6AC'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });
}




function editList(event){

  if(!editItem){

    editItem = true;
  
    let parent = event.target.closest('.list-detail')
    let title = parent.querySelector('.spend-title h3').innerText
    let amount = parent.querySelector('.spend-amount h3').innerText  
    let spendTitle = document.getElementById('spend-title');
    let spendAmount = document.getElementById('spend-amount');
    parent.remove()
    spendTitle.value = title
    spendAmount.value = amount
  }

  
}




function saveData() {
  const month = monts.value;
  const income = monthIncome.value;
  const sum = document.getElementById('sum').innerText;
  const leftMoney = document.getElementById('left-money').innerText;
  
  console.log(sum, leftMoney);

  const spendingItems = [];
  const listElements = document.querySelectorAll('.list-detail');

  listElements.forEach(item => {
    const title = item.querySelector('.spend-title h3').innerText;
    const amount = item.querySelector('.spend-amount h3').innerText;

    spendingItems.push({
      title,
      amount: Number(amount)
    });
  });
 
  const allData = {
    month,
    monthlyIncome: Number(income),
    spendings: spendingItems,
    sum,
    leftMoney,
  };

  
   const confirmOverwrite = isEditingQuery ? true : (localStorage.getItem(month) ? confirm(`Are you want to overwrite the ${month} month`) : true);

  if(confirmOverwrite){
    localStorage.setItem(month, JSON.stringify(allData));

  }




  loadData()
  isEditingQuery = false;

}


function clearData(){
  monthIncome.value = ''
  monts.value = ''
  console.log(monts.value);
 
  addList.style.display = 'block';
  queryButton.style.display = 'none';
  listInput.innerHTML = '';
  listDetails.innerHTML = '';
  queryresult.style.display = 'none';
  queryConformArea.innerHTML = '';

}

const monthOrder = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

loadData()
function loadData(){

    queryBoxes.innerHTML = '';

    const data = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = JSON.parse(localStorage.getItem(key))
      data.push(value);
    }


    data.sort((a, b)=>{
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    data.forEach(item => {
      const queryBox = document.createElement('div');
      queryBox.addEventListener('click', ()=>{openQuery(item)})
      queryBox.classList.add('query-box');
      queryBox.innerHTML = `<h3>${item.month}</h3>`;
      queryBoxes.appendChild(queryBox);
    });
    // console.log(data);
}


const displayQuery = document.querySelector('.display-query')

function openQuery(data){

  console.log(data);
  
  const queryData = document.querySelector('.query-data');

  queryData.innerHTML = `
      <h3>Month <span>${data.month}</span></h3>
      <h2>Monthly income <span>${data.monthlyIncome}</span></h2>

      <div class="spends-area">
        <h3>spends</h3>
        <button class="close-btn" onclick="closeMe()">X</button>
      </div>
      <div class="query-result-area" >
        <h3>Total spend <span>${data.sum}</span></h3>
        <h3>Money left <span>${data.leftMoney}</span></h3>
      </div>

      <div class="modify-area">
      <button id="delete-query" onclick="deleteQuery('${data.month}')" >Delete</button>
      <button id="edit-query" onclick='editQuery(${JSON.stringify(data)})' >Edit</button>
      </div>


  `
  const spendsArea = document.querySelector('.spends-area');
  
  data.spendings.forEach(mySpend => {
    console.log(mySpend);
    const spend = document.createElement('div');
    spend.classList.add('spend');
    spend.innerHTML = `
      <p>${mySpend.title}</p>
      <p>${mySpend.amount}</p>
    `
    spendsArea.appendChild(spend)
  })


  displayQuery.style.display='block'

}

function closeMe(){
  displayQuery.style.display='none'
}


function deleteQuery(data){
// Used SweetAlert2 alear
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this data!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem(data);
      loadData();
      closeMe();

      Swal.fire("Deleted!", "Your data has been deleted.", "success");
    }
  });
}




function editQuery(data) {
  // Hide the query display modal
  isEditingQuery = true;
  closeMe();
  // Fill month income and month select dropdown
  monthTotalIncome.value = data.monthlyIncome;
  monts.value = data.month;

  // Clear current list inputs and details
  listInput.innerHTML = '';
  listDetails.innerHTML = '';
  editItem = false;
  // For each saved spending, create a list-detail div in listDetails
  data.spendings.forEach(spend => {
    const listDetail = document.createElement('div');
    listDetail.classList.add('list-detail');

    listDetail.innerHTML = `
      <div class="spend-title">
        <h3>${spend.title}</h3>
      </div>
      <div class="spend-amount">
        <h3>${spend.amount}</h3>
        <button id="delete-list" onclick="deleteList(event)"><i class="fa-solid fa-x"></i></button>
        <button id="edit-list" onclick="editList(event)"><i class="fa-solid fa-pen"></i></button>
      </div>
    `;

    listDetails.appendChild(listDetail);
  });

  // Show the add list button again (if it was hidden)
  // addList.style.display = 'block';

  // Show the query button so user can sum again
  queryButton.style.display = 'block';

  // Clear any input fields so user can add new spends
  // listInput.innerHTML = '';
  sumAmount()
  showInputs()


}




