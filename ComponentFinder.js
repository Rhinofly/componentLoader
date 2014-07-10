/**
 * Finds component elements in a given element.
 *
 * A component element is an html tag with a data-attribute
 * with the name 'data-component' and a value pointing to a
 * component script, eg 'component/MyComponent'
 *
 * When a component element is found, it will call the
 * componentLoader with this element and NOT look for
 * descendant component elements.
 *
 * If descendant component elements need to be found, than
 * this needs to be managed by the component script itself.
 *
 * A parent can subscribe to a 'componentFound' event to get
 * notified of found components.
 *
 * For example:
 * var componentFinder = new ComponentFinder();
 * componentFinder.on.componentFound.add(onComponentLoadedCallbackFunction);
 * componentFinder.find(currentElement);
 *
 * The ComponentFinder uses the ComponentLoader to load found components.
 * Clients can use the ComponentLoader facilities to detect non-child descendant
 * components that are loaded.
 */
define(function (require) {

  'use strict';

  var $               = require('jquery');
  var ComponentLoader = require('ComponentLoader');

  function ComponentFinder() {

    var $el;
    var componentSelector = '[data-component]';

    var on = {
      componentFound: $.Callbacks()
    };

    function find(el) {
      $el = $(el);
      loadEach(getChildComponents());
    }

    function getChildComponents() {
      var $descendants = $el.find(componentSelector);
      var $children = $descendants.filter(function() {
        return $(this).parentsUntil($el, '[data-component]').length === 0;
      });
      return $children;
    }

    function loadEach(elements) {
      elements.each(function (index, childComponent) {
        var componentLoader = new ComponentLoader();
        componentLoader.on.componentLoaded.add(on.componentFound.fire);
        componentLoader.load(childComponent);
      });
    }

    // Public API
    this.on = on;
    this.find = find;
  }

  return ComponentFinder;
});