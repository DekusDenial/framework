import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const TEMPLATE = hbs`
  <NaviListSelector
    @title="Items"
    @items={{this.items}}
    @searchField="field"
    @selected={{this.selected}}
    as | items areItemsFiltered |
  >
    {{#each items as | item |}}
      <li class="test-item {{if areItemsFiltered "test-item__filtered"}}">
        {{item.field}}
      </li>
    {{/each}}
  </NaviListSelector>`;

module('Integration | Component | navi list selector', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.set('items', [
      {
        id: '1',
        field: 'foo',
      },
      {
        id: '2',
        field: 'bar',
      },
      {
        id: '3',
        field: 'baz',
      },
    ]);

    this.set('selected', [
      {
        id: '1',
        field: 'foo',
      },
    ]);
  });

  test('it renders', async function (assert) {
    assert.expect(4);

    await render(TEMPLATE);

    assert.dom('.navi-list-selector').isVisible('The navi-list-selector component is rendered');

    assert.dom('.navi-list-selector__title').hasText('Items', 'The navi-list-selector component renders a title');

    assert
      .dom('.navi-list-selector__search-input')
      .hasAttribute(
        'placeholder',
        'Search Items',
        'The navi-list-selector search bar has the title in the placeholder'
      );

    assert.dom('.navi-list-selector__search').isVisible('The navi-list-selector`s search bar is rendered');
  });

  test('search', async function (assert) {
    assert.expect(3);

    await render(TEMPLATE);

    await fillIn('.navi-list-selector__search-input', 'ba');

    assert.deepEqual(
      findAll('.test-item').map((el) => el.textContent.trim()),
      ['bar', 'baz'],
      'the items that match the search query are rendered as `list-item`s'
    );

    await fillIn('.navi-list-selector__search-input', 'not an item');

    assert
      .dom('.navi-list-selector__content--error')
      .hasText('No items found', 'No items found error message is displayed when no items match the search query');

    await fillIn('.navi-list-selector__search-input', 'foo');

    assert.deepEqual(
      findAll('.test-item__filtered').map((el) => el.textContent.trim()),
      ['foo'],
      'the boolean `areItemsFiltered` is true when item list is filtered by search query'
    );
  });
});
