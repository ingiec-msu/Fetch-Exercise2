// Fetch and display a random Rick and Morty character's info
async function fetchAndDisplayCharacter(id) {
	try {
		const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
		if (!response.ok) throw new Error('Network response was not ok');
		const character = await response.json();

		const container = document.getElementById('character-container');
		container.innerHTML = `
			<h2>Name: ${character.name}</h2>
			<p>Species: ${character.species}</p>
			<p>Gender: ${character.gender}</p>
			<p>Origin: ${character.origin.name}</p>
			<img src="${character.image}" alt="${character.name}" style="max-width:200px;">
			<p>Image URL: ${character.image}</p>
		`;
	} catch (error) {
		console.error('Error fetching character:', error);
	}
}

async function fetchRandomCharacter() {
	try {
		const res = await fetch('https://rickandmortyapi.com/api/character');
		const data = await res.json();
		const count = data.info.count;
		const randomId = Math.floor(Math.random() * count) + 1;
		await fetchAndDisplayCharacter(randomId);
	} catch (error) {
		console.error('Error fetching random character:', error);
	}
}

function setupCharacterProfile() {
	// Create button and container
	const button = document.createElement('button');
	button.textContent = 'Get Random Character';
	button.style = 'margin-bottom:1em;padding:0.5em 1em;background:#22c55e;color:white;font-weight:bold;border:none;border-radius:8px;cursor:pointer;';
	button.addEventListener('click', fetchRandomCharacter);

	const container = document.createElement('div');
	container.id = 'character-container';
	container.className = 'character-info';

	document.body.appendChild(button);
	document.body.appendChild(container);

	// Display initial character
	fetchRandomCharacter();
}

window.addEventListener('DOMContentLoaded', setupCharacterProfile);
// Alpine.js component for Rick and Morty character
document.addEventListener('alpine:init', () => {
	Alpine.data('rickMortyCharacter', () => ({
		character: null,
		loading: false,
		error: '',
		async fetchCharacter(id) {
			this.loading = true;
			this.error = '';
			try {
				const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
				if (!response.ok) throw new Error('Network response was not ok');
				this.character = await response.json();
			} catch (e) {
				this.error = 'Error fetching character.';
				this.character = null;
			} finally {
				this.loading = false;
			}
		},
		async fetchRandomCharacter() {
			this.loading = true;
			this.error = '';
			try {
				// Get total count
				const res = await fetch('https://rickandmortyapi.com/api/character');
				const data = await res.json();
				const count = data.info.count;
				const randomId = Math.floor(Math.random() * count) + 1;
				await this.fetchCharacter(randomId);
			} catch (e) {
				this.error = 'Error fetching random character.';
				this.character = null;
			} finally {
				this.loading = false;
			}
		},
		init() {
			this.fetchRandomCharacter();
		}
	}));
});
