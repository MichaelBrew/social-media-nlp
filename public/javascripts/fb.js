function loadSdkAsync(doc, tagName, elementId) {
  let js = doc.getElementsByTagName(tagName)[0];
  const fjs = doc.getElementsByTagName(tagName)[0];

  if (doc.getElementById(elementId)) {
    return;
  }

  js = doc.createElement(tagName);
  js.id = elementId;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})

function initAsync() {
  FB.init({
    appId: env === 'dev' ? '1248187438583574' : '1210709702331348',
    xfbml: true,
    version: 'v2.8'
  });

  FB.AppEvents.logPageView();
}

// Only works after `FB.init` is called
function login(opts = {}) {
  return new Promise((resolve, reject) => {
    FB.login(err => {
      return (err != null)
        ? reject(err)
        : resolve()
    }, opts)
  })
}

function getWallPosts() {
  return new Promise((resolve, reject) => {
    FB.api('/me/posts', (err, res) => {
      return (err != null)
        ? reject(err)
        : resolve(res.data)
    })
  })
}

module.exports = {
  initAsync,
  loadSdkAsync,
  login,
  getWallPosts
}
