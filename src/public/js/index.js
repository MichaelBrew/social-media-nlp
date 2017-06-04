function login(opts = {}) {
  return new Promise((resolve, reject) => {
    FB.login(res => {
      return res.authResponse
        ? resolve()
        : reject();
    }, opts);
  });
}

function getWallPosts() {
  return new Promise((resolve, reject) => {
    FB.api('/me/posts', res => {
      return (!res || res.error)
        ? reject(res.error)
        : resolve(res.data);
    });
  });
}

function insertPostsTable(posts) {
  const table = document.getElementById('analyzed-posts-table');
  table.style.display = 'inherit';

  for (const post of posts) {
    const row = document.createElement('tr');

    let analysisScore = 'Meh';
    if (post.sentiment.score < 0) {
      analysisScore = 'Nice!';
    } else if (post.sentiment.score > 0) {
      analysisScore = 'Boooo';
    }

    const analysisCell = document.createElement('td');
    analysisCell.appendChild(document.createTextNode(analysisScore));
    row.appendChild(analysisCell);

    const postCell = document.createElement('td');
    postCell.appendChild(document.createTextNode(`(${post.createdAt}) ${post.message}`));
    row.appendChild(postCell);

    table.appendChild(row);
  }

  document.body.appendChild(table);
}

async function loginClickHandler() {
  await login({scope: 'user_posts'});

  const posts = await getWallPosts();
  const analyzedPosts = await new Promise(resolve => {
    $.ajax({
      type: 'POST',
      url: '/posts/analyze',
      dataType: 'json',
      data: {
        posts: JSON.stringify(posts.filter(({message}) => message != null))
      },
      success: resolve
    });
  });

  insertPostsTable(analyzedPosts);
}
