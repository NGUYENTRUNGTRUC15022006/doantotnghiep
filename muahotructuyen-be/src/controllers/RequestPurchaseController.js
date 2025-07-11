const RequestPurchase = require("../models/RequestPurchase");

// 1. Gửi yêu cầu mua hộ
const createrequest = async (req, res) => {
  try {
    const {productName, productUrl, description,senderName,senderEmail,senderPhone,userId } = req.body;

    if (!productName || !productUrl|| !senderName|| !senderEmail || !senderPhone || userId) {
      return res.status(400).json({
        status: "ERR",
        message: "Tên sản phẩm và đường dẫn là bắt buộc.",
      });
    }

    const newRequest = await RequestPurchase.create({
      productName,
      productUrl,
      description,
      senderName,
      senderEmail,
      senderPhone,
      userId: req.user?.id,
    });

    return res.status(201).json({
      status: "OK",
      message: "Gửi yêu cầu mua hộ thành công.",
      data: newRequest,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: "Đã có lỗi xảy ra khi gửi yêu cầu.",
      error: error.message,
    });
  }
};

// 2. Lấy tất cả yêu cầu (cho admin)
const getAllRequests = async (req, res) => {
  try {
    const requests = await RequestPurchase.find()
      .populate("userId", "name email") // lấy thông tin user
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "OK",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: "Không thể lấy danh sách yêu cầu.",
      error: error.message,
    });
  }
};

// 3. Cập nhật yêu cầu
const updateRequest = async (req, res) => {
  const requestId = req.params.id;
  const updateData = req.body;

  try {
    const updated = await RequestPurchase.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: "ERR",
        message: "Không tìm thấy yêu cầu.",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Cập nhật yêu cầu thành công.",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: "Không thể cập nhật yêu cầu.",
      error: error.message,
    });
  }
};

// 4. Xoá yêu cầu
const deleteRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const deleted = await RequestPurchase.findByIdAndDelete(requestId);

    if (!deleted) {
      return res.status(404).json({
        status: "ERR",
        message: "Không tìm thấy yêu cầu để xoá.",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Xoá yêu cầu thành công.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: "Không thể xoá yêu cầu.",
      error: error.message,
    });
  }
};

module.exports = {
  createrequest,
  getAllRequests,
  updateRequest,
  deleteRequest,
};