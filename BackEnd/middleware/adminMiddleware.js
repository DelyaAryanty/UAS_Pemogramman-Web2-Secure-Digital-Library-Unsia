const adminKeamanan = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Khusus admin",
    });
  }

  next();
};

module.exports = adminKeamanan;