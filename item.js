
function submitReview() {
    const urlParams = new URLSearchParams(window.location.search);
    const item_id = urlParams.get('item_id');
    // get rating score 
    let score;
    document.querySelectorAll('input[type="radio"]').forEach(i => { if (i.checked) { score = i.value } })
    let data = new FormData();
    data.append('rating', score);
    data.append('text', document.getElementById('review-text').value);
    data.append('item_id', item_id);
    for (const value of data.values()) {
        console.log(value);
    }
    fetch(`http://localhost:8000/api/v1/reviews/create`, {
        method: 'post',
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('user_token')
        }),
        body: data
    })
        .then(response => response.json())
        .then(response => {
            if (response.status == 'success') {
                displayMessage('Submit Successful', 0)
                populateItem()
            } else {
                displayMessage('Error Occured', 1)
            }
        }).catch(error => {
            displayMessage('Submit Failed', 1)
            console.log(error);
        })
}

// get item data and populate DOM
function populateItem() {
    // get url params of item
    const urlParams = new URLSearchParams(window.location.search);
    const item_id = urlParams.get('item_id');

    fetch(`http://localhost:8000/api/v1/items/${item_id}`, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('user_token')
        }),
    }).then(response => response.json())
        .then(response => {
            if (response.status == 'success') {
                let item = response.item[0];
                console.log(item);
                let item_wrapper = document.getElementsByClassName('item-wrapper')[0];
                let reviews_wrapper = document.getElementsByClassName('reviews')[0];
                let reviews = '';
                let item_content = `
                    <div class="item-details">
                    <img src=${item.image_uri} alt=${item.title}>
                    <div class="details">
                        <h3 class="price">$${item.price}</h3>
                        <h3>${item.title}</h3>
                        <h4>${item.details}</h4>
                        <h3> ${item.likes_count} <i class="fa fa-heart"></i> Likes</h3>
                    </div>
                    </div>`;
                item.reviews.forEach((i) => {
                    let review = `
                        <div class="review">
                        <div class="user-and-rating">
                        <div class="user">User-ID:${i.user_id}</div >
                        <div class="rating">${generateRating(i.rating)}</div>
                        </div >
                        <div class="review-text">${i.text}</div>
                        </div >
                        `;
                    reviews += review;
                    item_wrapper.innerHTML = item_content;
                    reviews_wrapper.innerHTML = reviews;
                })
            } else {
                displayMessage('error', 1)
            }
        }).catch(error => {
            displayMessage('error', 1)
            console.log(error);
        })
}
window.onload = populateItem;