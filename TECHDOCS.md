Resources:
<br />
Graphic Designs:  [Figmas](https://www.figma.com/file/2aoBydAjSoFmdyFYv3Kj7t/note-app?type=design&node-id=82-66&mode=design)
<br />
Database: [Holium Bedrock](https://docs.holium.com/main/for-developers/bedrock)

<br />
<br />
Plug-ins Used:
<br />
<br />
Markdown Editor Plugin
<br />
- Lexical Editor: https://lexical.dev/
<br />
- Lexical Github: https://github.com/facebook/lexical
<br />
The plugin was implemented with the sample code found here: https://codesandbox.io/p/sandbox/lexical-rich-text-example-5tncvy
<br />
<br />
IMPORTANT LEXICAL INFORMATION:
<br />
The saving and loading of the infomation is supposed to work with the database. Basically, to save, Lexical creates a JSON string of the current
<br />
state of the editor. This string must be saved. To load simply call the load function. Sample code can be found here: https://lexical.dev/docs/concepts/editor-state
<br />
<br />
Tree-View Plugin: Used for organizing the frontend and displaying folders/notes from the database:
<br />
Arborist: https://github.com/brimdata/react-arborist
<br />
<br />

Notes:
<br />
The API / Database was tested using Postman and this JSON. Simply import into the collection in Postman and try them out.
<br />
[Bedrock.postman_collection (2).json](https://github.com/Native-Planet/onyx/files/13814489/Bedrock.postman_collection.2.json)
<br />
<br />
Below is the necessary environmental variables needed in Postman for the JSON to work
<br />
![image](https://github.com/Native-Planet/onyx/assets/73608860/850b286c-001f-4ea3-978b-5cbbca83a809)

