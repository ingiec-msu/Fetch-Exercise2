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
