const baseUrl = "https://w-strapi-movies-app-9wxhf.ondigitalocean.app/api/movies";
const movieForm = document.querySelector(".movie-form");
let movieTitleArray = [];

// Defining async function
async function getData(url) {

    const loadingArea = document.querySelector(".loading")
    const response = await fetch(url);

    // Storing data in form of JSON
    const data = await response.json();

    if(loadingArea) {
    // Storing response
        try {
            if (!response.ok) {
                throw new Error(`Http error: ${response.status}`);
            }
            if (response) {
                loadingArea.style.display = 'none';
            }
            showData(data);
        }
        catch (error) {
            loadingArea.innerHTML = error;
        }
    }
    if((movieForm) || (loadingArea)) {
        for (let movie of data.data) {
            movieTitleArray.push(movie.attributes.title)
        }
        return movieTitleArray;
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


// Modal
function showModalMain(id, title, description, author, available, year){

    const modal = document.querySelector(".modal-movie");

        const dialog = 
        
        `<div>
        <p>${id}<p>
        <p>${title}<p>
        <p>${description}<p>
        <p>${author}<p>
        <p>${available}<p>
        <p>${year}<p>
        <button class="btn btn-cancel">Close</button>
        </div>`

            modal.innerHTML = dialog

            document.querySelector(".btn-cancel").addEventListener('click', () => {
                modal.close()
            })
        modal.showModal()
    }
 

// Function to define innerHTML for HTML table
function showData(data) {

    const searchInput = document.querySelector(".search-input");
    const searchButton = document.querySelector(".btn-search")
    let movieTab = ``;

    // Loop to access all rows
    for (let movie of data.data) {
        const movieAvailability = movie.attributes.available ? "Available" : "Not available";
        movieTab +=

            `<table class="movie-table">
             <tr><td class="movie movie-id">ID: ${movie.id}</td></tr>
             <tr><td class="movie movie-title">${movie.attributes.title}</td></tr>
             <tr><td class="movie movie-description">${movie.attributes.description}</td></tr>
             <tr><td class="movie movie-author">${movie.attributes.author}</td></tr>
             <tr><td class="movie movie-availability">${movieAvailability}</td></tr>
             <tr><td><button class="btn btn-primary" onclick="removeMovie(${movie.id})">DELETE</button></tr></td>
             <tr><td><button class="btn btn-secondary" onclick="showModalMain(${movie.id},'${movie.attributes.title}','${movie.attributes.description}','${movie.attributes.author}', '${movieAvailability}', '${movie.attributes.year}')">DETAILS</button></tr></td>
             </table>`

    }
    // Setting innerHTML as movieTab variable
    document.querySelector(".div-movies").innerHTML = movieTab;
}


// Form
if(movieForm) {
    movieForm.addEventListener("submit", async(event) => {
        event.preventDefault();
        const movieTitle = document.querySelector(".title").value;
        const movieAuthor = document.querySelector(".author").value;
        const movieDescription = document.querySelector(".description").value;
        const movieAvailability = document.querySelector('input[name="available"]:checked').value;
        const movieYear = document.querySelector("#date").value;
        let counter = 0;
      
        const attributes = {
            data: {
                title: movieTitle,
                description: movieDescription,
                author: movieAuthor,
                available: movieAvailability,
                year: movieYear
            } }

        for (title of movieTitleArray) {
            counter += 1; 
            if (movieTitle.trim().toUpperCase() == title.trim().toUpperCase()) {
                alert("SAME TITLE")
                break;
            }
            else if((counter == movieTitleArray.length) || (movieTitleArray.length == 0)){
                try {
                    const response = await fetch(baseUrl, {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(attributes)
                    })
                    await response.json()
                    alert("SUCCESS")
                }
                catch (error) {
                    alert(error)
                }
            movieForm.reset()
            }
        }
    })

}


