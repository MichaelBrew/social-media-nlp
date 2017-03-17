const fb = require('./fb.js')

/* ******************** */
/* Load FB SDK and init */
/* ******************** */
fb.loadSdkAsync(document, 'script', 'facebook-jssdk')

function httpReq(url, verb = 'GET', data) {
  return new Promise((resolve, reject) => {
    const xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        resolve(xmlHttp.responseText);
      } else if (xmlHttp.status !== 200) {
        reject()
      }
    }

    xmlHttp.open(verb, url, true); // true for asynchronous
    xmlHttp.send(data);
  })
}

async function loginClickHandler() {
  await fb.login({scope: 'user_posts'})

  const posts = await fb.getWallPosts()
  const reqUrl = `${window.location.hostname}/posts/analyze`
  const analyzedPosts = await httpReq(reqUrl, 'POST', {posts})

  console.log(`loginClickHandler: analyzedPosts = `, analyzedPosts)
}
