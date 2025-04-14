// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sql, poolPromise } = require("./db");
const authRoutes = require("./Auth");

const app = express();
const PORT = process.env.PORT || 3001;

// 👇 Add this BEFORE session middleware
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust Azure reverse proxy
}

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Your frontend origin
  credentials: true
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
       //secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      secure: false,         // 🔑 false for local HTTP; only true for HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
  })
);

// Middleware: check if session user is admin
function isAuthenticated(req, res, next) {
  if (req.session?.user?.isAdmin) {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
}

// Routes
app.use("/api/auth", authRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("Howard's Farm API is running.");
});

// Stripe PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Amount must be a number in cents." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("PaymentIntent error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get active products (not archived) ordered by DisplayOrder
// Get active products (non-archived)
app.get("/products", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM Products 
      WHERE IsArchived = 0 
      ORDER BY DisplayOrder ASC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).send("Failed to fetch products");
  }
});

app.get("/products/all", isAuthenticated, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM Products 
      ORDER BY DisplayOrder ASC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).send("Failed to fetch all products");
  }
});
app.put("/products/:id/archive", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { isArchived } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("isArchived", sql.Bit, isArchived)
      .query(`
        UPDATE Products
        SET IsArchived = @isArchived
        WHERE ProductId = @id
      `);
    res.sendStatus(200);
  } catch (err) {
    console.error("Archive toggle failed:", err.message);
    res.status(500).send("Failed to update archive status");
  }
});


// Update product
app.put("/products/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, imageURL, localPickupOnly, displayOrder } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar(100), name)
      .input("desc", sql.Text, description)
      .input("price", sql.Decimal(10, 2), price)
      .input("stock", sql.Int, stock)
      .input("img", sql.VarChar(255), imageURL)
      .input("pickup", sql.Bit, localPickupOnly)
      .input("order", sql.Int, displayOrder || 0)
      .query(`
        UPDATE Products
        SET Name = @name,
            Description = @desc,
            Price = @price,
            StockQty = @stock,
            ImageUrl = @img,
            LocalPickupOnly = @pickup,
            DisplayOrder = @order
        WHERE ProductId = @id
      `);

    res.sendStatus(200);
  } catch (err) {
    console.error("Update failed:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
});

// Add product
app.post("/products", isAuthenticated, async (req, res) => {
  const { name, description, price, stock, imageURL, localPickupOnly, displayOrder } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("Name", sql.VarChar(100), name)
      .input("Description", sql.Text, description)
      .input("Price", sql.Decimal(10, 2), price)
      .input("StockQty", sql.Int, stock)
      .input("ImageUrl", sql.VarChar(255), imageURL)
      .input("LocalPickupOnly", sql.Bit, localPickupOnly)
      .input("DisplayOrder", sql.Int, displayOrder || 0)
      .query(`
        INSERT INTO Products (Name, Description, Price, StockQty, ImageUrl, LocalPickupOnly, DisplayOrder)
        VALUES (@Name, @Description, @Price, @StockQty, @ImageUrl, @LocalPickupOnly, @DisplayOrder)
      `);

    res.status(201).send("Product added");
  } catch (err) {
    console.error("Insert error:", err.message);
    res.status(500).send("Failed to add product");
  }
});

// Delete product
app.delete("/products/:id", isAuthenticated, async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("ProductId", sql.Int, req.params.id)
      .query("DELETE FROM Products WHERE ProductId = @ProductId");

    res.send("Product deleted");
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).send("Failed to delete product");
  }
});

