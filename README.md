# graph-json [![Build Status](https://travis-ci.org/mananshah99/graph-json.svg?branch=master)](https://travis-ci.org/mananshah99/graph-json) [![NPM version](https://badge.fury.io/js/graph-json.svg)](http://badge.fury.io/js/graph-json)

[![NPM](https://nodei.co/npm/graph-json.png?downloads=true)](https://nodei.co/npm/graph-json/)

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
