const url = "https://api.jikan.moe/v4/anime";
const img = document.querySelector("img");
const animeName = document.querySelector("h2");
const mainStats = document.querySelector(".box-2 ul");
const alternateTitles = document.querySelector(".titles ul");
const user = document.querySelector(".users");
const synop = document.querySelector(".synopsis p");
const background = document.querySelector(".background p");
const stats = document.querySelector("ol");
const scoreDis = document.querySelector("h3");
const statistics = document.querySelector(".statistics ul");
const information = document.querySelector(".information ul");
const charactersDisplay = document.querySelector(".boxes");
const search = document.querySelector('#search-bar');
let animeNamaewa;

let id = localStorage.getItem('id');
console.log(id);

async function fetchAnimeData(id) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const data = await response.json();

        if (response.status == 200) {
            const db = data.data;
            console.log(db);
            return db;
        } else {
            throw new Error(
                "Server Error: " + response.status + " " + response.statusText
            );
        }
    } catch (err) {
        console.error("Error", err);
    }
}

async function getCharacters(db) {
    try {
        let idNum = db.mal_id
        const response = await fetch(
            `https://api.jikan.moe/v4/anime/${idNum}/characters`
        );
        if (response.status == 200) {
            const data = await response.json();
            const db = data.data;
            // console.log(db)
            let characters = [];
            class character {
                constructor(characterName, characterImg, vaName, vaLanguage, role) {
                    this.characterName = characterName;
                    this.characterImg = characterImg
                    this.vaName = vaName;
                    this.vaLanguage = vaLanguage;
                    this.role = role = "main";

                }

                displayInfo() {
                    console.log(
                        `Character Name: ${this.characterName} \nVA Actor: ${this.vaName} \nVA Language: ${this.vaLanguage}`
                    );
                }
            }
            db.forEach((data) => {
                let role = data.role;
                if (role == "Main") {
                    if (data.voice_actors[0]) {
                        let char = new character(
                            data.character.name,
                            data.character.images.jpg.image_url,
                            data.voice_actors[0].person.name,
                            data.voice_actors[0].language
                        );
                        // char.displayInfo();
                        characters.push(char);
                    } else {
                        console.log("Voice Actor not Found");
                        let char = new character(data.character.name, data.character.images.jpg.image_url,"N/A", "N/A");
                        // char.displayInfo();
                        characters.push(char);
                    }
                }
            });
            return characters;
        } else {
            throw new Error(
                `Server Error: ${response.status} ${response.statusText}`
            );
        }
    } catch (err) {
        console.error("Error: ", err);
    }
}

