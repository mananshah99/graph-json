graph-json
==========
[![NPM](https://nodei.co/npm/graph-json.png)](https://nodei.co/npm/graph-json/)

A JSON-format backed graph with basic identification algorithms. 

JSON Scheme: 
```
{
    "type": "object",
    "properties": {
        "nodes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "required": true
                    }
                }
            }
        },
        "edges": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "required": true
                    },
                    "from": {
                        "type": "string",
                        "required": true
                    },
                    "to": {
                        "type": "string",
                        "required": true
                    }
                }
            }
        }
    }
}
```

View the source for more information. 