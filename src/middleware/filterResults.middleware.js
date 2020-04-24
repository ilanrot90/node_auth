function destructQueryParams({ select, sort, page, limit, ...queryParams }) {
    const queryStr = JSON.stringify(queryParams).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    return JSON.parse(queryStr);
}

const filterResults = ({ Model, populateParams }) => async (req, res, next) => {
    const queryParams = destructQueryParams(req.query);
    let { select, sort = '-createdAt', page = '1', limit = '20' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    // query by params
    let query = Model.find(queryParams);
    // populate by populateParams
    if(populateParams) {
        query.populate(populateParams)
    }
    // selected fields
    if (select) {
        const params = select.replace(',', ' ');
        query.select(params);
    }
    // sort fields
    query.sort(sort.replace(',', ' '));
    // pagination
    const total = await Model.countDocuments();
    let pagination = {};
    if (total > page * limit) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (0 > (page - 1) * limit) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    const result = await query;
    res.advanceFilter = {
        success: true,
        pagination,
        count: result.length,
        data: result
    };

    next();
};

module.exports = filterResults;
