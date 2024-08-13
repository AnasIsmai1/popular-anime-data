const url = "https://api.jikan.moe/v4/top/anime";
const animeTitles = document.querySelector('.anime-titles');
const popularAnimeShowcase = document.querySelector('#popular-anime .container');



async function topAnimeFetch() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (res.status == 200) {
            const db = data.data;
            return db;
        } else {
            throw new Error("Server Error: ", res.statusText);
        }
    }
    catch (err) {
        console.error('Error: ', err);
    }
}

async function getPopularAnime() {
    const res = await fetch('https://api.jikan.moe/v4/seasons/now');
    const data = await res.json();
    return data.data;
}

function updateHomePage(db) {


    function addTitles() {
        animeTitles.innerHTML = '' // Clear previously existing html

        const frag = document.createDocumentFragment();

        for (let i = 0; i < db.length; i++) {

            const animeCard = document.createElement('div')
            const main = document.createElement('div')
            const img = document.createElement('img');
            const animeNamaewa = document.createElement('div');
            const banner = document.createElement('div');
            const ep = document.createElement('div');
            const epCount = document.createElement('p');
            const type = document.createElement('div');
            const typeDef = document.createElement('p');
            const span = document.createElement('span')

            animeCard.className = 'anime-card';
            main.className = 'card-main';
            img.src = db[i].images.jpg.large_image_url;
            img.alt = `${db[i].title} anime cover image`;
            animeNamaewa.className = 'anime-name';
            animeNamaewa.textContent = db[i].title;
            banner.className = 'banner';
            ep.className = 'ep';
            ep.classList.add('info');
            epCount.textContent = db[i].episodes || 'N/A';
            type.className = 'type';
            typeDef.textContent = db[i].type;
            span.textContent = "Go to Anime";
            span.setAttribute('data-id', db[i].mal_id);

            frag.append(animeCard);
            animeCard.append(main, animeNamaewa);
            main.append(img, span, banner);
            banner.append(ep, type);
            ep.append(epCount);
            type.append(typeDef);
        }

        animeTitles.appendChild(frag);

    }
    addTitles();

}

function updateShowcase(db) {

    let rand = Math.floor(Math.random() * db.length) + 1;

    const popularAnime = {
        name: db[rand].title_english,
        image: db[rand].images.jpg.large_image_url,
        synopsis: db[rand].synopsis,
        rating: db[rand].rating,
        premier: (db[rand].season +' '+ db[2].year) || null,
        id: db[rand].mal_id,
    }


    popularAnimeShowcase.innerHTML = '';

    let synopsis = popularAnime.synopsis.split('.');
    synopsis = synopsis[0] + '...';


    const animeTitle = document.createElement('h2');
    const animeDescription = document.createElement('p');
    const img = document.createElement('img');
    const animeDeets = document.createElement('span');
    const imgSpan = document.createElement('span');
    animeDeets.setAttribute('data-id', popularAnime.id);
    const smallIcons = document.createElement('div');
    const rating = document.createElement('p');
    const premier = document.createElement('p');




    animeTitle.textContent = popularAnime.name;
    animeDescription.textContent = synopsis;
    img.src = `${popularAnime.image}`;
    animeDeets.className = 'anime-details'
    smallIcons.className = 'small-icons';
    rating.className = 'rating'
    rating.textContent = popularAnime.rating;
    premier.className = 'premier';
    premier.textContent = popularAnime.premier;

    popularAnimeShowcase.append(animeDeets,imgSpan);
    imgSpan.append(img);
    animeDeets.append(animeTitle,smallIcons, animeDescription);
    smallIcons.append(rating, premier)


}

async function main() {
    try {
        const res = await topAnimeFetch();
        const update = await updateHomePage(res);
        const pop = await getPopularAnime();
        updateShowcase(pop);
        setInterval(() => {
            updateShowcase(pop);
        }, 10000);
    }
    catch (err) {
        console.error('Error: ', err)
    }
    finally {
        const spans = document.querySelectorAll('span');
        spans.forEach(span => {
            span.addEventListener('click', () => {
                console.log('clicked');
                let id = span.getAttribute('data-id');
                localStorage.setItem('id', id);
                setTimeout(() => {
                    window.location.href = 't2.html';
                }, 500);
            })
        })
    }
}

main();


// export const id;
