const fs          = require('fs')
const ENV_CONFIG  = require('../config/env.production.js') 
const ENV_KEY     = process.argv[ 2 ].replace(/[A-Z_a-z]{11}=(.+)/, "$1") 
const content     = ENV_CONFIG.env.default


if ( ENV_KEY !== 'default' ) {
  Object.keys(ENV_CONFIG.env[ ENV_KEY ]).forEach(key => {
    content[ key ] = ENV_CONFIG.env[ ENV_KEY ][ key ]
  })
}


let i    = 0,
    arr  = Object.keys(content),
    len  = 0,
    text = '';


    len = arr.length


for( i = 0; i < len; i++ ) {
  let   key = arr[ i ]
  text += `${ key }=${ content[ key ] }\n`
}

fs.writeFile(ENV_CONFIG.fileName, text, error => {
  if ( error ) console.log(`${ ENV_CONFIG.fileName }文件生成失败，请联系相关开发人员`)
  console.log('文件生成完毕，即将开始打包...')
})





