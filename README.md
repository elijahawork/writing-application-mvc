# writing-application-mvc
 
This is the writing application with features:
* Basic Text Editor
* Mind-Mapper
* Timeline
* Plot-Diagram
* Resource Organizing and Importing

# Instructions for setting up the repository for development
* Clone the repository
* Run `npm install` in a terminal in the folder of the repository. This should install all dependencies
* It is suggested than Electron is installed globally with `npm install electron -g`
* Then compile the program with `tsc`, or, for ease of development, `tsc -w`, which recompiles with every edit
* Then run the program with `npm start`

# "Style Guide" For Developers
* Use the MVC software design pattern
* Interfaces are kept in "interfaces"
* Run all testing code in the `test()` function in `index.ts` to avoid module loading problems.
* Try not to polute the global namespace
* Use generally accepted upon ECMA6 guidelines/advice:
  *  `class` rather than `function`;
  *  `const` and `let`, rather than `var`.
  *  `set variableName(value)` and `get variableName()` rather than `setVariableName(name)` and `getVariableName(name)`
  *  Try and keep code cleaning, using meaningful variable names so that the code reads like instructions, e.g.
    ```
        function resetArray() {
            saveAllArrayElementsToTempField();
            removeAllArrayElements();
            moveTempFieldArrayElementsToArrayElementsField();
        }
    ```
  * Type annotations are suggested when using generics
  * Try and reduce side effects
# "Electron Security Warning (Insecure Content-Security-Policy)"
The warning `Electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security` that shows up in the developers console of the electron application during development is simply due to the 
fact that the app does not restrict XSS and Node.js filesystem because the application relies on the the Node.JS `fs` module. For more information visit the link below:

[Electron Security Information](https://www.electronjs.org/docs/tutorial/security)