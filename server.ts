import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory "database"
  let siteSettings = {
    contactPhone: "1900 1234",
    consultantPhone: "0901 234 567"
  };

  let promotions = [
    {
      id: "p1",
      title: "Ưu đãi Vinhomes Priority",
      detail: "Hỗ trợ lãi suất 0% lên đến 24 tháng. Tặng voucher VinFast lên đến 200 triệu đồng.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "p2",
      title: "Mùa Hè Rực Rỡ cùng Vinpearl",
      detail: "Giảm ngay 20% cho các căn biệt thự biển. Miễn phí Buffet sáng và vé vui chơi VinWonders.",
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  let projects = [
    // ... existing projects
    {
      id: "1",
      title: "Vinhomes Ocean Park 2 - The Empire",
      description: "Đại đô thị biển tầm cỡ thế giới với hồ tạo sóng lớn nhất hành tinh. Không gian sống đẳng cấp thượng lưu.",
      price: 4.5,
      location: "Gia Lâm, Hà Nội",
      imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
      beds: 3,
      baths: 2,
      area: 75,
      type: "Căn hộ",
      status: "MỚI"
    },
    {
      id: "2",
      title: "The Canopy Residences - Smart City",
      description: "Phân khu cao cấp phong cách Singapore tại trung tâm Vinhomes Smart City. Tiện ích hiện đại, chuẩn sống xanh.",
      price: 3.2,
      location: "Tây Mỗ, Nam Từ Liêm, Hà Nội",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      beds: 2,
      baths: 2,
      area: 64,
      type: "Căn hộ",
      status: "HOT"
    },
    {
      id: "3",
      title: "Vinpearl Harbour Resort & Villas",
      description: "Biệt thự nghỉ dưỡng mặt biển đẳng cấp 5 sao tại Nha Trang. Cơ hội đầu tư sinh lời bền vững.",
      price: 12.8,
      location: "Hòn Tre, Nha Trang",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      beds: 4,
      baths: 4,
      area: 250,
      type: "Biệt thự",
      status: "SANG TRỌNG"
    }
  ];

  // API Routes
  app.get("/api/site-settings", (req, res) => {
    res.json(siteSettings);
  });

  app.post("/api/site-settings", (req, res) => {
    siteSettings = { ...siteSettings, ...req.body };
    res.json(siteSettings);
  });

  app.get("/api/promotions", (req, res) => {
    res.json(promotions);
  });

  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const newProject = {
      ...req.body,
      id: Date.now().toString(),
    };
    projects.push(newProject);
    res.status(201).json(newProject);
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@vinhomes.vn" && password === "123456") {
      res.json({ success: true, token: "demo-jwt-token" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
