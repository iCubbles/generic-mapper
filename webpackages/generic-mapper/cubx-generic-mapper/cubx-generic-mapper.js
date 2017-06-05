(function () {
  'use strict';
  /**
   * Get help:
   * > Lifecycle callbacks:
   * https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html#lifecycle-callbacks
   *
   * Access the Cubbles-Component-Model:
   * > Access slot values:
   * slot 'a': this.getA(); | this.setA(value)
   */
  CubxPolymer({
    is: 'cubx-generic-mapper',

    /**
     * Manipulate an element’s local DOM when the element is created.
     */
    created: function () {
    },

    /**
     * Manipulate an element’s local DOM when the element is created and initialized.
     */
    ready: function () {
    },

    /**
     * Manipulate an element’s local DOM when the element is attached to the document.
     */
    attached: function () {
    },

    /**
     * Manipulate an element’s local DOM when the cubbles framework is initialized and ready to work.
     */
    cubxReady: function () {
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'valueString' has changed ...
     */
    modelValueStringChanged: function (newValue) {
      this._handleValueChanged('valueString', newValue);
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'valueNumber' has changed ...
     */
    modelValueNumberChanged: function (newValue) {
      this._handleValueChanged('valueNumber', newValue);
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'valueBoolean' has changed ...
     */
    modelValueBooleanChanged: function (newValue) {
      this._handleValueChanged('valueBoolean', newValue);
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'valueObject' has changed ...
     */
    modelValueObjectChanged: function (newValue) {
      this._handleValueChanged('valueObject', newValue);
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'valueArray' has changed ...
     */
    modelValueArrayChanged: function (newValue) {
      this._handleValueChanged('valueArray', newValue);
    },

    /**
     * Handles the change of value slots, by calling the mapperFucntion and propagating mapped value
     * @param {string} slotName - Name of the slot that has changed
     * @param value - Value of the slot to be mapped
     * @private
     */
    _handleValueChanged: function (slotName, value) {
      this.model[slotName] = this._callMapperFunction(value);
      window.setTimeout(this.repropagateValueNumber.bind(this), 300);
    },

    /**
     * Call the 'mapperFunction' to return the mapped passed value
     * @param value - Value to be passed to the 'mapperFunction'
     * @returns {*} - Call to 'mapperFunction'
     * @private
     */
    _callMapperFunction: function (value) {
      var funcString = this.getMapperFunction();
      if (funcString) {
        try {
          if (typeof funcString === 'string') {
            if (funcString.trim().substr(0, 8) === 'function') {
              var startBody = funcString.indexOf('{') + 1;
              var endBody = funcString.lastIndexOf('}');
              var startArgs = funcString.indexOf('(') + 1;
              var endArgs = funcString.indexOf(')');
              /* eslint-disable no-new-func */
              var func = new Function(funcString.substring(startArgs, endArgs), funcString.substring(
                startBody, endBody));
              /* eslint-enable no-new-func */
              return func(value);
            } else {
              // funcString(value, next);
              var fn = this._getFunctionFromString(funcString);
              if (typeof fn === 'function') {
                return fn(value);
              } else {
                console.error(
                  'The defined \'mapperFunction\'' +
                  ' \'window.' + funcString + '\' is not a global function.');
              }
            }
          } else {
            console.error(
              'No correct type for \'mapperFunction\': The \'mapperFunction\' has the current type ' +
              typeof funcString + ', but it must defined as a string');
          }
        } catch (err) {
          console.error('The \'mapperFunction\' can not be called. The following error occurred: ', err);
        }
      } else {
        console.warn('The \'mapperFunction\' value is not defined. Thus, the original value won\'t ' +
          'be altered.');
        return value;
      }
    },

    /**
     * Returns a function based on a string
     * @param {string} str - String containing function definition
     * @returns {*} - Function based on string
     * @private
     */
    _getFunctionFromString: function (str) {
      var scope = window;
      var scopeSplit = str.split('.');
      for (var i = 0; i < scopeSplit.length - 1; i++) {
        scope = scope[ scopeSplit[ i ] ];
        if (scope === undefined) {
          return;
        }
      }
      return scope[ scopeSplit[ scopeSplit.length - 1 ] ];
    }
  });
}());
