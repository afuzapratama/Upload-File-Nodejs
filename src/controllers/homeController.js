const File = require('../models/File');

exports.renderHome = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1; // Halaman saat ini, default 1
    const limit = 15; // Batas file per halaman
    const skip = (page - 1) * limit;

    let query = {};
    if (search.trim() !== '') {
      query = { originalName: { $regex: search, $options: 'i' } };
    }

    // Ambil file dengan pagination
    const [files, count] = await Promise.all([
      File.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip),
      File.countDocuments(query)
    ]);

    const totalPages = Math.ceil(count / limit);

    res.render('index', {
      title: 'File Upload System',
      files,
      search,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    next(error);
  }
};
