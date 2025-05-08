document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseTableBody = document.getElementById('expense-table').querySelector('tbody');
    const totalExpensesElement = document.getElementById('total-expenses');
    const clearButton = document.getElementById('clear-inputs');

    let totalExpenses = 0;

    // Function to fetch all expenses from the backend
    const fetchExpenses = async () => {
        console.log('Fetching expenses...');
        try {
            const response = await fetch('http://localhost:8080');
            if (!response.ok) {
                console.error('Error fetching expenses:', response.statusText);
                return;
            }

            const expenses = await response.json();
            console.log('Fetched expenses:', expenses);

            // Clear the table and reset total
            expenseTableBody.innerHTML = '';
            totalExpenses = 0;

            // Update the table with fetched expenses
            expenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.category}</td>
                    <td>₹${expense.amount.toFixed(2)}</td>
                    <td>${expense.date}</td>
                    <td>${expense.description}</td>
                `;
                expenseTableBody.appendChild(row);

                totalExpenses += parseFloat(expense.amount);
            });

            // Update total expenses
            totalExpensesElement.textContent = `₹${totalExpenses.toFixed(2)}`;
            console.log('Total expenses updated:', totalExpenses);
        } catch (error) {
            console.error('Error during fetchExpenses:', error);
        }
    };

    // Handle form submission
    expenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');

        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;

        const expense = { category, amount, date, description };
        console.log('Adding expense:', expense);

        try {
            const response = await fetch('http://localhost:8080', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });

            if (!response.ok) {
                console.error('Error adding expense:', response.statusText);
                return;
            }

            console.log('Expense added successfully');
            fetchExpenses(); // Refresh the table
        } catch (error) {
            console.error('Error during form submission:', error);
        }

        // Clear the form after submission
        expenseForm.reset();
    });

    // Handle Clear button click
    clearButton.addEventListener('click', () => {
        console.log('Clearing form inputs');
        expenseForm.reset();
    });

    // Fetch expenses when the page loads
    fetchExpenses();
});
