// Simple function to fetch and display one Rick and Morty character's info
async function displaySingleCharacter() {
	try {
		const response = await fetch('https://rickandmortyapi.com/api/character/1'); // Character 1: Rick Sanchez
		if (!response.ok) throw new Error('Network response was not ok');
		const character = await response.json();

		const container = document.createElement('div');
		container.className = 'character-info';

		container.innerHTML = `
			<h2>Name: ${character.name}</h2>
			<p>Species: ${character.species}</p>
			<p>Gender: ${character.gender}</p>
			<p>Origin: ${character.origin.name}</p>
			<img src="${character.image}" alt="${character.name}" style="max-width:200px;">
			<p>Image URL: ${character.image}</p>
		`;

		document.body.appendChild(container);
	} catch (error) {
		console.error('Error fetching character:', error);
	}
}

// Call the function when the script loads
window.addEventListener('DOMContentLoaded', displaySingleCharacter);
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
