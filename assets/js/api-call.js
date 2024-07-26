const API_ENDPOINT = "https://fedskillstest.coalitiontechnologies.workers.dev";

let username = "coalition";
let password = "skills-test";
let auth = btoa(`${username}:${password}`);
let data;
let Jessica_data;
let blood_pressure = [];
let dialistolic = [];
let systolic = [];
let months = [];
// Function to send the API request
async function sendRequest() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const profile_pic = document.getElementById("patient_id");
    const patient_name = document.getElementById("profile_name");
    const birth_value = document.getElementById("birth_value");
    const gender_value = document.getElementById("gender_value");
    const emergency_value = document.getElementById("emergency_value");
    const phone_value = document.getElementById("phone_value");
    const insurance_value = document.getElementById("insurance_value");

    data = await response.json();
    Jessica_data = data[3];
    const diagnosis_history = Jessica_data.diagnosis_history;
    console.log(data[3]);
    profile_pic.src = Jessica_data.profile_picture;
    patient_name.innerHTML = Jessica_data.name;
    birth_value.innerHTML = Jessica_data.date_of_birth;
    gender_value.innerHTML = Jessica_data.gender;
    emergency_value.innerHTML = Jessica_data.emergency_contact;
    phone_value.innerHTML = Jessica_data.phone_number;
    insurance_value.innerHTML = Jessica_data.insurance_type;

    Jessica_data.diagnosis_history.forEach((element) => {
      return blood_pressure.push(element.blood_pressure);
    });
    // updating table

    for (i = 0; i < Jessica_data.diagnostic_list.length; i++) {
      updateTable(Jessica_data.diagnostic_list[i], i);
    }

    //updating lab resutls
    for (let i = 0; i <= Jessica_data.lab_results.length; i++) {
      updateLabResults(Jessica_data.lab_results[i]);
    }

    //updating charts
    for (let i = 0; i <= blood_pressure.length; i++) {
      systolic.push(blood_pressure[i]?.systolic.value);
      dialistolic.push(blood_pressure[i]?.diastolic.value);
      months.push(i + 1);
      if (systolic.length === 25) {
        const container = document.getElementById("chartContainer");

        const canvas = document.createElement("canvas");
        canvas.id = "myChart";
        container.appendChild(canvas);
        console.log(container);
        const ctx = document.getElementById("myChart");

        new Chart(ctx, {
          type: "line",
          data: {
            labels: months,
            datasets: [
              {
                label: "Systolic",
                data: systolic,
                borderWidth: 1,
                backgroundColor: "#E66FD2",
              },
              {
                label: "Diastolic",
                data: dialistolic,
                borderWidth: 1,
                backgroundColor: "#8C6FE6",
              },
            ],
          },
          options: {
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Value",
                },
                max: 200,
              },
            },
          },
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

  //updating table data
  function updateTable(data, i) {
    const table = document
      .getElementById("table")
      .getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    cell1.innerHTML = data.description;
    cell2.innerHTML = data.name;
    cell3.innerHTML = data.status;
  }
}

function updateLabResults(data) {
  const parentContainer = document.getElementById("lab-data");
  const originalItem = parentContainer.querySelector(".profile-data-text");
  const newItem = originalItem.cloneNode(true);
  const originalImage = originalItem.querySelector("img");

  // Create a new img element
  const newImage = document.createElement("img");
  newImage.src = originalImage.src;
  newImage.alt = originalImage.alt;
  newImage.width = originalImage.width;
  newImage.height = originalImage.height;

  newItem.innerHTML = data;
  const currentItem = newItem;
  currentItem.appendChild(newImage);
  parentContainer.appendChild(currentItem);
}
