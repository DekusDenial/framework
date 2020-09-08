import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';

module('Integration | Component | Navi Visualization - apex-line', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');

    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<NaviVisualizations::ApexLine />`);

    assert.equal(this.element.textContent.trim(), 'ApexLine');
  });
});
