
// ==========================================
// NEXUS NIC - SRI LANKAN NIC DECODER
// ==========================================

// HTML ELEMENTS
const nicInput = document.getElementById("nicInput");
const decodeButton = document.getElementById("decodeButton");
const clearButton = document.getElementById("clearButton");
const resetButton = document.getElementById("resetButton");
const copyButton = document.getElementById("copyButton");
const themeToggle = document.getElementById("themeToggle");

const formatResult = document.getElementById("formatResult");

const results = document.getElementById("results");
const scanner = document.getElementById("scanner");
const errorMessage = document.getElementById("errorMessage");

const dobResult = document.getElementById("dobResult");
const genderResult = document.getElementById("genderResult");
const ageResult = document.getElementById("ageResult");
const weekdayResult = document.getElementById("weekdayResult");
const yearNotice = document.getElementById("yearNotice");

const identityTitle = document.getElementById("identityTitle");
const identityAgeGroup = document.getElementById("identityAgeGroup");
const identityGender = document.getElementById("identityGender");
const avatarArtwork = document.getElementById("avatarArtwork");

// ==========================================
// FLOATING PARTICLES
// ==========================================

function createParticles() {
    const container = document.getElementById("particles");

    for (let i = 0; i < 35; i++) {
        const particle = document.createElement("span");

        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDuration = (8 + Math.random() * 15) + "s";
        particle.style.animationDelay = (-Math.random() * 15) + "s";
        particle.style.opacity = Math.random() * 0.5;

        container.appendChild(particle);
    }
}

createParticles();

// ==========================================
// NIC INPUT CLEANING
// ==========================================

nicInput.addEventListener("input", () => {
    nicInput.value = nicInput.value
        .toUpperCase()
        .replace(/[^0-9VX]/g, "")
        .slice(0, 12);

    hideError();
});

// ==========================================
// LEAP YEAR CHECK
// ==========================================

function isLeapYear(year) {
    return (
        year % 400 === 0 ||
        (year % 100 !== 0 && year % 4 === 0)
    );
}

// ==========================================
// DATE CALCULATION
// Uses the month boundaries and subtraction
// from the Python program supplied by the user.
// ==========================================




function getDateFromDay(year, dayNumber) {

    // Same month allocation as your C++ program.
    // February always contains 29 days.

    const months = [
        31, 29, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
    ];

    const monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];

    if (
        !Number.isInteger(dayNumber) ||
        dayNumber < 1 ||
        dayNumber > 366
    ) {
        throw new Error("Invalid NIC day number.");
    }

    let remainingDays = dayNumber;
    let monthIndex = 0;

    while (
        monthIndex < 12 &&
        remainingDays > months[monthIndex]
    ) {
        remainingDays -= months[monthIndex];
        monthIndex++;
    }

    if (monthIndex >= 12) {
        throw new Error("Invalid NIC date.");
    }

    const dayOfMonth = remainingDays;

    return new Date(
        Date.UTC(year, monthIndex, dayOfMonth)
    );
}




// ==========================================
// GET AGE
// ==========================================

function calculateAge(birthDate) {

    const today = new Date();

    let years =
        today.getFullYear() - birthDate.getUTCFullYear();

    let months =
        today.getMonth() - birthDate.getUTCMonth();

    let days =
        today.getDate() - birthDate.getUTCDate();

    if (days < 0) {
        months--;

        const previousMonthDays = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        ).getDate();

        days += previousMonthDays;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years < 0) {
        throw new Error("The calculated date is in the future.");
    }

    return { years, months, days };
}

// ==========================================
// AGE CATEGORY
// ==========================================

function getAgeGroup(age) {

    if (age < 13) return "Child";
    if (age < 20) return "Teenager";
    if (age < 60) return "Adult";

    return "Senior Adult";
}

// ==========================================
// SVG AVATAR
// ==========================================

function createAvatar(gender) {

    if (gender === "Male") {
        return `
            <svg viewBox="0 0 150 150"
                 xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="maleGradient"
                        x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#42d9ed"/>
                        <stop offset="100%" stop-color="#4d8dff"/>
                    </linearGradient>
                </defs>

                <circle cx="75" cy="75" r="68"
                    fill="#172b50"/>

                <path d="M25 140 Q30 100 75 100
                    Q120 100 125 140"
                    fill="url(#maleGradient)"/>

                <ellipse cx="75" cy="67" rx="31" ry="37"
                    fill="#e9b994"/>

                <path d="M44 64 Q38 18 77 21
                    Q112 19 107 63
                    L99 47 Q77 57 49 43 Z"
                    fill="#20263a"/>

                <circle cx="64" cy="69" r="3" fill="#20263a"/>
                <circle cx="86" cy="69" r="3" fill="#20263a"/>

                <path d="M67 86 Q75 91 83 86"
                    stroke="#9c5b52"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"/>
            </svg>
        `;
    }

    return `
        <svg viewBox="0 0 150 150"
             xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="femaleGradient"
                    x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#d28cff"/>
                    <stop offset="100%" stop-color="#7a65ff"/>
                </linearGradient>
            </defs>

            <circle cx="75" cy="75" r="68"
                fill="#292044"/>

            <path d="M35 77 Q24 15 77 17
                Q130 18 115 85
                L112 121 Q75 145 38 121 Z"
                fill="#292039"/>

            <path d="M25 140 Q30 100 75 100
                Q120 100 125 140"
                fill="url(#femaleGradient)"/>

            <ellipse cx="75" cy="68" rx="30" ry="36"
                fill="#e9b994"/>

            <path d="M45 64 Q40 23 77 23
                Q111 22 105 64
                Q90 44 52 45 Z"
                fill="#292039"/>

            <circle cx="64" cy="69" r="3" fill="#20263a"/>
            <circle cx="86" cy="69" r="3" fill="#20263a"/>

            <path d="M67 86 Q75 91 83 86"
                stroke="#9c5b52"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"/>
        </svg>
    `;
}

