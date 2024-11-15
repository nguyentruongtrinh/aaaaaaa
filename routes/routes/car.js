const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Route để tạo ô tô mới
router.post('/create', async (req, res) => {
    // Logic để tạo ô tô mới
});

// Route để lấy danh sách ô tô
router.get('/', async (req, res) => {
    // Logic để lấy danh sách ô tô
});

module.exports = router;

// Route để tạo ô tô mới
router.post('/create', async (req, res) => {
    const { MaXe, Name, Price, Year, Brand } = req.body;
    const errors = [];

    // Kiểm tra nếu các trường yêu cầu không được gửi đi
    if (!req.body || !MaXe || !Name || !Price || !Year || !Brand) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Làm sạch dữ liệu đầu vào
    const cleanName = Name.trim();
    const cleanMaXe = MaXe.trim();
    const cleanPrice = parseFloat(Price);
    const cleanYear = parseInt(Year);
    const cleanBrand = Brand.trim();

    // Validation phía server
    if (!cleanMaXe) errors.push('MaXe is required');
    if (!cleanName || /\d/.test(cleanName)) errors.push('Name must be letters only');
    if (!cleanPrice || isNaN(cleanPrice)) errors.push('Price must be a valid number');
    if (!cleanYear || isNaN(cleanYear) || cleanYear < 1980 || cleanYear > 2024) errors.push('Year must be between 1980 and 2024');
    if (!cleanBrand) errors.push('Brand is required');

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // Tạo và lưu xe mới vào database
        const car = new Car({
            MaXe: cleanMaXe,
            Name: cleanName,
            Price: cleanPrice,
            Year: cleanYear,
            Brand: cleanBrand
        });

        // Lưu xe vào database
        await car.save();

        // Trả về thông báo thành công với thông tin chi tiết của ô tô mới
        res.json({
            message: 'Car created successfully',
            car: {
                id: car._id,
                MaXe: car.MaXe,
                Name: car.Name,
                Price: car.Price,
                Year: car.Year,
                Brand: car.Brand
            }
        });
    } catch (err) {
        // Xử lý lỗi khi tạo ô tô
        console.error(err);
        res.status(500).json({ message: 'Error creating car', error: err.message });
    }
});

// Route để lấy danh sách ô tô
router.get('/getDatabase', async (req, res) => {
    try {
        const cars = await Car.find();
        if (!cars.length) {
            return res.status(404).json({ message: 'No cars found' });
        }
        res.json(cars);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching cars', error: err.message });
    }
});

module.exports = router;
