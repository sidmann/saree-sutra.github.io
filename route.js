

const basePath = '/src/'
const path = new Map([
    ['/signup', 'slmodule/signup.html'],
    ['/home', 'home.html']
])

function go(routeTo) {
    console.log(path.get(routeTo))
    // subStr = window.location.pathname.split('/')
    // console.log(subStr)
    // subStr[subStr.length-1] = path.get(routeTo)
    window.location.href(basePath + path.get(routeTo))
}