
export default {

  name: 'util-render',

  props:  [ 'render', 'row'  ],

  render(h) {
    return this.render(h, this.row)
  }
}