const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');

let limit = 5;
let page = 1;

const getPosts = async () => {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    );

    const data = await res.json();
    return data;
};

const showPosts = async () => {
    const posts = await getPosts();
    posts.forEach((post) => {
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        postEl.innerHTML = `
        <div class="number">${post.id}</div>
        <div class="post-info">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-body">${post.body}</p>
        </div>
        `;

        postsContainer.appendChild(postEl);
    });
    if (filter.value.length !== 0) {
        filterPosts(filter.value);
    }
};

// Show loader animation and fetch more posts
const showLoading = () => {
    loading.classList.add('show');

    setTimeout(() => {
        loading.classList.remove('show');

        setTimeout(() => {
            page++;
            showPosts();
        }, 300);
    }, 500);
};

const filterPosts = (toSearch) => {
    const term = toSearch.toUpperCase();
    const posts = document.querySelectorAll('.post');
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    posts.forEach((post) => {
        const title = post
            .querySelector('.post-title')
            .textContent.toUpperCase();
        const body = post.querySelector('.post-body').textContent.toUpperCase();

        console.log(term);

        if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        showLoading();
    }
};

const handleInput = (e) => {
    const term = e.target.value.toUpperCase();
    filterPosts(term);
};

// On load
showPosts();
showLoading();

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    console.log(scrollTop, scrollHeight, clientHeight);

    // If scroll is about to reach the bottom of the DOM scrollable window
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        showLoading();
    }
});

filter.addEventListener('input', handleInput);