// Final checkout route (only one!)
app.post("/checkout", async (req, res) => {
  const { shippingInfo, cartItems } = req.body;

  //console.log("📦 Incoming checkout request:");
  //console.log("Shipping Info:", shippingInfo);
  //console.log("Cart Items:", cartItems);

  if (!shippingInfo || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Missing shipping info or cart items." });
  }

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const emailToUse = req.session.user?.email || shippingInfo.email;
    //console.log("📧 Using email:", emailToUse);

    const shippingResult = await transaction.request()
      .input("FullName", sql.NVarChar, shippingInfo.fullName)
      .input("Street", sql.NVarChar, shippingInfo.street)
      .input("City", sql.NVarChar, shippingInfo.city)
      .input("State", sql.NVarChar, shippingInfo.state)
      .input("Zip", sql.NVarChar, shippingInfo.zip)
      .input("Email", sql.NVarChar, emailToUse)
      .input("Phone", sql.NVarChar, shippingInfo.phone)
      .query(`
        INSERT INTO ShippingDetails (FullName, Street, City, State, Zip, Email, Phone, CreatedAt)
        OUTPUT INSERTED.Id
        VALUES (@FullName, @Street, @City, @State, @Zip, @Email, @Phone, GETDATE())
      `);

    const shippingId = shippingResult.recordset[0].Id;
    //console.log("📬 Shipping inserted with ID:", shippingId);

    const insertedOrders = [];

    for (const item of cartItems) {
      // Insert order
      const orderResult = await transaction.request()
        .input("ShippingId", sql.Int, shippingId)
        .input("ProductId", sql.Int, item.productId)
        .input("Quantity", sql.Int, item.quantity)
        .input("Price", sql.Decimal(10, 2), item.price)
        .input("OrderStatus", sql.NVarChar, "Pending")
        .query(`
          INSERT INTO Orders (ShippingId, ProductId, Quantity, Price, CreatedAt, OrderStatus)
          OUTPUT INSERTED.*
          VALUES (@ShippingId, @ProductId, @Quantity, @Price, GETDATE(), @OrderStatus)
        `);
    
      insertedOrders.push(orderResult.recordset[0]);
    
      // Subtract quantity from inventory
      await transaction.request()
        .input("ProductId", sql.Int, item.productId)
        .input("Quantity", sql.Int, item.quantity)
        .query(`
          UPDATE Products
          SET StockQty = StockQty - @Quantity
          WHERE ProductId = @ProductId
        `);
    }  
      

    await transaction.commit();

    const insertedOrder = insertedOrders[0];
    if (!insertedOrder || !insertedOrder.OrderId) {
      throw new Error("Inserted order is missing or invalid.");
    }

    //console.log("🆔 Inserted Order ID:", insertedOrder.OrderId);

    const result = await pool.request()
      .input("OrderId", sql.Int, insertedOrder.OrderId)
      .query(`
        SELECT 
          o.OrderId, o.ProductId, o.Quantity, o.Price, o.CreatedAt, o.OrderStatus,
          o.TrackingNumber, o.ShippedAt,
          p.Name AS ProductName,
          s.FullName, s.Street, s.City, s.State, s.Zip, s.Email, s.Phone
        FROM Orders o
        JOIN Products p ON o.ProductId = p.ProductId
        JOIN ShippingDetails s ON o.ShippingId = s.Id
        WHERE o.OrderId = @OrderId
      `);

    const orderDetails = result.recordset[0];
    //console.log("📦 Order details fetched from DB:", orderDetails);

    const recipientEmail = orderDetails?.Email || shippingInfo.email;
    //console.log("📤 Prepared to send to:", recipientEmail);

    if (!recipientEmail) {
      console.error("❌ No recipient email found. Skipping email.");
    } else {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const price = typeof orderDetails.Price === "number" ? orderDetails.Price : 0;
      const quantity = typeof orderDetails.Quantity === "number" ? orderDetails.Quantity : 0;
      const total = price * quantity;

      const emailHtml = `
        <h2>Thank you for your order from Howard's Farm!</h2>
        <p><strong>Order ID:</strong> ${orderDetails.OrderId}</p>
        <p><strong>Date:</strong> ${new Date(orderDetails.CreatedAt).toLocaleString()}</p>
        <h3>Items Ordered:</h3>
        <p>${quantity} × ${orderDetails.ProductName} @ $${price.toFixed(2)}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <h3>Shipping Address:</h3>
        <p>${orderDetails.FullName}<br>${orderDetails.Street}<br>${orderDetails.City}, ${orderDetails.State} ${orderDetails.Zip}</p>
        <p><strong>Status:</strong> ${orderDetails.OrderStatus}</p>
        <hr />
        <p>This is a confirmation of your purchase. You’ll receive another email when your order ships.</p>
      `;

      try {
        await transporter.sendMail({
          from: `"Howard's Farm" <${process.env.EMAIL_USER}>`,
          to: recipientEmail,
          replyTo: process.env.ORDER_REPLY_TO,
          bcc: process.env.ORDER_BCC,  // ✅ Admin receives a copy
          subject: `Your Howard's Farm Order #${orderDetails.OrderId}`,
          html: emailHtml,
        });
        //console.log("✅ Email sent to:", recipientEmail);
      } catch (emailErr) {
        console.error("❌ Email send failed:", emailErr.message);
      }
    }

    res.status(200).json(orderDetails);
  } catch (err) {
    if (transaction._aborted !== true) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr.message);
      }
    }
    console.error("❌ Checkout failed:", err.message);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// Admin: Get all orders with shipping and product info
