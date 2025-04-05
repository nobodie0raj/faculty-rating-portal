document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("reviewForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let reviewSummary = `
            <div class='ticket-container'>
                <h2>Review Summary 🎟</h2>
                <div class='ticket'>
        `;
        let rows = document.querySelectorAll("tbody tr");
        let allFieldsFilled = true;
        let firstEmptyField = null;

        rows.forEach(row => {
            let subject = row.cells[0].textContent;
            let faculty = row.cells[1].textContent;
            let ratingInputs = row.querySelectorAll("input[type='number']");
            let ratings = [];

            ratingInputs.forEach(input => {
                let value = parseInt(input.value);
                if (!value || value < 1 || value > 5) {
                    allFieldsFilled = false;
                    input.style.border = "2px solid red"; // Highlight empty field
                    if (!firstEmptyField) {
                        firstEmptyField = input; // Store first empty field
                    }
                } else {
                    input.style.border = ""; // Reset border if corrected
                    ratings.push(value);
                }
            });

            if (ratings.length > 0) {
                let averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                let stars = "★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating));
                reviewSummary += `
                    <div class='ticket-item'>
                        <strong>${subject}</strong> (${faculty})<br>
                        <span class="stars">Rating: ${stars}</span>
                    </div>
                `;
            }
        });

        reviewSummary += `
                </div>
                <div class="exit-timer">Exiting in <span id="timer">10</span>s ⏳</div>
            </div>
        `;

        if (!allFieldsFilled) {
            alert("Please enter ratings for all subjects (1-5).");
            if (firstEmptyField) firstEmptyField.focus(); // Move cursor to first empty field
            return; // Stop submission
        }

        let newWindow = window.open("", "Review Summary", "width=600,height=500");
        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <title>Review Summary</title>
                <link rel='stylesheet' href='styles.css'>
                <style>
                    ${generateTicketCSS()}
                </style>
            </head>
            <body>
                ${reviewSummary}
                <script>
                    let countdown = 10;
                    let timerElement = document.getElementById("timer");
                    let interval = setInterval(() => {
                        countdown--;
                        timerElement.textContent = countdown;
                        if (countdown <= 0) {
                            clearInterval(interval);
                            window.close();
                        }
                    }, 1000);
                </script>
            </body>
            </html>
        `);
        newWindow.document.close();

        // Redirect to index.html after 2 seconds
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    });

    document.querySelectorAll("input[type='number']").forEach((input, index, inputs) => {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                let nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });

        input.addEventListener("input", function () {
            if (this.value >= 1 && this.value <= 5) {
                this.style.border = ""; // Remove red border when corrected
            }
        });
    });
});

// Function to generate ticket CSS dynamically
function generateTicketCSS() {
    return `
        body {
    font-family: Arial, sans-serif;
    background: #f8f9fa;
    text-align: center;
    padding: 20px;
}

.ticket-container {
    background: white;
    padding: 15px;
    width: 85%;
    max-width: 380px;
    margin: auto;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    border: 2px dashed #333;
}

h2 {
    color: #222;
    font-size: 20px;
    margin-bottom: 15px;
}

.ticket {
    background: #ffeb3b;
    padding: 12px;
    border-radius: 6px;
    text-align: left;
    font-size: 15px;
}

.ticket-item {
    margin-bottom: 8px;
    padding: 8px;
    background: white;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
}

.stars {
    color: #ff9800;
    font-size: 16px;
}

.exit-timer {
    margin-top: 12px;
    font-size: 15px;
    font-weight: bold;
    color: red;
}

    `;
}
