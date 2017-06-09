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
     *  Observe the Cubbles-Component-Model: If value for slot 'inputString' has changed ...
     */
    modelInputStringChanged: function (newValue) {
      this._handleValueChanged('inputString', newValue);
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'inputNumber' has changed ...
     */
    modelInputNumberChanged: function (newValue) {
      this._handleValueChanged('inputNumber', newValue);
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'inputBoolean' has changed ...
     */
    modelInputBooleanChanged: function (newValue) {
      this._handleValueChanged('inputBoolean', newValue);
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'inputObject' has changed ...
     */
    modelInputObjectChanged: function (newValue) {
      this._handleValueChanged('inputObject', newValue);
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'inputArray' has changed ...
     */
    modelInputArrayChanged: function (newValue) {
      this._handleValueChanged('inputArray', newValue);
    },

    /**
     * Handles the change of value slots, by calling the mapperFucntion and propagating mapped value
     * @param {string} slotName - Name of the slot that has changed
     * @param value - Value of the slot to be mapped
     * @private
     */
    _handleValueChanged: function (slotName, value) {
      this[this._determineSetOutputSlotMethodName(slotName)](this._callMapperFunction(value));
    },

    /**
     * Returns an output slot name based on input slot name
     * @param inputSlotName - NAme of the input slot
     * @returns {string}
     * @private
     */
    _determineSetOutputSlotMethodName: function (inputSlotName) {
      return inputSlotName.replace('input', 'setMapped');
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
