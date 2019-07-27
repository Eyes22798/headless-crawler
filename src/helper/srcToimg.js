const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)

module.exports = async (src, dir) => {
    if (/\.(jpg|png|gif)$/.test(src)) {
        await urlToImg(src, dir)
    } else {
        await base64ToTmg(src, dir)
    }
}

// url 
const urlToImg = promisify ((url, dir, callback) => {
    // 正则表达式判断是否 http 还是 https 请求
    const mod = /^https:/.test(url) ? https: http
    // 拿到扩展名
    const ext = path.extname(url)
    // 拼接文件名，文件路径
    const file = path.join(dir, `${Date.now()}${ext}`)
    // 发送一个 get 请求 拿到路径
    mod.get(url, res => {
        res.pipe(fs.createWriteStream(file))
            .on('finish', () => {
                callback()
                console.log(file)
            })
    })
})

// base64
const base64ToTmg = async function (base64Str, dir) {
    // data:image/jpeg;base64,/sdasds
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/)
    try {
        const ext = matches[1].split('/')[1].replace('jpeg', 'jpg')
        const file = path.join(dir, `${Date.now()}.${ext}`)
        await writeFile(file, matches[2], 'base64')
        console.log(file)
    } catch (ex) {
        console.log('错误')
    }
}