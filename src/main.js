const POKE_API = "https://pokeapi.co/api/v2";
const $cardsContainer = document.querySelector(".cards-container");
let offset = 0;
let limit = 20;

function getPokemonList(offset, limit) {
  return fetch(`${POKE_API}/pokemon/?offset=${offset}&limit=${limit}`).then(
    (response) => response.json()
  );
}

function getPokemonInfo(pokemon) {
  return fetch(`${POKE_API}/pokemon/${pokemon}`).then((response) =>
    response.json()
  );
}

function showPokemonList() {
  showLoader();
  occultBodyElements();
  getPokemonList(offset, limit).then((pokemonList) => {
    // console.log(pokemonList);

    for (let i = 0; i < pokemonList.results.length; i++) {
      getPokemonInfo(pokemonList.results[i].name).then((pokemonInfo) => {
        // console.log(pokemonInfo);
        createPokemonCard(pokemonInfo);
      });
    }
  });
}

function createPokemonCard(pokemonInfo) {
  occultLoader();
  showBodyElements();
  const pokemonCardContainer = document.createElement("div");
  const pokemonCard = document.createElement("div");
  pokemonCardContainer.setAttribute("class", "pokemon-card-container");
  pokemonCard.setAttribute("class", "pokemon-card");

  createFrontCard(pokemonCard, pokemonInfo);
  createBackCard(pokemonCard, pokemonInfo);

  pokemonCardContainer.appendChild(pokemonCard);
  $cardsContainer.appendChild(pokemonCardContainer);

  rotateCard(pokemonCardContainer, pokemonCard);
}

function createFrontCard(pokemonCard, pokemonInfo) {
  const frontCard = document.createElement("div");
  const pokemonImageContainer = document.createElement("figure");
  const pokemonCardImage = document.createElement("img");
  const pokemonCardName = document.createElement("figcaption");
  const pokemonName = pokemonInfo.name;

  pokemonCardName.textContent = pokemonName;
  pokemonCardImage.setAttribute(
    "src",
    pokemonInfo.sprites.other["official-artwork"].front_default
  );
  pokemonCardImage.setAttribute("alt", pokemonName);
  frontCard.setAttribute("class", "front-card");

  pokemonImageContainer.append(pokemonCardImage, pokemonCardName);
  frontCard.appendChild(pokemonImageContainer);
  pokemonCard.appendChild(frontCard);
}

function createBackCard(pokemonCard, pokemonInfo) {
  const backCard = document.createElement("div");
  const pokemonCardName = document.createElement("p");

  pokemonCardName.textContent = pokemonInfo.name;
  pokemonCardName.setAttribute("class", "pokemon-name");
  backCard.setAttribute("class", "back-card");
  backCard.appendChild(pokemonCardName);

  createStatBar("hp", pokemonInfo, backCard);
  createStatBar("attack", pokemonInfo, backCard);
  createStatBar("defense", pokemonInfo, backCard);
  createStatBar("speed", pokemonInfo, backCard);

  pokemonCard.appendChild(backCard);
}

function createStatBar(stat, pokemonInfo, backCard) {
  const statContainer = document.createElement("div");
  const statBar = document.createElement("div");
  const selectedStat = document.createElement("div");
  const textStatContainer = document.createElement("p");
  const numberStat = document.createElement("span");

  const pokemonStats = {
    hp: pokemonInfo.stats[0].base_stat,
    defense: pokemonInfo.stats[1].base_stat,
    attack: pokemonInfo.stats[2].base_stat,
    speed: pokemonInfo.stats[5].base_stat,
  };

  textStatContainer.textContent = stat;
  numberStat.textContent = pokemonStats[stat];

  statContainer.setAttribute("class", "stat-container");
  statBar.setAttribute("class", "stat-bar");
  selectedStat.setAttribute("class", `${stat}-bar`);

  textStatContainer.appendChild(numberStat);
  statBar.appendChild(selectedStat);
  statContainer.appendChild(textStatContainer, statBar);
  statContainer.appendChild(statBar);
  backCard.appendChild(statContainer);
}

function rotateCard(container, card) {
  container.onclick = () => {
    card.classList.toggle("rotate");
  };
}

function showLoader() {
  document.querySelector(".loader").classList.remove("occult");
}

function occultLoader() {
  document.querySelector(".loader").classList.add("occult");
}

function showBodyElements() {
  document.querySelector("header").classList.remove("occult");
  document.querySelector("main").classList.remove("occult");
  document.querySelector("footer").classList.remove("occult");
}

function occultBodyElements() {
  document.querySelector("header").classList.add("occult");
  document.querySelector("main").classList.add("occult");
  document.querySelector("footer").classList.add("occult");
}

function removePokemonCards() {
  document.querySelectorAll(".pokemon-card-container").forEach((card) => {
    card.remove();
  });
}

document.querySelector(".next").addEventListener("click", () => {
  removePokemonCards();
  offset += 20;
  showPokemonList();
});

document.querySelector(".prev").addEventListener("click", () => {
  if (offset != 0) {
    removePokemonCards();
    offset -= 20;
    showPokemonList();
  }
});

showPokemonList();
