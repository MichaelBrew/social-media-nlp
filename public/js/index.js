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

function insertPostsTable(posts) {
  const table = document.createElement('table')
  const headerRow = document.createElement('th')
  const messageTitleCell = document.createElement('td')
    .appendChild(document.createTextNode('Post'))
  const analysisTitleCell = document.createElement('td')
    .appendChild(document.createTextNode('Sentiment Score'))

  headerRow.appendChild(messageTitleCell)
  headerRow.appendChild(analysisTitleCell)
  table.appendChild(headerRow)

  for (const post of posts) {
    const row = document.createElement('tr')

    let analysisScore = ':|'
    if (post.sentiment.score < 0) {
      analysisScore = ':('
    } else if (post.sentiment.score > 0) {
      analysisScore = ':)'
    }

    const messageNode = document.createTextNode(post.message)
    const analysisNode = document.createTextNode(analysisScore)

    const postCell = document.createElement('td').appendChild(messageNode)
    const analysisCell = document.createElement('td').appendChild(analysisNode)

    row.appendChild(postCell)
    row.appendChild(analysisCell)

    table.appendChild(row)
  }

  document.body.appendChild(table)
}

async function loginClickHandler() {
  await login({scope: 'user_posts'})

  const posts = await getWallPosts()
  const analyzedPosts = await new Promise(resolve =>
    $.ajax({
      type: 'POST',
      url: '/posts/analyze',
      data: {
        posts: JSON.stringify(posts.filter(({message}) => message != null))
      },
      dataType: 'json',
      success: resolve
    })
  )

  insertPostsTable(analyzedPosts)
}
