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

function httpReq(url, verb = 'GET', data) {
  return new Promise((resolve, reject) => {
    const xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = () => {
      const success = xmlHttp.readyState === 4 &&
                    ((xmlHttp.status === 200) || (xmlHttp.status === 304))

      if (success) {
        resolve(xmlHttp.responseText)
      } else if (xmlHttp.status !== 200) {
        reject()
      }
    }

    xmlHttp.open(verb, url, true) // true for asynchronous
    xmlHttp.setRequestHeader('Content-Type', 'application/json')
    xmlHttp.send(JSON.stringify(data))
  })
}

function loginClickHandler() {
  login({scope: 'user_posts'})
    .then(() => getWallPosts())
    .then(posts => httpReq('/posts/analyze', 'POST', {posts}))
    .then(analyzed => console.log(analyzed))
    .catch(err => console.error(err))
}
