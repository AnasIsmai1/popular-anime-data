const url = 'https://api.jikan.moe/v4/top/anime';
const img = document.querySelector('img');
const animeName = document.querySelector('h2');
const mainStats = document.querySelector('.box-2 ul');
const alternateTitles = document.querySelector('.titles ul');
const user = document.querySelector('.users');
const synop = document.querySelector('.synopsis p');
const background = document.querySelector('.background p');
const stats = document.querySelector('ol');
const scoreDis = document.querySelector('h3');
const statistics = document.querySelector('.statistics ul');
const information = document.querySelector('.information ul');

let syn;
let bg;
let imgUrl;
let Rank;
let Popularity;
let Members;
let Users;
let Japanese;
let English;
let studio;
let type;
let season;
let year;
let score;
let favourite;
let episodes;
let status;
let rating;
let duration;
let source;

async function firstFetch() {
    try {
        let name = "hun";
        const response = await fetch(`${url}`);
        const data = await response.json();
        console.log(data.data);
        let id;
        name = name.split(" ");
        for(let i =0; i < name.length; i++){
            name[i] = name[i].charAt(0).toUpperCase() + name[i].substring(1).toLowerCase();
        }
        name = name.join(" ");
        if(response.status == 200) {
            let arrs = data.data;
            let titles = []
            let isFound = false;
            for(let i = 0; i < arrs.length;i++){
                titles.push(arrs[i].titles);
            }
            let tries = 0;
            
            for(let i = 0; i < titles.length; i++) {
                if(!isFound) {
                    for(let j = 0; j < titles[i].length; j++) { 
                        if(titles[i][j].title.toUpperCase().includes(name.toUpperCase())) {
                            console.log('Title: ', arrs[i].title);
                            id = i;
                            isFound = true;
                            break;
                        }else {
                            tries++;
                            continue;
                        }
                    } 
                }
            }
            console.log("It took us",tries, "tries");
            if(isFound) {
                console.log(name)
                console.log(data.data[id]);
                const db = data.data[id];
                imgUrl = db.images.jpg.large_image_url;
                animeName.textContent = db.title 
                Members = db.members;
                Rank = db.rank;
                Rank = "#" + Rank;
                Popularity = db.popularity;
                Popularity = '#' + Popularity;
                Users = db.scored_by;
                syn = db.synopsis;
                bg = db.background;
                English = db.title_english;
                Japanese = db.title_japanese;
                studio = db.studios[0].name;
                type = db.type;
                season = db.season;
                year = db.year;
                score = db.score;
                Favorites = db.favorites;
                rating = db.rating;
                source = db.source;
                episodes = db.episodes;
                duration = db.duration;
                updateDOM();
            }else {
                console.log(name, "was not found")
            }
        }else {
            console.warn('Server Error: ', data.message);
        }
    }
    catch(err) {
        console.error('Error', err);
    }
}

function updateDOM() {
    img.src = imgUrl;
    for(let i = 0; i < mainStats.childElementCount; i++ ) {
        const strong = document.createElement('strong');
        const attr = mainStats.children[i].getAttribute('data-value');
        strong.textContent = `${eval(attr)}`;
        mainStats.children[i].innerHTML = `${attr} `;
        mainStats.children[i].appendChild(strong);
    }
    if(bg) {
        bg = bg.split(".");
        bgLen = bg.length;
        if(bg[0] == bg[bgLen - 2]){
            background.innerHTML =`${bg[0]}`
        }else {
            background.innerHTML =`${bg} <br><br>${bg[bgLen - 2]}`; 
        }
    }else {
        background.parentElement.style.display = "none";
    }
    synop.textContent = syn; 
    user.textContent = `${Users.toLocaleString('en-US')} users`;
    for(let i =0; i < alternateTitles.childElementCount; i++) {
        const elem = alternateTitles.children[i];
        const attr = elem.getAttribute('data-value');
        elem.innerHTML =` <strong>${attr}</strong>: ${eval(attr)}`;
    }

    for(let i = 0; i < stats.childElementCount; i++) {
        const elem = stats.children[i];
        const attr = elem.getAttribute('data-value');
        const attr2 = elem.getAttribute('data-value2');
        if(attr2) {
            elem.firstChild.textContent = `${eval(attr)} ${eval(attr2)}`;
        } else {
            elem.firstChild.textContent = `${eval(attr)}`;
        }
    }

    for(let i = 0; i < statistics.childElementCount; i++) {
        const elem = statistics.children[i];
        const attr = elem.getAttribute('data-value');
        const attr2 = elem.getAttribute('data-value2');
        if(attr2) {
            elem.innerHTML = `<strong>${attr}:</strong> ${eval(attr)} (scored by ${eval(attr2)})`;
        } else {
            elem.innerHTML = `<strong>${attr}:</strong> ${eval(attr)}`;
        }
    }
    for(let i = 0; i < information.childElementCount; i++) {
        const elem = information.children[i];
        const attr = elem.getAttribute('data-value');
        const attr2 = elem.getAttribute('data-value2');
        if(attr2) {
            elem.innerHTML = `<strong>${attr}:</strong> ${eval(attr)} (scored by ${eval(attr2)})`;
        } else {
            elem.innerHTML = `<strong>${attr}:</strong> ${eval(attr)}`;
        }
    }
    scoreDis.innerText = score;
}

firstFetch();