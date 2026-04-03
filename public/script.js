document.addEventListener('DOMContentLoaded', () => {
    loadRandomJoke();
    loadCategories();

    document.getElementById('search-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = document.getElementById('search-input').value.trim();
        if(category) getJokes(category); 
    });

    document.getElementById('add-joke-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = document.getElementById('add-category').value.trim();
        const setup = document.getElementById('add-setup').value.trim();
        const delivery = document.getElementById('add-delivery').value.trim();

        try {
            const res = await fetch('/jokebook/joke/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, setup, delivery })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error);
            
            document.getElementById('add-joke-form').reset();
            loadCategories(); 
            displayJokes(data, category); 
        } catch (err) {
            alert(err.message);
        }
    });
});

async function loadRandomJoke() {
    try {
        const res = await fetch('/jokebook/random'); 
        const joke = await res.json();
        document.getElementById('random-setup').textContent = joke.setup;
        document.getElementById('random-delivery').textContent = joke.delivery;
    } catch (err) {
        console.error("Failed to fetch random joke");
    }
}

async function loadCategories() {
    try {
        const res = await fetch('/jokebook/categories'); 
        const categories = await res.json();
        const list = document.getElementById('category-list');
        list.innerHTML = '';
        
        categories.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action cursor-pointer';
            li.textContent = cat;
            li.onclick = () => getJokes(cat); 
            list.appendChild(li);
        });
    } catch (err) {
        console.error("Failed to load categories");
    }
}

async function getJokes(category) {
    try {
        const res = await fetch(`/jokebook/category/${category}`);
        const data = await res.json();

        if (!res.ok) {
            // Extra Credit.
            console.log("Category not found in DB. Searching external API...");
            await fetchExternalJokes(category);
            return;
        }
        displayJokes(data, category);
    } catch (err) {
        console.error(err);
    }
}

async function fetchExternalJokes(category) {
    try {
        const externalUrl = `https://v2.jokeapi.dev/joke/${category}?type=twopart&amount=3&safe-mode`;
        const res = await fetch(externalUrl);
        const data = await res.json();

        if (data.error) {
            alert(`Category '${category}' not found in internal DB or external API.`);
            return;
        }

        const newJokes = data.jokes ? data.jokes : [data];
        
        for (const joke of newJokes) {
            await fetch('/jokebook/joke/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: category,
                    setup: joke.setup,
                    delivery: joke.delivery
                })
            });
        }
        
        // Refresh UI
        loadCategories();
        getJokes(category);

    } catch (err) {
        console.error("Failed to fetch from external API");
    }
}

function displayJokes(jokes, category) {
    document.getElementById('display-category-title').textContent = `Jokes in '${category}'`;
    const container = document.getElementById('jokes-container');
    container.innerHTML = '';

    jokes.forEach(joke => {
        const col = document.createElement('div');
        col.className = 'col-12';
        col.innerHTML = `
            <div class="p-3 border rounded bg-white">
                <strong>Q:</strong> ${joke.setup}<br>
                <strong>A:</strong> <em>${joke.delivery}</em>
            </div>
        `;
        container.appendChild(col);
    });
}