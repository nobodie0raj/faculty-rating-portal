document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("selectionForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting normally

        const semester = document.getElementById("semester").value;
        const department = document.getElementById("department").value;

        if (semester && department) {
            // Convert values to lowercase and trim spaces
            const formattedDepartment = department.toLowerCase().trim();
            const formattedSemester = semester.trim();
            
            // Construct the URL based on selection
            const pageUrl = `faculty_review_${formattedDepartment}${formattedSemester}.html`;
            
            // Redirect to the generated page
            window.location.href = pageUrl;
        } else {
            alert("Please select both semester and department to proceed.");
        }
    });
});
