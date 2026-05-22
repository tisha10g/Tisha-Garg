import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Multi-user state in memory, persisting as long as server runs
let database = {
  products: [
    {
      id: 'b1',
      name: 'Kusum Royal Bridal Kundan Bindi',
      description: 'An exquisite hand-crafted centerpiece featuring premium Kundan stones, ruby red accents, and delicate gold filigree. Ideal for signature bridal and grand wedding occasions.',
      category: 'Bridal',
      price: 599,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300',
      size: 'Large',
      color: 'Crimson Red & Gold',
      stoneType: 'Premium Polki & Ruby',
      recommendedFaceShapes: ['Round', 'Square', 'Heart'],
      rating: 4.9,
      stock: 25,
      tags: ['Bridal', 'Kundan', 'Traditional', 'Grand'],
      reviews: [
        { author: 'Meera Sharma', rating: 5, text: 'Absolutely spectacular! Wore it on my wedding day, everyone asked about it.', date: '2026-04-12' },
        { author: 'Divya Iyer', rating: 5, text: 'The stones sparkle beautifully. Worth every rupee.', date: '2026-05-01' }
      ]
    },
    {
      id: 'b2',
      name: 'Kusum Delicate Teardrop Pearl Bindi',
      description: 'An elegant Pearl cluster bindi in a graceful drop silhouette. Combining classic Indian heritage with contemporary luxury, perfect for Indo-western outfits.',
      category: 'Designer',
      price: 349,
      imageUrl: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=300',
      size: 'Medium',
      color: 'Ivory & Amber Gold',
      stoneType: 'Cultured Pearl & Gemstones',
      recommendedFaceShapes: ['Oval', 'Diamond', 'Heart'],
      rating: 4.8,
      stock: 40,
      tags: ['Designer', 'Pearl', 'Teardrop', 'Elegant'],
      reviews: [
        { author: 'Pooja Patel', rating: 4, text: 'Very precise craft. Soft ivory tone matches perfectly with pastel lehengas.', date: '2026-05-10' }
      ]
    },
    {
      id: 'b3',
      name: 'Kusum Imperial Chandrakor Crescent',
      description: 'Worn traditionally in Maharashtra, this classic crescent crescent-moon bindi comes lined with minute pearls and central emerald stones.',
      category: 'Traditional',
      price: 249,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300',
      size: 'Large',
      color: 'Maroon & Deep Green',
      stoneType: 'Micro-pearls & Emerald Crystal',
      recommendedFaceShapes: ['Round', 'Oval', 'Square'],
      rating: 4.7,
      stock: 18,
      tags: ['Traditional', 'Crescent', 'Chandrakor', 'Festival'],
      reviews: [
        { author: 'Anjali Deshmukh', rating: 5, text: 'Authentic Maharashtrian look! The pearl border detail is highly refined.', date: '2026-03-22' }
      ]
    },
    {
      id: 'b4',
      name: 'Kusum Minimalist Velvet Crimson (Set of 30)',
      description: 'Premium quality micro-velvet dot bindis in varying sizes from tiny pinpoints to medium circles. Gentle adhesive designed for highly sensitive skin.',
      category: 'Minimalist',
      price: 149,
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300',
      size: 'Combo',
      color: 'Sindoor Maroon',
      stoneType: 'None (Plain Velvet)',
      recommendedFaceShapes: ['Round', 'Oval', 'Heart', 'Square', 'Diamond'],
      rating: 4.6,
      stock: 120,
      tags: ['Daily Use', 'Office', 'Velvet', 'Classic'],
      reviews: [
        { author: 'Kriti Sen', rating: 4, text: 'Elegant, sticks very well, and reusable 3-4 times easily.', date: '2026-05-18' }
      ]
    },
    {
      id: 'b5',
      name: 'Kusum Midnight Star Swarovski Bindi',
      description: 'Stunning black base bindi crowned with a brilliant centered Swarovski crystal element that dances with light. Handset on high durability material.',
      category: 'Stone',
      price: 299,
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300',
      size: 'Small',
      color: 'Midnight Black & Platinum',
      stoneType: 'Swarovski Solitaire Crystal',
      recommendedFaceShapes: ['Heart', 'Diamond', 'Oval'],
      rating: 4.9,
      stock: 50,
      tags: ['Party', 'Modern', 'Swarovski', 'Chic'],
      reviews: [
        { author: 'Rhea Kapoor', rating: 5, text: 'This bindi matches beautifully with smokey eyes and black sarees!', date: '2026-04-20' }
      ]
    },
    {
      id: 'b6',
      name: 'Kusum Gilded Marquise Emerald Bindi',
      description: 'An elongated vertical diamond setting surrounded by minute gold wire work. Dramatically structures the face, making it look taller and slimmer.',
      category: 'Designer',
      price: 399,
      imageUrl: 'https://images.unsplash.com/photo-1588444839799-eb0c99e19d1e?auto=format&fit=crop&q=80&w=300',
      size: 'Medium',
      color: 'Emerald Green & Gold',
      stoneType: 'Faceted Emerald & Gold Filigree',
      recommendedFaceShapes: ['Round', 'Square'],
      rating: 4.8,
      stock: 32,
      tags: ['Designer', 'Emerald', 'Elongated', 'Wedding'],
      reviews: [
        { author: 'Sneha Rao', rating: 5, text: 'Extremely elegant. Ideal for round face profiles as it creates a slimming effect.', date: '2026-05-15' }
      ]
    },
    {
      id: 'b7',
      name: 'Kusum Sacred Lotus Blossom Velvet Bindi',
      description: 'Delicately laser-cut lotus shape in rich pink velvet and adorned with a shimmering gold bead at the core. Embodies pure Indian grace.',
      category: 'Traditional',
      price: 199,
      imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=300',
      size: 'Medium',
      color: 'Lotus Pink & Gold',
      stoneType: 'Gold Microbead',
      recommendedFaceShapes: ['Oval', 'Heart', 'Diamond'],
      rating: 4.7,
      stock: 75,
      tags: ['Lotus', 'Festival', 'Velvet', 'Poetic'],
      reviews: [
        { author: 'Prisha Mehta', rating: 5, text: 'Divine design! Perfect for Diwali and festival family prayers.', date: '2026-05-02' }
      ]
    },
    {
      id: 'b8',
      name: 'Kusum Shahi Gold Jhumka Dangling Bindi',
      description: 'A truly magnificent royal bindi that suspends a delicate, micro-crafted gold swing element from a kundan base. Swings with your precise movements.',
      category: 'Bridal',
      price: 499,
      imageUrl: 'https://images.unsplash.com/photo-1573100925118-870b8f131f3c?auto=format&fit=crop&q=80&w=300',
      size: 'Large',
      color: 'Antique Gold',
      stoneType: 'Gold Bead & Polki Stones',
      recommendedFaceShapes: ['Square', 'Heart', 'Oval'],
      rating: 4.9,
      stock: 12,
      tags: ['Bridal', 'Jhumka', 'Antique', 'Statement'],
      reviews: [
        { author: 'Navya Reddy', rating: 5, text: 'So unique. It functions as a bindi and a baby maang tikka simultaneously. Outstanding.', date: '2026-05-05' }
      ]
    }
  ],
  customers: [
    { id: 'c1', name: 'Aishwarya Sen', email: 'aishwarya.sen@gmail.com', phone: '+91 98300 12345', city: 'Kolkata', registrationDate: '2025-11-15', ordersCount: 8, lifetimeValue: 3950, tier: 'VIP', points: 395, wishlist: ['b1', 'b5'], favoriteStyle: 'Oval - Bridal Glam', segment: 'Bridal', lastActivity: '2026-05-21' },
    { id: 'c2', name: 'Preeti Deshmukh', email: 'preeti.d@yahoo.com', phone: '+91 91234 56789', city: 'Mumbai', registrationDate: '2026-01-20', ordersCount: 5, lifetimeValue: 1450, tier: 'Gold', points: 145, wishlist: ['b3'], favoriteStyle: 'Round - Traditional Functions', segment: 'Festive', lastActivity: '2026-05-20' },
    { id: 'c3', name: 'Ananya Nair', email: 'nair.ananya@gmail.com', phone: '+91 80456 78901', city: 'Bengaluru', registrationDate: '2026-02-14', ordersCount: 3, lifetimeValue: 746, tier: 'Silver', points: 75, wishlist: ['b2', 'b4'], favoriteStyle: 'Heart - Minimal Makeup', segment: 'Daily', lastActivity: '2026-05-18' },
    { id: 'c4', name: 'Shweta Kapoor', email: 'shweta.k@outlook.com', phone: '+91 99100 88221', city: 'New Delhi', registrationDate: '2025-08-04', ordersCount: 14, lifetimeValue: 6990, tier: 'VIP', points: 820, wishlist: ['b8'], favoriteStyle: 'Oval - Bold Party Look', segment: 'Premium', lastActivity: '2026-05-22' },
    { id: 'c5', name: 'Meenakshi Iyer', email: 'meena.iyer@gmail.com', phone: '+91 94440 55112', city: 'Chennai', registrationDate: '2026-03-30', ordersCount: 2, lifetimeValue: 498, tier: 'Bronze', points: 50, wishlist: ['b7'], favoriteStyle: 'Square - Natural Makeup', segment: 'Daily', lastActivity: '2026-05-05' }
  ],
  leads: [
    { id: 'l1', name: 'Radhika Merchant', email: 'radhika.m@ambani.com', phone: '+91 98222 11100', source: 'Try-On User', status: 'Highly Interested', notes: 'Tried on Royal Bridal Kundan Bindi. Added to cart. Left checkout. Needs reminder.', date: '2026-05-22' },
    { id: 'l2', name: 'Janhavi Mehta', email: 'janhavi@mehta.org', phone: '+91 88552 44331', source: 'Contact Form', status: 'New', notes: 'Inquired about wholesale orders/shippings for bridesmaids in the US.', date: '2026-05-21' },
    { id: 'l3', name: 'Pooja Hegde', email: 'pooja.hegde@gmail.com', phone: '+91 77700 99911', source: 'WhatsApp', status: 'Contacted', notes: 'Seeking size recommendation for Oval face shape.', date: '2026-05-19' },
    { id: 'l4', name: 'Kiran Grewal', email: 'kiran.g@gmail.com', phone: '+91 92244 55667', source: 'Newsletter', status: 'Converted', notes: 'Subscribed and immediately customized dynamic bindi matching.', date: '2026-05-15' }
  ],
  orders: [
    { id: 'ORD-8491', customerId: 'c1', customerName: 'Aishwarya Sen', customerEmail: 'aishwarya.sen@gmail.com', date: '2026-05-21', items: [{ productId: 'b1', name: 'Kusum Royal Bridal Kundan Bindi', price: 599, quantity: 1 }, { productId: 'b5', name: 'Kusum Midnight Star Swarovski Bindi', price: 299, quantity: 2 }], total: 1197, status: 'Shipped', paymentMethod: 'Card', trackingNumber: 'IN84910292X' },
    { id: 'ORD-7521', customerId: 'c4', customerName: 'Shweta Kapoor', customerEmail: 'shweta.k@outlook.com', date: '2026-05-18', items: [{ productId: 'b8', name: 'Kusum Shahi Gold Jhumka Dangling Bindi', price: 499, quantity: 1 }], total: 499, status: 'Delivered', paymentMethod: 'COD' },
    { id: 'ORD-3011', customerId: 'c3', customerName: 'Ananya Nair', customerEmail: 'nair.ananya@gmail.com', date: '2026-05-14', items: [{ productId: 'b4', name: 'Kusum Minimalist Velvet Crimson (Set of 30)', price: 149, quantity: 2 }], total: 298, status: 'Processing', paymentMethod: 'Card' }
  ],
  campaigns: [
    { id: 'm1', title: 'Flawless Sawan & Teej Special Offer', channel: 'Email', subject: '✨ Up to 35% Off Kusum Premium Bindis for Teej & Sawan ✨', body: 'Namaste! Adorn yourself this festive season with our sacred luxury bindis. Explore the AI designer matched collections...', segment: 'Festive', sentCount: 120, openedCount: 88, clickedCount: 42, status: 'Sent', date: '2026-05-15' },
    { id: 'm2', title: 'Royal Bridal Launch Broadcaster', channel: 'WhatsApp', subject: 'New Bridal Launch', body: 'Hello Beautiful! Witness Kusum’s Royal Jhumka & Kundan Bindis collection live. Try on using our AR tool now!', segment: 'Bridal', sentCount: 50, openedCount: 48, clickedCount: 37, status: 'Sent', date: '2026-05-20' },
    { id: 'm3', title: 'Abandoned Cart Rescue', channel: 'SMS', subject: 'Complete Your Look', body: 'The bindi in your tray is calling. Confirm checkout now to avail 10% Cash On Delivery Discount from Kusum.', segment: 'All', sentCount: 15, openedCount: 12, clickedCount: 8, status: 'Draft', date: '2026-05-22' }
  ],
  tickets: [
    { id: 'TKT-9201', customerName: 'Meera Sharma', customerEmail: 'meera.s@gmail.com', subject: 'Bridal Bindi sizing query', message: 'Hi! I am wearing a high-collared gold neck lehenga with an oval face. Which size would outline my forehead best, large or medium Kundan?', status: 'Open', priority: 'High', date: '2026-05-22', category: 'Styling Assistance' },
    { id: 'TKT-8105', customerName: 'Divya Iyer', customerEmail: 'divya.i@gmail.com', subject: 'Delivery delay to Chennai', message: 'Tracking says ORD-8491 is shipped, would like to confirm if it reaches before Friday.', status: 'In Progress', priority: 'Medium', date: '2026-05-21', category: 'Delivery' }
  ]
};

