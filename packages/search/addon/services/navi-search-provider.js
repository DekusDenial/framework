/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * This service is used to discover all the available search providers.
 */

import Service from '@ember/service';
import { getOwner } from '@ember/application';
import config from 'ember-get-config';

/* global requirejs */

export default class NaviSearchProviderService extends Service {
  /**
   * @method getProvider
   * @param name
   * @returns {Object} search provider service object
   */
  getProvider(name) {
    return getOwner(this).lookup(`service:navi-search/${name}`);
  }

  /**
   * @method all
   * @returns {Array} array of available search providers
   */
  all() {
    const searchProvidersRegex = new RegExp(`^(?:${config.modulePrefix}/)?services/navi-search/([a-z-]*)$`),
      searchProviderServices = Object.keys(requirejs.entries).filter(
        requirejsFileName =>
          searchProvidersRegex.test(requirejsFileName) && !requirejsFileName.includes('navi-base-search-provider')
      );
    return searchProviderServices.map(providerFileName =>
      this.getProvider(searchProvidersRegex.exec(providerFileName)[1])
    );
  }
}