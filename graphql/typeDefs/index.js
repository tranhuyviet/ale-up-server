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
        cursor: String!
        hasMore: Boolean!
        products: [Product]!
    }

    type Query {
        "Get all products"
        products(name: String, market: String, offset: Int, limit: Int): [Product!]
        "Get all markets"
        markets: [Market]!
    }
`;
