document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reviewForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let allValid = true;
        let firstInvalidInput = null;

        const rows = document.querySelectorAll("tbody tr");
        const ratingsSummary = [];

        rows.forEach(row => {
            const subject = row.cells[0].textContent;
            const faculty = row.cells[1].textContent;
            const inputs = row.querySelectorAll("input[type='number']");

            const ratings = [];
            inputs.forEach(input => {
                const value = parseInt(input.value);
                if (!value || value < 1 || value > 5) {
                    allValid = false;
                    input.style.border = "2px solid red";
                    if (!firstInvalidInput) firstInvalidInput = input;
                } else {
                    input.style.border = "";
                    ratings.push(value);
                }
            });

            if (ratings.length === inputs.length) {
                const avg = ratings.reduce((a, b) => a + b) / ratings.length;
                const stars = "★".repeat(Math.round(avg)) + "☆".repeat(5 - Math.round(avg));
                ratingsSummary.push({ subject, faculty, stars });
            }
        });

        if (!allValid) {
            alert("Please enter all ratings between 1 and 5.");
            if (firstInvalidInput) firstInvalidInput.focus();
            return;
        }

        // Create new window summary only if all inputs valid
        const newWindow = window.open("", "Review Summary", "width=600,height=500");
        const style = generateTicketCSS();
        const content = `
            <html>
                <head>
                    <title>Review Summary</title>
                    <style>${style}</style>
                </head>
                <body>
                    <div class="ticket-container">
                        <h2>Review Summary 🎟</h2>
                        <div class="ticket">
                            ${ratingsSummary.map(r => `
                                <div class='ticket-item'>
                                    <strong>${r.subject}</strong> (${r.faculty})<br>
                                    <span class="stars">Rating: ${r.stars}</span>
                                </div>`).join("")}
                        </div>
                        <div class="exit-timer">Exiting in <span id="timer">10</span>s ⏳</div>
                    </div>
                    <script>
                        let countdown = 10;
                        let timerEl = document.getElementById("timer");
                        let interval = setInterval(() => {
                            countdown--;
                            timerEl.textContent = countdown;
                            if (countdown <= 0) {
                                clearInterval(interval);
                                window.close();
                            }
                        }, 1000);
                    </script>
                </body>
            </html>
        `;
        newWindow.document.write(content);
        newWindow.document.close();

        // Optional: Redirect original page
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    });

    // Improve input navigation with Enter key
    const inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach((input, index) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (inputs[index + 1]) inputs[index + 1].focus();
            }
        });

        input.addEventListener("input", function () {
            if (this.value >= 1 && this.value <= 5) {
                this.style.border = "";
            }
        });
    });
});

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
