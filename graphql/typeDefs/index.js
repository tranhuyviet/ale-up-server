import { gql } from 'apollo-server-express';

export default gql`
    type Product {
        id: ID!
        market: Market
        name: String!
        newPrice: Float
        oldPrice: Float
        discount: Float
        imageUrl: String
        link: String
    }

    type Market {
        id: ID!
        name: String!
        logo: String
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
        products(name: String, market: String, discount: [Int!], price: [Int!], offset: Int, limit: Int, sort: String): ReturnProducts!

        "Get products popular to introduce in hompage"
        productIntroduce: [Product]!

        "Get product min price and max price"
        productPrice: ProductPrice!

        "Get all markets"
        markets: [Market]!
    }
`;
