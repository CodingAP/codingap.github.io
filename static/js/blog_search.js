const searchInput = document.querySelector('#post-name-search');
const searchCheckSpan = document.querySelector('#search-check');
let lastSearch = '';

const searchForPosts = (search) => {
    if (search == lastSearch) return;
    lastSearch = search;

    let found = 0;
    let allPosts = document.querySelectorAll('.post-row');
    for (let i = 0; i < allPosts.length; i++) {
        if (
            allPosts[i]
                .querySelector('div > h2 > a')
                .innerHTML.trim()
                .toLowerCase()
                .includes(search)
        ) {
            allPosts[i].style.display = 'block';
            found++;
        } else {
            allPosts[i].style.display = 'none';
        }
    }

    searchCheckSpan.innerHTML =
        found == 0 ? "Sorry, couldn't find any posts :(" : '';
};

window.addEventListener('load', () => {
    searchInput.addEventListener('keyup', () => {
        searchForPosts(searchInput.value);
    });
});
