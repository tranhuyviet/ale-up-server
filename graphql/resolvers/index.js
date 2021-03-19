import Product from '../../models/productModel.js';
import Market from '../../models/marketModel.js';

function queryName(name) {
    const splitName = name.split(' ');
    let rtName = [];
    for (const name of splitName) {
        rtName.push({ name: { $regex: `.*${name}.*`, $options: 'i' } });
    }

    return {
        $and: rtName,
    };
}

export default {
    // Product: {
    //     market: async (parent) => await Market.findById(parent.market),
    // },
    Query: {
        // Get all products
        products: async (_, { name, market, offset = 0, limit = 20 }) => {
            try {
                let query = {};
                if (name) {
                    query = queryName(name);
                }

                if (market && market !== 'all') {
                    query = { ...query, market };
                }

                // console.log(query, offset, limit);

                // const products = await Product.find({ $or: [{ name: { $regex: '.*naudan.*' } }] })
                const total = await Product.find(query).count();
                const products = await Product.find(query)
                    .sort({ discount: -1 })
                    .populate({
                        path: 'market',
                    })
                    .limit(limit)
                    .skip(offset);

                if (!products) {
                    throw new Error('Can not get products');
                }

                // console.log('Total:', total, ' Products Length: ', products.length, '  Offset: ', offset, ' Limit: ', limit);
                const hasMore = total - offset - limit > 0 ? true : false;
                // console.log('Hasmore', hasMore);
                const returnProducts = {
                    total,
                    hasMore,
                    products,
                };

                return returnProducts;
                // const products = paginateResults({
                //     after,
                //     pageSize,
                //     results: allProducts,
                // });

                // console.log(products[products.length - 1].cursor);

                // const cursor = products.length ? products[products.length - 1].cursor : null;
                // const hasMore = products.length ? products[products.length - 1].cursor !== allProducts[allProducts.length - 1].cursor : false;

                // console.log(cursor, hasMore);

                // return {
                //     products,
                //     cursor,
                //     hasMore,
                // };
            } catch (error) {
                console.log(error);
            }
        },

        // Get all markets
        markets: async () => {
            try {
                const markets = await Market.find().sort({ name: 1 });

                if (!markets) {
                    throw new Error('Can nog get markets');
                }

                return markets;
            } catch (error) {
                console.log(error);
            }
        },
    },
};