function updateDOM(db, charDB) {
    // Arrays

    console.log(db, charDB)

    let studios = [];
    let genres = [];
    let themes = [];
    let demographics = [];
    let licensors = [];
    let producers = [];

    class Studios {
        constructor(name, url) {
            this.name = name;
            this.url = url;
        }
        displayInfo() {
            console.log(
                `Studio Name: ${this.name} \nStudio URL: ${this.url}`
            );
        }
    }

    db.genres.forEach((item) => {
        let gn = {
            name: item.name,
            url: item.url,
        };
        genres.push(gn);
    });


    db.themes.forEach((item) => {
        let tm = {
            name: item.name,
            url: item.url,
        };
        themes.push(tm);
    });


    db.demographics.forEach((item) => {
        let dm = {
            name: item.name,
            url: item.url,
        };
        demographics.push(dm);
    });


    db.licensors.forEach((item) => {
        let lc = {
            name: item.name,
            url: item.url,
        };
        licensors.push(lc);
    });


    db.producers.forEach((item) => {
        let pd = {
            name: item.name,
            url: item.url,
        };
        producers.push(pd);
    });


    db.studios.forEach((sName) => {
        const stat = new Studios(sName.name, sName.url);
        studios.push(stat);
    });

    // data

    alternateTitlesList = {
        Japanese: db.title_japanese,
        English: db.title_english,
    };

    mainStatsList = {
        Rank: `#${db.rank}`,
        Members: `#${db.members}`,
        Popularity: `${db.popularity}`,
    };

    let Premier = (db.season, db.year) || null;

    infoList = {
        Type: db.type,
        Episodes: db.episodes,
        Status: db.status,
        Aired: db.aired.string,
        Premiered: Premier || null,
        Broadcast: db.broadcast.string,
        Demographics: demographics,
        Producers: producers,
        licensors: licensors,
        Studios: studios,
        Source: db.source,
        Genres: genres,
        Themes: themes,
        Duration: db.duration,
        Rating: db.rating,
    };
    console.log(infoList);

    statisticsList = {
        Score: db.score,
        Rank: `#${db.rank}`,
        Members: `#${db.members}`,
        Popularity: `${db.popularity}`,
        Favorites: db.favorites,
    }

    statsList = {
        Premier: [Premier, '#'] || 'none',
        Type : [db.type, db.url],
        Studio: [db.studios[0].name, db.studios[0].url],
    }

    console.log(statsList[Premier]);

    // One Liner Initializations

    animeName.textContent = db.title;
    img.src = db.images.jpg.large_image_url;
    synop.textContent = db.synopsis;
    scoreDis.innerText = db.score;
    let users = db.scored_by || 0;
    user.textContent = `${users.toLocaleString("en-US")} users`;

    let bg = db.background;

    if (bg) {
        bg = bg.split(".");
        bgLen = bg.length;
        if (bg[0] == bg[bgLen - 2]) {
            background.innerHTML = `${bg[0]}`;
        } else {
            background.innerHTML = `${bg} <br><br>${bg[bgLen - 2]}`;
        }
    } else {
        background.parentElement.style.display = "none";
    }


    charactersDisplay.innerHTML = ' ';
    for(let i = 0; i < charDB.length; i++) {

        const box = document.createElement('div');
        const charImg = document.createElement('img');
        const charName = document.createElement('h4');
        const charDeets = document.createElement('div');
        const vaDeets = document.createElement('div');
        const vActor = document.createElement('span');
        const vaLang = document.createElement('span');

        charName.textContent = charDB[i].characterName;
        charImg.src = charDB[i].characterImg;
        charImg.alt = `image of ${charDB[i].characterName}`
        box.className = 'box';
        charDeets.className = "character-details";
        vaDeets.className = "va-details"
        vActor.textContent = charDB[i].vaName;
        vaLang.textContent = charDB[i].vaLanguage;


        charactersDisplay.append(box);
        box.append(charImg);
        box.append(charDeets);
        charDeets.append(charName);
        charDeets.append(vaDeets);
        vaDeets.append(vActor);
        vaDeets.append(vaLang);

    }

    stats.innerHTML = ' ';
    for(let i =0; i < Object.keys(statsList).length; i++) {
        const value = Object.values(statsList)[i];

        if(value[0] === null) {
            value[0] = 'N/A';
        }
        console.log(value[0]);
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = value[1];
        a.textContent = value[0];

        stats.append(li);
        li.append(a);

    }

    // Update Details

    updateList(mainStatsList, mainStats);
    updateList(alternateTitlesList, alternateTitles);
    updateList(infoList, information);
    updateList(statisticsList, statistics);
    return db.mal_id;
}

function updateList(listName, elementName) {
    elementName.innerHTML = " ";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < Object.keys(listName).length; i++) {
        const li = document.createElement("li");
        const key = Object.keys(listName)[i];
        const value = Object.values(listName)[i];
        if(typeof value === undefined) {
            value == "N/A";
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            frag.append(li);
        }else if(typeof value == null){
            continue;
        }else if(Array.isArray(value)) {
            li.innerHTML = `<strong>${key}: </strong>`;
            for(let i =0; i < value.length; i++) {
                const a = document.createElement('a');
                a.href = `${value[i].url}`;
                if(i != value.length - 1) {
                    a.textContent = value[i].name +', ';
                }else{
                    a.textContent = value[i].name;
                }
                li.appendChild(a);
            }
            frag.append(li);
        }else if(value != null) {
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            frag.append(li);
        }
        elementName.appendChild(frag);
    }

}

async function main(id) {
    try {
        const res = await fetchAnimeData(id);
        const characterData = await getCharacters(res);
        const update = await updateDOM(res, characterData);
    } catch (err) {
        console.error(err);
    }
}

main(id);
