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
        products: async (_, { name, market, discount, offset = 0, limit = 20, sort = 'discount' }) => {
            try {
                let query = {};
                if (name) {
                    query = queryName(name);
                }

                if (market && market !== 'all') {
                    const checkMarket = await Market.find({ name: market });
                    if (!checkMarket) {
                        throw new Error('Can not find the market');
                    }
                    query = { ...query, market: checkMarket[0].id };
                }

                if (discount.length > 0) {
                    query = { ...query, $and: [{ discount: { $gte: discount[0] * 1 } }, { discount: { $lte: discount[1] * 1 } }] };
                }

                console.log('Variables:', name, market, discount);

                let sortDB = {};
                if (sort === 'nameAO') {
                    sortDB = { name: 1 };
                } else if (sort === 'nameOA') {
                    sortDB = { name: -1 };
                } else if (sort === 'priceAO') {
                    sortDB = { newPrice: 1 };
                } else if (sort === 'priceOA') {
                    sortDB = { newPrice: -1 };
                } else if (sort === 'discount') {
                    sortDB = { discount: -1 };
                } else {
                    sortDB = { discount: -1 };
                }

                // console.log(sortDB);
                // const products = await Product.find({ $or: [{ name: { $regex: '.*naudan.*' } }] })
                const total = await Product.find(query).countDocuments();
                const products = await Product.find(query)
                    .sort(sortDB)
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

        // Get products popular to introduce in hompage
        productIntroduce: async () => {
            try {
                const markets = await Market.find();
                let products = [];
                for (const market of markets) {
                    const product = await Product.find({ market: market.id })
                        .populate({
                            path: 'market',
                        })
                        .limit(1);
                    products.push(product[0]);
                }
                // console.log(products);
                return products;
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
