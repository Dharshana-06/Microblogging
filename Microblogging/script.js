document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const postInput = document.getElementById('postInput');
    const imageInput = document.getElementById('imageInput');
    const postContent = postInput.value;
    const imageFile = imageInput.files[0];

    if (postContent.trim() !== '' || imageFile) {
        const newPostRef = firebase.database().ref('posts').push();
        const postId = newPostRef.key;

        if (imageFile) {
            const storageRef = firebase.storage().ref('images/' + postId);
            storageRef.put(imageFile).then(function(snapshot) {
                snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    newPostRef.set({
                        content: postContent,
                        imageUrl: downloadURL,
                        timestamp: new Date().toISOString()
                    });
                });
            });
        } else {
            newPostRef.set({
                content: postContent,
                timestamp: new Date().toISOString()
            });
        }

        postInput.value = '';
        imageInput.value = '';
    }
});

firebase.database().ref('posts').on('child_added', function(snapshot) {
    const post = snapshot.val();
    const postsContainer = document.getElementById('postsContainer');
    const postElement = document.createElement('div');
    postElement.className = 'post';

    if (post.imageUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = post.imageUrl;
        imgElement.alt = 'Post Image';
        imgElement.style.maxWidth = '100%';
        postElement.appendChild(imgElement);
    }

    if (post.content) {
        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;
        postElement.appendChild(contentElement);
    }

    postsContainer.appendChild(postElement);
});