app.get("/api/admin/orders", isAuthenticated, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
  o.OrderId AS orderId,
  o.ShippingId AS shippingId,
  o.ProductId AS productId,
  o.Quantity AS quantity,
  o.Price AS price,
  o.CreatedAt AS createdAt,
  o.OrderStatus AS orderStatus,
  o.TrackingNumber AS trackingNumber,
  o.ShippedAt AS shippedAt,
  s.FullName AS fullName,
  s.Street AS street,
  s.City AS city,
  s.State AS state,
  s.Zip AS zip,
  s.Email AS email,
  s.Phone AS phone,
  p.Name AS productName
FROM Orders o
JOIN ShippingDetails s ON o.ShippingId = s.Id
JOIN Products p ON o.ProductId = p.ProductId
ORDER BY o.CreatedAt DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin: Update order status and tracking number and send Shipping E-mail (once)
app.put("/api/admin/orders/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { orderStatus, trackingNumber } = req.body;

  try {
    const pool = await poolPromise;

    // 🔍 Step 1: Fetch current order before updating
    const result = await pool.request()
      .input("OrderId", sql.Int, id)
      .query(`
        SELECT o.OrderId, o.OrderStatus, o.Quantity, o.Price, o.ShippingEmailSent,
               s.Email, s.FullName, s.Street, s.City, s.State, s.Zip,
               p.Name AS ProductName
        FROM Orders o
        JOIN ShippingDetails s ON o.ShippingId = s.Id
        JOIN Products p ON o.ProductId = p.ProductId
        WHERE o.OrderId = @OrderId
      `);

    const currentOrder = result.recordset[0];
    const wasShipped = currentOrder?.OrderStatus === "Shipped";
    const alreadyEmailed = currentOrder?.ShippingEmailSent;

    // ✅ Step 2: Perform the update (this matches your original logic exactly)
    await pool.request()
      .input("OrderId", sql.Int, id)
      .input("OrderStatus", sql.NVarChar, orderStatus)
      .input("TrackingNumber", sql.NVarChar, trackingNumber || "")
      .query(`
        UPDATE Orders
        SET OrderStatus = @OrderStatus,
            TrackingNumber = @TrackingNumber,
            ShippedAt = CASE 
                         WHEN @OrderStatus = 'Shipped' AND ShippedAt IS NULL THEN GETDATE()
                         ELSE ShippedAt
                       END
        WHERE OrderId = @OrderId
      `);

    // ✅ Step 3: Send email only if status changed to "Shipped" and hasn't been emailed yet
    if (!wasShipped && orderStatus === "Shipped" && !alreadyEmailed) {
      console.log("📬 Sending shipping email...");

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const price = parseFloat(currentOrder.Price || 0);
      const quantity = parseInt(currentOrder.Quantity || 0);
      const total = price * quantity;

      const emailHtml = `
        <h2>Your order has shipped from Howard's Farm! 📦</h2>
        <p><strong>Order ID:</strong> ${currentOrder.OrderId}</p>
        <p><strong>Date Shipped:</strong> ${new Date().toLocaleString()}</p>

        <h3>Items Shipped:</h3>
        <p>${quantity} × ${currentOrder.ProductName} @ $${price.toFixed(2)}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>

        <h3>Shipping Address:</h3>
        <p>${currentOrder.FullName}<br>${currentOrder.Street}<br>${currentOrder.City}, ${currentOrder.State} ${currentOrder.Zip}</p>

        ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ""}
        <hr />
        <p>This is a confirmation that your order has shipped. You’ll receive delivery soon. Thank you for shopping with us!</p>
      `;

      await transporter.sendMail({
        from: `"Howard's Farm" <${process.env.EMAIL_USER}>`,
        to: currentOrder.Email,
        replyTo: process.env.ORDER_REPLY_TO,
        bcc: process.env.ORDER_BCC,
        subject: `📬 Your Howard's Farm Order #${currentOrder.OrderId} Has Shipped!`,
        html: emailHtml,
      });

      console.log(`✅ Shipping email sent to ${currentOrder.Email}`);

      // ✅ Step 4: Mark email sent in the DB
      await pool.request()
        .input("OrderId", sql.Int, id)
        .query(`
          UPDATE Orders
          SET ShippingEmailSent = 1
          WHERE OrderId = @OrderId
        `);
    }

    res.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("❌ Order update error:", err.message);
    res.status(500).json({ error: "Failed to update order" });
  }
});




