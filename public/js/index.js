// Only works after `FB.init` is called
function login(opts = {}) {
  return new Promise((resolve, reject) => {
    FB.login(res => {
      return res.authResponse
        ? resolve()
        : reject()
    }, opts)
  })
}

function getWallPosts() {
  return new Promise((resolve, reject) => {
    FB.api('/me/posts', res => {
      return (!res || res.error)
        ? reject(res.error)
        : resolve(res.data)
    })
  })
}

function loginClickHandler() {
  login({scope: 'user_posts'})
    .then(() => getWallPosts())
    .then(posts => new Promise(resolve =>
      $.ajax({
        type: 'POST',
        url: '/posts/analyze',
        data: {posts},
        dataType: 'json'
        success: resolve
      })
    ))
    .then(analyzed => console.log(analyzed))
    .catch(err => console.error(err))
}
