# Module API

## module.json

    {
      "providesStatus": boolean,
      "providesFeed": boolean,
      "status": {
        "position": "left"|"right"
      },
      "voiceCommands": [
        "REGEX FOR COMMAND MATCHING"
      ]
    }

## available libs

1. jQuery (`require('jquery')`)
2. doT.js (`require(doT)`)
3. jsDom (`require('jsdom')`)
4. responsivevoice (`responsiveVoice`)
