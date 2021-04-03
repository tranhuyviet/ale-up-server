import { gql } from 'apollo-server-express';

export default gql`
    type Product {
        _id: ID!
        market: Market
        name: String!
        newPrice: Float
        oldPrice: Float
        discount: Float
        imageUrl: String
        link: String
    }

    type Market {
        _id: ID!
        name: String!
        logo: String
    }

    type Tag {
        _id: ID!
        tag: String!
    }

    type ReturnProducts {
        total: Int!
        hasMore: Boolean!
        products: [Product]!
    }

    type ProductPrice {
        min: Float!
        max: Float!
    }

    type Query {
        "Get all products"
        products(tag: String, name: String, market: String, discount: [Int!], price: [Int!], offset: Int, limit: Int, sort: String): ReturnProducts!

        "Get all tags"
        tags: [Tag]!

        "Get products popular to introduce in hompage"
        productIntroduce: [Product]!

        "Get product min price and max price"
        productPrice: ProductPrice!

        "Get all markets"
        markets: [Market]!

        "Get markets by tag"
        marketsByTag(tag: String): [Market!]

        "Get tags by market"
        tagsByMarket(market: String): [Tag!]
    }
`;
