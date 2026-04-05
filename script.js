let transactions = JSON.parse(localStorage.getItem("data")) || [];

// Save data
function save() {
  localStorage.setItem("data", JSON.stringify(transactions));
}

// Switch sections
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Add Transaction
function addTransaction() {
  let role = document.getElementById("role").value;

  if (role !== "admin") {
    alert("Only admin allowed");
    return;
  }

  let date = document.getElementById("date").value;
  let amount = document.getElementById("amount").value;
  let category = document.getElementById("category").value;
  let type = document.getElementById("type").value;

  // Validation
  if (!date || !amount || !category) {
    alert("Please fill all fields");
    return;
  }

  let t = {
    date: date,
    amount: +amount,
    category: category,
    type: type
  };

  transactions.push(t);
  save();
  update();

  // Clear inputs
  document.getElementById("date").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
}

// Delete Transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  save();
  update();
}

// Render Table
function renderTable() {
  let search = document.getElementById("search").value.toLowerCase();
  let tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  transactions.forEach((t, i) => {
    if (t.category.toLowerCase().includes(search)) {
      let row = `
        <tr>
          <td>${t.date}</td>
          <td>₹${t.amount}</td>
          <td>${t.category}</td>
          <td>${t.type}</td>
          <td><button onclick="deleteTransaction(${i})">❌</button></td>
        </tr>
      `;
      tbody.innerHTML += row;
    }
  });
}

// Calculate Summary
function calculate() {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;
}

// Insights
function insights() {
  let map = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  let top = Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b, "");
  document.getElementById("topCategory").innerText =
    top ? "Top Spending: " + top : "No data yet";
}

// Charts (fixed version)
let lineChartInstance;
let pieChartInstance;

function charts() {
  // Destroy old charts
  if (lineChartInstance) lineChartInstance.destroy();
  if (pieChartInstance) pieChartInstance.destroy();

  let dates = transactions.map(t => t.date);
  let amounts = transactions.map(t => t.amount);

  lineChartInstance = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Transactions",
        data: amounts,
        fill: false
      }]
    }
  });

  let categoryData = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      categoryData[t.category] =
        (categoryData[t.category] || 0) + t.amount;
    }
  });

  pieChartInstance = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: Object.keys(categoryData),
      datasets: [{
        data: Object.values(categoryData)
      }]
    }
  });
}

// Dark Mode
function toggleDark() {
  document.body.classList.toggle("dark");
}

// Update UI
function update() {
  calculate();
  renderTable();
  insights();
  charts();
}

// Initial Load
update();