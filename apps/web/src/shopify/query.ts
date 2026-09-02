const query = `query ExistingProductUpdateWebhook {
    webhookSubscriptions(first: 10, topics: [PRODUCTS_UPDATE]){
        nodes {
            id
            topic
            uri
            includeFields
        }
    }
}`

const normalizedQUery = "query ExistingProductUpdateWebhook { webhookSubscriptions(first: 10, topics: [PRODUCTS_UPDATE]) { nodes { id topic uri includeFields } } }";