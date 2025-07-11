const RequestPurchase = require("../models/RequestPurchase");

const createrequest = async (req, res) => {
  try {
    const data = {
      ...req.body,
      status: "pending", // mặc định khi tạo
      createdAt: new Date()
    };
    const newRequest = await RequestPurchase.create(data);
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: "Tạo yêu cầu thất bại", error: err.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await RequestPurchase.find().sort({ createdAt: -1 });
    res.status(200).json({ data: requests });
  } catch (err) {
    res.status(500).json({ message: "Lấy danh sách thất bại", error: err.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await RequestPurchase.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Cập nhật yêu cầu thất bại", error: err.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RequestPurchase.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    }
    res.status(200).json({ message: "Xóa yêu cầu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Xóa yêu cầu thất bại", error: err.message });
  }
};
const getRequestByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const requests = await RequestPurchase.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ data: requests });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy yêu cầu", error: err.message });
  }
};

module.exports = {
  createrequest,
  getAllRequests,
  updateRequest,
  deleteRequest,
};