// Customer Order lookup 
app.get("/api/orders", async (req, res) => {
  //console.log("🔍 SESSION USER", req.session.user);

  if (!req.session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("Email", sql.NVarChar, req.session.user.email)
      .query(`
        SELECT 
          o.OrderId AS orderId,
          o.ProductId AS productId,
          o.Quantity AS quantity,
          o.Price AS price,
          o.CreatedAt AS createdAt,
          o.OrderStatus AS orderStatus,
          o.TrackingNumber AS trackingNumber,
          o.ShippedAt AS shippedAt,
          p.Name AS productName
        FROM Orders o
        JOIN ShippingDetails s ON o.ShippingId = s.Id
        JOIN Products p ON o.ProductId = p.ProductId
        WHERE s.Email = @Email
        ORDER BY o.CreatedAt DESC
      `);

    //console.log("✅ Orders found:", result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Fetch user orders error:", err.message);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

// Express route: /api/orders/last

app.get("/api/orders/last", async (req, res) => {
  // Check if the email is available from the session or fallback
  const email = req.session?.user?.email;

  if (!email) {
    return res.status(401).json({ error: "Unauthorized: no session email." });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("Email", sql.NVarChar, email)
      .query(`
        SELECT TOP 1 
          o.OrderId,
          o.ProductId,
          o.Quantity,
          o.Price,
          o.CreatedAt,
          o.OrderStatus,
          o.TrackingNumber,
          o.ShippedAt,
          p.Name AS ProductName,
          s.FullName,
          s.Street,
          s.City,
          s.State,
          s.Zip,
          s.Email,
          s.Phone
        FROM Orders o
        JOIN Products p ON o.ProductId = p.ProductId
        JOIN ShippingDetails s ON o.ShippingId = s.Id
        WHERE s.Email = @Email
        ORDER BY o.CreatedAt DESC
      `);

    const lastOrder = result.recordset[0];

    if (!lastOrder) {
      return res.status(404).json({ error: "No orders found for this user." });
    }

    res.status(200).json(lastOrder);
  } catch (err) {
    console.error("Error fetching last order:", err);
    res.status(500).json({ error: "Failed to load order." });
  }
});






// Contact form
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Howard's Farm Contact" <${process.env.EMAIL_USER}>`,
      to: "benhoward2000@gmail.com",
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.send({ success: true });
  } catch (error) {
    console.error("Email send error:", error.message);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

