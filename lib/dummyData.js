// Dummy data for AgroCare application — Corn Only

// Disease database for corn
export const diseases = {
  corn: [
    {
      id: 1,
      name: "Common Rust",
      severity: "Medium",
      symptoms: [
        "Small circular to elongate pustules",
        "Reddish-brown color",
        "Appears on both leaf surfaces",
        "Can cause premature drying"
      ],
      treatment: [
        "Apply fungicides containing mancozeb or pyraclostrobin",
        "Plant resistant hybrids",
        "Rotate crops and remove crop debris",
        "Monitor weather conditions"
      ],
      confidence: 92
    },
    {
      id: 2,
      name: "Gray Leaf Spot",
      severity: "High",
      symptoms: [
        "Rectangular gray to tan lesions",
        "Parallel to leaf veins",
        "Can coalesce and cover leaves",
        "Reduced grain yield"
      ],
      treatment: [
        "Use fungicides like azoxystrobin or propiconazole",
        "Practice crop rotation with non-host crops",
        "Improve air circulation by adjusting plant spacing",
        "Manage crop residue"
      ],
      confidence: 90
    },
    {
      id: 3,
      name: "Northern Leaf Blight",
      severity: "High",
      symptoms: [
        "Long cigar-shaped gray-green lesions",
        "Lesions turn tan or brown",
        "Reduced photosynthetic area",
        "Premature plant death possible"
      ],
      treatment: [
        "Apply foliar fungicides such as propiconazole or mancozeb",
        "Use resistant varieties",
        "Practice crop rotation",
        "Remove infected debris"
      ],
      confidence: 91
    },
    {
      id: 4,
      name: "Healthy",
      severity: "None",
      symptoms: ["No disease symptoms", "Vibrant green leaves", "Normal development"],
      treatment: ["Continue monitoring", "Maintain optimal growing conditions"],
      confidence: 95
    }
  ]
};

// Sample prediction history
export const sampleHistory = [
  {
    id: "pred_001",
    crop: "corn",
    disease: "Common Rust",
    confidence: 92,
    severity: "Medium",
    date: "2026-01-03T14:30:00",
    imageUrl: null
  },
  {
    id: "pred_002",
    crop: "corn",
    disease: "Gray Leaf Spot",
    confidence: 90,
    severity: "High",
    date: "2026-01-02T10:15:00",
    imageUrl: null
  },
  {
    id: "pred_003",
    crop: "corn",
    disease: "Healthy",
    confidence: 95,
    severity: "None",
    date: "2026-01-01T16:45:00",
    imageUrl: null
  },
  {
    id: "pred_004",
    crop: "corn",
    disease: "Northern Leaf Blight",
    confidence: 91,
    severity: "High",
    date: "2025-12-30T11:20:00",
    imageUrl: null
  }
];

// Dashboard statistics
export const dashboardStats = {
  totalScans: 247,
  diseasesDetected: 156,
  healthyScans: 91,
  accuracyRate: 95,
  recentScans: 12,
  criticalCases: 8
};

// User profile data
export const userProfile = {
  name: "John Farmer",
  email: "john.farmer@example.com",
  location: "Punjab, Pakistan",
  farmSize: "25 acres",
  primaryCrops: ["Corn"],
  joinedDate: "2025-06-15",
  totalScans: 247,
  avatarUrl: null
};

// Awareness content — Corn Only
export const awarenessContent = {
  corn: {
    commonDiseases: ["Common Rust", "Gray Leaf Spot", "Northern Leaf Blight"],
    preventionTips: [
      "Plant resistant hybrids suited to your region",
      "Rotate with non-host crops like soybeans",
      "Manage crop residue through tillage or decomposition",
      "Scout regularly and treat early",
      "Avoid planting too early in cool, wet conditions"
    ],
    bestPractices: [
      "Ensure proper plant population and spacing",
      "Use balanced nutrient management",
      "Control weeds to reduce humidity",
      "Monitor local disease forecasts",
      "Keep detailed field records"
    ]
  },
  general: {
    faqs: [
      {
        question: "How often should I scan my corn crops?",
        answer: "For best results, scan your corn crops weekly during the growing season, and more frequently if you notice any suspicious symptoms or during favorable disease conditions."
      },
      {
        question: "What image quality is needed for accurate detection?",
        answer: "Use clear, well-lit photos taken from 6-12 inches away. Ensure the leaf fills most of the frame and is in focus. Avoid shadows and blurry images."
      },
      {
        question: "What happens if I upload a non-corn image?",
        answer: "Our AI includes a validation model that checks whether the uploaded image is a valid corn leaf. If you upload an unrelated image, the system will prompt you to upload a valid corn image."
      },
      {
        question: "What diseases can AgroCare detect?",
        answer: "AgroCare can detect three major corn diseases: Common Rust, Gray Leaf Spot, and Northern Leaf Blight. It also identifies healthy corn leaves."
      },
      {
        question: "What should I do if a disease is detected?",
        answer: "First, verify the diagnosis by checking multiple leaves. Then, follow the recommended treatment plan. For severe cases, consult with a local agricultural extension officer."
      },
      {
        question: "How accurate is the disease detection?",
        answer: "Our system provides confidence scores with each prediction. Generally, predictions above 85% confidence are highly reliable, but always use your judgment and consult experts for critical decisions."
      }
    ]
  }
};

// Chart data
export const chartData = {
  cropDistribution: [
    { crop: "Corn", scans: 247, percentage: 100 }
  ],
  monthlyScans: [
    { month: "Jul", scans: 15 },
    { month: "Aug", scans: 28 },
    { month: "Sep", scans: 42 },
    { month: "Oct", scans: 51 },
    { month: "Nov", scans: 48 },
    { month: "Dec", scans: 63 }
  ],
  diseaseFrequency: [
    { disease: "Common Rust", count: 52 },
    { disease: "Gray Leaf Spot", count: 45 },
    { disease: "Northern Leaf Blight", count: 38 },
    { disease: "Healthy", count: 112 }
  ]
};
