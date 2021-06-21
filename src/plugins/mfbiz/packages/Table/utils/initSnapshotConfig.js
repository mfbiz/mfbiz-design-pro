

export default {

  replaceRouteHash: function(id) {

    const shareId = id || Date.now()

    location.hash = location.hash.replace(this.$route.params.shareId, shareId)

    this.$route.params.shareId = shareId
  },

  replaceRouteHashParams: function(key, value) {

    const keysMap=  Object.keys(this.$route.query).filter(itemKey => itemKey !== key)

    let str = '?'

    keysMap.forEach(itemKey => {
      str += `${ itemKey }=${ this.$route.query[ itemKey ] }&`
    })

    str += `${ key }=${ typeof value === 'object' ? encodeURIComponent(JSON.stringify(value)) : value}`

    location.hash = this.$route.path + str

    this.$route.query[ key ] = value

  }

  





  

}
// function query() {

//   http.queryOperationConfig(d => {
//     console.log(to.query.shareId)
//   })

// }


// export default function(queue = []) {
  

//   queue[ 0 ](Date.now())



// }



