{
    "infrastructure-id": "dummygpio",
    "adapter-id": "e354cb68-4d79-4d4b-a822-1839e5436b64",
    "name": "The example description of dummy gpio",
    "type": "core:Device",
    "properties": [
        {
            "pid": "onoff",
            "monitors": "adap:OnOff",
            "read_link": {
                "href": "/device/{oid}/property/{pid}",
                "output": {
                    "type": "object",
                    "field": [
                        {
                            "name": "property",
                            "schema": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "value",
                            "schema": {
                                "type": "bolean"
                            }
                        }
                    ]
                },
		"response": { "property": "onoff", "value": "true" }
            },
            "write_link": {
                "href": "/gpio/set-onoff/{oid}",
                "input": {
                    "type": "object",
                    "field": [
                        {
                            "name": "property",
                            "schema": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "value",
                            "schema": {
                                "type": "bolean"
                            }
                        }
                    ]
                },
                "output": {
                    "type": "object",
                    "field": [
                        {
                            "name": "success",
                            "schema": {
                                "type": "boolean"
                            }
                        }
                    ]
                }
            }
        }
    ]
}
