let page = 1;
const DISCOVER_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${config.API_KEY}&page=`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${config.API_KEY}&query="`;


const form = document.querySelector('#form');
const search = document.querySelector('#search');
const moviesContainer = document.querySelector('#movies-container');
const loader = document.querySelector('.loader');
const logo = document.querySelector('#logo');

// display home page
getDiscoverMovies(DISCOVER_URL + `${page}`);

async function returnHomePage(url) {
    const res = await fetch(url);
    const data = await res.json();

    displayDiscoverMovies(data.results)
}

async function getDiscoverMovies(url) {
    const res = await fetch(url);
    const data = await res.json();

    displayDiscoverMovies(data.results);

}

function displayDiscoverMovies(movies) {
    // mmoviesContainer.innerHTML = '';
    movies.forEach(movie => {
        displayMovies(movie);
    })
}

function displayMovies(movie) {
        const { title, overview, poster_path, vote_average } = movie;
        let imgPath;

        if (poster_path) {
            imgPath = IMG_PATH + poster_path;
        } else {
            imgPath = 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1NzkwOTg3OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080';
        }

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
        <img src="${imgPath}" alt="${title}">
        <div class="movie-info">
            <h4>${title}</h4>
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            <p>${overview}</p>
        </div>
        `
        moviesContainer.appendChild(movieEl);
}

// search movies 
async function getSearchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length === 0) {
        moviesContainer.innerHTML = '';
        const noResult = document.createElement('div');
        noResult.innerHTML = '<h4 class="no-result">There is no search result</h4>';
        moviesContainer.append(noResult);
    } else {
        displaySearchMovies(data.results);
    }
    
}

function displaySearchMovies(movies) {
    moviesContainer.innerHTML = '';

    
    movies.forEach(movie => {
        displayMovies(movie);
    })
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getSearchMovies(SEARCH_API + searchTerm + '"');
        search.value = '';
    } else {
        window.location.reload();
    }

    window.removeEventListener("scroll", handleInfiniteScroll);
})

// infinite scroll
function handleInfiniteScroll() {
    const { scrollHeight, clientHeight } = document.documentElement;

    if (scrollHeight <= window.pageYOffset + clientHeight) {
        showLoading();
    }
}

function showLoading() {
    loader.classList.add('show');

    setTimeout(() => {
        loader.classList.remove('show'); 

        setTimeout(() => {
            page++;
            getDiscoverMovies(DISCOVER_URL + `${page}`);
        
        }, 500)
    }, 1000)
    
}

window.addEventListener("scroll", handleInfiniteScroll);

// back-to-top button
const backToTopButton = document.querySelector('.back-to-top');

backToTopButton.addEventListener('click', () => {
    document.body.scrollIntoView({
        behavior: 'smooth'
    });
})

// click logo to return home page
logo.addEventListener('click', () => {
    moviesContainer.innerHTML = '';
    returnHomePage(DISCOVER_URL + `${page}`);
    window.addEventListener("scroll", handleInfiniteScroll);
})
