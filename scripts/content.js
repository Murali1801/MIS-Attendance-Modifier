function modifyAttendanceTables() {
    // Get all tables on the page
    const tables = document.querySelectorAll("table");

    let lectureTable = null;
    let practicalTable = null;

    // Identify the lecture table
    tables.forEach((table, index) => {
        const firstRow = table.querySelector("tr");
        if (!firstRow) return;

        const headers = firstRow.querySelectorAll("th");
        if (headers.length < 4) return;

        const headerTexts = Array.from(headers).map(th => th.textContent.trim());

        if (
            headerTexts.includes("Subject") &&
            headerTexts.includes("Total Lectures Conducted") &&
            headerTexts.includes("Lectures Attended") &&
            headerTexts.includes("(%)")
        ) {
            lectureTable = table;
            console.log("✅ Lecture Table Found at index:", index);

            // Assume the next table is the practical table
            if (tables[index + 1]) {
                practicalTable = tables[index + 1];
                console.log("✅ Practical Table Found at index:", index + 1);
            }
        }
    });

    // Function to modify a table by adding new columns
    function modifyTable(table, skipLabel, neededLabel) {
        if (!table) {
            console.log(`❌ Table not found for ${skipLabel}`);
            return;
        }

        const tbody = table.querySelector("tbody");
        if (!tbody) {
            console.log(`❌ tbody not found in ${skipLabel} table`);
            return;
        }

        // Add new column headers
        const headerRow = tbody.querySelector("tr");
        const newHeaders = [skipLabel, neededLabel];

        newHeaders.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            th.style.textAlign = "center";
            headerRow.appendChild(th);
        });

        console.log(`✅ Added columns to ${skipLabel} table`);

        // Modify each row (ignore first row for headers and last row for totals)
        const rows = tbody.querySelectorAll("tr:not(:first-child):not(:last-child)");
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 3) return;

            const total = parseInt(cells[1].textContent.trim(), 10);
            const attended = parseInt(cells[2].textContent.trim(), 10);

            // Calculate attendance-based values
            let neededFor75 = Math.max(0, Math.ceil((0.75 * total - attended) / 0.25));
            let maxSkippable = Math.max(0, Math.floor((attended - 0.75 * total) / 0.75));

            // Adjust based on attendance
            if (attended >= Math.ceil(0.75 * total)) {
                neededFor75 = 0; // Already above 75%
            } else {
                maxSkippable = 0; // Below 75%, skipping not possible
            }

            console.log(`📊 ${cells[0].textContent.trim()}: Skippable: ${maxSkippable}, Needed: ${neededFor75}`);

            // Add new data cells
            const skipCell = document.createElement("td");
            skipCell.textContent = maxSkippable;
            skipCell.style.textAlign = "center";

            const needCell = document.createElement("td");
            needCell.textContent = neededFor75;
            needCell.style.textAlign = "center";

            row.appendChild(skipCell);
            row.appendChild(needCell);
        });

        console.log(`✅ Updated rows in ${skipLabel} table`);
    }

    // Modify both lecture and practical tables
    modifyTable(lectureTable, "Lectures That Can Be Skipped", "Lectures Needed for 75%");
    modifyTable(practicalTable, "Practicals That Can Be Skipped", "Practicals Needed for 75%");
}

// Run the script when the page loads
modifyAttendanceTables();
