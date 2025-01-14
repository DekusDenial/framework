/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 *   {{#navi-list-selector
 *      title=title
 *      items=items
 *      searchField=field
 *      as | items |
 *   }}
 *      {{yield items}}
 *   {{/navi-list-selector}}
 */

import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from '../templates/components/navi-list-selector';
import { searchRecords } from 'navi-core/utils/search';

export default Component.extend({
  layout,

  /*
   * @property {Array} classNames
   */
  classNames: ['navi-list-selector'],

  /*
   * @property {String} errorMessage
   */
  errorMessage: computed('query.length', 'showSelected', 'title', function () {
    if (get(this, 'query.length') > 0) {
      return `No ${get(this, 'title').toLowerCase()} found`;
    } else if (get(this, 'showSelected')) {
      return `No ${get(this, 'title').toLowerCase()} selected`;
    }
    return undefined;
  }),

  /**
   * @property {Boolean} areItemsFiltered - true if items are filtered by selected state or a search query
   */
  areItemsFiltered: computed('query', function () {
    return !!this.query;
  }),

  /*
   * @property {Array} filteredItems - items or items filtered by searchQuery
   */
  filteredItems: computed('items', 'query', 'searchField', function () {
    const { items, query } = this;

    //filter items by searchQuery
    if (query) {
      return searchRecords(items, query, this.searchField);
    }

    return items;
  }),
});
