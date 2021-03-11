import { click, fillIn, find, findAll, triggerEvent } from '@ember/test-helpers';
import { assert } from '@ember/debug';
import { set } from '@ember/object';
//@ts-ignore
import findByContains from 'navi-core/test-support/contains-helpers';
import { getVerticalCollection, renderAllItems } from './vertical-collection';
import type { ColumnType } from 'navi-data/models/metadata/column';

const groupedList = '.grouped-list';
const groupedListItemFilter = `${groupedList}__filter`; // dimension/metric row filter button
const groupedListItem = `${groupedList}__item`; // dimension/metric row
const groupedListItemSelected = `${groupedListItem}-container--selected`; // selected dimension/metric row (feature flagged)
const groupedListItemLabel = `${groupedListItem}-label`; // add button
const naviListSelector = '.navi-list-selector';
const searchBar = `${naviListSelector}__search-input`;

const selector: Record<ColumnType, string> = {
  timeDimension: '.checkbox-selector--dimension',
  dimension: '.checkbox-selector--dimension',
  metric: '.checkbox-selector--metric',
};

/**
 * Checks if a given type is valid for the report builder grouped lists
 * @param type - A selector type for grouped lists
 * @returns true if the selector is valid
 */
function isAcceptedType(type: ColumnType): boolean {
  return Object.keys(selector).includes(type);
}

/**
 * Gets the query selector containing the grouped list
 * @param type - a valid selector for grouped lists
 * @returns query selector for type
 */
function getSelector(type: ColumnType) {
  assert('getSelector must be passed an accepted type', isAcceptedType(type));
  return selector[type];
}

/**
 * Searches for the given query in the grouped list
 * @param type - a valid selector for grouped lists
 * @param query - The query to type in the search bar
 * @returns resets search to it's previous state
 */
export async function searchFor(type: ColumnType, query: string) {
  assert('searchFor must be passed an accepted type', isAcceptedType(type));
  const typeSelector = getSelector(type);

  const searchBarInputSelector = `${typeSelector} ${searchBar}`;
  const searchBarInput = find(searchBarInputSelector) as HTMLInputElement;
  const previousSearch = searchBarInput.textContent || '';
  await fillIn(searchBarInput, query);
  await triggerEvent(searchBarInput, 'focusout');

  return async () => {
    await fillIn(searchBarInputSelector, previousSearch);
    await triggerEvent(searchBarInput, 'focusout');
  };
}

/**
 * Searches for the given item, then retrieves it from grouped list
 * @param type - a valid selector for grouped lists
 * @param query - The query to type in the search bar
 * @param itemText - The text content of the element to return
 * @returns the element and a function to reset the search bar
 */
export async function getItem(type: ColumnType, query: string, itemText?: string) {
  assert('getItem must be passed an accepted type', isAcceptedType(type));
  const reset = await searchFor(type, query);
  itemText = itemText || query;
  const item = findByContains(groupedListItem, itemText);
  return { item, reset };
}

/**
 * Searches for the given item, retrieves it, clicks it, then resets the state
 * @param type - a valid selector for grouped lists
 * @param query - The query to type in the search bar
 * @param itemText - The text content of the element to click
 */
export async function clickItem(type: ColumnType, query: string, itemText?: string) {
  assert('clickItem must be passed an accepted type', isAcceptedType(type));
  const { item, reset } = await getItem(type, query, itemText);
  await click(item.querySelector(groupedListItemLabel));
  await reset();
}

/**
 * Searches for the given item, retrieves it, clicks its filter button, then resets the state
 * @param type - a valid selector for grouped lists
 * @param query - The query to type in the search bar
 * @param itemText - The text content of the element to click the filter of
 */
export async function clickItemFilter(type: ColumnType, query: string, itemText?: string) {
  assert('clickItemFilter must be passed an accepted type', isAcceptedType(type));
  const { item, reset } = await getItem(type, query, itemText);
  await click(item.querySelector(groupedListItemFilter));
  await reset();
}

/**
 * Forces the given grouped list to open all of its groups and render all of its contents
 * @param type - a valid selector for grouped lists
 * @returns resets to original open groups and rendering
 */
async function _renderAndOpenAllFiltered(type: ColumnType) {
  const verticalCollection = getVerticalCollection(getSelector(type));

  const { parentView: groupedList } = verticalCollection;
  const { groupConfigs, groupedItems } = groupedList;
  const _groupConfigs = Object.assign({}, groupConfigs);

  const allOpenGroups = Object.keys(groupedItems).reduce((config: Record<string, { isOpen: boolean }>, group) => {
    config[group] = { isOpen: true };
    return config;
  }, {});

  set(groupedList, 'groupConfigs', allOpenGroups);
  const resetRenderAllItems = await renderAllItems(verticalCollection);

  return async () => {
    if (!groupedList.isDestroyed || !groupedList.isDestroying) {
      set(groupedList, 'groupConfigs', _groupConfigs);
    }
    await resetRenderAllItems();
  };
}

/**
 * Searches for the given query (defaults to none), opens all groups, and renders all items.
 * This is useful to force everything to be in the dom, then revert when done
 * @param type - a valid selector for grouped lists
 * @param query - The query to type in the search bar
 * @returns resets to previous search/open groups/render state
 */
export async function renderAll(type: ColumnType, query = '') {
  const resetSearch = await searchFor(type, query);
  const resetRenderAll = await _renderAndOpenAllFiltered(type);

  return async () => {
    await resetRenderAll();
    await resetSearch();
  };
}

/**
 * Renders all items that match the given query, then returns the names of all selected items
 * @param type - a valid selector for grouped lists
 * @param query - The query to type in the search bar
 * @returns the names of all the selected items
 */
export async function getAllSelected(type: ColumnType, query: string) {
  assert('getAllSelected must be passed an accepted type', isAcceptedType(type));
  const resetRenderAll = await renderAll(type, query);

  const selected = findAll(`${getSelector(type)} ${groupedListItem}`)
    .filter(
      (el) =>
        el.querySelector('.fa-minus-circle') ||
        el.querySelector(groupedListItemSelected) ||
        el.querySelector('input:checked')
    )
    .map((el) => el.textContent?.trim());

  await resetRenderAll();
  return selected;
}

/**
 * Renders all items that match the given query, then returns the names of all items
 * @param type - a valid selector for grouped lists
 * @param query - The query to type in the search bar
 * @returns the names of all the selected items
 */
export async function getAll(type: ColumnType, query: string) {
  assert('getAll must be passed an accepted type', isAcceptedType(type));
  const resetRenderAll = await renderAll(type, query);

  const all = findAll(`${getSelector(type)} ${groupedListItem}`).map((el) => el.textContent?.trim());

  await resetRenderAll();
  return all;
}
