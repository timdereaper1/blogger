# CODE STRUCTURE

I structured the code to follow a layered pattern. In which each module has 3 other layers, which are common, node and web.

## COMMON LAYER

The common layer in a module should and must contain only native javascript or typescript functions or types that should be shared. **You must not ever import any library or module in the common folder**

## NODE LAYER

The node layer should contain only functions or variables that are native to node js or can only be used in the nodejs environment. You can import modules from the common section of any module in the node layer. You can also import libraries here as well. **Do not import any module from the node layer to the web layer**

## WEB LAYER

The web layer of a module is the same as the node layer with the exception that the web layer can only contain modules that can only run in the browser environment. Also, **Don't import this layer into other layers like node layer or common layer**
