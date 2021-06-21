export default {
  
  copyPageUrl: function() {

    this.$notify({
      title: '稍等片刻',
      message: '链接生成中，请耐心等候...',
      type: 'warning'
    })

    let oInput = document.querySelector('#globalHiddenInputNode')

    if ( !oInput ) {

      oInput = document.createElement('input')
    
      oInput.setAttribute('type', 'text')
      oInput.setAttribute('id', 'globalHiddenInputNode')
      oInput.setAttribute('value', window.location.href)
      oInput.style.cssText = 'position: absolute;left: 0; top: 0; z-index: -1;'
  
      document.body.appendChild(oInput)
    }


    oInput.onfocus= ev => {
      ev.stopPropagation()
      ev.preventDefault()
      oInput.select()
      document.execCommand('copy')
    }

    setTimeout(() => {
      oInput.focus()
      oInput.onfocus = null
      this.$notify({
        title: '复制成功',
        message: '链接生成完毕！',
        type: 'success'
      })
      oInput.remove()
    }, 1500);

  }
}