const baseUrl = "https://w-strapi-movies-app-9wxhf.ondigitalocean.app/api/movies";
const movieForm = document.querySelector(".movie-form");
const loadingArea = document.querySelector(".loading");
const searchButton = document.querySelector(".btn-search");
const searchInput = document.querySelector(".search-input");
let movieArray = [];

// Defining async function
async function getData(url) {

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
        movieArray.length = 0;
        for (let movie of data.data) {
            movieArray.push(movie)
        }
        return movieArray;
    }
}


// Function remove movie
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


function messageBox(message, link="#", secondLink="#") {
    
    const modalBox = document.querySelector(".message");

    const msg = 

    `<div>
    <p>${message}</p>
    <button class="btn btn-yes" onclick="window.location.href='${secondLink}';">YES</button>
    <button class="btn btn-no" onclick="window.location.href='${link}';">NO</button>
    </div>`

    modalBox.innerHTML = msg
    modalBox.showModal()
}

// Search
if(loadingArea) {
    searchButton.addEventListener("click", () => {
        const searchedMovie = movieArray.filter(movie => movie.attributes.title.trim().toUpperCase() == searchInput.value.trim().toUpperCase());
        for (let searchedMovieData of searchedMovie) {
            const movieAvailability = searchedMovieData.attributes.available ? "Available" : "Not available";
            movieTab =

            `<table class="movie-table">
            <tr><td class="movie movie-id">ID: ${searchedMovieData.id}</td></tr>
            <tr><td class="movie movie-title">${searchedMovieData.attributes.title}</td></tr>
            <tr><td class="movie movie-description">${searchedMovieData.attributes.description}</td></tr>
            <tr><td class="movie movie-author">${searchedMovieData.attributes.author}</td></tr>
            <tr><td class="movie movie-availability">${movieAvailability}</td></tr>
            <tr><td><button class="btn btn-primary" onclick="removeMovie(${searchedMovieData.id})">DELETE</button></tr></td>
            <tr><td><button class="btn btn-secondary" onclick="showModalMain(${searchedMovieData.id},'${searchedMovieData.attributes.title}','${searchedMovieData.attributes.description}','${searchedMovieData.attributes.author}', '${movieAvailability}', '${searchedMovieData.attributes.year}')">DETAILS</button></tr></td>
            </table>`

            document.querySelector(".div-movies").innerHTML = movieTab;
        }
        if((searchedMovie.length === 0) && (searchInput.value !== "")) {
            document.querySelector(".div-movies").innerHTML = `<p>Movie not found</p>`;
        }
    })
}


if(searchInput) {
    searchInput.addEventListener("input", () => {
        if(searchInput.value == "") {
            getData(baseUrl);
        }
    })
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

        for (title of movieArray) {
            counter += 1; 
            if (movieTitle.trim().toUpperCase() == title.attributes.title.trim().toUpperCase()) {
                alert("SAME TITLE")
                break;
            }
            else if((counter == movieArray.length) || (movieArray.length == 0)){
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
            messageBox("DO YOU WANT TO ADD ANOTHER MOVIE?", "index.html", "form.html")
            movieForm.reset()
            }
        }
    })
}