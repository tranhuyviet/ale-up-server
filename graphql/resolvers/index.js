import Product from '../../models/productModel.js';
import Market from '../../models/marketModel.js';

function queryName(name, discount, price) {
    let rtName = [];
    let returnObj = {};
    if (name) {
        const splitName = name.split(' ');
        for (const name of splitName) {
            rtName.push({ name: { $regex: `.*${name}.*`, $options: 'i' } });
        }
    }

    if (discount.length > 0) {
        rtName.push({ discount: { $gte: discount[0] * 1 } });
        rtName.push({ discount: { $lte: discount[1] * 1 } });
    }

    if (price.length > 0) {
        rtName.push({ newPrice: { $gte: price[0] * 1 } });
        rtName.push({ newPrice: { $lte: price[1] * 1 } });
    }

    if (rtName.length > 0) {
        returnObj = {
            $and: rtName,
        };
    }

    console.log('return obj', returnObj);

    return returnObj;
}

export default {
    // Product: {
    //     market: async (parent) => await Market.findById(parent.market),
    // },
    Query: {
        // Get all products
        products: async (_, { name, market, discount, price, offset = 0, limit = 20, sort = 'discount' }) => {
            try {
                let query = {};
                // if (name) {
                query = queryName(name, discount, price);
                // }

                if (market && market !== 'all') {
                    const checkMarket = await Market.find({ name: market });
                    if (!checkMarket) {
                        throw new Error('Can not find the market');
                    }
                    query = { ...query, market: checkMarket[0].id };
                }

                // if (discount.length === 0) discount = [0, 100];
                // if (price.length === 0) price = [0, 5000];

                // query = {
                //     ...query,
                //     $and: [
                //         { discount: { $gte: discount[0] * 1 } },
                //         { discount: { $lte: discount[1] * 1 } },
                //         { newPrice: { $gte: price[0] * 1 } },
                //         { newPrice: { $lte: price[1] * 1 } },
                //     ],
                // };

                // if (discount.length > 0) {
                //     query = { ...query, $and: [{ discount: { $gte: discount[0] * 1 } }, { discount: { $lte: discount[1] * 1 } }] };
                // }

                // if (price.length > 0) {
                //     query = { ...query, $and: [{ newPrice: { $gte: price[0] * 1 } }, { newPrice: { $lte: price[1] * 1 } }] };
                // }

                console.log(query);
                // console.log('Variables:', name, market, discount, price);

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

                // const productsGetMinMaxPrice = await Product.find().sort({ newPrice: 1 });
                // const total = productsGetMinMaxPrice.length;
                // console.log('CAC', productsGetMinMaxPrice[0].newPrice, productsGetMinMaxPrice[productsGetMinMaxPrice.length - 1].newPrice);

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

        // Get product min and max price (for filter price)
        productPrice: async () => {
            try {
                const product = await Product.aggregate([
                    {
                        $group: {
                            _id: '$id',
                            min: { $min: '$newPrice' },
                            max: { $max: '$newPrice' },
                        },
                    },
                ]);
                console.log(product[0]);
                return {
                    min: product[0].min,
                    max: product[0].max,
                };
                // const products = await Product.find().sort({ newPrice: 1 });
                // const productPrice = {
                //     min: products[0].newPrice,
                //     max: products[products.length - 1].newPrice,
                // };
                // return productPrice;
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
