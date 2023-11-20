const revealArticle = id => {
    document.querySelectorAll('.post').forEach(element => {
        element.className = 'post';
    });

    document.querySelectorAll('.blog-nav-link').forEach(element => {
        element.className = 'nav-link glowing-link blog-nav-link';
    });

    document.querySelector(`#post-${id}`).className = 'post active-post';
    document.querySelector(`#post-link-${id}`).className = 'nav-link glowing-link blog-nav-link active';
}