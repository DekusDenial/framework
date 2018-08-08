module.exports = {
  env: {
    embertest: true
  },
  globals: {
    $: true,
    selectChoose: true,
    selectSearch: true,
    clickDropdown: true,
    server: true,
    wait: true,
    reorder: true,
    drag: true
  },
  rules: {
    indent: [ 2, 2, {
      'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 }
    }],
    'multiline-comment-style': ['error', 'starred-block']
  }
};