// ==========================================
// NIC DECODING
// ==========================================

function decodeNIC() {

    const nic = nicInput.value.trim().toUpperCase();

    let year;
    let dayNumber;
    let gender;
    let isOldNIC = false;

    hideError();

    // NEW NIC: 12 digits
    if (/^[0-9]{12}$/.test(nic)) {

        year = Number(nic.substring(0, 4));
        dayNumber = Number(nic.substring(4, 7));

    }

    // OLD NIC: 9 digits + V/X
    else if (/^[0-9]{9}[VX]$/.test(nic)) {

        isOldNIC = true;

        const shortYear = Number(nic.substring(0, 2));
        year = shortYear <= 26
            ? 2000 + shortYear
            : 1900 + shortYear;

        dayNumber = Number(nic.substring(2, 5));

    }

    else {
        throw new Error(
            "Please enter a valid old NIC (9 digits + V/X) or new NIC (12 digits)."
        );
    }

    // GENDER DETECTION
    if (dayNumber > 500) {
        gender = "Female";
        dayNumber -= 500;
    } else {
        gender = "Male";
    }

    // VALIDATE YEAR
    if (year < 1900 || year > new Date().getFullYear()) {
        throw new Error("Invalid birth year.");
    }

    // CALCULATE DATE
    const birthDate = getDateFromDay(year, dayNumber);

    if (birthDate.getTime() > Date.now()) {
        throw new Error("The calculated birth date is in the future.");
    }

    const age = calculateAge(birthDate);
    const ageGroup = getAgeGroup(age.years);

    return {
        birthDate,
        gender,
        age,
        ageGroup,
        isOldNIC
    };
}

// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(data) {

    const { birthDate, gender, age, ageGroup, isOldNIC } = data;

    const dobText = birthDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    });

    const weekday = birthDate.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC"
    });

    dobResult.textContent = dobText;
    genderResult.textContent = gender;

    ageResult.textContent =
        `${age.years} Years, ${age.months} Months`;

    weekdayResult.textContent = weekday;

    identityTitle.textContent =
        gender === "Male" ? "Gentleman" : "Lady";

    identityAgeGroup.textContent = ageGroup;
    identityGender.textContent = gender.toUpperCase();

    avatarArtwork.innerHTML = createAvatar(gender);

    yearNotice.textContent = isOldNIC
        ? "Note: Old NICs contain only a two-digit birth year. The century is estimated using a year cutoff and may need independent verification."
        : "";

    results.classList.remove("hidden");
    formatResult.textContent = data.isOldNIC ? "Old NIC" : "New NIC";
    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==========================================
// ERROR MESSAGE
// ==========================================

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
}

function hideError() {
    errorMessage.textContent = "";
    errorMessage.classList.remove("show");
}

// ==========================================
// DECODE BUTTON
// ==========================================

decodeButton.addEventListener("click", () => {

    try {

        decodeButton.disabled = true;
        scanner.classList.add("active");
        results.classList.add("hidden");
        hideError();

        setTimeout(() => {

            try {

                const decodedData = decodeNIC();

                displayResults(decodedData);

            } catch (error) {

                showError(error.message);

            } finally {

                scanner.classList.remove("active");
                decodeButton.disabled = false;

            }

        }, 1100);

    } catch (error) {

        scanner.classList.remove("active");
        decodeButton.disabled = false;
        showError(error.message);

    }
});

// ==========================================
// ENTER KEY
// ==========================================

nicInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        decodeButton.click();
    }

});

// ==========================================
// CLEAR BUTTON
// ==========================================

clearButton.addEventListener("click", () => {

    nicInput.value = "";
    hideError();
    nicInput.focus();

});

// ==========================================
// RESET BUTTON
// ==========================================

resetButton.addEventListener("click", () => {

    nicInput.value = "";

    results.classList.add("hidden");

    hideError();

    nicInput.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

// ==========================================
// COPY RESULTS
// ==========================================

copyButton.addEventListener("click", async () => {

    const text = [
        "NEXUS NIC - DECODING RESULTS",
        "Date of Birth: " + dobResult.textContent,
        "Gender: " + genderResult.textContent,
        "Age: " + ageResult.textContent,
        "Birthday: " + weekdayResult.textContent
    ].join("\n");

    try {

        await navigator.clipboard.writeText(text);

        copyButton.textContent = "✓ COPIED SUCCESSFULLY";

        setTimeout(() => {
            copyButton.innerHTML = "<span>▣</span> COPY RESULTS";
        }, 2000);

    } catch (error) {

        showError("Unable to copy. Please copy the results manually.");

    }

});

// ==========================================
// DARK / LIGHT MODE
// ==========================================

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const lightMode =
        document.body.classList.contains("light-theme");

    themeToggle.textContent = lightMode ? "☾" : "☀";

    document.querySelector('meta[name="theme-color"]')
        .setAttribute("content", lightMode ? "#edf2ff" : "#080d1c");

});

// ==========================================
// TEST EXAMPLES
// ==========================================

// In 2005, your Python-style calculation gives:
// Day 304 = 30 October 2005
//
// In 2005:
// Day 261 = 17 September 2005
// Day 262 = 18 September 2005
//
// These examples follow the supplied Python logic.
