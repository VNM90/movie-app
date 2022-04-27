const movieForm = document.querySelector(".movie-form");

movieForm.addEventListener("submit", async(event) => {
    event.preventDefault();

    const baseUrl = "https://w-strapi-movies-app-9wxhf.ondigitalocean.app/api/movies";
    const movieTitle = document.querySelector(".title").value;
    const movieAuthor = document.querySelector(".author").value;
    const movieDescription = document.querySelector(".description").value;
    const movieAvailability = document.querySelector('input[name="available"]:checked').value;
    const movieYear = document.querySelector("#date").value

        const attributes = {
            data: {
                title: movieTitle,
                description: movieDescription,
                author: movieAuthor,
                available: movieAvailability,
                year: movieYear
            } }

    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(attributes)
        })
        await response.json()
    }
    catch (error) {
        alert(error)
    }
    movieForm.reset()
})