// Lazy creation of GoogleGenAI client (so it doesn't crash on startup if API key is missing)
let genAIClient = null;
function getGenAI() {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing from environment. Please populate it in Settings > Secrets.");
    }
    genAIClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// 1. AI Recommendation Engine Route (server-side Gemini)
app.post("/api/gemini/recommend", async (req, res) => {
  const { faceShape, occasion, outfit, makeupStyle } = req.body;

  if (!faceShape || !occasion || !outfit || !makeupStyle) {
    return res.status(400).json({ error: "Missing styling dimensions payload." });
  }

  try {
    const ai = getGenAI();
    const prompt = `
      Create a premium fashion expert recommendation for Kusum Fancy Bindi.
      User Profile:
      - Face Shape: ${faceShape}
      - Occasion: ${occasion}
      - Outfit Style & Color: ${outfit}
      - Makeup Look: ${makeupStyle}
      
      Respond STRICTLY in JSON format with keys matching this exact structure:
      {
        "bindiStyleRecommendation": "Short heading representing the best bindi look (e.g. Traditional Red Kumkum with Jhumka Danglers)",
        "idealSizeCode": "Small / Medium / Large / Combo",
        "colorMatchingAdvise": "Detail of color matching advice based on outfit and makeup",
        "stoneDesignJustification": "Explanation of Kundan, Pearl, Velvet or Swarovski stone design selection",
        "stylingTip": "Actionable luxury fashion styling tips for the overall look (hair, apparel and jewelry)",
        "celebrityInspiration": "One or two Bollywood celebrities who pulled off this look",
        "makeupComplementTip": "Suggestions on eyes, lipstick, and blush to align with this bindi",
        "isTraditional": true // or false
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "bindiStyleRecommendation", 
            "idealSizeCode", 
            "colorMatchingAdvise", 
            "stoneDesignJustification", 
            "stylingTip", 
            "celebrityInspiration", 
            "makeupComplementTip", 
            "isTraditional"
          ],
          properties: {
            bindiStyleRecommendation: { type: Type.STRING },
            idealSizeCode: { type: Type.STRING },
            colorMatchingAdvise: { type: Type.STRING },
            stoneDesignJustification: { type: Type.STRING },
            stylingTip: { type: Type.STRING },
            celebrityInspiration: { type: Type.STRING },
            makeupComplementTip: { type: Type.STRING },
            isTraditional: { type: Type.BOOLEAN }
          }
        },
        systemInstruction: "You are Kusum’s Chief Royal Stylist, an expert in high-fashion bindi curation, South Asian cosmetics, traditional luxury ornaments, and contemporary ethnic trends."
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({ success: true, recommendation: parsedData });

  } catch (error) {
    console.error("Gemini AI styling engine error:", error);
    // Graceful fallback description when API key is missing or model throws an error
    return res.json({
      success: false,
      message: "Showing expert offline recommendation. Configured fallback advice applied successfully.",
      recommendation: {
        bindiStyleRecommendation: `${faceShape === 'Round' ? 'Vertical Marquise Stone Bindi' : 'Royal Kundan Teardrop Bindi'}`,
        idealSizeCode: faceShape === 'Oval' || faceShape === 'Round' ? 'Medium' : 'Large',
        colorMatchingAdvise: `A complimentary soft contrast matching ruby-red or gold shade complements your ${outfit} and highlights your ${makeupStyle}.`,
        stoneDesignJustification: "Encrusted Polki stones combined with a gentle velvet padding emphasize symmetry and structure.",
        stylingTip: "Style your hair in a sleek low bun or a classic half-up halo braid to keep your forehead clear and accentuate the geometry of the design.",
        celebrityInspiration: "Deepika Padukone and Priyanka Chopra",
        makeupComplementTip: "Pair with classic winged eye-liner and a matte liquid bindi-toned lipstick (crimson or ruby-red).",
        isTraditional: true
      }
    });
  }
});

// 2. Chatbot Assistant / Support Route (server-side Gemini)
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body; // array of {role, content}
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array expected." });
  }

  try {
    const ai = getGenAI();
    
    // Format messages for simple model turn
    // Take the last 5 messages for brevity and safety
    const historyPrompt = messages.slice(-6).map(m => `${m.role === 'user' ? 'Customer' : 'Stylist'}: ${m.content}`).join("\n");
    const fullPrompt = `${historyPrompt}\nStylist (Respond in 2-3 sentences max, warm and helpful):`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: "You are Kusum, the Royal AI Assistant of Kusum Fancy Bindi. You help customers choose luxury bindis, suggest matches for face shapes, assist with discount codes, explain delivery times (3-5 days in India), and represent royal Indian feminine hospitality.",
        temperature: 0.7
      }
    });

    return res.json({ response: response.text });
  } catch (error) {
    console.error("Gemini chat error:", error);
    // Generic cute chatbot fallback
    return res.json({ 
      response: "Pranam! I am here to help. I recommend pairing our Kusum Royal Bridal Kundan bindi with heavy earrings for a luxurious, traditional look. Is there anything specific about size or shipping I can assist you with?" 
    });
  }
});

// 3. Store API Endpoints for interactive CRM
app.get("/api/products", (req, res) => {
  res.json(database.products);
});

app.post("/api/products", (req, res) => {
  const newProduct = {
    id: 'b' + (database.products.length + 1),
    rating: 5.0,
    reviews: [],
    ...req.body
  };
  database.products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

app.delete("/api/products/:id", (req, res) => {
  database.products = database.products.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

app.get("/api/customers", (req, res) => {
  res.json(database.customers);
});

app.get("/api/leads", (req, res) => {
  res.json(database.leads);
});

app.post("/api/leads", (req, res) => {
  const newLead = {
    id: 'l' + (database.leads.length + 1),
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  database.leads.unshift(newLead);
  res.json({ success: true, lead: newLead });
});

app.get("/api/orders", (req, res) => {
  res.json(database.orders);
});

app.post("/api/orders", (req, res) => {
  const { customerName, customerEmail, items, total, paymentMethod } = req.body;
  const newOrder = {
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    customerId: 'guest',
    customerName,
    customerEmail,
    date: new Date().toISOString().split('T')[0],
    items,
    total,
    status: 'Pending',
    paymentMethod,
    trackingNumber: paymentMethod === 'Card' ? 'IN' + Math.floor(10000 + Math.random() * 90000) + 'X' : undefined
  };
  database.orders.unshift(newOrder);

  // Auto-create or convert lead
  const existingLeadIndex = database.leads.findIndex(l => l.email === customerEmail);
  if (existingLeadIndex !== -1) {
    database.leads[existingLeadIndex].status = 'Converted';
  } else {
    database.leads.unshift({
      id: 'l' + (database.leads.length + 1),
      name: customerName,
      email: customerEmail,
      phone: '+91 99999 88888',
      source: 'Try-On User',
      status: 'Converted',
      notes: `Placed order ${newOrder.id} successfully.`,
      date: new Date().toISOString().split('T')[0]
    });
  }

  // Add customer points or register customer
  const customer = database.customers.find(c => c.email === customerEmail);
  if (customer) {
    customer.ordersCount += 1;
    customer.lifetimeValue += total;
    customer.points += Math.floor(total * 0.1);
    if (customer.lifetimeValue > 5000) customer.tier = 'VIP';
    else if (customer.lifetimeValue > 2500) customer.tier = 'Gold';
    else if (customer.lifetimeValue > 1000) customer.tier = 'Silver';
  } else {
    database.customers.push({
      id: 'c' + (database.customers.length + 1),
      name: customerName,
      email: customerEmail,
      phone: '+91 99999 88888',
      city: 'Mumbai',
      registrationDate: new Date().toISOString().split('T')[0],
      ordersCount: 1,
      lifetimeValue: total,
      tier: total > 2000 ? 'Gold' : 'Silver',
      points: Math.floor(total * 0.1),
      wishlist: [],
      favoriteStyle: 'Unknown',
      segment: 'Daily',
      lastActivity: new Date().toISOString().split('T')[0]
    });
  }

  res.json({ success: true, order: newOrder });
});

app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  const order = database.orders.find(o => o.id === req.params.id);
  if (order) {
    order.status = status;
    res.json({ success: true, order });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

app.get("/api/campaigns", (req, res) => {
  res.json(database.campaigns);
});

app.post("/api/campaigns", (req, res) => {
  const newCamp = {
    id: 'm' + (database.campaigns.length + 1),
    date: new Date().toISOString().split('T')[0],
    sentCount: Math.floor(25 + Math.random() * 200),
    openedCount: 0,
    clickedCount: 0,
    ...req.body
  };
  // Math simulations
  if (newCamp.status === 'Sent') {
    newCamp.openedCount = Math.floor(newCamp.sentCount * (0.6 + Math.random() * 0.25));
    newCamp.clickedCount = Math.floor(newCamp.openedCount * (0.3 + Math.random() * 0.4));
  }
  database.campaigns.unshift(newCamp);
  res.json({ success: true, campaign: newCamp });
});

app.get("/api/tickets", (req, res) => {
  res.json(database.tickets);
});

app.post("/api/tickets", (req, res) => {
  const newTicket = {
    id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString().split('T')[0],
    status: 'Open',
    ...req.body
  };
  database.tickets.unshift(newTicket);
  res.json({ success: true, ticket: newTicket });
});

app.put("/api/tickets/:id", (req, res) => {
  const { status } = req.body;
  const ticket = database.tickets.find(t => t.id === req.params.id);
  if (ticket) {
    ticket.status = status;
    res.json({ success: true, ticket });
  } else {
    res.status(404).json({ error: "Ticket not found" });
  }
});

// Configure Vite or Static Asset Fallback
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    console.log("Vite development server attached to backend!");
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*all', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Kusum Fashion Server active at http://0.0.0.0:${PORT}`);
});
