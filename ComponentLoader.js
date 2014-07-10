/**
 * Loads a component based on the component element
 * A component element is an html tag with a data-attribute
 * with the name 'data-component' and a value pointing to a
 * component script, eg 'component/MyComponent'
 *
 * In this way scripts that need to be loaded for a specific
 * part of the html are conditionally and asynchronously loaded
 * only when needed.
 *
 * All data attributes of the component element are captured in
 * an object and passed as the second parameter to the component
 * constructor.
 *
 * A client can subscribe to the 'componentFound' signal to get
 * notified of the loaded component.
 *
 * For example:
 *
 * var componentLoader = new ComponentLoader();
 * componentLoader.on.componentLoaded.add(componentnLoadedCallback);
 * componentLoader.load(element);
 *
 * In addition, the componentLoader will trigger a custom jQuery event
 * `componentLoaded`, that bubbles up the DOM. This allows components
 * to also discover non-child descendent components.
 */

define(function (require) {

  'use strict';

  var $          = require('jquery');

  function ComponentLoader() {

    var on = {
      componentLoaded : $.Callbacks()
    };

    function load (componentEl) {
      var $componentEl = $(componentEl);
      var componentName = $componentEl.data('component');
      var config = $componentEl.data();
      var componentDir = 'components/';
      require([componentDir + componentName], function (Component) {
        var component = new Component(componentEl, config);
        on.componentLoaded.fire(component, componentName);
        $componentEl.trigger('component.loaded', [component, componentName]);
      });
    }

    // Public API
    this.on = on;
    this.load = load;
  }

  return ComponentLoader;
});