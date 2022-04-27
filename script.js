const baseUrl = "https://w-strapi-movies-app-9wxhf.ondigitalocean.app/api/movies";
const modal = document.querySelector(".modal-movie")

// Defining async function
async function getData(url) {

    const loadingArea = document.querySelector(".loading")

    // Storing response
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Http error: ${response.status}`);
        }
        // Storing data in form of JSON
        const data = await response.json();

        if (response) {
            loadingArea.style.display = 'none';
        }
        showData(data);
    }
    catch (error) {
        loadingArea.innerHTML= error;
    }
}

async function removeMovie(id, url= baseUrl) {
    try {
        await fetch(`${url}/${id}`, {
            method: "DELETE"
        })
    }
    catch (error) {
        alert(error)
    }
    // Refreshing data after delete
    await getData(baseUrl);
}


// Calling async function
getData(baseUrl);

function showModal(movie) {
        console.log(movie)
}


// Function to define innerHTML for HTML table
function showData(data) {
    let tab = ``;

    // Loop to access all rows
    for (let movie of data.data) {
        console.log(movie)
        const movieAvailability = movie.attributes.available ? "Available" : "Not available";
        tab +=
            `<table class="movie-table">
             <tr><td class="movie-id">ID: ${movie.id}</td></tr>
             <tr><td class="movie-title">${movie.attributes.title}</td></tr>
             <tr><td class="movie-description">${movie.attributes.description}</td></tr>
             <tr><td class="movie-author">${movie.attributes.author}</td></tr>
             <tr><td class="movie-availability">${movieAvailability}</td></tr>
             <tr><td><button onclick="removeMovie(${movie.id})">DELETE</button></tr></td>
             <tr><td><button class="button-modal" onclick="showModal(${movie.attributes.title})">DETAILS</button></tr></td>
             </table>`
    }
    // Setting innerHTML as tab variable
    document.querySelector(".div-movies").innerHTML = tab;
}


// <tr><td><button onclick="(() => { console.log(JSON.stringify(${movie.id})})()">DETAILS</button></tr></td>